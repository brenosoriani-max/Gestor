import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { banksService } from '@/services';
import { Bank } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './Banks.module.css';

export function Banks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
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
      setBanks(data);
    } catch (error) {
      toast.error('Erro ao carregar bancos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await banksService.create(formData);
      toast.success('Banco criado com sucesso!');
      setFormData({ name: '', code: '' });
      setShowForm(false);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao criar banco');
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Bancos</h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus size={20} />
            Novo Banco
          </Button>
        </div>

        {showForm && (
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <Input
                label="Nome do Banco"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Banco do Brasil"
              />

              <Input
                label="Código"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="Ex: 001"
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
            {banks.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((bank) => (
                    <tr key={bank.id}>
                      <td>{bank.name}</td>
                      <td>{bank.code}</td>
                      <td className={styles.tableActions}>
                        <button className={styles.iconBtn}>
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.danger}`}
                          onClick={() => handleDelete(bank.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum banco encontrado</p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
