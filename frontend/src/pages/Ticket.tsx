import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

interface TicketData {
  ticketId: string;
  code: string;
  qrToken: string;
  qrCode: string;
}

export default function Ticket() {
  const { id } = useParams();

  const [ticket, setTicket] =
    useState<TicketData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get<TicketData>(`/tickets/${id}/qr`)
      .then((response) => {
        setTicket(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Gerando ingresso...</p>;
  }

  if (!ticket) {
    return <p>Ingresso não encontrado.</p>;
  }

  return (
    <main className="ticket-page">
      <div className="ticket">
        <div>
          <span>ELITE CINEMA</span>

          <h1>Ingresso confirmado 🎟️</h1>

          <p>
            Código:
            <strong>{ticket.code}</strong>
          </p>
        </div>

        <div className="qr">
          <img
            src={ticket.qrCode}
            alt="QR Code do ingresso"
          />
        </div>

        <p>
          Apresente este QR Code na entrada.
        </p>

        <Link to="/events">
          Comprar outro ingresso
        </Link>
      </div>
    </main>
  );
}