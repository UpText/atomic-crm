import { afterEach, describe, expect, it, vi } from "vitest";
import { formatLocalizedDate, formatRelativeDate } from "./RelativeDate";

afterEach(() => vi.useRealTimers());

describe("Norwegian dates", () => {
  it("formats recent dates in Bokmål", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 23, 12));
    const yesterday = new Date(2026, 8, 22, 10, 30).toISOString();
    expect(formatRelativeDate(yesterday, "nb")).toBe("i går kl. 10:30");
    expect(formatRelativeDate(yesterday, "en")).toContain("yesterday");
    expect(formatRelativeDate(yesterday, "fr")).toContain("hier");
  });

  it("formats full dates in Bokmål", () => {
    expect(
      formatLocalizedDate(new Date(2026, 8, 23, 12).toISOString(), "nb"),
    ).toBe("23. september 2026");
  });
});

describe("additional language dates", () => {
  it.each([
    ["nn", "i går kl. 10:30", "23. september 2026"],
    ["sv", "igår kl. 10:30", "23 september 2026"],
    ["da", "i går kl. 10:30", "23. september 2026"],
    ["de", "gestern um 10:30", "23. September 2026"],
  ])("formats recent and full dates in %s", (locale, relative, full) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 23, 12));
    expect(
      formatRelativeDate(new Date(2026, 8, 22, 10, 30).toISOString(), locale),
    ).toBe(relative);
    expect(
      formatLocalizedDate(new Date(2026, 8, 23, 12).toISOString(), locale),
    ).toBe(full);
  });

  it("handles regional locale identifiers", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 23, 12));
    expect(
      formatRelativeDate(new Date(2026, 8, 22, 10, 30).toISOString(), "de-AT"),
    ).toBe("gestern um 10:30");
  });
});
