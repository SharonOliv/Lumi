import { memo } from "react";
import { FiBookmark, FiEdit2, FiStar, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { MediaItem } from "../../types";
import "./MediaCard.css";

interface MediaCardProps {
  item: MediaItem;
  type: "movie" | "tvshow";
  onEdit?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
  isFavourite: boolean;
  onToggleFavourite: (item: MediaItem) => void;
  canManage?: boolean;
}

const MediaCard = ({ item, type, onEdit, onDelete, isFavourite, onToggleFavourite, canManage = false }: MediaCardProps) => {
  const detailPath = `/${type === "movie" ? "movies" : "tvshows"}/${item.id}`;

  return (
    <div className="media-card">
      <Link to={detailPath} className="media-card-media">
        <img src={item.poster} alt={item.name} className="media-card-poster" loading="lazy" />
        <span className="media-card-genre">{item.genre}</span>
        <button
          type="button"
          className={`media-card-bookmark ${isFavourite ? "is-active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavourite(item);
          }}
          aria-pressed={isFavourite}
          aria-label={isFavourite ? `Remove ${item.name} from My List` : `Add ${item.name} to My List`}
        >
          <FiBookmark />
        </button>
      </Link>
      <Link to={detailPath} className="media-card-title-link">
        <h2>{item.name}</h2>
      </Link>
      <p className="media-card-rating">
        <FiStar /> {item.rating}
        <span className="media-card-language">{item.language}</span>
      </p>
      <p className="media-card-description">{item.description}</p>
      {canManage && onEdit && onDelete && (
        <div className="button-container">
          <button className="edit-btn" onClick={() => onEdit(item)}>
            <FiEdit2 /> Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(item.id)}>
            <FiTrash2 /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Re-rendering the whole grid every time one field of the add/edit form
// changes is wasted work; memo() keeps untouched cards from re-rendering.
export default memo(MediaCard);
