"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
    
    try {
      const response = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (data.success) {
        alert("Login realizado com sucesso!");
        // Redirecionar para dashboard
      } else {
        alert("Erro no login: " + data.message);
      }
    } catch (error) {
      console.error("Erro no login:", error);
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
              Bem-vindo a sua agenda de atividades do condomínio!
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Faça o login ou cadastro para visualizar os eventos e atividades
              disponíveis!
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                style={{ 
                  borderColor: "var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)"
                }}
                placeholder="Digite sua senha"
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
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
            style={{ 
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)"
            }}
          >
            Entrar
          </button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Não tem uma conta?{" "}
            <Link 
              href="/auth/signup" 
              className="underline hover:no-underline"
              style={{ color: "var(--primary)" }}
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}