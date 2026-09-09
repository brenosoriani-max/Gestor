import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { banksService } from '@/services';
import { Bank } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Trash2, Loader2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export function Banks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await banksService.getAll();
      setBanks(data || []);
    } catch (error) {
      toast.error('Erro ao carregar bancos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await banksService.create(formData);
      toast.success('Banco criado com sucesso!');
      setFormData({ name: '', code: '' });
      setShowForm(false);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao criar banco');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esse banco?')) {
      try {
        await banksService.delete(id);
        toast.success('Banco deletado com sucesso!');
        loadData();
      } catch (error: any) {
        toast.error('Erro ao deletar banco');
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
              Bancos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie suas instituições financeiras vinculadas
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
            Novo Banco
          </Button>
        </div>

        {/* Dialog Form */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Cadastrar Banco
              </DialogTitle>
              <DialogDescription>
                Informe o nome e código de identificação do banco.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <Input
                label="Nome do Banco"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Banco do Brasil, Nubank, Itaú"
              />

              <Input
                label="Código Compe"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="Ex: 001, 260, 341"
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={submitting}>
                  Salvar Banco
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Banks Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Instituições Cadastradas</CardTitle>
            <CardDescription>
              Lista de bancos disponíveis no seu ambiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Carregando bancos...</span>
              </div>
            ) : banks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Instituição</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banks.map((bank) => (
                    <TableRow key={bank.id}>
                      <TableCell className="font-medium text-foreground flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {bank.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{bank.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {bank.code || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(bank.id)}
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
                Nenhum banco cadastrado.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
