"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    apartment: "",
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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Signup attempted with:", {
      email: formData.email,
      cpf: formData.cpf,
      apartment: formData.apartment,
    });
  };

  const handleBackToLogin = () => {
    console.log("Back to login clicked");
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
              Criar sua Conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados abaixo para se registrar na agenda de atividades
              do condomínio
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-input bg-secondary"
            />
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium">
              CPF
            </Label>
            <Input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleCPFChange}
              maxLength="14"
              required
              className="border-input bg-secondary"
            />
          </div>

          {/* Apartment */}
          <div className="space-y-2">
            <Label htmlFor="apartment" className="text-sm font-medium">
              Número do Apartamento
            </Label>
            <Input
              id="apartment"
              name="apartment"
              type="text"
              placeholder="Ex: 101 ou 1001"
              value={formData.apartment}
              onChange={handleChange}
              required
              className="border-input bg-secondary"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite uma senha segura"
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border-input bg-secondary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
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
              Criar Conta
            </Button>
            <Button
              type="button"
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full h-12 border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground"
            >
              Voltar para Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
