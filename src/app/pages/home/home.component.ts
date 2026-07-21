import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SeriesCardComponent, FeaturedSeries } from '../../shared/components/series-card/series-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule, MatButtonModule, SeriesCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  featuredSeries: FeaturedSeries[] = [
    {
      id: '1',
      title: 'Breaking Bad',
      yearStarted: 2008,
      yearEnded: 2013,
      averageRating: 9.5,
      posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    },
    {
      id: '2',
      title: 'The Good Place',
      yearStarted: 2016,
      yearEnded: 2020,
      averageRating: 8.2,
      posterPath: '/assets/images/poster-placeholder.jpg',
    },
    {
      id: '3',
      title: 'The Office',
      yearStarted: 2005,
      yearEnded: 2013,
      averageRating: 8.9,
      posterPath: '/assets/images/poster-placeholder.jpg',
    },
  ];
}
