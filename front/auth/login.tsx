"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
  };

  const handleSignUp = () => {
    console.log("Sign up clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-lg bg-primary p-3">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-foreground text-balance">
              Bem-vindo a sua agenda de atividades do condomínio!
            </h1>
            <p className="text-sm text-muted-foreground">
              Faça o login ou cadastro para visualizar os eventos e atividades
              disponíveis!
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-input bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-input bg-secondary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground font-medium"
            >
              Entrar
            </Button>
            <Button
              type="button"
              onClick={handleSignUp}
              variant="outline"
              className="w-full h-12 border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground"
            >
              Criar Conta
            </Button>
          </div>
        </form>

        {/* Forgot Password Link */}
        <div className="flex justify-center">
          <button
            onClick={handleForgotPassword}
            className="text-sm font-medium text-primary hover:underline transition-all"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>
    </div>
  );
}
