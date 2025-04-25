# API Endpoints

## Machines & Tournées (admin)

- `GET /tours/all` : liste des tournées (jour, secteur, zones)  
- `GET /machines/all` : toutes les machines avec leur tournée  
- `POST /machines` : ajouter une machine  
- `PUT /machines/:id` : modifier une machine  
- `DELETE /machines/:id` : supprimer une machine  

## Rapports (technicien & admin)

- `POST /reports` : créer un rapport (anomalies, sécurité, gros machines)  
- `PUT /reports/:id` : modifier un rapport  
- `GET /reports` : récupérer tous les rapports détaillés  
- `DELETE /reports/:id` : supprimer un rapport  

## Admin – Vue agrégée

- `GET /admin/reports` : rapports paginés, filtres secteur/date/mot‑clé, export CSV  

## Statistiques

- `GET /stats` : métriques (top machines, zones, évolution, moyennes…)  
- `GET /stats/top-keyword` : top machines par mot‑clé dans les commentaires  
