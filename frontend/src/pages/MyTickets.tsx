import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface Ticket {
  id: string;
  code: string;
  status: string;

 reservation: {

    event: {
    id: string;
    title: string;
    eventDate: string;
    venue: string;
    room: string;
    movie: {
      title: string;
      posterPath?: string;
    };
  };

  seat: {
    row: string;
    number: number;
  };

 }

}

export default function MyTickets() {
  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem('user') || 'null',
    );

    if (!user) {
      setError('Faça login para ver os seus ingressos.');
      setLoading(false);
      return;
    }

    api
      .get<Ticket[]>(
        `/tickets/user/${user.id}`,
      )
      .then((response) => {
        setTickets(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setError(
          error?.response?.data?.message ||
            'Não foi possível carregar os ingressos.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main>
        <p>Carregando seus ingressos...</p>
      </main>
    );
  }

  return (
    <main className="tickets-page">
      <header className="dashboard-header">
        <div>
          <h1>Meus ingressos</h1>

          <p>
            Consulte os seus ingressos
            adquiridos.
          </p>
        </div>

        <Link to="/events">
          Comprar ingresso
        </Link>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {!error && tickets.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum ingresso encontrado</h2>

          <p>
            Ainda não compraste nenhum ingresso.
          </p>

          <Link to="/events">
            Ver eventos
          </Link>
        </div>
      )}

      <section className="tickets-grid">
        {tickets.map((ticket) => (
          <article
            className="ticket-card"
            key={ticket.id}
          >
            {ticket.reservation.event.movie
              .posterPath && (
              <img
                src={`https://image.tmdb.org/t/p/w300${ticket.reservation.event.movie.posterPath}`}
                alt={
                  ticket.reservation.event.movie.title
                }
              />
            )}

            <div className="ticket-card-content">
              <span
                className={`ticket-status ${ticket.status.toLowerCase()}`}
              >
                {ticket.status}
              </span>

              <h2>
                {ticket.reservation.event.movie.title}
              </h2>

              <p>
                {ticket.reservation.event.title}
              </p>

              <p>
                📅{' '}
                {new Date(
                  ticket.reservation.event.eventDate,
                ).toLocaleString()}
              </p>

              <p>
                📍 {ticket.reservation.event.venue} ·{' '}
                {ticket.reservation.event.room}
              </p>

              <p>
                💺 Lugar:{' '}
                <strong>
                  {ticket.reservation.seat.row}
                  {ticket.reservation.seat.number}
                </strong>
              </p>

              <Link
                to={`/tickets/${ticket.id}`}
              >
                Ver ingresso
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}