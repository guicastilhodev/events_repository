import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos Condomínio',
  description: 'Sistema de gerenciamento de eventos do condomínio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}