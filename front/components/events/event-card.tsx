'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import Image from 'next/image'

interface Event {
  id: string
  title: string
  location: string
  registrations: string
  image: string
}

interface EventCardProps {
  event: Event
  showEdit?: boolean
  onEdit?: () => void
}

export function EventCard({ event, showEdit, onEdit }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video">
        <Image
          src={event.image || '/placeholder.svg?height=200&width=400'}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 relative">
        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">LOCAL:</span> {event.location}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">INSCRITOS:</span> {event.registrations}
        </p>
        
        {showEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onEdit}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
