import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { categoriesService } from '@/services';
import { Category } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './Categories.module.css';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    color: '#2e3da3',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoriesService.create(formData);
      toast.success('Categoria criada com sucesso!');
      setFormData({ name: '', type: 'EXPENSE', color: '#2e3da3' });
      setShowForm(false);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao criar categoria');
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Categorias</h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus size={20} />
            Nova Categoria
          </Button>
        </div>

        {showForm && (
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Digite o nome da categoria"
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
                  <label>Cor</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

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
          <div className={styles.grid}>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.colorBar}
                      style={{ backgroundColor: cat.color || '#2e3da3' }}
                    />
                    <div className={styles.cardActions}>
                      <button className={styles.iconBtn}>
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.danger}`}
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{cat.name}</h3>
                    <p className={styles.type}>{cat.type === 'INCOME' ? 'Receita' : 'Despesa'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma categoria encontrada</p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
