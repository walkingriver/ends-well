import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SeriesCardComponent, FeaturedSeries } from '../../shared/components/series-card/series-card.component';

@Component({
  selector: 'app-series-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    SeriesCardComponent,
  ],
  templateUrl: './series-list.component.html',
  styleUrl: './series-list.component.scss',
})
export class SeriesListComponent {
  searchQuery = signal('');

  allSeries: FeaturedSeries[] = [
    {
      id: '1',
      title: 'Breaking Bad',
      yearStarted: 2008,
      yearEnded: 2013,
      averageRating: 9.5,
      posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      genres: ['Drama', 'Crime', 'Thriller'],
    },
    {
      id: '2',
      title: 'The Good Place',
      yearStarted: 2016,
      yearEnded: 2020,
      averageRating: 8.2,
      posterPath: '/assets/images/poster-placeholder.jpg',
      genres: ['Comedy', 'Drama', 'Fantasy'],
    },
    {
      id: '3',
      title: 'The Office',
      yearStarted: 2005,
      yearEnded: 2013,
      averageRating: 8.9,
      posterPath: 'https://www.themoviedb.org/t/p/w1280/dg9e5fPRRId8PoBE0F6jl5y85Eu.jpg',
      genres: ['Comedy', 'Mockumentary'],
    },
    {
      id: '4',
      title: 'Game of Thrones',
      yearStarted: 2011,
      yearEnded: 2019,
      averageRating: 9.3,
      posterPath: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      genres: ['Fantasy', 'Drama', 'Adventure'],
    },
    {
      id: '5',
      title: 'Six Feet Under',
      yearStarted: 2001,
      yearEnded: 2005,
      averageRating: 8.7,
      posterPath: '/assets/images/poster-placeholder.jpg',
      genres: ['Drama', 'Comedy'],
    },
    {
      id: '6',
      title: 'The Americans',
      yearStarted: 2013,
      yearEnded: 2018,
      averageRating: 8.4,
      posterPath: '/assets/images/poster-placeholder.jpg',
      genres: ['Drama', 'Thriller', 'Crime'],
    },
  ];

  filteredSeries = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.allSeries;
    }
    return this.allSeries.filter(
      (series) =>
        series.title.toLowerCase().includes(query) ||
        series.genres?.some((genre) => genre.toLowerCase().includes(query)),
    );
  });
}
