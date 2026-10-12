vi.mock("../providers/sqlwebapi/runtimeConfig", () => ({
  hasSqlWebApiUrl: () => true,
}));

import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "vitest-browser-react";
import type * as RaCore from "ra-core";
import { useProfileLanguage } from "./useProfileLanguage";

const { salesUpdate, notify } = vi.hoisted(() => ({
  salesUpdate: vi.fn(),
  notify: vi.fn(),
}));
vi.mock("ra-core", async (importOriginal) => {
  const { useState } = await import("react");
  return {
    ...(await importOriginal<typeof RaCore>()),
    useDataProvider: () => ({ salesUpdate }),
    useGetIdentity: () => ({ identity: { id: 42 } }),
    useNotify: () => notify,
    useLocaleState: () => useState("en"),
  };
});

function Harness() {
  const { locale, setLocale, isPending } = useProfileLanguage();
  return (
    <button disabled={isPending} onClick={() => setLocale("nb")}>
      {locale}
    </button>
  );
}
beforeEach(() => vi.resetAllMocks());

describe("saving the profile language", () => {
  it("applies immediately, sends only the language field, and refreshes profile queries", async () => {
    let finish!: () => void;
    salesUpdate.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const queryClient = new QueryClient();
    queryClient.setQueryData(["auth", "getIdentity"], { id: 42 });
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    );
    await screen.getByRole("button", { name: "en" }).click();
    await expect
      .element(screen.getByRole("button", { name: "nb" }))
      .toBeDisabled();
    expect(salesUpdate).toHaveBeenCalledWith(42, { language: "nb" });
    finish();
    await expect
      .element(screen.getByRole("button", { name: "nb" }))
      .toBeEnabled();
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["sales"] });
    expect(notify).not.toHaveBeenCalled();
  });

  it("restores the previous language and reports a failed save", async () => {
    salesUpdate.mockRejectedValue(new Error("Save failed"));
    const queryClient = new QueryClient();
    queryClient.setQueryData(["auth", "getIdentity"], { id: 42 });
    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    );
    await screen.getByRole("button", { name: "en" }).click();
    await expect
      .element(screen.getByRole("button", { name: "en" }))
      .toBeEnabled();
    await vi.waitFor(() =>
      expect(notify).toHaveBeenCalledWith("crm.profile.update_error", {
        type: "error",
      }),
    );
  });
  it("does not roll back another user's language when an old save fails", async () => {
    let fail!: (error: Error) => void;
    salesUpdate.mockImplementation(
      () =>
        new Promise<void>((_resolve, reject) => {
          fail = reject;
        }),
    );
    const queryClient = new QueryClient();
    queryClient.setQueryData(["auth", "getIdentity"], { id: 42 });
    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    );
    await screen.getByRole("button", { name: "en" }).click();
    await expect
      .element(screen.getByRole("button", { name: "nb" }))
      .toBeDisabled();
    queryClient.setQueryData(["auth", "getIdentity"], { id: 99 });
    fail(new Error("Old save failed"));
    await expect
      .element(screen.getByRole("button", { name: "nb" }))
      .toBeEnabled();
    expect(notify).not.toHaveBeenCalled();
  });
});
