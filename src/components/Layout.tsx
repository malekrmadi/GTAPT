import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  Ticket,
  ChevronLeft,
  Menu,
  Database,
  FileText,
  LogOut,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// GTA PT conservé en route /assistant mais masqué du menu principal
const analystNav = [
  { path: "/skills", label: "GTA Skills", icon: Database, desc: "Fiches métier (objectif + contexte)" },
  { path: "/documents", label: "Base documentaire", icon: FileText, desc: "Documents de référence" },
  { path: "/training", label: "GTA Training", icon: GraduationCap, desc: "Entraînements" },
  { path: "/backlog", label: "GTA My Backlog", icon: Ticket, desc: "Mes tickets" },
];

const managerNav = [
  { path: "/manager/skills", label: "Skills", icon: Database, desc: "Fiches métier structurées" },
  { path: "/manager/documents", label: "Base documentaire", icon: FileText, desc: "Documents & dossiers" },
  { path: "/manager/training", label: "Trainings", icon: GraduationCap, desc: "E-learning (QCM, exercices)" },
  { path: "/manager/backlog", label: "Backlog Management", icon: BarChart3, desc: "Gestion globale" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = user?.role === "manager" ? managerNav : analystNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sidebar-gradient flex flex-col border-r border-sidebar-border shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-primary-foreground font-bold text-sm leading-none">GTA Companion</h1>
                <p className="text-sidebar-foreground text-[10px] mt-0.5">Expertise métier</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto shadow-md">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:text-primary-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-semibold text-sidebar-foreground uppercase tracking-wider">
            {!collapsed && (user?.role === "manager" ? "Administration" : "Menu Principal")}
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && (
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? "text-primary-foreground/70" : "text-sidebar-foreground/60"
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-semibold shrink-0">
                  {user?.avatar || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-primary-foreground truncate">{user?.name || "User"}</p>
                  <p className="text-[10px] text-sidebar-foreground truncate capitalize">{user?.role || "guest"}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-sidebar-foreground hover:text-destructive transition-colors shrink-0"
                title="Se déconnecter"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex justify-center text-sidebar-foreground hover:text-destructive transition-colors"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {navItems.find((n) => n.path === location.pathname)?.icon &&
              (() => {
                const Icon = navItems.find((n) => n.path === location.pathname)?.icon ?? MessageSquare;
                return <Icon size={16} className="text-primary" />;
              })()}
            <span className="font-semibold text-foreground">
              {navItems.find((n) => n.path === location.pathname)?.label ?? "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Factice */}
            <div className="relative group">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-right">
                <div className="px-4 py-3 border-b border-border bg-secondary/50 flex justify-between items-center">
                  <span className="font-bold text-sm">Notifications</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-bold uppercase">2 Nouvelles</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                        <Database size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Nouveau Skill ajouté</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">L'admin a ajouté le skill "Congés Payés". Consultez-le dans la bibliothèque.</p>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">Il y a 2 min</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <BarChart3 size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Analyse Backlog terminée</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">Votre briefing backlog du jour est disponible.</p>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">Il y a 1h</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border bg-secondary/30 text-center">
                  <button className="text-xs font-semibold text-primary hover:underline">Marquer tout comme lu</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
