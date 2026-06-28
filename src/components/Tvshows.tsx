import { type FormEvent, useEffect, useMemo, useState } from "react";
import FilterBar from "./shared/FilterBar";
import MediaCard from "./shared/MediaCard";
import MediaForm from "./shared/MediaForm";
import { EmptyState, ErrorState, LoadingState } from "./shared/PageState";
import { GENRES, LANGUAGES } from "../constants/taxonomy";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTvShowThunk,
  deleteTvShowThunk,
  fetchTvShowsThunk,
  updateTvShowThunk,
} from "../store/slices/tvShowsSlice";
import { addToWatchlistThunk, fetchWatchlistThunk, removeFromWatchlistThunk } from "../store/slices/watchlistSlice";
import type { MediaItem, NewTvShow } from "../types";
import "./Tvshows.css";

const emptyShow: NewTvShow = { name: "", poster: "", rating: "", description: "", genre: "", language: "" };

const Tvshows = () => {
  const dispatch = useAppDispatch();
  const { items: tvShows, loading, error } = useAppSelector((state) => state.tvShows);
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const isAdmin = useAppSelector((state) => state.auth.role === "admin");

  const [formValue, setFormValue] = useState<NewTvShow>(emptyShow);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTvShowsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!watchlist.length) {
      dispatch(fetchWatchlistThunk());
    }
  }, [dispatch, watchlist.length]);

  const filteredShows = useMemo(() => {
    return tvShows.filter(
      (s) => (!genreFilter || s.genre === genreFilter) && (!languageFilter || s.language === languageFilter)
    );
  }, [tvShows, genreFilter, languageFilter]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateTvShowThunk({ id: editingId, show: formValue }));
    } else {
      await dispatch(addTvShowThunk(formValue));
    }
    setFormValue(emptyShow);
    setEditingId(null);
  };

  const handleEdit = (show: MediaItem) => {
    setEditingId(show.id);
    setFormValue({
      name: show.name,
      poster: show.poster,
      rating: show.rating,
      description: show.description,
      genre: show.genre,
      language: show.language,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormValue(emptyShow);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTvShowThunk(id));
  };

  const handleToggleFavourite = (show: MediaItem) => {
    const existing = watchlist.find((f) => f.itemId === show.id && f.type === "tvshow");
    if (existing) {
      dispatch(removeFromWatchlistThunk(existing.id));
    } else {
      dispatch(
        addToWatchlistThunk({
          itemId: show.id,
          type: "tvshow",
          name: show.name,
          poster: show.poster,
          rating: show.rating,
          description: show.description,
          genre: show.genre,
          language: show.language,
        })
      );
    }
  };

  return (
    <div className="tvshows-container">
      <h1>TV Shows</h1>

      {isAdmin && (
        <MediaForm
          value={formValue}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          isEditing={Boolean(editingId)}
          onCancel={handleCancel}
          heading="TV Show"
        />
      )}

      {!loading && !error && tvShows.length > 0 && (
        <FilterBar
          groups={[
            { label: "Genre", options: [...GENRES], selected: genreFilter, onSelect: setGenreFilter },
            { label: "Language", options: [...LANGUAGES], selected: languageFilter, onSelect: setLanguageFilter },
          ]}
        />
      )}

      {loading && <LoadingState label="Loading TV shows…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && tvShows.length === 0 && (
        <EmptyState message="No TV shows yet — add the first one above." />
      )}
      {!loading && !error && tvShows.length > 0 && filteredShows.length === 0 && (
        <EmptyState message="No TV shows match those filters." />
      )}

      {!loading && !error && filteredShows.length > 0 && (
        <div className="tvshows-grid">
          {filteredShows.map((show) => (
            <MediaCard
              key={show.id}
              item={show}
              type="tvshow"
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              canManage={isAdmin}
              isFavourite={watchlist.some((f) => f.itemId === show.id && f.type === "tvshow")}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tvshows;
