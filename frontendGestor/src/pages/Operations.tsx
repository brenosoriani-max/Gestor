import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { operationsService, categoriesService, banksService } from '@/services';
import { Operation, Category, Bank } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './Operations.module.css';

export function Operations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
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
      setOperations(opsData);
      setCategories(catsData);
      setBanks(banksData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Operações</h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus size={20} />
            Nova Operação
          </Button>
        </div>

        {showForm && (
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <Input
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />

              <Input
                label="Valor"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <div className={styles.row}>
                <div className={styles.col}>
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                  >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                  </select>
                </div>

                <div className={styles.col}>
                  <label>Categoria</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.col}>
                  <label>Banco</label>
                  <select
                    value={formData.bankId}
                    onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
                    required
                  >
                    <option value="">Selecione um banco</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Notas"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              <div className={styles.actions}>
                <Button type="submit" variant="primary">
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className={styles.list}>
            {operations.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Banco</th>
                    <th>Valor</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((op) => (
                    <tr key={op.id}>
                      <td>{op.description}</td>
                      <td>{op.category?.name}</td>
                      <td>{op.bank?.name}</td>
                      <td>R$ {op.amount.toFixed(2)}</td>
                      <td>{op.type === 'INCOME' ? 'Receita' : 'Despesa'}</td>
                      <td>{op.status}</td>
                      <td className={styles.actions}>
                        <button className={styles.iconBtn}>
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.danger}`}
                          onClick={() => handleDelete(op.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma operação encontrada</p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
