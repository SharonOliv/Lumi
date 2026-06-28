import { type FormEvent } from "react";
import { GENRES, LANGUAGES } from "../../constants/taxonomy";
import type { NewMovie } from "../../types";
import "./MediaForm.css";

interface MediaFormProps {
  value: NewMovie;
  onChange: (value: NewMovie) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  onCancel: () => void;
  heading: string; // e.g. "Movie" or "TV Show", used for the title + labels
}

const MediaForm = ({ value, onChange, onSubmit, isEditing, onCancel, heading }: MediaFormProps) => {
  return (
    <form onSubmit={onSubmit} className="media-form">
      <h3>{isEditing ? `Edit ${heading}` : `Add a New ${heading}`}</h3>
      <input
        type="text"
        placeholder="Name"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Poster URL"
        value={value.poster}
        onChange={(e) => onChange({ ...value, poster: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Rating"
        value={value.rating}
        onChange={(e) => onChange({ ...value, rating: e.target.value })}
        required
      />
      <div className="media-form-row">
        <select
          value={value.genre}
          onChange={(e) => onChange({ ...value, genre: e.target.value })}
          required
          aria-label="Genre"
        >
          <option value="" disabled>
            Genre…
          </option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          value={value.language}
          onChange={(e) => onChange({ ...value, language: e.target.value })}
          required
          aria-label="Language"
        >
          <option value="" disabled>
            Language…
          </option>
          {LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="Description"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        required
      />
      <button type="submit">{isEditing ? `Update ${heading}` : `Add ${heading}`}</button>
      {isEditing && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default MediaForm;
