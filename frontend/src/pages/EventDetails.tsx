import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Event, Seat } from '../types';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedSeat, setSelectedSeat] =
    useState<Seat | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    api
      .get<Event>(`/events/${id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch(() => {
        setError('Não foi possível carregar o evento.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Carregando sessão...</p>;
  }

  if (error || !event) {
    return (
      <main>
        <p>{error || 'Evento não encontrado.'}</p>
        <Link to="/events">Voltar</Link>
      </main>
    );
  }

  const handleContinue = () => {
    if (!selectedSeat) {
      alert('Selecione um lugar.');
      return;
    }

    navigate(`/checkout`, {
      state: {
        event,
        seat: selectedSeat,
      },
    });
  };

  return (
    <main className="event-details">
      <Link to="/events">← Voltar aos eventos</Link>

      <section className="event-header">
        {event.movie.posterPath && (
          <img
            src={`https://image.tmdb.org/t/p/w500${event.movie.posterPath}`}
            alt={event.movie.title}
          />
        )}

        <div>
          <h1>{event.movie.title}</h1>

          <h2>{event.title}</h2>

          <p>{event.description}</p>

          <p>
            📅{' '}
            {new Date(
              event.eventDate,
            ).toLocaleString()}
          </p>

          <p>
            📍 {event.venue} · {event.room}
          </p>

          <p>
            💰 €{event.price}
          </p>
        </div>
      </section>

      <section>
        <h2>Escolha o seu lugar</h2>

        <div className="screen">
          ECRÃ
        </div>

        <div className="seat-map">
          {event.seats.map((seat) => (
            <button
              key={seat.id}
              className={
                selectedSeat?.id === seat.id
                  ? 'seat selected'
                  : 'seat'
              }
              disabled={
                seat.status !== 'AVAILABLE'
              }
              onClick={() =>
                setSelectedSeat(seat)
              }
            >
              {seat.row}
              {seat.number}
            </button>
          ))}
        </div>

        {selectedSeat && (
          <div className="selection">
            <p>
              Lugar selecionado:{' '}
              <strong>
                {selectedSeat.row}
                {selectedSeat.number}
              </strong>
            </p>

            <button onClick={handleContinue}>
              Continuar — €{event.price}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}