import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  StickyNote,
  Bell,
  Archive,
  ArchiveRestore,
  Plus,
  History,
  Filter,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  client: string;
  subject: string;
  priority: "P1" | "P2" | "P3";
  status: string;
  time: string;
  description: string;
  notes: Note[];
  memo: string;
  reminder: string;
  archived: boolean;
}

const initialTickets: Ticket[] = [
  {
    id: "TKT-8471",
    client: "Entreprise XYZ",
    subject: "Blocage DSN - Erreur bloquante",
    priority: "P1",
    status: "À faire",
    time: "2h restantes",
    description: "Erreur DSN bloquante détectée lors de la transmission du lot de paie mars. Code erreur S21.G00.40.009 — motif d'arrêt non reconnu.",
    notes: [{ id: "n1", content: "Contacté le client — en attente du fichier de reprise.", createdAt: "15/06/2026 09:15" }],
    memo: "Vérifier le paramétrage des motifs d'arrêt avant la prochaine paie.",
    reminder: "2026-06-16",
    archived: false,
  },
  {
    id: "TKT-8472",
    client: "Acme Corp",
    subject: "Absence non décomptée suite MÀJ",
    priority: "P2",
    status: "En cours",
    time: "Aujourd'hui",
    description: "Suite à la mise à jour GTA v12.4, les absences maladie ne sont plus décomptées sur le compteur CP100.",
    notes: [],
    memo: "",
    reminder: "",
    archived: false,
  },
  {
    id: "TKT-8475",
    client: "Tech Solutions",
    subject: "Erreur calcul CP ancienneté",
    priority: "P2",
    status: "À faire",
    time: "Demain",
    description: "Le compteur CP130 ne prend pas en compte l'ancienneté acquise avant le transfert de gestion.",
    notes: [{ id: "n2", content: "Règle d'ancienneté à vérifier dans le paramétrage client.", createdAt: "14/06/2026 16:30" }],
    memo: "Comparer avec la fiche paramétrage initiale.",
    reminder: "",
    archived: false,
  },
  {
    id: "TKT-8480",
    client: "Globex",
    subject: "Demande d'export spécifique",
    priority: "P3",
    status: "À faire",
    time: "Semaine pro",
    description: "Le client demande un export Excel personnalisé des soldes CP et RTT par entité juridique.",
    notes: [],
    memo: "",
    reminder: "",
    archived: false,
  },
  {
    id: "TKT-8460",
    client: "Initech",
    subject: "Régularisation primes trimestrielles",
    priority: "P3",
    status: "Terminé",
    time: "Clôturé",
    description: "Régularisation des primes Q1 effectuée et validée par le client.",
    notes: [{ id: "n3", content: "Ticket clôturé — validation client reçue par email.", createdAt: "10/06/2026 11:00" }],
    memo: "",
    reminder: "",
    archived: false,
  },
  {
    id: "TKT-8455",
    client: "Umbrella Corp",
    subject: "Paramétrage forfait jours cadres",
    priority: "P2",
    status: "Terminé",
    time: "Archivé",
    description: "Paramétrage RTT forfait jours pour 45 cadres — dossier clos.",
    notes: [],
    memo: "",
    reminder: "",
    archived: true,
  },
];

type ViewMode = "main" | "full" | "detail";

export default function MyBacklog() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [briefingRead, setBriefingRead] = useState(false);

  const selectedTicket = tickets.find((t) => t.id === selectedId);

  const message = `Bonjour ${user?.name?.split(" ")[0] || "Analyste"},\n\nVoici les priorités identifiées sur votre backlog après analyse de l'équipe.\n\n**Tickets critiques (Paie) :**\n• TKT-8471 (Entreprise XYZ) - Blocage DSN\n\n**Attention :**\nVous avez 3 tickets qui présentent un risque de relance avant la prochaine période de paie.\n\n**Priorité recommandée aujourd'hui :**\n1. Résoudre le blocage DSN (Urgence Absolue)\n2. Contrôle paie Acme Corp\n\nBon courage pour cette journée !`;

  const priorityTickets = tickets.filter((t) => !t.archived && ["P1", "P2"].includes(t.priority));
  const displayedTickets =
    viewMode === "full"
      ? tickets.filter((t) => (showArchived ? true : !t.archived))
      : priorityTickets;

  const openTicket = (id: string) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  const addNote = () => {
    if (!selectedTicket || !newNote.trim()) return;
    const note: Note = {
      id: `n-${Date.now()}`,
      content: newNote.trim(),
      createdAt: new Date().toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, notes: [note, ...t.notes] } : t))
    );
    setNewNote("");
    toast.success("Note ajoutée");
  };

  const updateField = (field: "memo" | "reminder", value: string) => {
    if (!selectedTicket) return;
    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? { ...t, [field]: value } : t)));
  };

  const toggleArchive = () => {
    if (!selectedTicket) return;
    const next = !selectedTicket.archived;
    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? { ...t, archived: next } : t)));
    toast.success(next ? "Ticket archivé" : "Ticket restauré");
    if (next) {
      setViewMode("main");
      setSelectedId(null);
    }
  };

  const priorityClass = (p: string) =>
    p === "P1" ? "bg-red-500/10 text-red-600" : p === "P2" ? "bg-orange-500/10 text-orange-600" : "bg-blue-500/10 text-blue-600";

  // ── Vue détail ticket ──
  if (viewMode === "detail" && selectedTicket) {
    return (
      <div className="p-8 max-w-5xl mx-auto h-full flex flex-col gap-6">
        <button
          onClick={() => { setViewMode("main"); setSelectedId(null); }}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Retour au backlog
        </button>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${priorityClass(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </span>
                <span className="text-xs font-bold text-muted-foreground">{selectedTicket.id}</span>
                <span className="text-xs px-2 py-0.5 bg-secondary rounded-full font-medium">{selectedTicket.status}</span>
                {selectedTicket.archived && (
                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium flex items-center gap-1">
                    <Archive size={10} /> Archivé
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">{selectedTicket.subject}</h1>
              <p className="text-muted-foreground font-medium mt-1">{selectedTicket.client}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-full shrink-0">
              <Clock size={14} /> {selectedTicket.time}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
            {selectedTicket.description}
          </p>

          {/* Mémo & Rappel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <StickyNote size={16} className="text-primary" /> Mémo personnel
              </label>
              <textarea
                value={selectedTicket.memo}
                onChange={(e) => updateField("memo", e.target.value)}
                placeholder="Gardez un rappel rapide lié à ce ticket..."
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Bell size={16} className="text-orange-500" /> Rappel
              </label>
              <input
                type="date"
                value={selectedTicket.reminder}
                onChange={(e) => updateField("reminder", e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
              {selectedTicket.reminder && (
                <p className="text-xs text-muted-foreground">Rappel programmé pour le {new Date(selectedTicket.reminder).toLocaleDateString("fr-FR")}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History size={18} className="text-primary" /> Notes personnelles
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Ajouter une note de suivi..."
                className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>

            {selectedTicket.notes.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedTicket.notes.map((note) => (
                  <div key={note.id} className="bg-secondary/30 border border-border rounded-xl p-4">
                    <p className="text-sm text-foreground">{note.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">{note.createdAt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucune note pour le moment.</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border flex flex-wrap gap-3">
            <button
              onClick={toggleArchive}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                selectedTicket.archived
                  ? "bg-secondary text-foreground hover:bg-secondary/80"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {selectedTicket.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
              {selectedTicket.archived ? "Restaurer le ticket" : "Archiver le ticket"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Vue principale & backlog complet ──
  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col gap-8">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Bonjour, {user?.name || "Analyste"} 👋</h1>
        <p className="text-muted-foreground mt-2 text-lg">Voici votre plan d'action pour aujourd'hui.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        {/* Briefing */}
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
                <h2 className="font-bold text-foreground text-lg">Briefing du jour</h2>
                <p className="text-sm text-muted-foreground">Reçu ce matin à 08:30</p>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed whitespace-pre-wrap font-medium text-foreground">
              {message}
            </div>

            {!briefingRead && (
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => setBriefingRead(true)}
                  className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm"
                >
                  J'ai pris connaissance
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tickets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col gap-4 min-w-0"
        >
          <div className="flex justify-between items-end mb-2 px-2">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              {viewMode === "full" ? "Tous les tickets" : "Tickets Prioritaires"}
              <span className="text-sm font-medium text-muted-foreground ml-1">({displayedTickets.length})</span>
            </h2>
            <div className="flex items-center gap-3">
              {viewMode === "full" && (
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    showArchived ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Filter size={14} /> {showArchived ? "Masquer archivés" : "Voir archivés"}
                </button>
              )}
              <button
                onClick={() => setViewMode(viewMode === "full" ? "main" : "full")}
                className="text-sm font-medium text-primary hover:underline"
              >
                {viewMode === "full" ? "Revenir aux priorités" : "Voir tout le backlog"}
              </button>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto pb-8 px-2">
            <AnimatePresence>
              {displayedTickets.map((ticket, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  key={ticket.id}
                  onClick={() => openTicket(ticket.id)}
                  className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${priorityClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">{ticket.id}</span>
                      {ticket.notes.length > 0 && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                          {ticket.notes.length} note{ticket.notes.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {ticket.archived && <Archive size={12} className="text-muted-foreground" />}
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
            </AnimatePresence>

            {displayedTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Archive size={40} className="mx-auto mb-3 opacity-30" />
                <p>Aucun ticket à afficher.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
