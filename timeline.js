/* v14: مهام بتصميم ثلاثي الأبعاد في الرئيسية + سجل المهام + صفحة التقويم والإجازات */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var DAYP='tl_day_',REPK='tl_repeat_v1',QK='timeline_quick_v1',HOFF='hijri_offset_v1';
var COLORS=['#f2a09b','#5f9bd5','#3b5f8a','#b04a78','#7cc152','#f7b500','#8e6fd8','#26a69a'];
var CATS=['عمل','دراسة','صحة','عبادة','بيت','رياضة','مال','شخصي'];
var EMO={'😀':'😀😃😄😁😆😅😂🤣😊😇🙂😉😌😍🥰😘😋😛😜🤪🤓😎🤩🥳😏😐🙄😬🤔🤭🤫🤗😱😴🤤😷🤒🤕🥵🥶😢😭😡🤯😤🥺😇',
'👋':'👋🤚🖐️✋👌✌️🤞🤟🤘🤙👈👉👆👇☝️👍👎👊✊👏🙌🤝🙏💪🧠👀👂👃👣🧍🏃🚶💃🕺🧘🏋️🚴🏊👨‍💻👩‍💻👨‍🏫👩‍⚕️👨‍👩‍👧👶🧒👨👩🧓',
'🐶':'🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🦆🦉🦄🐴🐝🦋🐢🐍🐬🐳🐟🐑🐪🐘🦒🌿🌱🌲🌳🌴🌵🌻🌼🌷🌹🌸🍀🍁',
'🍔':'🍏🍎🍊🍋🍌🍉🍇🍓🍒🥝🥑🥕🌽🍞🥐🧀🥚🍳🥞🍗🍖🍔🍟🍕🌯🥗🍝🍜🍚🍣🍤🍦🍩🍪🎂🍫☕🍵🥤💧🍽️',
'⚽':'⚽🏀🏈⚾🎾🏐🏓🏸🥊🎯🎮🎲🎸🎹🎤🎧🎨🎬📷🏆🥇🎖️🏅🎁🎉🎊🎈🧩♟️🎳🏹⛺🎣',
'🚗':'🚗🚕🚌🚑🚒🚚🚲🛵🏍️🚆✈️🚀🛳️⛵🏠🏡🏢🏫🏥🏦🕌🕋⛪🏖️🏔️🌍🗺️🧳⏰📅🌙☀️⭐🌧️❄️🔥',
'💡':'💡📱💻🖥️⌨️🖨️📞☎️📺📻🔋🔌💰💳💵🧾📦📝📖📚📓✏️🖊️📌📎✂️🔑🔒🔔🧹🧺🛒🛠️🧪🩺💊🩹📧✉️📈📉📊🗂️📁',
'❤️':'❤️🧡💛💚💙💜🖤🤍💔💕💖✨💫🌟💯✅❌⚠️❗❓➕➖➡️🔁🔄♻️🆗🔝🕌📿🤲☪️🌙🕋'};
(function(){for(var k in EMO)EMO[k]=EMO[k].match(/\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu)||[]})();
var WD=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],WDL=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
var MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
var HMON=['','محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
function pad(n){return (n<10?'0':'')+n}
function dk(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function pd(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2],12)}
function addD(d,n){var x=new Date(d);x.setDate(x.getDate()+n);x.setHours(12,0,0,0);return x}
function today(){var d=new Date();d.setHours(12,0,0,0);return d}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function J(k,def){try{var v=JSON.parse(localStorage.getItem(k));return v==null?def:v}catch(e){return def}}
function W(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){toastMsg('تعذّر الحفظ: مساحة الجهاز ممتلئة')}}
function toastMsg(t){if(typeof toast==='function')toast(t);else alert(t)}
function uid(){return 't'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function mins(t){if(!t)return null;var p=t.split(':');return (+p[0])*60+(+p[1])}
function hm(m){m=((m%1440)+1440)%1440;return pad(Math.floor(m/60))+':'+pad(m%60)}
function nz(n){return Number(n).toLocaleString('ar-EG').replace(/٬/g,'')}
function mname(k){var p=k.split('-');return MON[+p[1]-1]+' '+p[0]}

/* ---------- هجري ---------- */
var hOff=+J(HOFF,0)||0,hCache={};
function hijri(d){var x=addD(d,hOff),k=dk(x);if(hCache[k])return hCache[k];var r={d:0,m:0,y:0};try{new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(x).forEach(function(p){if(p.type==='day')r.d=+p.value;if(p.type==='month')r.m=+p.value;if(p.type==='year')r.y=+p.value})}catch(e){}return hCache[k]=r}
function hText(d){var h=hijri(d);return h.d?nz(h.d)+' '+HMON[h.m]+' '+nz(h.y):''}

/* ---------- بيانات المهام ---------- */
function rep(){var r=J(REPK,null);if(!r||typeof r!=='object')r={};r.items=r.items||[];r.done=r.done||{};r.notes=r.notes||{};r.skip=r.skip||{};return r}
function mk(x,date,isRep,r){var k=x.id+'|'+date;return {id:x.id,title:x.title,icon:x.icon,color:x.color,s:x.s||'',e:x.e||'',cat:x.cat||'',note:isRep?(r.notes[k]||''):(x.note||''),done:isRep?!!r.done[k]:!!x.done,rep:isRep,date:date}}
function dayItems(d){var k=dk(d),o=J(DAYP+k,{t:[]}),r=rep(),out=(o.t||[]).map(function(x){return mk(x,k,false,r)});
  r.items.forEach(function(x){if(x.from<=k&&!(x.until&&k>x.until)&&!r.skip[x.id+'|'+k])out.push(mk(x,k,true,r))});
  out.sort(function(a,b){var A=mins(a.s),B=mins(b.s);if(A==null&&B==null)return 0;if(A==null)return -1;if(B==null)return 1;return A-B});return out}
function strip(x){return {id:x.id,title:x.title,icon:x.icon,color:x.color,s:x.s||'',e:x.e||'',cat:x.cat||'',note:x.note||'',done:!!x.done}}
function saveDay(k,arr){if(arr.length)W(DAYP+k,{t:arr.map(strip)});else try{localStorage.removeItem(DAYP+k)}catch(e){}}
function setDone(it,v){if(it.rep){var r=rep();if(v)r.done[it.id+'|'+it.date]=1;else delete r.done[it.id+'|'+it.date];W(REPK,r)}else{var o=J(DAYP+it.date,{t:[]});(o.t||[]).forEach(function(x){if(x.id===it.id)x.done=v});W(DAYP+it.date,o)}}
function setNote(it,text){text=(text||'').trim();if(it.rep){var r=rep(),k=it.id+'|'+it.date;if(text)r.notes[k]=text;else delete r.notes[k];W(REPK,r)}else{var o=J(DAYP+it.date,{t:[]});(o.t||[]).forEach(function(x){if(x.id===it.id)x.note=text});W(DAYP+it.date,o)}}
function removeItem(it){if(it.rep){var r=rep();r.items=r.items.filter(function(x){return x.id!==it.id});W(REPK,r)}else{var o=J(DAYP+it.date,{t:[]});saveDay(it.date,(o.t||[]).filter(function(x){return x.id!==it.id}))}}
function addOne(date,x){var o=J(DAYP+date,{t:[]}),a=o.t||[];a.push(strip(x));saveDay(date,a)}
function upsert(old,n){
  if(old)removeItem(old);
  if(n.rep){var r=rep(),from=n.date;if(old&&old.rep){var prev=J(REPK,{items:[]}).items;/* نحافظ على تاريخ البداية الأصلي */var f=(old._from)||from;from=f}r.items.push({id:n.id,title:n.title,icon:n.icon,color:n.color,s:n.s,e:n.e,cat:n.cat,from:from});W(REPK,r);setNote({id:n.id,rep:true,date:n.date},n.note)}
  else addOne(n.date,{id:n.id,title:n.title,icon:n.icon,color:n.color,s:n.s,e:n.e,cat:n.cat,note:n.note,done:old&&!old.rep?old.done:false})}
function postpone(it,to){if(to===it.date)return;var copy={id:it.rep?uid():it.id,title:it.title,icon:it.icon,color:it.color,s:it.s,e:it.e,cat:it.cat,note:it.note,done:false};
  if(it.rep){var r=rep();r.skip[it.id+'|'+it.date]=1;W(REPK,r)}else removeItem(it);addOne(to,copy)}
function fromOf(id){var f=rep().items.filter(function(x){return x.id===id})[0];return f&&f.from}
function quick(){var q=J(QK,null);if(!q){q=[{icon:'📞',title:'صلة رحم',color:COLORS[4]},{icon:'🗓️',title:'خطّط ليوم الغد',color:COLORS[0]},{icon:'📖',title:'ورد القرآن',color:COLORS[5]}];W(QK,q)}return q}

/* ---------- نوافذ صغيرة ---------- */
function over(id,html){var o=document.createElement('div');o.className='tls-over';o.id=id;o.hidden=true;o.innerHTML='<div class="tls-box" dir="rtl">'+html+'</div>';document.body.appendChild(o);o.addEventListener('click',function(e){if(e.target===o)o.hidden=true});return o}
var sheet=over('tlSheet','<h3 id="tlsHead">مهمة جديدة</h3><input id="tlsTitle" maxlength="60" placeholder="اسم المهمة..." autocomplete="off"><div class="tls-lbl">التصنيف (اختياري)</div><input id="tlsCat" maxlength="20" placeholder="مثال: عمل، صحة..." autocomplete="off"><div class="tls-chips" id="tlsCats"></div><div class="tls-lbl">الأيقونة</div><div class="tls-row"><button type="button" class="tls-ic" id="tlsIc">⭐</button><input id="tlsIcIn" maxlength="4" class="tls-icin" placeholder="اكتب إيموجي"></div><div class="tls-etabs" id="tlsTabs"></div><div class="tls-grid" id="tlsGrid"></div><div class="tls-lbl">اللون</div><div class="tls-colors" id="tlsColors"></div><div id="tlsTimeBox"><div class="tls-lbl">الوقت</div><div class="tls-times"><label>من<input type="time" id="tlsS"></label><label>إلى<input type="time" id="tlsE"></label></div><div class="tls-chips" id="tlsDur"></div></div><div id="tlsNoteBox"><div class="tls-lbl">ملاحظة</div><textarea id="tlsNote" rows="2" maxlength="500" placeholder="تفاصيل أو ملاحظة على المهمة..."></textarea></div><label class="tls-chk" id="tlsRepWrap"><input type="checkbox" id="tlsRep"> تتكرر كل يوم</label><div class="tls-act"><button type="button" class="tls-save" id="tlsSave">حفظ</button><button type="button" class="tls-cancel" id="tlsCancel">إلغاء</button><button type="button" class="tls-del" id="tlsDel">🗑️ حذف</button></div>');
var SH={old:null,date:null,mode:'task',icon:'⭐',color:COLORS[0],tab:'😀'};
function setIcon(e){SH.icon=e;$('tlsIc').textContent=e;$('tlsIcIn').value=''}
function setColor(c){SH.color=c;[].forEach.call($('tlsColors').children,function(b){b.classList.toggle('on',b.dataset.c===c)})}
function grid(){var g=$('tlsGrid');g.innerHTML=EMO[SH.tab].map(function(e){return '<button type="button">'+e+'</button>'}).join('');[].forEach.call($('tlsTabs').children,function(b){b.classList.toggle('on',b.dataset.t===SH.tab)})}
(function(){$('tlsTabs').innerHTML=Object.keys(EMO).map(function(k){return '<button type="button" data-t="'+k+'">'+k+'</button>'}).join('');$('tlsTabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b){SH.tab=b.dataset.t;grid()}});$('tlsGrid').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setIcon(b.textContent)});
  $('tlsColors').innerHTML=COLORS.map(function(c){return '<button type="button" data-c="'+c+'" style="background:'+c+'"></button>'}).join('');$('tlsColors').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setColor(b.dataset.c)});
  $('tlsCats').innerHTML=CATS.map(function(c){return '<button type="button">'+c+'</button>'}).join('');$('tlsCats').addEventListener('click',function(e){var b=e.target.closest('button');if(b)$('tlsCat').value=b.textContent});
  $('tlsDur').innerHTML=[['١٥ د',15],['٣٠ د',30],['ساعة',60],['ساعتين',120]].map(function(d){return '<button type="button" data-m="'+d[1]+'">'+d[0]+'</button>'}).join('');$('tlsDur').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var s=mins($('tlsS').value);if(s==null){var n=new Date();s=Math.ceil((n.getHours()*60+n.getMinutes())/5)*5;$('tlsS').value=hm(s)}$('tlsE').value=hm(s+(+b.dataset.m))});
  $('tlsIcIn').addEventListener('input',function(){var m=this.value.match(/\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/u);if(m){SH.icon=m[0];$('tlsIc').textContent=m[0]}})})();
function openSheet(o){o=o||{};SH.old=o.item||null;SH.date=o.date||dk(tlDate);SH.mode=o.mode||'task';var it=o.item||{},q=SH.mode==='quick';
  var d=pd(SH.date);$('tlsHead').textContent=q?'اختصار سريع جديد':(it.id?'تعديل المهمة':'مهمة جديدة')+' — '+nz(d.getDate())+' '+MON[d.getMonth()];
  $('tlsTitle').value=it.title||o.title||'';$('tlsCat').value=it.cat||'';setIcon(it.icon||o.icon||'⭐');setColor(it.color||o.color||COLORS[Math.floor(Math.random()*COLORS.length)]);SH.tab='😀';grid();
  $('tlsS').value=it.s||o.s||'';$('tlsE').value=it.e||o.e||'';$('tlsNote').value=it.note||'';$('tlsRep').checked=!!it.rep;
  $('tlsTimeBox').style.display=$('tlsNoteBox').style.display=$('tlsRepWrap').style.display=$('tlsCats').style.display=q?'none':'';$('tlsCat').previousElementSibling.style.display=$('tlsCat').style.display=q?'none':'';
  $('tlsDel').style.display=it.id?'':'none';sheet.hidden=false;setTimeout(function(){$('tlsTitle').focus()},60)}
$('tlsCancel').onclick=function(){sheet.hidden=true};
$('tlsSave').onclick=function(){var t=$('tlsTitle').value.trim();if(!t){$('tlsTitle').focus();return toastMsg('اكتب اسم المهمة الأول')}
  if(SH.mode==='quick'){var q=quick();q.push({icon:SH.icon,title:t,color:SH.color});W(QK,q);sheet.hidden=true;refresh();return}
  var s=$('tlsS').value,e=$('tlsE').value;if(s&&e&&mins(e)<=mins(s))return toastMsg('وقت النهاية لازم يبقى بعد البداية');
  var old=SH.old;if(old&&old.rep)old._from=fromOf(old.id);
  upsert(old,{id:old?old.id:uid(),title:t,icon:SH.icon,color:SH.color,s:s,e:e,cat:$('tlsCat').value.trim(),note:$('tlsNote').value.trim(),rep:$('tlsRep').checked,date:old&&!old.rep?old.date:SH.date});
  sheet.hidden=true;refresh()};
$('tlsDel').onclick=function(){var it=SH.old;if(!it)return;if(!confirm(it.rep?'دي مهمة متكررة، هتتحذف من كل الأيام. تكمل؟':'حذف المهمة دي؟'))return;removeItem(it);sheet.hidden=true;refresh()};
/* ملاحظة */
var noteSh=over('tlNoteSh','<h3 id="tlnHead">ملاحظة</h3><textarea id="tlnText" rows="5" maxlength="500" placeholder="اكتب ملاحظتك على المهمة..."></textarea><div class="tls-act"><button type="button" class="tls-save" id="tlnSave">حفظ</button><button type="button" class="tls-cancel" id="tlnCancel">إلغاء</button></div>');
var NS=null;function openNote(it){NS=it;$('tlnHead').textContent='📝 ملاحظة: '+it.title;$('tlnText').value=it.note||'';noteSh.hidden=false;setTimeout(function(){$('tlnText').focus()},60)}
$('tlnCancel').onclick=function(){noteSh.hidden=true};$('tlnSave').onclick=function(){if(NS)setNote(NS,$('tlnText').value);noteSh.hidden=true;refresh()};
/* تأجيل */
var postSh=over('tlPostSh','<h3 id="tlpHead">⏭ تأجيل المهمة</h3><div class="tls-quickd" id="tlpQ"></div><label class="tls-lbl">أو اختر يوم تاني<input type="date" id="tlpDate"></label><div class="tls-act"><button type="button" class="tls-save" id="tlpSave">تأجيل</button><button type="button" class="tls-cancel" id="tlpCancel">إلغاء</button></div>');
var PS=null;function openPost(it){PS=it;$('tlpHead').textContent='⏭ تأجيل: '+it.title;var base=pd(it.date),opts=[['بكرة',1],['بعد بكرة',2],['بعد أسبوع',7]];$('tlpQ').innerHTML=opts.map(function(o){var d=addD(base,o[1]);return '<button type="button" data-d="'+dk(d)+'"><b>'+o[0]+'</b><small>'+WDL[d.getDay()]+' '+nz(d.getDate())+' '+MON[d.getMonth()]+'</small></button>'}).join('');$('tlpDate').value=dk(addD(base,1));postSh.hidden=false}
$('tlpQ').addEventListener('click',function(e){var b=e.target.closest('button');if(b)$('tlpDate').value=b.dataset.d;[].forEach.call($('tlpQ').children,function(x){x.classList.toggle('on',x===b)})});
$('tlpCancel').onclick=function(){postSh.hidden=true};$('tlpSave').onclick=function(){var to=$('tlpDate').value;if(!to||!PS)return;postpone(PS,to);postSh.hidden=true;toastMsg('اتأجلت لـ '+nz(pd(to).getDate())+' '+MON[pd(to).getMonth()]);refresh()};

/* ---------- الرئيسية: هيرو ثلاثي الأبعاد + قائمة المهام ---------- */
var ART='<svg class="th-svg" viewBox="0 0 400 215" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><linearGradient id="gHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fdc5a"/><stop offset="1" stop-color="#3f9d3a"/></linearGradient><linearGradient id="gHill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc24a"/><stop offset="1" stop-color="#2f8a36"/></linearGradient><linearGradient id="gs0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d6" stop-opacity=".92"/><stop offset="1" stop-color="#ffe9a8" stop-opacity=".55"/></linearGradient><linearGradient id="gs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9f5c9" stop-opacity=".92"/><stop offset="1" stop-color="#46d96e" stop-opacity=".55"/></linearGradient><linearGradient id="gs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".92"/><stop offset="1" stop-color="#3fb3ff" stop-opacity=".55"/></linearGradient><linearGradient id="gs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd0b0" stop-opacity=".92"/><stop offset="1" stop-color="#ff8a3d" stop-opacity=".55"/></linearGradient><linearGradient id="gs4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8" stop-opacity=".92"/><stop offset="1" stop-color="#ffc22e" stop-opacity=".55"/></linearGradient></defs><g fill="#fff" opacity=".85"><ellipse cx="60" cy="22" rx="34" ry="10"/><ellipse cx="80" cy="15" rx="20" ry="9"/><ellipse cx="330" cy="30" rx="28" ry="8" opacity=".7"/></g><path d="M-10 215V170Q70 142 150 158T300 150T410 164V215Z" fill="url(#gHill2)" opacity=".9"/><path d="M-10 215V190Q90 166 190 184T410 180V215Z" fill="url(#gHill)"/><g stroke="#fff" stroke-opacity=".92" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M192 98l-2 24M190 122l-11 24M190 122l12 12 4 13M192 103l-14 12M192 103l15 6"/></g><circle cx="193" cy="86" r="10" fill="#fff" fill-opacity=".95"/><ellipse cx="190" cy="150" rx="20" ry="3" fill="#0b4a86" opacity=".18"/><g><rect x="128" y="181" width="92" height="34" rx="7" fill="url(#gs0)" stroke="#fff" stroke-opacity=".85" stroke-width="1.4"/><rect x="128" y="210" width="92" height="6" rx="3" fill="#ffe9a8" opacity=".7"/><path d="M128 183h92v13c-30 8-62 8-92 0z" fill="#fff" opacity=".32"/><text x="174" y="203" text-anchor="middle" font-size="16" font-weight="800" fill="#0b2a4a" stroke="#fff" stroke-opacity=".55" stroke-width=".6" style="font-family:Tajawal,Tahoma,sans-serif">رؤية</text></g><g><rect x="170" y="147" width="92" height="34" rx="7" fill="url(#gs1)" stroke="#fff" stroke-opacity=".85" stroke-width="1.4"/><rect x="170" y="176" width="92" height="6" rx="3" fill="#46d96e" opacity=".7"/><path d="M170 149h92v13c-30 8-62 8-92 0z" fill="#fff" opacity=".32"/><text x="216" y="169" text-anchor="middle" font-size="16" font-weight="800" fill="#0b2a4a" stroke="#fff" stroke-opacity=".55" stroke-width=".6" style="font-family:Tajawal,Tahoma,sans-serif">هدف</text></g><g><rect x="212" y="113" width="92" height="34" rx="7" fill="url(#gs2)" stroke="#fff" stroke-opacity=".85" stroke-width="1.4"/><rect x="212" y="142" width="92" height="6" rx="3" fill="#3fb3ff" opacity=".7"/><path d="M212 115h92v13c-30 8-62 8-92 0z" fill="#fff" opacity=".32"/><text x="258" y="135" text-anchor="middle" font-size="16" font-weight="800" fill="#0b2a4a" stroke="#fff" stroke-opacity=".55" stroke-width=".6" style="font-family:Tajawal,Tahoma,sans-serif">خطة</text></g><g><rect x="254" y="79" width="92" height="34" rx="7" fill="url(#gs3)" stroke="#fff" stroke-opacity=".85" stroke-width="1.4"/><rect x="254" y="108" width="92" height="6" rx="3" fill="#ff8a3d" opacity=".7"/><path d="M254 81h92v13c-30 8-62 8-92 0z" fill="#fff" opacity=".32"/><text x="300" y="101" text-anchor="middle" font-size="16" font-weight="800" fill="#0b2a4a" stroke="#fff" stroke-opacity=".55" stroke-width=".6" style="font-family:Tajawal,Tahoma,sans-serif">عمل</text></g><g><rect x="296" y="45" width="92" height="34" rx="7" fill="url(#gs4)" stroke="#fff" stroke-opacity=".85" stroke-width="1.4"/><rect x="296" y="74" width="92" height="6" rx="3" fill="#ffc22e" opacity=".7"/><path d="M296 47h92v13c-30 8-62 8-92 0z" fill="#fff" opacity=".32"/><text x="342" y="67" text-anchor="middle" font-size="16" font-weight="800" fill="#0b2a4a" stroke="#fff" stroke-opacity=".55" stroke-width=".6" style="font-family:Tajawal,Tahoma,sans-serif">نجاح</text></g><g fill="#ffd54a"><path d="M118 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><path d="M378 18l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z"/></g></svg>';
var tlDate=today(),editQ=false,home=$('homePage'),legacy=null;
if(home){
  var old=$('dateRow');legacy=old&&old.closest('.calendar');
  var hero=document.createElement('section');hero.className='th-hero';hero.id='thHero';
  hero.innerHTML='<div class="th-top" id="thTop"></div><div class="th-mid"><div class="th-wis" id="thWis"><b>💡 حكمة اليوم</b><span id="thWisT"></span></div><div class="th-ring" id="thRing" style="--p:0"><div class="th-ring-in"><b id="thPct">٠٪</b><small>إنجاز المهام</small></div></div></div><div class="th-img"><div class="th-slides" id="thSlides" dir="ltr"><div class="th-sl k"><img src="hero2.jpg" alt="مفتاح النجاح" draggable="false"></div><div class="th-sl c"><img src="hero.jpg" alt="منطقة الراحة مقابل منطقة النمو" draggable="false"></div></div><div class="th-dots" id="thDots"><i class="on"></i><i></i></div></div>';
  var insp0=home.querySelector('.inspiration');var wel=home.querySelector('.welcome');if(wel){wel.parentNode.insertBefore(hero,wel);$('thTop').appendChild(wel)}else home.insertBefore(hero,home.firstChild);
  var insp=home.querySelector('.inspiration');if(insp){var w=insp.querySelector('.wisdom');if(w)w.style.display='none';home.insertBefore(insp,home.firstChild);insp.classList.add('th-verse')}
  var box=document.createElement('div');box.id='legacyHome';box.hidden=true;
  var sec=document.createElement('section');sec.className='tl';sec.id='tlSection';
  sec.innerHTML='<div class="tl-handle"></div><div class="tl-week" id="tlWeek"></div><div class="tl-hrow"><div><div class="tl-title" id="tlTitle"></div><div class="tl-sub" id="tlSub"></div></div><div class="tl-nav"><button type="button" id="tlPrev" aria-label="الأسبوع السابق">›</button><button type="button" id="tlToday">اليوم</button><button type="button" id="tlNext" aria-label="الأسبوع التالي">‹</button><button type="button" id="tlLogBtn" class="tl-logb">🗂️ سجل</button></div></div><div class="tl-quick" id="tlQuick"></div><div class="tl-prog" id="tlProg"></div><div class="tl-list" id="tlList"></div><button type="button" class="tl-add" id="tlAdd">＋ إضافة مهمة</button>';
  hero.parentNode.insertBefore(sec,hero.nextSibling);if(legacy)box.appendChild(legacy);var mood=home.querySelector('.mood');if(mood)box.appendChild(mood);
  var tabs=home.querySelector('.tabs');if(tabs){box.appendChild(tabs);['tasksPanel','historyPanel'].forEach(function(id){var e=$(id);if(e)box.appendChild(e)})}
  home.appendChild(box)}
(function(){var s=$('thSlides'),dt=$('thDots');if(!s||!dt)return;s.addEventListener('scroll',function(){var i=Math.round(s.scrollLeft/Math.max(1,s.clientWidth));[].forEach.call(dt.children,function(x,k){x.classList.toggle('on',k===i)})},{passive:true});[].forEach.call(dt.children,function(x,k){x.onclick=function(){s.scrollTo({left:k*s.clientWidth,behavior:'smooth'})}})})();
function weekStart(d){var x=new Date(d);x.setDate(x.getDate()-((x.getDay()+1)%7));x.setHours(12,0,0,0);return x}
function selectDay(d){tlDate=d;try{selectedDate=new Date(d);if(typeof renderMood==='function')renderMood();if(typeof renderNotes==='function')renderNotes()}catch(e){}refresh()}
function dots(items){var h='';items.slice(0,3).forEach(function(i){h+='<i style="background:'+i.color+'"></i>'});return h}
function renderWeek(){var w=$('tlWeek');if(!w)return;var st=weekStart(tlDate),h='',td=dk(today());
  for(var i=0;i<7;i++){var d=addD(st,i),k=dk(d),it=dayItems(d),all=it.length&&it.every(function(x){return x.done});h+='<button type="button" class="tl-day'+(k===dk(tlDate)?' sel':'')+(k===td?' now':'')+'" data-d="'+k+'"><span class="tl-num">'+nz(d.getDate())+'</span><span class="tl-wd">'+WD[d.getDay()]+'</span><span class="tl-dots">'+(all?'<b class="ok">✓</b>':dots(it))+'</span></button>'}
  w.innerHTML=h;var isT=dk(tlDate)===td;$('tlTitle').textContent=isT?'النهاردة':WDL[tlDate.getDay()];$('tlSub').textContent=nz(tlDate.getDate())+' '+MON[tlDate.getMonth()]+' '+nz(tlDate.getFullYear())+' · '+hText(tlDate)}
function nowMin(){var n=new Date();return n.getHours()*60+n.getMinutes()}
function renderList(){var l=$('tlList');if(!l)return;var items=dayItems(tlDate),isT=dk(tlDate)===dk(today()),nm=nowMin(),h='';
  var done=items.filter(function(x){return x.done}).length,pc=items.length?Math.round(done/items.length*100):0;
  $('tlProg').innerHTML=items.length?'<div class="tl-bar"><i style="width:'+pc+'%"></i></div><span>أنجزت '+nz(done)+' من '+nz(items.length)+(done===items.length?' 🎉':'')+'</span>':'';
  var ring=$('thRing');if(ring){ring.style.setProperty('--p',pc);$('thPct').textContent=nz(pc)+'٪';ring.title=items.length?'أنجزت '+done+' من '+items.length:'مفيش مهام'}
  if(!items.length)h='<div class="tl-empty"><div class="tl-empty-ic">🌟</div>مفيش مهام اليوم ده.<br>اضغط ＋ أو اختصار من فوق وابدأ يومك</div>';
  items.forEach(function(x){var s=mins(x.s),e=mins(x.e),dur=(s!=null&&e!=null)?e-s:null,nowIn=isT&&s!=null&&e!=null&&nm>=s&&nm<e;
    var top=x.cat||(x.s?(x.s+(x.e?'–'+x.e:'')):'طوال اليوم');var sub=nowIn?'⏳ باقي '+nz(e-nm)+' دقيقة':(x.note?x.note:(dur?nz(dur)+' دقيقة':''));
    h+='<div class="tr-row'+(x.done?' done':'')+(nowIn?' nowin':'')+'" data-id="'+x.id+'" style="--c:'+x.color+'"><div class="tr-time">'+(x.s||'—')+'</div><button type="button" class="tr-tile" data-edit="'+x.id+'" style="--c:'+x.color+'"><span>'+esc(x.icon)+'</span></button><div class="tr-main"><small>'+esc(top)+(x.rep?' · 🔁':'')+'</small><b data-edit="'+x.id+'">'+esc(x.title)+'</b>'+(sub?'<em class="'+(x.note&&!nowIn?'note':'')+'">'+esc(sub)+'</em>':'')+'<div class="tr-acts"><button type="button" data-edit="'+x.id+'" title="تعديل">✏️</button><button type="button" data-note="'+x.id+'" title="ملاحظة" class="'+(x.note?'has':'')+'">📝</button><button type="button" data-post="'+x.id+'" title="تأجيل">⏭</button></div></div><button type="button" class="tr-chk'+(x.done?' on':'')+'" data-chk="'+x.id+'" aria-label="تم">'+(x.done?'✓':'')+'</button></div>'});
  l.innerHTML=h;
  var q=$('tlQuick'),qh='';quick().forEach(function(x,i){qh+='<div class="tl-q"><button type="button" class="tl-qb" data-q="'+i+'" style="--c:'+x.color+'">'+esc(x.icon)+'</button><span>'+esc(x.title)+'</span>'+(editQ?'<button type="button" class="tl-qx" data-qx="'+i+'">✕</button>':'')+'</div>'});
  qh+='<div class="tl-q"><button type="button" class="tl-qb tl-qadd" id="tlQAdd">＋</button><span>اختصار</span></div><div class="tl-q"><button type="button" class="tl-qb tl-qedit'+(editQ?' on':'')+'" id="tlQEdit">✎</button><span>'+(editQ?'تم':'تعديل')+'</span></div>';q.innerHTML=qh}
function findItem(id,d){return dayItems(d||tlDate).filter(function(x){return x.id===id})[0]}
if(home){
  var wt=function(){var s=$('wisdomText'),t=$('thWisT');if(s&&t&&t.textContent!==s.textContent)t.textContent=s.textContent};wt();setInterval(wt,3000);
  $('thWis').addEventListener('click',function(){this.classList.toggle('open')});
  $('tlWeek').addEventListener('click',function(e){var b=e.target.closest('.tl-day');if(b)selectDay(pd(b.dataset.d))});
  $('tlPrev').onclick=function(){selectDay(addD(tlDate,-7))};$('tlNext').onclick=function(){selectDay(addD(tlDate,7))};$('tlToday').onclick=function(){selectDay(today())};
  $('tlAdd').onclick=function(){openSheet({date:dk(tlDate)})};$('tlLogBtn').onclick=openLog;
  $('tlList').addEventListener('click',function(e){var t=e.target.closest('button,[data-edit]');if(!t)return;var id=t.dataset.chk||t.dataset.edit||t.dataset.note||t.dataset.post,it=id&&findItem(id);if(!it)return;
    if(t.dataset.chk){setDone(it,!it.done);refresh()}else if(t.dataset.note!=null)openNote(it);else if(t.dataset.post!=null)openPost(it);else if(t.dataset.edit!=null)openSheet({item:it,date:it.date})});
  $('tlQuick').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.id==='tlQAdd'){openSheet({mode:'quick'});return}if(b.id==='tlQEdit'){editQ=!editQ;renderList();return}
    if(b.dataset.qx!=null){var q=quick();q.splice(+b.dataset.qx,1);W(QK,q);renderList();return}
    if(b.dataset.q!=null){var x=quick()[+b.dataset.q];if(x)openSheet({date:dk(tlDate),title:x.title,icon:x.icon,color:x.color})}})}

/* ---------- سجل المهام ---------- */
var logEl=document.createElement('div');logEl.className='lg-over';logEl.hidden=true;
logEl.innerHTML='<div class="lg-paper" dir="rtl"><button type="button" class="lg-x" id="lgClose" aria-label="إغلاق">✕</button><div class="lg-title">سجل المهام المنجزة</div><input type="search" id="lgSearch" placeholder="🔍 ابحث..." autocomplete="off"><div class="lg-tools"><label><input type="checkbox" id="lgNotes"> اللي عليها ملاحظات</label><label><input type="checkbox" id="lgAll"> وغير المنجزة كمان</label></div><div class="lg-months" id="lgMonths"></div><div class="lg-sheet" id="lgList"></div><div class="lg-foot" id="lgSum"></div></div>';
document.body.appendChild(logEl);
var lgMonth='all',openM={};
function logData(){var dates={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(DAYP)===0)dates[k.slice(DAYP.length)]=1}}catch(e){}
  var r=rep();r.items.forEach(function(x){var d=pd(x.from),end=x.until?pd(x.until):today(),n=0;if(end>today())end=today();while(d<=end&&n<800){dates[dk(d)]=1;d=addD(d,1);n++}});
  var months={};Object.keys(dates).sort().reverse().forEach(function(k){var its=dayItems(pd(k));if(!its.length)return;var m=k.slice(0,7);(months[m]=months[m]||{key:m,days:[]}).days.push({date:k,items:its})});
  return Object.keys(months).sort().reverse().map(function(m){return months[m]})}
function renderLog(){var all=logData(),q=($('lgSearch').value||'').trim().toLowerCase(),onlyN=$('lgNotes').checked,showAll=$('lgAll').checked,tot=0,h='';
  $('lgMonths').innerHTML='<button type="button" data-m="all" class="'+(lgMonth==='all'?'on':'')+'">الكل</button>'+all.map(function(m){return '<button type="button" data-m="'+m.key+'" class="'+(lgMonth===m.key?'on':'')+'">'+mname(m.key)+'</button>'}).join('');
  all.forEach(function(m,mi){if(lgMonth!=='all'&&lgMonth!==m.key)return;var dh='',mt=0;
    m.days.forEach(function(d){var its=d.items.filter(function(x){return (showAll||x.done)&&(!onlyN||x.note)&&(!q||(x.title+' '+x.note+' '+x.cat).toLowerCase().indexOf(q)>-1)});if(!its.length)return;mt+=its.length;var dt=pd(d.date);
      dh+='<div class="lg-day"><div class="lg-dh"><b>'+WDL[dt.getDay()]+' '+nz(dt.getDate())+'</b><small>'+hText(dt)+'</small></div>'+its.map(function(x){return '<div class="lg-it'+(x.done?'':' no')+'"><span class="lg-ck">'+(x.done?'✓':'○')+'</span><span class="lg-tx"><i>'+esc(x.icon)+'</i> '+esc(x.title)+(x.s?' <em>'+x.s+'</em>':'')+(x.note?'<span class="lg-nt">— '+esc(x.note)+'</span>':'')+'</span></div>'}).join('')+'</div>'});
    if(!mt)return;tot+=mt;var open=q||onlyN||lgMonth!=='all'||(openM[m.key]!==undefined?openM[m.key]:mi===0);
    h+='<section class="lg-m'+(open?' open':'')+'"><button type="button" class="lg-mh" data-t="'+m.key+'"><span class="lg-mn">'+mname(m.key)+'</span><span class="lg-mst">'+nz(mt)+' مهمة</span></button><div class="lg-md">'+dh+'</div></section>'});
  $('lgList').innerHTML=h||'<div class="lg-empty">'+(all.length?'مفيش مهام منفذة بالشكل ده.':'لسه مفيش مهام قديمة. أول ما تنفذ مهام هتتكتب هنا.')+'</div>';$('lgSum').textContent=tot?'— '+nz(tot)+' سطر —':''}
function openLog(){lgMonth='all';openM={};$('lgSearch').value='';$('lgNotes').checked=false;$('lgAll').checked=false;renderLog();logEl.hidden=false;var p=logEl.querySelector('.lg-sheet');if(p)p.scrollTop=0}
$('lgClose').onclick=function(){logEl.hidden=true};logEl.addEventListener('click',function(e){if(e.target===logEl)logEl.hidden=true});
$('lgSearch').addEventListener('input',renderLog);$('lgNotes').addEventListener('change',renderLog);$('lgAll').addEventListener('change',renderLog);
$('lgMonths').addEventListener('click',function(e){var b=e.target.closest('button');if(b){lgMonth=b.dataset.m;renderLog()}});
$('lgList').addEventListener('click',function(e){var b=e.target.closest('.lg-mh');if(!b)return;var s=b.parentNode,o=!s.classList.contains('open');s.classList.toggle('open',o);openM[b.dataset.t]=o});

/* ---------- الإجازات والمناسبات ---------- */
var holCache={};
function easterOrthodox(y){var a=y%4,b=y%7,c=y%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7,m=Math.floor((d+e+114)/31),dd=(d+e+114)%31+1;return addD(new Date(y,m-1,dd,12),13)}
var EG=[[1,7,'عيد الميلاد المجيد'],[1,25,'عيد الثورة وعيد الشرطة'],[4,25,'عيد تحرير سيناء'],[5,1,'عيد العمال'],[6,30,'ذكرى ثورة 30 يونيو'],[7,23,'ذكرى ثورة 23 يوليو'],[10,6,'عيد القوات المسلحة (6 أكتوبر)']];
var AR=[[1,1,'السودان: عيد الاستقلال'],[2,25,'الكويت: اليوم الوطني'],[3,20,'تونس: عيد الاستقلال'],[5,25,'الأردن: عيد الاستقلال'],[7,30,'المغرب: عيد العرش'],[9,23,'السعودية: اليوم الوطني'],[11,1,'الجزائر: ذكرى الثورة'],[11,18,'عُمان: العيد الوطني'],[11,22,'لبنان: عيد الاستقلال'],[12,2,'الإمارات: اليوم الوطني'],[12,16,'البحرين: العيد الوطني'],[12,18,'قطر: اليوم الوطني'],[12,24,'ليبيا: عيد الاستقلال']];
var IS=[[1,1,'رأس السنة الهجرية',1],[1,10,'يوم عاشوراء',0],[3,12,'المولد النبوي الشريف',1],[7,27,'ليلة الإسراء والمعراج',0],[8,15,'ليلة النصف من شعبان',0],[9,1,'أول أيام رمضان',0],[9,27,'ليلة القدر (يُرجّى أنها 27 وفي العشر الأواخر)',0],[10,1,'عيد الفطر — اليوم الأول',1],[10,2,'عيد الفطر — اليوم الثاني',1],[10,3,'عيد الفطر — اليوم الثالث',1],[12,9,'يوم عرفة',1],[12,10,'عيد الأضحى — اليوم الأول',1],[12,11,'عيد الأضحى — اليوم الثاني',1],[12,12,'عيد الأضحى — اليوم الثالث',1]];
function holidays(y){if(holCache[y+'|'+hOff])return holCache[y+'|'+hOff];var out=[];
  EG.forEach(function(h){out.push({date:dk(new Date(y,h[0]-1,h[1],12)),name:h[2],kind:'eg',off:true})});
  var ea=easterOrthodox(y);out.push({date:dk(ea),name:'عيد القيامة المجيد (الأرثوذكسي)',kind:'eg',off:false});out.push({date:dk(addD(ea,1)),name:'شم النسيم',kind:'eg',off:true});
  AR.forEach(function(h){out.push({date:dk(new Date(y,h[0]-1,h[1],12)),name:h[2],kind:'ar',off:false})});
  var d=new Date(y,0,1,12);while(d.getFullYear()===y){var hj=hijri(d);if(hj.m){IS.forEach(function(h){if(h[0]===hj.m&&h[1]===hj.d)out.push({date:dk(d),name:h[2],kind:'is',off:!!h[3]})})}d=addD(d,1)}
  out.sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:0});return holCache[y+'|'+hOff]=out}
function holOn(k){return holidays(+k.slice(0,4)).filter(function(h){return h.date===k})}

/* ---------- صفحة التقويم ---------- */
var cal=document.createElement('section');cal.className='page';cal.id='calendarPage';
cal.innerHTML='<div class="cp" dir="rtl"><header class="cp-head"><button class="back" data-back="home" aria-label="رجوع">›</button><div><h1>التقويم والإجازات</h1><p>مهامك وإجازات السنة المصرية والإسلامية والعربية</p></div><span class="cp-ic">📅</span></header><section class="cp-card cp-main"><div class="cp-banner"><button type="button" id="cpPrev" aria-label="الشهر السابق">›</button><div class="cp-mt"><b id="cpTitle"></b><small id="cpSub"></small></div><button type="button" id="cpNext" aria-label="الشهر التالي">‹</button></div><div class="cp-stats" id="cpStats"></div><div class="cp-wdh" id="cpWdh"></div><div class="cp-grid" id="cpGrid"></div><div class="cp-pills" id="cpPills"></div><div class="cp-leg"><span><i class="lg-off"></i>إجازة رسمية</span><span><i class="lg-occ"></i>مناسبة</span><span><i class="lg-ok">✓</i>اتنجز كله</span></div><div class="cp-bar"><button type="button" id="cpToday">اليوم</button><div class="cp-hoff">تعديل الهجري <button type="button" id="cpHm">−</button><b id="cpHv"></b><button type="button" id="cpHp">+</button></div></div></section><button type="button" class="cp-holbtn" id="cpHolBtn" aria-expanded="false">🎉 الأعياد والمناسبات <span>▾</span></button><section class="cp-card" id="cpHolCard" hidden><div class="cp-ytop"><h2>إجازات ومناسبات <span id="cpYear"></span></h2><div class="cp-ynav"><button type="button" id="cpYp">›</button><button type="button" id="cpYn">‹</button></div></div><div class="cp-chips" id="cpChips"></div><div id="cpHol"></div><p class="cp-note">التواريخ الهجرية بالتقويم المحسوب وقد تختلف يومًا عن رؤية الهلال في مصر (تقدر تعدّلها بالـ ± فوق). وممكن تُنقل بعض الإجازات الرسمية لأيام أخرى بقرار رسمي.</p></section></div>';
var mainEl=document.querySelector('main.app');if(mainEl)mainEl.appendChild(cal);
var cOpen='',cm=new Date(today().getFullYear(),today().getMonth(),1,12),cSel=dk(today()),cFilter='all',cYear=today().getFullYear();
function hIc(x){var n=x.name||'';return /عيد|فطر|أضحى/.test(n)?'🎉':/رمضان/.test(n)?'🌙':/مولد|هجر|إسراء|معراج|عاشوراء/.test(n)?'🕌':x.kind==='is'?'🌙':x.kind==='ar'?'🌍':x.off?'🟢':'🇪🇬'}
function bars(it,ho){var all=[];(ho||[]).forEach(function(x){all.push(hIc(x))});it.forEach(function(i){all.push(i.icon)});var h='';all.slice(0,4).forEach(function(c){h+='<i>'+esc(c)+'</i>'});if(all.length>4)h+='<u>+'+nz(all.length-4)+'</u>';return h}
function renderCal(){if(!$('cpGrid'))return;
  var wh='';for(var i=0;i<7;i++)wh+='<span class="'+(i===6?'fri':'')+'">'+WD[(i+6)%7]+'</span>';$('cpWdh').innerHTML=wh;
  var first=new Date(cm.getFullYear(),cm.getMonth(),1,12),pad0=(first.getDay()+1)%7,dim=new Date(cm.getFullYear(),cm.getMonth()+1,0).getDate(),td=dk(today()),h='',mt=0,md=0;
  var h1=hijri(first),h2=hijri(new Date(cm.getFullYear(),cm.getMonth(),dim,12));$('cpTitle').textContent=MON[cm.getMonth()]+' '+nz(cm.getFullYear());$('cpSub').textContent=h1.m?(h1.m===h2.m?HMON[h1.m]:HMON[h1.m]+' – '+HMON[h2.m])+' '+nz(h2.y):'';
  var byD={};holidays(cm.getFullYear()).forEach(function(x){(byD[x.date]=byD[x.date]||[]).push(x)});if(cm.getMonth()===11||cm.getMonth()===0){holidays(cm.getFullYear()+(cm.getMonth()===11?1:-1)).forEach(function(x){(byD[x.date]=byD[x.date]||[]).push(x)})}
  var hc=0;
  for(var b=0;b<pad0;b++)h+='<span class="cp-c empty"></span>';
  for(var d=1;d<=dim;d++){var dt=new Date(cm.getFullYear(),cm.getMonth(),d,12),k=dk(dt),it=dayItems(dt),ho=byD[k]||[],dn=it.filter(function(x){return x.done}).length,all=it.length&&dn===it.length,hj=hijri(dt);mt+=it.length;md+=dn;if(ho.length)hc++;
    var cls='cp-c'+(k===cSel?' sel':'')+(k===td?' now':'')+(dt.getDay()===5?' fri':'')+(ho.some(function(x){return x.off})?' off':ho.length?' occ':'')+(all?' full':'');
    h+='<button type="button" class="'+cls+'" data-d="'+k+'"><b>'+nz(d)+'</b>'+(all?'<em>✓</em>':'')+'<small>'+(hj.d?nz(hj.d):'')+'</small><span class="cp-ics">'+bars(it,ho)+'</span></button>'}
  $('cpGrid').innerHTML=h;$('cpHv').textContent=hOff>0?'+'+nz(hOff):hOff<0?'−'+nz(-hOff):nz(0);
  $('cpStats').innerHTML='<div><b>'+nz(mt)+'</b><small>مهمة في الشهر</small></div><div><b>'+nz(md)+'</b><small>اتنجزت</small></div><div><b>'+nz(mt?Math.round(md/mt*100):0)+'٪</b><small>نسبة الإنجاز</small></div><div><b>'+nz(hc)+'</b><small>إجازة/مناسبة</small></div>';
  renderPills();renderHol()}
function renderPills(){var el=$('cpPills');if(!el)return;var d=pd(cSel),it=dayItems(d),ho=holOn(cSel),h='<div class="cp-ph">'+WDL[d.getDay()]+' '+nz(d.getDate())+' '+MON[d.getMonth()]+' · '+hText(d)+'</div><div class="cp-pw">';
  it.forEach(function(x){h+='<span class="pill'+(x.done?' ok':'')+'" style="--c:'+x.color+'"><i>'+esc(x.icon)+'</i>'+esc(x.title)+(x.done?' ✓':'')+'</span>'+(x.s?'<span class="pill t" style="--c:'+x.color+'">'+x.s+'</span>':'')});
  ho.forEach(function(x){h+='<span class="pill hol">'+hIc(x)+' '+esc(x.name)+'</span>'});
  if(!it.length&&!ho.length)h+='<span class="pill none">مفيش مهام</span>';el.innerHTML=h+'</div>'}
function renderDay(){var box=$('cpDay');if(!box)return;if(cOpen!==cSel){box.hidden=true;box.innerHTML='';return}box.hidden=false;var d=pd(cSel),it=dayItems(d),ho=holOn(cSel),done=it.filter(function(x){return x.done}),left=it.length-done.length,h='';
  h+='<div class="cd-top"><button type="button" class="cd-x" id="cdX" aria-label="إغلاق">✕</button><div><h2>'+WDL[d.getDay()]+' '+nz(d.getDate())+' '+MON[d.getMonth()]+'</h2><small>'+hText(d)+'</small></div><button type="button" class="cd-add" id="cdAdd">＋ مهمة</button></div>';
  ho.forEach(function(x){h+='<div class="cd-hol '+x.kind+(x.off?' off':'')+'">'+(x.off?'🟢 إجازة رسمية: ':'✨ ')+esc(x.name)+'</div>'});
  if(!it.length)h+='<div class="tl-empty">مفيش مهام في اليوم ده.</div>';
  else{h+='<div class="cd-stat"><span class="ok">✓ تم '+nz(done.length)+'</span><span class="no">◯ متبقي '+nz(left)+'</span></div><div class="cd-list">';
    it.forEach(function(x){h+='<div class="cd-row'+(x.done?' done':'')+'" style="--c:'+x.color+'"><span class="cd-ic">'+esc(x.icon)+'</span><div><b>'+esc(x.title)+'</b><small>'+(x.cat?esc(x.cat)+' · ':'')+(x.s?x.s+(x.e?'–'+x.e:''):'طوال اليوم')+(x.rep?' · 🔁':'')+'</small>'+(x.note?'<p>📝 '+esc(x.note)+'</p>':'')+'</div><button type="button" class="cd-chk" data-c="'+x.id+'">'+(x.done?'✓':'')+'</button></div>'});h+='</div>'}
  box.innerHTML=h}
function renderHol(){var box=$('cpHol');if(!box)return;$('cpYear').textContent=nz(cYear);var chips=[['all','الكل'],['off','🟢 الرسمية'],['eg','🇪🇬 مصر'],['is','🌙 إسلامية'],['ar','🌍 عربية']];$('cpChips').innerHTML=chips.map(function(c){return '<button type="button" data-f="'+c[0]+'" class="'+(cFilter===c[0]?'on':'')+'">'+c[1]+'</button>'}).join('');
  var td=dk(today()),list=holidays(cYear).filter(function(x){return cFilter==='all'||(cFilter==='off'?x.off:x.kind===cFilter)}),h='';
  list.forEach(function(x){var d=pd(x.date),diff=Math.round((d-pd(td))/864e5),when=diff===0?'النهاردة':diff>0?(diff===1?'بكرة':'بعد '+nz(diff)+' يوم'):'';
    h+='<button type="button" class="ch-row '+x.kind+(x.off?' off':'')+(diff<0?' past':'')+'" data-d="'+x.date+'"><span class="ch-date"><b>'+nz(d.getDate())+'</b><small>'+MON[d.getMonth()]+'</small></span><span class="ch-main"><b>'+esc(x.name)+'</b><small>'+WDL[d.getDay()]+' · '+hText(d)+'</small></span><span class="ch-tag">'+(x.off?'إجازة':'مناسبة')+(when?'<em>'+when+'</em>':'')+'</span></button>'});
  box.innerHTML=h||'<div class="tl-empty">مفيش نتايج.</div>'}
(function(){
  $('cpGrid').addEventListener('click',function(e){var b=e.target.closest('.cp-c[data-d]');if(!b)return;cSel=b.dataset.d;renderCal()});
  $('cpPrev').onclick=function(){cm=new Date(cm.getFullYear(),cm.getMonth()-1,1,12);renderCal()};$('cpNext').onclick=function(){cm=new Date(cm.getFullYear(),cm.getMonth()+1,1,12);renderCal()};
  $('cpToday').onclick=function(){cm=new Date(today().getFullYear(),today().getMonth(),1,12);cSel=dk(today());cOpen='';renderCal()};
  function hoff(n){hOff=Math.max(-2,Math.min(2,hOff+n));hCache={};holCache={};try{localStorage.setItem(HOFF,String(hOff))}catch(e){}refresh()}
  $('cpHm').onclick=function(){hoff(-1)};$('cpHp').onclick=function(){hoff(1)};
  $('cpHolBtn').onclick=function(){var c=$('cpHolCard'),o=c.hidden;c.hidden=!o;this.setAttribute('aria-expanded',o?'true':'false');this.classList.toggle('open',o);if(o&&c.scrollIntoView)setTimeout(function(){c.scrollIntoView({behavior:'smooth',block:'nearest'})},50)};
  $('cpChips').addEventListener('click',function(e){var b=e.target.closest('button');if(b){cFilter=b.dataset.f;renderHol()}});
  $('cpYp').onclick=function(){cYear--;renderHol()};$('cpYn').onclick=function(){cYear++;renderHol()};
  $('cpHol').addEventListener('click',function(e){var b=e.target.closest('.ch-row');if(!b)return;var d=pd(b.dataset.d);cSel=b.dataset.d;cOpen=cSel;cm=new Date(d.getFullYear(),d.getMonth(),1,12);renderCal();var g=$('cpGrid');if(g&&g.scrollIntoView)g.scrollIntoView({behavior:'smooth',block:'start'})});
  cal.querySelector('[data-back]').addEventListener('click',function(){if(typeof showPage==='function'){showPage('home');document.querySelectorAll('.nav button').forEach(function(x){x.classList.toggle('active',x.dataset.page==='home')})}})})();

/* ---------- تحديث الكل + العنوان ---------- */
function refresh(){try{renderWeek();renderList()}catch(e){window.__jsErr&&window.__jsErr('tl',e)}try{if(cal.classList.contains('active'))renderCal()}catch(e){window.__jsErr&&window.__jsErr('cal',e)}}
document.querySelectorAll('.nav button[data-page="calendar"]').forEach(function(b){b.addEventListener('click',function(){setTimeout(function(){cSel=dk(today());cm=new Date(today().getFullYear(),today().getMonth(),1,12);cYear=today().getFullYear();renderCal()},30)})});
(function(){var w=$('welcomeDate');if(!w)return;var busy=false;function paint(){var d=new Date(),t=WDL[d.getDay()]+'، '+nz(d.getDate())+' '+MON[d.getMonth()]+' '+nz(d.getFullYear())+' · '+hText(d);if(w.textContent!==t){busy=true;w.textContent=t;busy=false}}
  paint();new MutationObserver(function(){if(!busy)paint()}).observe(w,{childList:true,characterData:true,subtree:true});setInterval(paint,60000)})();
var lastDay=dk(today());
function tick(){var n=dk(today());if(n!==lastDay){var wasToday=dk(tlDate)===lastDay;lastDay=n;if(wasToday)tlDate=today()}refresh()}
document.addEventListener('visibilitychange',function(){if(!document.hidden)tick()});setInterval(function(){if(!document.hidden)tick()},60000);
refresh();
window.TL={dayItems:dayItems,holidays:holidays,refresh:refresh};
})();
