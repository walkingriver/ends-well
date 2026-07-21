export interface TvSeries {
  id: string;
  title: string;
  yearStarted: number;
  yearEnded?: number;
  ended: boolean;
  wasCanceled: boolean;
  averageRating: number;
  genres: string[];
  description: string;
  posterPath: string;
  backdropPath?: string;
  network?: string;
  seasons?: number;
  episodes?: number;
  starring?: string[];
  createdBy?: string[];
}
