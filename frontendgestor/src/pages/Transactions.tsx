import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Layout from "@/components/Layout";

type Operation = {
  id: string;
  description: string;
  amount: number;
  type: "I" | "E";
  idUser: string;
  idWallet: string;
  idCategory: string;
  createdAt: string;
  updatedAt?: string;
};

export default function Transactions() {
  const { user, logout } = useAuth();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const res = await api.get<{
          operations?: Operation[];
          data?: Operation[];
          operation?: Operation[];
        }>(`/operations/${user.id}`);

        const data = Array.isArray(res.data?.operations)
          ? res.data.operations
          : Array.isArray(res.data?.operation)
          ? res.data.operation
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setOperations(data);
      } catch (err) {
        console.error("Erro ao carregar operações:", err);
        setOperations([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Carregando transações...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">Usuário não autenticado</p>
          <p className="mt-2 text-sm text-slate-500">Faça login para ver suas transações.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 z-10 flex items-center justify-between  bg-white px-4 py-4 shadow-sm md:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Transações</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">Olá, {user.name} 👋</h1>
        </div>
      </header>

      <main className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
            </CardHeader>

            <CardContent>
              {operations.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma transação encontrada.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-600">
                        <th className="py-2">Descrição</th>
                        <th className="py-2">Valor</th>
                        <th className="py-2">Tipo</th>
                        <th className="py-2">Data</th>
                      </tr>
                    </thead>

                    <tbody>
                      {operations.map((op) => (
                        <tr key={op.id} className="border-t">
                          <td className="py-3">{op.description}</td>
                          <td className="py-3">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(op.amount)}</td>
                          <td className="py-3">{op.type === "I" ? "Entrada" : "Saída"}</td>
                          <td className="py-3">{new Date(op.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
