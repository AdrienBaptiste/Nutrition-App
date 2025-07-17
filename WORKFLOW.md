# 🧠 Git Workflow – Projet Full Stack (React + Symfony)

Ce guide documente un workflow Git clair et cohérent pour les projets avec branches `feature`, `preprod` et `main`.

---

## 🧱 1. Créer une branche de feature depuis `preprod`

- Avant de commencer une nouvelle fonctionnalité, assure-toi que ta branche `preprod` est à jour :
  ```bash
  git checkout preprod
  git pull origin preprod
  ```

- Ensuite, crée ta branche de feature à partir de `preprod` :
  ```bash
  git checkout -b feature/ma-fonctionnalité
  ```

- Développe normalement avec des commits fréquents.

---

## 🧼 2. Nettoyage de l'historique avant merge

Avant de merger la feature :

```bash
git rebase -i main
```

- Squash les commits inutiles
- Réécris les messages pour les rendre explicites
- Puis :
  ```bash
  git push -f origin feature/ma-fonctionnalité
  ```

---

## 🌿 3. Merge dans `preprod`

```bash
git checkout preprod
git merge feature/ma-fonctionnalité
git push origin preprod
```

- Supprime la branche si tout est validé :
  
```bash
git branch -d feature/ma-fonctionnalité
git push origin --delete feature/ma-fonctionnalité
```

---

## 🔁 4. Tests en `preprod`

- Teste les nouvelles fonctionnalités en local ou via CI/CD.
- Répète les étapes 1–3 pour d'autres features.

---

## 🚀 5. Merge de `preprod` vers `main`

```bash
git checkout main
git merge preprod
git push origin main
```

- Ce merge crée un commit de merge sur `main`.

---

## 🔖 6. Création d'un tag versionné sur le commit de merge en question

- Repère le hash du commit de merge si tu veux tagger manuellement un commit spécifique :
  ```bash
  git checkout main
  git log --oneline
  git tag -a v1.0.0 1fb6fa1 -m "Release: v1.0.0 - fonctionnalité X"
  ```


- OU si tu viens juste de merger, automatiquement sur le commit de merge :
  ```bash
  git tag -a v1.0.0 -m "Release: v1.0.0 - fonctionnalité X"
  git push origin v1.0.0
  ```

👉 Le `-a` crée un **tag annoté** :
- Contient un message
- Est horodaté
- Attribué à un auteur
- Préféré pour les versions publiques

---

## 📦 7. (Optionnel) Créer une release GitHub

- Va dans l'onglet **“Releases”** sur GitHub
- Clique sur **“Draft a new release”**
- Sélectionne le tag `v1.0.0`
- Rédige le changelog
- Ajoute des assets si nécessaire

---

## ✅ Résumé des bonnes pratiques

| Objectif                              | Pratique                           |
|--------------------------------------|------------------------------------|
| Historique propre                    | Rebase interactif (`rebase -i`)   |
| Merge clair                          | Feature → Preprod → Main           |
| Versionnage                         | Tag annoté (`git tag -a`)          |
| Documentation de release             | Interface GitHub (optionnel)      |
| Branches jetables                    | Suppression après merge            |

---

**💡 Conseil** : Pour pousser tous les tags en une fois :
```bash
git push origin --tags
```
