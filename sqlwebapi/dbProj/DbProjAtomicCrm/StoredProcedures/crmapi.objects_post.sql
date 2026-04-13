CREATE PROCEDURE [crmapi].[objects_post]
    @bucket_id NVARCHAR(128),
    @object_path NVARCHAR(1024),
    @content_type NVARCHAR(255) = NULL,
    @sha256_hex CHAR(64) = NULL,
    @data NVARCHAR(MAX),
    @auth_tenant NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @bin VARBINARY(MAX);
    SET @bin = CAST(N'' AS XML).value('xs:base64Binary(sql:variable("@data"))', 'VARBINARY(MAX)');

    IF NOT EXISTS (
        SELECT 1
        FROM crm.buckets
        WHERE tenant = @auth_tenant
          AND bucket_id = @bucket_id
    )
    BEGIN
        INSERT INTO crm.buckets (tenant, bucket_id, is_public)
        VALUES (@auth_tenant, @bucket_id, 0);
    END

    DECLARE @bytes_length BIGINT = DATALENGTH(@bin);

    SELECT @object_path = LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 12);

    INSERT INTO crm.objects (tenant, bucket_id, object_path, content_type, sha256_hex, bytes_length, data)
    VALUES (@auth_tenant, @bucket_id, @object_path, @content_type, @sha256_hex, @bytes_length, @bin);

    SELECT
        bucket_id,
        object_path,
        content_type,
        bytes_length,
        sha256_hex,
        created_at,
        updated_at
    FROM crm.objects
    WHERE tenant = @auth_tenant
      AND bucket_id = @bucket_id
      AND object_path = @object_path;
END
