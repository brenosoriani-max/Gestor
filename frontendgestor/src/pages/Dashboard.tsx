
import { useEffect, useMemo, useState } from "react";
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

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


// ======================================================
// TIPOS
// ======================================================

type Report = {
  id: string;
  idUser: string;
  month: number;
  income: number;
  expenses: number;
  createdAt: string;
  updatedAt?: string;
};

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


// ======================================================
// FORMATADORES
// ======================================================

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
});

const PIE_COLORS = ["#22c55e", "#ef4444"];


// ======================================================
// UTILITÁRIOS
// ======================================================

function makeLastSixMonths() {
  const months: Array<{
    key: string;
    label: string;
    month: number;
    year: number;
  }> = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date();

    date.setDate(1);
    date.setMonth(date.getMonth() - index);

    months.push({
      key: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,

      label: monthFormatter.format(date),

      month: date.getMonth() + 1,

      year: date.getFullYear(),
    });
  }

  return months;
}

function formatCurrency(value: unknown) {
  return currencyFormatter.format(Number(value) || 0);
}


// ======================================================
// DASHBOARD
// ======================================================

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [reports, setReports] = useState<Report[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);


  // ====================================================
  // BUSCAR DADOS
  // ====================================================

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [
          reportsResponse,
          operationsResponse,
        ] = await Promise.all([
          api.get<{
            reports?: Report[];
            data?: Report[];
          }>(`/reports/${user.id}`),

          api.get<{
            operations?: Operation[];
            data?: Operation[];
          }>(`/operations/${user.id}`),
        ]);


        // -----------------------------
        // RELATÓRIOS
        // -----------------------------

        const reportsData = Array.isArray(
          reportsResponse.data?.reports
        )
          ? reportsResponse.data.reports
          : Array.isArray(reportsResponse.data?.data)
            ? reportsResponse.data.data
            : [];

        setReports(reportsData);


        // -----------------------------
        // OPERAÇÕES
        // -----------------------------

        const operationsData = Array.isArray(
          operationsResponse.data?.operations
        )
          ? operationsResponse.data.operations
          : Array.isArray(operationsResponse.data?.data)
            ? operationsResponse.data.data
            : [];

        setOperations(operationsData);

      } catch (error) {
        console.error(
          "Erro ao carregar dados do dashboard:",
          error
        );

        setReports([]);
        setOperations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);


  // ====================================================
  // RESUMO
  // ====================================================

  const summary = useMemo(() => {
    const reportIncome = reports.reduce(
      (sum, item) => sum + Number(item.income || 0),
      0
    );

    const reportExpenses = reports.reduce(
      (sum, item) => sum + Number(item.expenses || 0),
      0
    );


    const operationIncome = operations
      .filter((item) => item.type === "I")
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );


    const operationExpenses = operations
      .filter((item) => item.type === "E")
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );


    /*
     * Se existirem relatórios, usamos os relatórios.
     * Caso contrário, usamos as operações.
     */

    const totalIncome =
      reports.length > 0
        ? reportIncome
        : operationIncome;

    const totalExpenses =
      reports.length > 0
        ? reportExpenses
        : operationExpenses;

    const balance = totalIncome - totalExpenses;


    return {
      totalIncome,
      totalExpenses,
      balance,

      operationIncome,
      operationExpenses,

      totalTransactions: operations.length,
    };
  }, [reports, operations]);


  // ====================================================
  // GRÁFICO DE RELATÓRIOS
  // ====================================================

  const monthlyChartData = useMemo(() => {
    const lastSixMonths = makeLastSixMonths();


    const chartData = lastSixMonths.map((month) => ({
      ...month,
      income: 0,
      expenses: 0,
    }));


    reports.forEach((report) => {
      const match = chartData.find(
        (item) =>
          item.month === Number(report.month)
      );


      if (!match) {
        return;
      }


      match.income += Number(report.income || 0);

      match.expenses += Number(report.expenses || 0);
    });


    return chartData;
  }, [reports]);


  // ====================================================
  // GRÁFICO DE OPERAÇÕES
  // ====================================================

  const operationsChartData = useMemo(() => {
    const lastSixMonths = makeLastSixMonths();


    const chartData = lastSixMonths.map((month) => ({
      ...month,
      income: 0,
      expenses: 0,
    }));


    operations.forEach((operation) => {
      const date = new Date(operation.createdAt);


      if (Number.isNaN(date.getTime())) {
        return;
      }


      const month = date.getMonth() + 1;

      const year = date.getFullYear();


      const match = chartData.find(
        (item) =>
          item.month === month &&
          item.year === year
      );


      if (!match) {
        return;
      }


      if (operation.type === "I") {
        match.income += Number(
          operation.amount || 0
        );
      } else {
        match.expenses += Number(
          operation.amount || 0
        );
      }
    });


    return chartData;
  }, [operations]);


  // ====================================================
  // GRÁFICO DE PIZZA
  // ====================================================

  const pieData = useMemo(
    () => [
      {
        name: "Entradas",
        value:
          summary.operationIncome ||
          summary.totalIncome,
      },

      {
        name: "Saídas",
        value:
          summary.operationExpenses ||
          summary.totalExpenses,
      },
    ],
    [summary]
  );


  // ====================================================
  // ÚLTIMAS OPERAÇÕES
  // ====================================================

  const recentOperations = useMemo(
    () =>
      [...operations]
        .sort(
          (first, second) =>
            new Date(
              second.createdAt
            ).getTime() -
            new Date(
              first.createdAt
            ).getTime()
        )
        .slice(0, 5),

    [operations]
  );


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

          <p className="text-sm font-medium text-slate-600">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }


  // ====================================================
  // SEM USUÁRIO
  // ====================================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">
            Usuário não autenticado
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Faça login para acessar o dashboard.
          </p>
        </div>
      </div>
    );
  }


  // ====================================================
  // INTERFACE
  // ====================================================

  return (
    <SidebarProvider>

      {/* ================================================
          SIDEBAR
      ================================================= */}

      <Sidebar>

        <SidebarHeader className="border-b border-slate-200 px-4 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <PiggyBank className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Gestor
              </p>

              <p className="text-sm font-bold text-slate-900">
                Financeiro
              </p>
            </div>

          </div>

        </SidebarHeader>


        <SidebarContent className="px-2 py-4">

          <SidebarGroup>

            <SidebarGroupLabel>
              Menu
            </SidebarGroupLabel>


            <SidebarGroupContent>

              <SidebarMenu>

                <SidebarMenuItem>

                  <SidebarMenuButton
                    isActive
                    className="h-10"
                  >
                    <LayoutDashboard className="h-4 w-4" />

                    <span>
                      Dashboard
                    </span>
                  </SidebarMenuButton>

                </SidebarMenuItem>


                <SidebarMenuItem>

                  <SidebarMenuButton className="h-10">
                    <BarChart3 className="h-4 w-4" />

                    <span>
                      Relatórios
                    </span>
                  </SidebarMenuButton>

                </SidebarMenuItem>


                <SidebarMenuItem>

                  <SidebarMenuButton className="h-10">
                    <CreditCard className="h-4 w-4" />

                    <span>
                      Transações
                    </span>
                  </SidebarMenuButton>

                </SidebarMenuItem>

              </SidebarMenu>

            </SidebarGroupContent>

          </SidebarGroup>

        </SidebarContent>


        <SidebarFooter className="border-t border-slate-200 p-3">

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-600 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />

            Sair
          </Button>

        </SidebarFooter>

      </Sidebar>


      {/* ================================================
          CONTEÚDO
      ================================================= */}

      <SidebarInset className="bg-slate-50">


        {/* HEADER */}

        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">

          <div className="flex items-center gap-3">

            <SidebarTrigger className="md:hidden" />

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Dashboard
              </p>

              <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
                Olá, {user.name || "usuário"} 👋
              </h1>

            </div>

          </div>


          <Button
            variant="outline"
            onClick={logout}
            className="hidden gap-2 md:inline-flex"
          >
            <LogOut className="h-4 w-4" />

            Sair
          </Button>

        </header>


        {/* MAIN */}

        <main className="min-h-screen px-4 py-6 text-slate-900 md:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl">


            {/* ==========================================
                CARDS
            =========================================== */}

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


            {/* ==========================================
                GRÁFICOS PRINCIPAIS
            =========================================== */}

            <section className="mb-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">


              {/* EVOLUÇÃO */}

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
                          formatCurrency(value),
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


              {/* PIZZA */}

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
                          <PieChart className="h-6 w-6 text-slate-400" />
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
                            formatCurrency(value),
                            "Valor",
                          ]}
                        />

                      </PieChart>

                    </ResponsiveContainer>

                  )}

                </CardContent>

              </Card>

            </section>


            {/* ==========================================
                FLUXO + OPERAÇÕES
            =========================================== */}

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
                          formatCurrency(value),
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

                    recentOperations.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-white"
                      >

                        <div className="flex min-w-0 items-center gap-3">

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

                    ))

                  )}

                </CardContent>

              </Card>

            </section>

          </div>

        </main>

      </SidebarInset>

    </SidebarProvider>
  );
}

