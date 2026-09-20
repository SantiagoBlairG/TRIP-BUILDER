import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { demoTrips } from "@/data/catalog";
import { TripLibrary } from "./trip-library";

describe("trip library", () => {
  it("groups demo trips and exposes real navigation links", () => {
    render(<TripLibrary trips={demoTrips} />);
    expect(
      screen.getByRole("heading", { name: "On the horizon" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Still dreaming" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View trip: Japan Spring Escape" }),
    ).toHaveAttribute("href", "/trips/japan-spring");
    expect(
      screen.getByRole("link", { name: "Review draft: Colombian Caribbean" }),
    ).toHaveAttribute("href", "/trips/colombian-caribbean");
  });
  it("combines status and city search and recovers from no results", async () => {
    const user = userEvent.setup();
    render(<TripLibrary trips={demoTrips} />);
    await user.click(screen.getByRole("button", { name: /Drafts/ }));
    expect(
      screen.getByRole("heading", { name: "Colombian Caribbean" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Japan Spring Escape" }),
    ).not.toBeInTheDocument();
    await user.type(
      screen.getByRole("searchbox", { name: "Search trips" }),
      "Kyoto",
    );
    expect(
      screen.getByRole("heading", { name: "No trips found" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Search trips" }),
      " Kyoto ",
    );
    expect(
      screen.getByRole("heading", { name: "Japan Spring Escape" }),
    ).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("1 trip in view");
  });
  it("provides a creation path for a genuinely empty library", () => {
    render(<TripLibrary trips={[]} />);
    expect(
      screen.getByRole("link", { name: "Plan your first trip" }),
    ).toHaveAttribute("href", "/builder");
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });
});
