import { Injectable, computed, signal } from '@angular/core';
import { TvSeries } from '../models/tv-series.model';
import { MOCK_SERIES } from '../data/mock-series';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private readonly _seriesList = signal<TvSeries[]>([]);

  readonly seriesList = this._seriesList.asReadonly();

  readonly featuredSeries = computed(() =>
    [...this._seriesList()]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3),
  );

  constructor() {
    this.loadMockData();
  }

  getById(id: string): TvSeries | undefined {
    return this._seriesList().find((series) => series.id === id);
  }

  private loadMockData(): void {
    if (!environment.useMockData) {
      return;
    }
    this._seriesList.set([...MOCK_SERIES]);
  }
}
