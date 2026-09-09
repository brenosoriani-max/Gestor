import { MainLayout } from '@/components/MainLayout';
import styles from './Admin.module.css';

export function Admin() {
  return (
    <MainLayout>
      <div className={styles.container}>
        <h1>Painel de Administração</h1>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2>Gerenciar Usuários</h2>
            <p>Adicionar, editar e remover usuários do sistema.</p>
            <button className={styles.btn}>Gerenciar</button>
          </section>

          <section className={styles.section}>
            <h2>Gerenciar Técnicos</h2>
            <p>Gerenciar técnicos e suas atribuições.</p>
            <button className={styles.btn}>Gerenciar</button>
          </section>

          <section className={styles.section}>
            <h2>Configurações</h2>
            <p>Configurar parâmetros do sistema.</p>
            <button className={styles.btn}>Configurar</button>
          </section>

          <section className={styles.section}>
            <h2>Relatórios</h2>
            <p>Visualizar relatórios e estatísticas.</p>
            <button className={styles.btn}>Visualizar</button>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
