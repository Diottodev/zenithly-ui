import { Button } from '$/components/ui/button'
import { Card } from '$/components/ui/card'
import { FloatingElements } from '$/components/ui/floating-elements'
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Star,
  Users,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <FloatingElements />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Image
              alt="Zenithly"
              className="h-8 w-8"
              height={32}
              src="/zenithly.svg"
              width={32}
            />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-bold text-transparent text-xl">
              Zenithly
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-20 pb-32">
        <div className="container mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-medium text-primary text-sm">
            <Star className="h-4 w-4" />
            Organize sua vida de forma inteligente
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent leading-tight md:text-6xl lg:text-7xl">
            O futuro da
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              organização pessoal
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground text-xl leading-relaxed">
            Zenithly combina calendário inteligente, gestão de tarefas e
            insights poderosos para transformar como você organiza seu tempo e
            alcança seus objetivos.
          </p>

          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button className="px-8 py-6 text-lg" size="lg">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="px-8 py-6 text-lg" size="lg" variant="outline">
                Já tenho conta
              </Button>
            </Link>
          </div>

          {/* Hero Image/App Preview */}
          <div className="relative mx-auto max-w-4xl">
            <div className="relative rounded-2xl border bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-2xl">
              <div className="overflow-hidden rounded-xl bg-background shadow-xl">
                <div className="flex h-96 items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="text-center text-muted-foreground">
                    <CalendarDays className="mx-auto mb-4 h-16 w-16 text-primary" />
                    <p className="text-lg">Preview do Dashboard Zenithly</p>
                    <p className="text-sm">
                      Calendário inteligente e gestão de tarefas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/20 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              Recursos que fazem a diferença
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
              Descubra como o Zenithly pode revolucionar sua produtividade
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-primary/10 p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 font-semibold text-xl">
                Calendário Inteligente
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sincronize todos seus calendários em um só lugar. Gmail, Outlook
                e mais.
              </p>
            </Card>

            <Card className="border-primary/10 p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 font-semibold text-xl">Gestão de Tempo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Otimize seu tempo com insights inteligentes e sugestões
                personalizadas.
              </p>
            </Card>

            <Card className="border-primary/10 p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 font-semibold text-xl">
                Produtividade Máxima
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Aumente sua produtividade com ferramentas inteligentes e
                automações.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              Interface moderna e intuitiva
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
              Experiência de usuário pensada para máxima eficiência
            </p>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-6 font-semibold text-2xl">
                Dashboard Inteligente
              </h3>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                Visualize todos seus compromissos, tarefas e metas em uma
                interface limpa e organizada. O dashboard adapta-se ao seu fluxo
                de trabalho.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Visualização em calendário, agenda e lista</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Sincronização em tempo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Notificações inteligentes</span>
                </div>
              </div>
            </div>
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
              <div className="text-center text-muted-foreground">
                <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                <p>Preview do Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 font-bold text-3xl md:text-4xl">
                Por que escolher o Zenithly?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">
                      100% Gratuito para começar
                    </h3>
                    <p className="text-muted-foreground">
                      Comece hoje mesmo sem custos. Upgrade quando precisar de
                      mais recursos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">
                      Sincronização automática
                    </h3>
                    <p className="text-muted-foreground">
                      Conecte Gmail, Outlook e outros serviços em segundos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">
                      Interface intuitiva
                    </h3>
                    <p className="text-muted-foreground">
                      Design pensado para facilitar seu dia a dia, não
                      complicar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">
                      Suporte dedicado
                    </h3>
                    <p className="text-muted-foreground">
                      Nossa equipe está aqui para ajudar você a ter sucesso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                <div className="text-center text-muted-foreground">
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-background/80 p-4">
                      <CalendarDays className="mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-sm">Calendário</p>
                    </div>
                    <div className="rounded-lg bg-background/80 p-4">
                      <Clock className="mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-sm">Agenda</p>
                    </div>
                    <div className="rounded-lg bg-background/80 p-4">
                      <Users className="mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-sm">Equipe</p>
                    </div>
                    <div className="rounded-lg bg-background/80 p-4">
                      <Zap className="mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-sm">Insights</p>
                    </div>
                  </div>
                  <p>Recursos integrados do Zenithly</p>
                </div>
              </div>
              <div className="-bottom-4 -right-4 absolute h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="-top-4 -left-4 absolute h-16 w-16 rounded-full bg-secondary/30 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text font-bold text-3xl text-transparent md:text-5xl">
              Pronto para transformar sua produtividade?
            </h2>
            <p className="mb-12 text-muted-foreground text-xl leading-relaxed">
              Junte-se a milhares de usuários que já descobriram o poder do
              Zenithly. Comece gratuitamente hoje mesmo e veja a diferença.
            </p>
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button
                  className="px-12 py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                  size="lg"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  className="px-12 py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                  size="lg"
                  variant="outline"
                >
                  Fazer Login
                </Button>
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              <p>
                ✨ Sem cartão de crédito • ⚡ Configuração em 2 minutos • 🔒
                100% seguro
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12">
        <div className="container mx-auto text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Image
              alt="Zenithly"
              className="h-6 w-6"
              height={24}
              src="/zenithly.svg"
              width={24}
            />
            <span className="font-semibold text-lg">Zenithly</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Zenithly. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
