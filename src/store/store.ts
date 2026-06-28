import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import liveTvReducer from "./slices/liveTvSlice";
import moviesReducer from "./slices/moviesSlice";
import reviewsReducer from "./slices/reviewsSlice";
import themeReducer from "./slices/themeSlice";
import tvShowsReducer from "./slices/tvShowsSlice";
import usersReducer from "./slices/usersSlice";
import watchlistReducer from "./slices/watchlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    tvShows: tvShowsReducer,
    liveTv: liveTvReducer,
    watchlist: watchlistReducer,
    theme: themeReducer,
    users: usersReducer,
    reviews: reviewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
