import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '@/services';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-border/80 bg-card/80 backdrop-blur-xl relative z-10 my-8">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Criar Conta
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Comece a controlar suas finanças hoje mesmo
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" isLoading={loading} size="lg" className="w-full mt-4">
              Criar Conta
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Faça login aqui
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
