'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok || response.status === 200) {
        // Armazenar token e dados do usuário
        if (data.data?.access_token) {
          localStorage.setItem('token', data.data.access_token)
          localStorage.setItem('access_token', data.data.access_token)
        }
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user))
        }
        
        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo, ${data.data?.user?.full_name || 'usuário'}!`,
        })
        
        // Redirecionar imediatamente para o dashboard
        router.push('/dashboard')
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao fazer login',
          description: data.message || 'Verifique suas credenciais e tente novamente.',
        })
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast({
        variant: 'destructive',
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-background" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bem-vindo de volta!
        </h1>
        <p className="text-muted-foreground text-sm">
          Acesse sua conta para gerenciar as atividades do condomínio
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10 h-12"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••"
              className="pl-10 pr-10 h-12"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            href="/recuperar-senha"
            className="text-sm text-foreground hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">OU</span>
          </div>
        </div>

        {/* Create Account Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 font-medium"
          asChild
        >
          <Link href="/cadastro">Criar nova conta</Link>
        </Button>
      </form>

      {/* Footer */}
      <p className="text-xs text-center text-muted-foreground mt-6">
        Ao continuar, você concorda com nossos{' '}
        <Link href="/termos" className="underline hover:text-foreground">
          Termos de Uso
        </Link>{' '}
        e{' '}
        <Link href="/privacidade" className="underline hover:text-foreground">
          Política de Privacidade
        </Link>
      </p>
    </div>
  )
}
