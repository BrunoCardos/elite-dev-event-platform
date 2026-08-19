import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Event } from '../types';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main>
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Gestão de sessões</p>
        </div>

        <Link to="/admin/events/new">
          + Criar evento
        </Link>
      </header>

      {loading ? (
        <p>Carregando eventos...</p>
      ) : (
        <section>
          <h2>Eventos publicados</h2>

          {events.length === 0 ? (
            <p>
              Ainda não existem eventos.
            </p>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <article
                  className="event-card"
                  key={event.id}
                >
                  {event.movie.posterPath && (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${event.movie.posterPath}`}
                      alt={event.movie.title}
                    />
                  )}

                  <div>
                    <h3>
                      {event.movie.title}
                    </h3>

                    <p>{event.title}</p>

                    <p>
                      {event.venue} · {event.room}
                    </p>

                    <p>
                      {new Date(
                        event.eventDate,
                      ).toLocaleString()}
                    </p>

                    <p>
                      Capacidade:{' '}
                      {event.capacity}
                    </p>

                    <strong>
                      €{event.price}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}