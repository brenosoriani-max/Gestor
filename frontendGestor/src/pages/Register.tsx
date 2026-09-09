import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '@/services';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import styles from './Register.module.css';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'Email é obrigatório';
    if (password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não conferem';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await authService.register({
        name,
        email,
        password,
      });
      toast.success('Cadastro realizado com sucesso! Faça login para continuar');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Gestor</h1>
        <p className={styles.subtitle}>Crie sua conta</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <Button type="submit" isLoading={loading} size="lg">
            Cadastrar
          </Button>
        </form>

        <p className={styles.footer}>
          Já tem conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
}
