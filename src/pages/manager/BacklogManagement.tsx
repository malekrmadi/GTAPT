import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Bot, Mail, CheckCircle2, Sparkles, User, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const mockAnalysts = [
  {
    id: "a1",
    name: "Jean Dupont",
    initials: "JD",
    ticketsCount: 12,
    criticalCount: 2,
    riskCount: 3,
    tickets: [
      { id: "TKT-8471", client: "Entreprise XYZ", subject: "Blocage DSN - Erreur bloquante", priority: "P1" },
      { id: "TKT-8472", client: "Acme Corp", subject: "Absence non décomptée suite MÀJ", priority: "P2" },
    ],
    message: `Bonjour Jean,\n\nVoici les priorités détectées sur votre backlog actuel après analyse.\n\n**Tickets critiques (Paie) :**\n• TK-8471 (Entreprise XYZ) - Blocage DSN\n\n**Attention :**\nVous avez 3 tickets qui présentent un risque de relance avant la prochaine période de paie.\n\n**Priorité recommandée aujourd'hui :**\n1. Résoudre le blocage DSN (Urgence Absolue)\n2. Contrôle paie Acme Corp\n\nBon courage pour cette journée !`
  },
  {
    id: "a2",
    name: "Sarah Martin",
    initials: "SM",
    ticketsCount: 8,
    criticalCount: 0,
    riskCount: 1,
    tickets: [
      { id: "TKT-8490", client: "Tech Solutions", subject: "Création d'un nouveau motif CP", priority: "P3" },
      { id: "TKT-8495", client: "Globex", subject: "Erreur calcul RTT cadre", priority: "P2" },
    ],
    message: `Bonjour Sarah,\n\nVoici un point sur votre backlog.\n\n**Tickets à surveiller :**\n• TK-8495 (Globex) - Erreur calcul RTT cadre\n\nAucun ticket critique bloquant la paie n'a été détecté ce matin. Vous pouvez vous concentrer sur le paramétrage des nouveaux motifs de CP pour Tech Solutions.\n\nExcellente journée !`
  },
  {
    id: "a3",
    name: "Karim Benali",
    initials: "KB",
    ticketsCount: 15,
    criticalCount: 1,
    riskCount: 4,
    tickets: [
      { id: "TKT-8501", client: "Initech", subject: "Paramétrage astreinte week-end erroné", priority: "P1" },
      { id: "TKT-8502", client: "Initech", subject: "Régularisation primes", priority: "P2" },
    ],
    message: `Bonjour Karim,\n\nVotre backlog a été analysé.\n\n**Tickets critiques (Paie) :**\n• TK-8501 (Initech) - Paramétrage astreinte erroné\n\n**Attention :**\nLe client Initech a 4 tickets en attente avec un fort risque d'escalade. Il serait judicieux de les grouper.\n\n**Priorité recommandée aujourd'hui :**\n1. Corriger le paramétrage astreinte Initech\n2. Lancer les régularisations associées\n\nBonne journée.`
  }
];

export default function BacklogManagement() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeAnalyst, setActiveAnalyst] = useState(mockAnalysts[0]);

  const handleUpload = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
      toast.success("Analyse terminée. Répartition effectuée.", {
        icon: <Sparkles size={16} className="text-primary" />
      });
    }, 3500);
  };

  const sendEmail = () => {
    toast.success(`Communication envoyée à ${mockAnalysts.length} analystes.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse du Backlog</h1>
          <p className="text-muted-foreground mt-1">Importez les extractions, qualifiez les urgences et préparez les communications.</p>
        </div>
        {step === 3 && (
          <button 
            onClick={sendEmail}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md"
          >
            <Mail size={18} />
            Notifier l'équipe (Email)
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="border-2 border-dashed border-border rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-card hover:bg-secondary/20 transition-colors relative w-full max-w-3xl cursor-pointer group">
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <FileSpreadsheet size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Importez l'extraction Siebel (Tickets)</h2>
              <p className="text-muted-foreground max-w-md">
                Glissez-déposez le fichier Excel exporté ce matin. Le système va lire chaque ticket, croiser les mots clés et déterminer la criticité paie pour chaque analyste.
              </p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="bg-card border border-border rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-xl max-w-2xl w-full">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <Bot size={48} className="text-primary" />
                </div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold mb-6">Analyse du backlog en cours...</h2>
              <div className="space-y-4 text-left w-full max-w-sm">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 size={18} className="text-green-500" /> Extraction lue avec succès (142 tickets)
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 size={18} className="text-green-500" /> Détection des mots-clés "Paie", "DSN", "Bloquant"...
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-foreground animate-pulse">
                  <Sparkles size={18} className="text-primary" /> Rédaction des briefings personnalisés...
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0"
          >
            {/* Left Column: Analysts List */}
            <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">L'équipe ({mockAnalysts.length})</div>
              <div className="space-y-3 overflow-y-auto pr-2 pb-4">
                {mockAnalysts.map(analyst => (
                  <button
                    key={analyst.id}
                    onClick={() => setActiveAnalyst(analyst)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      activeAnalyst.id === analyst.id 
                        ? "bg-card border-primary shadow-md ring-1 ring-primary/20" 
                        : "bg-card border-border hover:border-primary/30 hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-foreground shrink-0">
                        {analyst.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{analyst.name}</div>
                        <div className="text-xs text-muted-foreground">{analyst.ticketsCount} tickets assignés</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {analyst.criticalCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-600 rounded text-[10px] font-bold uppercase">
                          <AlertTriangle size={10} /> {analyst.criticalCount} Critiques
                        </span>
                      )}
                      {analyst.riskCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-600 rounded text-[10px] font-bold uppercase">
                          {analyst.riskCount} Risques
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: AI Message & Details */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              {/* Generated Message */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Sparkles size={18} /> Briefing généré pour {activeAnalyst.name}
                  </div>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Éditer manuellement
                  </button>
                </div>
                
                <div className="bg-secondary/30 rounded-2xl p-6 text-[15px] leading-relaxed whitespace-pre-wrap font-medium text-foreground border border-border/50">
                  {activeAnalyst.message}
                </div>
              </div>

              {/* Related Tickets */}
              <div className="bg-card border border-border rounded-3xl shadow-sm flex-1 flex flex-col min-h-[250px]">
                <div className="px-6 py-5 border-b border-border font-bold flex justify-between items-center">
                  <span className="flex items-center gap-2"><User size={18}/> Top Priorités extraites</span>
                </div>
                <div className="overflow-y-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-muted-foreground uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3">Ticket</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Sujet</th>
                        <th className="px-4 py-3">Priorité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeAnalyst.tickets.map((ticket, i) => (
                        <tr key={i} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-muted-foreground">{ticket.id}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{ticket.client}</td>
                          <td className="px-4 py-3 text-muted-foreground">{ticket.subject}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              ticket.priority === 'P1' ? 'bg-red-500/10 text-red-600' : 
                              ticket.priority === 'P2' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
