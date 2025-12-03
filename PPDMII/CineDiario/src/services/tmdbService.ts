// The Movie Database (TMDB) API Service
const TMDB_API_KEY = 'cca70717f0286dcafedac7d29c5f6c6e';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Tamanhos de imagem disponíveis: w92, w154, w185, w342, w500, w780, original
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface TMDBSeries {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  origin_country: string[];
  original_language: string;
}

export interface TMDBSearchResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

// Cache de gêneros
let movieGenresCache: TMDBGenre[] = [];
let tvGenresCache: TMDBGenre[] = [];

// Buscar gêneros de filmes
export const getMovieGenres = async (): Promise<TMDBGenre[]> => {
  if (movieGenresCache.length > 0) return movieGenresCache;
  
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    movieGenresCache = data.genres;
    return movieGenresCache;
  } catch (error) {
    console.error('Erro ao buscar gêneros de filmes:', error);
    return [];
  }
};

// Buscar gêneros de séries
export const getTVGenres = async (): Promise<TMDBGenre[]> => {
  if (tvGenresCache.length > 0) return tvGenresCache;
  
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    tvGenresCache = data.genres;
    return tvGenresCache;
  } catch (error) {
    console.error('Erro ao buscar gêneros de séries:', error);
    return [];
  }
};

// Buscar filmes populares
export const getPopularMovies = async (page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar séries populares
export const getPopularSeries = async (page: number = 1): Promise<TMDBSearchResult<TMDBSeries>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar séries populares:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar filmes por texto
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar séries por texto
export const searchSeries = async (query: string, page: number = 1): Promise<TMDBSearchResult<TMDBSeries>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar detalhes de um filme
export const getMovieDetails = async (movieId: number): Promise<TMDBMovie & { genres: TMDBGenre[] } | null> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return null;
  }
};

// Buscar detalhes de uma série
export const getSeriesDetails = async (seriesId: number): Promise<TMDBSeries & { genres: TMDBGenre[] } | null> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error);
    return null;
  }
};

// Buscar filmes em cartaz
export const getNowPlayingMovies = async (page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar filmes em cartaz:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar filmes mais bem avaliados
export const getTopRatedMovies = async (page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar filmes mais bem avaliados:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar séries mais bem avaliadas
export const getTopRatedSeries = async (page: number = 1): Promise<TMDBSearchResult<TMDBSeries>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar séries mais bem avaliadas:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Buscar filmes e séries (multi search)
export const searchMulti = async (query: string, page: number = 1): Promise<TMDBSearchResult<TMDBMovie | TMDBSeries>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Converter nome do gênero do TMDB para o formato local
export const getGenreName = async (genreIds: number[], isMovie: boolean = true): Promise<string> => {
  const genres = isMovie ? await getMovieGenres() : await getTVGenres();
  const genre = genres.find(g => genreIds.includes(g.id));
  return genre?.name || 'Outro';
};
