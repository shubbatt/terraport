import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-wrap">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Terraport Logistics" style={{ height: '40px' }} />
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#services">Services</a>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/upload" className="btn btn-outline-dark">Upload Documents</Link>
              <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
              <div className="user-avatar" title={user?.name}>
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="btn-icon" title="Logout">
                <LogOut size={20} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-dark">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
