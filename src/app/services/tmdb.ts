import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  TmdbSearchResponse,
  TmdbTvSeries,
  TvSeries,
} from '../models/tv-series.model';

/**
 * Service to interact with The Movie Database (TMDb) API.
 *
 * Uses the API Read Access Token (v4 auth) for Bearer authentication.
 * Get your token at: https://www.themoviedb.org/settings/api
 */
@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p';

  private http = inject(HttpClient);

  /**
   * Check if the TMDb API is configured and available
   */
  get isConfigured(): boolean {
    if (environment.useMockData) {
      return false;
    }

    if (environment.useProxy) {
      return true;
    }

    return !!environment.tmdbAccessToken;
  }

  private get apiBaseUrl(): string {
    return environment.useProxy
      ? '/api/tmdb/3'
      : 'https://api.themoviedb.org/3';
  }

  /**
   * Get HTTP headers for TMDb requests
   */
  private get headers(): HttpHeaders {
    if (environment.useProxy) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }

    return new HttpHeaders({
      Authorization: `Bearer ${environment.tmdbAccessToken}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Search for TV shows by name
   */
  searchTvShows(
    query: string,
    page = 1
  ): Observable<{ results: TvSeries[]; totalPages: number }> {
    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      language: 'en-US',
    });

    return this.http
      .get<TmdbSearchResponse<TmdbTvSeries>>(
        `${this.apiBaseUrl}/search/tv?${params}`,
        { headers: this.headers }
      )
      .pipe(
        map((response) => ({
          results: response.results.map((series) =>
            this.mapTmdbToTvSeries(series)
          ),
          totalPages: response.total_pages,
        }))
      );
  }

  /**
   * Get details for a specific TV show by TMDb ID
   */
  getTvShowDetails(id: number): Observable<TvSeries> {
    const params = new URLSearchParams({
      language: 'en-US',
      append_to_response: 'credits,external_ids,videos',
    });

    return this.http
      .get<TmdbTvSeries>(`${this.apiBaseUrl}/tv/${id}?${params}`, {
        headers: this.headers,
      })
      .pipe(map((series) => this.mapTmdbToTvSeries(series)));
  }

  /**
   * Get popular TV shows
   */
  getPopularTvShows(
    page = 1
  ): Observable<{ results: TvSeries[]; totalPages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      language: 'en-US',
    });

    return this.http
      .get<TmdbSearchResponse<TmdbTvSeries>>(
        `${this.apiBaseUrl}/tv/popular?${params}`,
        { headers: this.headers }
      )
      .pipe(
        map((response) => ({
          results: response.results.map((series) =>
            this.mapTmdbToTvSeries(series)
          ),
          totalPages: response.total_pages,
        }))
      );
  }

  /**
   * Get top-rated TV shows
   */
  getTopRatedTvShows(
    page = 1
  ): Observable<{ results: TvSeries[]; totalPages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      language: 'en-US',
    });

    return this.http
      .get<TmdbSearchResponse<TmdbTvSeries>>(
        `${this.apiBaseUrl}/tv/top_rated?${params}`,
        { headers: this.headers }
      )
      .pipe(
        map((response) => ({
          results: response.results.map((series) =>
            this.mapTmdbToTvSeries(series)
          ),
          totalPages: response.total_pages,
        }))
      );
  }

  /**
   * Get full image URL for a poster path
   */
  getPosterUrl(
    path: string | undefined,
    size: 'w185' | 'w342' | 'w500' = 'w500'
  ): string | null {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Get full image URL for a backdrop path
   */
  getBackdropUrl(
    path: string | undefined,
    size: 'w780' | 'w1280' | 'original' = 'original'
  ): string | null {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Map TMDb API response to our TvSeries model
   */
  private mapTmdbToTvSeries(tmdbSeries: TmdbTvSeries): TvSeries {
    const firstAirYear = tmdbSeries.first_air_date
      ? new Date(tmdbSeries.first_air_date).getFullYear()
      : new Date().getFullYear();

    const lastAirYear = tmdbSeries.last_air_date
      ? new Date(tmdbSeries.last_air_date).getFullYear()
      : undefined;

    // Find YouTube trailer if available
    const trailer = tmdbSeries.videos?.results?.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );

    return {
      id: tmdbSeries.id.toString(),
      title: tmdbSeries.name,
      yearStarted: firstAirYear,
      yearEnded: lastAirYear,
      ended: !tmdbSeries.in_production,
      wasCanceled: tmdbSeries.status === 'Canceled',
      averageRating: tmdbSeries.vote_average || 0,
      totalRatings: tmdbSeries.vote_count || 0,
      genres: tmdbSeries.genres?.map((g) => g.name) || [],
      description: tmdbSeries.overview,
      posterPath: tmdbSeries.poster_path
        ? `${this.imageBaseUrl}/w500${tmdbSeries.poster_path}`
        : '/assets/images/poster-placeholder.jpg',
      backdropPath: tmdbSeries.backdrop_path
        ? `${this.imageBaseUrl}/original${tmdbSeries.backdrop_path}`
        : '/assets/images/backdrop-placeholder.jpg',
      network: tmdbSeries.networks?.[0]?.name,
      seasons: tmdbSeries.number_of_seasons,
      episodes: tmdbSeries.number_of_episodes,
      createdBy: tmdbSeries.created_by?.map((p) => p.name) || [],
      starring: tmdbSeries.credits?.cast.slice(0, 5).map((c) => c.name) || [],
      tmdbId: tmdbSeries.id,
      imdbId: tmdbSeries.external_ids?.imdb_id,
      website: tmdbSeries.homepage,
      trailerUrl: trailer?.key
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TvSeries;
  }
}
