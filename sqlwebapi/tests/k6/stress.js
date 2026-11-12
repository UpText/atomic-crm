import { login } from "./helpers/auth.js";
import { browse, thresholds } from "./helpers/workload.js";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "2m", target: 200 },
    { duration: "1m", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "30s", target: 0 },
  ],
  thresholds: thresholds(),
};

export const setup = login;
export default browse;
