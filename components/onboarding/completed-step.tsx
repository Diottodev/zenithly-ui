"use client";

import { useState, useEffect } from "react";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$/components/ui/card";
import { Badge } from "$/components/ui/badge";
import { CheckCircle, Sparkles, Calendar, Mail, Settings, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface StepProps {
  onCompleteAction: () => void;
}

export default function CompletedStep({ onCompleteAction }: StepProps) {
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    setCelebration(true);
    // Auto-complete after 5 seconds if user doesn't click
    const timer = setTimeout(() => {
      onCompleteAction();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onCompleteAction]);

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendário Sincronizado",
      description: "Seus eventos do Google Calendar estão sendo sincronizados",
      status: "active"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Emails Integrados",
      description: "Gmail e Outlook conectados para gestão unificada",
      status: "active"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Preferências Configuradas",
      description: "Sua experiência foi personalizada conforme suas preferências",
      status: "active"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Celebração */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={celebration ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 1, repeat: 3 }}
          className="text-8xl mb-4"
        >
          🎉
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Parabéns!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Sua conta foi configurada com sucesso! Agora você pode aproveitar 
            todos os recursos do Zenithly.
          </motion.p>
        </div>
      </motion.div>

      {/* Confetes animados */}
      <div className="relative">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 800,
              y: -100,
              rotate: 0,
              scale: 0.5
            }}
            animate={{
              y: 600,
              rotate: Math.random() * 360,
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-70 pointer-events-none"
          />
        ))}
      </div>

      {/* Recursos Configurados */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Card className="h-full border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {feature.title}
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-700">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Próximos Passos */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Sparkles className="w-5 h-5" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Explore o Dashboard</h4>
                  <p className="text-sm text-blue-700">
                    Veja sua agenda, emails e tarefas em um só lugar
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Personalize Mais</h4>
                  <p className="text-sm text-blue-700">
                    Acesse as configurações para ajustar detalhes
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Convide sua Equipe</h4>
                  <p className="text-sm text-blue-700">
                    Colabore com colegas e compartilhe calendários
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Aprenda Mais</h4>
                  <p className="text-sm text-blue-700">
                    Acesse nossos tutoriais e dicas de produtividade
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-3 gap-4 text-center"
      >
        <div className="space-y-2">
          <div className="text-3xl font-bold text-green-600">3</div>
          <div className="text-sm text-muted-foreground">Integrações Ativas</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">100%</div>
          <div className="text-sm text-muted-foreground">Configuração Completa</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-purple-600">∞</div>
          <div className="text-sm text-muted-foreground">Possibilidades</div>
        </div>
      </motion.div>

      {/* Botão de Finalização */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center space-y-4"
      >
        <Button
          onClick={onCompleteAction}
          size="lg"
          className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Começar a Usar o Zenithly
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Ou aguarde alguns segundos para ser redirecionado automaticamente
        </p>
      </motion.div>
    </div>
  );
}
