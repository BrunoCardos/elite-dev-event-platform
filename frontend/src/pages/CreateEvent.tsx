import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Movie } from '../types';

export default function CreateEvent() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const [eventDate, setEventDate] =
    useState('');

  const [venue, setVenue] = useState('');
  const [room, setRoom] = useState('');
  const [price, setPrice] = useState('15');

  const [rows, setRows] = useState('A,B,C,D,E');
  const [seatsPerRow, setSeatsPerRow] =
    useState('10');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function searchMovies() {
    if (!query.trim()) return;

    try {
      const response = await api.get<Movie[]>(
        '/movies/search',
        {
          params: {
            query,
          },
        },
      );

      setMovies(response.data);
    } catch {
      setError(
        'Não foi possível pesquisar filmes.',
      );
    }
  }

  function selectMovie(movie: Movie) {
    setSelectedMovie(movie);
    setTitle(
      `${movie.title} - Special Screening`,
    );
    setDescription(
      movie.overview || '',
    );
    setMovies([]);
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!selectedMovie) {
      setError('Selecione um filme.');
      return;
    }

    const user = JSON.parse(
      localStorage.getItem('user') || 'null',
    );

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/events', {
        tmdbId: selectedMovie.id,
        organizerId: user.id,
        title,
        description,
        eventDate,
        venue,
        room,
        price: Number(price),
        rows: rows
          .split(',')
          .map((row) => row.trim())
          .filter(Boolean),
        seatsPerRow: Number(seatsPerRow),
      });

      navigate('/admin');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Não foi possível criar o evento.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-event">
      <h1>Criar novo evento</h1>

      <section>
        <h2>1. Escolher filme</h2>

        <div className="movie-search">
          <input
            value={query}
            placeholder="Pesquisar filme..."
            onChange={(e) =>
              setQuery(e.target.value)
            }
          />

          <button
            type="button"
            onClick={searchMovies}
          >
            Pesquisar
          </button>
        </div>

        {movies.length > 0 && (
          <div className="movie-results">
            {movies
              .slice(0, 6)
              .map((movie) => (
                <button
                  type="button"
                  className="movie-result"
                  key={movie.tmdbId}
                  onClick={() =>
                    selectMovie(movie)
                  }
                >
                  {movie.posterPath && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                      alt={movie.title}
                    />
                  )}

                  <span>
                    {movie.title}
                  </span>
                </button>
              ))}
          </div>
        )}

        {selectedMovie && (
          <div className="selected-movie">
            <strong>
              Filme selecionado:
            </strong>{' '}
            {selectedMovie.title}
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <h2>2. Informações da sessão</h2>

        <label>
          Título
          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
        </label>

        <label>
          Descrição
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </label>

        <label>
          Data e hora
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) =>
              setEventDate(e.target.value)
            }
            required
          />
        </label>

        <label>
          Local
          <input
            value={venue}
            onChange={(e) =>
              setVenue(e.target.value)
            }
            placeholder="Elite Cinema"
            required
          />
        </label>

        <label>
          Sala
          <input
            value={room}
            onChange={(e) =>
              setRoom(e.target.value)
            }
            placeholder="Sala 1"
            required
          />
        </label>

        <label>
          Preço
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            required
          />
        </label>

        <h2>3. Mapa de lugares</h2>

        <label>
          Filas
          <input
            value={rows}
            onChange={(e) =>
              setRows(e.target.value)
            }
            placeholder="A,B,C,D,E"
            required
          />
        </label>

        <label>
          Lugares por fila
          <input
            type="number"
            min="1"
            value={seatsPerRow}
            onChange={(e) =>
              setSeatsPerRow(e.target.value)
            }
            required
          />
        </label>

        <p>
          Capacidade:{' '}
          <strong>
            {rows
              .split(',')
              .filter((r) => r.trim()).length *
              Number(seatsPerRow || 0)}
          </strong>{' '}
          lugares
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Criando...'
            : 'Publicar evento'}
        </button>
      </form>
    </main>
  );
}