// Avtomobil Yo'llari UZ — sayt (statik SPA, GitHub Pages)
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const D = {};
async function load(name) {
  if (!D[name]) D[name] = await fetch(`data/${name}.json?v=${Date.now() >> 22}`).then(r => r.json()).catch(() => null);
  return D[name];
}
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const fdate = iso => { const d = new Date(iso); return isNaN(d) ? "" : `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`; };
const pageHead = (k, t, p) => `<div class="page-h"><div class="wrap"><span class="kicker">${k}</span><h1>${t}</h1><p>${p}</p></div></div>`;

/* ---------- Bosh sahifa ---------- */
async function home() {
  const [docs, news, posts] = await Promise.all([load("docs"), load("news"), load("posts")]);
  const P = (posts && posts.posts) || [];
  return `
  <section class="hero"><div class="wrap">
    <div>
      <span class="kicker">YO'L MUHANDISLARI PORTALI</span>
      <h1>Yo'l loyihalash va qurilishi — <span>bir joyda</span></h1>
      <p class="lead">Normativ hujjatlar, sohadagi yangiliklar, muhandislik kalkulyatorlari va bilim testlari. Loyihachi, quruvchi, texnik nazorat va talabalar uchun.</p>
      <div class="btns">
        <a class="btn y" href="#/kutubxona">📚 Normativ kutubxona</a>
        <a class="btn" href="#/kalkulyatorlar">🧮 Kalkulyatorlar</a>
        <a class="btn" href="https://t.me/yol_muhandis">✈ Telegram kanal</a>
      </div>
    </div>
    <div class="road" aria-hidden="true">
      <h4>YO'L KONSTRUKSIYASI</h4>
      <div class="layer" style="background:#1b1f27;color:#fff">Qoplama <small>asfaltbeton</small></div>
      <div class="layer" style="background:#2e3644;color:#fff">Asos <small>chaqiq tosh</small></div>
      <div class="layer" style="background:#6b5a3a;color:#fff">Qo'shimcha qatlam <small>qum / ShQA</small></div>
      <div class="layer" style="background:#4a3a26;color:#fff">Yo'l poyi <small>zichlangan grunt</small></div>
    </div>
  </div></section>
  <div class="wrap"><div class="stats">
    <div class="stat"><b>${docs ? docs.length : "—"}</b><span>normativ hujjat</span></div>
    <div class="stat"><b>${P.length || "—"}</b><span>kanal posti</span></div>
    <div class="stat"><b>4</b><span>kalkulyator</span></div>
    <div class="stat"><b>3</b><span>post har kuni</span></div>
  </div></div>

  <section class="block"><div class="wrap">
    <div class="sh"><div><h2>Bo'limlar</h2><p>Kerakli narsani tez toping</p></div></div>
    <div class="grid g3">
      ${[["📰", "Yangiliklar", "Normativ o'zgarishlar, qarorlar va dunyo yo'l qurilishi", "yangiliklar"],
         ["📢", "Kanal postlari", "Telegram kanaldagi barcha postlar arxivi", "postlar"],
         ["📚", "Normativ kutubxona", "ShNQ, qonunlar va nizomlar — rasmiy matnlarga havola", "kutubxona"],
         ["🧮", "Kalkulyatorlar", "Asfalt hajmi, yo'l toifasi, qiyalik, zichlash koeffitsienti", "kalkulyatorlar"],
         ["🧠", "Testlar", "ShNQ va texnologiya bo'yicha bilimingizni sinang", "testlar"],
         ["📖", "Lug'at", "Yo'l qurilishi atamalari — sodda tushuntirish", "lugat"]]
        .map(([i, t, p, r]) => `<a class="card" href="#/${r}"><div class="ic">${i}</div><h3>${t}</h3><p>${p}</p></a>`).join("")}
    </div>
  </div></section>

  <section class="block"><div class="wrap">
    <div class="sh"><div><h2>So'nggi yangiliklar</h2></div><a href="#/yangiliklar">Barchasi →</a></div>
    <div class="grid g3">${(news || []).slice(0, 3).map(newsCard).join("")}</div>
  </div></section>

  <section class="block"><div class="wrap">
    <div class="sh"><div><h2>Kanaldan</h2><p>Telegram kanaldagi so'nggi postlar</p></div><a href="#/postlar">Barchasi →</a></div>
    ${P.length ? `<div class="grid g3">${P.slice(0, 3).map(postCard).join("")}</div>` : tgFallback()}
  </div></section>`;
}

/* ---------- Yangiliklar ---------- */
function newsCard(n) {
  return `<article class="card">
    <div class="row"><span class="pill y">${esc(n.tag)}</span><span class="date">${fdate(n.date)}</span></div>
    <h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>
    <div class="links">${n.lib ? `<a class="m" href="#/kutubxona/${n.lib}">Kutubxonada ochish</a>` : ""}${n.src ? `<a href="${n.src[1]}" target="_blank" rel="noopener">Manba: ${esc(n.src[0])} ↗</a>` : ""}</div>
  </article>`;
}
async function newsPage() {
  const news = (await load("news")) || [];
  const tags = ["Hammasi", ...new Set(news.map(n => n.tag))];
  setTimeout(() => {
    const draw = t => { $("#nl").innerHTML = news.filter(n => t === "Hammasi" || n.tag === t).map(newsCard).join("");
      document.querySelectorAll("#nt .chip").forEach(c => c.classList.toggle("on", c.dataset.t === t)); };
    document.querySelectorAll("#nt .chip").forEach(c => c.onclick = () => draw(c.dataset.t)); draw("Hammasi");
  });
  return pageHead("YANGILIKLAR", "Yangiliklar", "Yo'l sohasidagi normativ o'zgarishlar, hukumat qarorlari va dunyo yo'l qurilishidagi muhim voqealar — manbasi bilan.") +
    `<div class="wrap"><div class="tools" id="nt">${tags.map(t => `<button class="chip" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
     <div class="grid g3" id="nl" style="margin-top:14px"></div></div>`;
}

/* ---------- Postlar ---------- */
function postCard(p) {
  const id = "p" + p.id;
  return `<article class="card post">
    ${p.photo ? `<img class="ph" loading="lazy" src="${esc(p.photo)}" alt="" onerror="this.remove()">` : ""}
    <div class="row"><span class="pill">${p.video ? "Video" : p.photo ? "Rasm" : "Post"}</span><span class="date">${fdate(p.date)}</span></div>
    <div class="tx" id="${id}">${esc(p.text)}</div>
    ${p.text && p.text.length > 260 ? `<button class="more" onclick="this.previousElementSibling.classList.toggle('full');this.textContent=this.textContent==='Yopish'?'Davomini o\\'qish':'Yopish'">Davomini o'qish</button>` : ""}
    <div class="links"><a class="m" href="https://t.me/yol_muhandis/${p.id}" target="_blank" rel="noopener">Telegramda ochish ↗</a></div>
  </article>`;
}
function tgFallback() {
  return `<div class="card"><h3>Postlar tez orada shu yerda paydo bo'ladi</h3><p>Sayt kanal postlarini avtomatik yig'ib boradi. Hozircha ularni to'g'ridan-to'g'ri kanalda o'qing.</p>
   <div class="links"><a class="m" href="https://t.me/s/yol_muhandis" target="_blank" rel="noopener">Kanalni ochish ↗</a></div></div>`;
}
async function postsPage() {
  const data = await load("posts"); const P = (data && data.posts) || [];
  setTimeout(() => {
    const q = $("#pq"); if (!q) return;
    q.oninput = () => { const s = q.value.toLowerCase().trim();
      const f = P.filter(p => !s || (p.text || "").toLowerCase().includes(s));
      $("#pl").innerHTML = f.length ? f.map(postCard).join("") : `<p class="empty">Hech narsa topilmadi.</p>`; };
    q.oninput();
  });
  return pageHead("KANAL ARXIVI", "Kanal postlari", "@yol_muhandis kanalidagi barcha postlar — qidiruv bilan. Sayt yangi postlarni avtomatik qo'shib boradi.") +
    `<div class="wrap">${P.length ? `<div class="tools"><input class="inp" id="pq" placeholder="Postlardan qidirish: asfalt, ShNQ, karyer..."></div><div class="grid g3" id="pl" style="margin-top:14px"></div>
     <p class="note">Oxirgi yangilanish: ${data.updated ? new Date(data.updated).toLocaleString("uz-UZ") : "—"}</p>` : `<div style="margin-top:24px">${tgFallback()}</div>`}</div>`;
}

/* ---------- Kutubxona ---------- */
function docCard(d) {
  const mc = d.links.some(l => l[1].includes("mc.uz"));
  return `<article class="card" id="${d.id}">
    <div class="row"><h3 style="font-size:20px;margin:0">${esc(d.code)}</h3><span class="pill">${esc(d.cat)}</span></div>
    <p style="color:var(--txt);font-weight:500">${esc(d.title)}</p>
    ${d.meta ? `<p class="note" style="margin-top:4px">${esc(d.meta)}</p>` : ""}
    ${d.facts ? `<ul class="facts">${d.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
    <div class="links">${d.links.map(l => `<a class="${l[2] ? "m" : ""}" href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}
      <a href="#/kutubxona/${d.id}" onclick="copyLink(event,'${d.id}')">🔗 Havola</a></div>
    ${mc ? `<p class="note">mc.uz saytida sertifikat ogohlantirishi chiqishi mumkin — «Davom etish» ni tanlang.</p>` : ""}
  </article>`;
}
window.copyLink = (e, id) => {
  e.preventDefault(); const u = location.origin + location.pathname + "#/kutubxona/" + id;
  try { navigator.clipboard.writeText(u); e.target.textContent = "✓ Nusxalandi"; setTimeout(() => e.target.textContent = "🔗 Havola", 1500); } catch (_) {}
};
async function libPage(sel) {
  const docs = (await load("docs")) || [];
  const cats = ["Hammasi", ...new Set(docs.map(d => d.cat))];
  let cat = "Hammasi";
  setTimeout(() => {
    const draw = () => { const s = $("#lq").value.toLowerCase().trim();
      const f = docs.filter(d => (cat === "Hammasi" || d.cat === cat) && (!s || [d.code, d.title, d.meta, ...(d.facts || [])].join(" ").toLowerCase().includes(s)));
      $("#ll").innerHTML = f.length ? f.map(docCard).join("") : `<p class="empty">Hech narsa topilmadi.</p>`;
      document.querySelectorAll("#lc .chip").forEach(c => c.classList.toggle("on", c.dataset.c === cat));
      if (sel) { const el = document.getElementById(sel); if (el) { el.classList.add("hl"); el.scrollIntoView({ behavior: "smooth", block: "center" }); } sel = null; } };
    $("#lq").oninput = draw; document.querySelectorAll("#lc .chip").forEach(c => c.onclick = () => { cat = c.dataset.c; draw(); }); draw();
  });
  return pageHead("NORMATIV KUTUBXONA", "Normativ kutubxona", "Yo'l loyihalash va qurilishida amaldagi hujjatlar. Har biri rasmiy manbaga havola bilan; asosiy raqamlar qisqacha.") +
    `<div class="wrap"><div class="tools"><input class="inp" id="lq" placeholder="Qidirish: ShNQ 2.05.02, ko'prik, laboratoriya..."></div>
     <div class="tools" id="lc" style="margin-top:8px">${cats.map(c => `<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
     <div class="grid g2" id="ll" style="margin-top:14px"></div></div>`;
}

/* ---------- Kalkulyatorlar ---------- */
const num = id => parseFloat(String($(id).value).replace(",", ".")) || 0;
const fmt = (x, d = 2) => x.toLocaleString("ru-RU", { maximumFractionDigits: d });
function calcPage() {
  setTimeout(() => {
    const a = () => { const v = num("#aL") * num("#aB") * num("#aH") / 100, m = v * num("#aR"), t = num("#aT");
      $("#aRes").innerHTML = `Hajm: <b>${fmt(v)} m³</b><br>Massa: <b>${fmt(m)} t</b><br>Reyslar soni (${fmt(t, 1)} t dan): <b>${t ? Math.ceil(m / t) : "—"}</b>`; };
    ["#aL", "#aB", "#aH", "#aR", "#aT"].forEach(i => $(i).oninput = a); a();
    const T = [["Ia yoki Ib", 14000, "Ia — 150, Ib — 120", "3,75 m, 4+ tasma"], ["II", 6000, "120", "3,75 m, 2 tasma"], ["III", 2000, "100", "3,5 m, 2 tasma"], ["IV", 200, "80", "3,0 m, 2 tasma"], ["V", 0, "60", "4,5 m, 1 tasma"]];
    const b = () => { const n = num("#bN");
      const row = n > 14000 ? T[0] : n > 6000 ? T[1] : n > 2000 ? T[2] : n > 200 ? T[3] : T[4];
      $("#bRes").innerHTML = `Toifa: <b>${row[0]}</b><br>Hisobiy tezlik (asosiy relyef): <b>${row[2]} km/soat</b><br>Harakat tasmasi: <b>${row[3]}</b><p class="note">Manba: ShNQ 2.05.02-23, 2- va 5-jadvallar. Yakuniy toifa yo'lning ahamiyatiga ham bog'liq.</p>`; };
    $("#bN").oninput = b; b();
    const c = () => { const p = num("#cP"), L = num("#cL"); $("#cRes").innerHTML = `Promille: <b>${fmt(p * 10, 1)} ‰</b><br>Burchak: <b>${fmt(Math.atan(p / 100) * 180 / Math.PI, 2)}°</b><br>${fmt(L, 0)} m da balandlik farqi: <b>${fmt(L * p / 100)} m</b>`; };
    ["#cP", "#cL"].forEach(i => $(i).oninput = c); c();
    const d = () => { const r = num("#dR"), mx = num("#dM"); const k = mx ? r / mx : 0; const t = num("#dT");
      $("#dRes").innerHTML = `Ky = <b>${fmt(k, 3)}</b><br>${t ? (k >= t ? `✅ Talab (${fmt(t, 2)}) bajarilgan` : `❌ Talabdan (${fmt(t, 2)}) past — qo'shimcha zichlash kerak`) : ""}`; };
    ["#dR", "#dM", "#dT"].forEach(i => $(i).oninput = d); d();
  });
  const F = (id, l, v) => `<label for="${id.slice(1)}">${l}</label><input class="inp" id="${id.slice(1)}" value="${v}" inputmode="decimal">`;
  return pageHead("MUHANDIS ASBOBLARI", "Kalkulyatorlar", "Obyektda tez-tez kerak bo'ladigan hisoblar. Natijalar taxminiy — loyiha hisobi o'rnini bosmaydi.") +
  `<div class="wrap"><div class="grid g2" style="margin-top:24px">
    <div class="card calc"><div class="ic">🛣</div><h3>Asfaltbeton miqdori</h3><p>Uchastka uchun hajm, massa va reyslar soni.</p>
      ${F("#aL", "Uzunlik, m", 1000)}${F("#aB", "Kenglik, m", 7)}${F("#aH", "Qatlam qalinligi, sm", 5)}${F("#aR", "Zichlangan asfaltbeton zichligi, t/m³ (laboratoriya ma'lumoti bo'yicha)", 2.4)}${F("#aT", "Bitta samosval yuki, t", 20)}
      <div class="res" id="aRes"></div></div>
    <div class="card calc"><div class="ic">📊</div><h3>Yo'l toifasini aniqlash</h3><p>Kelajakdagi harakat jadalligi bo'yicha (ShNQ 2.05.02-23).</p>
      ${F("#bN", "Jadallik, yengil avtomobilga keltirilgan, avt/sutka", 4500)}
      <div class="res" id="bRes"></div></div>
    <div class="card calc"><div class="ic">📐</div><h3>Qiyalik konvertori</h3><p>Foiz → promille → gradus va balandlik farqi.</p>
      ${F("#cP", "Qiyalik, %", 4)}${F("#cL", "Masofa, m", 250)}
      <div class="res" id="cRes"></div></div>
    <div class="card calc"><div class="ic">🧱</div><h3>Zichlash koeffitsienti (Ky)</h3><p>Joydagi quruq zichlik ÷ maksimal standart zichlik.</p>
      ${F("#dR", "Joydagi quruq zichlik, g/sm³", 1.82)}${F("#dM", "Maksimal standart zichlik, g/sm³", 1.88)}${F("#dT", "Talab qilingan Ky (loyiha bo'yicha)", 0.95)}
      <div class="res" id="dRes"></div></div>
  </div></div>`;
}

/* ---------- Testlar ---------- */
async function quizPage() {
  const Q = (await load("quiz")) || [];
  let score = 0, done = 0;
  window.ans = (i, j, btn) => {
    const box = btn.parentElement; if (box.dataset.done) return; box.dataset.done = 1; done++;
    const ok = j === Q[i].c; if (ok) score++;
    box.querySelectorAll(".opt").forEach((b, k) => { if (k === Q[i].c) b.classList.add("ok"); else if (b === btn) b.classList.add("no"); });
    box.querySelector(".exp").style.display = "block";
    $("#qs").textContent = `Natija: ${score} / ${done} (jami ${Q.length})`;
  };
  return pageHead("BILIMINGIZNI SINANG", "Testlar", "ShNQ 2.05.02-23 va yo'l qurilishi texnologiyasi bo'yicha savollar. Har yakshanba kanalda yangi 10 ta test.") +
    `<div class="wrap"><p class="pill y" id="qs" style="margin:22px 0 14px">Natija: 0 / 0 (jami ${Q.length})</p>
    <div class="grid g2">${Q.map((q, i) => `<div class="card q"><h3>${i + 1}. ${esc(q.q)}</h3>
      ${q.o.map((o, j) => `<button class="opt" onclick="ans(${i},${j},this)">${esc(o)}</button>`).join("")}
      <p class="exp">💡 ${esc(q.e)}</p></div>`).join("")}</div></div>`;
}

/* ---------- Lug'at ---------- */
async function glossPage() {
  const G = (await load("glossary")) || [];
  setTimeout(() => { const q = $("#gq"); const draw = () => { const s = q.value.toLowerCase();
    $("#gl").innerHTML = G.filter(g => !s || (g.term + g.text).toLowerCase().includes(s)).map(g => `<dt>${esc(g.term)}</dt><dd>${esc(g.text)}</dd>`).join(""); };
    q.oninput = draw; draw(); });
  return pageHead("ATAMALAR", "Lug'at", "Yo'l loyihalash va qurilishida ishlatiladigan asosiy atamalar — qisqa va sodda.") +
    `<div class="wrap"><div class="tools"><input class="inp" id="gq" placeholder="Atamani qidirish..."></div><div class="card" style="margin-top:14px"><dl class="gl" id="gl"></dl></div></div>`;
}

/* ---------- Biz haqimizda ---------- */
function aboutPage() {
  return pageHead("LOYIHA HAQIDA", "Biz haqimizda", "Avtomobil Yo'llari UZ — yo'l muhandislari uchun o'zbek tilidagi mustaqil loyiha.") +
  `<div class="wrap"><div class="grid g2" style="margin-top:24px">
    <div class="card"><h3>Maqsad</h3><p>Yo'l loyihalash va qurilishi bo'yicha ishonchli ma'lumotni o'zbek tilida, bir joyda va tushunarli shaklda berish: amaldagi normativlar, amaliy tajriba, hisob-kitob asboblari.</p></div>
    <div class="card"><h3>Telegram kanal</h3><p>Har kuni 3 ta post: ta'limiy material, tajriba, normativ, yangilik va vizual. Har yakshanba — 10 ta test.</p><div class="links"><a class="m" href="https://t.me/yol_muhandis">@yol_muhandis ↗</a></div></div>
    <div class="card"><h3>Manbalar haqida</h3><p>Normativ hujjatlar matni rasmiy manbalardan — lex.uz va Qurilish va uy-joy kommunal xo'jaligi vazirligi saytidan olinadi. Saytdagi qisqa ma'lumotlar tanishish uchun; loyihada rasmiy matnga tayaning.</p></div>
    <div class="card"><h3>Hamkorlik va takliflar</h3><p>Xato topdingizmi, hujjat yoki mavzu taklif qilmoqchimisiz? Kanal izohlarida yozing.</p><div class="links"><a class="m" href="https://t.me/yol_muhandis">Kanalga yozish ↗</a></div></div>
  </div></div>`;
}

/* ---------- Router ---------- */
const ROUTES = { "": home, yangiliklar: newsPage, postlar: postsPage, kutubxona: libPage, kalkulyatorlar: calcPage, testlar: quizPage, lugat: glossPage, haqida: aboutPage };
async function route() {
  let h = location.hash.replace(/^#\/?/, "");
  // eski havolalar: #shnq-2-05-02-23
  if (h && !h.includes("/") && !ROUTES[h]) h = "kutubxona/" + h;
  const [r, sub] = h.split("/");
  const fn = ROUTES[r] || home;
  $("#app").innerHTML = await fn(sub);
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", a.dataset.r === (ROUTES[r] ? r : "")));
  $("#menu").classList.remove("open");
  if (!sub) window.scrollTo(0, 0);
  const t = { "": "", yangiliklar: "Yangiliklar", postlar: "Postlar", kutubxona: "Kutubxona", kalkulyatorlar: "Kalkulyatorlar", testlar: "Testlar", lugat: "Lug'at", haqida: "Biz haqimizda" }[r] || "";
  document.title = (t ? t + " — " : "") + "Avtomobil Yo'llari UZ";
}
addEventListener("hashchange", route); route();
