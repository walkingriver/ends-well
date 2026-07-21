import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, delay, catchError, map, tap } from 'rxjs';
import { TvSeries } from '../models/tv-series.model';
import { MOCK_SERIES } from '../data/mock-series';
import { TmdbService } from './tmdb.service';
import { environment } from '../../environments/environment';

/**
 * Service for managing TV series data.
 *
 * Supports two data sources:
 * - Mock data (default): Uses local MOCK_SERIES for development/demos
 * - TMDb API: Uses real data when configured in environment
 *
 * Toggle via environment.useMockData
 */
@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private tmdbService = inject(TmdbService);

  // Signal-based state management
  private _seriesList = signal<TvSeries[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _dataSource = signal<'mock' | 'tmdb'>('mock');

  // Read-only signals for components
  readonly seriesList = this._seriesList.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly dataSource = this._dataSource.asReadonly();

  // Computed signals for filtered views
  readonly topRatedSeries = computed(() => {
    return [...this._seriesList()]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 10);
  });

  readonly featuredSeries = computed(() => {
    // For TMDb data, just return top rated
    // For mock data, return ended non-canceled shows
    if (this._dataSource() === 'tmdb') {
      return this.topRatedSeries().slice(0, 5);
    }
    return this._seriesList()
      .filter((s) => s.ended && !s.wasCanceled)
      .slice(0, 5);
  });

  constructor() {
    this.loadInitialData();
  }

  /**
   * Load initial data based on environment configuration
   */
  private loadInitialData(): void {
    if (this.tmdbService.isConfigured) {
      this.loadFromTmdb();
    } else {
      this.loadMockData();
    }
  }

  /**
   * Load mock data (immediate, no network)
   */
  private loadMockData(): void {
    this._dataSource.set('mock');
    this._seriesList.set([...MOCK_SERIES]);
    console.log('SeriesService: Using mock data');
  }

  /**
   * Load data from TMDb API
   */
  private loadFromTmdb(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._dataSource.set('tmdb');

    this.tmdbService
      .getTopRatedTvShows(1)
      .pipe(
        tap((response) => {
          this._seriesList.set(response.results);
          this._isLoading.set(false);
          console.log('SeriesService: Loaded from TMDb API');
        }),
        catchError((err) => {
          console.error('TMDb API error, falling back to mock data:', err);
          this._error.set('Failed to load from TMDb. Using offline data.');
          this.loadMockData();
          this._isLoading.set(false);
          return of({ results: [], totalPages: 0 });
        })
      )
      .subscribe();
  }

  /**
   * Refresh data from the current source
   */
  refresh(): void {
    this.loadInitialData();
  }

  /**
   * Get all series
   */
  getSeries(): Observable<TvSeries[]> {
    return of(this._seriesList());
  }

  /**
   * Get a series by ID
   */
  getSeriesById(id: string): TvSeries | undefined {
    return this._seriesList().find((series) => series.id === id);
  }

  /**
   * Get series details by ID (with API call for TMDb source)
   */
  getSeriesDetails(id: string): Observable<TvSeries | null> {
    // First check local cache
    const cached = this.getSeriesById(id);
    if (cached) {
      return of(cached);
    }

    // If using TMDb and not in cache, fetch from API
    if (this._dataSource() === 'tmdb' && this.tmdbService.isConfigured) {
      return this.tmdbService.getTvShowDetails(parseInt(id, 10)).pipe(
        catchError((err) => {
          console.error('Failed to fetch series details:', err);
          return of(null);
        })
      );
    }

    return of(null);
  }

  /**
   * Search series by title or description
   */
  searchSeries(query: string): Observable<TvSeries[]> {
    if (!query.trim()) {
      return of(this._seriesList());
    }

    // Use TMDb search if configured
    if (this._dataSource() === 'tmdb' && this.tmdbService.isConfigured) {
      return this.tmdbService.searchTvShows(query).pipe(
        map((response) => response.results),
        catchError((err) => {
          console.error('Search error:', err);
          return of([]);
        })
      );
    }

    // Local search for mock data
    const lowerQuery = query.toLowerCase();
    const results = this._seriesList().filter(
      (series) =>
        series.title.toLowerCase().includes(lowerQuery) ||
        series.description?.toLowerCase().includes(lowerQuery) ||
        series.genres?.some((g) => g.toLowerCase().includes(lowerQuery))
    );

    // Simulate network delay for realistic UX
    return of(results).pipe(delay(300));
  }

  /**
   * Rate a series (updates the average rating - mock data only)
   */
  rateSeries(seriesId: string, rating: number): TvSeries | null {
    let updatedSeries: TvSeries | null = null;

    this._seriesList.update((currentSeries) => {
      return currentSeries.map((series) => {
        if (series.id !== seriesId) return series;

        const totalRatings = (series.totalRatings || 0) + 1;
        const currentTotal =
          (series.averageRating || 0) * (series.totalRatings || 0);
        const averageRating = (currentTotal + rating) / totalRatings;

        updatedSeries = {
          ...series,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalRatings,
          updatedAt: new Date(),
        };

        return updatedSeries;
      });
    });

    return updatedSeries;
  }
}
