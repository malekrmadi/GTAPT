export interface Skill {
  id: number;
  name: string;
  category: string;
  status: "active" | "inactive";
  owner: string;
  description: string;
  objective: string;
  context: string;
  documents: number;
  updated: string;
}

export interface KbDocument {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  type: "PDF" | "DOCX";
  pages: number;
}

export const kbCategories = [
  { id: 1, name: "Guides d'utilisation", count: 14 },
  { id: 2, name: "Réglementation légale", count: 11 },
  { id: 3, name: "Procédures internes", count: 28 },
  { id: 4, name: "Annonces & Communications", count: 7 },
  { id: 5, name: "Fiches paramétrage client", count: 19 },
  { id: 6, name: "Cas pratiques & retours d'expérience", count: 15 },
];

export const initialDocuments: KbDocument[] = [
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

export const initialSkills: Skill[] = [
  {
    id: 1,
    name: "Congés Payés",
    category: "Paie & Absences",
    status: "active",
    owner: "Jean Dupont",
    description: "Expertise sur le calcul et l'acquisition des congés payés selon la convention collective.",
    objective: "Guider l'analyste dans le diagnostic et la résolution des anomalies liées aux compteurs CP (CP100, CP130, CP150).",
    context: "À utiliser lors de tickets portant sur des soldes CP incorrects, des erreurs DSN liées aux absences, ou des demandes de paramétrage d'acquisition.",
    documents: 3,
    updated: "Il y a 2j",
  },
  {
    id: 2,
    name: "RTT & Forfait",
    category: "Paie & Absences",
    status: "active",
    owner: "Marie Curie",
    description: "Règles de calcul des RTT pour les cadres au forfait jours et les employés.",
    objective: "Fournir les règles de calcul et les bonnes pratiques pour la gestion des RTT et forfaits jours.",
    context: "À utiliser sur les tickets de paramétrage forfait jours, erreurs de solde RTT, ou questions sur le report des droits.",
    documents: 2,
    updated: "Il y a 5j",
  },
  {
    id: 3,
    name: "Astreinte",
    category: "GTA Core",
    status: "active",
    owner: "Jean Dupont",
    description: "Règles d'indemnisation et de récupération des heures d'astreinte.",
    objective: "Clarifier les règles légales et paramétriques des astreintes (indemnisation, repos compensateur).",
    context: "Pour les tickets liés au paramétrage astreinte, indemnités code 4500, ou récupération heures.",
    documents: 2,
    updated: "Il y a 1 sem",
  },
  {
    id: 4,
    name: "Decidium Interface",
    category: "Decidium",
    status: "active",
    owner: "Admin",
    description: "Navigation et paramétrage de base dans l'outil Decidium.",
    objective: "Accompagner l'analyste dans la navigation et le paramétrage N1 de Decidium.",
    context: "Tickets de prise en main Decidium, erreurs d'interface, ou demandes de paramétrage basique.",
    documents: 1,
    updated: "Il y a 2 sem",
  },
  {
    id: 5,
    name: "DSN & Déclarations",
    category: "Paie & Absences",
    status: "active",
    owner: "Karim Benali",
    description: "Gestion des erreurs et anomalies DSN, codes rubriques et motifs d'arrêt.",
    objective: "Diagnostiquer et résoudre les erreurs bloquantes DSN avant transmission.",
    context: "Tickets P1 bloquants DSN, erreurs de rubriques, motifs d'arrêt non reconnus.",
    documents: 4,
    updated: "Il y a 3j",
  },
  {
    id: 6,
    name: "Heures supplémentaires",
    category: "GTA Core",
    status: "inactive",
    owner: "Sarah Martin",
    description: "Règles de décompte, majoration et contingent des heures supplémentaires.",
    objective: "Couvrir les cas de dépassement de contingent, majorations légales et paramétrage HS.",
    context: "Anomalies de calcul HS, dépassement contingent annuel, demandes de régularisation.",
    documents: 2,
    updated: "Il y a 3 sem",
  },
  {
    id: 7,
    name: "Transfert de gestion",
    category: "Support Client",
    status: "active",
    owner: "Marie Curie",
    description: "Procédure complète de transfert de gestion paie entre entités ou prestataires.",
    objective: "Guider l'analyste étape par étape dans un transfert de gestion paie.",
    context: "Nouveaux clients, changement de prestataire, migration de données historiques.",
    documents: 3,
    updated: "Il y a 1 sem",
  },
];
