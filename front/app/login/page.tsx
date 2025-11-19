import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Condomínio',
  description: 'Acesse sua conta para gerenciar as atividades do condomínio',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <LoginForm />
    </div>
  )
}
