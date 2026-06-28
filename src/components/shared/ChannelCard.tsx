import { memo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Channel } from "../../types";
import "./ChannelCard.css";

interface ChannelCardProps {
  channel: Channel;
  onEdit?: (channel: Channel) => void;
  onDelete?: (id: string) => void;
  canManage?: boolean;
}

const ChannelCard = ({ channel, onEdit, onDelete, canManage = false }: ChannelCardProps) => {
  return (
    <div className="channel-card">
      <div className="channel-card-media">
        <img src={channel.posterImage} alt={channel.name} loading="lazy" />
        <span className="channel-onair">
          <span className="channel-onair-dot" /> On air
        </span>
      </div>
      <div className="channel-card-body">
        <h2>{channel.name}</h2>
        <p className="channel-category">{channel.category}</p>
        <p className="channel-description">{channel.description}</p>
        {canManage && onEdit && onDelete && (
          <div className="button-container">
            <button className="edit-btn" onClick={() => onEdit(channel)}>
              <FiEdit2 /> Edit
            </button>
            <button className="delete-btn" onClick={() => onDelete(channel.id)}>
              <FiTrash2 /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ChannelCard);
