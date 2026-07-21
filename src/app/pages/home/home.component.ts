import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeriesService } from '../../services/series';

@Component({
  selector: 'app-home',
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private seriesService = inject(SeriesService);

  // Use computed signal from service
  featuredSeries = this.seriesService.featuredSeries;
}
