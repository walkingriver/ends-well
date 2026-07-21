import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface FeaturedSeries {
  id: string;
  title: string;
  yearStarted: number;
  yearEnded?: number;
  averageRating: number;
  posterPath: string;
  genres?: string[];
}

@Component({
  selector: 'app-series-card',
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './series-card.component.html',
  styleUrl: './series-card.component.scss',
})
export class SeriesCardComponent {
  @Input({ required: true }) series!: FeaturedSeries;
}
