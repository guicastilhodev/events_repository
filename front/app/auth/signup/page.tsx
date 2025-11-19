"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    cpf: "",
    apartamento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return formatted;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cpf: formatted,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.fullName || !formData.cpf || !formData.apartamento) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação do CPF
          apartamento: formData.apartamento,
        }),
      });
      
      const data = await response.json();
      console.log("Signup response:", data);
      
      if (data.success) {
        alert("Cadastro realizado com sucesso!");
        // Redirecionar para login
        window.location.href = "/auth/login";
      } else {
        alert("Erro no cadastro: " + data.message);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-lg p-3" style={{ backgroundColor: "var(--primary)" }}>
            <Building2 className="h-10 w-10" style={{ color: "var(--primary-foreground)" }} />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-balance" style={{ color: "var(--foreground)" }}>
              Cadastre-se no sistema de eventos
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Crie sua conta para acessar os eventos do condomínio
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Nome Completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{ 
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{ 
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cpf" className="text-sm font-medium">
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              value={formData.cpf}
              onChange={handleCPFChange}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{ 
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="apartamento" className="text-sm font-medium">
              Apartamento
            </label>
            <input
              id="apartamento"
              name="apartamento"
              type="text"
              value={formData.apartamento}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{ 
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
              placeholder="Ex: 101, 202A"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm pr-10"
                style={{ 
                  borderColor: "var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)"
                }}
                placeholder="Digite sua senha"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
            style={{ 
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)"
            }}
          >
            Cadastrar
          </button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Já tem uma conta?{" "}
            <Link 
              href="/auth/login" 
              className="underline hover:no-underline"
              style={{ color: "var(--primary)" }}
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}