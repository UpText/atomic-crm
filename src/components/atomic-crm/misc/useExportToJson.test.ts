import { afterEach, describe, expect, it, vi } from "vitest";

import {
  embedFileSrcForExport,
  getDealContactIdsForExport,
  getNoteAttachmentsForExport,
  getSalesIdForExport,
} from "./useExportToJson";

afterEach(() => vi.unstubAllGlobals());

describe("embedFileSrcForExport", () => {
  it("returns data urls unchanged", async () => {
    const src = "data:image/png;base64,abc123";

    await expect(embedFileSrcForExport(src)).resolves.toBe(src);
  });

  it("embeds fetched images as data urls", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => new Blob(["logo-bytes"], { type: "image/png" }),
      }),
    );

    await expect(
      embedFileSrcForExport("https://example.com/logo.png"),
    ).resolves.toBe("data:image/png;base64,bG9nby1ieXRlcw==");
  });

  it("rejects an incomplete export when fetching fails", async () => {
    const src = "https://example.com/logo.png";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error")),
    );

    await expect(embedFileSrcForExport(src)).rejects.toThrow(
      "Export incomplete",
    );
  });
});

describe("getDealContactIdsForExport", () => {
  it("returns an empty array when a deal has no contact_ids", () => {
    expect(getDealContactIdsForExport({})).toEqual([]);
  });

  it("returns the existing contact_ids when present", () => {
    expect(getDealContactIdsForExport({ contact_ids: [1, 2] })).toEqual([1, 2]);
  });
});

describe("getSalesIdForExport", () => {
  it("returns the exported sales id when the original sales id is known", () => {
    expect(getSalesIdForExport(12, new Map([[12, 1]]), 2)).toBe(1);
  });

  it("falls back when the original sales id is missing or unknown", () => {
    const salesIdMap = new Map([[12, 1]]);

    expect(getSalesIdForExport(null, salesIdMap, 2)).toBe(2);
    expect(getSalesIdForExport(99, salesIdMap, 2)).toBe(2);
  });
});

describe("getNoteAttachmentsForExport", () => {
  it("embeds attachment bytes and preserves names", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("proposal", {
            headers: { "Content-Type": "application/pdf" },
          }),
        ),
    );
    await expect(
      getNoteAttachmentsForExport([
        { src: "https://source.example/a.pdf", title: "Proposal.pdf" },
      ]),
    ).resolves.toEqual([
      { url: "data:application/pdf;base64,cHJvcG9zYWw=", name: "Proposal.pdf" },
    ]);
  });
  it("rejects attachments without a source", async () => {
    await expect(
      getNoteAttachmentsForExport([{ title: "Missing.pdf" }]),
    ).rejects.toThrow("Missing.pdf");
  });
  it("rejects HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );
    await expect(
      embedFileSrcForExport("https://source.example/missing"),
    ).rejects.toThrow("Export incomplete");
  });
});
