// Single source of truth for genre/language options, used by both the
// Movies/TvShows add-edit form (as <select> options) and the filter chips
// on those same pages. Keeping one list means a typo in a free-text field
// can never silently break filtering.

export const GENRES = [
  "Action",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export const LANGUAGES = ["English", "Hindi", "Telugu", "Tamil", "Korean", "Spanish"] as const;
