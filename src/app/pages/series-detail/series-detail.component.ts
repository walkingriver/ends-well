import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RatingsService } from '../../services/ratings';

export interface SeriesDetail {
  id: string;
  title: string;
  yearStarted: number;
  yearEnded?: number;
  averageRating: number;
  posterPath: string;
  backdropPath?: string;
  description: string;
  genres: string[];
  network?: string;
  seasons?: number;
  episodes?: number;
  starring?: string[];
  createdBy?: string[];
}

@Component({
  selector: 'app-series-detail',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './series-detail.component.html',
  styleUrl: './series-detail.component.scss',
})
export class SeriesDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ratingsService = inject(RatingsService);

  series = signal<SeriesDetail | null>(null);
  notFound = signal(false);
  userEndedWell = signal<boolean | null>(null);

  private readonly catalog: SeriesDetail[] = [
    {
      id: '1',
      title: 'Breaking Bad',
      yearStarted: 2008,
      yearEnded: 2013,
      averageRating: 9.5,
      posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      backdropPath: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
      description:
        "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      genres: ['Drama', 'Crime', 'Thriller'],
      network: 'AMC',
      seasons: 5,
      episodes: 62,
      starring: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      createdBy: ['Vince Gilligan'],
    },
    {
      id: '2',
      title: 'The Good Place',
      yearStarted: 2016,
      yearEnded: 2020,
      averageRating: 8.2,
      posterPath: '/assets/images/poster-placeholder.jpg',
      description:
        'Eleanor Shellstrop enters the afterlife and must hide her morally imperfect behavior.',
      genres: ['Comedy', 'Drama', 'Fantasy'],
      network: 'NBC',
      seasons: 4,
      episodes: 53,
      starring: ['Kristen Bell', 'Ted Danson', 'William Jackson Harper'],
      createdBy: ['Michael Schur'],
    },
    {
      id: '3',
      title: 'The Office',
      yearStarted: 2005,
      yearEnded: 2013,
      averageRating: 8.9,
      posterPath: 'https://www.themoviedb.org/t/p/w1280/dg9e5fPRRId8PoBE0F6jl5y85Eu.jpg',
      description:
        'A mockumentary on a group of typical office workers, where the workday consists of ego clashes and tedium.',
      genres: ['Comedy', 'Mockumentary'],
      network: 'NBC',
      seasons: 9,
      episodes: 201,
      starring: ['Steve Carell', 'Jenna Fischer', 'John Krasinski'],
      createdBy: ['Greg Daniels'],
    },
    {
      id: '4',
      title: 'Game of Thrones',
      yearStarted: 2011,
      yearEnded: 2019,
      averageRating: 9.3,
      posterPath: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      backdropPath: 'https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
      description:
        'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.',
      genres: ['Fantasy', 'Drama', 'Adventure'],
      network: 'HBO',
      seasons: 8,
      episodes: 73,
      starring: ['Emilia Clarke', 'Kit Harington', 'Peter Dinklage'],
      createdBy: ['David Benioff', 'D.B. Weiss'],
    },
    {
      id: '5',
      title: 'Six Feet Under',
      yearStarted: 2001,
      yearEnded: 2005,
      averageRating: 8.7,
      posterPath: '/assets/images/poster-placeholder.jpg',
      description:
        'A chronicle of the lives of the Fisher family who run a funeral home in Los Angeles.',
      genres: ['Drama', 'Comedy'],
      network: 'HBO',
      seasons: 5,
      episodes: 63,
      starring: ['Peter Krause', 'Michael C. Hall', 'Frances Conroy'],
      createdBy: ['Alan Ball'],
    },
    {
      id: '6',
      title: 'The Americans',
      yearStarted: 2013,
      yearEnded: 2018,
      averageRating: 8.4,
      posterPath: '/assets/images/poster-placeholder.jpg',
      description:
        'Two Soviet KGB officers pose as an American couple in the suburbs of Washington D.C.',
      genres: ['Drama', 'Thriller', 'Crime'],
      network: 'FX',
      seasons: 6,
      episodes: 75,
      starring: ['Keri Russell', 'Matthew Rhys', 'Holly Taylor'],
      createdBy: ['Joe Weisberg'],
    },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = this.catalog.find((s) => s.id === id) ?? null;
    this.series.set(found);
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
