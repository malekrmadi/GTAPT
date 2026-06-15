import { useState } from "react";
import { Search, Database, Clock, User, CheckCircle2, PlayCircle, Settings2, FileText, ChevronRight, Download, ArrowLeft, Target, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const skillsData = [
  {
    id: 1,
    name: "Congés Payés",
    category: "Paie & Absences",
    description: "Expertise sur le calcul et l'acquisition des congés payés selon la convention collective.",
    objective: "Guider l'analyste dans le diagnostic et la résolution des anomalies liées aux compteurs CP (CP100, CP130, CP150).",
    context: "À consulter lors de tickets portant sur des soldes CP incorrects, des erreurs DSN liées aux absences, ou des demandes de paramétrage d'acquisition.",
    tags: ["CP", "Acquisition", "Solde"],
    uses: 1245,
    owner: "Jean Dupont",
    updated: "Il y a 2j",
    status: "active",
    criticality: "High",
    document: {
      title: "Guide_Acquisition_CP_2024.pdf",
      pages: [
        { title: "1. Sommaire", content: "1. Principes d'acquisition\n2. Les compteurs CP100, CP130, CP150\n3. Règles de fractionnement\n4. Erreurs fréquentes en paie" },
        { title: "2. Les compteurs GTA", content: "• CP100 : Droit principal. 2.5 jours ouvrables acquis par mois.\n• CP130 : Droit d'ancienneté. Ne se reporte pas automatiquement.\n• CP150 : Jours de fractionnement. S'acquièrent au 31 octobre sous condition de solde." },
        { title: "3. Erreurs fréquentes", content: "L'erreur principale constatée lors des DSN est la non-déduction des jours fériés chômés lors d'une semaine de congés complète. Assurez-vous que l'outil GTA compense ce jour en repoussant la date de fin de congé." },
      ],
    },
  },
  {
    id: 2,
    name: "RTT & Forfait",
    category: "Paie & Absences",
    description: "Règles de calcul des RTT pour les cadres au forfait jours et les employés.",
    objective: "Fournir les règles de calcul et les bonnes pratiques pour la gestion des RTT et forfaits jours.",
    context: "À consulter sur les tickets de paramétrage forfait jours, erreurs de solde RTT, ou questions sur le report des droits.",
    tags: ["Forfait", "Cadre"],
    uses: 890,
    owner: "Marie Curie",
    updated: "Il y a 5j",
    status: "active",
    criticality: "Medium",
    document: {
      title: "Note_Interne_RTT_Cadres.pdf",
      pages: [
        { title: "1. Calcul du droit", content: "Formule : 365 - (104 week-ends + 25 CP + jours fériés chômés + 218 jours travaillés). Le solde de RTT varie chaque année selon la disposition des jours fériés." },
        { title: "2. Bonnes pratiques", content: "Les RTT200 ne sont pas reportables sur N+1 sauf accord d'entreprise explicite. Le solde doit être soldé avant le 31 décembre de l'année civile." },
      ],
    },
  },
  {
    id: 3,
    name: "Astreinte",
    category: "GTA Core",
    description: "Règles d'indemnisation et de récupération des heures d'astreinte.",
    objective: "Clarifier les règles légales et paramétriques des astreintes (indemnisation, repos compensateur).",
    context: "Pour les tickets liés au paramétrage astreinte, indemnités code 4500, ou récupération heures.",
    tags: ["Nuit", "Week-end"],
    uses: 432,
    owner: "Jean Dupont",
    updated: "Il y a 1 sem",
    status: "active",
    criticality: "High",
    document: { title: "Astreinte_Legale.pdf", pages: [{ title: "Résumé", content: "Une astreinte implique une disponibilité. Elle donne lieu soit à repos compensateur, soit à indemnisation financière (code rubrique 4500)." }] },
  },
  {
    id: 4,
    name: "Decidium Interface",
    category: "Decidium",
    description: "Navigation et paramétrage de base dans l'outil Decidium.",
    objective: "Accompagner l'analyste dans la navigation et le paramétrage N1 de Decidium.",
    context: "Tickets de prise en main Decidium, erreurs d'interface, ou demandes de paramétrage basique.",
    tags: ["Interface", "Paramétrage"],
    uses: 2100,
    owner: "Admin",
    updated: "Il y a 1 mois",
    status: "active",
    criticality: "Low",
    document: { title: "Decidium_N1.pdf", pages: [{ title: "Manuel", content: "Guide d'utilisation de l'interface Decidium." }] },
  },
  {
    id: 5,
    name: "DSN & Déclarations",
    category: "Paie & Absences",
    description: "Gestion des erreurs et anomalies DSN, codes rubriques et motifs d'arrêt.",
    objective: "Diagnostiquer et résoudre les erreurs bloquantes DSN avant transmission.",
    context: "Tickets P1 bloquants DSN, erreurs de rubriques, motifs d'arrêt non reconnus.",
    tags: ["DSN", "Rubriques", "Bloquant"],
    uses: 756,
    owner: "Karim Benali",
    updated: "Il y a 3j",
    status: "active",
    criticality: "High",
    document: { title: "Guide_DSN_Anomalies.pdf", pages: [{ title: "Codes erreurs fréquents", content: "S21.G00.40.009 — Motif d'arrêt non reconnu.\nS21.G00.78.001 — Rubrique absente du paramétrage.\nProcédure : vérifier le paramétrage client puis relancer la génération DSN." }] },
  },
  {
    id: 6,
    name: "Transfert de gestion",
    category: "Support Client",
    description: "Procédure complète de transfert de gestion paie entre entités ou prestataires.",
    objective: "Guider l'analyste étape par étape dans un transfert de gestion paie.",
    context: "Nouveaux clients, changement de prestataire, migration de données historiques.",
    tags: ["Migration", "Onboarding"],
    uses: 389,
    owner: "Marie Curie",
    updated: "Il y a 1 sem",
    status: "active",
    criticality: "Medium",
    document: { title: "Procedure_Transfert_Gestion.pdf", pages: [{ title: "Étapes clés", content: "1. Inventaire des compteurs et soldes\n2. Export des données historiques\n3. Paramétrage du nouveau périmètre\n4. Contrôle de cohérence post-migration" }] },
  },
];

const categories = ["Tous", "GTA Core", "Decidium", "Paie & Absences", "Support Client", "Bonnes pratiques"];

export default function GtaSkills() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<(typeof skillsData)[0] | null>(null);

  const filteredSkills = skillsData.filter((skill) => {
    const matchesCategory = activeCategory === "Tous" || skill.category === activeCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedSkill) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col bg-background">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-8 py-4 flex items-center justify-between">
          <button onClick={() => setSelectedSkill(null)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Retour aux skills
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm">
            <PlayCircle size={16} /> Consulter
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-md shrink-0 mt-1">
                <Database size={28} className="text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">{selectedSkill.category}</span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${selectedSkill.criticality === "High" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"}`}>
                    {selectedSkill.criticality} Priority
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-3">{selectedSkill.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><User size={16} /> {selectedSkill.owner}</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} /> Mis à jour {selectedSkill.updated}</span>
                  <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-blue-500" /> {selectedSkill.uses} consultations</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold">Description</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{selectedSkill.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary/30 border border-border rounded-2xl p-5 space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2"><Target size={16} className="text-primary" /> Objectif</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedSkill.objective}</p>
                </div>
                <div className="bg-secondary/30 border border-border rounded-2xl p-5 space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2"><BookOpen size={16} className="text-orange-500" /> Contexte d'utilisation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedSkill.context}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSkill.tags.map((tag) => (
                  <span key={tag} className="text-xs font-bold px-3 py-1.5 bg-secondary rounded-lg text-foreground uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-lg font-bold flex items-center gap-2"><FileText size={20} className="text-primary" /> Base Documentaire Associée</h3>
                <button className="flex items-center gap-1.5 text-primary hover:underline font-medium text-sm"><Download size={16} /> PDF</button>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-secondary/50 px-6 py-4 border-b border-border">
                  <div className="font-semibold text-foreground text-sm flex items-center gap-2"><FileText size={16} className="text-red-500" />{selectedSkill.document.title}</div>
                </div>
                <div className="p-10 bg-background font-serif text-foreground space-y-10">
                  <div className="text-center border-b border-border pb-8">
                    <h2 className="text-3xl font-bold mb-3">Guide Pratique : {selectedSkill.name}</h2>
                    <p className="text-sm text-muted-foreground italic">Document de référence métier — Confidentiel RH</p>
                  </div>
                  <div className="space-y-8 max-w-3xl mx-auto">
                    {selectedSkill.document.pages.map((page, i) => (
                      <div key={i} className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">{page.title}</h3>
                        <div className="text-[15px] leading-loose whitespace-pre-wrap pl-4 border-l-2 border-primary/30 text-muted-foreground">{page.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bibliothèque de Skills</h1>
          <p className="text-muted-foreground">Explorez les compétences métier disponibles pour accompagner votre activité quotidienne.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="text" placeholder="Rechercher un skill..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" />
          </div>
          <button className="p-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-secondary transition-colors shadow-sm"><Settings2 size={18} /></button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-foreground text-background shadow-md" : "bg-card text-muted-foreground hover:bg-secondary border border-border"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-8">
        <AnimatePresence>
          {filteredSkills.map((skill, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-sm"><Database size={20} className="text-primary-foreground" /></div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${skill.status === "active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                  {skill.status === "active" && <CheckCircle2 size={12} />}
                  {skill.status === "active" ? "Actif" : "Inactif"}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{skill.description}</p>
              <p className="text-xs text-muted-foreground/80 mb-4 line-clamp-2 italic">{skill.context}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {skill.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-md text-muted-foreground uppercase tracking-wider">{tag}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium"><BookOpen size={14} className="text-blue-500" /><span>{skill.uses} consultations</span></div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-primary group-hover:underline font-medium flex items-center gap-1">Ouvrir <ChevronRight size={14} /></span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
