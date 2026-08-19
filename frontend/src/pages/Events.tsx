import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Event } from '../types';
import LogoutButton from '../components/LogoutButton';

export default function Events() {
  const [events, setEvents] = useState<Event[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    api
      .get<Event[]>('/events')
      .then((response) => {
        setEvents(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Carregando eventos...</p>;
  }

  return (
    <main>
     <header className="dashboard-header">
  <div>
    <h1>Elite Cinema</h1>
    <p>Escolha a sua próxima sessão</p>
  </div>

  <div>
    <Link to="/tickets">
      Meus ingressos
    </Link>
  </div>

  <LogoutButton />
</header>

      <section className="events-grid">
        {events.map((event) => (
          <article
            className="event-card"
            key={event.id}
          >
            {event.movie.posterPath && (
              <img
                src={`https://image.tmdb.org/t/p/w500${event.movie.posterPath}`}
                alt={event.movie.title}
              />
            )}

            <div>
              <h2>
                {event.movie.title}
              </h2>

              <p>{event.title}</p>

              <p>
                {new Date(
                  event.eventDate,
                ).toLocaleString()}
              </p>

              <p>
                {event.venue} · {event.room}
              </p>

              <strong>
                €{event.price}
              </strong>

              <Link
                to={`/events/${event.id}`}
              >
                Ver sessão
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}