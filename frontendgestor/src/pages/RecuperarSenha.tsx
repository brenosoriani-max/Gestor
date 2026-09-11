
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import logo from "../../public/logo.png";
import main from "../../public/main.svg";

export default function RecuperarSenha() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [etapa, setEtapa] = useState<"email" | "senha">("email");
  const [loading, setLoading] = useState(false);


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Informe o seu e-mail para continuar.");
      return;
    }

    try {
      setEtapa("senha");

      toast.success("E-mail encontrado. Defina sua nova senha.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "E-mail não encontrado.";

        toast.error(message);
      } else {
        toast.error("Erro ao verificar o e-mail.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);


      await api.post("/reset-password", {
        email,
        password: novaSenha,
      });

      toast.success("Senha alterada com sucesso!");

      // Volta para o login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao alterar a senha.";

        toast.error(message);
      } else {
        toast.error("Erro desconhecido ao alterar a senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 text-slate-900">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[5fr_4fr]">

        {/* Imagem */}
        <main>
          <div className="h-full w-full overflow-hidden shadow-lg">
            <img
              src={main}
              alt="Imagem principal"
              className="h-full w-full object-cover"
            />
          </div>
        </main>

        {/* Formulário */}
        <aside className="flex items-center justify-center bg-gray p-6 sm:p-8 lg:p-10">

          <div className="w-full max-w-md">

            {/* Logo e título */}
            <div className="mb-8 text-center">

              <div className="mx-auto mb-6 flex h-16 w-50 items-center justify-center rounded-full">
                <img src={logo} alt="Logo" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                {etapa === "email"
                  ? "Recuperar senha"
                  : "Nova senha"}
              </h2>

              <p className="mt-2 text-base text-slate-600">
                {etapa === "email"
                  ? "Digite seu e-mail para continuar."
                  : "Digite sua nova senha para recuperar sua conta."}
              </p>

            </div>

            {/* ETAPA 1 */}
            {etapa === "email" && (
              <form
                onSubmit={handleEmailSubmit}
                className="space-y-5"
              >

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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-none"
                  size="lg"
                >
                  {loading
                    ? "Verificando..."
                    : "Continuar"}
                </Button>

              </form>
            )}

            {/* ETAPA 2 */}
            {etapa === "senha" && (
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-5"
              >

                {/* E-mail */}
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
                    value={email}
                    disabled
                    className="border-0 bg-slate-100 text-slate-500"
                  />

                </div>

                {/* Nova senha */}
                <div className="space-y-2">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Nova senha
                  </label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="border-0 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:outline-none"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                </div>

                {/* Confirmar senha */}
                <div className="space-y-2">

                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirmar nova senha
                  </label>

                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={(e) =>
                      setConfirmarSenha(e.target.value)
                    }
                    className="border-0 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:outline-none"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-none"
                  size="lg"
                >
                  {loading
                    ? "Alterando..."
                    : "Alterar senha"}
                </Button>

              </form>
            )}

            {/* Voltar */}
            <div className="mt-6 text-center text-sm text-slate-600">

              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-600"
              >
                Voltar para o login
              </Link>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

