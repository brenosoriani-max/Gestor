import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import styles from './Login.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Gestor</h1>
        <p className={styles.subtitle}>Sistema de Gerenciamento Financeiro</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} size="lg">
            Entrar
          </Button>
        </form>

        <p className={styles.footer}>
          Não tem conta? <Link to="/register">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}
