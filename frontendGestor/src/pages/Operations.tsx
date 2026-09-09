import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { operationsService, categoriesService, banksService } from '@/services';
import { Operation, Category, Bank } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Trash2, Loader2, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export function Operations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    categoryId: '',
    bankId: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [opsData, catsData, banksData] = await Promise.all([
        operationsService.getAll(),
        categoriesService.getAll(),
        banksService.getAll(),
      ]);
      setOperations(opsData || []);
      setCategories(catsData || []);
      setBanks(banksData || []);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await operationsService.create({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success('Operação criada com sucesso!');
      setFormData({
        description: '',
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        bankId: '',
        notes: '',
      });
      setShowForm(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar operação');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar essa operação?')) {
      try {
        await operationsService.delete(id);
        toast.success('Operação deletada com sucesso!');
        loadData();
      } catch (error: any) {
        toast.error('Erro ao deletar operação');
      }
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Operações
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie suas receitas e despesas registradas
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
            Nova Operação
          </Button>
        </div>

        {/* Modal Dialog for Form */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Cadastrar Nova Operação
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes da movimentação financeira.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <Input
                label="Descrição"
                placeholder="Ex: Pagamento de Internet"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />

              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                    className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Categoria
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Banco
                  </label>
                  <select
                    value={formData.bankId}
                    onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Selecione</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Notas adicionais"
                placeholder="Observações opcionais..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={submitting}>
                  Salvar Operação
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Content Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Histórico de Lançamentos</CardTitle>
            <CardDescription>
              Lista completa de operações financeiras efetuadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Carregando operações...</span>
              </div>
            ) : operations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell className="font-medium text-foreground">{op.description}</TableCell>
                      <TableCell className="text-muted-foreground">{op.category?.name || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{op.bank?.name || '—'}</TableCell>
                      <TableCell className={`font-semibold ${op.type === 'INCOME' || (op.type as any) === 'I' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(op.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={op.type === 'INCOME' || (op.type as any) === 'I' ? 'success' : 'destructive'}>
                          {op.type === 'INCOME' || (op.type as any) === 'I' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(op.id)}
                          className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                Nenhuma operação registrada ainda.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
