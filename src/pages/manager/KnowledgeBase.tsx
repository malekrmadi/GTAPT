import { useState } from "react";
import { Search, Folder, FileText, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";

const kbCategories = [
  { id: 1, name: "Guides d'utilisation", count: 12 },
  { id: 2, name: "Réglementation légale", count: 8 },
  { id: 3, name: "Procédures internes", count: 24 },
  { id: 4, name: "Annonces & Communications", count: 5 },
];

const documents = [
  { id: 1, title: "Guide de saisie des congés", category: "Guides d'utilisation", date: "12 Mai 2024", author: "Marie Curie" },
  { id: 2, title: "Nouvelle loi sur les forfaits jours", category: "Réglementation légale", date: "05 Mai 2024", author: "Legal Team" },
  { id: 3, title: "Procédure d'onboarding GTA", category: "Procédures internes", date: "28 Avr 2024", author: "Jean Dupont" },
  { id: 4, title: "Fermeture annuelle 2024", category: "Annonces & Communications", date: "20 Avr 2024", author: "Direction RH" },
];

export default function KnowledgeBase() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar KB */}
      <div className="w-64 border-r border-border bg-card/30 flex flex-col hidden md:flex shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Espace Documentaire</h2>
        </div>
        <div className="p-2 space-y-1 overflow-y-auto flex-1">
          <button 
            onClick={() => setActiveCategory("Tous")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              activeCategory === "Tous" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Folder size={16} /> Tous les documents
            </div>
          </button>
          
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Dossiers
          </div>
          
          {kbCategories.map(cat => (
            <button 
              key={cat.id}
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
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Plus size={16} /> Nouveau dossier
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher dans la base de connaissances..." 
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
          <button className="ml-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm">
            <Plus size={16} /> Créer un document
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{activeCategory === "Tous" ? "Récents" : activeCategory}</h1>
            </div>

            <div className="space-y-3">
              {documents
                .filter(doc => activeCategory === "Tous" || doc.category === activeCategory)
                .map(doc => (
                  <div key={doc.id} className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{doc.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                          <span>•</span>
                          <span>Par {doc.author}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
              ))}
              
              {documents.filter(doc => activeCategory === "Tous" || doc.category === activeCategory).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Aucun document dans ce dossier.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
