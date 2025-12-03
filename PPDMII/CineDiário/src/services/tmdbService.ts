import axios from 'axios';

const TMDB_API_KEY = 'cca70717f0286dcafedac7d29c5f6c6e';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Tipos
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

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBSearchResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Cache de gêneros
let movieGenresCache: TMDBGenre[] | null = null;
let tvGenresCache: TMDBGenre[] | null = null;

// Funções auxiliares para imagens
export const getImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null): string | null => {
  return getImageUrl(path, 'w342');
};

export const getBackdropUrl = (path: string | null): string | null => {
  return getImageUrl(path, 'w780');
};

// API de Filmes
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        language: 'pt-BR',
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};

export const getPopularMovies = async (page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
        language: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    throw error;
  }
};

export const getTopRatedMovies = async (page: number = 1): Promise<TMDBSearchResult<TMDBMovie>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
        language: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar filmes mais votados:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number): Promise<TMDBMovie & { genres: TMDBGenre[] }> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    throw error;
  }
};

// API de Séries
export const searchSeries = async (query: string, page: number = 1): Promise<TMDBSearchResult<TMDBSeries>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        language: 'pt-BR',
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    throw error;
  }
};

export const getPopularSeries = async (page: number = 1): Promise<TMDBSearchResult<TMDBSeries>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
        language: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar séries populares:', error);
    throw error;
  }
};

export const getTopRatedSeries = async (page: number = 1): Promise<TMDBSearchResult<TMDBSeries>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
        language: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar séries mais votadas:', error);
    throw error;
  }
};

export const getSeriesDetails = async (seriesId: number): Promise<TMDBSeries & { genres: TMDBGenre[] }> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error);
    throw error;
  }
};

// Gêneros
export const getMovieGenres = async (): Promise<TMDBGenre[]> => {
  if (movieGenresCache) return movieGenresCache;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
      },
    });
    movieGenresCache = response.data.genres;
    return movieGenresCache!;
  } catch (error) {
    console.error('Erro ao buscar gêneros de filmes:', error);
    throw error;
  }
};

export const getTVGenres = async (): Promise<TMDBGenre[]> => {
  if (tvGenresCache) return tvGenresCache;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
      },
    });
    tvGenresCache = response.data.genres;
    return tvGenresCache!;
  } catch (error) {
    console.error('Erro ao buscar gêneros de séries:', error);
    throw error;
  }
};

// Função utilitária para obter nomes de gêneros a partir de IDs
export const getGenreNames = async (genreIds: number[], isMovie: boolean = true): Promise<string[]> => {
  try {
    const genres = isMovie ? await getMovieGenres() : await getTVGenres();
    return genreIds
      .map(id => genres.find(g => g.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  } catch (error) {
    console.error('Erro ao obter nomes de gêneros:', error);
    return [];
  }
};

// Busca multi (filmes e séries)
export const searchMulti = async (query: string, page: number = 1): Promise<TMDBSearchResult<TMDBMovie | TMDBSeries>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        language: 'pt-BR',
        include_adult: false,
      },
    });
    // Filtra apenas filmes e séries (exclui pessoas)
    const filteredResults = response.data.results.filter(
      (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
    );
    return {
      ...response.data,
      results: filteredResults,
    };
  } catch (error) {
    console.error('Erro ao buscar:', error);
    throw error;
  }
};
