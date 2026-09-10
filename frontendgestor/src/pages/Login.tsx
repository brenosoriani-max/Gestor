import { useEffect, useState } from "react";

import api from "../services/api";
import axios from "axios";
import brandIcon from "../assets/react.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Login() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password: senha,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      window.location.href = "/dashboard";
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
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[4fr_5fr]">
        <main className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-3xl">
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Sistema de{" "}
              <span className="text-emerald-600">atendimento</span>
            </h1>

            <div className="mt-6 inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              Gestão inteligente
            </div>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Centralize sua operação em um só lugar. Acompanhe chamados,
              organize equipes e mantenha cada atendimento com visibilidade total
              em tempo real.
            </p>

            <div className="mt-10 rounded-[28px] border border-emerald-100 bg-white/80 p-6 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-sm">
              <p className="text-2xl font-semibold text-slate-800">
                Mais agilidade para sua operação.
              </p>
            </div>
          </div>
        </main>

        <aside className="flex items-center justify-center bg-white p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Bem-vindo de volta
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Acesse sua conta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:outline-none"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Senha
                  </label>
                  <Link
                    to="/recuperar-senha"
                    className="text-xs font-medium text-emerald-700 transition hover:text-emerald-600"
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
                  className="border-0 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:outline-none"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-none"
                size="lg"
              >
                Entrar
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Ainda não tem conta?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-600"
              >
                Crie uma agora
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}