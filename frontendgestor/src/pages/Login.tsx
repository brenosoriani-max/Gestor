import { useEffect, useState } from "react";

import api from "../services/api";
import axios from "axios";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Login() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/clientes/login", {
        email,
        password: senha,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      window.location.href = "/criar-chamado";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Erro ao fazer login";
        toast.error(message);
        console.error("Erro ao fazer login:", message);
      } else {
        toast.error("Erro desconhecido ao fazer login");
      }
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <aside className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_45%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#020617_100%)]" />
          <div className="relative z-10 flex w-full flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm">
                <img src={logo} alt="Logo Gestor" className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-200/80">
                  Gestor
                </p>
                <h1 className="text-2xl font-semibold text-white">
                  Sistema de atendimento
                </h1>
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <div className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
                Gestão inteligente
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-white">
                Centralize sua operação em um só lugar.
              </h2>
              <p className="text-base text-slate-300">
                Acompanhe chamados, organize equipes e mantenha cada atendimento
                com visibilidade total em tempo real.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm text-slate-300">
                “Mais produtividade, controle e agilidade para sua operação.”
              </p>
            </div>
          </div>
        </aside>

        <main className="flex items-center justify-center bg-slate-950 p-6 sm:p-10">
          <Card className="w-full max-w-md border border-white/10 bg-slate-900/80 text-slate-50 shadow-2xl shadow-slate-950/50 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-4">
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-500/30">
                  <img src={logo} alt="Logo" className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl text-white">
                  Bem-vindo de volta
                </CardTitle>
                <CardDescription className="text-sm text-slate-300">
                  Acesse sua conta para continuar
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-200"
                  >
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-400 focus-visible:ring-sky-500/40"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-200"
                    >
                      Senha
                    </label>
                    <Link
                      to="/recuperar-senha"
                      className="text-xs font-medium text-sky-300 transition hover:text-sky-200"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-400 focus-visible:ring-sky-500/40"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-sky-500 text-white hover:bg-sky-400"
                  size="lg"
                >
                  Entrar
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-400">
                Ainda não tem conta?{" "}
                <Link
                  to="/cadastro"
                  className="font-medium text-sky-300 hover:text-sky-200"
                >
                  Crie uma agora
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}