# Authentification

L’application utilise **JWT** pour sécuriser les routes.

## Rôles

- `technician` : accès à la création / modification de rapports  
- `admin` : accès à toutes les fonctions (machines, tournées, rapports, utilisateurs)

## Endpoints

| Route             | Méthode | Description                     | Auth  |
|-------------------|---------|---------------------------------|-------|
| `/auth/register`  | POST    | (Optionnel) créer un utilisateur| Open  |
| `/auth/login`     | POST    | obtenir un JWT                  | Open  |
| `/auth/me`        | GET     | profil de l’utilisateur         | JWT   |

### Exemple de login
```json
POST /auth/login
{
  "username": "alice",
  "password": "secret"
}
