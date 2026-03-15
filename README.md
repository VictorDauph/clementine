---
# Clementine – Test Technique
---

Pour rester aligné avec le périmètre du test et le temps imparti, je n’ai pas implémenté de système d’authentification ni d'utilisateurs. Les actions d’administration sont considérées comme accessibles dans cette version de démonstration.

L'application est entièrement dockerisée dans une container stack comprenant 3 service: frontend, api et base de donnée.

## Lancer le projet

Pour lancer le projet une série de scripts de raccrourcis ont été ajoutés à la racine du projet:

Relancer le build et lancer le projet:

npm run build 
---

Lancer le projet sans build (si déjà build):

npm run dev
---

stopper le projet:

npm run stop
---

## Test automatisés

Un test auto, intégré à un workflow github ci Fonctionnel a été ajouté sur le backend

pour le lancer: 

---
cd backend  
npm test
---