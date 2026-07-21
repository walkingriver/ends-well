import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RatingsService } from '../../services/ratings';
import { SeriesService } from '../../services/series';
import { TvSeries } from '../../models/tv-series.model';

@Component({
  selector: 'app-series-detail',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './series-detail.component.html',
  styleUrl: './series-detail.component.scss',
})
export class SeriesDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ratingsService = inject(RatingsService);
  private readonly seriesService = inject(SeriesService);

  series = signal<TvSeries | null>(null);
  notFound = signal(false);
  userEndedWell = signal<boolean | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = id ? this.seriesService.getById(id) : undefined;
    this.series.set(found ?? null);
    this.notFound.set(!found);

    if (found) {
      this.userEndedWell.set(this.ratingsService.getEndedWell(found.id));
    }
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
