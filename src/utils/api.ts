import axios from "axios";
import type {
  Channel,
  Favourite,
  NewChannel,
  NewFavourite,
  NewMovie,
  NewReview,
  NewTvShow,
  Movie,
  Review,
  Role,
  TvShow,
  User,
} from "../types";

// One axios instance, one source of truth for the API base URL.
// Components/slices never hardcode "http://localhost:3001" themselves.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- Users / Auth ----
export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/users");
  return data;
};

export const registerUser = async (username: string, password: string): Promise<User> => {
  // Self-registration always creates a Viewer — there is no signup path to Admin.
  const { data } = await apiClient.post<User>("/users", { username, password, role: "viewer" });
  return data;
};

export const updateUserRole = async (id: string, role: Role): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/users/${id}`, { role });
  return data;
};

// ---- Movies ----
export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<Movie[]>("/movies");
  return data;
};

export const addMovie = async (movie: NewMovie): Promise<Movie> => {
  const { data } = await apiClient.post<Movie>("/movies", movie);
  return data;
};

export const updateMovie = async (id: string, movie: NewMovie): Promise<Movie> => {
  const { data } = await apiClient.put<Movie>(`/movies/${id}`, movie);
  return data;
};

export const deleteMovie = async (id: string): Promise<string> => {
  await apiClient.delete(`/movies/${id}`);
  return id;
};

// ---- TV Shows ----
export const fetchTvShows = async (): Promise<TvShow[]> => {
  const { data } = await apiClient.get<TvShow[]>("/tvshows");
  return data;
};

export const addTvShow = async (show: NewTvShow): Promise<TvShow> => {
  const { data } = await apiClient.post<TvShow>("/tvshows", show);
  return data;
};

export const updateTvShow = async (id: string, show: NewTvShow): Promise<TvShow> => {
  const { data } = await apiClient.put<TvShow>(`/tvshows/${id}`, show);
  return data;
};

export const deleteTvShow = async (id: string): Promise<string> => {
  await apiClient.delete(`/tvshows/${id}`);
  return id;
};

// ---- Live TV ----
export const fetchChannels = async (): Promise<Channel[]> => {
  const { data } = await apiClient.get<Channel[]>("/livetv");
  return data;
};

export const addChannel = async (channel: NewChannel): Promise<Channel> => {
  const { data } = await apiClient.post<Channel>("/livetv", channel);
  return data;
};

export const updateChannel = async (id: string, channel: NewChannel): Promise<Channel> => {
  const { data } = await apiClient.put<Channel>(`/livetv/${id}`, channel);
  return data;
};

export const deleteChannel = async (id: string): Promise<string> => {
  await apiClient.delete(`/livetv/${id}`);
  return id;
};

// ---- Favourites / My List ----
export const fetchFavourites = async (): Promise<Favourite[]> => {
  const { data } = await apiClient.get<Favourite[]>("/favourites");
  return data;
};

export const addFavourite = async (favourite: NewFavourite): Promise<Favourite> => {
  const { data } = await apiClient.post<Favourite>("/favourites", favourite);
  return data;
};

export const removeFavourite = async (id: string): Promise<string> => {
  await apiClient.delete(`/favourites/${id}`);
  return id;
};

// ---- Reviews ----
export const fetchReviews = async (): Promise<Review[]> => {
  const { data } = await apiClient.get<Review[]>("/reviews");
  return data;
};

export const addReview = async (review: NewReview): Promise<Review> => {
  const { data } = await apiClient.post<Review>("/reviews", review);
  return data;
};

export const deleteReview = async (id: string): Promise<string> => {
  await apiClient.delete(`/reviews/${id}`);
  return id;
};
