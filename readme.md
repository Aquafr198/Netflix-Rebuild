# README.md

# Netflix Evolution Website

## Description du Projet

**Netflix Evolution** est ma refonte moderne et élégante de l'interface utilisateur de Netflix. Ce site web démontre mon approche innovante du design d'interface utilisateur pour les plateformes de streaming, avec une expérience de navigation fluide et des animations soignées.

## Caractéristiques Principales

### 1. Design Moderne et Immersif
- Interface utilisateur sombre avec des accents rouges caractéristiques de la marque Netflix
- Utilisation d'effets de flou et de transparence (glassmorphism) pour une expérience visuelle contemporaine
- Animations subtiles pour améliorer l'interaction utilisateur

### 2. Navigation Optimisée
- Barre de défilement cachée pour une expérience visuelle épurée
- Header fixe avec animation au défilement
- Menu de navigation intuitif avec effets de survol

### 3. Sections Principales
- **Hero Section** avec vidéo d'arrière-plan pour une immersion immédiate
- **Catégories Interactives** pour filtrer le contenu
- **Carousel de Contenu** avec cartes interactives au survol
- **Grille dynamique** pour présenter davantage de contenu
- **Section "Continuer à Regarder"** avec barres de progression

### 4. Responsive Design
- Adaptation complète pour tous les appareils (desktop, tablette, mobile)
- Restructuration du layout selon la taille d'écran
- Optimisation des éléments pour une utilisation tactile

## Technologies Utilisées

- **HTML5** - Structure sémantique du contenu
- **CSS3** - Stylisation avancée et animations
  - Variables CSS pour la gestion des couleurs
  - Flexbox et Grid pour la mise en page
  - Transitions et animations pour l'interactivité
  - Media queries pour le responsive design
- **Font Awesome** - Icônes vectorielles
- **Google Fonts** - Typographie optimisée

## Fonctionnalités Techniques

### Masquage de la Barre de Défilement
J'ai implémenté des techniques CSS avancées pour masquer la barre de défilement tout en conservant la fonctionnalité de défilement, créant ainsi une interface plus propre et immersive:

```css
body {
  -ms-overflow-style: none;  /* Pour Internet Explorer et Edge */
  scrollbar-width: none;     /* Pour Firefox */
}

body::-webkit-scrollbar {
  display: none;  /* Pour Chrome, Safari et Opera */
}

github : https://github.com/Aquafr198