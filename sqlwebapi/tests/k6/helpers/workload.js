import http from "k6/http";
import { check, sleep } from "k6";
import { apiUrl } from "./auth.js";

const resources = ["companies", "contacts", "deals", "tasks"];

export function thresholds(smoke = false) {
  const result = {
    checks: ["rate==1"],
    "http_req_failed{phase:workload}": [smoke ? "rate==0" : "rate<0.01"],
  };
  for (const resource of resources) {
    result[`http_req_duration{operation:${resource}}`] = ["p(95)<1000"];
  }
  return result;
}

// One iteration represents browsing four resource lists, with pauses between reads.
export function browse({ token }) {
  for (const resource of resources) {
    const response = http.get(`${apiUrl}/${resource}?first_row=0&last_row=24`, {
      headers: { Authorization: `Bearer ${token}` },
      tags: { operation: resource, phase: "workload" },
      timeout: "10s",
      redirects: 0,
    });
    check(response, {
      [`${resource}: HTTP 200`]: (r) => r.status === 200,
      [`${resource}: JSON array`]: (r) => {
        try {
          return Array.isArray(r.json());
        } catch {
          return false;
        }
      },
    });
    sleep(1);
  }
}
