import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { countries, activities } from "@/data/catalog";
import { DestinationCard } from "./destination-card";
import { PreferenceCard } from "./preference-card";
import { ActivityCard } from "./activity-card";
import { ImageCard } from "./image-card";
import { BaseCard } from "./base-card";

describe("card interactions", () => {
  it("supports keyboard destination selection and exposes the controlled selected state", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { rerender } = render(
      <DestinationCard country={countries[0]} onToggle={onToggle} />,
    );
    const button = screen.getByRole("button", { name: "Select Colombia" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(onToggle).toHaveBeenCalledOnce();
    rerender(
      <DestinationCard country={countries[0]} selected onToggle={onToggle} />,
    );
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Selected")).toBeVisible();
  });

  it("does not activate disabled preferences with click or keyboard", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<PreferenceCard styleId="food" disabled onToggle={onToggle} />);
    const button = screen.getByRole("button", { name: "Food & gastronomy" });
    expect(button).toBeDisabled();
    await user.click(button);
    await user.tab();
    await user.keyboard(" ");
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("separates saving, adding, and expanding an activity without nested buttons", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onAdd = vi.fn();
    const { container } = render(
      <ActivityCard
        activity={activities[0]}
        cityName="Medellín"
        onSave={onSave}
        onAdd={onAdd}
      />,
    );
    await user.click(
      screen.getByRole("button", { name: `Save ${activities[0].name}` }),
    );
    expect(onSave).toHaveBeenCalledOnce();
    expect(onAdd).not.toHaveBeenCalled();
    const details = screen.getByRole("button", { name: "View details" });
    await user.click(details);
    expect(details).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById(details.getAttribute("aria-controls")!),
    ).toBeVisible();
    expect(
      screen.getByText(/Prices, ratings, and map pins are simulated/),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Add to itinerary" }));
    expect(onAdd).toHaveBeenCalledOnce();
    expect(container.querySelector("button button")).toBeNull();
  });

  it("shows a readable fallback on photo failure and retries a different source", () => {
    const image = {
      src: "/images/colombia.jpg",
      alt: "Cartagena balconies",
      caption: "Country inspiration",
    };
    const { rerender } = render(
      <ImageCard image={image}>
        <h3>Cartagena</h3>
      </ImageCard>,
    );
    fireEvent.error(screen.getByRole("img", { name: image.alt }));
    expect(
      screen.getByRole("img", { name: `Image unavailable: ${image.alt}` }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Cartagena" })).toBeVisible();
    rerender(
      <ImageCard
        image={{ ...image, src: "/images/france.jpg", alt: "Paris at dusk" }}
      >
        <h3>Paris</h3>
      </ImageCard>,
    );
    expect(screen.getByRole("img", { name: "Paris at dusk" })).toBeVisible();
  });

  it("explains invalid drop targets in text and replaces loading contents", () => {
    const { rerender } = render(
      <BaseCard state="invalid-drop">Activity</BaseCard>,
    );
    expect(screen.getByText("Choose a day in this city")).toBeVisible();
    rerender(
      <BaseCard state="loading" aria-label="Loading card preview">
        <button>Save</button>
      </BaseCard>,
    );
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Loading card preview")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
