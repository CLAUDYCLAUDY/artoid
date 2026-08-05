# Artoid — mode d'emploi

## Votre outil : une page de votre site

Une fois le site déployé, ouvrez :

**`https://votre-adresse/editeur.html`**

C'est là que tout se passe : le catalogue, les photos, les images des pages.
Vous ne manipulez aucun fichier et n'allez jamais sur GitHub.

> **Important** : l'éditeur doit être ouvert **depuis l'adresse web** de votre site.
> Ouvert depuis un fichier de votre ordinateur, le navigateur bloque la connexion.

---

## Réglage initial — une seule fois par appareil

1. Ouvrez **github.com/settings/personal-access-tokens/new**
2. **Token name** : `éditeur Artoid` · **Expiration** : `No expiration`
3. **Repository access** → *Only select repositories* → cochez votre dépôt Artoid
4. **Permissions → Repository permissions → Contents** → **Read and write**
5. **Generate token**, copiez la ligne `github_pat_…`
6. Dans l'éditeur : compte GitHub, nom du dépôt, branche `main`, collez la clé,
   **Se connecter**.

L'éditeur vous dit immédiatement si la connexion est bonne, et pourquoi sinon.

---

## Sur iPhone

L'éditeur est conçu pour le mobile : liste repliable, boutons larges, dépôt de photos
depuis la photothèque.

Ajoutez-le à votre écran d'accueil (bouton **Partager** → *Sur l'écran d'accueil*) :
il s'ouvrira comme une application, sans barre d'adresse.

La clé n'est pas partagée entre appareils : la première fois sur iPhone, recollez-la.
Conservez-la dans votre trousseau iCloud.

---

## Le catalogue

Onglet **Catalogue**. La liste est groupée par collection : Archives Sélectives,
The Stories, Objets édités.

| Ce que vous voulez faire | Comment |
|---|---|
| Modifier une référence | Cliquez dessus dans la liste |
| Ajouter un ouvrage ou un objet | **+ Ajouter**, puis O (ouvrage) ou B (objet) |
| Changer les photos | Déposez-les ; flèches ← → pour l'ordre, ✕ pour retirer |
| Choisir la couverture | C'est la première photo de la série |
| Masquer sans effacer | **Affiché sur le site** → *Non* |
| Signaler un ouvrage épuisé | **Statut** → *Épuisé* (le prix laisse place à « Épuisé ») |
| Supprimer définitivement | Bouton rouge en bas de la fiche |

Terminez toujours par **Enregistrer et publier**. Une minute plus tard, le site est à jour.

---

## Les images des pages

Onglet **Images du site**. Quatre emplacements : la grande image d'accueil,
l'illustration de « La fabrication », et les bandeaux des deux pages de collection.

Déposez, puis cliquez sur **Publier les images du site**. Tant qu'aucune photo n'est
déposée, l'illustration dessinée reste affichée.

---

## Comment le site est construit

| Fichier | Rôle |
|---|---|
| `produits.js` | **Votre catalogue** — écrit par l'éditeur |
| `rendu-produits.js` | Affiche les grilles et les fiches |
| `produit.html` | Gabarit des fiches (adresse `produit.html?ref=livre-02`) |
| `visuels-site.js` | Affiche les images des pages |
| `editeur.html` | Votre outil de gestion |

Ces cinq fichiers doivent tous être en ligne, sans quoi les grilles restent vides.

---

## En cas de problème

**Les grilles sont vides** → `produits.js` ou `rendu-produits.js` manquent en ligne.

**« Clé en lecture seule »** → à l'étape 3, *Public repositories* était coché au lieu de
*Only select repositories*. Recréez la clé.

**Une modification a cassé quelque chose** → sur GitHub, onglet **History** du fichier
`produits.js`, restaurez une version précédente.

**Rien ne change après publication** → rechargez en vidant le cache
(**Cmd + Shift + R**), ou ajoutez `?v=2` à la fin de l'adresse.
