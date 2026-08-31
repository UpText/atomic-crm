import { describe, expect, it, vi } from "vitest";

import {
  embedFileSrcForExport,
  getDealContactIdsForExport,
  getNoteAttachmentsForExport,
  getSalesIdForExport,
} from "./useExportToJson";

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

  it("falls back to the original src when fetching fails", async () => {
    const src = "https://example.com/logo.png";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error")),
    );

    await expect(embedFileSrcForExport(src)).resolves.toBe(src);
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
  it("exports note attachment urls and names", () => {
    expect(
      getNoteAttachmentsForExport([
        { src: "https://example.com/a.pdf", title: "Proposal.pdf" },
      ]),
    ).toEqual([{ url: "https://example.com/a.pdf", name: "Proposal.pdf" }]);
  });

  it("drops attachments without src and falls back to path for the name", () => {
    expect(
      getNoteAttachmentsForExport([
        { title: "Missing source" },
        { src: "https://example.com/b.pdf", path: "uploads/b.pdf" },
      ]),
    ).toEqual([{ url: "https://example.com/b.pdf", name: "uploads/b.pdf" }]);
  });
});
