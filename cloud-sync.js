/* نسخ احتياطي ومزامنة بيانات "عاداتي اليومية" عبر Firebase (Google Sign-In + Firestore)
   كل بيانات المتصفح (localStorage) بتتحفظ في: users/{uid}/kv/{المفتاح} */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut }
  from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDoc, setDoc, getDocs, collection, writeBatch }
  from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const configured = firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith('PASTE');

/* ---------- ما اللي بيتزامن؟ ---------- */
const EXCLUDE = new Set(['adhkar_source_cache_v1', 'prayer_times_v1', 'app-device-mode-v1']); // كاش + إعداد خاص بكل جهاز
const isSynced = (k) => k && !k.startsWith('cloudsync_') && !k.startsWith('firebase:') && !k.startsWith('firestore/') && !EXCLUDE.has(k);
const CHUNK = 300000;        // أقصى حجم للجزء الواحد (حرف): حد Firestore للمستند ~1MB
const MAX_LEN = 5000000;      // أقصى حجم لقيمة واحدة (قبل تقسيمها)
const DEBOUNCE_MS = 10000;    // الحفظ التلقائي بعد آخر تعديل بـ 10 ثواني

/* ---------- localStorage (من غير ما نفعّل الـ hook على مفاتيحنا) ---------- */
const origSet = Storage.prototype.setItem;
const origRemove = Storage.prototype.removeItem;
const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { origSet.call(localStorage, k, v); } catch (e) {} };
const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h + ':' + s.length; };

/* ---------- الحالة ---------- */
let app, auth, db, uid = null;
let autoOn = lsGet('cloudsync_auto') === '1';
let busy = false, suppress = false, timer = null;
const state = { open: false, status: 'غير مسجّل', color: '#9aa7b4', choice: null, msg: '' };

/* ---------- الواجهة ---------- */
const css = document.createElement('style');
css.textContent = `
#csBtn{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:8px;z-index:999998;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.92);box-shadow:0 2px 10px rgba(0,0,0,.2);font-size:18px;cursor:pointer;padding:0}
#csBtn i{position:absolute;bottom:2px;right:2px;width:10px;height:10px;border-radius:50%;border:2px solid #fff;background:#9aa7b4}
#csOv{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;padding:16px}
#csOv.on{display:flex}
#csBox{background:#fff;color:#23364d;width:100%;max-width:380px;border-radius:18px;padding:18px;font:15px/1.8 Tajawal,system-ui,sans-serif;direction:rtl;max-height:85vh;overflow:auto}
#csBox h3{margin:0 0 6px;font-size:18px}
#csBox p{margin:6px 0}
#csBox small{color:#6b7c8e}
#csBox button{display:block;width:100%;margin:8px 0 0;padding:11px;border:0;border-radius:12px;background:#347fc4;color:#fff;font:inherit;cursor:pointer}
#csBox button.sec{background:#eaf1f8;color:#23364d}
#csBox button.red{background:#fdecea;color:#c0392b}
#csBox label{display:flex;gap:8px;align-items:center;margin-top:10px}
`;
document.head.appendChild(css);

const btn = document.createElement('button');
btn.id = 'csBtn'; btn.type = 'button'; btn.setAttribute('aria-label', 'النسخ الاحتياطي والمزامنة');
btn.innerHTML = '☁️<i></i>';
const ov = document.createElement('div');
ov.id = 'csOv'; ov.innerHTML = '<div id="csBox"></div>';
document.body.append(btn, ov);
btn.onclick = () => { state.open = true; render(); };
ov.addEventListener('click', (e) => { if (e.target === ov) { state.open = false; render(); } });

function setStatus(text, color) {
  state.status = text; state.color = color || state.color;
  btn.querySelector('i').style.background = state.color;
  if (state.open) render();
}
const fmt = (ms) => ms ? new Date(+ms).toLocaleString('ar-EG') : '—';

function render() {
  ov.classList.toggle('on', state.open);
  if (!state.open) return;
  const box = document.getElementById('csBox');
  const u = auth && auth.currentUser;
  let h = '<h3>☁️ النسخ الاحتياطي والمزامنة</h3>';
  if (!configured) {
    h += '<p>لسه ما حطيتش إعدادات Firebase في ملف <b>firebase-config.js</b>.</p>';
  } else if (!u) {
    h += '<p>سجّل دخولك بحساب جوجل عشان بياناتك تتحفظ في السحابة وتقدر ترجّعها على أي جهاز.</p><button data-act="login">تسجيل الدخول بحساب جوجل</button>';
  } else if (state.choice) {
    h += '<p>' + (state.choice === 'first'
      ? 'لقيت نسخة محفوظة في حسابك. تعمل إيه؟'
      : 'فيه نسخة أحدث محفوظة من جهاز آخر. تعمل إيه؟') + '</p>' +
      '<button data-act="restore">استرجاع النسخة من السحابة</button>' +
      '<button class="sec" data-act="overwrite">رفع بيانات هذا الجهاز (هتستبدل نسخة السحابة)</button>' +
      '<button class="sec" data-act="ignore">تجاهل دلوقتي</button>';
  } else {
    h += '<p><b>' + (u.displayName || '') + '</b><br><small>' + (u.email || '') + '</small></p>' +
      '<p>الحالة: <b>' + state.status + '</b><br><small>آخر مزامنة: ' + fmt(lsGet('cloudsync_last')) + '</small></p>' +
      '<label><input type="checkbox" data-act="auto" ' + (autoOn ? 'checked' : '') + '> حفظ تلقائي عند أي تعديل</label>' +
      '<button data-act="upload">🔄 مزامنة الآن</button>' +
      '<button class="sec" data-act="restore">استرجاع من السحابة</button>' +
      '<button class="red" data-act="logout">تسجيل الخروج</button>';
  }
  if (state.msg) h += '<p><small>' + state.msg + '</small></p>';
  h += '<button class="sec" data-act="close">إغلاق</button>';
  box.innerHTML = h;
}
ov.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'close') { state.open = false; render(); }
  else if (act === 'login') login();
  else if (act === 'logout') { await signOut(auth); }
  else if (act === 'upload') { if (!(await pull())) await upload(false); }
  else if (act === 'overwrite') { if (confirm('نسخة السحابة هتتبدّل ببيانات هذا الجهاز. متأكد؟')) { state.choice = null; await upload(true); } }
  else if (act === 'restore') { if (confirm('بيانات هذا الجهاز هتتبدّل بنسخة السحابة والصفحة هتتحدّث. متأكد؟')) await restore(); }
  else if (act === 'ignore') { state.choice = null; autoOn = false; lsSet('cloudsync_auto', '0'); setStatus('الحفظ التلقائي متوقف', '#e0a526'); }
});
ov.addEventListener('change', (e) => {
  if (e.target.dataset.act === 'auto') {
    autoOn = e.target.checked; lsSet('cloudsync_auto', autoOn ? '1' : '0');
    if (autoOn) schedule();
  }
});

/* ---------- تسجيل الدخول ---------- */
async function login() {
  const p = new GoogleAuthProvider();
  try { await signInWithPopup(auth, p); }
  catch (e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
      try { await signInWithRedirect(auth, p); } catch (e2) { state.msg = 'فشل تسجيل الدخول: ' + e2.code; render(); }
    } else if (e.code !== 'auth/popup-closed-by-user') { state.msg = 'فشل تسجيل الدخول: ' + (e.code || e.message); render(); }
  }
}

/* ---------- رفع واسترجاع ---------- */
const metaRef = () => doc(db, 'users', uid);
const kvCol = () => collection(db, 'users', uid, 'kv');
const docId = (k) => encodeURIComponent(k);

async function commitOps(ops) {
  let b = writeBatch(db), n = 0, size = 0;
  for (const o of ops) {
    if (n && (n >= 100 || size + o.s > 3000000)) { await b.commit(); b = writeBatch(db); n = 0; size = 0; }
    o.f(b); n++; size += o.s;
  }
  if (n) await b.commit();
}

const partId = (k, i) => docId(k) + (i ? '~p' + i : '');
const split = (v) => { const a = []; for (let i = 0; i < v.length; i += CHUNK) a.push(v.slice(i, i + CHUNK)); return a.length ? a : ['']; };

async function upload(force) {
  if (!uid || busy || state.choice) return;
  busy = true; setStatus('جاري الحفظ…', '#e0a526');
  try {
    const old = force ? {} : JSON.parse(lsGet('cloudsync_hashes') || '{}');
    const oldParts = force ? {} : JSON.parse(lsGet('cloudsync_parts') || '{}');
    const fresh = {}, parts = {}, ops = []; let skipped = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (!isSynced(k)) continue;
      const v = localStorage.getItem(k);
      if (v == null) continue;
      if (v.length > MAX_LEN) { skipped++; continue; }
      const h = hash(v), ps = split(v);
      fresh[k] = h; parts[k] = ps.length;
      if (old[k] !== h) {
        ps.forEach((p, n) => ops.push({ s: p.length * 2 + 200, f: (b) => b.set(doc(db, 'users', uid, 'kv', partId(k, n)), { k, v: p, i: n, n: ps.length, t: Date.now() }) }));
        for (let n = ps.length; n < (oldParts[k] || 1); n++) ops.push({ s: 100, f: (b) => b.delete(doc(db, 'users', uid, 'kv', partId(k, n))) });
      }
    }
    // مفاتيح اتمسحت محليًا → نمسحها (وكل أجزائها) من السحابة
    Object.keys(old).filter((k) => !(k in fresh)).forEach((k) => {
      for (let n = 0; n < (oldParts[k] || 1); n++) ops.push({ s: 100, f: (b) => b.delete(doc(db, 'users', uid, 'kv', partId(k, n))) });
    });
    if (force) {
      const keep = new Set(); Object.keys(fresh).forEach((k) => { for (let n = 0; n < parts[k]; n++) keep.add(partId(k, n)); });
      const snap = await getDocs(kvCol());
      snap.forEach((d) => { if (!keep.has(d.id)) ops.push({ s: 100, f: (b) => b.delete(d.ref) }); });
    }
    await commitOps(ops);
    const now = Date.now();
    await setDoc(metaRef(), { updatedAtMs: now, keys: Object.keys(fresh).length, skipped }, { merge: true });
    lsSet('cloudsync_hashes', JSON.stringify(fresh)); lsSet('cloudsync_parts', JSON.stringify(parts)); lsSet('cloudsync_last', String(now));
    state.msg = skipped ? 'تنبيه: ' + skipped + ' عنصر أكبر من 5 ميجا لم يُحفظ.' : '';
    setStatus('تم الحفظ ✔', '#1a8a5f');
  } catch (e) {
    console.warn('cloud upload failed', e);
    state.msg = 'السبب: ' + (e && (e.code || e.message) || e);
    setStatus('فشل الحفظ (تأكد من النت والصلاحيات)', '#c0392b');
  } finally { busy = false; }
}

async function restore() {
  if (!uid || busy) return;
  busy = true; setStatus('جاري الاسترجاع…', '#e0a526');
  try {
    const [snap, meta] = await Promise.all([getDocs(kvCol()), getDoc(metaRef())]);
    const hs = {}, ps = {}, grp = {}; suppress = true;
    snap.forEach((d) => { const x = d.data(); if (!isSynced(x.k) || typeof x.v !== 'string') return; const g = (grp[x.k] = grp[x.k] || { n: 1, p: [] }); g.p[x.i || 0] = x.v; if (x.n) g.n = x.n; });
    Object.keys(grp).forEach((k) => {
      const g = grp[k]; let ok = true;
      for (let i = 0; i < g.n; i++) if (typeof g.p[i] !== 'string') ok = false;
      if (!ok) { console.warn('incomplete parts for', k); return; }
      const v = g.p.join(''); origSet.call(localStorage, k, v); hs[k] = hash(v); ps[k] = g.n;
    });
    suppress = false;
    lsSet('cloudsync_hashes', JSON.stringify(hs)); lsSet('cloudsync_parts', JSON.stringify(ps));
    lsSet('cloudsync_last', String((meta.exists() && meta.data().updatedAtMs) || Date.now()));
    lsSet('cloudsync_auto', '1');
    location.reload();
  } catch (e) {
    suppress = false; busy = false;
    console.warn('cloud restore failed', e);
    setStatus('فشل الاسترجاع', '#c0392b');
  }
}

function assemble(snap) {
  const grp = {}, out = {};
  snap.forEach((d) => { const x = d.data(); if (!isSynced(x.k) || typeof x.v !== 'string') return; const g = (grp[x.k] = grp[x.k] || { n: 1, p: [] }); g.p[x.i || 0] = x.v; if (x.n) g.n = x.n; });
  Object.keys(grp).forEach((k) => { const g = grp[k]; for (let i = 0; i < g.n; i++) if (typeof g.p[i] !== 'string') return; out[k] = { v: g.p.join(''), n: g.n }; });
  return out;
}

/* دمج ذكي: ياخد من السحابة اللي اتغيّر من جهاز تاني، ويسيب تعديلاتك المحلية */
async function pull() {
  if (!uid || busy) return 0;
  busy = true; setStatus('جاري المزامنة…', '#e0a526');
  let applied = 0;
  try {
    const [snap, meta] = await Promise.all([getDocs(kvCol()), getDoc(metaRef())]);
    const cloud = assemble(snap), base = JSON.parse(lsGet('cloudsync_hashes') || '{}'), ps = JSON.parse(lsGet('cloudsync_parts') || '{}');
    suppress = true;
    Object.keys(cloud).forEach((k) => {
      const hc = hash(cloud[k].v);
      if (hc === base[k]) return;                                   // مفيش جديد في السحابة
      const local = localStorage.getItem(k);
      if (local === null || hash(local) === base[k]) { origSet.call(localStorage, k, cloud[k].v); base[k] = hc; ps[k] = cloud[k].n; applied++; }
      else if (hash(local) === hc) { base[k] = hc; ps[k] = cloud[k].n; }
    });
    suppress = false;
    lsSet('cloudsync_hashes', JSON.stringify(base)); lsSet('cloudsync_parts', JSON.stringify(ps));
    if (meta.exists()) lsSet('cloudsync_last', String(meta.data().updatedAtMs || Date.now()));
    setStatus(applied ? 'تم التحديث ✔' : 'متزامن ✔', '#1a8a5f');
  } catch (e) {
    suppress = false; console.warn('cloud pull failed', e);
    state.msg = 'السبب: ' + (e && (e.code || e.message) || e); setStatus('فشلت المزامنة', '#c0392b');
  } finally { busy = false; }
  if (applied) location.reload();
  return applied;
}

function schedule() {
  if (!uid || !autoOn || suppress || state.choice) return;
  clearTimeout(timer); setStatus('بانتظار الحفظ…', '#e0a526');
  timer = setTimeout(() => upload(false), DEBOUNCE_MS);
}
// مراقبة أي تعديل في localStorage
Storage.prototype.setItem = function (k, v) { origSet.call(this, k, v); if (this === localStorage && !suppress && isSynced(k)) schedule(); };
Storage.prototype.removeItem = function (k) { origRemove.call(this, k); if (this === localStorage && !suppress && isSynced(k)) schedule(); };
document.addEventListener('visibilitychange', () => { if (document.hidden && timer && autoOn) { clearTimeout(timer); timer = null; upload(false); } });

/* لما ترجع للتطبيق من الخلفية: هات اللي اتغيّر من الجهاز التاني */
let lastPull = Date.now();
document.addEventListener('visibilitychange', () => { if (!document.hidden && uid && !state.choice && Date.now() - lastPull > 30000) { lastPull = Date.now(); pull(); } });

/* ---------- بعد تسجيل الدخول ---------- */
async function afterLogin() {
  try {
    setStatus('جاري الفحص…', '#e0a526');
    const meta = await getDoc(metaRef());
    const last = +lsGet('cloudsync_last') || 0;
    if (!meta.exists()) {                       // أول مرة: نرفع بيانات الجهاز
      autoOn = true; lsSet('cloudsync_auto', '1');
      await upload(true); state.open = true; state.msg = 'تم رفع بياناتك لأول مرة ✔'; render();
    } else {
      const cloudMs = meta.data().updatedAtMs || 0;
      if (!last) { state.choice = 'first'; state.open = true; setStatus('محتاج قرار', '#e0a526'); }
      else { const n = await pull(); if (!n && autoOn) schedule(); }
    }
  } catch (e) {
    console.warn('cloud check failed', e);
    setStatus('تعذّر الاتصال بالسحابة', '#c0392b');
  }
  render();
}

/* ---------- تشغيل ---------- */
if (configured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  try { db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch (e) { db = getFirestore(app); }
  getRedirectResult(auth).catch((e) => { state.msg = 'فشل تسجيل الدخول: ' + e.code; });
  onAuthStateChanged(auth, (u) => {
    uid = u ? u.uid : null; state.choice = null;
    if (u) afterLogin(); else { setStatus('غير مسجّل', '#9aa7b4'); render(); }
  });
} else { setStatus('الإعدادات ناقصة', '#9aa7b4'); }
