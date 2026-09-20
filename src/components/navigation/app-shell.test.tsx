import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({ usePathname: () => "/builder" }));

describe("application navigation", () => {
  it("identifies the current route and exposes a skip target", () => {
    render(
      <AppShell>
        <h1>Plan your trip</h1>
      </AppShell>,
    );
    expect(screen.getByRole("link", { name: "Trip builder" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "My trips" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("link", { name: "New trip" })).toHaveAttribute(
      "href",
      "/builder",
    );
  });
});
