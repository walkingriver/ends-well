import { Injectable, signal } from '@angular/core';

export interface UserRating {
  seriesId: string;
  endedWell: boolean | null;
  ratedAt: Date;
}

const STORAGE_KEY = 'ends-well-ratings';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private ratingsMap = signal<Map<string, UserRating>>(new Map());

  constructor() {
    this.loadFromStorage();
  }

  getEndedWell(seriesId: string): boolean | null {
    return this.ratingsMap().get(seriesId)?.endedWell ?? null;
  }

  setEndedWell(seriesId: string, endedWell: boolean | null): void {
    const newMap = new Map(this.ratingsMap());

    if (endedWell === null) {
      newMap.delete(seriesId);
    } else {
      newMap.set(seriesId, { seriesId, endedWell, ratedAt: new Date() });
    }

    this.ratingsMap.set(newMap);
    this.saveToStorage();
  }

  clearAllRatings(): void {
    this.ratingsMap.set(new Map());
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as UserRating[];
      const map = new Map<string, UserRating>();

      for (const rating of parsed) {
        map.set(rating.seriesId, {
          ...rating,
          ratedAt: new Date(rating.ratedAt),
        });
      }

      this.ratingsMap.set(map);
    } catch (error) {
      console.error('Failed to load ratings from localStorage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const ratings = Array.from(this.ratingsMap().values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch (error) {
      console.error('Failed to save ratings to localStorage:', error);
    }
  }
}
