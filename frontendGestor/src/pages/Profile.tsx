import { MainLayout } from '@/components/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1>Meu Perfil</h1>

        <div className={styles.card}>
          <div className={styles.avatar}>
            {user?.image ? (
              <img src={user.image} alt={user.name} />
            ) : (
              <div className={styles.initials}>{user?.name?.charAt(0).toUpperCase()}</div>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.field}>
              <label>Nome</label>
              <p>{user?.name}</p>
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <p>{user?.email}</p>
            </div>

            <div className={styles.field}>
              <label>Função</label>
              <p>{user?.role}</p>
            </div>

            {user?.phone && (
              <div className={styles.field}>
                <label>Telefone</label>
                <p>{user.phone}</p>
              </div>
            )}

            <div className={styles.field}>
              <label>Membro desde</label>
              <p>{new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
