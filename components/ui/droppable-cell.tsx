'use client'

import { useCalendarDnd } from '$/components/ui'
import { cn } from '$/lib/utils'
import { useDroppable } from '@dnd-kit/core'

interface DroppableCellProps {
  id: string
  date: Date
  time?: number // For week/day views, represents hours (e.g., 9.25 for 9:15)
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function DroppableCell({
  id,
  date,
  time,
  children,
  className,
  onClick,
}: DroppableCellProps) {
  const { activeEvent } = useCalendarDnd()
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      date,
      time,
    },
  })
  // Format time for display in tooltip (only for debugging)
  const formattedTime =
    time !== undefined
      ? `${Math.floor(time)}:${Math.round((time - Math.floor(time)) * 60)
        .toString()
        .padStart(2, '0')}`
      : null
  return (
    <button
      className={cn(
        'flex h-full min-w-[95%] max-w-[99%] flex-col px-0.5 py-1 data-dragging:bg-accent sm:px-1',
        className
      )}
      data-dragging={isOver && activeEvent ? true : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      ref={setNodeRef}
      tabIndex={0}
      title={formattedTime ? `${formattedTime}` : undefined}
      type="button"
    >
      {children}
    </button>
  )
}
