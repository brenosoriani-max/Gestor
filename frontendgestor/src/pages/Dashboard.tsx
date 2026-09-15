
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  LogOut,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* =========================================================
   TIPOS
========================================================= */

type Operation = {
  id: string | number;
  description: string;
  amount: number;
  type: "I" | "E";
  createdAt: string | Date;
};

type Summary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalTransactions: number;
};

/* =========================================================
   CONSTANTES
========================================================= */

const PIE_COLORS = [
  "#22c55e",
  "#ef4444",
];

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}
/* =========================================================
   COMPONENTE
========================================================= */

export default function Dashboard() {
  const { user, logout } = useAuth();

  /* =======================================================
     DADOS

     Estes dados estão preparados para você substituir
     posteriormente pelos dados vindos da sua API.
  ======================================================= */

  const summary: Summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    totalTransactions: 0,
  };

  const recentOperations: Operation[] = [];

  /* =======================================================
     EVOLUÇÃO DOS ÚLTIMOS 6 MESES
  ======================================================= */

  const monthlyChartData = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        label: date.toLocaleDateString("pt-BR", {
          month: "short",
        }),
        income: 0,
        expenses: 0,
      };
    });

    return months;
  }, []);

  /* =======================================================
     DADOS DO GRÁFICO DE PIZZA
  ======================================================= */

  const pieData = useMemo(
    () => [
      {
        name: "Receitas",
        value: summary.totalIncome,
      },
      {
        name: "Despesas",
        value: summary.totalExpenses,
      },
    ],
    [summary.totalIncome, summary.totalExpenses]
  );

  /* =======================================================
     FLUXO MENSAL
  ======================================================= */

  const operationsChartData = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        label: date.toLocaleDateString("pt-BR", {
          month: "short",
        }),
        income: 0,
        expenses: 0,
      };
    });
  }, []);

  /* =======================================================
     SAUDAÇÃO
  ======================================================= */

  const greeting = useMemo(() => {
    return `Olá, ${user?.name ?? "usuário"} 👋`;
  }, [user]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Layout>
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Dashboard
              </p>

              <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
                {greeting}
              </h1>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={logout}
            className="hidden cursor-pointer gap-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 md:inline-flex"
          >
            <LogOut className="h-4 w-4" />

            Sair
          </Button>
        </header>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="min-h-screen px-4 py-6 text-slate-900 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* =================================================
                CARDS PRINCIPAIS
            ================================================= */}

            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* RECEITA */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Receita total
                  </CardTitle>

                  <div className="rounded-lg bg-emerald-50 p-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      summary.totalIncome
                    )}
                  </div>

                  <p className="mt-2 text-xs text-emerald-600">
                    Total de entradas
                  </p>
                </CardContent>
              </Card>

              {/* DESPESAS */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Despesas
                  </CardTitle>

                  <div className="rounded-lg bg-red-50 p-2">
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      summary.totalExpenses
                    )}
                  </div>

                  <p className="mt-2 text-xs text-red-500">
                    Total de saídas
                  </p>
                </CardContent>
              </Card>

              {/* SALDO */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Saldo líquido
                  </CardTitle>

                  <div className="rounded-lg bg-sky-50 p-2">
                    <Wallet className="h-4 w-4 text-sky-600" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      summary.balance >= 0
                        ? "text-slate-900"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      summary.balance
                    )}
                  </div>

                  <p className="mt-2 text-xs text-sky-600">
                    Resultado do período
                  </p>
                </CardContent>
              </Card>

              {/* OPERAÇÕES */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Operações
                  </CardTitle>

                  <div className="rounded-lg bg-violet-50 p-2">
                    <Activity className="h-4 w-4 text-violet-500" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {summary.totalTransactions}
                  </div>

                  <p className="mt-2 text-xs text-violet-500">
                    Lançamentos registrados
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* =================================================
                GRÁFICOS PRINCIPAIS
            ================================================= */}

            <section className="mb-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              {/* EVOLUÇÃO FINANCEIRA */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>
                    Evolução financeira
                  </CardTitle>

                  <CardDescription>
                    Receitas e despesas dos últimos 6 meses.
                  </CardDescription>
                </CardHeader>

                <CardContent className="h-[320px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={monthlyChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="incomeFill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.7}
                          />

                          <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0.05}
                          />
                        </linearGradient>

                        <linearGradient
                          id="expenseFill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.6}
                          />

                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          `R$ ${Number(value) / 1000}k`
                        }
                      />

                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(
                            Number(value)
                          ),
                          "Valor",
                        ]}
                      />

                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        fill="url(#incomeFill)"
                        strokeWidth={2}
                        name="Receitas"
                      />

                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        fill="url(#expenseFill)"
                        strokeWidth={2}
                        name="Despesas"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* DISTRIBUIÇÃO */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>
                    Distribuição
                  </CardTitle>

                  <CardDescription>
                    Comparação entre entradas e saídas.
                  </CardDescription>
                </CardHeader>

                <CardContent className="h-[320px]">
                  {pieData.every(
                    (item) => item.value === 0
                  ) ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <PieChartIcon className="h-6 w-6 text-slate-400" />
                        </div>

                        <p className="text-sm font-medium text-slate-600">
                          Sem dados financeiros
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Registre uma operação para visualizar o gráfico.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={70}
                          outerRadius={105}
                          paddingAngle={4}
                        >
                          {pieData.map(
                            (entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={
                                  PIE_COLORS[
                                    index %
                                      PIE_COLORS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(
                              Number(value)
                            ),
                            "Valor",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* =================================================
                FLUXO + OPERAÇÕES
            ================================================= */}

            <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              {/* FLUXO */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>
                    Fluxo por mês
                  </CardTitle>

                  <CardDescription>
                    Comparativo mensal das operações.
                  </CardDescription>
                </CardHeader>

                <CardContent className="h-[320px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={operationsChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          `R$ ${Number(value) / 1000}k`
                        }
                      />

                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(
                            Number(value)
                          ),
                          "Valor",
                        ]}
                      />

                      <Bar
                        dataKey="income"
                        fill="#22c55e"
                        radius={[6, 6, 0, 0]}
                        name="Receitas"
                      />

                      <Bar
                        dataKey="expenses"
                        fill="#ef4444"
                        radius={[6, 6, 0, 0]}
                        name="Despesas"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* ÚLTIMAS OPERAÇÕES */}

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>
                    Últimas movimentações
                  </CardTitle>

                  <CardDescription>
                    Operações mais recentes.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {recentOperations.length === 0 ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Activity className="h-6 w-6 text-slate-400" />
                        </div>

                        <p className="text-sm font-medium text-slate-600">
                          Nenhuma movimentação
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Suas operações aparecerão aqui.
                        </p>
                      </div>
                    </div>
                  ) : (
                    recentOperations.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-white"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {/* ÍCONE */}

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                item.type === "I"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.type === "I" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                            </div>

                            {/* DESCRIÇÃO */}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {item.description}
                              </p>

                              <p className="text-xs text-slate-500">
                                {new Date(
                                  item.createdAt
                                ).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </p>
                            </div>
                          </div>

                          {/* VALOR */}

                          <span
                            className={`ml-3 shrink-0 text-sm font-semibold ${
                              item.type === "I"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.type === "I"
                              ? "+"
                              : "-"}

                            {formatCurrency(
                              item.amount
                            )}
                          </span>
                        </div>
                      )
                    )
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
    </Layout>
  );
}



