import { describe, expect, it } from "vitest";

import { isTokenExpired } from "./token";

const encodeBase64Url = (value: string) =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const createToken = (payload: Record<string, unknown>) =>
  [
    encodeBase64Url(JSON.stringify({ alg: "none", typ: "JWT" })),
    encodeBase64Url(JSON.stringify(payload)),
    "signature",
  ].join(".");

describe("SQLWebAPI token validation", () => {
  it("treats missing tokens as expired", () => {
    expect(isTokenExpired(null)).toBe(true);
  });

  it("treats malformed tokens as expired", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
  });

  it("treats tokens without an expiration as expired", () => {
    expect(isTokenExpired(createToken({ sub: "1" }))).toBe(true);
  });

  it("treats past-expiration tokens as expired", () => {
    expect(isTokenExpired(createToken({ exp: 1 }))).toBe(true);
  });

  it("accepts tokens with a future expiration", () => {
    const futureExpiration = Math.floor(Date.now() / 1000) + 60;

    expect(isTokenExpired(createToken({ exp: futureExpiration }))).toBe(false);
  });
});
