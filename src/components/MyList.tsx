import { useEffect } from "react";
import { FiBookmark, FiStar, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "./shared/PageState";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWatchlistThunk, removeFromWatchlistThunk } from "../store/slices/watchlistSlice";
import "./MyList.css";

const MyList = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.watchlist);

  useEffect(() => {
    if (!loading && items.length === 0) {
      dispatch(fetchWatchlistThunk());
    }
  }, [dispatch, loading, items.length]);

  return (
    <div className="mylist-container">
      <h1>
        <FiBookmark /> My List
      </h1>

      {loading && <LoadingState label="Loading your list…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState message="Your list is empty. Bookmark a movie or show to see it here." />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="mylist-grid">
          {items.map((entry) => (
            <div className="mylist-card" key={entry.id}>
              <Link to={`/${entry.type === "movie" ? "movies" : "tvshows"}/${entry.itemId}`}>
                <img src={entry.poster} alt={entry.name} loading="lazy" />
              </Link>
              <div className="mylist-card-body">
                <h2>{entry.name}</h2>
                <p>
                  {entry.type === "movie" ? "Movie" : "TV Show"} · {entry.genre} · {entry.language}
                </p>
                <p className="mylist-rating">
                  <FiStar /> {entry.rating}
                </p>
              </div>
              <button
                type="button"
                className="mylist-remove"
                onClick={() => dispatch(removeFromWatchlistThunk(entry.id))}
                aria-label={`Remove ${entry.name} from My List`}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;
