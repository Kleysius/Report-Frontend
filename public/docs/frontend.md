# Utilisation Front-end

Le client React (Vite) propose :

- **Pages publiques** : `/login`  
- **Routes protégées** : `/home`, `/rapport`, `/stats`  
- **Admin** : menu “Admin” → Machines, Rapports, Utilisateurs  

## Principaux composants

- **Home** : choix du secteur, redirige vers ReportPage  
- **ReportPage** : formulaire de rapport (anomalies, sécurité, grosses machines)  
- **StatsPage** : graphiques et tableaux (Recharts)  
- **AdminMachines** : gestion CRUD des machines par tournée  
- **AdminReports** : table paginée + filtres + export CSV  
- **AdminUsers** : gestion CRUD des utilisateurs  
