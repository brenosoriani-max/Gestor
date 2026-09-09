import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { reportsService } from '@/services';
import { Report } from '@/types';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, FileBarChart2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getAll();
      setReports(data || []);
    } catch (error) {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Relatórios Financeiros
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidados mensais e históricos de desempenho
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Carregando relatórios...</span>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="relative overflow-hidden border-border/80 hover:border-primary/40 transition-all shadow-xl">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <FileBarChart2 className="h-5 w-5 text-primary" />
                      {report.title || `Relatório #${report.id.substring(0, 6)}`}
                    </CardTitle>
                    <Badge variant={report.balance >= 0 ? 'success' : 'destructive'}>
                      {report.balance >= 0 ? 'Superávit' : 'Déficit'}
                    </Badge>
                  </div>
                  {report.startDate && report.endDate && (
                    <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(report.startDate).toLocaleDateString('pt-BR')} —{' '}
                        {new Date(report.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      Receita Total
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(report.totalIncome)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      Despesa Total
                    </span>
                    <span className="font-semibold text-red-400">
                      {formatCurrency(report.totalExpense)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-primary" />
                      Saldo do Período
                    </span>
                    <span className={`font-bold text-base ${report.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(report.balance)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 text-muted-foreground">
            Nenhum relatório consolidado no momento.
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
