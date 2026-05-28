import { Bot, Sparkles, AlertTriangle, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const tickets = [
  { id: "TKT-8471", client: "Entreprise XYZ", subject: "Blocage DSN - Erreur bloquante", priority: "P1", status: "À faire", time: "2h restantes" },
  { id: "TKT-8472", client: "Acme Corp", subject: "Absence non décomptée suite MÀJ", priority: "P2", status: "En cours", time: "Aujourd'hui" },
  { id: "TKT-8475", client: "Tech Solutions", subject: "Erreur calcul CP ancienneté", priority: "P2", status: "À faire", time: "Demain" },
  { id: "TKT-8480", client: "Globex", subject: "Demande d'export spécifique", priority: "P3", status: "À faire", time: "Semaine pro" },
];

export default function MyBacklog() {
  const { user } = useAuth();

  const message = `Bonjour ${user?.name?.split(' ')[0] || "Analyste"},\n\nVoici les priorités détectées sur votre backlog actuel après analyse par l'équipe et l'IA.\n\n**Tickets critiques (Paie) :**\n• TK-8471 (Entreprise XYZ) - Blocage DSN\n\n**Attention :**\nVous avez 3 tickets qui présentent un risque de relance avant la prochaine période de paie.\n\n**Priorité recommandée aujourd'hui :**\n1. Résoudre le blocage DSN (Urgence Absolue)\n2. Contrôle paie Acme Corp\n\nBon courage pour cette journée !`;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col gap-8">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Bonjour, {user?.name || "Analyste"} 👋</h1>
        <p className="text-muted-foreground mt-2 text-lg">Voici votre plan d'action pour aujourd'hui.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        
        {/* Left Column: AI Briefing */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-[450px] shrink-0 flex flex-col gap-6"
        >
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
                <Sparkles size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">Briefing IA</h2>
                <p className="text-sm text-muted-foreground">Reçu ce matin à 08:30</p>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed whitespace-pre-wrap font-medium text-foreground">
              {message}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
              <button className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
                J'ai pris connaissance
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Prioritized Tickets */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col gap-4 min-w-0"
        >
          <div className="flex justify-between items-end mb-2 px-2">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              Tickets Prioritaires
            </h2>
            <button className="text-sm font-medium text-primary hover:underline">Voir tout le backlog</button>
          </div>

          <div className="space-y-4 overflow-y-auto pb-8 px-2">
            {tickets.map((ticket, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={ticket.id} 
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      ticket.priority === 'P1' ? 'bg-red-500/10 text-red-600' : 
                      ticket.priority === 'P2' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{ticket.id}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{ticket.subject}</h3>
                  <div className="text-sm font-medium text-muted-foreground mt-1">{ticket.client}</div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                    <Clock size={14} />
                    {ticket.time}
                  </div>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
