import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { categoriesService } from '@/services';
import { Category } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Trash2, Loader2, FolderKanban } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    color: '#6366f1',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data || []);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await categoriesService.create(formData);
      toast.success('Categoria criada com sucesso!');
      setFormData({ name: '', type: 'EXPENSE', color: '#6366f1' });
      setShowForm(false);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao criar categoria');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar essa categoria?')) {
      try {
        await categoriesService.delete(id);
        toast.success('Categoria deletada com sucesso!');
        loadData();
      } catch (error: any) {
        toast.error('Erro ao deletar categoria');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Categorias
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize suas operações por tipos e grupos personalizados
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        {/* Dialog Form */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                Criar Categoria
              </DialogTitle>
              <DialogDescription>
                Adicione uma nova categoria de receita ou despesa.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <Input
                label="Nome da Categoria"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Alimentação, Transporte, Salário"
              />

              <div className="grid grid-cols-2 gap-4">
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
                    Cor de identificação
                  </label>
                  <div className="flex items-center gap-3 h-10">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-16 cursor-pointer bg-transparent border-0 rounded"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{formData.color}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={submitting}>
                  Salvar Categoria
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Category Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Carregando categorias...</span>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Card key={cat.id} className="relative overflow-hidden group hover:border-primary/50 transition-all">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: cat.color || '#6366f1' }}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-bold text-foreground">
                    {cat.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cat.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-2">
                  <Badge variant={cat.type === 'INCOME' || (cat.type as any) === 'V' ? 'success' : 'secondary'}>
                    {cat.type === 'INCOME' || (cat.type as any) === 'V' ? 'Receita' : 'Despesa'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 text-muted-foreground">
            Nenhuma categoria cadastrada.
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
