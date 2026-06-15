import { useMemo, useState } from "react";
import { Plus, Search, Folder, FileText, Edit, Trash2, UploadCloud, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { initialDocuments, kbCategories, type KbDocument } from "@/pages/shared/kbMockData";

export default function ManagerDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<KbDocument[]>(initialDocuments);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    category: kbCategories[0]?.name ?? "Guides d'utilisation",
    type: "PDF" as "PDF" | "DOCX",
    pages: 10,
    file: null as File | null,
  });

  const categoriesWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const doc of documents) map.set(doc.category, (map.get(doc.category) ?? 0) + 1);
    return [
      { name: "Tous", count: documents.length },
      ...kbCategories.map((c) => ({ name: c.name, count: map.get(c.name) ?? 0 })),
    ];
  }, [documents]);

  const filteredDocs = documents.filter((d) => {
    const matchesCategory = activeCategory === "Tous" || d.category === activeCategory;
    const matchesSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addDocument = () => {
    if (!newDoc.title.trim()) {
      toast.error("Le titre du document est requis.");
      return;
    }

    const doc: KbDocument = {
      id: Date.now(),
      title: newDoc.title.trim(),
      category: newDoc.category,
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
      author: user?.name || "Admin",
      type: newDoc.type,
      pages: Math.max(1, Number(newDoc.pages) || 1),
    };

    setDocuments([doc, ...documents]);
    toast.success("Document ajouté.", { icon: <CheckCircle2 size={16} className="text-primary" /> });
    setShowAdd(false);
    setNewDoc({ title: "", category: newDoc.category, type: "PDF", pages: 10, file: null });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base documentaire</h1>
          <p className="text-muted-foreground mt-1">
            Les documents sont des références (PDF/Word). Ils complètent les skills, mais ne remplacent pas une fiche métier structurée.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors shadow-lg"
        >
          <Plus size={18} />
          Ajouter un document
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar catégories */}
        <div className="w-64 border border-border rounded-2xl bg-card/30 hidden md:flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dossiers</div>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {categoriesWithCounts.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder size={16} />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-md">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground font-medium hidden sm:block">
              {activeCategory === "Tous" ? "Tous les documents" : activeCategory} • {filteredDocs.length}
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pb-2">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{doc.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="px-2 py-0.5 bg-secondary rounded-full">{doc.category}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>Par {doc.author}</span>
                      <span>•</span>
                      <span>
                        {doc.type} — {doc.pages} p.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>Aucun document dans ce dossier.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add document drawer-like modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center p-6 z-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Ajouter un document</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Le document sera disponible dans la base documentaire.</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Titre</label>
                    <input
                      value={newDoc.title}
                      onChange={(e) => setNewDoc((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Ex: Procédure de transfert de gestion paie"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Dossier</label>
                    <select
                      value={newDoc.category}
                      onChange={(e) => setNewDoc((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    >
                      {kbCategories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Type</label>
                    <select
                      value={newDoc.type}
                      onChange={(e) => setNewDoc((p) => ({ ...p, type: e.target.value as "PDF" | "DOCX" }))}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Pages</label>
                    <input
                      type="number"
                      min={1}
                      value={newDoc.pages}
                      onChange={(e) => setNewDoc((p) => ({ ...p, pages: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Auteur</label>
                    <input
                      value={user?.name || "Admin"}
                      readOnly
                      className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Fichier (optionnel)</label>
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-secondary/20 hover:bg-secondary/50 transition-colors relative group cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setNewDoc((p) => ({ ...p, file: e.target.files?.[0] ?? null }))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {newDoc.file ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={28} className="text-blue-500" />
                        <p className="text-sm font-semibold text-foreground">{newDoc.file.name}</p>
                        <p className="text-xs text-primary group-hover:underline">Changer le fichier</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="text-primary mb-2" />
                        <p className="text-sm font-semibold text-foreground">Importer un fichier</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF ou Word. (Démo : non stocké)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-border flex justify-end gap-3 bg-secondary/20">
                <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors">
                  Annuler
                </button>
                <button onClick={addDocument} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  Ajouter le document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
