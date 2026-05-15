import { describe, expect, it, vi } from "vitest";

import { embedFileSrcForExport } from "./useExportToJson";

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

    await expect(embedFileSrcForExport("https://example.com/logo.png")).resolves.toBe(
      "data:image/png;base64,bG9nby1ieXRlcw==",
    );
  });

  it("falls back to the original src when fetching fails", async () => {
    const src = "https://example.com/logo.png";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    await expect(embedFileSrcForExport(src)).resolves.toBe(src);
  });
});
