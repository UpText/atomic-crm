import { StrictMode } from "react";
import { render } from "vitest-browser-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EntraCallback } from "./EntraCallback";
import { completeEntraLogin } from "@/components/atomic-crm/providers/sqlwebapi/entra";
import { returnToCrm } from "./entraNavigation";

vi.mock("@/components/atomic-crm/providers/sqlwebapi/entra", () => ({
  completeEntraLogin: vi.fn(),
}));
vi.mock("./entraNavigation", () => ({ returnToCrm: vi.fn() }));
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
describe("Entra callback screen", () => {
  it("finishes exactly once under StrictMode and leaves the callback screen", async () => {
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    vi.mocked(completeEntraLogin).mockResolvedValue();
    await render(
      <StrictMode>
        <EntraCallback code="single-use-code" error={null} />
      </StrictMode>,
    );
    await expect.poll(() => vi.mocked(returnToCrm).mock.calls.length).toBe(1);
    expect(completeEntraLogin).toHaveBeenCalledExactlyOnceWith(
      "single-use-code",
    );
  });
  it("shows completion errors instead of navigating", async () => {
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    vi.mocked(completeEntraLogin).mockRejectedValue(
      new Error("The API did not respond in time."),
    );
    const screen = await render(<EntraCallback code="code" error={null} />);
    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("The API did not respond in time.");
    expect(returnToCrm).not.toHaveBeenCalled();
  });
});
