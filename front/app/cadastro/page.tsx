import { SignupForm } from '@/components/auth/signup-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar Conta - Condomínio',
  description: 'Junte-se à comunidade do seu condomínio',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <SignupForm />
    </div>
  )
}
