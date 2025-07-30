# 📝 Guide de Conventions de Commits (Conventional Commits)

Utilise des préfixes standardisés dans tes messages de commit pour maintenir un historique clair, lisible, et automatisable.

---

## ✅ Format recommandé

```bash
<type>(<scope>): message clair au présent
```

- `type` : type de changement (voir ci-dessous)
- `scope` *(optionnel)* : partie concernée (ex: `auth`, `api`, `ui`, etc.)
- `message` : description concise au **présent** (pas de majuscule, pas de point final)

---

## 📚 Types les plus utilisés

| Type       | Signification                                                       |
|------------|---------------------------------------------------------------------|
| `feat`     | ✨ Nouvelle fonctionnalité                                           |
| `fix`      | 🐛 Correction de bug                                                |
| `docs`     | 📝 Documentation seulement                                           |
| `style`    | 🎨 Formatage uniquement (indentation, espaces, etc.)               |
| `refactor` | 🧼 Refactorisation sans changement de comportement                  |
| `perf`     | 🚀 Amélioration des performances                                   |
| `test`     | 🧪 Ajout ou modification de tests                                   |
| `chore`    | 🔧 Tâches diverses (MAJ dépendances, scripts, etc.)                |
| `ci`       | 🤖 Changement d’intégration continue (GitHub Actions, etc.)        |
| `build`    | 🏗️ Modifications du système de build                               |
| `revert`   | ⏪ Annulation d’un commit précédent                                 |

---

## 💡 Exemples

```bash
git commit -m "feat(auth): ajout du système de connexion"
git commit -m "fix(api): gestion des erreurs 500"
git commit -m "docs(readme): mise à jour des instructions d'installation"
```

---

## 🔒 Bonus : validation automatique

Tu peux utiliser [`commitlint`](https://commitlint.js.org/) et [`husky`](https://typicode.github.io/husky/) pour forcer ces règles localement avant chaque commit.

---

Garder une convention claire, c’est faciliter la relecture, les changelogs et l’automatisation du projet. 🚀