/* =========================================================
   EDIT YOUR CONTENT HERE
   - Put photos in the /images folder and list them below.
   - Talks: link to YouTube, SoundCloud, MP3 files, etc.
   - Events: dates use YYYY-MM-DD. Past events hide automatically.
   ========================================================= */

const TALKS = [
  { title: "Mindfulness of Breathing", topic: "Meditation", length: "35 min", lang: "English",
    text: "A guided introduction to ānāpānasati — resting attention on the breath.", url: "#" },
  { title: "Loving-kindness (Mettā)", topic: "Meditation", length: "28 min", lang: "English",
    text: "Cultivating goodwill toward ourselves and all beings.", url: "#" },
  { title: "The Four Noble Truths", topic: "Dhamma talk", length: "52 min", lang: "English",
    text: "The heart of the Buddha's teaching, explained for daily life.", url: "#" },
  { title: "Generosity as Practice", topic: "Dhamma talk", length: "40 min", lang: "Burmese",
    text: "Why dāna is the first step on the path.", url: "#" },
  { title: "Questions & Answers", topic: "Q&A", length: "1 hr", lang: "English",
    text: "Students' questions on practice, work and family life.", url: "#" },
  { title: "Walking Meditation", topic: "Meditation", length: "20 min", lang: "English",
    text: "Bringing awareness to each step.", url: "#" },
];

const PHOTOS = [
  { src: "images/photo-1.jpg", caption: "Morning alms round" },
  { src: "images/photo-2.jpg", caption: "Dhamma talk" },
  { src: "images/photo-3.jpg", caption: "Meditation retreat" },
  { src: "images/photo-4.jpg", caption: "At the monastery" },
  { src: "images/photo-5.jpg", caption: "With students" },
  { src: "images/photo-6.jpg", caption: "Pagoda at dusk" },
  { src: "images/photo-7.jpg", caption: "Chanting" },
];

const EVENTS = [
  { date: "2026-12-06", title: "Sunday Dhamma talk", place: "Agga Dhamma Meditation Centre, Bangkok · 10:00 – 11:30", type: "Talk" },
  { date: "2026-12-19", title: "Weekend meditation retreat", place: "Forest retreat centre, Kanchanaburi · 2 days", type: "Retreat" },
  { date: "2027-01-10", title: "Beginners' meditation class", place: "Online · Zoom, 19:00", type: "Online" },
];

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);

/* Show a soft placeholder when an image file is missing */
function fallback(img, label) {
  const div = document.createElement("div");
  div.className = "ph";
  div.innerHTML = `${img.dataset.fallback || "☸"}<small>${label}</small>`;
  img.replaceWith(div);
}
function watchImage(img, label) {
  img.addEventListener("error", () => fallback(img, label), { once: true });
  if (img.complete && img.naturalWidth === 0) fallback(img, label);
}

/* ---------- Nav ---------- */
const toggle = $(".nav__toggle");
const menu = $("#nav-menu");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("is-open", !open);
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }
});
const nav = $(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Hero portrait ---------- */
watchImage($(".frame img"), "Add images/portrait.jpg");

/* ---------- Teachings ---------- */
const talksEl = $("#talks");
const filtersEl = $("#filters");
const topics = ["All", ...new Set(TALKS.map((t) => t.topic))];

function renderTalks(topic) {
  const list = topic === "All" ? TALKS : TALKS.filter((t) => t.topic === topic);
  talksEl.innerHTML = list.map((t) => `
    <article class="card">
      <div class="card__meta"><span class="card__tag">${t.topic}</span><span>${t.length} · ${t.lang}</span></div>
      <h3>${t.title}</h3>
      <p>${t.text}</p>
      <a class="card__link" href="${t.url}" target="_blank" rel="noopener">Listen</a>
    </article>`).join("");
}
filtersEl.innerHTML = topics.map((t, i) =>
  `<button class="chip" aria-pressed="${i === 0}" data-topic="${t}">${t}</button>`).join("");
filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filtersEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === btn)));
  renderTalks(btn.dataset.topic);
});
renderTalks("All");

/* ---------- Gallery + lightbox ---------- */
const grid = $("#gallery-grid");
grid.innerHTML = PHOTOS.map((p, i) => `
  <button type="button" data-i="${i}" aria-label="View photo: ${p.caption}">
    <img src="${p.src}" alt="${p.caption}" loading="lazy" data-fallback="☸">
  </button>`).join("");
grid.querySelectorAll("img").forEach((img) => watchImage(img, img.alt));

const lb = $("#lightbox");
const lbFig = $("figure", lb);
let current = 0, lastFocus = null;

function showPhoto(i) {
  current = (i + PHOTOS.length) % PHOTOS.length;
  const p = PHOTOS[current];
  lbFig.innerHTML = `<img src="${p.src}" alt="${p.caption}" data-fallback="☸"><figcaption>${p.caption}</figcaption>`;
  watchImage($("img", lbFig), "Photo coming soon");
}
function openLightbox(i) {
  lastFocus = document.activeElement;
  showPhoto(i);
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  $(".lightbox__close", lb).focus();
}
function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = "";
  lastFocus && lastFocus.focus();
}
grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) openLightbox(Number(btn.dataset.i));
});
$(".lightbox__close", lb).addEventListener("click", closeLightbox);
$(".lightbox__prev", lb).addEventListener("click", () => showPhoto(current - 1));
$(".lightbox__next", lb).addEventListener("click", () => showPhoto(current + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});

/* ---------- Events ---------- */
const eventsEl = $("#events");
const today = new Date(); today.setHours(0, 0, 0, 0);
const upcoming = EVENTS
  .map((ev) => ({ ...ev, d: new Date(ev.date + "T00:00:00") }))
  .filter((ev) => ev.d >= today)
  .sort((a, b) => a.d - b.d);

eventsEl.innerHTML = upcoming.length
  ? upcoming.map((ev) => `
    <li class="event reveal">
      <div class="event__date">
        <span class="event__day">${ev.d.getDate()}</span>
        <span class="event__mon">${ev.d.toLocaleString("en", { month: "short" })} ${ev.d.getFullYear()}</span>
      </div>
      <div><h3>${ev.title}</h3><p>${ev.place}</p></div>
      <span class="event__type">${ev.type}</span>
    </li>`).join("")
  : `<li class="events__empty">No events scheduled right now — please check back soon.</li>`;

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
