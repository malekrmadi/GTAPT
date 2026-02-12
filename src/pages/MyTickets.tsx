import { useState } from "react";
import { Plus, Clock, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TicketItem {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  theme: string;
  status: "À faire" | "En cours" | "Terminé";
  time: string;
}

const initialTickets: TicketItem[] = [
  { id: 1, title: "Anomalie compteur CP salarié #4521", priority: "High", theme: "Congés Payés", status: "En cours", time: "1h30" },
  { id: 2, title: "Paramétrage RTT nouveau client", priority: "Medium", theme: "RTT", status: "À faire", time: "2h" },
  { id: 3, title: "Transfert GTA entité Lyon", priority: "High", theme: "TransGP", status: "En cours", time: "3h" },
  { id: 4, title: "Correction rapport heures sup", priority: "Low", theme: "Création de rapports", status: "Terminé", time: "45min" },
  { id: 5, title: "Mise à jour règles astreinte", priority: "Medium", theme: "Astreintes", status: "À faire", time: "1h" },
  { id: 6, title: "Vérification intégration paie mars", priority: "Medium", theme: "Intégration paie", status: "À faire", time: "2h" },
  { id: 7, title: "Réponse client anomalie pointage", priority: "High", theme: "Support client GTA", status: "Terminé", time: "30min" },
];

const priorityStyle: Record<string, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

const statusCols: ("À faire" | "En cours" | "Terminé")[] = ["À faire", "En cours", "Terminé"];

const themes = ["Congés Payés", "RTT", "TransGP", "Astreintes", "Paramétrage GTA", "Création de rapports", "Support client GTA", "Intégration paie", "Heures supplémentaires"];

export default function MyTickets() {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [showAdd, setShowAdd] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", priority: "Medium" as "Low" | "Medium" | "High", theme: themes[0], time: "1h" });

  const addTicket = () => {
    if (!newTicket.title.trim()) return;
    setTickets((prev) => [...prev, { ...newTicket, id: Date.now(), status: "À faire" }]);
    setNewTicket({ title: "", priority: "Medium", theme: themes[0], time: "1h" });
    setShowAdd(false);
  };

  const moveTicket = (id: number, newStatus: "À faire" | "En cours" | "Terminé") => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const stats = {
    total: tickets.length,
    done: tickets.filter((t) => t.status === "Terminé").length,
    inProgress: tickets.filter((t) => t.status === "En cours").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">My Tickets</h2>
          <p className="text-sm text-muted-foreground">Gérez vos tickets GTA</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
          <Plus size={16} /> Nouveau ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="elevated-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="elevated-card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground">En cours</p>
        </div>
        <div className="elevated-card p-4 text-center">
          <p className="text-2xl font-bold text-success">{stats.done}</p>
          <p className="text-xs text-muted-foreground">Terminés</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid gap-4 lg:grid-cols-3">
        {statusCols.map((status) => (
          <div key={status} className="min-h-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-foreground">{status}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {tickets.filter((t) => t.status === status).length}
              </span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {tickets.filter((t) => t.status === status).map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="elevated-card p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xs font-semibold text-foreground leading-tight pr-2">{ticket.title}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${priorityStyle[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Tag size={10} />{ticket.theme}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock size={10} />{ticket.time}</span>
                    </div>
                    {status !== "Terminé" && (
                      <div className="flex gap-1">
                        {statusCols.filter((s) => s !== status).map((s) => (
                          <button
                            key={s}
                            onClick={() => moveTicket(ticket.id, s)}
                            className="text-[9px] px-2 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                          >
                            → {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Nouveau ticket</h3>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Titre du ticket"
                  className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <select
                  value={newTicket.theme}
                  onChange={(e) => setNewTicket({ ...newTicket, theme: e.target.value })}
                  className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none"
                >
                  {themes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  value={newTicket.time}
                  onChange={(e) => setNewTicket({ ...newTicket, time: e.target.value })}
                  placeholder="Temps estimé"
                  className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button onClick={addTicket} className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
                  Créer le ticket
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
