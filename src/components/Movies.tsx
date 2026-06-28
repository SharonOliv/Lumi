import { type FormEvent, useEffect, useMemo, useState } from "react";
import FilterBar from "./shared/FilterBar";
import MediaCard from "./shared/MediaCard";
import MediaForm from "./shared/MediaForm";
import { EmptyState, ErrorState, LoadingState } from "./shared/PageState";
import { GENRES, LANGUAGES } from "../constants/taxonomy";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addMovieThunk,
  deleteMovieThunk,
  fetchMoviesThunk,
  updateMovieThunk,
} from "../store/slices/moviesSlice";
import { addToWatchlistThunk, fetchWatchlistThunk, removeFromWatchlistThunk } from "../store/slices/watchlistSlice";
import type { MediaItem, NewMovie } from "../types";
import "./Movies.css";

const emptyMovie: NewMovie = { name: "", poster: "", rating: "", description: "", genre: "", language: "" };

const Movies = () => {
  const dispatch = useAppDispatch();
  const { items: movies, loading, error } = useAppSelector((state) => state.movies);
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const isAdmin = useAppSelector((state) => state.auth.role === "admin");

  const [formValue, setFormValue] = useState<NewMovie>(emptyMovie);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMoviesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!watchlist.length) {
      dispatch(fetchWatchlistThunk());
    }
  }, [dispatch, watchlist.length]);

  const filteredMovies = useMemo(() => {
    return movies.filter(
      (m) => (!genreFilter || m.genre === genreFilter) && (!languageFilter || m.language === languageFilter)
    );
  }, [movies, genreFilter, languageFilter]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateMovieThunk({ id: editingId, movie: formValue }));
    } else {
      await dispatch(addMovieThunk(formValue));
    }
    setFormValue(emptyMovie);
    setEditingId(null);
  };

  const handleEdit = (movie: MediaItem) => {
    setEditingId(movie.id);
    setFormValue({
      name: movie.name,
      poster: movie.poster,
      rating: movie.rating,
      description: movie.description,
      genre: movie.genre,
      language: movie.language,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormValue(emptyMovie);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMovieThunk(id));
  };

  const handleToggleFavourite = (movie: MediaItem) => {
    const existing = watchlist.find((f) => f.itemId === movie.id && f.type === "movie");
    if (existing) {
      dispatch(removeFromWatchlistThunk(existing.id));
    } else {
      dispatch(
        addToWatchlistThunk({
          itemId: movie.id,
          type: "movie",
          name: movie.name,
          poster: movie.poster,
          rating: movie.rating,
          description: movie.description,
          genre: movie.genre,
          language: movie.language,
        })
      );
    }
  };

  return (
    <div className="movies-container">
      <h1>Movies</h1>

      {isAdmin && (
        <MediaForm
          value={formValue}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          isEditing={Boolean(editingId)}
          onCancel={handleCancel}
          heading="Movie"
        />
      )}

      {!loading && !error && movies.length > 0 && (
        <FilterBar
          groups={[
            { label: "Genre", options: [...GENRES], selected: genreFilter, onSelect: setGenreFilter },
            { label: "Language", options: [...LANGUAGES], selected: languageFilter, onSelect: setLanguageFilter },
          ]}
        />
      )}

      {loading && <LoadingState label="Loading movies…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && movies.length === 0 && (
        <EmptyState message="No movies yet — add the first one above." />
      )}
      {!loading && !error && movies.length > 0 && filteredMovies.length === 0 && (
        <EmptyState message="No movies match those filters." />
      )}

      {!loading && !error && filteredMovies.length > 0 && (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MediaCard
              key={movie.id}
              item={movie}
              type="movie"
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              canManage={isAdmin}
              isFavourite={watchlist.some((f) => f.itemId === movie.id && f.type === "movie")}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
