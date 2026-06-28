import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchHit from "./shared/SearchHit";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchChannelsThunk } from "../store/slices/liveTvSlice";
import { fetchMoviesThunk } from "../store/slices/moviesSlice";
import { fetchTvShowsThunk } from "../store/slices/tvShowsSlice";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const dispatch = useAppDispatch();

  const movies = useAppSelector((state) => state.movies);
  const tvShows = useAppSelector((state) => state.tvShows);
  const liveTv = useAppSelector((state) => state.liveTv);

  // Search works from whatever's already loaded; this just makes sure all
  // three resources get fetched at least once, even if the user lands here
  // before ever visiting /movies, /tvshows, or /livetv.
  useEffect(() => {
    if (!movies.loading && movies.items.length === 0) dispatch(fetchMoviesThunk());
    if (!tvShows.loading && tvShows.items.length === 0) dispatch(fetchTvShowsThunk());
    if (!liveTv.loading && liveTv.items.length === 0) dispatch(fetchChannelsThunk());
  }, [dispatch, movies.loading, movies.items.length, tvShows.loading, tvShows.items.length, liveTv.loading, liveTv.items.length]);

  const matchedMovies = query ? movies.items.filter((m) => m.name.toLowerCase().includes(query)) : [];
  const matchedShows = query ? tvShows.items.filter((s) => s.name.toLowerCase().includes(query)) : [];
  const matchedChannels = query ? liveTv.items.filter((c) => c.name.toLowerCase().includes(query)) : [];
  const totalResults = matchedMovies.length + matchedShows.length + matchedChannels.length;

  return (
    <div className="search-results">
      <h1>{query ? `Results for "${query}"` : "Search"}</h1>

      {!query && <p className="search-results-empty">Start typing in the search bar above to find a title.</p>}

      {query && totalResults === 0 && (
        <p className="search-results-empty">Nothing matched &quot;{query}&quot;. Try a different title.</p>
      )}

      {matchedMovies.length > 0 && (
        <section className="search-section">
          <h2>Movies</h2>
          <div className="search-grid">
            {matchedMovies.map((m) => (
              <SearchHit
                key={m.id}
                to={`/movies/${m.id}`}
                poster={m.poster}
                name={m.name}
                meta={`Movie · ${m.genre} · ${m.language}`}
                rating={m.rating}
              />
            ))}
          </div>
        </section>
      )}

      {matchedShows.length > 0 && (
        <section className="search-section">
          <h2>TV Shows</h2>
          <div className="search-grid">
            {matchedShows.map((s) => (
              <SearchHit
                key={s.id}
                to={`/tvshows/${s.id}`}
                poster={s.poster}
                name={s.name}
                meta={`TV Show · ${s.genre} · ${s.language}`}
                rating={s.rating}
              />
            ))}
          </div>
        </section>
      )}

      {matchedChannels.length > 0 && (
        <section className="search-section">
          <h2>Live TV</h2>
          <div className="search-grid">
            {matchedChannels.map((c) => (
              <SearchHit
                key={c.id}
                to="/livetv"
                poster={c.posterImage}
                name={c.name}
                meta={`Live TV · ${c.category}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
