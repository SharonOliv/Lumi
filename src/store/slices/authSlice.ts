import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsers, registerUser } from "../../utils/api";
import type { Role } from "../../types";

interface AuthState {
  username: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = "lumi_auth";

interface StoredSession {
  username: string;
  role: Role;
}

const readStoredSession = (): StoredSession | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed.username && (parsed.role === "admin" || parsed.role === "viewer")) return parsed;
    return null;
  } catch {
    return null;
  }
};

const writeStoredSession = (session: StoredSession) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const stored = readStoredSession();

const initialState: AuthState = {
  username: stored?.username ?? null,
  role: stored?.role ?? null,
  isAuthenticated: Boolean(stored),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  StoredSession,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const users = await fetchUsers();
    const match = users.find((u) => u.username === username && u.password === password);
    if (!match) {
      return rejectWithValue("Invalid username or password");
    }
    return { username: match.username, role: match.role };
  } catch {
    return rejectWithValue("Error fetching user data. Is the API server running?");
  }
});

export const register = createAsyncThunk<
  StoredSession,
  { username: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ username, password }, { rejectWithValue }) => {
  try {
    const users = await fetchUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return rejectWithValue("That username is already taken");
    }
    const created = await registerUser(username, password);
    return { username: created.username, role: created.role };
  } catch {
    return rejectWithValue("Error creating your account. Is the API server running?");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEY);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const onSessionStart = (state: AuthState, session: StoredSession) => {
      state.loading = false;
      state.username = session.username;
      state.role = session.role;
      state.isAuthenticated = true;
      writeStoredSession(session);
    };

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => onSessionStart(state, action.payload))
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => onSessionStart(state, action.payload))
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Registration failed";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
