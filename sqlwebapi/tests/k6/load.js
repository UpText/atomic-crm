import { login } from "./helpers/auth.js";
import { browse, thresholds } from "./helpers/workload.js";

export const options = {
  vus: 10,
  duration: "1m",
  thresholds: thresholds(),
};

export const setup = login;
export default browse;
