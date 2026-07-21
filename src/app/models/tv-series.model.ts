export interface TvSeries {
  id: string;
  title: string;
  yearStarted: number;
  yearEnded?: number;
  ended: boolean;
  wasCanceled: boolean;
  averageRating: number;
  totalRatings?: number;
  genres: string[];
  description: string;
  posterPath: string;
  backdropPath?: string;
  network?: string;
  seasons?: number;
  episodes?: number;
  starring?: string[];
  createdBy?: string[];
  tmdbId?: number;
}

export interface TmdbTvSeries {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  vote_count: number;
  status: string;
  in_production: boolean;
  genres?: { id: number; name: string }[];
  networks?: { name: string }[];
  created_by?: { name: string }[];
  homepage?: string | null;
  credits?: {
    cast: { name: string }[];
  };
  external_ids?: {
    imdb_id: string | null;
  };
  videos?: {
    results: { site: string; type: string; key: string }[];
  };
}

export interface TmdbSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
