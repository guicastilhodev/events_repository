'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EventCard } from '@/components/events/event-card'
import { useToast } from '@/hooks/use-toast'
import { Building2, Calendar, Plus, Menu, PencilIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface Event {
  id: string
  title: string
  location: string
  registrations: string
  image: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [availableEvents, setAvailableEvents] = useState<Event[]>([])
  const [managedEvents, setManagedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchEvents()
  }, [router])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      // Buscar eventos inscritos
      const myEventsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/my-registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Buscar eventos disponíveis
      const availableRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Buscar eventos gerenciados
      const managedRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/managed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (myEventsRes.ok) {
        const data = await myEventsRes.json()
        setMyEvents(data)
      }
      
      if (availableRes.ok) {
        const data = await availableRes.json()
        setAvailableEvents(data)
      }
      
      if (managedRes.ok) {
        const data = await managedRes.json()
        setManagedEvents(data)
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar eventos',
        description: 'Não foi possível carregar os eventos. Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEvent = () => {
    router.push('/dashboard/criar-evento')
  }

  const handleEditEvent = (eventId: string) => {
    router.push(`/dashboard/editar-evento/${eventId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-lg">
      <Button variant="ghost" className="justify-start gap-2 font-medium">
        <Calendar className="h-4 w-4" />
        EVENTOS
      </Button>
      <Button variant="ghost" className="justify-start gap-2 text-muted-foreground hover:text-foreground">
        <Building2 className="h-4 w-4" />
        APROVAR EVENTOS
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-background" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">EVENTS</span>
          </div>
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mt-8">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" onClick={handleLogout} className="hidden md:inline-flex">
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Minhas Inscrições */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> MINHAS INSCRIÇÕES
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-64 animate-pulse bg-muted" />
                  ))}
                </div>
              ) : myEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  Você ainda não está inscrito em nenhum evento
                </Card>
              )}
            </section>

            {/* Eventos Disponíveis */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> EVENTOS DISPONÍVEIS
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-64 animate-pulse bg-muted" />
                  ))}
                </div>
              ) : availableEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  Nenhum evento disponível no momento
                </Card>
              )}
            </section>

            {/* Gerenciar Eventos */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> GERENCIAR EVENTOS
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-64 animate-pulse bg-muted" />
                  ))}
                </div>
              ) : managedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {managedEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      showEdit
                      onEdit={() => handleEditEvent(event.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  Você ainda não criou nenhum evento
                </Card>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleCreateEvent}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Adicionar evento"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  )
}
