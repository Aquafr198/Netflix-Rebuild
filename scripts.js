let currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
let targetScrollPosition = currentScrollPosition;
let scrollAnimation = null;
let scrollVelocity = 0;
const friction = 0.85;
const acceleration = 0.5;

let bodyOverflow, htmlOverflow;

document.addEventListener('DOMContentLoaded', function() {
  bodyOverflow = document.body.style.overflow;
  htmlOverflow = document.documentElement.style.overflow;
  
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  setupScrollWrapper();
  
  setupAnchorLinks();
  
  window.scrollTo(0, 0);
  currentScrollPosition = 0;
  targetScrollPosition = 0;
  
  initAnimations();
  
  requestAnimationFrame(smoothScroll);
});

document.addEventListener('wheel', function(event) {
  event.preventDefault();
  
  const delta = event.deltaY * acceleration;
  
  targetScrollPosition = Math.max(0, Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    targetScrollPosition + delta
  ));
  
  scrollVelocity = delta * 0.5;
  
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
}, { passive: false });

let touchStartY = 0;
let touchMoveY = 0;
let lastTouchY = 0;
let touchVelocity = 0;

document.addEventListener('touchstart', function(event) {
  touchStartY = event.touches[0].clientY;
  lastTouchY = touchStartY;
  touchVelocity = 0;
  
  cancelAnimationFrame(scrollAnimation);
  scrollAnimation = null;
}, { passive: false });

document.addEventListener('touchmove', function(event) {
  event.preventDefault();
  
  touchMoveY = event.touches[0].clientY;
  const touchDelta = (lastTouchY - touchMoveY) * 2;
  
  touchVelocity = 0.8 * touchVelocity + 0.2 * touchDelta;
  
  targetScrollPosition = Math.max(0, Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    targetScrollPosition + touchDelta
  ));
  
  lastTouchY = touchMoveY;
  
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
}, { passive: false });

document.addEventListener('touchend', function() {
  scrollVelocity = touchVelocity * 5;
  
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
}, { passive: false });

function smoothScroll() {
  currentScrollPosition += (targetScrollPosition - currentScrollPosition) * 0.1;
  
  const isScrolling = Math.abs(targetScrollPosition - currentScrollPosition) > 0.5 || Math.abs(scrollVelocity) > 0.5;
  
  if (isScrolling) {
    scrollVelocity *= friction;
    
    targetScrollPosition += scrollVelocity;
    
    targetScrollPosition = Math.max(0, Math.min(
      document.documentElement.scrollHeight - window.innerHeight,
      targetScrollPosition
    ));
    
    window.scrollTo(0, Math.round(currentScrollPosition));
    updateElementsOnScroll(currentScrollPosition);
    
    scrollAnimation = requestAnimationFrame(smoothScroll);
  } else {
    scrollAnimation = null;
  }
}

function setupScrollWrapper() {
  const contentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  
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

function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        animateScrollTo(targetPosition);
      }
    });
  });
}

function animateScrollTo(targetPosition) {
  const startPosition = currentScrollPosition;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let startTime;
  
  function scrollToTarget(timestamp) {
    if (!startTime) startTime = timestamp;
    
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeInOutCubic = progress => 
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    const easedProgress = easeInOutCubic(progress);
    
    currentScrollPosition = startPosition + distance * easedProgress;
    targetScrollPosition = currentScrollPosition;
    
    window.scrollTo(0, Math.round(currentScrollPosition));
    updateElementsOnScroll(currentScrollPosition);
    
    if (progress < 1) {
      requestAnimationFrame(scrollToTarget);
    }
  }
  
  requestAnimationFrame(scrollToTarget);
}

function updateElementsOnScroll(scrollPosition) {
  const scrollTop = scrollPosition;
  const viewportHeight = window.innerHeight;
  
  const header = document.querySelector('.header');
  if (header) {
    if (scrollTop > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
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
  
  document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(element => {
    const elementTop = element.getBoundingClientRect().top + scrollTop;
    const elementVisible = 100;
    
    if (elementTop < scrollTop + viewportHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
}

function initAnimations() {
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
      el.style.transitionDelay = `${index * 0.05}s`;
    });
  });
}

window.addEventListener('resize', function() {
  targetScrollPosition = Math.min(
    targetScrollPosition,
    document.documentElement.scrollHeight - window.innerHeight
  );
  
  if (!scrollAnimation) {
    scrollAnimation = requestAnimationFrame(smoothScroll);
  }
});

window.addEventListener('beforeunload', function() {
  document.body.style.overflow = bodyOverflow;
  document.documentElement.style.overflow = htmlOverflow;
  
  cancelAnimationFrame(scrollAnimation);
});
