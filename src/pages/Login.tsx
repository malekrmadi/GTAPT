import { useAuth, Role } from "@/contexts/AuthContext";
import { User, Database, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    login(role);
    if (role === "analyst") {
      navigate("/skills");
    } else {
      navigate("/manager/skills");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 max-w-4xl w-full mx-6 bg-card/60 backdrop-blur-2xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12"
      >
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">AGP GTA Companion</h1>
              <p className="text-muted-foreground text-sm font-medium">Expertise paie & gestion des temps</p>
            </div>
          </div>
          <p className="text-foreground/80 leading-relaxed mb-8 max-w-md">
            Bienvenue sur la plateforme unifiée de gestion des connaissances, formations et suivi de backlog dédiée à la paie et la gestion des temps.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Database size={18} className="text-primary" /> Bibliothèque de compétences métier
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Database size={18} className="text-blue-500" /> Gestion unifiée des Skills
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <User size={18} className="text-green-500" /> Résolution accélérée
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 md:pl-12">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Sélectionnez votre rôle</h2>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin("analyst")}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <User size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Analyste Fonctionnel</div>
                  <div className="text-xs text-muted-foreground">Skills, Training, My Backlog</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin("manager")}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Database size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Knowledge Base Manager</div>
                  <div className="text-xs text-muted-foreground">Gestion Skills, KB, Annonces</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
