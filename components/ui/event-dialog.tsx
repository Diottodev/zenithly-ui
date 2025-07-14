'use client'

import type { CalendarEvent, EventColor } from '$/components/ui'
import { Button } from '$/components/ui/button'
import { Calendar } from '$/components/ui/calendar'
import { Checkbox } from '$/components/ui/checkbox'
import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from '$/components/ui/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '$/components/ui/dialog'
import { Input } from '$/components/ui/input'
import { Label } from '$/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '$/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '$/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$/components/ui/select'
import { Textarea } from '$/components/ui/textarea'
import { cn } from '$/lib/utils'
import { RiCalendarLine, RiDeleteBinLine } from '@remixicon/react'
import { format, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface EventDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onCloseAction: () => void
  onSaveAction: (event: CalendarEvent) => void
  onDeleteAction: (eventId: string) => void
}

export function EventDialog({
  event,
  isOpen,
  onCloseAction,
  onSaveAction,
  onDeleteAction,
}: EventDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`)
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`)
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [color, setColor] = useState<EventColor>(
    (event?._color as EventColor) || 'blue'
  )
  const [error, setError] = useState<string | null>(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Debug log to check what event is being passed
  useEffect(() => {
    console.log('EventDialog received event:', event)
  }, [event])

  const resetForm = useCallback(() => {
    setTitle('')
    setDescription('')
    setStartDate(new Date())
    setEndDate(new Date())
    setStartTime(`${DefaultStartHour}:00`)
    setEndTime(`${DefaultEndHour}:00`)
    setAllDay(false)
    setLocation('')
    setColor('blue')
    setError(null)
  }, [])

  const formatTimeForInput = useCallback((date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = Math.floor(date.getMinutes() / 15) * 15
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (event) {
      setTitle(event.title || '')
      setDescription(event.description || '')

      const start = new Date(event.start)
      const end = new Date(event.end)

      setStartDate(start)
      setEndDate(end)
      setStartTime(formatTimeForInput(start))
      setEndTime(formatTimeForInput(end))
      setAllDay(event.allDay ?? false)
      setLocation(event.location || '')
      setColor(event._color as EventColor)
      setError(null) // Reset error when opening dialog
    } else {
      resetForm()
    }
  }, [event, formatTimeForInput, resetForm])

  // Memoize time options so they're only calculated once
  const timeOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = []
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        const value = `${formattedHour}:${formattedMinute}`
        // Use a fixed date to avoid unnecessary date object creations
        const date = new Date(2000, 0, 1, hour, minute)
        const label = format(date, 'HH:mm', { locale: ptBR })
        options.push({ value, label })
      }
    }
    return options
  }, []) // Empty dependency array ensures this only runs once

  const handleSave = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (allDay) {
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    } else {
      const [startHours = 0, startMinutes = 0] = startTime
        .split(':')
        .map(Number)
      const [endHours = 0, endMinutes = 0] = endTime.split(':').map(Number)

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(
          `Selected time must be between ${StartHour}:00 and ${EndHour}:00`
        )
        return
      }

      start.setHours(startHours, startMinutes, 0)
      end.setHours(endHours, endMinutes, 0)
    }

    // Validate that end date is not before start date
    if (isBefore(end, start)) {
      setError('End date cannot be before start date')
      return
    }

    // Use generic title if empty
    const eventTitle = title.trim() ? title : '(no title)'

    onSaveAction({
      id: event?.id || '',
      title: eventTitle,
      description,
      start,
      end,
      allDay,
      location,
      _color: color,
    })
  }

  const handleDelete = () => {
    if (event?.id) {
      onDeleteAction(event.id)
    }
  }

  // Updated color options to match types.ts
  const colorOptions: Array<{
    value: EventColor
    label: string
    bgClass: string
    borderClass: string
  }> = [
    {
      value: 'blue',
      label: 'Blue',
      bgClass: 'bg-blue-400 data-[state=checked]:bg-blue-400',
      borderClass: 'border-blue-400 data-[state=checked]:border-blue-400',
    },
    {
      value: 'violet',
      label: 'Violet',
      bgClass: 'bg-violet-400 data-[state=checked]:bg-violet-400',
      borderClass: 'border-violet-400 data-[state=checked]:border-violet-400',
    },
    {
      value: 'rose',
      label: 'Rose',
      bgClass: 'bg-rose-400 data-[state=checked]:bg-rose-400',
      borderClass: 'border-rose-400 data-[state=checked]:border-rose-400',
    },
    {
      value: 'emerald',
      label: 'Emerald',
      bgClass: 'bg-emerald-400 data-[state=checked]:bg-emerald-400',
      borderClass: 'border-emerald-400 data-[state=checked]:border-emerald-400',
    },
    {
      value: 'orange',
      label: 'Orange',
      bgClass: 'bg-orange-400 data-[state=checked]:bg-orange-400',
      borderClass: 'border-orange-400 data-[state=checked]:border-orange-400',
    },
  ]

  return (
    <Dialog onOpenChange={(open) => !open && onCloseAction()} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {event?.id ? 'Editar evento' : 'Criar evento'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id
              ? 'Edite os detalhes deste evento'
              : 'Adicione um novo evento ao seu calendário'}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-md bg-destructive/15 px-3 py-2 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              value={description}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="start-date">Data de Início</Label>
              <Popover onOpenChange={setStartDateOpen} open={startDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      'group w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]',
                      !startDate && 'text-muted-foreground'
                    )}
                    id="start-date"
                    variant={'outline'}
                  >
                    <span
                      className={cn(
                        'truncate',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      {startDate
                        ? format(startDate, 'PPP', { locale: ptBR })
                        : 'Escolher uma data'}
                    </span>
                    <RiCalendarLine
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground/80"
                      size={16}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-2">
                  <Calendar
                    defaultMonth={startDate}
                    mode="single"
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date)
                        // If end date is before the new start date, update it to match the start date
                        if (isBefore(endDate, date)) {
                          setEndDate(date)
                        }
                        setError(null)
                        setStartDateOpen(false)
                      }
                    }}
                    selected={startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="start-time">Hora de Início</Label>
                <Select onValueChange={setStartTime} value={startTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Selecionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="end-date">Data de Término</Label>
              <Popover onOpenChange={setEndDateOpen} open={endDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      'group w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]',
                      !endDate && 'text-muted-foreground'
                    )}
                    id="end-date"
                    variant={'outline'}
                  >
                    <span
                      className={cn(
                        'truncate',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      {endDate
                        ? format(endDate, 'PPP', { locale: ptBR })
                        : 'Escolher uma data'}
                    </span>
                    <RiCalendarLine
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground/80"
                      size={16}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-2">
                  <Calendar
                    defaultMonth={endDate}
                    disabled={{ before: startDate }}
                    mode="single"
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date)
                        setError(null)
                        setEndDateOpen(false)
                      }
                    }}
                    selected={endDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="end-time">Hora de Término</Label>
                <Select onValueChange={setEndTime} value={endTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Selecionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={allDay}
              id="all-day"
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="all-day">Dia Inteiro</Label>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>
          <fieldset className="space-y-4">
            <legend className="font-medium text-foreground text-sm leading-none">
              Cor do Evento
            </legend>
            <RadioGroup
              className="flex gap-1.5"
              defaultValue={colorOptions[0]?.value}
              onValueChange={(value: EventColor) => setColor(value)}
              value={color}
            >
              {colorOptions.map((colorOption) => (
                <RadioGroupItem
                  aria-label={colorOption.label}
                  className={cn(
                    'size-6 shadow-none',
                    colorOption.bgClass,
                    colorOption.borderClass
                  )}
                  id={`color-${colorOption.value}`}
                  key={colorOption.value}
                  value={colorOption.value}
                />
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <DialogFooter className="flex-row sm:justify-between">
          {event?.id && (
            <Button
              aria-label="Delete event"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              size="icon"
              variant="outline"
            >
              <RiDeleteBinLine aria-hidden="true" size={16} />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <Button onClick={onCloseAction} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
