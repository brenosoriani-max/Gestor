import { MainLayout } from '@/components/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, ArrowLeft } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Informações gerais da sua conta de usuário
          </p>
        </div>

        <Card className="border-border/80 bg-card/70 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6 border-b border-border/40">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-1 shadow-xl shadow-indigo-500/25">
              <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-3xl font-bold text-foreground">
                {user?.name?.charAt(0).toUpperCase() || <User className="h-10 w-10 text-primary" />}
              </div>
            </div>
            <div className="mt-4">
              <CardTitle className="text-xl font-bold text-foreground">{user?.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{user?.email}</CardDescription>
            </div>
            <div className="pt-2 flex justify-center">
              <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'} className="px-3 py-1 text-xs">
                {user?.role || 'FREE'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Nome Completo</p>
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Email de Acesso</p>
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Nível de Permissão</p>
                <p className="text-sm font-medium text-foreground">{user?.role || 'Usuário Padrão'}</p>
              </div>
            </div>

            {user?.createdAt && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Membro desde</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 flex justify-end">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
