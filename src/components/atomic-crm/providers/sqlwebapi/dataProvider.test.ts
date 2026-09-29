import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { dataProvider as sqlWebApiDataProvider } from "./dataProvider";

let dataProvider: typeof sqlWebApiDataProvider;

describe("SQLWebAPI deletion", () => {
  beforeEach(async () => {
    vi.stubGlobal("__APP_CONFIG__", {
      VITE_SQLWEBAPI_URL: "http://localhost:8081",
      VITE_SQLWEBAPI_SERVICE: "crmapi",
    });
    ({ dataProvider } = await import("./dataProvider"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the deleted tenant when the server returns no content", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const previousData = { id: "example", name: "example", active: false };

    await expect(
      dataProvider.delete("tenants", { id: "example", previousData }),
    ).resolves.toEqual({ data: previousData });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:8081/crmapi/tenants/example",
    );
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("returns an ID without previous data for a no-content response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    await expect(
      dataProvider.delete("tenants", { id: "example" }),
    ).resolves.toEqual({
      data: { id: "example" },
    });
  });

  it("returns all IDs for bulk deletion with no-content responses", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(null, { status: 204 })),
      );
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      dataProvider.deleteMany("tenants", { ids: ["first", "second"] }),
    ).resolves.toEqual({
      data: ["first", "second"],
    });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "http://localhost:8081/crmapi/tenants/first",
      "http://localhost:8081/crmapi/tenants/second",
    ]);
  });

  it("preserves records returned by the server", async () => {
    const record = { id: "example", name: "example" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(record)));
    await expect(
      dataProvider.delete("tenants", { id: "example" }),
    ).resolves.toEqual({ data: record });
  });

  it.each(["delete", "deleteMany"] as const)(
    "propagates server errors from %s",
    async (method) => {
      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValue(
            Response.json(
              {
                message: "Tenant must be deactivated before it can be deleted.",
              },
              { status: 409 },
            ),
          ),
      );
      const result =
        method === "delete"
          ? dataProvider.delete("tenants", { id: "example" })
          : dataProvider.deleteMany("tenants", { ids: ["example"] });
      await expect(result).rejects.toMatchObject({
        status: 409,
        message: "Tenant must be deactivated before it can be deleted.",
      });
    },
  );
});
