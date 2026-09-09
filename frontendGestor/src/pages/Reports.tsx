import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { reportsService } from '@/services';
import { Report } from '@/types';
import { toast } from 'react-toastify';
import styles from './Reports.module.css';

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
      setReports(data);
    } catch (error) {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1>Relatórios</h1>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className={styles.grid}>
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className={styles.card}>
                  <h3>{report.title}</h3>
                  <div className={styles.dates}>
                    {new Date(report.startDate).toLocaleDateString('pt-BR')} -{' '}
                    {new Date(report.endDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <span className={styles.label}>Receita</span>
                      <span className={styles.value}>R$ {report.totalIncome.toFixed(2)}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.label}>Despesa</span>
                      <span className={`${styles.value} ${styles.expense}`}>
                        R$ {report.totalExpense.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.label}>Saldo</span>
                      <span
                        className={`${styles.value} ${
                          report.balance >= 0 ? styles.positive : styles.negative
                        }`}
                      >
                        R$ {report.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum relatório encontrado</p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
