import { type FormEvent, useEffect, useMemo, useState } from "react";
import ChannelCard from "./shared/ChannelCard";
import ChannelForm from "./shared/ChannelForm";
import FilterBar from "./shared/FilterBar";
import { EmptyState, ErrorState, LoadingState } from "./shared/PageState";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addChannelThunk,
  deleteChannelThunk,
  fetchChannelsThunk,
  updateChannelThunk,
} from "../store/slices/liveTvSlice";
import type { Channel, NewChannel } from "../types";
import "./Livetv.css";

const emptyChannel: NewChannel = { name: "", posterImage: "", category: "", description: "" };

const Livetv = () => {
  const dispatch = useAppDispatch();
  const { items: channels, loading, error } = useAppSelector((state) => state.liveTv);
  const isAdmin = useAppSelector((state) => state.auth.role === "admin");

  const [formValue, setFormValue] = useState<NewChannel>(emptyChannel);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchChannelsThunk());
  }, [dispatch]);

  // Categories are free text on the form, so derive the filter's options
  // from whatever actually exists in the data instead of a fixed list.
  const categories = useMemo(
    () => Array.from(new Set(channels.map((c) => c.category))).sort(),
    [channels]
  );

  const filteredChannels = useMemo(
    () => channels.filter((c) => !categoryFilter || c.category === categoryFilter),
    [channels, categoryFilter]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateChannelThunk({ id: editingId, channel: formValue }));
    } else {
      await dispatch(addChannelThunk(formValue));
    }
    setFormValue(emptyChannel);
    setEditingId(null);
  };

  const handleEdit = (channel: Channel) => {
    setEditingId(channel.id);
    setFormValue({
      name: channel.name,
      posterImage: channel.posterImage,
      category: channel.category,
      description: channel.description,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormValue(emptyChannel);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteChannelThunk(id));
  };

  return (
    <div className="livetv-container">
      <h1>Live TV Channels</h1>

      {isAdmin && (
        <ChannelForm
          value={formValue}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          isEditing={Boolean(editingId)}
          onCancel={handleCancel}
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <FilterBar
          groups={[{ label: "Category", options: categories, selected: categoryFilter, onSelect: setCategoryFilter }]}
        />
      )}

      {loading && <LoadingState label="Loading live TV channels…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && channels.length === 0 && (
        <EmptyState message="No channels yet — add the first one above." />
      )}
      {!loading && !error && channels.length > 0 && filteredChannels.length === 0 && (
        <EmptyState message="No channels match that category." />
      )}

      {!loading && !error && filteredChannels.length > 0 && (
        <div className="livetv-grid">
          {filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              canManage={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Livetv;
