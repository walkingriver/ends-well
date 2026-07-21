import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RatingsService } from '../../services/ratings';
import { SeriesService } from '../../services/series';
import { TvSeries } from '../../models/tv-series.model';

@Component({
  selector: 'app-series-detail',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './series-detail.component.html',
  styleUrl: './series-detail.component.scss',
})
export class SeriesDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ratingsService = inject(RatingsService);
  private readonly seriesService = inject(SeriesService);

  series = signal<TvSeries | null>(null);
  notFound = signal(false);
  isLoading = signal(true);
  error = signal<string | null>(null);
  userEndedWell = signal<boolean | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.isLoading.set(false);
      return;
    }

    this.seriesService
      .getSeriesDetails(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((found) => {
        this.series.set(found);
        this.notFound.set(!found);
        this.isLoading.set(false);
        if (!found) {
          this.error.set('Series not found.');
        } else {
          this.userEndedWell.set(this.ratingsService.getEndedWell(found.id));
        }
      });
  }

  onEndedWellChange(value: boolean): void {
    const current = this.series();
    if (!current) {
      return;
    }

    const next = this.userEndedWell() === value ? null : value;
    this.userEndedWell.set(next);
    this.ratingsService.setEndedWell(current.id, next);
  }
}
