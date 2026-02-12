import { useState } from "react";
import { Search, FileText, BookOpen, HelpCircle, Ticket, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { label: "Toutes", value: "all" },
  { label: "Procédures", value: "procedures", icon: FileText },
  { label: "Définitions", value: "definitions", icon: BookOpen },
  { label: "Cas pratiques", value: "cas", icon: HelpCircle },
  { label: "Tickets types", value: "tickets", icon: Ticket },
  { label: "Documentation", value: "docs", icon: FolderOpen },
];

const results = [
  { title: "Procédure de validation des congés payés", category: "procedures", theme: "Congés Payés", excerpt: "Étapes complètes pour valider une demande de CP dans l'outil GTA, incluant les cas de refus et les délais réglementaires." },
  { title: "Définition : RTT forfait jours", category: "definitions", theme: "RTT", excerpt: "Réduction du Temps de Travail applicable aux cadres au forfait jours. Calcul basé sur le nombre de jours ouvrés de l'année." },
  { title: "Cas pratique : Anomalie pointage salarié multi-sites", category: "cas", theme: "Anomalies temps", excerpt: "Comment résoudre une anomalie de pointage pour un salarié travaillant sur plusieurs établissements avec des plannings différents." },
  { title: "Ticket type : Demande de régularisation heures sup", category: "tickets", theme: "Heures supplémentaires", excerpt: "Modèle de réponse pour traiter une demande de régularisation d'heures supplémentaires non comptabilisées." },
  { title: "Guide paramétrage compteurs GTA", category: "docs", theme: "Paramétrage GTA", excerpt: "Documentation complète sur la configuration des compteurs de temps dans l'application GTA : CP, RTT, CET, repos compensateur." },
  { title: "Procédure TransGP - Transfert gestion paie", category: "procedures", theme: "TransGP", excerpt: "Guide pas-à-pas pour effectuer un transfert de gestion paie entre deux entités, avec checklist de synchronisation GTA." },
  { title: "Définition : Astreinte et temps d'intervention", category: "definitions", theme: "Astreintes", excerpt: "Distinction entre période d'astreinte et temps d'intervention effectif. Règles de majoration et repos compensateur." },
  { title: "Cas pratique : Calcul prorata RTT temps partiel", category: "cas", theme: "RTT", excerpt: "Méthode de calcul des RTT pour un salarié passant de temps plein à temps partiel en cours d'année." },
];

const categoryIcons: Record<string, typeof FileText> = {
  procedures: FileText,
  definitions: BookOpen,
  cas: HelpCircle,
  tickets: Ticket,
  docs: FolderOpen,
};

const categoryColors: Record<string, string> = {
  procedures: "text-info",
  definitions: "text-primary",
  cas: "text-warning",
  tickets: "text-success",
  docs: "text-muted-foreground",
};

export default function GtaChrome() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = results.filter((r) => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const matchQuery = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.theme.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Search */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">GTA Chrome</h2>
        <p className="text-sm text-muted-foreground mb-6">Explorez la base de connaissances GTA</p>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une procédure, un terme, un cas pratique..."
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const Icon = categoryIcons[item.category] ?? FileText;
          const color = categoryColors[item.category] ?? "text-muted-foreground";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="elevated-card p-4 hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                  </div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary mb-2">
                    {item.theme}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.excerpt}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
