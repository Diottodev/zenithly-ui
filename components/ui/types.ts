export type CalendarView = 'month' | 'week' | 'day' | 'agenda'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  _color?: { background: string; foreground: string } | EventColor
  label?: string
  location?: string
}

export type EventColor = 'blue' | 'orange' | 'violet' | 'rose' | 'emerald'
