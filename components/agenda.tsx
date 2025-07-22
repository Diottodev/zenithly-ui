import { Skeleton } from '$/components/ui/skeleton'
import dynamic from 'next/dynamic'

const BigCalendar = dynamic(() => import('$/components/ui/big-calendar'), {
  loading: () => (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6 lg:p-8">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="grid gap-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    </div>
  ),
})
export default function Agenda() {
  return (
    <div className="w-full">
      <BigCalendar />
    </div>
  )
}
