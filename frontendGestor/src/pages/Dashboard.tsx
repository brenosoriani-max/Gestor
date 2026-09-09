import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { operationsService, reportsService } from '@/services';
import { Operation, Report } from '@/types';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Loader2, Calendar } from 'lucide-react';

export function Dashboard() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [opsData, reportData] = await Promise.all([
          operationsService.getAll(),
          reportsService.getAll().then((data) => data[0]),
        ]);
        setOperations(opsData || []);
        setReport(reportData || null);
      } catch (error) {
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visão geral do seu fluxo financeiro mensal
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/60 px-3.5 py-1.5 rounded-xl border border-border/60">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Carregando dados financeiros...</span>
          </div>
        ) : (
          <>
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Receitas */}
              <Card className="relative overflow-hidden border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Total
                  </CardTitle>
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(report?.totalIncome)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400/80 mt-1 font-medium">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>Entradas do mês</span>
                  </div>
                </CardContent>
              </Card>

              {/* Despesas */}
              <Card className="relative overflow-hidden border-red-500/20 bg-red-500/5 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Despesa Total
                  </CardTitle>
                  <div className="h-9 w-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {formatCurrency(report?.totalExpense)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-red-400/80 mt-1 font-medium">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    <span>Saídas do mês</span>
                  </div>
                </CardContent>
              </Card>

              {/* Saldo Líquido */}
              <Card className="relative overflow-hidden border-primary/30 bg-primary/5 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo Total
                  </CardTitle>
                  <div className="h-9 w-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                    <Wallet className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${(report?.balance || 0) < 0 ? 'text-red-400' : 'text-primary'}`}>
                    {formatCurrency(report?.balance)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Balanço atual
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Operations Table */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Operações Recentes</CardTitle>
                <CardDescription>
                  Últimas 10 movimentações cadastradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {operations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {operations.slice(0, 10).map((op) => (
                        <TableRow key={op.id}>
                          <TableCell className="font-medium text-foreground">{op.description}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {op.category?.name || 'Sem Categoria'}
                          </TableCell>
                          <TableCell className={`font-semibold ${op.type === 'INCOME' || (op.type as any) === 'I' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatCurrency(op.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={op.type === 'INCOME' || (op.type as any) === 'I' ? 'success' : 'destructive'}>
                              {op.type === 'INCOME' || (op.type as any) === 'I' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {op.status || 'Concluído'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhuma operação recente encontrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
