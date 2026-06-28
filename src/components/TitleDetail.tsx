import { type FormEvent, useEffect, useState } from "react";
import { FiArrowLeft, FiBookmark, FiEdit2, FiStar, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import MediaForm from "./shared/MediaForm";
import { ErrorState, LoadingState } from "./shared/PageState";
import ReviewSection from "./shared/ReviewSection";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteMovieThunk, fetchMoviesThunk, updateMovieThunk } from "../store/slices/moviesSlice";
import { deleteTvShowThunk, fetchTvShowsThunk, updateTvShowThunk } from "../store/slices/tvShowsSlice";
import { addToWatchlistThunk, removeFromWatchlistThunk } from "../store/slices/watchlistSlice";
import type { MediaItem, NewMovie } from "../types";
import "../styles/buttons.css";
import "../styles/rail.css";
import "./TitleDetail.css";

interface TitleDetailProps {
  type: "movie" | "tvshow";
}

const TitleDetail = ({ type }: TitleDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const listPath = type === "movie" ? "/movies" : "/tvshows";
  const heading = type === "movie" ? "Movie" : "TV Show";

  const { items, loading, error } = useAppSelector((state) => (type === "movie" ? state.movies : state.tvShows));
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const isAdmin = useAppSelector((state) => state.auth.role === "admin");

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [formValue, setFormValue] = useState<NewMovie | null>(null);

  useEffect(() => {
    if (!loading && items.length === 0) {
      dispatch(type === "movie" ? fetchMoviesThunk() : fetchTvShowsThunk());
    }
  }, [dispatch, items.length, loading, type]);

  const item = items.find((i) => i.id === id);
  const favourite = watchlist.find((f) => f.itemId === id && f.type === type);
  const related = item ? items.filter((i) => i.id !== item.id && i.genre === item.genre).slice(0, 8) : [];

  const handleToggleFavourite = (target: MediaItem) => {
    if (favourite) {
      dispatch(removeFromWatchlistThunk(favourite.id));
    } else {
      dispatch(
        addToWatchlistThunk({
          itemId: target.id,
          type,
          name: target.name,
          poster: target.poster,
          rating: target.rating,
          description: target.description,
          genre: target.genre,
          language: target.language,
        })
      );
    }
  };

  const startEditing = () => {
    if (!item) return;
    setFormValue({
      name: item.name,
      poster: item.poster,
      rating: item.rating,
      description: item.description,
      genre: item.genre,
      language: item.language,
    });
    setIsEditing(true);
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item || !formValue) return;
    if (type === "movie") {
      await dispatch(updateMovieThunk({ id: item.id, movie: formValue }));
    } else {
      await dispatch(updateTvShowThunk({ id: item.id, show: formValue }));
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!item) return;
    if (type === "movie") {
      await dispatch(deleteMovieThunk(item.id));
    } else {
      await dispatch(deleteTvShowThunk(item.id));
    }
    navigate(listPath);
  };

  if (loading && !item) {
    return <LoadingState label={`Loading ${heading.toLowerCase()}…`} />;
  }

  if (error && !item) {
    return <ErrorState message={error} />;
  }

  if (!item) {
    return (
      <div className="title-detail-missing">
        <p>We couldn&apos;t find that {heading.toLowerCase()}.</p>
        <Link to={listPath}>
          <FiArrowLeft /> Back to {heading === "Movie" ? "Movies" : "TV Shows"}
        </Link>
      </div>
    );
  }

  return (
    <div className="title-detail">
      <Link to={listPath} className="title-detail-back">
        <FiArrowLeft /> Back to {heading === "Movie" ? "Movies" : "TV Shows"}
      </Link>

      {isEditing && formValue ? (
        <MediaForm
          value={formValue}
          onChange={setFormValue}
          onSubmit={handleEditSubmit}
          isEditing
          onCancel={() => setIsEditing(false)}
          heading={heading}
        />
      ) : (
        <div className="title-detail-layout">
          <div className="title-detail-poster-wrap">
            <img src={item.poster} alt={item.name} className="title-detail-poster" />
          </div>
          <div className="title-detail-info">
            <div className="title-detail-tags">
              <span className="title-detail-tag">{item.genre}</span>
              <span className="title-detail-tag title-detail-tag-muted">{item.language}</span>
            </div>
            <h1>{item.name}</h1>
            <p className="title-detail-rating">
              <FiStar /> {item.rating} / 10
            </p>
            <p className="title-detail-description">{item.description}</p>

            <div className="title-detail-actions">
              <button
                type="button"
                className={`btn-pill ${favourite ? "btn-pill-active" : ""}`}
                onClick={() => handleToggleFavourite(item)}
              >
                <FiBookmark /> {favourite ? "In My List" : "Add to My List"}
              </button>

              {/* Cataloging (edit/delete) is Admin-only — Viewers only get
                  the watchlist action above and the review form below. */}
              {isAdmin && (
                <>
                  <button type="button" className="btn-pill" onClick={startEditing}>
                    <FiEdit2 /> Edit
                  </button>
                  {confirmingDelete ? (
                    <span className="title-detail-confirm">
                      Delete this title?
                      <button type="button" className="btn-pill btn-pill-danger" onClick={handleDelete}>
                        Yes, delete
                      </button>
                      <button type="button" className="btn-pill" onClick={() => setConfirmingDelete(false)}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn-pill btn-pill-danger"
                      onClick={() => setConfirmingDelete(true)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ReviewSection itemId={item.id} type={type} />

      <div className="rail">
        <div className="rail-heading">
          <p className="rail-eyebrow">More like this</p>
          <h2>{item.genre}</h2>
        </div>
        {related.length === 0 ? (
          <p className="rail-empty">Nothing else in {item.genre} yet.</p>
        ) : (
          <div className="rail-track">
            {related.map((r) => (
              <Link to={`${listPath}/${r.id}`} className="rail-card" key={r.id}>
                <img src={r.poster} alt={r.name} loading="lazy" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleDetail;
