import { login } from "./helpers/auth.js";
import { browse, thresholds } from "./helpers/workload.js";

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: thresholds(true),
};

export const setup = login;
export default browse;
