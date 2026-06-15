import { useMemo, useState } from "react";
import { Search, Folder, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { initialDocuments, kbCategories, type KbDocument } from "@/pages/shared/kbMockData";

export default function AnalystDocumentsPage() {
  const [documents] = useState<KbDocument[]>(initialDocuments);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base documentaire</h1>
          <p className="text-muted-foreground mt-1">
            Les documents sont des supports de référence (procédures, guides, notes). Pour des consignes actionnables, privilégiez les skills.
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 flex-1 min-h-0">
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
              <div key={doc.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
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
      </motion.div>
    </div>
  );
}
