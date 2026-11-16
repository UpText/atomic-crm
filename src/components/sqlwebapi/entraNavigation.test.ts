import { describe, expect, it, vi } from "vitest";
import { returnToCrm } from "./entraNavigation";

describe("Entra callback navigation", () => {
  it("cleans callback parameters and reloads the app instead of changing only its hash", () => {
    const reload = vi.fn();
    const replaceState = vi.fn();
    returnToCrm({ pathname: "/", reload }, { replaceState });
    expect(replaceState).toHaveBeenCalledWith(null, "", "/#/");
    expect(reload).toHaveBeenCalledOnce();
    expect(replaceState.mock.invocationCallOrder[0]).toBeLessThan(
      reload.mock.invocationCallOrder[0],
    );
  });
  it("preserves a CRM deployment subpath", () => {
    const replaceState = vi.fn();
    returnToCrm({ pathname: "/crm/", reload: vi.fn() }, { replaceState });
    expect(replaceState).toHaveBeenCalledWith(null, "", "/crm/#/");
  });
});
