import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🌐</span>
        <span className="brand-name">LinguaFlow</span>
      </div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Translate</Link>
        <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>History</Link>
      </div>
      <div className="navbar-user">
        <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
        <span className="user-name">{user?.name}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
