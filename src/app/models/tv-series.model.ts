// Base TV Series interface for our application
export interface TvSeries {
  id: string;
  title: string;
  yearStarted: number;
  yearEnded?: number;
  ended: boolean;
  wasCanceled: boolean;
  averageRating: number;
  totalRatings: number;
  genres: string[];
  description?: string;
  posterPath?: string;
  backdropPath?: string;
  
  // Additional metadata
  network?: string;
  seasons?: number;
  episodes?: number;
  createdBy?: string[];
  starring?: string[];
  
  // External IDs
  tmdbId?: number;
  imdbId?: string;
  
  // Ratings from different sources
  imdbRating?: number;
  imdbVotes?: number;
  metacriticRating?: number;
  rottenTomatoesRating?: number;
  
  // Media
  trailerUrl?: string;
  website?: string;
  
  // Additional info
  awards?: string[];
  similarShows?: string[];
  tags?: string[];
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// TMDb specific interfaces
export interface TmdbTvSeries {
  id: number;
  name: string;
  original_name: string;
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
  genres: {
    id: number;
    name: string;
  }[];
  created_by: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  episode_run_time: number[];
  homepage: string | null;
  original_language: string;
  popularity: number;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  seasons: Array<{
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  tagline: string | null;
  type: string;
  content_ratings: {
    results: Array<{
      descriptors: string[];
      iso_3166_1: string;
      rating: string;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }>;
  };
  external_ids?: {
    imdb_id: string | null;
    freebase_mid: string | null;
    freebase_id: string | null;
    tvdb_id: number | null;
    tvrage_id: number | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
      published_at: string;
    }>;
  };
  images?: {
    backdrops: Array<{
      aspect_ratio: number;
      file_path: string;
      height: number;
      iso_639_1: string | null;
      vote_average: number;
      vote_count: number;
      width: number;
    }>;
    posters: Array<{
      aspect_ratio: number;
      file_path: string;
      height: number;
      iso_639_1: string | null;
      vote_average: number;
      vote_count: number;
      width: number;
    }>;
  };
}

// TMDb API response for search
export interface TmdbSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// TMDb API configuration
export interface TmdbConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

// Helper function to convert TMDb TV series to our model
export function mapTmdbToTvSeries(tmdbSeries: TmdbTvSeries): TvSeries {
  const firstAirYear = tmdbSeries.first_air_date
    ? new Date(tmdbSeries.first_air_date).getFullYear()
    : new Date().getFullYear();
    
  const lastAirYear = tmdbSeries.last_air_date
    ? new Date(tmdbSeries.last_air_date).getFullYear()
    : undefined;
    
  return {
    id: tmdbSeries.id.toString(),
    title: tmdbSeries.name,
    yearStarted: firstAirYear,
    yearEnded: lastAirYear,
    ended: !tmdbSeries.in_production,
    wasCanceled: tmdbSeries.status === 'Canceled',
    averageRating: tmdbSeries.vote_average,
    totalRatings: tmdbSeries.vote_count,
    genres: tmdbSeries.genres.map(g => g.name),
    description: tmdbSeries.overview,
    posterPath: tmdbSeries.poster_path || undefined,
    backdropPath: tmdbSeries.backdrop_path || undefined,
    network: tmdbSeries.networks[0]?.name,
    seasons: tmdbSeries.number_of_seasons,
    episodes: tmdbSeries.number_of_episodes,
    createdBy: tmdbSeries.created_by?.map(p => p.name) || [],
    starring: tmdbSeries.credits?.cast.slice(0, 5).map(c => c.name) || [],
    tmdbId: tmdbSeries.id,
    imdbId: tmdbSeries.external_ids?.imdb_id || undefined,
    website: tmdbSeries.homepage || undefined,
    trailerUrl: tmdbSeries.videos?.results.find(v => 
      v.site === 'YouTube' && v.type === 'Trailer'
    )?.key ? `https://www.youtube.com/watch?v=${tmdbSeries.videos.results.find(v => 
      v.site === 'YouTube' && v.type === 'Trailer'
    )?.key}` : undefined
  };
}
