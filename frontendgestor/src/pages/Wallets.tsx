
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type WalletItem = {
  id: string;
  name: string;
  balance: number;
  idUser: string;
};

export default function Wallets() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWallets = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await api.get<{ wallets?: WalletItem[] }>(`/wallets/${user.id}`);
      setWallets(Array.isArray(response.data.wallets) ? response.data.wallets : []);
    } catch (error) {
      console.error("Erro ao carregar carteiras:", error);
      toast.error("Não foi possível carregar as carteiras.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchWallets(); }, [fetchWallets]);

  const createWallet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;
    const parsedBalance = Number(balance.replace(",", "."));
    if (!name.trim() || !Number.isFinite(parsedBalance)) {
      toast.error("Informe o nome e o saldo inicial da carteira.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/wallets", { name: name.trim(), balance: parsedBalance, idUser: user.id });
      toast.success("Carteira criada com sucesso!");
      setName("");
      setBalance("");
      setOpen(false);
      await fetchWallets();
    } catch (error) {
      console.error("Erro ao criar carteira:", error);
      toast.error("Não foi possível criar a carteira.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Carteiras</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">Minhas carteiras</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" /> Nova carteira
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova carteira</DialogTitle>
              <DialogDescription>Crie uma carteira para usá-la nas transações.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={createWallet}>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Nome
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Conta principal" required />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Saldo inicial
                <Input type="number" step="0.01" value={balance} onChange={(event) => setBalance(event.target.value)} required />
              </label>
              <DialogFooter><Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Criar carteira"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <main className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
        {loading ? <p className="text-slate-500">Carregando carteiras...</p> : wallets.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-sm text-slate-500">Nenhuma carteira cadastrada.</CardContent></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><Wallet className="h-5 w-5" /></div>
                  <CardTitle className="text-base">{wallet.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-slate-900">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(wallet.balance)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}


