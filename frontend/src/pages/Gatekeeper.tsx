import { FormEvent, useState } from 'react';
import { api } from '../services/api';

interface ValidationResult {
  valid: boolean;
  message: string;
  ticket?: {
    id: string;
    code: string;
    status: string;
  };
  event?: {
    title: string;
    eventDate: string;
    venue: string;
    room: string;
  };
  seat?: {
    row: string;
    number: number;
  };
}

export default function Gatekeeper() {
  const [qrToken, setQrToken] = useState('');
  const [result, setResult] =
    useState<ValidationResult | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleValidate(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!qrToken.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response =
        await api.post<ValidationResult>(
          '/tickets/validate',
          {
            qrToken: qrToken.trim(),
          },
        );

      setResult(response.data);
    } catch (error: any) {
      setResult({
        valid: false,
        message:
          error?.response?.data?.message ||
          'Ingresso inválido ou não encontrado.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="gatekeeper">
      <div className="gatekeeper-header">
        <h1>Elite Cinema</h1>
        <p>Validação de ingressos</p>
      </div>

      <section className="validator-card">
        <h2>Validar ingresso</h2>

        <p>
          Insira o código ou QR Token do
          ingresso.
        </p>

        <form onSubmit={handleValidate}>
          <input
            type="text"
            value={qrToken}
            onChange={(e) =>
              setQrToken(e.target.value)
            }
            placeholder="Cole o QR Token..."
            autoFocus
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Validando...'
              : 'Validar ingresso'}
          </button>
        </form>
      </section>

      {result && (
        <section
          className={
            result.valid
              ? 'validation-result valid'
              : 'validation-result invalid'
          }
        >
          <div className="result-icon">
            {result.valid ? '✓' : '✕'}
          </div>

          <h2>
            {result.valid
              ? 'Ingresso válido'
              : 'Ingresso inválido'}
          </h2>

          <p>{result.message}</p>

          {result.valid &&
            result.ticket && (
              <div className="ticket-info">
                <p>
                  <strong>Código:</strong>{' '}
                  {result.ticket.code}
                </p>

                {result.event && (
                  <>
                    <p>
                      <strong>Evento:</strong>{' '}
                      {result.event.title}
                    </p>

                    <p>
                      <strong>Data:</strong>{' '}
                      {new Date(
                        result.event.eventDate,
                      ).toLocaleString()}
                    </p>

                    <p>
                      <strong>Local:</strong>{' '}
                      {result.event.venue}
                    </p>

                    <p>
                      <strong>Sala:</strong>{' '}
                      {result.event.room}
                    </p>
                  </>
                )}

                {result.seat && (
                  <p>
                    <strong>Lugar:</strong>{' '}
                    {result.seat.row}
                    {result.seat.number}
                  </p>
                )}
              </div>
            )}
        </section>
      )}
    </main>
  );
}