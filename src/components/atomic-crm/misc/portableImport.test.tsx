import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type * as RaCore from "ra-core";
import type * as ConfigurationContext from "../root/ConfigurationContext";
import { render } from "vitest-browser-react";
import { useExportToJson } from "./useExportToJson";
import { useImportFromJson } from "./useImportFromJson";
import { defaultConfiguration } from "../root/defaultConfiguration";

const { provider } = vi.hoisted(() => ({
  provider: {
    getList: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    salesCreate: vi.fn(),
    updateConfiguration: vi.fn(),
    getConfiguration: vi.fn(),
  },
}));
vi.mock("ra-core", async (importOriginal) => ({
  ...(await importOriginal<typeof RaCore>()),
  useDataProvider: () => provider,
  useGetIdentity: () => ({ data: { id: 900 }, identity: { id: 900 } }),
  useRefresh: () => () => {},
  useEvent: (fn: unknown) => fn,
}));
vi.mock("../root/ConfigurationContext", async (importOriginal) => ({
  ...(await importOriginal<typeof ConfigurationContext>()),
  useConfigurationContext: () => defaultConfiguration,
  useConfigurationUpdater: () => () => {},
}));
let api: ReturnType<typeof useImportFromJson>;
let exportApi: ReturnType<typeof useExportToJson>;
function Harness() {
  api = useImportFromJson();
  exportApi = useExportToJson();
  return null;
}
beforeEach(() => {
  vi.resetAllMocks();
});
afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("portable tenant import", () => {
  it("preserves exported size categories and all mapped owners", async () => {
    provider.getList.mockResolvedValue({ data: [], total: 0 });
    provider.salesCreate.mockResolvedValue({ id: 501 });
    let nextId = 100;
    provider.create.mockImplementation(async (_resource, params) => ({
      data: { ...params.data, id: ++nextId },
    }));
    await render(<Harness />);
    await api[1](
      new File(
        [
          JSON.stringify({
            format_version: 2,
            sales: [
              {
                id: 1,
                email: "owner@example.com",
                first_name: "Owner",
                last_name: "Test",
              },
            ],
            companies: [1, 10, 50, 250, 500].map((size, i) => ({
              id: i + 1,
              name: `Company ${i}`,
              size,
              sales_id: 1,
            })),
            contacts: [
              {
                id: 1,
                first_name: "A",
                last_name: "B",
                company_id: 1,
                sales_id: 1,
              },
            ],
            deals: [
              {
                id: 1,
                name: "Deal",
                company_id: 1,
                contact_ids: [1],
                sales_id: 1,
                stage: "won",
                amount: 10,
                created_at: "2025-12-28T09:37:39",
                updated_at: "2026-02-24T18:11:37",
                archived_at: "2026-03-01T12:00:00",
              },
            ],
            notes: [
              { contact_id: 1, sales_id: 1, text: "Note", date: "2026-01-01" },
            ],
            deal_notes: [
              {
                deal_id: 1,
                sales_id: 1,
                text: "Deal note",
                date: "2026-01-01",
              },
            ],
            tasks: [{ contact_id: 1, sales_id: 1, text: "Call" }],
          }),
        ],
        "export.json",
      ),
    );
    expect(
      provider.create.mock.calls
        .filter(([r]) => r === "companies")
        .map(([, p]) => p.data.size),
    ).toEqual([1, 10, 50, 250, 500]);
    for (const [, params] of provider.create.mock.calls)
      expect(params.data.sales_id).toBe(501);
    expect(
      provider.create.mock.calls.find(([resource]) => resource === "deals")![1]
        .data,
    ).toMatchObject({
      created_at: "2025-12-28T09:37:39",
      updated_at: "2026-02-24T18:11:37",
      archived_at: "2026-03-01T12:00:00",
    });
    await expect.poll(() => api[0].status).toBe("success");
  });

  it("stops before dependent records when salesperson creation fails", async () => {
    provider.getList.mockResolvedValue({ data: [], total: 0 });
    provider.salesCreate.mockRejectedValue(new Error("Sales creation failed"));
    await render(<Harness />);
    await api[1](
      new File(
        [
          JSON.stringify({
            format_version: 2,
            sales: [
              {
                id: 1,
                email: "owner@example.com",
                first_name: "Owner",
                last_name: "Test",
              },
            ],
            companies: [{ id: 1, name: "Acme", sales_id: 1 }],
          }),
        ],
        "export.json",
      ),
    );
    expect(provider.create).not.toHaveBeenCalled();
    await expect.poll(() => api[0].status).toBe("error");
    expect(api[0].failedImports.sales).toHaveLength(1);
  });

  it.each(["companies", "contacts", "deals", "notes", "deal_notes", "tasks"])(
    "rejects unmapped owners in %s instead of assigning the current user",
    async (resource) => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const records = {
        companies: { id: 1, name: "Acme", sales_id: 99 },
        contacts: { id: 1, first_name: "A", last_name: "B", sales_id: 99 },
        deals: {
          id: 1,
          name: "Deal",
          company_id: 1,
          contact_ids: [],
          sales_id: 99,
          stage: "won",
          amount: 10,
        },
        notes: {
          contact_id: 1,
          sales_id: 99,
          text: "Note",
          date: "2026-01-01",
        },
        deal_notes: {
          deal_id: 1,
          sales_id: 99,
          text: "Note",
          date: "2026-01-01",
        },
        tasks: { contact_id: 1, sales_id: 99, text: "Call" },
      };
      await render(<Harness />);
      await api[1](
        new File(
          [
            JSON.stringify({
              format_version: 2,
              [resource]: [records[resource as keyof typeof records]],
            }),
          ],
          "export.json",
        ),
      );
      expect(provider.create).not.toHaveBeenCalled();
      await expect.poll(() => api[0].status).toBe("error");
    },
  );

  it("restores default branding from early v2 exports with empty logo settings", async () => {
    await render(<Harness />);
    await api[1](
      new File(
        [
          JSON.stringify({
            format_version: 2,
            configuration: {
              title: "Demo CRM",
              lightModeLogo: "",
              darkModeLogo: "",
            },
          }),
        ],
        "export.json",
      ),
    );
    expect(provider.updateConfiguration).toHaveBeenCalledWith({
      ...defaultConfiguration,
      title: "Demo CRM",
    });
  });

  it("exports effective defaults when the database only stores a title", async () => {
    provider.getList.mockResolvedValue({ data: [], total: 0 });
    provider.getConfiguration.mockResolvedValue({ title: "Demo CRM" });
    const fetchMock = vi.fn().mockImplementation(
      async () =>
        new Response("<svg/>", {
          headers: { "Content-Type": "image/svg+xml" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    let exported: Blob | undefined;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      exported = blob as Blob;
      return "blob:export";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    await render(<Harness />);
    await exportApi[1]();
    const config = JSON.parse(await exported!.text()).configuration;
    expect(config.title).toBe("Demo CRM");
    expect(config.companySectors).toEqual(defaultConfiguration.companySectors);
    for (const key of ["lightModeLogo", "darkModeLogo"] as const) {
      expect(config[key]).toMatch(/^data:image\/svg\+xml[;,]/);
      if (defaultConfiguration[key].startsWith("data:")) {
        expect(config[key]).toBe(defaultConfiguration[key]);
      } else {
        expect(fetchMock).toHaveBeenCalledWith(defaultConfiguration[key]);
      }
    }
  });

  it("uploads embedded files and remaps relationships without collapsing equal names", async () => {
    let nextId = 100;
    provider.getList.mockResolvedValue({ data: [], total: 0 });
    provider.salesCreate.mockResolvedValue({ id: 501 });
    provider.update.mockResolvedValue({ data: { id: 501 } });
    provider.create.mockImplementation(async (_resource, params) => ({
      data: { ...params.data, id: ++nextId },
    }));
    const embedded = "data:application/pdf;base64,cHJvcG9zYWw=";
    const file = new File(
      [
        JSON.stringify({
          format_version: 2,
          configuration: {
            ...defaultConfiguration,
            companySectors: [{ value: "custom", label: "Custom" }],
          },
          sales: [
            {
              id: 1,
              email: "owner@example.com",
              first_name: "Owner",
              last_name: "Test",
              avatar: embedded,
            },
          ],
          companies: [
            {
              id: 1,
              name: "Acme",
              sector: "custom",
              logo_src: embedded,
              logo_path: "old-path",
            },
          ],
          contacts: [1, 2].map((id) => ({
            id,
            first_name: "Same",
            last_name: "Name",
            company_id: 1,
            sales_id: 1,
            avatar: embedded,
          })),
          deals: [
            {
              id: 1,
              sales_id: 1,
              company_id: 1,
              contact_ids: [1, 2],
              name: "Deal",
              stage: "new",
              amount: 10,
            },
          ],
          notes: [
            {
              contact_id: 1,
              sales_id: 1,
              text: "Contact note",
              date: "2026-01-01",
              attachments: [{ url: embedded, name: "Contact.pdf" }],
            },
          ],
          deal_notes: [
            {
              deal_id: 1,
              sales_id: 1,
              text: "Deal note",
              date: "2026-01-01",
              attachments: [{ url: embedded, name: "Deal.pdf" }],
            },
          ],
          tasks: [{ contact_id: 2, sales_id: 1, text: "Call" }],
        }),
      ],
      "export.json",
    );
    await render(<Harness />);
    await api[1](file);
    const creations = provider.create.mock.calls;
    const dataFor = (resource: string) =>
      creations
        .filter(([name]) => name === resource)
        .map(([, params]) => params.data);
    expect(dataFor("contacts")).toHaveLength(2);
    expect(dataFor("contacts")[0].company_id).toBe(101);
    expect(dataFor("deals")[0].contact_ids).toEqual([102, 103]);
    expect(dataFor("contact_notes")[0].contact_id).toBe(102);
    expect(dataFor("deal_notes")[0].deal_id).toBe(104);
    expect(dataFor("tasks")[0].contact_id).toBe(103);
    expect(dataFor("deal_notes")[0].sales_id).toBe(501);
    for (const file of [
      dataFor("companies")[0].logo,
      dataFor("contacts")[0].avatar,
      dataFor("contact_notes")[0].attachments[0],
      dataFor("deal_notes")[0].attachments[0],
      provider.update.mock.calls[0][1].data.avatar,
    ]) {
      expect(file.rawFile).toBeInstanceOf(File);
      expect(await file.rawFile.text()).toBe("proposal");
      expect(file.path).toBeUndefined();
    }
    expect(provider.updateConfiguration).toHaveBeenCalledOnce();
    await expect.poll(() => api[0].stats.deal_notes).toBe(1);
    expect(api[0].failedImports.deal_notes).toEqual([]);
    expect(JSON.stringify(creations)).not.toContain('"tenant"');
  });
  it("round-trips an exported attachment after the source installation is unavailable", async () => {
    const sourceRecords: Record<string, unknown[]> = {
      sales: [
        {
          id: 900,
          email: "owner@example.com",
          first_name: "Owner",
          last_name: "Test",
        },
      ],
      companies: [{ id: 20, name: "Acme", sales_id: 900 }],
      contacts: [
        {
          id: 30,
          first_name: "A",
          last_name: "B",
          sales_id: 900,
          company_id: 20,
          tags: [],
        },
      ],
      deals: [
        {
          id: 40,
          name: "Deal",
          company_id: 20,
          sales_id: 900,
          contact_ids: [30],
          stage: "new",
          amount: 50,
        },
      ],
      contact_notes: [
        {
          id: 50,
          contact_id: 30,
          sales_id: 900,
          text: "Note",
          date: "2026-01-01",
          attachments: [
            {
              src: "https://old-installation.example/file",
              title: "Proposal.pdf",
            },
          ],
        },
      ],
      deal_notes: [
        {
          id: 60,
          deal_id: 40,
          sales_id: 900,
          text: "Deal note",
          date: "2026-01-01",
          attachments: [
            {
              src: "https://old-installation.example/file",
              title: "Proposal.pdf",
            },
          ],
        },
      ],
      tasks: [],
      tags: [],
    };
    provider.getList.mockImplementation(async (resource) => ({
      data: sourceRecords[resource],
      total: sourceRecords[resource].length,
    }));
    provider.getConfiguration.mockResolvedValue({
      ...defaultConfiguration,
      lightModeLogo: "",
      darkModeLogo: "",
    });
    const nativeFetch = globalThis.fetch;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("proposal", {
          headers: { "Content-Type": "application/pdf" },
        }),
      ),
    );
    // Each download needs an independent response body.
    vi.mocked(fetch).mockImplementation(
      async () =>
        new Response("proposal", {
          headers: { "Content-Type": "application/pdf" },
        }),
    );
    let exported: Blob | undefined;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      exported = blob as Blob;
      return "blob:export";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    await render(<Harness />);
    await exportApi[1]();
    const json = await exported!.text();
    expect(json).not.toContain("old-installation.example");
    expect(JSON.parse(json).deal_notes[0].attachments[0].url).toBe(
      "data:application/pdf;base64,cHJvcG9zYWw=",
    );
    const destinationFetch = vi.fn(async (url: RequestInfo | URL) => {
      if (!String(url).startsWith("data:"))
        throw new Error("Source installation deleted");
      return nativeFetch(url);
    });
    vi.stubGlobal("fetch", destinationFetch);
    provider.getList.mockResolvedValue({ data: [{ id: 901 }], total: 1 });
    let nextId = 1000;
    provider.create.mockImplementation(async (_resource, params) => ({
      data: { ...params.data, id: ++nextId },
    }));
    await api[1](new File([json], "migration.json"));
    const dealNote = provider.create.mock.calls.find(
      ([resource]) => resource === "deal_notes",
    )![1].data;
    expect(dealNote.deal_id).toBe(1003);
    expect(await dealNote.attachments[0].rawFile.text()).toBe("proposal");
    await expect.poll(() => api[0].status).toBe("success");
  });
});
