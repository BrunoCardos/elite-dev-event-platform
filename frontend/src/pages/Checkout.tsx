import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Event, Seat } from '../types';

interface CheckoutState {
  event: Event;
  seat: Seat;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as CheckoutState | null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!state) {
    return (
      <main>
        <h1>Checkout</h1>
        <p>Reserva não encontrada.</p>
      </main>
    );
  }

  const { event, seat } = state;

  const user = JSON.parse(
    localStorage.getItem('user') || 'null',
  );

  async function handlePayment() {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Criar reserva
      const reservationResponse =
        await api.post('/reservations', {
          userId: user.id,
          eventId: event.id,
          seatId: seat.id,
        });

      const reservation =
        reservationResponse.data;

      // 2. Efetuar pagamento
      const paymentResponse =
        await api.post(
          `/payments/${reservation.id}`,
        );

      // 3. Ir para ticket
      navigate(
        `/tickets/${paymentResponse.data.ticket.id}`,
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Não foi possível concluir a compra.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="checkout">
      <h1>Confirmar compra</h1>

      <div className="checkout-card">
        <h2>{event.movie.title}</h2>

        <p>{event.title}</p>

        <hr />

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
          💺 Lugar:{' '}
          <strong>
            {seat.row}
            {seat.number}
          </strong>
        </p>

        <h2>
          Total: €{event.price}
        </h2>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
        >
          {loading
            ? 'Processando...'
            : 'Confirmar e pagar'}
        </button>
      </div>
    </main>
  );
}