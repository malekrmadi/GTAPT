import { useState } from "react";
import { Plus, UploadCloud, FileText, CheckCircle2, Search, Settings2, Database, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsManagement() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fake state for form
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [category, setCategory] = useState("GTA Core");
  const [file, setFile] = useState<File | null>(null);

  const [skills, setSkills] = useState([
    { id: 1, name: "Congés Payés", category: "Paie & Absences", status: "active", owner: "Jean Dupont" },
    { id: 2, name: "RTT & Forfait", category: "Paie & Absences", status: "active", owner: "Marie Curie" },
    { id: 3, name: "Astreinte", category: "GTA Core", status: "inactive", owner: "Admin" },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName || !skillDesc || !file) {
      toast.error("Veuillez remplir tous les champs et ajouter un document.");
      return;
    }

    const newSkill = {
      id: Date.now(),
      name: skillName,
      category: category,
      status: "active",
      owner: user?.name || "Admin"
    };

    setSkills([newSkill, ...skills]);
    
    toast.success(`Nouveau skill "${skillName}" ajouté avec succès par ${user?.name}. L'IA analyse le document.`, {
      icon: <CheckCircle2 size={16} className="text-primary" />
    });

    setIsCreating(false);
    setSkillName("");
    setSkillDesc("");
    setFile(null);
  };

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills & Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Gérez la base documentaire et les compétences IA centralisées.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors shadow-lg"
          >
            <Plus size={18} />
            Créer un Skill
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCreating ? (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-xl max-w-4xl mx-auto w-full"
          >
            <div className="mb-8 border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-foreground">Ajouter un nouveau Skill dans la base</h2>
              <p className="text-muted-foreground text-sm mt-1">L'IA se basera sur le document fourni pour répondre aux analystes.</p>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Titre de la compétence (Skill)</label>
                  <input 
                    type="text" 
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Ex: Prime d'ancienneté"
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Catégorie</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                  >
                    <option value="GTA Core">GTA Core</option>
                    <option value="Paie & Absences">Paie & Absences</option>
                    <option value="Decidium">Decidium</option>
                    <option value="Support Client">Support Client</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Instructions système (Prompt caché)</label>
                <textarea 
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  placeholder="Décrivez à quoi sert ce skill et quand l'IA doit le déclencher..."
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm h-32 resize-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Database size={16} className="text-primary" />
                  Document Source (Base de connaissances)
                </label>
                <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-secondary/20 hover:bg-secondary/50 transition-colors relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                        <FileText size={32} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">{file.name}</p>
                        <p className="text-sm text-primary group-hover:underline">Changer le document</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-base font-bold text-foreground">Importer le PDF ou document Word</p>
                      <p className="text-sm text-muted-foreground mt-1">Maximum 15 MB. Il sera ingéré par le modèle IA.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md"
                >
                  <CheckCircle2 size={18} />
                  Sauvegarder et Entraîner l'IA
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher dans la base..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                />
              </div>
              <button className="p-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-secondary transition-colors shadow-sm">
                <Settings2 size={18} />
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nom du Skill / Doc</th>
                      <th className="px-6 py-4 font-semibold">Catégorie</th>
                      <th className="px-6 py-4 font-semibold">Owner</th>
                      <th className="px-6 py-4 font-semibold">Statut</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSkills.map(skill => (
                      <tr key={skill.id} className="hover:bg-secondary/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">{skill.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Lié à 1 document</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-secondary rounded-md text-xs font-semibold">
                            {skill.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">
                          {skill.owner}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            skill.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${skill.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                            {skill.status === 'active' ? 'En ligne' : 'Brouillon'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
