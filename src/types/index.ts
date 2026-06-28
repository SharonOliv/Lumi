// Central domain types shared across components, Redux slices, and the API layer.

// Movies and TV Shows are structurally identical, so they share one shape.
// This lets <MediaCard> / <MediaForm> be reused for both instead of being
// copy-pasted into two near-identical components.
export interface MediaItem {
  id: string;
  name: string;
  poster: string;
  rating: number | string;
  description: string;
  genre: string;
  language: string;
}

export type Movie = MediaItem;
export type TvShow = MediaItem;

export interface Channel {
  id: string;
  name: string;
  posterImage: string;
  category: string;
  description: string;
}

export type Role = "admin" | "viewer";

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
}

// A public review left by any signed-in user on a movie or TV show.
export interface Review {
  id: string;
  itemId: string;
  type: "movie" | "tvshow";
  username: string;
  rating: number;
  text: string;
  createdAt: string;
}

export type NewReview = Omit<Review, "id">;

// A "My List" / watchlist entry. Denormalized (carries its own copy of the
// title's display fields) so the My List page never has to cross-reference
// the movies/tvShows slices to render — it works even before those have
// loaded. `itemId` + `type` together identify the underlying title, since
// movie ids and tv show ids are NOT unique across the two resources.
export interface Favourite {
  id: string;
  itemId: string;
  type: "movie" | "tvshow";
  name: string;
  poster: string;
  rating: number | string;
  description: string;
  genre: string;
  language: string;
}

// Generic shape used by the Add/Edit forms before an item has an id yet.
export type NewMovie = Omit<Movie, "id">;
export type NewTvShow = Omit<TvShow, "id">;
export type NewChannel = Omit<Channel, "id">;
export type NewFavourite = Omit<Favourite, "id">;

// Generic async-resource shape reused by every Redux slice that fetches a list.
export interface AsyncListState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}
