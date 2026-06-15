import { useState } from "react";
import { Plus, UploadCloud, FileText, CheckCircle2, Search, Settings2, Database, Trash2, Edit, Folder, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ExamManagement, { initialExams, type Exam } from "./ExamManagement";

type ManagerTab = "skills" | "documents" | "exams";

interface Skill {
  id: number;
  name: string;
  category: string;
  status: string;
  owner: string;
  description: string;
  objective: string;
  context: string;
  documents: number;
  updated: string;
}

interface KbDocument {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  type: string;
  pages: number;
}

const kbCategories = [
  { id: 1, name: "Guides d'utilisation", count: 14 },
  { id: 2, name: "Réglementation légale", count: 11 },
  { id: 3, name: "Procédures internes", count: 28 },
  { id: 4, name: "Annonces & Communications", count: 7 },
  { id: 5, name: "Fiches paramétrage client", count: 19 },
  { id: 6, name: "Cas pratiques & retours d'expérience", count: 15 },
];

const initialDocuments: KbDocument[] = [
  { id: 1, title: "Guide de saisie des congés", category: "Guides d'utilisation", date: "12 Juin 2026", author: "Marie Curie", type: "PDF", pages: 24 },
  { id: 2, title: "Nouvelle loi sur les forfaits jours", category: "Réglementation légale", date: "05 Juin 2026", author: "Legal Team", type: "PDF", pages: 18 },
  { id: 3, title: "Procédure d'onboarding GTA", category: "Procédures internes", date: "28 Mai 2026", author: "Jean Dupont", type: "PDF", pages: 32 },
  { id: 4, title: "Fermeture annuelle 2026", category: "Annonces & Communications", date: "20 Mai 2026", author: "Direction RH", type: "DOCX", pages: 4 },
  { id: 5, title: "Paramétrage CP — Entreprise XYZ", category: "Fiches paramétrage client", date: "15 Juin 2026", author: "Jean Dupont", type: "PDF", pages: 12 },
  { id: 6, title: "Règles d'acquisition RTT cadres Syntec", category: "Réglementation légale", date: "10 Juin 2026", author: "Marie Curie", type: "PDF", pages: 8 },
  { id: 7, title: "Traitement des anomalies DSN", category: "Procédures internes", date: "08 Juin 2026", author: "Karim Benali", type: "PDF", pages: 16 },
  { id: 8, title: "Cas pratique : fractionnement CP hors période", category: "Cas pratiques & retours d'expérience", date: "03 Juin 2026", author: "Sarah Martin", type: "PDF", pages: 6 },
  { id: 9, title: "Guide paramétrage astreintes week-end", category: "Guides d'utilisation", date: "01 Juin 2026", author: "Jean Dupont", type: "PDF", pages: 20 },
  { id: 10, title: "Mise à jour GTA v12.4 — Notes de version", category: "Annonces & Communications", date: "30 Mai 2026", author: "Équipe Produit", type: "DOCX", pages: 3 },
  { id: 11, title: "Paramétrage forfait jours — Acme Corp", category: "Fiches paramétrage client", date: "25 Mai 2026", author: "Sarah Martin", type: "PDF", pages: 15 },
  { id: 12, title: "Procédure de transfert de gestion paie", category: "Procédures internes", date: "22 Mai 2026", author: "Marie Curie", type: "PDF", pages: 28 },
];

const initialSkills: Skill[] = [
  {
    id: 1, name: "Congés Payés", category: "Paie & Absences", status: "active", owner: "Jean Dupont",
    description: "Expertise sur le calcul et l'acquisition des congés payés selon la convention collective.",
    objective: "Guider l'analyste dans le diagnostic et la résolution des anomalies liées aux compteurs CP (CP100, CP130, CP150).",
    context: "À utiliser lors de tickets portant sur des soldes CP incorrects, des erreurs DSN liées aux absences, ou des demandes de paramétrage d'acquisition.",
    documents: 3, updated: "Il y a 2j",
  },
  {
    id: 2, name: "RTT & Forfait", category: "Paie & Absences", status: "active", owner: "Marie Curie",
    description: "Règles de calcul des RTT pour les cadres au forfait jours et les employés.",
    objective: "Fournir les règles de calcul et les bonnes pratiques pour la gestion des RTT et forfaits jours.",
    context: "À déclencher sur les tickets de paramétrage forfait jours, erreurs de solde RTT, ou questions sur le report des droits.",
    documents: 2, updated: "Il y a 5j",
  },
  {
    id: 3, name: "Astreinte", category: "GTA Core", status: "active", owner: "Jean Dupont",
    description: "Règles d'indemnisation et de récupération des heures d'astreinte.",
    objective: "Clarifier les règles légales et paramétriques des astreintes (indemnisation, repos compensateur).",
    context: "Pour les tickets liés au paramétrage astreinte, indemnités code 4500, ou récupération heures.",
    documents: 2, updated: "Il y a 1 sem",
  },
  {
    id: 4, name: "Decidium Interface", category: "Decidium", status: "active", owner: "Admin",
    description: "Navigation et paramétrage de base dans l'outil Decidium.",
    objective: "Accompagner l'analyste dans la navigation et le paramétrage N1 de Decidium.",
    context: "Tickets de prise en main Decidium, erreurs d'interface, ou demandes de paramétrage basique.",
    documents: 1, updated: "Il y a 2 sem",
  },
  {
    id: 5, name: "DSN & Déclarations", category: "Paie & Absences", status: "active", owner: "Karim Benali",
    description: "Gestion des erreurs et anomalies DSN, codes rubriques et motifs d'arrêt.",
    objective: "Diagnostiquer et résoudre les erreurs bloquantes DSN avant transmission.",
    context: "Tickets P1 bloquants DSN, erreurs de rubriques, motifs d'arrêt non reconnus.",
    documents: 4, updated: "Il y a 3j",
  },
  {
    id: 6, name: "Heures supplémentaires", category: "GTA Core", status: "inactive", owner: "Sarah Martin",
    description: "Règles de décompte, majoration et contingent des heures supplémentaires.",
    objective: "Couvrir les cas de dépassement de contingent, majorations légales et paramétrage HS.",
    context: "Anomalies de calcul HS, dépassement contingent annuel, demandes de régularisation.",
    documents: 2, updated: "Il y a 3 sem",
  },
  {
    id: 7, name: "Transfert de gestion", category: "Support Client", status: "active", owner: "Marie Curie",
    description: "Procédure complète de transfert de gestion paie entre entités ou prestataires.",
    objective: "Guider l'analyste étape par étape dans un transfert de gestion paie.",
    context: "Nouveaux clients, changement de prestataire, migration de données historiques.",
    documents: 3, updated: "Il y a 1 sem",
  },
];

export default function SkillsManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ManagerTab>("skills");
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [docCategory, setDocCategory] = useState("Tous");

  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillObjective, setSkillObjective] = useState("");
  const [skillContext, setSkillContext] = useState("");
  const [category, setCategory] = useState("GTA Core");
  const [file, setFile] = useState<File | null>(null);

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [documents] = useState<KbDocument[]>(initialDocuments);
  const [exams, setExams] = useState<Exam[]>(initialExams);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName || !skillDesc || !file) {
      toast.error("Veuillez remplir tous les champs et ajouter un document.");
      return;
    }
    const newSkill: Skill = {
      id: Date.now(),
      name: skillName,
      category,
      status: "active",
      owner: user?.name || "Admin",
      description: skillDesc,
      objective: skillObjective || skillDesc,
      context: skillContext || "À utiliser selon le contexte métier du ticket.",
      documents: 1,
      updated: "À l'instant",
    };
    setSkills([newSkill, ...skills]);
    toast.success(`Skill "${skillName}" ajouté avec succès.`, { icon: <CheckCircle2 size={16} className="text-primary" /> });
    setIsCreating(false);
    setSkillName(""); setSkillDesc(""); setSkillObjective(""); setSkillContext(""); setFile(null);
  };

  const filteredSkills = skills.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDocs = documents.filter((d) =>
    (docCategory === "Tous" || d.category === docCategory) &&
    (!searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs: { id: ManagerTab; label: string; icon: typeof Database }[] = [
    { id: "skills", label: "Skills", icon: Database },
    { id: "documents", label: "Base documentaire", icon: Folder },
    { id: "exams", label: "Examens", icon: GraduationCap },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base Manager</h1>
          <p className="text-muted-foreground mt-1">Gérez les compétences métier, la base documentaire et les évaluations.</p>
        </div>
        {activeTab === "skills" && !isCreating && (
          <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors shadow-lg">
            <Plus size={18} /> Créer un Skill
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setIsCreating(false); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── SKILLS TAB ── */}
        {activeTab === "skills" && (
          <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
            {isCreating ? (
              <div className="bg-card border border-border rounded-3xl p-8 shadow-xl max-w-4xl mx-auto w-full">
                <div className="mb-8 border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">Ajouter un nouveau Skill</h2>
                  <p className="text-muted-foreground text-sm mt-1">Définissez la compétence métier et associez la documentation de référence.</p>
                </div>
                <form onSubmit={handleCreateSkill} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Titre de la compétence</label>
                      <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Ex: Prime d'ancienneté" className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Catégorie</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                        <option value="GTA Core">GTA Core</option>
                        <option value="Paie & Absences">Paie & Absences</option>
                        <option value="Decidium">Decidium</option>
                        <option value="Support Client">Support Client</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} placeholder="Décrivez le périmètre de cette compétence..." className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Objectif</label>
                      <textarea value={skillObjective} onChange={(e) => setSkillObjective(e.target.value)} placeholder="Quel est l'objectif de ce skill ?" className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Contexte d'utilisation</label>
                      <textarea value={skillContext} onChange={(e) => setSkillContext(e.target.value)} placeholder="Dans quels cas ce skill doit-il être consulté ?" className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Database size={16} className="text-primary" /> Document source</label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-secondary/20 hover:bg-secondary/50 transition-colors relative group cursor-pointer">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {file ? (
                        <div className="flex flex-col items-center gap-3">
                          <FileText size={32} className="text-blue-500" />
                          <p className="text-base font-bold">{file.name}</p>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-primary mb-4" />
                          <p className="text-base font-bold">Importer un PDF ou document Word</p>
                          <p className="text-sm text-muted-foreground mt-1">Maximum 15 MB. Sera indexé dans la base documentaire.</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-border flex justify-end gap-4">
                    <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors">Annuler</button>
                    <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md">
                      <CheckCircle2 size={18} /> Enregistrer le Skill
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" placeholder="Rechercher un skill..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" />
                  </div>
                  <button className="p-2.5 bg-card border border-border rounded-xl hover:bg-secondary transition-colors shadow-sm"><Settings2 size={18} /></button>
                </div>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Compétence</th>
                          <th className="px-6 py-4 font-semibold">Catégorie</th>
                          <th className="px-6 py-4 font-semibold">Objectif</th>
                          <th className="px-6 py-4 font-semibold">Owner</th>
                          <th className="px-6 py-4 font-semibold">Statut</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredSkills.map((skill) => (
                          <tr key={skill.id} className="hover:bg-secondary/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-bold group-hover:text-primary transition-colors">{skill.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{skill.description}</div>
                            </td>
                            <td className="px-6 py-4"><span className="px-2.5 py-1 bg-secondary rounded-md text-xs font-semibold">{skill.category}</span></td>
                            <td className="px-6 py-4 text-xs text-muted-foreground max-w-[200px] line-clamp-2">{skill.objective}</td>
                            <td className="px-6 py-4 text-muted-foreground font-medium">{skill.owner}</td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${skill.status === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${skill.status === "active" ? "bg-green-500" : "bg-muted-foreground"}`} />
                                {skill.status === "active" ? "En ligne" : "Brouillon"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-secondary rounded-lg"><Edit size={16} /></button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg hover:text-red-500"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === "documents" && (
          <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-6 flex-1 min-h-0">
            <div className="w-56 shrink-0 hidden md:block space-y-1">
              <button onClick={() => setDocCategory("Tous")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${docCategory === "Tous" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"}`}>
                <Folder size={14} className="inline mr-2" />Tous ({documents.length})
              </button>
              {kbCategories.map((cat) => (
                <button key={cat.id} onClick={() => setDocCategory(cat.name)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${docCategory === cat.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"}`}>
                  <span className="truncate text-left"><Folder size={14} className="inline mr-2" />{cat.name}</span>
                  <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-md shrink-0">{cat.count}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" placeholder="Rechercher un document..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-full focus:ring-2 focus:ring-primary/50 shadow-sm" />
              </div>
              <div className="space-y-3 overflow-y-auto flex-1">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0"><FileText size={20} /></div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{doc.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{doc.category}</span><span>•</span><span>{doc.date}</span><span>•</span><span>Par {doc.author}</span><span>•</span><span>{doc.type} — {doc.pages} p.</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-secondary rounded-lg"><Edit size={16} /></button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg hover:text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EXAMS TAB ── */}
        {activeTab === "exams" && (
          <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
            <ExamManagement exams={exams} onExamsChange={setExams} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
