import { type FormEvent } from "react";
import type { NewChannel } from "../../types";
import "./MediaForm.css";

interface ChannelFormProps {
  value: NewChannel;
  onChange: (value: NewChannel) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  onCancel: () => void;
}

const ChannelForm = ({ value, onChange, onSubmit, isEditing, onCancel }: ChannelFormProps) => {
  return (
    <form onSubmit={onSubmit} className="media-form">
      <h3>{isEditing ? "Edit Channel" : "Add a New Channel"}</h3>
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
        value={value.posterImage}
        onChange={(e) => onChange({ ...value, posterImage: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={value.category}
        onChange={(e) => onChange({ ...value, category: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        required
      />
      <button type="submit">{isEditing ? "Update Channel" : "Add Channel"}</button>
      {isEditing && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ChannelForm;
