import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type OperationForm = {
  description: string;
  amount: string;
  type: "I" | "E";
  idWallet: string;
  idCategory: string;
};

type Wallet = {
  id: string;
  name: string;
};

const initialForm: OperationForm = {
  description: "",
  amount: "",
  type: "E",
  idWallet: "",
  idCategory: "",
};

export default function Transactions() {
  const { user } = useAuth();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<OperationForm>(initialForm);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const fetchOperations = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get<{ operations?: Operation[] }>(`/operations/${user.id}`);
      setOperations(Array.isArray(res.data.operations) ? res.data.operations : []);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      setOperations([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  useEffect(() => {
    if (!user?.id) return;

    api.get<{ wallets?: Wallet[] }>(`/wallets/${user.id}`)
      .then((response) => setWallets(Array.isArray(response.data.wallets) ? response.data.wallets : []))
      .catch((error) => {
        console.error("Erro ao carregar carteiras:", error);
        setWallets([]);
      });
  }, [user?.id]);

  const updateForm = <K extends keyof OperationForm>(field: K, value: OperationForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateOperation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;

    const amount = Number(form.amount.replace(",", "."));
    if (!form.description.trim() || !Number.isFinite(amount) || amount <= 0 || !form.idWallet.trim() || !form.idCategory.trim()) {
      toast.error("Preencha todos os campos com um valor maior que zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/operations", {
        description: form.description.trim(),
        amount,
        type: form.type,
        idUser: user.id,
        idWallet: form.idWallet.trim(),
        idCategory: form.idCategory.trim(),
      });

      toast.success("Transação criada com sucesso!");
      setForm(initialForm);
      setIsDialogOpen(false);
      await fetchOperations();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      toast.error("Não foi possível criar a transação. Verifique os dados informados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando transações...</div>;
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Usuário não autenticado.</div>;
  }

  return (
    <Layout>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Transações</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">Olá, {user.name} 👋</h1>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" />
            Nova transação
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova transação</DialogTitle>
              <DialogDescription>Informe os dados para registrar uma entrada ou saída.</DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateOperation}>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Descrição
                <Input value={form.description} onChange={(event) => updateForm("description", event.target.value)} minLength={3} maxLength={255} required />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                  Valor
                  <Input type="number" min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={(event) => updateForm("amount", event.target.value)} required />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                  Tipo
                  <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" value={form.type} onChange={(event) => updateForm("type", event.target.value as OperationForm["type"])}>
                    <option value="E">Saída</option>
                    <option value="I">Entrada</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Carteira
                <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" value={form.idWallet} onChange={(event) => updateForm("idWallet", event.target.value)} required>
                  <option value="">Selecione uma carteira</option>
                  {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                ID da categoria
                <Input value={form.idCategory} onChange={(event) => updateForm("idCategory", event.target.value)} placeholder="UUID da categoria" required />
              </label>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Criar transação"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardHeader><CardTitle>Transações</CardTitle></CardHeader>
            <CardContent>
              {operations.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma transação encontrada.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-slate-600"><th className="py-2">Descrição</th><th className="py-2">Valor</th><th className="py-2">Tipo</th><th className="py-2">Data</th></tr></thead>
                    <tbody>{operations.map((operation) => (
                      <tr key={operation.id} className="border-t">
                        <td className="py-3">{operation.description}</td>
                        <td className="py-3">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(operation.amount)}</td>
                        <td className="py-3">{operation.type === "I" ? "Entrada" : "Saída"}</td>
                        <td className="py-3">{new Date(operation.createdAt).toLocaleString("pt-BR")}</td>
                      </tr>
                    ))}</tbody>
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


