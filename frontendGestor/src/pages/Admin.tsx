import { MainLayout } from '@/components/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/Button';
import { Users, Wrench, Settings, BarChart2, ShieldAlert } from 'lucide-react';

export function Admin() {
  const sections = [
    {
      title: 'Gerenciar Usuários',
      description: 'Adicionar, editar e remover usuários do sistema.',
      icon: Users,
      actionText: 'Gerenciar',
    },
    {
      title: 'Gerenciar Técnicos',
      description: 'Gerenciar técnicos e suas atribuições de serviço.',
      icon: Wrench,
      actionText: 'Gerenciar',
    },
    {
      title: 'Configurações do Sistema',
      description: 'Configurar parâmetros gerais e regras de negócio.',
      icon: Settings,
      actionText: 'Configurar',
    },
    {
      title: 'Relatórios Avançados',
      description: 'Visualizar relatórios administrativos e estatísticas.',
      icon: BarChart2,
      actionText: 'Visualizar',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-primary" />
            Painel de Administração
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Módulo de controle administrativo e configurações globais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="hover:border-primary/50 transition-all shadow-xl flex flex-col justify-between">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {section.actionText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
