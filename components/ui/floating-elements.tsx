export function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="-top-4 -left-4 absolute h-32 w-32 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="-right-8 absolute top-1/4 h-24 w-24 animate-pulse rounded-full bg-secondary/20 blur-2xl delay-1000" />
      <div className="absolute bottom-1/4 left-1/4 h-20 w-20 animate-pulse rounded-full bg-primary/5 blur-xl delay-500" />
      <div className="absolute right-1/3 bottom-8 h-16 w-16 animate-pulse rounded-full bg-primary/10 blur-2xl delay-700" />
    </div>
  )
}
