import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SeriesService } from '../../services/series';
import { RatingsService } from '../../services/ratings.service';
import { TvSeries } from '../../models/tv-series.model';

@Component({
  selector: 'app-series-detail',
  imports: [
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.scss'],
})
export class SeriesDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly seriesService = inject(SeriesService);
  private readonly ratingsService = inject(RatingsService);

  // Signals
  series = signal<TvSeries | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // User rating signals
  userEndedWell = signal<boolean | null>(null);
  userStarRating = signal<number | null>(null);
  userComment = signal<string>('');

  // Star rating array for template iteration
  readonly stars = [1, 2, 3, 4, 5];

  // Computed values
  rating = computed(() => {
    const series = this.series();
    return series?.averageRating?.toFixed(1) ?? 'N/A';
  });

  releaseYear = computed(() => {
    const series = this.series();
    if (!series?.yearStarted) return '';
    if (series.yearEnded) {
      return `${series.yearStarted}–${series.yearEnded}`;
    }
    return `${series.yearStarted}–Present`;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const seriesId = params.get('id');
      if (seriesId) {
        this.loadSeriesDetails(seriesId);
        this.loadUserRating(seriesId);
      }
    });
  }

  loadSeriesDetails(seriesId?: string): void {
    const id = seriesId || this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No series ID provided');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Use getSeriesDetails() which can fetch from TMDb if needed
    this.seriesService.getSeriesDetails(id).subscribe({
      next: (foundSeries) => {
        if (foundSeries) {
          this.series.set(foundSeries);
          this.error.set(null);
        } else {
          this.error.set(`Series with ID "${id}" not found`);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load series details:', err);
        this.error.set('Failed to load series details');
        this.loading.set(false);
      },
    });
  }

  loadUserRating(seriesId: string): void {
    const rating = this.ratingsService.getRating(seriesId);
    if (rating) {
      this.userEndedWell.set(rating.endedWell);
      this.userStarRating.set(rating.starRating);
      this.userComment.set(rating.comment);
    } else {
      this.userEndedWell.set(null);
      this.userStarRating.set(null);
      this.userComment.set('');
    }
  }

  onEndedWellChange(value: boolean | null): void {
    const series = this.series();
    if (!series) return;

    this.userEndedWell.set(value);
    this.ratingsService.setEndedWell(series.id, value);

    const message =
      value === true
        ? `You rated "${series.title}" as ended well!`
        : value === false
          ? `You rated "${series.title}" as ended poorly.`
          : `Cleared your "ended well" rating for "${series.title}"`;

    this.snackBar.open(message, 'OK', { duration: 2000 });
  }

  onStarRatingChange(stars: number): void {
    const series = this.series();
    if (!series) return;

    // Toggle off if clicking the same rating
    const newRating = this.userStarRating() === stars ? null : stars;
    this.userStarRating.set(newRating);
    this.ratingsService.setStarRating(series.id, newRating);

    if (newRating) {
      this.snackBar.open(`You gave "${series.title}" ${newRating} star${newRating > 1 ? 's' : ''}`, 'OK', {
        duration: 2000,
      });
    }
  }

  onCommentChange(comment: string): void {
    const series = this.series();
    if (!series) return;

    this.userComment.set(comment);
    this.ratingsService.setComment(series.id, comment);
  }

  onWatchTrailer(): void {
    const series = this.series();
    if (series?.trailerUrl) {
      window.open(series.trailerUrl, '_blank');
    } else {
      this.snackBar.open('Trailer not available', 'Close', { duration: 3000 });
    }
  }

  onAddToFavorites(): void {
    const series = this.series();
    if (series) {
      this.snackBar.open(`Added "${series.title}" to favorites`, 'Undo', {
        duration: 3000,
      });
    }
  }

  onAddToWatchlist(): void {
    const series = this.series();
    if (series) {
      this.snackBar.open(`Added "${series.title}" to watchlist`, 'Undo', {
        duration: 3000,
      });
    }
  }
}
