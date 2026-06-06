// ===================================================
// SHANKH AIR — Main JavaScript
// ===================================================

import './style.css';

// ─── Sticky Navbar ───────────────────────────────
const navbar = document.getElementById('navbar');
const handleScroll = () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
};
window.addEventListener('scroll', handleScroll, { passive: true });

// ─── Hamburger Menu ──────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// ─── Search Tabs ─────────────────────────────────
const tabs   = document.querySelectorAll('.search-tab');
const panels = document.querySelectorAll('.search-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(`panel-${target}`)?.classList.add('active');
  });
});

// ─── Trip Type Toggle ────────────────────────────
const tripRadios      = document.querySelectorAll('input[name="tripType"]');
const returnDateGroup = document.getElementById('returnDateGroup');
const returnDate      = document.getElementById('returnDate');
tripRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const isRound = radio.value === 'roundtrip';
    returnDate.disabled = !isRound;
    returnDateGroup.style.opacity = isRound ? '1' : '0.5';
  });
});

// ─── Set today's date as default ─────────────────
const departDate = document.getElementById('departDate');
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
departDate.value = todayStr;
departDate.min = todayStr;
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
document.getElementById('returnDate').min = todayStr;

// ─── Swap Cities ─────────────────────────────────
const swapBtn = document.getElementById('swapBtn');
const fromCity = document.querySelector('.from-field .city-code');
const fromName = document.querySelector('.from-field .city-name');
const fromAirport = document.querySelector('.from-field .airport-name');
const toCity = document.querySelector('.to-field .city-code');
const toName = document.querySelector('.to-field .city-name');
const toAirport = document.querySelector('.to-field .airport-name');
swapBtn?.addEventListener('click', () => {
  const tmpCode = fromCity.textContent;
  const tmpName = fromName.textContent;
  const tmpAirport = fromAirport.textContent;
  fromCity.textContent = toCity.textContent;
  fromName.textContent = toName.textContent;
  fromAirport.textContent = toAirport.textContent;
  toCity.textContent = tmpCode;
  toName.textContent = tmpName;
  toAirport.textContent = tmpAirport;
});

// ─── Traveller Dropdown ───────────────────────────
const trigger  = document.getElementById('travellerTrigger');
const dropdown = document.getElementById('travellerDropdown');
let adultCount = 1, childCount = 0;

trigger?.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = dropdown.classList.toggle('open');
  trigger.setAttribute('aria-expanded', open);
  dropdown.setAttribute('aria-hidden', !open);
});

document.addEventListener('click', (e) => {
  if (!trigger?.contains(e.target) && !dropdown?.contains(e.target)) {
    dropdown?.classList.remove('open');
    trigger?.setAttribute('aria-expanded', 'false');
  }
});

const updateTravellerDisplay = () => {
  const cabinEl = document.getElementById('cabinClass');
  const cabin   = cabinEl ? cabinEl.value : 'economy';
  const cabinLabel = { economy: 'Economy', premium: 'Premium Economy', business: 'Business' }[cabin];
  const total = adultCount + childCount;
  document.querySelector('.traveller-count').textContent = `${total} ${total === 1 ? 'Adult' : 'Travellers'}`;
  document.querySelector('.traveller-class').textContent = cabinLabel;
};

document.getElementById('adultPlus')?.addEventListener('click', () => {
  if (adultCount < 9) { adultCount++; document.getElementById('adultCount').textContent = adultCount; updateTravellerDisplay(); }
});
document.getElementById('adultMinus')?.addEventListener('click', () => {
  if (adultCount > 1) { adultCount--; document.getElementById('adultCount').textContent = adultCount; updateTravellerDisplay(); }
});
document.getElementById('childPlus')?.addEventListener('click', () => {
  if (childCount < 6) { childCount++; document.getElementById('childCount').textContent = childCount; updateTravellerDisplay(); }
});
document.getElementById('childMinus')?.addEventListener('click', () => {
  if (childCount > 0) { childCount--; document.getElementById('childCount').textContent = childCount; updateTravellerDisplay(); }
});
document.getElementById('cabinClass')?.addEventListener('change', updateTravellerDisplay);
document.getElementById('applyTravellers')?.addEventListener('click', () => {
  updateTravellerDisplay();
  dropdown.classList.remove('open');
});

// ─── Offers Carousel ─────────────────────────────
function buildCarousel(trackId, prevId, nextId, visibleCount = 4) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const cards = track.children;
  let idx = 0;

  const getCardWidth = () => {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + parseInt(getComputedStyle(track).gap);
  };

  const move = () => {
    track.style.transform = `translateX(-${idx * getCardWidth()}px)`;
  };

  document.getElementById(nextId)?.addEventListener('click', () => {
    const max = Math.max(0, cards.length - visibleCount);
    idx = Math.min(idx + 1, max);
    move();
  });
  document.getElementById(prevId)?.addEventListener('click', () => {
    idx = Math.max(idx - 1, 0);
    move();
  });
}
buildCarousel('offersTrack', 'offersPrev', 'offersNext', 4);
buildCarousel('destTrack', 'destPrev', 'destNext', 5);

// ─── Weekend Banner Dots ──────────────────────────
const dots = document.querySelectorAll('.dot');
let activeDot = 0;
const rotateDots = () => {
  dots[activeDot].classList.remove('active');
  activeDot = (activeDot + 1) % dots.length;
  dots[activeDot].classList.add('active');
};
setInterval(rotateDots, 2800);
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    dots[activeDot].classList.remove('active');
    activeDot = i;
    dot.classList.add('active');
  });
});

// ─── Stats Counter Animation ─────────────────────
function animateCounter(el, target, duration = 1800, suffix = '') {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats-section');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateCounter(document.getElementById('statFlights'),   2200, 2000);
      animateCounter(document.getElementById('statDomestic'),  96,   1500);
      animateCounter(document.getElementById('statIntl'),      45,   1500);
      animateCounter(document.getElementById('statCustomers'), 850,  2000);
      animateCounter(document.getElementById('statTeam'),      400,  1800);
    }
  });
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

// ─── Dropdown nav keyboard a11y ───────────────────
document.getElementById('aboutDropdown')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const menu = e.target.closest('.nav-dropdown').querySelector('.dropdown-menu');
    const visible = menu.style.display === 'block';
    menu.style.display = visible ? '' : 'block';
    e.target.setAttribute('aria-expanded', !visible);
  }
  if (e.key === 'Escape') {
    e.target.closest('.nav-dropdown').querySelector('.dropdown-menu').style.display = '';
  }
});

// ─── Staggered card entrance ─────────────────────
const animCards = document.querySelectorAll('.offer-card, .addon-card, .dest-card, .dark-card, .blog-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUpCard 0.5s ease ${i * 0.08}s both`;
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const fadeKeyframe = `@keyframes fadeUpCard {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
const styleSheet = document.createElement('style');
styleSheet.textContent = fadeKeyframe;
document.head.appendChild(styleSheet);

animCards.forEach(card => {
  card.style.opacity = '0';
  cardObserver.observe(card);
});

// ─── Search button ripple effect ─────────────────
document.getElementById('searchBtn')?.addEventListener('click', function(e) {
  this.style.transform = 'scale(0.97)';
  setTimeout(() => this.style.transform = '', 150);
});

console.log('✈️ Shankh Air — Lucknow se duniya tak!');
