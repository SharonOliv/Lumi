import { useEffect } from "react";
import { FiShield, FiUser } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsersThunk, updateUserRoleThunk } from "../store/slices/usersSlice";
import { ErrorState, LoadingState } from "./shared/PageState";
import "../styles/badges.css";
import "../styles/buttons.css";
import "./ManageUsers.css";

const ManageUsers = () => {
  const dispatch = useAppDispatch();
  const { items: users, loading, error } = useAppSelector((state) => state.users);
  const currentUsername = useAppSelector((state) => state.auth.username);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleToggleRole = (id: string, currentRole: "admin" | "viewer") => {
    dispatch(updateUserRoleThunk({ id, role: currentRole === "admin" ? "viewer" : "admin" }));
  };

  return (
    <div className="manage-users-container">
      <h1>
        <FiShield /> Manage Users
      </h1>
      <p className="manage-users-subtitle">
        Promote a Viewer to Admin so they can manage the catalog, or demote an Admin back to Viewer.
      </p>

      {loading && <LoadingState label="Loading users…" />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className="manage-users-list">
          {users.map((user) => {
            const isSelf = user.username === currentUsername;
            return (
              <div className="manage-users-row" key={user.id}>
                <div className="manage-users-identity">
                  <FiUser />
                  <span>{user.username}</span>
                  {isSelf && <span className="manage-users-you">you</span>}
                </div>
                <div className="manage-users-actions">
                  <span className={`role-badge role-badge-${user.role}`}>{user.role}</span>
                  <button
                    type="button"
                    className="btn-pill"
                    disabled={isSelf}
                    title={isSelf ? "You can't change your own role" : undefined}
                    onClick={() => handleToggleRole(user.id, user.role)}
                  >
                    {user.role === "admin" ? "Demote to Viewer" : "Promote to Admin"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
