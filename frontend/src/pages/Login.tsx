import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { LoginResponse } from '../types';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    'customer1@test.com',
  );

  const [password, setPassword] = useState(
    'Password123!',
  );

  const [error, setError] = useState('');

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();
    setError('');

    try {
      const { data } =
        await api.post<LoginResponse>(
          '/auth/login',
          {
            email,
            password,
          },
        );

      localStorage.setItem(
        'accessToken',
        data.accessToken,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      if (data.user.role === 'ORGANIZER') {
        navigate('/admin');
      } else if (
        data.user.role === 'GATEKEEPER'
      ) {
        navigate('/gatekeeper');
      } else {
        navigate('/events');
      }
    } catch {
      setError(
        'Email ou password inválidos.',
      );
    }
  }

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <h1>Elite Cinema</h1>

        <p>
          Entre na sua conta
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}