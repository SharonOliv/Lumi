import { Link } from "react-router-dom";
import "./SearchHit.css";

interface SearchHitProps {
  to: string;
  poster: string;
  name: string;
  meta: string; // e.g. "Movie · Action · English" or "Live TV · Sports"
  rating?: number | string;
}

const SearchHit = ({ to, poster, name, meta, rating }: SearchHitProps) => (
  <Link to={to} className="search-hit">
    <img src={poster} alt={name} loading="lazy" />
    <div className="search-hit-body">
      <h3>{name}</h3>
      <p>
        {meta}
        {rating !== undefined && <span className="search-hit-rating">★ {rating}</span>}
      </p>
    </div>
  </Link>
);

export default SearchHit;
