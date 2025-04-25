# Installation

## Prérequis

- Node.js v16+ et npm  
- SQLite3

## Étapes

1. **Cloner le dépôt**

    ```bash
    git clone https://github.com/votre-repo/rapport-journalier.git
    cd rapport-journalier/frontend
    ```

2. **Configurer l’API (backend)**

    ```bash
    cd ../backend
    cp .env.example .env
    # Modifier .env pour JWT_SECRET, PORT, etc.
    npm install
    npm run migrate   # ou initialiser la DB SQLite
    npm run dev
    ```

3. **Lancer le Front‑end**

    ```bash
    cd ../frontend
    npm install
    npm run dev   # http://localhost:5173
    ```