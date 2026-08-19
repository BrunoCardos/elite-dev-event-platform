import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../services/api';
import LogoutButton from '../components/LogoutButton';

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
  const [scannerActive, setScannerActive] =
    useState(false);

  const scannerRef =
    useRef<Html5Qrcode | null>(null);

  async function validateTicket(token: string) {
    if (!token.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const user = JSON.parse(
        localStorage.getItem('user') || 'null',
      );

      console.log(user)

      const response = await api.post<ValidationResult>(
        '/tickets/validate',
        {
          qrToken: token.trim(),
          gatekeeperId: user?.id,
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

  async function startScanner() {
    if (scannerActive) return;

    const scanner = new Html5Qrcode(
      'qr-reader',
    );

    scannerRef.current = scanner;

    setScannerActive(true);

    try {
      await scanner.start(
        {
          facingMode: 'environment',
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          setQrToken(decodedText);

          await scanner.stop();

          scanner.clear();

          scannerRef.current = null;
          setScannerActive(false);

          await validateTicket(decodedText);
        },
        () => { },
      );
    } catch {
      setScannerActive(false);

      setResult({
        valid: false,
        message:
          'Não foi possível acessar a câmera.',
      });
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch { }

    scannerRef.current = null;
    setScannerActive(false);
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => { });
      }
    };
  }, []);

  function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    validateTicket(qrToken);
  }

  return (
    <main className="gatekeeper">
      <Link to="/events">
        ← Voltar
      </Link>

      <div className="gatekeeper-header">
        <h1>Elite Cinema</h1>
        <p>Validação de ingressos</p>
      </div>
      <LogoutButton />


      <section className="validator-card">
        <h2>Validar ingresso</h2>

        <button
          type="button"
          onClick={
            scannerActive
              ? stopScanner
              : startScanner
          }
        >
          {scannerActive
            ? 'Parar câmera'
            : '📷 Ler QR Code'}
        </button>

        <div
          id="qr-reader"
          style={{
            width: '100%',
            maxWidth: '500px',
            margin: '20px auto',
          }}
        />

        <div className="divider">
          ou
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={qrToken}
            onChange={(e) =>
              setQrToken(e.target.value)
            }
            placeholder="Cole o QR Token..."
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