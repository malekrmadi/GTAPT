import { useState } from "react";
import { Search, Database, Clock, User, CheckCircle2, PlayCircle, Settings2, Sparkles, X, FileText, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const skillsData = [
  { 
    id: 1, 
    name: "Congés Payés", 
    category: "Paie & Absences", 
    description: "Expertise sur le calcul et l'acquisition des congés payés selon la convention collective.", 
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
        { title: "3. Erreurs fréquentes", content: "L'erreur principale constatée lors des DSN est la non-déduction des jours fériés chômés lors d'une semaine de congés complète. Assurez-vous que l'outil GTA compense ce jour en repoussant la date de fin de congé." }
      ]
    }
  },
  { 
    id: 2, 
    name: "RTT & Forfait", 
    category: "Paie & Absences", 
    description: "Règles de calcul des RTT pour les cadres au forfait jours et employés.", 
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
        { title: "2. Bonnes pratiques", content: "Les RTT200 ne sont pas reportables sur N+1 sauf accord d'entreprise explicite. Le solde doit être soldé avant le 31 décembre de l'année civile." }
      ]
    }
  },
  { id: 3, name: "Astreinte", category: "GTA Core", description: "Règles d'indemnisation et de récupération des heures d'astreinte.", tags: ["Nuit", "Week-end"], uses: 432, owner: "Jean Dupont", updated: "Il y a 1 sem", status: "active", criticality: "High", document: { title: "Astreinte_Legale.pdf", pages: [{ title: "Résumé", content: "Une astreinte implique une disponibilité. Elle donne lieu soit à repos compensateur, soit à indemnisation financière (code rubrique 4500)." }] } },
  { id: 4, name: "Decidium Interface", category: "Decidium", description: "Navigation et paramétrage de base dans l'outil Decidium.", tags: ["Interface", "Paramétrage"], uses: 2100, owner: "Admin", updated: "Il y a 1 mois", status: "active", criticality: "Low", document: { title: "Decidium_N1.pdf", pages: [{ title: "Manuel", content: "Guide d'utilisation de l'interface Decidium." }] } },
];

const categories = ["Tous", "GTA Core", "Decidium", "Paie & Absences", "Support Client", "Bonnes pratiques"];

export default function GtaSkills() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<typeof skillsData[0] | null>(null);

  const filteredSkills = skillsData.filter(skill => {
    const matchesCategory = activeCategory === "Tous" || skill.category === activeCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bibliothèque de Skills IA</h1>
          <p className="text-muted-foreground">
            Explorez les compétences métier disponibles pour l'assistant GTA PT.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-secondary transition-colors shadow-sm">
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat 
                ? "bg-foreground text-background shadow-md" 
                : "bg-card text-muted-foreground hover:bg-secondary border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-8">
        {filteredSkills.map((skill, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                <Database size={20} className="text-primary-foreground" />
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                skill.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
              }`}>
                {skill.status === 'active' && <CheckCircle2 size={12} />}
                {skill.status === 'active' ? 'Actif' : 'Inactif'}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{skill.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {skill.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-md text-muted-foreground uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles size={14} className="text-blue-500" />
                <span>{skill.uses} utilisations</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-primary group-hover:underline font-medium flex items-center gap-1">
                  Ouvrir <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill Detail View (Slide-over) */}
      <AnimatePresence>
        {selectedSkill && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedSkill(null)}
            />
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[800px] bg-card border-l border-border z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-border flex justify-between items-start bg-secondary/30">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-md shrink-0">
                    <Database size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{selectedSkill.category}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        selectedSkill.criticality === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {selectedSkill.criticality} Priority
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">{selectedSkill.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><User size={14} /> Owner: {selectedSkill.owner}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> Mis à jour {selectedSkill.updated}</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedSkill(null)} className="p-2 hover:bg-secondary rounded-full transition-colors bg-card shadow-sm border border-border">
                  <X size={20} />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-6 flex-1 space-y-8 bg-background">
                
                {/* Description & Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">Description du comportement IA</h3>
                    <p className="text-sm leading-relaxed text-foreground bg-card p-4 rounded-xl border border-border">
                      {selectedSkill.description}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                        <PlayCircle size={16} /> Tester dans GTA PT
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">Usage Analytics</h3>
                    <div className="bg-card p-4 rounded-xl border border-border space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Requêtes (30j)</span>
                        <span className="text-sm font-bold">{selectedSkill.uses}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Taux de succès</span>
                        <span className="text-sm font-bold text-green-500">98.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Temps moyen</span>
                        <span className="text-sm font-bold">1.2s</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Faux Document Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground flex items-center justify-between">
                    <span>Base de connaissances associée (Source)</span>
                    <button className="flex items-center gap-1 text-primary hover:underline font-medium text-xs normal-case">
                      <Download size={14} /> Télécharger
                    </button>
                  </h3>
                  
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                    {/* Fake PDF Header */}
                    <div className="bg-secondary px-4 py-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText size={16} className="text-red-500" />
                        {selectedSkill.document.title}
                      </div>
                      <div className="text-xs text-muted-foreground">PDF • 3 pages</div>
                    </div>
                    
                    {/* Fake PDF Body */}
                    <div className="p-8 bg-white text-gray-800 h-[400px] overflow-y-auto space-y-8 font-serif shadow-inner">
                      <div className="border-b border-gray-200 pb-4 mb-4 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guide Pratique : {selectedSkill.name}</h1>
                        <p className="text-sm text-gray-500">Document confidentiel à usage interne - Direction des Ressources Humaines</p>
                      </div>
                      
                      {selectedSkill.document.pages.map((page, i) => (
                        <div key={i} className="space-y-3">
                          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            {page.title}
                          </h2>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-gray-200">
                            {page.content}
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm italic text-gray-600 border border-gray-100">
                        Note: Ce document est ingéré par l'IA lors de sa sélection du skill. Les règles décrites ici priment sur les connaissances générales du modèle.
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
