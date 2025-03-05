// Variables pour le contrôle du défilement smooth
let currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
let targetScrollPosition = currentScrollPosition;
let scrollAnimation = null;
let scrollVelocity = 0;
const friction = 0.85; // Valeur entre 0 et 1, contrôle la résistance
const acceleration = 0.5; // Sensibilité du scroll

// Conserver les éléments originaux
let bodyOverflow, htmlOverflow;

document.addEventListener('DOMContentLoaded', function() {
  // Sauvegarder les styles d'overflow originaux
  bodyOverflow = document.body.style.overflow;
  htmlOverflow = document.documentElement.style.overflow;
  
  // Désactiver le comportement de défilement par défaut
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Ajouter un wrapper pour le contenu
  setupScrollWrapper();
  
  // Gérer les clics sur les liens d'ancrage
  setupAnchorLinks();
  
  // Activer le défilement initial
  window.scrollTo(0, 0);
  currentScrollPosition = 0;
  targetScrollPosition = 0;
  
  // Animer les éléments au chargement initial
  initAnimations();
  
  // Déclencher l'animation initiale
  requestAnimationFrame(smoothScroll);
});

// Intercepter l'événement wheel (molette de souris)
document.addEventListener('wheel', function(event) {
  event.preventDefault(); // Empêcher le défilement par défaut
  
  // Calculer la direction et l'intensité du scroll
  const delta = event.deltaY * acceleration;
  
  // Ajouter le delta à la position cible avec une limite
  targetScrollPosition = Math.max(0, Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    targetScrollPosition + delta
  ));
  
  // Mettre à jour la vélocité
  scrollVelocity = delta * 0.5;
  
  // Démarrer l'animation si elle n'est pas déjà en cours
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
}, { passive: false }); // Important: passive: false pour preventDefault

// Gérer le défilement tactile
let touchStartY = 0;
let touchMoveY = 0;
let lastTouchY = 0;
let touchVelocity = 0;

document.addEventListener('touchstart', function(event) {
  touchStartY = event.touches[0].clientY;
  lastTouchY = touchStartY;
  touchVelocity = 0;
  
  // Arrêter toute animation d'inertie en cours
  cancelAnimationFrame(scrollAnimation);
  scrollAnimation = null;
}, { passive: false });

document.addEventListener('touchmove', function(event) {
  event.preventDefault();
  
  touchMoveY = event.touches[0].clientY;
  const touchDelta = (lastTouchY - touchMoveY) * 2;
  
  // Calculer la vélocité du toucher
  touchVelocity = 0.8 * touchVelocity + 0.2 * touchDelta;
  
  // Mettre à jour la position cible
  targetScrollPosition = Math.max(0, Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    targetScrollPosition + touchDelta
  ));
  
  // Mettre à jour le point de départ pour le prochain mouvement
  lastTouchY = touchMoveY;
  
  // Démarrer l'animation si elle n'est pas déjà en cours
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
}, { passive: false });

document.addEventListener('touchend', function() {
  // Appliquer l'inertie après le relâchement
  scrollVelocity = touchVelocity * 5;
  
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
}, { passive: false });

// Fonction d'animation du défilement fluide
function smoothScroll() {
  // Calcul d'interpolation pour un mouvement fluide
  currentScrollPosition += (targetScrollPosition - currentScrollPosition) * 0.1;
  
  // Ajouter l'effet d'inertie
  const isScrolling = Math.abs(targetScrollPosition - currentScrollPosition) > 0.5 || Math.abs(scrollVelocity) > 0.5;
  
  if (isScrolling) {
    // Appliquer la friction pour ralentir progressivement
    scrollVelocity *= friction;
    
    // Ajouter l'inertie à la position cible
    targetScrollPosition += scrollVelocity;
    
    // Limiter la position cible
    targetScrollPosition = Math.max(0, Math.min(
      document.documentElement.scrollHeight - window.innerHeight,
      targetScrollPosition
    ));
    
    // Déplacer la fenêtre vers la nouvelle position
    window.scrollTo(0, Math.round(currentScrollPosition));
    updateElementsOnScroll(currentScrollPosition);
    
    // Continuer l'animation
    scrollAnimation = requestAnimationFrame(smoothScroll);
  } else {
    // Arrêter l'animation quand la vélocité devient négligeable
    scrollAnimation = null;
  }
}

// Configurer le wrapper de défilement
function setupScrollWrapper() {
  // S'assurer que le body a une hauteur adéquate pour le scroll
  const contentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  
  // Créer un élément fantôme pour permettre le défilement
  const scrollSpacer = document.createElement('div');
  scrollSpacer.style.height = contentHeight + 'px';
  scrollSpacer.style.position = 'absolute';
  scrollSpacer.style.top = '0';
  scrollSpacer.style.left = '0';
  scrollSpacer.style.width = '1px';
  scrollSpacer.style.zIndex = '-1';
  scrollSpacer.style.pointerEvents = 'none';
  scrollSpacer.style.visibility = 'hidden';
  document.body.appendChild(scrollSpacer);
}

// Gérer les clics sur les liens d'ancrage
function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        // Calculer la position cible
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        // Animation du scroll vers la cible
        animateScrollTo(targetPosition);
      }
    });
  });
}

// Animation fluide vers une position spécifique
function animateScrollTo(targetPosition) {
  // Réinitialiser les variables pour un nouveau défilement ciblé
  const startPosition = currentScrollPosition;
  const distance = targetPosition - startPosition;
  const duration = 1000; // Durée en ms
  let startTime;
  
  // Fonction d'animation avec easing
  function scrollToTarget(timestamp) {
    if (!startTime) startTime = timestamp;
    
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Fonction d'easing (easeInOutCubic)
    const easeInOutCubic = progress => 
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    const easedProgress = easeInOutCubic(progress);
    
    // Mettre à jour les positions
    currentScrollPosition = startPosition + distance * easedProgress;
    targetScrollPosition = currentScrollPosition;
    
    // Appliquer le scroll
    window.scrollTo(0, Math.round(currentScrollPosition));
    updateElementsOnScroll(currentScrollPosition);
    
    // Continuer l'animation si nécessaire
    if (progress < 1) {
      requestAnimationFrame(scrollToTarget);
    }
  }
  
  requestAnimationFrame(scrollToTarget);
}

// Mettre à jour les animations et effets lors du défilement
function updateElementsOnScroll(scrollPosition) {
  const scrollTop = scrollPosition;
  const viewportHeight = window.innerHeight;
  
  // Header qui change au scroll
  const header = document.querySelector('.header');
  if (header) {
    if (scrollTop > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Effet parallax sur le hero
  if (scrollTop < window.innerHeight) {
    const heroVideo = document.querySelector('.hero-video');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroVideo) {
      heroVideo.style.transform = `scale(1.1) translateY(${scrollTop * 0.1}px)`;
    }
    
    if (heroContent) {
      heroContent.style.opacity = 1 - (scrollTop / (window.innerHeight * 0.6));
      heroContent.style.transform = `translateY(calc(-50% + ${scrollTop * 0.2}px))`;
    }
  }
  
  // Révéler les éléments lors du défilement
  document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(element => {
    const elementTop = element.getBoundingClientRect().top + scrollTop;
    const elementVisible = 100;
    
    if (elementTop < scrollTop + viewportHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
}

// Initialisation des animations
function initAnimations() {
  // Ajouter les classes d'animation aux éléments
  const animatedElements = [
    '.section-title', 
    '.content-card', 
    '.progress-card', 
    '.grid-item',
    '.category-item',
    '.hero-content > *'
  ];
  
  animatedElements.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      // Délai progressif pour un effet cascade
      el.style.transitionDelay = `${index * 0.05}s`;
    });
  });
}

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', function() {
  // Recalculer les limites et positions
  targetScrollPosition = Math.min(
    targetScrollPosition,
    document.documentElement.scrollHeight - window.innerHeight
  );
  
  // Mettre à jour l'affichage
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
});

// Nettoyer si la page est déchargée
window.addEventListener('beforeunload', function() {
  // Restaurer les styles d'overflow
  document.body.style.overflow = bodyOverflow;
  document.documentElement.style.overflow = htmlOverflow;
  
  // Annuler toutes les animations en cours
  cancelAnimationFrame(scrollAnimation);
});
