import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { SeriesService } from '../../services/series';

@Component({
  selector: 'app-home',
  imports: [RouterModule, MatButtonModule, SeriesCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly seriesService = inject(SeriesService);

  featuredSeries = this.seriesService.featuredSeries;
}
