# SQLWebAPI k6 tests

These read-only API tests target `http://localhost:5092/crmapi` by default.
The frontend at `http://localhost:5173` does not need to be running.
Run commands below from the repository root.

## Install

On macOS:

```bash
brew install k6
k6 version
```

No npm packages or browser binaries are needed. See the
[official installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/).

## Configure login

Start the API and SQL Server, then supply an existing CRM user's credentials
and tenant. The user must have access to companies, contacts, deals, and tasks.
For zsh (the default macOS shell), enter the password without echoing it:

```bash
export USERNAME="your-email@example.com"
export TENANT="your-tenant"
read -s "PASSWORD?Password: "
export PASSWORD
```

Credentials are read from the environment; do not commit them. k6 does not
automatically load `.env` files. Avoid HTTP debug output, which can expose tokens
and credentials.

| Variable | Default | Meaning |
| --- | --- | --- |
| `API_URL` | `http://localhost:5092/crmapi` | Full service URL, including `/crmapi` |
| `USERNAME` | Required | Login username/email |
| `PASSWORD` | Required | Login password |
| `TENANT` | Required | Tenant identifier used at login |

For a different API path or port:

```bash
export API_URL="http://localhost:5092/crmapi"
```

## Run

Start with the smoke test:

```bash
k6 run sqlwebapi/tests/k6/smoke.js
```

Then run a steady load or gradual stress test:

```bash
k6 run sqlwebapi/tests/k6/load.js
k6 run sqlwebapi/tests/k6/stress.js
```

| Script | Workload |
| --- | --- |
| `smoke.js` | One virtual user, one iteration (four list requests) |
| `load.js` | Ten virtual users for one minute |
| `stress.js` | Ramp to 10 users in 30s, 50 in 1m, 100 in 1m, 200 in 1m; hold 200 for 2m; ramp to 10 in 1m, hold 10 for 1m, then zero in 30s |

The stress schedule lasts 8m, plus setup and any graceful completion time.
It is an initial stress profile; increase its targets if it does not exceed your
expected load. Use a controlled test environment for heavier runs.

Override the steady load without editing files:

```bash
k6 run --vus 20 --duration 2m sqlwebapi/tests/k6/load.js
```

To save a JSON summary outside the repository:

```bash
k6 run --summary-export /tmp/crm-k6-summary.json sqlwebapi/tests/k6/load.js
```

## What is tested

`helpers/auth.js` logs in once during `setup()` using a JSON POST to `/login`.
It supports the app's plain-text token response, a JSON string, and the token
object fields supported by the frontend. A failed login stops setup. All virtual
users share that account and token; login throughput, token refresh, and
multi-user/tenant isolation are not measured. Use a token lifetime longer than
the run.

`helpers/workload.js` requests `/companies`, `/contacts`, `/deals`, and `/tasks`
sequentially, each with `first_row=0&last_row=24` and a one-second pause afterward.
It checks HTTP 200 and a JSON array. Empty arrays are accepted. No CRM records
are created, changed, or deleted. Use realistic seeded data to measure meaningful
database performance; these tests do not verify full CRUD workflows.

Virtual users are concurrent simulated users, not requests per second. Throughput
depends on response times and the pauses. Requests time out after ten seconds;
redirects are disabled so routing mistakes do not silently pass.

## Results and pass/fail criteria

- Every status and JSON-array check must pass.
- Smoke allows no HTTP workload failures; load/stress require less than 1%.
- Each resource's p95 request duration must be below 1,000 ms.
- Login timing is excluded from workload duration/error thresholds.

The strict check threshold means any unexpected status or response shape fails
the run, even when the HTTP failure rate is below 1%. Latency limits are initial
targets, not measured guarantees; adjust `thresholds()` in `helpers/workload.js`
after establishing a baseline. Failed thresholds produce a nonzero exit status.
See [k6 thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).

Watch `http_req_duration` (especially per-resource p95), `http_req_failed`,
`checks`, and request throughput alongside API logs and SQL Server CPU,
blocking, deadlocks, and connection usage. Running k6 and the backend on the same
machine means they compete for resources. Check that performance recovers during
the stress ramp down; the overall thresholds alone do not prove recovery.

If setup fails, check the service URL, credentials, tenant, and API logs. If a
JSON-array check fails, inspect the endpoint's response manually; valid JSON
error objects should not pass as successful lists.

When finished:

```bash
unset PASSWORD
```
