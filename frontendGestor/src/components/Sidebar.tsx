import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gestor</h1>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navItem} onClick={() => setIsOpen(false)}>
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/operations" className={styles.navItem} onClick={() => setIsOpen(false)}>
            <span>Operações</span>
          </Link>

          <Link to="/categories" className={styles.navItem} onClick={() => setIsOpen(false)}>
            <span>Categorias</span>
          </Link>

          <Link to="/banks" className={styles.navItem} onClick={() => setIsOpen(false)}>
            <span>Bancos</span>
          </Link>

          <Link to="/reports" className={styles.navItem} onClick={() => setIsOpen(false)}>
            <span>Relatórios</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <Link to="/admin" className={styles.navItem} onClick={() => setIsOpen(false)}>
              <span>Administração</span>
            </Link>
          )}
        </nav>

        <div className={styles.footer}>
          <Link to="/profile" className={styles.userInfo} onClick={() => setIsOpen(false)}>
            <User size={20} />
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </Link>

          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}
