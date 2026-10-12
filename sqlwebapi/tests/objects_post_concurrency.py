"""Exercise the real upload procedure using shared, temporary SQL objects.

Run with SQLCMDPASSWORD in the environment:
  python3 sqlwebapi/tests/objects_post_concurrency.py --server 127.0.0.1,1434

Only tempdb objects are created. No application tables or procedures are changed.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
import os
from pathlib import Path
import subprocess
import time
import uuid


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--server", required=True)
    parser.add_argument("--user", default="sa")
    parser.add_argument("--workers", type=int, default=12)
    args = parser.parse_args()
    if args.workers < 2:
        parser.error("at least two workers are required")
    if not os.environ.get("SQLCMDPASSWORD"):
        parser.error("set SQLCMDPASSWORD in the environment")

    prefix = "##crm_upload_test_" + uuid.uuid4().hex
    buckets, objects, proc = (prefix + suffix for suffix in ("_b", "_o", "_p"))
    command = [
        "sqlcmd", "-S", args.server, "-U", args.user, "-d", "tempdb",
        "-C", "-I", "-b", "-l", "10", "-t", "20", "-h", "-1", "-W",
    ]

    def query(sql):
        result = subprocess.run(
            command + ["-Q", "SET NOCOUNT ON; " + sql],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode:
            raise RuntimeError(result.stdout + result.stderr)
        return result.stdout.strip()

    source = (
        Path(__file__).resolve().parents[1]
        / "dbProj/DbProjAtomicCrm/StoredProcedures/crmapi.objects_post.sql"
    ).read_text()
    source = source.replace("[crmapi].[objects_post]", proc)
    source = source.replace("crm.buckets", buckets).replace("crm.objects", objects)
    setup = f"""
SET NOCOUNT ON;
CREATE TABLE {buckets} (
    tenant nvarchar(255) NOT NULL,
    bucket_id nvarchar(128) NOT NULL,
    is_public bit NOT NULL,
    PRIMARY KEY (tenant, bucket_id)
);
CREATE TABLE {objects} (
    tenant nvarchar(255) NOT NULL,
    bucket_id nvarchar(128) NOT NULL,
    object_path nvarchar(1024) NOT NULL,
    content_type nvarchar(255),
    sha256_hex char(64),
    bytes_length bigint NOT NULL,
    data varbinary(max) NOT NULL,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
{source}
GO
"""
    # Keep the creator connection alive so all worker connections can share
    # these global temporary objects. SQL Server drops them on disconnect.
    owner = subprocess.Popen(
        command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT, text=True,
    )
    try:
        owner.stdin.write(setup)
        owner.stdin.flush()
        deadline = time.monotonic() + 15
        while query(f"SELECT CASE WHEN OBJECT_ID('tempdb..{proc}') IS NULL THEN 0 ELSE 1 END") != "1":
            if owner.poll() is not None:
                raise RuntimeError(owner.stdout.read())
            if time.monotonic() > deadline:
                raise TimeoutError("Temporary procedure did not become ready")
            time.sleep(0.1)

        def upload(tenant):
            query(f"""EXEC {proc}
                @bucket_id=N'attachments', @object_path=N'same-filename.txt',
                @content_type=N'text/plain', @data=N'cGF5bG9hZA==',
                @auth_tenant=N'{tenant}';""")

        # Repeated first-upload races, followed by uploads to existing buckets.
        tenants = [f"tenant_{index}" for index in range(8)]
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            for tenant in tenants:
                list(pool.map(upload, [tenant] * args.workers))
            list(pool.map(upload, tenants))

        expected_objects = len(tenants) * (args.workers + 1)
        query(f"""
IF (SELECT COUNT(*) FROM {buckets}) <> {len(tenants)}
    THROW 50000, 'Expected exactly one bucket per tenant', 1;
IF (SELECT COUNT(*) FROM {objects}) <> {expected_objects}
    THROW 50000, 'Some uploads were lost', 1;
IF EXISTS (SELECT tenant FROM {objects} GROUP BY tenant HAVING COUNT(*) <> {args.workers + 1})
    THROW 50000, 'Uploads were assigned to the wrong tenant', 1;
IF EXISTS (SELECT 1 FROM {objects} WHERE data <> 0x7061796C6F6164 OR bytes_length <> 7)
    THROW 50000, 'Uploaded contents changed', 1;
IF EXISTS (SELECT 1 FROM {objects} o LEFT JOIN {buckets} b
    ON b.tenant=o.tenant AND b.bucket_id=o.bucket_id WHERE b.tenant IS NULL)
    THROW 50000, 'An object has no bucket', 1;
""")
        print(f"PASS: {expected_objects} uploads, {args.workers} concurrent workers, {len(tenants)} tenant buckets")
    finally:
        try:
            owner.communicate("QUIT\n", timeout=5)
        except (subprocess.TimeoutExpired, BrokenPipeError):
            owner.kill()
            owner.communicate()


if __name__ == "__main__":
    main()
