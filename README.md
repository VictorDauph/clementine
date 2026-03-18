---
# Clementine – Test Technique
---

Pour rester aligné avec le périmètre du test et le temps imparti, je n’ai pas implémenté de système d’authentification ni d'utilisateurs. Les actions d’administration sont considérées comme accessibles dans cette version de démonstration.

L'application est entièrement dockerisée dans une container stack comprenant 3 service: frontend, api et base de donnée.

Une instance Docker lancée est nécessaire au lancement du projet.
---

## Lancer le projet

Pour lancer le projet une série de scripts de raccrourcis ont été ajoutés à la racine du projet:

---
Lancer le projet sans build (si déjà build):

npm run dev
---

Si npm n'est pas installé, utiliser directment: 

docker compose up --build
---

Le projet est accessible localement:

http://localhost:5173/
---

Relancer le build et lancer le projet:

npm run build 
---

stopper le projet:

npm run stop
---

## Test automatisés

Un test auto, intégré à un workflow github ci Fonctionnel a été ajouté sur le backend
Les tests automatisés sont automatiquement lancés par github actions au push:
https://github.com/VictorDauph/clementine/actions

pour le lancer: 

---
cd backend  
npm test
---
