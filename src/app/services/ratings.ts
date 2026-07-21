import { Injectable, signal } from '@angular/core';

export interface UserRating {
  seriesId: string;
  endedWell: boolean | null;
  ratedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private ratingsMap = signal<Map<string, UserRating>>(new Map());

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
  }
}
