import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { TvSeries } from '../models/tv-series.model';
import { MOCK_SERIES } from '../data/mock-series';
import { TmdbService } from './tmdb';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private readonly tmdbService = inject(TmdbService);

  private readonly _seriesList = signal<TvSeries[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _dataSource = signal<'mock' | 'tmdb'>('mock');

  readonly seriesList = this._seriesList.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly featuredSeries = computed(() => {
    if (this._dataSource() === 'tmdb') {
      return [...this._seriesList()]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3);
    }
    return this._seriesList()
      .filter((series) => series.ended && !series.wasCanceled)
      .slice(0, 3);
  });

  constructor() {
    this.loadInitialData();
  }

  getSeriesById(id: string): TvSeries | undefined {
    return this._seriesList().find((series) => series.id === id);
  }

  getSeriesDetails(id: string): Observable<TvSeries | null> {
    const cached = this.getSeriesById(id);
    if (cached) {
      return of(cached);
    }

    if (this._dataSource() === 'tmdb' && this.tmdbService.isConfigured) {
      return this.tmdbService.getTvShowDetails(Number.parseInt(id, 10)).pipe(
        catchError((err) => {
          console.error('Failed to fetch series details:', err);
          return of(null);
        }),
      );
    }

    return of(null);
  }

  private loadInitialData(): void {
    if (this.tmdbService.isConfigured) {
      this.loadFromTmdb();
      return;
    }
    this.loadMockData();
  }

  private loadMockData(): void {
    if (!environment.useMockData) {
      return;
    }
    this._dataSource.set('mock');
    this._seriesList.set([...MOCK_SERIES]);
    this._isLoading.set(false);
    this._error.set(null);
  }

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
        }),
        catchError((err) => {
          console.error('TMDb API error, falling back to mock data:', err);
          this._error.set('Failed to load from TMDb. Using offline data.');
          this.loadMockData();
          return of({ results: [], totalPages: 0 });
        }),
      )
      .subscribe();
  }
}
