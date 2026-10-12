import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { dataProvider as sqlWebApiDataProvider } from "./dataProvider";
import { createImportedFile } from "../../misc/portableFiles";

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

  it.each(["create", "update"] as const)(
    "serializes contact emails and phones for %s without changing the form data",
    async (method) => {
      const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: 42 }));
      vi.stubGlobal("fetch", fetchMock);
      const data = {
        email_jsonb: [{ email: "contact@example.com", type: "Work" }],
        phone_jsonb: [{ number: "+4712345678", type: "Work" }],
        avatar: { src: "https://example.com/avatar.png" },
      };
      if (method === "create") {
        await dataProvider.create("contacts", { data });
      } else {
        await dataProvider.update("contacts", {
          id: 42,
          data,
          previousData: { id: 42 },
        });
      }
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      const emailKey = method === "create" ? "emails_jsonb" : "email_jsonb";
      const phoneKey = method === "create" ? "phones_jsonb" : "phone_jsonb";
      expect(JSON.parse(body[emailKey])).toEqual(data.email_jsonb);
      expect(JSON.parse(body[phoneKey])).toEqual(data.phone_jsonb);
      expect(
        body[method === "create" ? "email_jsonb" : "emails_jsonb"],
      ).toBeUndefined();
      expect(Array.isArray(data.email_jsonb)).toBe(true);
    },
  );

  it("preserves explicitly empty contact fields on update", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: 42 }));
    vi.stubGlobal("fetch", fetchMock);
    await dataProvider.update("contacts", {
      id: 42,
      data: { email_jsonb: [], phone_jsonb: [] },
      previousData: { id: 42 },
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      email_jsonb: "[]",
      phone_jsonb: "[]",
    });
  });

  it("preserves migration logo bytes while ordinary uploads still trim whitespace", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 3;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "red";
    context.fillRect(1, 1, 1, 1);
    const src = canvas.toDataURL("image/png");
    const logo = await createImportedFile(src, "Logo.png");
    const fetchMock = vi
      .fn()
      .mockImplementation(async (url) =>
        Response.json(
          String(url).endsWith("/objects")
            ? { id: "file", object_path: "new-logo" }
            : { id: 42 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    await dataProvider.create("companies", {
      data: { name: "Imported", logo },
    });
    const importedBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(importedBody.data).toBe(src.split(",")[1]);
    const rawFile = new File([await logo.rawFile!.arrayBuffer()], "Logo.png", {
      type: "image/png",
    });
    await dataProvider.create("companies", {
      data: { name: "Ordinary", logo: { src, title: "Logo.png", rawFile } },
    });
    const ordinaryBody = JSON.parse(fetchMock.mock.calls[2][1].body);
    expect(ordinaryBody.data).not.toBe(importedBody.data);
  });

  it("creates imported salespeople with unique passwords and returns their record for ID mapping", async () => {
    const sale = {
      id: 501,
      email: "owner@example.com",
      first_name: "Owner",
      last_name: "Test",
      administrator: false,
      disabled: false,
    };
    const fetchMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve(Response.json(sale)));
    vi.stubGlobal("fetch", fetchMock);

    await expect(dataProvider.salesCreate(sale)).resolves.toEqual(sale);
    await dataProvider.salesCreate(sale);
    const bodies = fetchMock.mock.calls.map(([, options]) =>
      JSON.parse(options.body),
    );
    expect(bodies[0].password).toMatch(/^Aa1![a-f0-9]{64}$/);
    expect(bodies[1].password).not.toBe(bodies[0].password);
    expect(bodies[0]).toMatchObject({ administrator: false, disabled: false });
    expect(sale).not.toHaveProperty("password");
  });

  it("preserves an explicitly supplied salesperson password", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: 502 }));
    vi.stubGlobal("fetch", fetchMock);
    await dataProvider.salesCreate({
      email: "owner@example.com",
      first_name: "Owner",
      last_name: "Test",
      administrator: false,
      disabled: false,
      password: "Supplied-password!42",
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).password).toBe(
      "Supplied-password!42",
    );
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
        vi.fn().mockResolvedValue(
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
  it.each(["contact_notes", "deal_notes", "contacts"])(
    "uploads imported files before creating %s",
    async (resource) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ id: "file", object_path: "destination-file" }),
            { status: 200 },
          ),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 42 }), { status: 200 }),
        );
      vi.stubGlobal("fetch", fetchMock);
      const file = {
        src: "data:application/pdf;base64,cHJvcG9zYWw=",
        title: "Proposal.pdf",
        rawFile: new File(["proposal"], "Proposal.pdf", {
          type: "application/pdf",
        }),
      };
      await dataProvider.create(resource, {
        data:
          resource === "contacts"
            ? { first_name: "New", last_name: "Contact", avatar: file }
            : { text: "Note", attachments: [file] },
      });
      expect(fetchMock.mock.calls[0][0]).toBe(
        "http://localhost:8081/crmapi/objects",
      );
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).data).toBe(
        "cHJvcG9zYWw=",
      );
      const payload = JSON.parse(fetchMock.mock.calls[1][1].body);
      const src =
        resource === "contacts"
          ? payload.avatar_src
          : payload.attachments[0].src;
      expect(src).toBe(
        "http://localhost:8081/crmapi/objects/attachments?object_path=destination-file",
      );
      expect(payload.tenant).toBeUndefined();
    },
  );
});
