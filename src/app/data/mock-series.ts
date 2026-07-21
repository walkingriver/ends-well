import { TvSeries } from '../models/tv-series.model';

/**
 * Placeholder images for series without TMDb URLs.
 *
 * TODO: These placeholder URLs will be replaced with real TMDb image paths
 * once we connect to the TMDb API. See Chapter XX for instructions on
 * obtaining your own API key from https://www.themoviedb.org/settings/api
 */
const posterPlaceholder = (title: string) =>
  `/assets/images/poster-placeholder.jpg`;

const backdropPlaceholder = (title: string) =>
  `/assets/images/backdrop-placeholder.jpg`;

/**
 * Mock data for TV series - used for development and teaching.
 * Uses actual TMDb image URLs where available, local placeholders otherwise.
 * In production, this would come from the TMDb API dynamically.
 */
export const MOCK_SERIES: TvSeries[] = [
  {
    id: "1",
    title: "Breaking Bad",
    yearStarted: 2008,
    yearEnded: 2013,
    ended: true,
    wasCanceled: false,
    averageRating: 9.5,
    totalRatings: 1500,
    genres: ["Drama", "Crime", "Thriller"],
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    posterPath:
      "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropPath:
      "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    network: "AMC",
    seasons: 5,
    episodes: 62,
    createdBy: ["Vince Gilligan"],
    starring: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
    imdbId: "tt0903747",
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    title: "The Good Place",
    yearStarted: 2016,
    yearEnded: 2020,
    ended: true,
    wasCanceled: false,
    averageRating: 8.2,
    totalRatings: 800,
    genres: ["Comedy", "Drama", "Fantasy"],
    description:
      "Eleanor Shellstrop, an ordinary woman who, through an administrative error, enters the afterlife and must hide her morally imperfect behavior.",
    posterPath: posterPlaceholder("The Good Place"),
    backdropPath: backdropPlaceholder("The Good Place"),
    network: "NBC",
    seasons: 4,
    episodes: 53,
    createdBy: ["Michael Schur"],
    starring: ["Kristen Bell", "Ted Danson", "William Jackson Harper"],
    imdbId: "tt4955642",
    trailerUrl: "https://www.youtube.com/watch?v=RfBgT5djaQw",
    createdAt: new Date("2020-01-02"),
    updatedAt: new Date("2023-01-02"),
  },
  {
    id: "3",
    title: "The Office",
    yearStarted: 2005,
    yearEnded: 2013,
    ended: true,
    wasCanceled: false,
    averageRating: 8.9,
    totalRatings: 1800,
    genres: ["Comedy", "Mockumentary"],
    description:
      "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    posterPath:
      "https://www.themoviedb.org/t/p/w1280/dg9e5fPRRId8PoBE0F6jl5y85Eu.jpg",
    backdropPath:
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/bY2J2Jq8rSrKm5xCFtzYzqFh44o.jpg",
    network: "NBC",
    seasons: 9,
    episodes: 201,
    createdBy: ["Greg Daniels", "Ricky Gervais", "Stephen Merchant"],
    starring: ["Steve Carell", "Jenna Fischer", "John Krasinski"],
    imdbId: "tt0386676",
    trailerUrl: "https://www.youtube.com/watch?v=UZjdzprWmOw",
    createdAt: new Date("2020-01-03"),
    updatedAt: new Date("2023-01-03"),
  },
  {
    id: "4",
    title: "Game of Thrones",
    yearStarted: 2011,
    yearEnded: 2019,
    ended: true,
    wasCanceled: false,
    averageRating: 9.3,
    totalRatings: 2000,
    genres: ["Fantasy", "Drama", "Adventure"],
    description:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    posterPath:
      "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdropPath:
      "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    network: "HBO",
    seasons: 8,
    episodes: 73,
    createdBy: ["David Benioff", "D.B. Weiss"],
    starring: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
    imdbId: "tt0944947",
    trailerUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ",
    createdAt: new Date("2020-01-04"),
    updatedAt: new Date("2023-01-04"),
  },
  {
    id: "5",
    title: "Six Feet Under",
    yearStarted: 2001,
    yearEnded: 2005,
    ended: true,
    wasCanceled: false,
    averageRating: 8.7,
    totalRatings: 600,
    genres: ["Drama", "Comedy"],
    description:
      "A chronicle of the lives of the Fisher family who run a funeral home in Los Angeles.",
    posterPath: posterPlaceholder("Six Feet Under"),
    backdropPath: backdropPlaceholder("Six Feet Under"),
    network: "HBO",
    seasons: 5,
    episodes: 63,
    createdBy: ["Alan Ball"],
    starring: ["Peter Krause", "Michael C. Hall", "Frances Conroy"],
    imdbId: "tt0248654",
    trailerUrl: "https://www.youtube.com/watch?v=GvLkVbYEhVU",
    createdAt: new Date("2020-01-05"),
    updatedAt: new Date("2023-01-05"),
  },
  {
    id: "6",
    title: "The Americans",
    yearStarted: 2013,
    yearEnded: 2018,
    ended: true,
    wasCanceled: false,
    averageRating: 8.4,
    totalRatings: 500,
    genres: ["Drama", "Thriller", "Crime"],
    description:
      "Two Soviet KGB officers pose as an idealistic American couple living in the suburbs of Washington D.C. during the Reagan era.",
    posterPath: posterPlaceholder("The Americans"),
    backdropPath: backdropPlaceholder("The Americans"),
    network: "FX",
    seasons: 6,
    episodes: 75,
    createdBy: ["Joe Weisberg"],
    starring: ["Keri Russell", "Matthew Rhys", "Holly Taylor"],
    imdbId: "tt2149175",
    trailerUrl: "https://www.youtube.com/watch?v=JNVBqmXYaM0",
    createdAt: new Date("2020-01-06"),
    updatedAt: new Date("2023-01-06"),
  },
  {
    id: "7",
    title: "Star Trek: The Next Generation",
    yearStarted: 1987,
    yearEnded: 1994,
    ended: true,
    wasCanceled: false,
    averageRating: 8.7,
    totalRatings: 1200,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    description:
      "Set almost 100 years after Captain Kirk's five-year mission, a new generation of Starfleet officers set off in the U.S.S. Enterprise-D on their own mission to go where no one has gone before.",
    posterPath: posterPlaceholder("Star Trek TNG"),
    backdropPath: backdropPlaceholder("Star Trek TNG"),
    network: "Syndication",
    seasons: 7,
    episodes: 178,
    createdBy: ["Gene Roddenberry"],
    starring: ["Patrick Stewart", "Jonathan Frakes", "Brent Spiner"],
    imdbId: "tt0092455",
    trailerUrl: "https://www.youtube.com/watch?v=HnDtvZXYHgE",
    createdAt: new Date("2020-01-07"),
    updatedAt: new Date("2023-01-07"),
  },
  {
    id: "8",
    title: "M*A*S*H",
    yearStarted: 1972,
    yearEnded: 1983,
    ended: true,
    wasCanceled: false,
    averageRating: 8.4,
    totalRatings: 900,
    genres: ["Comedy", "Drama", "War"],
    description:
      "The staff of a Korean War field hospital use humor and hijinks to keep their sanity in the face of the horror of war.",
    posterPath: posterPlaceholder("MASH"),
    backdropPath: backdropPlaceholder("MASH"),
    network: "CBS",
    seasons: 11,
    episodes: 256,
    createdBy: ["Larry Gelbart"],
    starring: ["Alan Alda", "Loretta Swit", "Jamie Farr"],
    imdbId: "tt0068098",
    trailerUrl: "https://www.youtube.com/watch?v=bnHisRxQXgA",
    createdAt: new Date("2020-01-08"),
    updatedAt: new Date("2023-01-08"),
  },
  {
    id: "9",
    title: "Dexter",
    yearStarted: 2006,
    yearEnded: 2013,
    ended: true,
    wasCanceled: false,
    averageRating: 8.7,
    totalRatings: 1100,
    genres: ["Crime", "Drama", "Mystery"],
    description:
      "By day, mild-mannered Dexter Morgan is a blood-spatter analyst for the Miami Metro Police. But at night, he is a serial killer who only targets other murderers.",
    posterPath: posterPlaceholder("Dexter"),
    backdropPath: backdropPlaceholder("Dexter"),
    network: "Showtime",
    seasons: 8,
    episodes: 96,
    createdBy: ["James Manos Jr."],
    starring: ["Michael C. Hall", "Jennifer Carpenter", "David Zayas"],
    imdbId: "tt0773262",
    trailerUrl: "https://www.youtube.com/watch?v=YQeUmSD1c3g",
    createdAt: new Date("2020-01-09"),
    updatedAt: new Date("2023-01-09"),
  },
  {
    id: "10",
    title: "How I Met Your Mother",
    yearStarted: 2005,
    yearEnded: 2014,
    ended: true,
    wasCanceled: false,
    averageRating: 8.3,
    totalRatings: 1400,
    genres: ["Comedy", "Romance"],
    description:
      "A father recounts to his children - through a series of flashbacks - the journey he and his four best friends took leading up to him meeting their mother.",
    posterPath: posterPlaceholder("HIMYM"),
    backdropPath: backdropPlaceholder("HIMYM"),
    network: "CBS",
    seasons: 9,
    episodes: 208,
    createdBy: ["Carter Bays", "Craig Thomas"],
    starring: ["Josh Radnor", "Jason Segel", "Neil Patrick Harris"],
    imdbId: "tt0460649",
    trailerUrl: "https://www.youtube.com/watch?v=j2Uy0qd7zNk",
    createdAt: new Date("2020-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
];

/**
 * Get featured series for the home page
 */
export function getFeaturedSeries(): TvSeries[] {
  return MOCK_SERIES.filter((s) => s.ended && !s.wasCanceled).slice(0, 5);
}

/**
 * Get a series by ID
 */
export function getSeriesById(id: string): TvSeries | undefined {
  return MOCK_SERIES.find((s) => s.id === id);
}
