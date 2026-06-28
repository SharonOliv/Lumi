import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MediaCard from "../shared/MediaCard";
import type { MediaItem } from "../../types";

const movie: MediaItem = {
  id: "1",
  name: "Inception",
  rating: 8.8,
  description: "A skilled thief leads a team into dreams to steal secrets.",
  poster: "poster-url",
  genre: "Sci-Fi",
  language: "English",
};

const renderCard = (overrides: Partial<Parameters<typeof MediaCard>[0]> = {}) =>
  render(
    <MemoryRouter>
      <MediaCard
        item={movie}
        type="movie"
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        isFavourite={false}
        onToggleFavourite={vi.fn()}
        {...overrides}
      />
    </MemoryRouter>
  );

describe("MediaCard", () => {
  it("renders the item's name, rating, genre, and description", () => {
    renderCard();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText(/8.8/)).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    expect(screen.getByText(/skilled thief/)).toBeInTheDocument();
  });

  it("links the poster and title to the title detail page", () => {
    renderCard();
    const links = screen.getAllByRole("link");
    expect(links.some((link) => link.getAttribute("href") === "/movies/1")).toBe(true);
  });

  it("calls onEdit with the item when Edit is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    renderCard({ onEdit, canManage: true });

    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(movie);
  });

  it("calls onDelete with the item's id when Delete is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    renderCard({ onDelete, canManage: true });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("hides the edit/delete controls when canManage is false (the Viewer case)", () => {
    renderCard({ canManage: false });
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("calls onToggleFavourite with the item when the bookmark button is clicked", async () => {
    const onToggleFavourite = vi.fn();
    const user = userEvent.setup();
    renderCard({ onToggleFavourite });

    await user.click(screen.getByRole("button", { name: /add inception to my list/i }));
    expect(onToggleFavourite).toHaveBeenCalledWith(movie);
  });

  it("shows the bookmark as active when isFavourite is true", () => {
    renderCard({ isFavourite: true });
    expect(screen.getByRole("button", { name: /remove inception from my list/i })).toBeInTheDocument();
  });
});
