/* ── Reveal on scroll ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Project filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach((card, index) => {

      const match = filter === 'All' || card.dataset.cat === filter;

      if (match) {

        if (!expanded && index >= initialCount) {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }

      } else {
        card.style.display = 'none';
      }

    });

  });
});

/* ── See more button ── */

const cards = document.querySelectorAll('.proj-card');
const btn = document.getElementById('seeMoreBtn');

const initialCount = 6;

cards.forEach((card, index) => {
  if(index >= initialCount) {
    card.classList.add('hidden-project');
  }
});

let expanded = false;

btn.addEventListener('click', () => {

  if (!expanded) {

    document.querySelectorAll('.hidden-project').forEach(card => {
     card.style.display = 'flex';   
     });

    btn.textContent = 'See Less';
    expanded = true;

  } else {

    cards.forEach((card, index) => {
      if (index >= initialCount) {
        card.style.display = 'none';
      }
    });

    btn.textContent = 'See More Projects';
    expanded = false;

    document.getElementById('projects').scrollIntoView({
      behavior: 'smooth'
    });
  }

});

let activeProjectFilter = 'All';

function getActiveProjectCards() {
  return Array.from(cards).filter(card => activeProjectFilter === 'All' || card.dataset.cat === activeProjectFilter);
}

function syncProjectFilterView() {
  const filteredCards = getActiveProjectCards();
  const visibleCards = expanded ? filteredCards : filteredCards.slice(0, initialCount);

  cards.forEach(card => {
    card.style.display = visibleCards.includes(card) ? 'flex' : 'none';
  });

  if (btn) {
    btn.style.display = filteredCards.length > initialCount ? 'inline-block' : 'none';
    btn.textContent = expanded ? 'See Less' : 'See More Projects';
  }
}

document.querySelectorAll('.filter-btn').forEach(filterBtn => {
  filterBtn.addEventListener('click', () => {
    activeProjectFilter = filterBtn.dataset.filter;
    syncProjectFilterView();
  });
});

if (btn) {
  btn.addEventListener('click', syncProjectFilterView);
}

syncProjectFilterView();

/* ── Stat counters ── */
function animateStat(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1800, t0 = performance.now();
  const go = now => {
    const p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(go);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(go);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateStat(e.target);
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

/* ── Typewriter ── */
const tw = document.getElementById('typewriter');
if (tw) {
  const texts = ['Frontend Developer', 'React.js Developer', 'Web Developer', 'AI Enthusiast'];
  let idx = 0, charIdx = 0, deleting = false;
  function tick() {
    const cur = texts[idx];
    if (!deleting && charIdx < cur.length) { tw.textContent = cur.slice(0, ++charIdx); setTimeout(tick, 70); }
    else if (!deleting && charIdx === cur.length) { setTimeout(() => { deleting = true; tick(); }, 2000); }
    else if (deleting && charIdx > 0) { tw.textContent = cur.slice(0, --charIdx); setTimeout(tick, 35); }
    else { deleting = false; idx = (idx + 1) % texts.length; setTimeout(tick, 300); }
  }
  tick();
}

/* ── Nav scroll ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 10 ? 'rgba(0,201,167,0.15)' : 'rgba(255,255,255,0.07)';
}, { passive: true });

/* ── Floating code particles ── */
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const syms = ['</>', '{ }', '=>', 'fn()', '[]', '&&', 'git', 'AI', 'ML', 'npm', 'tsx', 'API'];
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize(); window.addEventListener('resize', resize);
  const pts = Array.from({ length: 22 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vy: -(0.15 + Math.random() * 0.22), vx: (Math.random() - 0.5) * 0.1,
    a: Math.random() * 0.18 + 0.04, sz: 9 + Math.random() * 5,
    sym: syms[Math.floor(Math.random() * syms.length)]
  }));
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      ctx.save(); ctx.globalAlpha = p.a; ctx.fillStyle = '#00c9a7';
      ctx.font = `${p.sz}px 'JetBrains Mono','Fira Code',monospace`;
      ctx.fillText(p.sym, p.x, p.y); ctx.restore();
      p.y += p.vy; p.x += p.vx;
      if (p.y < -30) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; p.sym = syms[Math.floor(Math.random() * syms.length)]; }
    });
    requestAnimationFrame(draw);
  };
  draw();
}

/* ── Geo block decoration ── */
const geoContainer = document.querySelector('.geo-blocks');
if (geoContainer) {
  const defs = [
    { w: 80, h: 80, t: '8%', l: '2%' }, { w: 50, h: 50, t: '14%', l: '6%' },
    { w: 120, h: 120, t: '5%', r: '3%' }, { w: 60, h: 60, t: '16%', r: '7%' },
    { w: 40, h: 40, t: '22%', r: '2%' }, { w: 90, h: 90, b: '12%', l: '3%' },
    { w: 55, h: 55, b: '20%', l: '8%' }, { w: 70, h: 70, b: '8%', r: '4%' },
    { w: 45, h: 45, b: '18%', r: '9%' }, { w: 35, h: 35, t: '50%', l: '1%' }
  ];
  defs.forEach(d => {
    const el = document.createElement('div');
    el.className = 'geo-block';
    el.style.cssText = `width:${d.w}px;height:${d.h}px;${d.t?'top:'+d.t+';':''}${d.l?'left:'+d.l+';':''}${d.r?'right:'+d.r+';':''}${d.b?'bottom:'+d.b+';':''}`;
    geoContainer.appendChild(el);
  });
}

/* ── Scroll spy active nav ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollPos = window.scrollY;
  let currentSection = '';




// Smooth scrolling (Lenis) — respects reduced-motion
function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Lenis = window.Lenis && (window.Lenis.default || window.Lenis);
  if (reduce || typeof Lenis !== 'function') {
    console.warn('[smooth-scroll] skipped:', { reduce, hasLenis: typeof Lenis });
    return;
  }
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  window.lenis = lenis;
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80 });
  });
  console.log('[smooth-scroll] Lenis ready');
}
if (typeof window.Lenis !== 'undefined') {
  initSmoothScroll();
} else {
  window.addEventListener('load', initSmoothScroll);
}
  
  // Bottom of page check
  if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
    currentSection = 'contact';
  } else {
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
  }

  if (!currentSection || currentSection === 'hero') {
    currentSection = 'about';
  }

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('DOMContentLoaded', updateActiveNav);
updateActiveNav(); // Initial call

/* Project thumbnail slideshows */
const projectShotSets = {
  banex: [
    'assets/project-shots/banex-digital-1.png',
    'assets/project-shots/banex-digital-2.png',
    'assets/project-shots/banex-digital-3.png',
    'assets/project-shots/banex-digital-4.png',
    'assets/project-shots/banex-digital-5.png'
  ],
  realEstateOne: [
    'assets/project-shots/real-estate-1-1.jpg',
    'assets/project-shots/real-estate-1-2.jpg',
    'assets/project-shots/real-estate-1-3.jpg',
    'assets/project-shots/real-estate-1-4.jpg',
    'assets/project-shots/real-estate-1-5.jpg'
  ],
  realEstateTwo: [
    'assets/project-shots/real-estate-2-1.jpg',
    'assets/project-shots/real-estate-2-2.jpg',
    'assets/project-shots/real-estate-2-3.jpg',
    'assets/project-shots/real-estate-2-4.jpg',
    'assets/project-shots/real-estate-2-5.jpg'
  ],
  travels: [
    'assets/project-shots/travels-1.jpg',
    'assets/project-shots/travels-2.jpg',
    'assets/project-shots/travels-3.jpg',
    'assets/project-shots/travels-4.jpg',
    'assets/project-shots/travels-5.jpg'
  ],
  ca: [
    'assets/project-shots/ca-1.jpg',
    'assets/project-shots/ca-2.jpg',
    'assets/project-shots/ca-3.jpg',
    'assets/project-shots/ca-4.jpg',
    'assets/project-shots/ca-5.jpg'
  ],
  manufacturing: [
    'assets/project-shots/manufacturing-1.jpg',
    'assets/project-shots/manufacturing-2.jpg',
    'assets/project-shots/manufacturing-3.jpg',
    'assets/project-shots/manufacturing-4.jpg',
    'assets/project-shots/manufacturing-5.jpg'
  ],
  eventManagement: [
    'assets/project-shots/event-management-1.jpg',
    'assets/project-shots/event-management-2.jpg',
    'assets/project-shots/event-management-3.jpg',
    'assets/project-shots/event-management-4.jpg',
    'assets/project-shots/event-management-5.jpg'
  ],
  doctor: [
    'assets/project-shots/doctor-1.jpg',
    'assets/project-shots/doctor-2.jpg',
    'assets/project-shots/doctor-3.jpg',
    'assets/project-shots/doctor-4.jpg',
    'assets/project-shots/doctor-5.jpg'
  ],
  dentalClinic: [
    'assets/project-shots/dental-clinic-1.jpg',
    'assets/project-shots/dental-clinic-2.jpg',
    'assets/project-shots/dental-clinic-3.jpg',
    'assets/project-shots/dental-clinic-4.jpg',
    'assets/project-shots/dental-clinic-5.jpg'
  ],
  advocate: [
    'assets/project-shots/advocate-1.png',
    'assets/project-shots/advocate-2.png',
    'assets/project-shots/advocate-3.png',
    'assets/project-shots/advocate-4.png',
    'assets/project-shots/advocate-5.png'
  ],
  cafe: [
    'assets/project-shots/cafe-1.png',
    'assets/project-shots/cafe-2.png',
    'assets/project-shots/cafe-3.png',
    'assets/project-shots/cafe-4.png',
    'assets/project-shots/cafe-5.png'
  ],
  gym: [
    'assets/project-shots/gym-1.png',
    'assets/project-shots/gym-2.png',
    'assets/project-shots/gym-3.png',
    'assets/project-shots/gym-4.png',
    'assets/project-shots/gym-5.png'
  ],
  bakery: [
    'assets/project-shots/bakery-1.png',
    'assets/project-shots/bakery-2.png',
    'assets/project-shots/bakery-3.png',
    'assets/project-shots/bakery-4.png',
    'assets/project-shots/bakery-5.png'
  ],
  photoStudio: [
    'assets/project-shots/photo-studio-1.png',
    'assets/project-shots/photo-studio-2.png',
    'assets/project-shots/photo-studio-3.png',
    'assets/project-shots/photo-studio-4.png',
    'assets/project-shots/photo-studio-5.png'
  ],
  footwear: [
    'assets/project-shots/footwear-1.png',
    'assets/project-shots/footwear-2.png',
    'assets/project-shots/footwear-3.png',
    'assets/project-shots/footwear-4.png',
    'assets/project-shots/footwear-5.png'
  ],
  clothing: [
    'assets/project-shots/clothing-1.png',
    'assets/project-shots/clothing-2.png',
    'assets/project-shots/clothing-3.png',
    'assets/project-shots/clothing-4.png',
    'assets/project-shots/clothing-5.png'
  ],
  jewellery: [
    'assets/project-shots/jewellery-1.png',
    'assets/project-shots/jewellery-2.png',
    'assets/project-shots/jewellery-3.png',
    'assets/project-shots/jewellery-4.png',
    'assets/project-shots/jewellery-5.png'
  ],
  petcare: [
    'assets/project-shots/petcare-1.png',
    'assets/project-shots/petcare-2.png',
    'assets/project-shots/petcare-4.png',
    'assets/project-shots/petcare-5.png',
    'assets/project-shots/petcare-5.png'
  ],
  salon: [
    'assets/project-shots/salon-1.png',
    'assets/project-shots/salon-2.png',
    'assets/project-shots/salon-3.png',
    'assets/project-shots/salon-4.png',
    'assets/project-shots/salon-5.png'
  ],
  fallback: [
    'assets/project-shots/fallback-1.svg',
    'assets/project-shots/fallback-2.svg',
    'assets/project-shots/fallback-3.svg',
    'assets/project-shots/fallback-4.svg',
    'assets/project-shots/fallback-5.svg'
  ]
};

function getProjectShots(card) {
  const previewLink = card.querySelector('.proj-thumb')?.closest('a')?.href || '';
  const title = card.querySelector('.proj-title')?.textContent.trim().toLowerCase() || '';

  if (previewLink.includes('banexdigital.com')) return projectShotSets.banex;
  if (previewLink.includes('beautiful-churros-578dd5')) return projectShotSets.realEstateOne;
  if (previewLink.includes('glittering-monstera-d43286')) return projectShotSets.realEstateTwo;
  if (previewLink.includes('spectacular-melomakarona-311c2d')) return projectShotSets.travels;
  if (previewLink.includes('glittery-creponne-9b24ab')) return projectShotSets.ca;
  if (previewLink.includes('relaxed-blancmange-7ff0c0')) return projectShotSets.manufacturing;
  if (previewLink.includes('sunny-treacle-82f422')) return projectShotSets.eventManagement;
  if (previewLink.includes('rad-profiterole-75840e')) return projectShotSets.doctor;
  if (previewLink.includes('eclectic-licorice-2bfaa9')) return projectShotSets.dentalClinic;
  if (previewLink.includes('fluffy-pothos-0a6f5b')) return projectShotSets.advocate;
  if (previewLink.includes('hilarious-hotteok-80888f')) return projectShotSets.cafe;
  if (previewLink.includes('benevolent-begonia-0a1a71')) return projectShotSets.gym;
  if (previewLink.includes('chipper-longma-a207d1')) return projectShotSets.bakery;
  if (previewLink.includes('jocular-melomakarona-9e61f5')) return projectShotSets.photoStudio;
  if (previewLink.includes('mukeshfootwear.com')) return projectShotSets.footwear;
  if (previewLink.includes('riyacollectionsaswad.com')) return projectShotSets.clothing;
  if (previewLink.includes('alakajewellers.com')) return projectShotSets.jewellery;
  if (previewLink.includes('kitpapa.net/petlove')) return projectShotSets.petcare;
  if (previewLink.includes('studiolikesaloon.com')) return projectShotSets.salon;

  if (title === 'banex digital website') return projectShotSets.banex;
  if (title === 'clothing brand website') return projectShotSets.clothing;
  if (title === 'jewellery brand website') return projectShotSets.jewellery;
  if (title === 'pet care website') return projectShotSets.petcare;
  if (title === 'salon website') return projectShotSets.salon;

  return projectShotSets.fallback;
}

document.querySelectorAll('.proj-card').forEach((card, cardIndex) => {
  const slideshow = card.querySelector('.project-slideshow');
  const slides = slideshow ? Array.from(slideshow.querySelectorAll('.project-slide')) : [];
  if (slides.length < 2) return;

  getProjectShots(card).forEach((src, index) => {
    if (slides[index]) {
      slides[index].src = src;
    }
  });

  let activeIndex = 0;
  let timerId;

  const showNextSlide = () => {
    slides[activeIndex].classList.remove('is-active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('is-active');
  };

  const startSlideshow = () => {
    if (!timerId) {
      timerId = window.setInterval(showNextSlide, 2400 + (cardIndex % 3) * 180);
    }
  };

  const pauseSlideshow = () => {
    window.clearInterval(timerId);
    timerId = null;
  };

  card.addEventListener('mouseenter', pauseSlideshow);
  card.addEventListener('mouseleave', startSlideshow);
  startSlideshow();
});
