/* ===================================================================
   GachaGame.wiki — index.js

   ▸ EVERYTHING starts from the GAMES array below.
     Add / edit / remove a game here and BOTH the hero slide and the
     bottom-right filmstrip tile are generated automatically.

   Each game:
     name : title + label
     url  : the subdomain
     tag  : little yellow label ("Featured", "News", "Update", …)
     desc : description
     logo : path to the thumbnail image
            "" to show a text placeholder instead
     bg   :background — image path OR video path
=================================================================== */
const GAMES = [
  {
    name: "Neverness to Everness",
    url:  "https://nte.gachagame.wiki",
    tag:  "Update",
    desc: "An open-world action RPG by Hotta Studio. Play as an Appraiser exploring the city of Hethereau and fighting hostile forces.",
    logo: "/Logos/NTE.jpg",
    bg:   "/mp4/nte_bgvideo.mp4"
  },
  {
    name: "Ananta",
    url:  "https://ananta.gachagame.wiki",
    tag:  "",
    desc: "An open world game like GTA VI by NakedRain.Play as an Agent doing comissions or just exploring the city and doing many side gigs and getting more followers on social media.",
    logo: "Logos/Ananta.png",
    bg:   "/mp4/ananta.mp4"
  },
  {
    name: "Varsapura",
    url:  "https://varsapura.gachagame.wiki",
    tag:  "",
    desc: "A city of rain inspired by Singapore.",
    logo: "/Logos/varsapura.jpg",
    bg:   ""
  },
  {
    name: "Silver Palace",
    url: "https://silverpalaces.gachagame.wiki",
    tag: "News",
    desc: "A city inspired by London in the mid 1800s where people mutate to Werewolves, and mystery organisations.",
    logo: "/Logos/silverpalace.jpg",
      bg: "/mp4/silverpalace.mp4"
    }
];


const AUTOPLAY_MS = 6000;

/* =================================================================== */

const slidesEl   = document.getElementById('slides');
const dotsEl     = document.getElementById('dots');
const trackEl    = document.getElementById('stripTrack');
const counterEl  = document.getElementById('stripCounter');
const nextLabel  = document.getElementById('stripNextLabel');

let current = 0;
const total = GAMES.length;
const pad = n => String(n + 1).padStart(2, '0');

/* ---- Build slides, dots and filmstrip tiles from GAMES ---- */
GAMES.forEach((game, i) => {

 
  const slide = document.createElement('div');
  slide.className = 'slide' + (i === 0 ? ' active' : '');

  const bgStyle = game.bg && !/\.(mp4|webm)$/i.test(game.bg)
    ? `style="background-image:url('${game.bg}')"`
    : '';

  slide.innerHTML = `
    <div class="slide-bg" ${bgStyle}>
      ${game.bg && /\.(mp4|webm)$/i.test(game.bg)
        ? `<video src="${game.bg}" autoplay muted loop playsinline></video>` : ''}
    </div>
    <div class="slide-content">
      <span class="slide-tag">${game.tag || 'Featured'}</span>
      <h1>${game.name}</h1>
      <p>${game.desc || ''}</p>
      <a class="visit" href="${game.url}">Open Wiki &rsaquo;</a>
    </div>`;
  slidesEl.appendChild(slide);


  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsEl.appendChild(dot);


  const tile = document.createElement('a');
  tile.className = 'strip-tile' + (i === 0 ? ' active' : '');
  tile.href = game.url;
  tile.dataset.index = i;
  tile.innerHTML = `
    ${game.logo
      ? `<img src="${game.logo}" alt="${game.name}">`
      : `<div class="ph">${game.name}</div>`}
    <span class="label">${game.name}</span>
    <span class="bar"></span>`;

  
  tile.addEventListener('mouseenter', () => { stopAuto(); goTo(i, true); });
  

  trackEl.appendChild(tile);
});

const slides = slidesEl.querySelectorAll('.slide');
const dots   = dotsEl.querySelectorAll('.dot');
const tiles  = trackEl.querySelectorAll('.strip-tile');

/* ---- Centre the active tile inside the strip viewport ---- */
function centerStrip(i){
  const tile = tiles[i];
  if (!tile) return;
  const viewport = trackEl.parentElement.clientWidth;
  const shift = tile.offsetLeft - (viewport / 2) + (tile.offsetWidth / 2);
  trackEl.style.transform = `translateX(${-Math.max(0, shift)}px)`;
}

/* ---- Counter labels ---- */
function updateLabels(i){
  counterEl.textContent = `${pad(i)} / ${pad(total - 1)}`;
  const next = (i + 1) % total;
  nextLabel.textContent = total > 1 ? `NEXT ${pad(next)}` : '';
}

/* ---- Show a slide ---- */
function show(i){
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  tiles.forEach(t => t.classList.remove('active'));

  slides[i].classList.add('active');
  dots[i].classList.add('active');
  tiles[i].classList.add('active');

  centerStrip(i);
  updateLabels(i);

  /* play only the active slide's video, pause the rest */
  slides.forEach(s => { const v = s.querySelector('video'); if (v) v.pause(); });
  const v = slides[i].querySelector('video');
  if (v) v.play().catch(() => {});

  current = i;
}

function goTo(i, fromHover){
  show((i + total) % total);
  if (!fromHover) resetAuto();
}
function move(dir){ goTo(current + dir); }

/* ---- Arrow buttons ---- */
document.getElementById('heroPrev').addEventListener('click', () => move(-1));
document.getElementById('heroNext').addEventListener('click', () => move(1));
document.getElementById('stripPrev').addEventListener('click', () => move(-1));
document.getElementById('stripNext').addEventListener('click', () => move(1));

/* ---- Autoplay ---- */
let timer = null;
function startAuto(){ if (total > 1) timer = setInterval(() => move(1), AUTOPLAY_MS); }
function stopAuto(){ clearInterval(timer); timer = null; }
function resetAuto(){ stopAuto(); startAuto(); }

/* Resume autoplay when the pointer leaves the strip */
document.getElementById('strip').addEventListener('mouseleave', resetAuto);

/* Keep the active tile centred if the window is resized */
window.addEventListener('resize', () => centerStrip(current));

/* ---- Featured cards: optional background image via data-img ---- */
document.querySelectorAll('.feature-thumb[data-img]').forEach(el => {
  const img = el.getAttribute('data-img');
  if (img){ el.style.backgroundImage = `url('${img}')`; el.textContent = ''; }
});

/* ---- Init ---- */
show(0);
startAuto();
