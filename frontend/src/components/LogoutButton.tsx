import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/login');
  }

  return (
    <button onClick={logout}>
      Sair
    </button>
  );
}