// Avtomobil Yo'llari UZ — statik SPA (GitHub Pages)
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const BASE = window.SITE_BASE || "";
const D = {};
async function load(n) {
  if (!D[n]) D[n] = await fetch(`${BASE}data/${n}.json?v=${Date.now() >> 21}`).then(r => r.json()).catch(() => null);
  return D[n];
}


/* ---------- Yangi o'zbek lotin alifbosi (O'RQ-1184, 2026): oʻ→ö, gʻ→ğ, sh→ş, ch→ç, '→ʼ ---------- */
const AP = "['‘’ʻ`]";
const RULES = [[new RegExp("O" + AP, "g"), "Ö"], [new RegExp("o" + AP, "g"), "ö"], [new RegExp("G" + AP, "g"), "Ğ"], [new RegExp("g" + AP, "g"), "ğ"],
  [/S[Hh]/g, "Ş"], [/sh/g, "ş"], [/C[Hh]/g, "Ç"], [/ch/g, "ç"], [new RegExp("(?<=[A-Za-zÖöĞğŞşÇç])" + AP + "(?=[A-Za-zÖöĞğŞşÇç])", "g"), "ʼ"]];
const SKIP = /(https?:\/\/\S+|t\.me\/\S+|@\w+|#\w+|[\w.-]+\.(?:uz|io|com|org|ru)\S*)/;
const yangi = t => t ? t.split(SKIP).map((p, i) => i % 2 ? p : RULES.reduce((a, [rx, r]) => a.replace(rx, r), p)).join("") : t;
const fold = t => String(t || "").toLowerCase().replace(/ö/g, "o").replace(/ğ/g, "g").replace(/ş/g, "sh").replace(/ç/g, "ch").replace(/['‘’ʻʼ`]/g, "");
function convertDom(root = document.body) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && /SCRIPT|STYLE/.test(n.parentElement.tagName) ? 2 : 1 });
  let n; while ((n = w.nextNode())) { const v = yangi(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  root.querySelectorAll && root.querySelectorAll("[placeholder],[title],[aria-label]").forEach(e => ["placeholder", "title", "aria-label"].forEach(a => e.hasAttribute(a) && e.setAttribute(a, yangi(e.getAttribute(a)))));
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(x => x.nodeType === 1 ? convertDom(x) : x.nodeType === 3 && (x.nodeValue = yangi(x.nodeValue))))).observe(document.body, { childList: true, subtree: true });

/* ---------- Ikonkalar (Lucide uslubida, chiziqli SVG) ---------- */
const P = {
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  library: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h8M8 11h6"/>',
  news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
  calc: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/>',
  check: '<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  road: '<path d="M4 21 9 3M20 21 15 3M12 4v3M12 11v3M12 18v3"/>',
  layers: '<path d="m12.8 2.2a2 2 0 0 0-1.6 0L2.6 6.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9a1 1 0 0 0 0-1.8Z"/><path d="m2 12.6 9.2 4.2a2 2 0 0 0 1.6 0L22 12.6M2 17.6l9.2 4.2a2 2 0 0 0 1.6 0L22 17.6"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
  scale: '<path d="M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/><path d="m16 16 3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1ZM2 16l3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1Z"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  hard: '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5M4 15v-3a6 6 0 0 1 6-6M14 6a6 6 0 0 1 6 6v3"/>',
  coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18M7 6h1v4M16.7 13.9l.7.7-2.8 2.8"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.4-6.4 2.1 2.1-6.4z"/>',
  play: '<path d="m6 3 14 9-14 9V3z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
};
const I = (n, c = "i") => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;
const hydrateIcons = (root = document) => root.querySelectorAll("i[data-i]").forEach(e => e.outerHTML = I(e.dataset.i));

/* ---------- Suratlar (Pexels, bepul litsenziya) ---------- */
const px = (id, w = 1920) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const IMG = { hero: 7381786, lib: 38751509, news: 32894132, posts: 4345863, calc: 18261887, quiz: 26628625, gloss: 8356329, about: 9906079, band: 18261887 };

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const fdate = iso => { const d = new Date(iso); return isNaN(d) ? "" : `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`; };
const pageHead = (k, t, p, img) => `<section class="ph"><div class="bg" style="background-image:url('${px(img)}')"></div><div class="wrap"><span class="kicker">${k}</span><h1>${t}</h1><p>${p}</p></div></section>`;
const CAT_ICON = { "Yo'l, ko'prik, tunnel": "road", "Loyihalash asoslari": "ruler", "Muhandislik qidiruvlari": "compass", "Qurilish ishlari": "hard", "Smeta normalari": "coins", "Qonun va qarorlar": "scale", "Umumiy": "layers" };
const CAT_ORDER = ["Yo'l, ko'prik, tunnel", "Loyihalash asoslari", "Muhandislik qidiruvlari", "Qurilish ishlari", "Smeta normalari", "Qonun va qarorlar", "Umumiy"];

/* ---------- Bosh sahifa ---------- */
async function home() {
  const [docs, news, posts] = await Promise.all([load("docs"), load("news"), load("posts")]);
  const PP = ((posts && posts.posts) || []).filter(p => p.text && p.text.length > 60);
  const S = [["library", "Normativ kutubxona", `${docs ? docs.length : 60}+ ta ShNQ, QMQ va me'yoriy hujjat — rasmiy PDF bilan`, "kutubxona", IMG.lib],
    ["calc", "Kalkulyatorlar", "Asfalt hajmi, yo'l toifasi, qiyalik, zichlash koeffitsienti", "kalkulyatorlar", IMG.calc],
    ["news", "Yangiliklar", "Normativ o'zgarishlar va dunyo yo'l qurilishi", "yangiliklar", IMG.news],
    ["megaphone", "Kanal postlari", "Telegram kanaldagi barcha postlar arxivi", "postlar", IMG.posts],
    ["check", "Testlar", "ShNQ va texnologiya bo'yicha bilimingizni sinang", "testlar", IMG.quiz],
    ["book", "Lug'at", "Yo'l qurilishi atamalari — sodda tushuntirish", "lugat", IMG.gloss]];
  return `
  <section class="hero"><div class="bg" style="background-image:url('${px(IMG.hero)}')"></div><div class="wrap">
    <span class="kicker">Yo'l muhandislari portali</span>
    <h1>Yo'l loyihalash va qurilishi — <span>bir joyda</span></h1>
    <p class="lead">Amaldagi normativ hujjatlar, sohadagi yangiliklar, muhandislik kalkulyatorlari va bilim testlari. Loyihachi, quruvchi, texnik nazorat va talabalar uchun.</p>
    <div class="btns">
      <a class="btn y" href="#/kutubxona">${I("library")}Normativlar</a>
      <a class="btn" href="#/kalkulyatorlar">${I("calc")}Kalkulyatorlar</a>
      <a class="btn tg" href="https://t.me/yol_muhandis" target="_blank" rel="noopener">${I("send")}Telegram kanal</a>
    </div>
    <div class="stats">
      <div class="stat"><b>${docs ? docs.length : 60}+</b><span>normativ hujjat</span></div>
      ${PP.length ? `<div class="stat"><b>${PP.length}</b><span>kanal posti</span></div>` : `<div class="stat"><b>7</b><span>bo'lim</span></div>`}
      <div class="stat"><b>4</b><span>kalkulyator</span></div>
      <div class="stat"><b>3</b><span>post har kuni</span></div>
    </div>
  </div></section>

  <section class="block"><div class="wrap">
    <div class="sh"><div><h2>Bo'limlar</h2><p>Kerakli narsani tez toping</p></div></div>
    <div class="grid g3">${S.map(([i, t, p, r, img]) => `<a class="card sec" href="#/${r}"><div class="im" style="background-image:url('${px(img, 800)}')"></div><div class="in"><div class="ic">${I(i)}</div><h3>${t}</h3><p>${p}</p><span class="go">Ochish ${I("arrow")}</span></div></a>`).join("")}</div>
  </div></section>

  <section class="block"><div class="wrap">
    <div class="sh"><div><h2>Ko'p so'raladigan hujjatlar</h2><p>Yo'l, ko'prik va tunnel normalari</p></div><a href="#/kutubxona">Barchasi ${I("arrow")}</a></div>
    <div class="grid g3">${(docs || []).filter(d => d.cat === "Yo'l, ko'prik, tunnel").slice(0, 6).map(miniDoc).join("")}</div>
  </div></section>

  <section class="band"><div class="bg" style="background-image:url('${px(IMG.band)}')"></div><div class="wrap">
    <div><span class="kicker">Telegram</span><h2 style="margin-top:14px">Har kuni 3 ta foydali post — normativ, tajriba va yangilik</h2><p>Har yakshanba 10 ta test. Bildirishnomasiz, bezovta qilmasdan.</p></div>
    <div class="btns" style="justify-content:flex-end"><a class="btn tg" href="https://t.me/yol_muhandis" target="_blank" rel="noopener">${I("send")}Kanalga qo'shilish</a></div>
  </div></section>

  <section class="block"><div class="wrap">
    <div class="sh"><div><h2>So'nggi yangiliklar</h2></div><a href="#/yangiliklar">Barchasi ${I("arrow")}</a></div>
    <div class="grid g3">${(news || []).slice(0, 3).map(newsCard).join("")}</div>
  </div></section>

  ${PP.length ? `<section class="block"><div class="wrap">
    <div class="sh"><div><h2>Kanaldan</h2><p>So'nggi postlar</p></div><a href="#/postlar">Barchasi ${I("arrow")}</a></div>
    <div class="grid g3">${PP.slice(0, 3).map(postCard).join("")}</div>
  </div></section>` : ""}`;
}
const miniDoc = d => `<a class="card" href="#/kutubxona/${d.id}"><div class="row"><span class="pill">${I(CAT_ICON[d.cat] || "file")}${esc(d.cat)}</span></div><h3>${esc(d.code)}</h3><p>${esc(d.title)}</p><span class="go">Ochish ${I("arrow")}</span></a>`;

/* ---------- Yangiliklar ---------- */
function newsCard(n) {
  return `<article class="card"><div class="row"><span class="pill y">${esc(n.tag)}</span><span class="date">${fdate(n.date)}</span></div>
    <h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>
    <div class="links">${n.lib ? `<a class="m" href="#/kutubxona/${n.lib}">${I("file")}Hujjatni ochish</a>` : ""}${n.src ? `<a href="${n.src[1]}" target="_blank" rel="noopener">${I("ext")}Manba</a>` : ""}</div></article>`;
}
async function newsPage() {
  const news = (await load("news")) || [];
  const tags = ["Hammasi", ...new Set(news.map(n => n.tag))];
  setTimeout(() => {
    const draw = t => { $("#nl").innerHTML = news.filter(n => t === "Hammasi" || n.tag === t).map(newsCard).join("");
      document.querySelectorAll("#nt .chip").forEach(c => c.classList.toggle("on", c.dataset.t === t)); };
    document.querySelectorAll("#nt .chip").forEach(c => c.onclick = () => draw(c.dataset.t)); draw("Hammasi");
  });
  return pageHead("Yangiliklar", "Yangiliklar", "Yo'l sohasidagi normativ o'zgarishlar, hukumat qarorlari va dunyo yo'l qurilishidagi muhim voqealar.", IMG.news) +
    `<div class="wrap"><div class="tools chips" id="nt">${tags.map(t => `<button class="chip" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
     <div class="grid g3" id="nl" style="margin-top:16px"></div></div>`;
}

/* ---------- Postlar ---------- */
function postCard(p) {
  const long = p.text && p.text.length > 280;
  return `<article class="card post">
    ${p.photo ? `<img class="phimg" loading="lazy" src="${esc(p.photo)}" alt="" onerror="this.remove()">` : ""}
    <div class="row"><span class="pill b">${I(p.video ? "play" : p.photo ? "image" : "megaphone")}${p.video ? "Video" : p.photo ? "Rasm" : "Post"}</span><span class="date">${fdate(p.date)}</span></div>
    <div class="tx">${esc(p.text)}</div>
    ${long ? `<button class="more" onclick="const t=this.previousElementSibling;t.classList.toggle('full');this.textContent=t.classList.contains('full')?'Yopish':'Davomini o\\'qish'">Davomini o'qish</button>` : ""}
    <div class="links"><a class="m" href="https://t.me/yol_muhandis/${p.id}" target="_blank" rel="noopener">${I("send")}Telegramda ochish</a></div>
  </article>`;
}
async function postsPage() {
  const data = await load("posts"); const PP = ((data && data.posts) || []).filter(p => p.text || p.photo);
  setTimeout(() => {
    const q = $("#pq"); if (!q) return;
    q.oninput = () => { const s = q.value.toLowerCase().trim(); const f = PP.filter(p => !s || fold(p.text).includes(fold(s)));
      $("#pl").innerHTML = f.length ? f.map(postCard).join("") : `<p class="empty">Hech narsa topilmadi.</p>`; };
    q.oninput();
  });
  return pageHead("Kanal arxivi", "Kanal postlari", "@yol_muhandis kanalidagi postlar — eski va yangi, qidiruv bilan. Sayt yangi postlarni o'zi qo'shib boradi.", IMG.posts) +
    `<div class="wrap">${PP.length ? `<div class="tools"><div class="search">${I("search")}<input class="inp" id="pq" placeholder="Postlardan qidirish: asfalt, ShNQ, karyer..."></div></div><div class="grid g3" id="pl" style="margin-top:16px"></div>`
      : `<div class="card" style="margin-top:28px"><h3>Postlar yuklanmoqda</h3><p>Arxiv avtomatik yangilanadi. Hozircha postlarni kanalda o'qing.</p><div class="links"><a class="m" href="https://t.me/yol_muhandis" target="_blank" rel="noopener">${I("send")}Kanalni ochish</a></div></div>`}</div>`;
}

/* ---------- Kutubxona ---------- */
function docCard(d) {
  return `<article class="card doc" id="${d.id}">
    <div class="row"><span class="pill">${I(CAT_ICON[d.cat] || "file")}${esc(d.cat)}</span>${d.lang === "ru" ? `<span class="pill b">ruscha</span>` : ""}</div>
    <div class="code">${esc(d.code)}</div><div class="t">${esc(d.title)}</div>
    ${d.meta ? `<p class="note">${esc(d.meta)}</p>` : ""}
    ${d.facts ? `<ul class="facts">${d.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
    <div class="links">${d.links.map(l => `<a class="${l[2] ? "m" : ""}" href="${l[1]}" target="_blank" rel="noopener">${I(l[2] ? "file" : "ext")}${esc(l[0])}</a>`).join("")}
      <a href="#/kutubxona/${d.id}" onclick="copyLink(event,'${d.id}')">${I("link")}<span>Havola</span></a></div>
  </article>`;
}
window.copyLink = (e, id) => {
  e.preventDefault(); const u = location.origin + location.pathname + "#/kutubxona/" + id; const s = e.currentTarget.querySelector("span");
  try { navigator.clipboard.writeText(u); s.textContent = "Nusxalandi"; setTimeout(() => s.textContent = "Havola", 1500); } catch (_) {}
};
async function libPage(sel) {
  const docs = (await load("docs")) || [];
  const cats = ["Hammasi", ...CAT_ORDER.filter(c => docs.some(d => d.cat === c))];
  let cat = "Hammasi";
  setTimeout(() => {
    const draw = () => { const s = $("#lq").value.toLowerCase().trim();
      const f = docs.filter(d => (cat === "Hammasi" || d.cat === cat) && (!s || fold([d.code, d.title, d.meta, ...(d.facts || [])].join(" ")).includes(fold(s))));
      $("#ll").innerHTML = f.length ? f.map(docCard).join("") : `<p class="empty">Hech narsa topilmadi.</p>`;
      document.querySelectorAll("#lc .chip").forEach(c => c.classList.toggle("on", c.dataset.c === cat));
      if (sel) { const el = document.getElementById(sel); if (el) { el.classList.add("hl"); setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 60); } sel = null; } };
    $("#lq").oninput = draw; document.querySelectorAll("#lc .chip").forEach(c => c.onclick = () => { cat = c.dataset.c; draw(); }); draw();
  });
  return pageHead("Normativ kutubxona", "Normativ hujjatlar", `${docs.length} ta hujjat: yo'l, ko'prik va tunnel normalari, qidiruv ishlari, qurilish va smeta normalari — rasmiy PDF bilan.`, IMG.lib) +
    `<div class="wrap"><div class="tools"><div class="search">${I("search")}<input class="inp" id="lq" placeholder="Qidirish: 2.05.02, ko'prik, geodeziya, smeta..."></div></div>
     <div class="chips" id="lc" style="margin-top:12px">${cats.map(c => `<button class="chip" data-c="${esc(c)}">${esc(c)}<small>${c === "Hammasi" ? docs.length : docs.filter(d => d.cat === c).length}</small></button>`).join("")}</div>
     <div class="grid g2" id="ll" style="margin-top:18px"></div>
     <p class="note" style="margin-top:16px">Ba'zi mc.uz havolalarida brauzer sertifikat ogohlantirishini ko'rsatishi mumkin — «Davom etish» ni tanlang.</p></div>`;
}

/* ---------- Kalkulyatorlar ---------- */
const num = id => parseFloat(String($(id).value).replace(",", ".")) || 0;
const fmt = (x, d = 2) => x.toLocaleString("ru-RU", { maximumFractionDigits: d });
function calcPage() {
  setTimeout(() => {
    const a = () => { const v = num("#aL") * num("#aB") * num("#aH") / 100, m = v * num("#aR"), t = num("#aT");
      $("#aRes").innerHTML = `Hajm: <b>${fmt(v)} m³</b><br>Massa: <b>${fmt(m)} t</b><br>Reyslar soni (${fmt(t, 1)} t dan): <b>${t ? Math.ceil(m / t) : "—"}</b>`; };
    ["#aL", "#aB", "#aH", "#aR", "#aT"].forEach(i => $(i).oninput = a); a();
    const T = [["Ia yoki Ib", "Ia — 150, Ib — 120", "3,75 m, 4+ tasma"], ["II", "120", "3,75 m, 2 tasma"], ["III", "100", "3,5 m, 2 tasma"], ["IV", "80", "3,0 m, 2 tasma"], ["V", "60", "4,5 m, 1 tasma"]];
    const b = () => { const n = num("#bN"); const r = n > 14000 ? T[0] : n > 6000 ? T[1] : n > 2000 ? T[2] : n > 200 ? T[3] : T[4];
      $("#bRes").innerHTML = `Toifa: <b>${r[0]}</b><br>Hisobiy tezlik: <b>${r[1]} km/soat</b><br>Harakat tasmasi: <b>${r[2]}</b><p class="note">ShNQ 2.05.02-23 asosida. Yakuniy toifa yo'lning ahamiyatiga ham bog'liq.</p>`; };
    $("#bN").oninput = b; b();
    const c = () => { const p = num("#cP"), L = num("#cL"); $("#cRes").innerHTML = `Promille: <b>${fmt(p * 10, 1)} ‰</b><br>Burchak: <b>${fmt(Math.atan(p / 100) * 180 / Math.PI, 2)}°</b><br>${fmt(L, 0)} m da balandlik farqi: <b>${fmt(L * p / 100)} m</b>`; };
    ["#cP", "#cL"].forEach(i => $(i).oninput = c); c();
    const d = () => { const r = num("#dR"), mx = num("#dM"); const k = mx ? r / mx : 0; const t = num("#dT");
      $("#dRes").innerHTML = `Ky = <b>${fmt(k, 3)}</b><br>${t ? (k >= t ? `✔ Talab (${fmt(t, 2)}) bajarilgan` : `✖ Talabdan (${fmt(t, 2)}) past — qo'shimcha zichlash kerak`) : ""}`; };
    ["#dR", "#dM", "#dT"].forEach(i => $(i).oninput = d); d();
  });
  const F = (id, l, v) => `<label for="${id.slice(1)}">${l}</label><input class="inp" id="${id.slice(1)}" value="${v}" inputmode="decimal">`;
  const C = (ic, t, p, body, rid) => `<div class="card calc"><div class="ic">${I(ic)}</div><h3>${t}</h3><p>${p}</p>${body}<div class="res" id="${rid}"></div></div>`;
  return pageHead("Muhandis asboblari", "Kalkulyatorlar", "Obyektda tez-tez kerak bo'ladigan hisoblar. Natijalar taxminiy — loyiha hisobi o'rnini bosmaydi.", IMG.calc) +
  `<div class="wrap"><div class="grid g2" style="margin-top:28px">
    ${C("layers", "Asfaltbeton miqdori", "Uchastka uchun hajm, massa va reyslar soni.", F("#aL", "Uzunlik, m", 1000) + F("#aB", "Kenglik, m", 7) + F("#aH", "Qatlam qalinligi, sm", 5) + F("#aR", "Zichlangan asfaltbeton zichligi, t/m³ (laboratoriya bo'yicha)", 2.4) + F("#aT", "Bitta samosval yuki, t", 20), "aRes")}
    ${C("gauge", "Yo'l toifasini aniqlash", "Kelajakdagi harakat jadalligi bo'yicha (ShNQ 2.05.02-23).", F("#bN", "Jadallik, yengil avtomobilga keltirilgan, avt/sutka", 4500), "bRes")}
    ${C("mountain", "Qiyalik konvertori", "Foiz → promille → gradus va balandlik farqi.", F("#cP", "Qiyalik, %", 4) + F("#cL", "Masofa, m", 250), "cRes")}
    ${C("hard", "Zichlash koeffitsienti (Ky)", "Joydagi quruq zichlik ÷ maksimal standart zichlik.", F("#dR", "Joydagi quruq zichlik, g/sm³", 1.82) + F("#dM", "Maksimal standart zichlik, g/sm³", 1.88) + F("#dT", "Talab qilingan Ky (loyiha bo'yicha)", 0.95), "dRes")}
  </div></div>`;
}

/* ---------- Testlar ---------- */
async function quizPage() {
  const Q = (await load("quiz")) || [];
  let score = 0, done = 0;
  window.ans = (i, j, btn) => {
    const box = btn.parentElement; if (box.dataset.done) return; box.dataset.done = 1; done++;
    if (j === Q[i].c) score++;
    box.querySelectorAll(".opt").forEach((b, k) => { if (k === Q[i].c) b.classList.add("ok"); else if (b === btn) b.classList.add("no"); });
    box.querySelector(".exp").style.display = "block";
    $("#qs").textContent = `Natija: ${score} / ${done} (jami ${Q.length})`;
  };
  return pageHead("Bilimingizni sinang", "Testlar", "ShNQ 2.05.02-23 va yo'l qurilishi texnologiyasi bo'yicha savollar. Har yakshanba kanalda yangi 10 ta test.", IMG.quiz) +
    `<div class="wrap"><p class="pill y" id="qs" style="margin:26px 0 16px">Natija: 0 / 0 (jami ${Q.length})</p>
    <div class="grid g2">${Q.map((q, i) => `<div class="card"><h3>${i + 1}. ${esc(q.q)}</h3>
      ${q.o.map((o, j) => `<button class="opt" onclick="ans(${i},${j},this)">${esc(o)}</button>`).join("")}
      <p class="exp">${esc(q.e)}</p></div>`).join("")}</div></div>`;
}

/* ---------- Lug'at ---------- */
async function glossPage() {
  const G = (await load("glossary")) || [];
  setTimeout(() => { const q = $("#gq"); const draw = () => { const s = q.value.toLowerCase();
    $("#gl").innerHTML = G.filter(g => !s || fold(g.term + g.text).includes(fold(s))).map(g => `<div><dt>${esc(g.term)}</dt><dd>${esc(g.text)}</dd></div>`).join(""); };
    q.oninput = draw; draw(); });
  return pageHead("Atamalar", "Lug'at", "Yo'l loyihalash va qurilishida ishlatiladigan asosiy atamalar — qisqa va sodda.", IMG.gloss) +
    `<div class="wrap"><div class="tools"><div class="search">${I("search")}<input class="inp" id="gq" placeholder="Atamani qidirish..."></div></div><dl class="gl" id="gl" style="margin-top:16px"></dl></div>`;
}

/* ---------- Biz haqimizda ---------- */
function aboutPage() {
  const C = (ic, t, p, l) => `<div class="card"><div class="ic">${I(ic)}</div><h3>${t}</h3><p>${p}</p>${l || ""}</div>`;
  return pageHead("Loyiha haqida", "Biz haqimizda", "Avtomobil Yo'llari UZ — yo'l muhandislari uchun o'zbek tilidagi mustaqil loyiha.", IMG.about) +
  `<div class="wrap"><div class="grid g2" style="margin-top:28px">
    ${C("road", "Maqsad", "Yo'l loyihalash va qurilishi bo'yicha ishonchli ma'lumotni o'zbek tilida, bir joyda va tushunarli shaklda berish: amaldagi normativlar, amaliy tajriba, hisob-kitob asboblari.")}
    ${C("send", "Telegram kanal", "Har kuni 3 ta post: ta'limiy material, tajriba, normativ, yangilik va vizual. Har yakshanba — 10 ta test.", `<div class="links"><a class="m" href="https://t.me/yol_muhandis" target="_blank" rel="noopener">${I("send")}@yol_muhandis</a></div>`)}
    ${C("file", "Manbalar haqida", "Normativ hujjatlar Qurilish va uy-joy kommunal xo'jaligi vazirligining rasmiy ro'yxatidan olinadi. Saytdagi qisqa ma'lumotlar tanishish uchun; loyihada rasmiy matnga tayaning.")}
    ${C("share", "Hamkorlik va takliflar", "Xato topdingizmi, hujjat yoki mavzu taklif qilmoqchimisiz? Kanal izohlarida yozing.", `<div class="links"><a class="m" href="https://t.me/yol_muhandis" target="_blank" rel="noopener">${I("send")}Kanalga yozish</a></div>`)}
  </div></div>`;
}

/* ---------- Router ---------- */
const ROUTES = { "": home, yangiliklar: newsPage, postlar: postsPage, kutubxona: libPage, kalkulyatorlar: calcPage, testlar: quizPage, lugat: glossPage, haqida: aboutPage };
const TITLES = { yangiliklar: "Yangiliklar", postlar: "Postlar", kutubxona: "Normativlar", kalkulyatorlar: "Kalkulyatorlar", testlar: "Testlar", lugat: "Lug'at", haqida: "Biz haqimizda" };
async function route() {
  let h = location.hash.replace(/^#\/?/, "");
  if (h && !h.includes("/") && !ROUTES[h]) h = "kutubxona/" + h;   // eski havolalar: #shnq-2-05-02-23
  const [r, sub] = h.split("/");
  const fn = ROUTES[r] || home;
  $("#app").innerHTML = await fn(sub);
  hydrateIcons();
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", a.dataset.r === (ROUTES[r] ? r : "")));
  $("#menu").classList.remove("open");
  if (!sub) window.scrollTo(0, 0);
  document.title = yangi((TITLES[r] ? TITLES[r] + " — " : "") + "Avtomobil Yo'llari UZ");
}
const navSolid = () => $("#nav").classList.toggle("solid", scrollY > 30);
addEventListener("scroll", navSolid, { passive: true });
addEventListener("hashchange", route);
hydrateIcons(); convertDom(); navSolid(); route();
