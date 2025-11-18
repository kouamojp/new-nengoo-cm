# 🔐 Guide d'Accès Administrateur - Nengoo

## 📋 Informations de Connexion Admin

### URL d'accès:
```
https://shopnengoo.preview.emergentagent.com/admin/login
```

### Identifiants Admin:
- **Numéro WhatsApp**: `+237600000000`
- **Code d'accès**: `ADMIN2025`

---

## 🎯 Fonctionnalités du Panneau Admin

### 1. 📊 Tableau de Bord
- Vue d'ensemble des statistiques principales
- Nombre total d'utilisateurs, vendeurs, produits
- Revenus totaux de la plateforme
- Alertes sur les demandes en attente
- Commandes actives en temps réel

### 2. 🏪 Gestion des Vendeurs
#### Demandes en Attente
- Voir toutes les demandes d'inscription vendeur
- Informations complètes: nom, business, WhatsApp, email, ville, catégories
- **Actions disponibles**:
  - ✅ **Approuver**: Valider le compte vendeur
  - ❌ **Rejeter**: Refuser la demande

#### Vendeurs Actifs
- Liste complète de tous les vendeurs approuvés
- Statistiques: nombre de produits, volume de ventes
- **Actions disponibles**:
  - 🚫 **Suspendre**: Désactiver temporairement un vendeur
  - ✅ **Réactiver**: Rétablir un compte suspendu

### 3. 👥 Gestion des Acheteurs
- Liste de tous les acheteurs inscrits
- Historique: date d'inscription, nombre de commandes, montant total dépensé
- **Actions disponibles**:
  - 🚫 **Suspendre**: Bloquer un compte acheteur
  - ✅ **Activer**: Débloquer un compte

### 4. 📦 Gestion des Produits
- Vue complète de tous les produits de la plateforme
- Filtrage par vendeur, catégorie, statut
- Détection des produits en attente d'approbation
- **Actions disponibles**:
  - ✅ **Approuver**: Valider un nouveau produit
  - 🗑️ **Supprimer**: Retirer un produit inapproprié

### 5. 🛒 Gestion des Commandes
- Liste de toutes les commandes de la plateforme
- Statistiques par statut: en cours, en transit, livrées, annulées
- Vue détaillée: acheteur, vendeur, date, montant, articles
- Suivi en temps réel de l'état des commandes

---

## 🔒 Sécurité

### Authentification
L'accès administrateur nécessite **deux facteurs**:
1. Numéro WhatsApp administrateur spécifique
2. Code d'accès secret

### Recommandations
- 🔐 Gardez le code d'accès confidentiel
- 📱 Ne partagez pas le numéro WhatsApp admin
- 🔄 Changez régulièrement le code d'accès (modifiable dans `components.js`)

---

## 🛠️ Modification des Identifiants Admin

Pour changer les identifiants administrateur:

1. Ouvrir le fichier: `/app/frontend/src/components.js`
2. Chercher la section: `adminCredentials`
3. Modifier les valeurs:

```javascript
adminCredentials: {
  whatsapp: '+237XXXXXXXXX',  // Votre nouveau numéro
  accessCode: 'VOTRE_NOUVEAU_CODE'  // Votre nouveau code
}
```

---

## 📊 Données Mockées (Test)

Le système utilise actuellement des données de test. Les statistiques affichées sont:
- **1,250** utilisateurs
- **45** vendeurs actifs
- **12** demandes de vendeurs en attente
- **389** produits au catalogue
- **567** commandes totales
- **45,680,000 XAF** de revenus

---

## 🚀 Utilisation

1. **Accéder au panneau**: Allez sur `/admin/login`
2. **Se connecter**: Entrez le WhatsApp et le code d'accès
3. **Naviguer**: Utilisez le menu latéral pour accéder aux différentes sections
4. **Gérer**: Approuvez/rejetez les demandes, surveillez l'activité
5. **Retour au site**: Cliquez sur "← Retour au site" en haut à droite

---

## ⚠️ Notes Importantes

- Le panneau admin est **indépendant** des sections vendeur et acheteur
- Seuls les utilisateurs avec le type `admin` peuvent accéder au dashboard
- Les actions d'approbation/rejet sont **immédiates** (mocked pour le moment)
- Pour une utilisation en production, connectez le système à votre backend API

---

## 📞 Support

Pour toute question sur le panneau administrateur, référez-vous à la documentation technique ou contactez le support.

---

**Développé pour Nengoo - Votre marketplace camerounaise** 🇨🇲
