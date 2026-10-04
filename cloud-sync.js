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
const MAX_LEN = 900000;       // حد Firestore للمستند ~1MB
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
      '<button data-act="upload">حفظ نسخة الآن</button>' +
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
  else if (act === 'upload') { await upload(false); }
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
  for (let i = 0; i < ops.length; i += 100) {
    const b = writeBatch(db);
    ops.slice(i, i + 100).forEach((fn) => fn(b));
    await b.commit();
  }
}

async function upload(force) {
  if (!uid || busy) return;
  busy = true; setStatus('جاري الحفظ…', '#e0a526');
  try {
    const old = force ? {} : JSON.parse(lsGet('cloudsync_hashes') || '{}');
    const fresh = {}, ops = []; let skipped = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (!isSynced(k)) continue;
      const v = localStorage.getItem(k);
      if (v == null) continue;
      if (v.length > MAX_LEN) { skipped++; continue; }
      const h = hash(v); fresh[k] = h;
      if (old[k] !== h) ops.push((b) => b.set(doc(db, 'users', uid, 'kv', docId(k)), { k, v, t: Date.now() }));
    }
    // مفاتيح اتمسحت محليًا → نمسحها من السحابة
    let removeKeys = Object.keys(old).filter((k) => !(k in fresh));
    if (force) {
      const snap = await getDocs(kvCol());
      removeKeys = []; snap.forEach((d) => { if (!(d.data().k in fresh)) ops.push((b) => b.delete(d.ref)); });
    }
    removeKeys.forEach((k) => ops.push((b) => b.delete(doc(db, 'users', uid, 'kv', docId(k)))));
    await commitOps(ops);
    const now = Date.now();
    await setDoc(metaRef(), { updatedAtMs: now, keys: Object.keys(fresh).length, skipped }, { merge: true });
    lsSet('cloudsync_hashes', JSON.stringify(fresh)); lsSet('cloudsync_last', String(now));
    state.msg = skipped ? 'تنبيه: ' + skipped + ' عنصر كبير جدًا (مثل صورة) لم يُحفظ.' : '';
    setStatus('تم الحفظ ✔', '#1a8a5f');
  } catch (e) {
    console.warn('cloud upload failed', e);
    setStatus('فشل الحفظ (تأكد من النت والصلاحيات)', '#c0392b');
  } finally { busy = false; }
}

async function restore() {
  if (!uid || busy) return;
  busy = true; setStatus('جاري الاسترجاع…', '#e0a526');
  try {
    const [snap, meta] = await Promise.all([getDocs(kvCol()), getDoc(metaRef())]);
    const hs = {}; suppress = true;
    snap.forEach((d) => { const { k, v } = d.data(); if (isSynced(k) && typeof v === 'string') { origSet.call(localStorage, k, v); hs[k] = hash(v); } });
    suppress = false;
    lsSet('cloudsync_hashes', JSON.stringify(hs));
    lsSet('cloudsync_last', String((meta.exists() && meta.data().updatedAtMs) || Date.now()));
    lsSet('cloudsync_auto', '1');
    location.reload();
  } catch (e) {
    suppress = false; busy = false;
    console.warn('cloud restore failed', e);
    setStatus('فشل الاسترجاع', '#c0392b');
  }
}

function schedule() {
  if (!uid || !autoOn || suppress) return;
  clearTimeout(timer); setStatus('بانتظار الحفظ…', '#e0a526');
  timer = setTimeout(() => upload(false), DEBOUNCE_MS);
}
// مراقبة أي تعديل في localStorage
Storage.prototype.setItem = function (k, v) { origSet.call(this, k, v); if (this === localStorage && !suppress && isSynced(k)) schedule(); };
Storage.prototype.removeItem = function (k) { origRemove.call(this, k); if (this === localStorage && !suppress && isSynced(k)) schedule(); };
document.addEventListener('visibilitychange', () => { if (document.hidden && timer && autoOn) { clearTimeout(timer); timer = null; upload(false); } });

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
      else if (cloudMs > last) { state.choice = 'newer'; state.open = true; setStatus('محتاج قرار', '#e0a526'); }
      else { setStatus('متزامن ✔', '#1a8a5f'); if (autoOn) schedule(); }
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
