import { Injectable, signal, computed } from '@angular/core';

/**
 * User rating for a TV series.
 * Stores whether the user thinks the series ended well, an optional star rating,
 * and personal comments/notes.
 */
export interface UserRating {
  seriesId: string;
  endedWell: boolean | null; // true = ended well, false = ended poorly, null = not rated
  starRating: number | null; // 1-5 stars, null = not rated
  comment: string; // User's personal notes about the series
  ratedAt: Date;
}

const STORAGE_KEY = 'ends-well-ratings';

/**
 * Service to manage user ratings with localStorage persistence.
 *
 * This service demonstrates:
 * - Signals for reactive state management
 * - localStorage for client-side persistence
 * - Computed values for derived state
 */
@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  // All ratings stored as a signal for reactivity
  private ratingsMap = signal<Map<string, UserRating>>(new Map());

  // Computed: total number of ratings
  totalRatings = computed(() => this.ratingsMap().size);

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get the user's rating for a specific series.
   */
  getRating(seriesId: string): UserRating | null {
    return this.ratingsMap().get(seriesId) ?? null;
  }

  /**
   * Check if the user has rated a series as "ended well".
   */
  getEndedWell(seriesId: string): boolean | null {
    return this.getRating(seriesId)?.endedWell ?? null;
  }

  /**
   * Get the user's star rating for a series.
   */
  getStarRating(seriesId: string): number | null {
    return this.getRating(seriesId)?.starRating ?? null;
  }

  /**
   * Get the user's comment for a series.
   */
  getComment(seriesId: string): string {
    return this.getRating(seriesId)?.comment ?? '';
  }

  /**
   * Set whether the series ended well.
   */
  setEndedWell(seriesId: string, endedWell: boolean | null): void {
    this.updateRating(seriesId, { endedWell });
  }

  /**
   * Set the star rating (1-5) for a series.
   */
  setStarRating(seriesId: string, starRating: number | null): void {
    if (starRating !== null && (starRating < 1 || starRating > 5)) {
      throw new Error('Star rating must be between 1 and 5');
    }
    this.updateRating(seriesId, { starRating });
  }

  /**
   * Set the user's comment for a series.
   */
  setComment(seriesId: string, comment: string): void {
    this.updateRating(seriesId, { comment });
  }

  /**
   * Clear the user's rating for a series.
   */
  clearRating(seriesId: string): void {
    const newMap = new Map(this.ratingsMap());
    newMap.delete(seriesId);
    this.ratingsMap.set(newMap);
    this.saveToStorage();
  }

  /**
   * Get all ratings as an array.
   */
  getAllRatings(): UserRating[] {
    return Array.from(this.ratingsMap().values());
  }

  /**
   * Update a rating, merging with existing data.
   */
  private updateRating(
    seriesId: string,
    updates: Partial<Pick<UserRating, 'endedWell' | 'starRating' | 'comment'>>
  ): void {
    const existing = this.getRating(seriesId);
    const newRating: UserRating = {
      seriesId,
      endedWell: updates.endedWell !== undefined ? updates.endedWell : existing?.endedWell ?? null,
      starRating:
        updates.starRating !== undefined ? updates.starRating : existing?.starRating ?? null,
      comment: updates.comment !== undefined ? updates.comment : existing?.comment ?? '',
      ratedAt: new Date(),
    };

    const newMap = new Map(this.ratingsMap());
    newMap.set(seriesId, newRating);
    this.ratingsMap.set(newMap);
    this.saveToStorage();
  }

  /**
   * Load ratings from localStorage.
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserRating[];
        const map = new Map<string, UserRating>();
        for (const rating of parsed) {
          rating.ratedAt = new Date(rating.ratedAt);
          map.set(rating.seriesId, rating);
        }
        this.ratingsMap.set(map);
      }
    } catch (error) {
      console.error('Failed to load ratings from localStorage:', error);
    }
  }

  /**
   * Save ratings to localStorage.
   */
  private saveToStorage(): void {
    try {
      const ratings = this.getAllRatings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch (error) {
      console.error('Failed to save ratings to localStorage:', error);
    }
  }
}
