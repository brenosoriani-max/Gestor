import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { operationsService, reportsService } from '@/services';
import { Operation, Report } from '@/types';
import { toast } from 'react-toastify';
import styles from './Dashboard.module.css';

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
        setOperations(opsData);
        setReport(reportData);
      } catch (error) {
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Dashboard</h1>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <>
            {report && (
              <div className={styles.cards}>
                <div className={styles.card}>
                  <h3>Receita Total</h3>
                  <p className={styles.amount}>R$ {report.totalIncome?.toFixed(2) || '0.00'}</p>
                </div>
                <div className={styles.card}>
                  <h3>Despesa Total</h3>
                  <p className={`${styles.amount} ${styles.negative}`}>
                    R$ {report.totalExpense?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className={styles.card}>
                  <h3>Saldo</h3>
                  <p className={`${styles.amount} ${report.balance! < 0 ? styles.negative : styles.positive}`}>
                    R$ {report.balance?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2>Operações Recentes</h2>
              {operations.length > 0 ? (
                <div className={styles.table}>
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operations.slice(0, 10).map((op) => (
                        <tr key={op.id}>
                          <td>{op.description}</td>
                          <td>{op.category?.name}</td>
                          <td>R$ {op.amount.toFixed(2)}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[op.type.toLowerCase()]}`}>
                              {op.type === 'INCOME' ? 'Receita' : 'Despesa'}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.badge} ${styles[op.status.toLowerCase()]}`}>
                              {op.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Nenhuma operação encontrada</p>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
