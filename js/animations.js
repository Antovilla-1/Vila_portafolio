gsap.registerPlugin(ScrollTrigger);

// ── ANIMACIONES DE PÁGINA ────────────────────────────────────────────────────
function startAnimations(animateTitles = true) {

  // 1. Reveal del título
  const titles = document.querySelectorAll('.display');
  if (titles.length && animateTitles) {
    gsap.fromTo(titles,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.1,
        clearProps: 'clipPath'
      }
    );
  }

  // 2. Fade + slide de secciones al hacer scroll
  gsap.utils.toArray('section').forEach(section => {
    const rect = section.getBoundingClientRect();
    const yaEnPantalla = rect.top < window.innerHeight && rect.bottom > 0;
    if (yaEnPantalla) return;

    gsap.from(section, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        once: true
      }
    });
  });
}

// ── INTRO ────────────────────────────────────────────────────────────────────
const intro = document.getElementById('intro');

// Si el referrer es una página de proyecto o contacto, saltarse el intro
const fromInternalPage = document.referrer.includes('proyecto-') ||
                         document.referrer.includes('contacto');

if (intro && !fromInternalPage) {
  // Entrada directa o refresh: mostrar intro
  let dismissed = false;

  const dismissIntro = () => {
    if (dismissed) return;
    dismissed = true;

    gsap.to(intro, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        intro.remove();
        window.scrollTo(0, 0);
        startAnimations();
        setTimeout(() => {
          document.body.classList.remove('intro-active');
        }, 700);
      }
    });
  };

  window.addEventListener('wheel', dismissIntro, { once: true });
  window.addEventListener('touchmove', dismissIntro, { once: true });

} else {
  if (intro) intro.remove();
  document.body.classList.remove('intro-active');
  // Solo omite la animación de títulos si viene del index (vuelve desde un proyecto)
  startAnimations(!fromInternalPage);
}
