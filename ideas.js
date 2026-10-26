/* صفحة أفكاري v13: كتابة + قلم + جداول + إكسل بسيط، عدّة صفحات في اليوم، وحفظ يدوي لليوم + سجل وبحث */
(function(){
'use strict';
var DRAFT='ideas_draft_v2',KEY0='ideas_doc_v1',PFX='ideas_day_',LKEY='ideas_lines_v1',$=function(i){return document.getElementById(i)};
var sheet=$('ideasSheet'),ed=$('ideasEditor'),cv=$('ideasCanvas');
if(!sheet||!ed||!cv)return;
var redoS=[],ctx=cv.getContext('2d'),mode='text',timer=null,cur=null,erasing=false;
function pad(n){return (n<10?'0':'')+n}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function today(){return ymd(new Date())}
function uid(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function newPage(){return {id:uid(),h:1200,html:'',strokes:[]}}
var draft=null,doc=null;
/* ---------- رسائل ---------- */
function warn(t,ok){var w=$('ideasWarn');if(!w){w=document.createElement('div');w.id='ideasWarn';sheet.parentNode.insertBefore(w,$('ideasBar'))}w.style.cssText='padding:8px 12px;border-radius:10px;margin-bottom:8px;font-size:14px;direction:rtl;display:block;'+(ok?'background:#e1f5ea;color:#1f8a4c':'background:#fdecea;color:#c0392b');w.textContent=t;clearTimeout(w._t);w._t=setTimeout(function(){w.style.display='none'},ok?2500:8000)}
/* ---------- قراءة يوم محفوظ (الشكل القديم = صفحة واحدة) ---------- */
function readDay(date){try{var d=JSON.parse(localStorage.getItem(PFX+date)||'null');if(!d)return null;if(d.pages&&d.pages.length)return {title:d.title||'',pages:d.pages.map(function(p){return {id:p.id||uid(),h:p.h||1200,html:p.html||'',strokes:p.strokes||[]}}),savedAt:d.savedAt||0};return {title:d.title||'',pages:[{id:uid(),h:d.h||1200,html:d.html||'',strokes:d.strokes||[]}],savedAt:d.savedAt||0}}catch(e){return null}}
/* ---------- تحميل المسودة ---------- */
try{if(localStorage.getItem(KEY0)&&!localStorage.getItem(PFX+today())){localStorage.setItem(PFX+today(),localStorage.getItem(KEY0));localStorage.removeItem(KEY0)}}catch(e){}
try{var dd=JSON.parse(localStorage.getItem(DRAFT)||'null');if(dd&&dd.pages&&dd.pages.length)draft=dd}catch(e){}
if(!draft){var t0=today(),sd=readDay(t0);draft=sd?{date:t0,title:sd.title||'',pages:sd.pages,cur:0,dirty:false,base:sd.savedAt}:{date:t0,title:'',pages:[newPage()],cur:0,dirty:false,base:0}}
if(draft.cur>=draft.pages.length)draft.cur=0;
doc=draft.pages[draft.cur];
/* ---------- حفظ المسودة محليًا (مش بتتزامن) ---------- */
function cleanHTML(){var c=ed.cloneNode(true);c.querySelectorAll('.xl-tools,.xl-sel-clear').forEach(function(x){x.remove()});c.querySelectorAll('.xl .sel').forEach(function(x){x.classList.remove('sel')});return c.innerHTML}
function isEmptyPage(p){if(p.strokes&&p.strokes.length)return false;var d=document.createElement('div');d.innerHTML=p.html||'';return !d.textContent.trim()&&!d.querySelector('table,input')}
function persist(){try{localStorage.setItem(DRAFT,JSON.stringify(draft))}catch(e){warn('تعذّر حفظ المسودة على الجهاز: المساحة ممتلئة. احفظ اليوم وامسح صفحات قديمة.')}}
function flush(){doc.html=cleanHTML();persist()}
function save(){draft.dirty=true;status();clearTimeout(timer);timer=setTimeout(flush,500)}
/* ---------- عرض الصفحة الحالية ---------- */
function height(){sheet.style.minHeight=ed.style.minHeight=doc.h+'px'}
function k(){return cv.width/Math.max(sheet.clientWidth,1)}
function style(s){var t=s.t||'pen',w=s.w;ctx.globalAlpha=1;if(t==='pencil'){ctx.globalAlpha=.7;w=w*.7}else if(t==='hl'){ctx.globalAlpha=.35;w=w*3}ctx.strokeStyle=ctx.fillStyle=s.c;ctx.lineWidth=Math.max(w,1)*k();ctx.lineCap=(t==='hl'?'butt':'round');ctx.lineJoin='round'}
function seg(s,i){style(s);ctx.beginPath();ctx.moveTo(s.p[i-1][0]*cv.width,s.p[i-1][1]*cv.width);ctx.lineTo(s.p[i][0]*cv.width,s.p[i][1]*cv.width);ctx.stroke();ctx.globalAlpha=1}
function dot(s){style(s);ctx.beginPath();ctx.arc(s.p[0][0]*cv.width,s.p[0][1]*cv.width,ctx.lineWidth/2,0,7);ctx.fill();ctx.globalAlpha=1}
function full(s){if(s.p.length===1){dot(s);return}style(s);ctx.beginPath();ctx.moveTo(s.p[0][0]*cv.width,s.p[0][1]*cv.width);for(var i=1;i<s.p.length;i++)ctx.lineTo(s.p[i][0]*cv.width,s.p[i][1]*cv.width);ctx.stroke();ctx.globalAlpha=1}
function redraw(){ctx.clearRect(0,0,cv.width,cv.height);doc.strokes.forEach(full)}
function fit(){var r=sheet.getBoundingClientRect();if(!r.width)return;var q=window.devicePixelRatio||1;cv.width=Math.round(r.width*q);cv.height=Math.round(r.height*q);redraw()}
if(window.ResizeObserver)new ResizeObserver(fit).observe(sheet);else window.addEventListener('resize',fit);
function show(){ed.innerHTML=doc.html;enhanceAll();height();fit();redoS=[];tabs();label();status()}
/* ---------- القلم والممحاة ---------- */
function pt(e){var r=cv.getBoundingClientRect();return [Math.round((e.clientX-r.left)/r.width*1e4)/1e4,Math.round((e.clientY-r.top)/r.width*1e4)/1e4]}
function eraseAt(p){var n=doc.strokes.length,R=0.03;doc.strokes=doc.strokes.filter(function(s){return !s.p.some(function(q){var x=q[0]-p[0],y=q[1]-p[1];return x*x+y*y<R*R})});if(doc.strokes.length!==n){redraw();save()}}
cv.addEventListener('pointerdown',function(e){if(mode==='text')return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}var p=pt(e);if(mode==='eraser'){erasing=true;eraseAt(p);return}cur={c:$('ideasColor').value,w:+$('ideasSize').value,t:$('ideasPenType').value,p:[p]};doc.strokes.push(cur);redoS=[];dot(cur)});
cv.addEventListener('pointermove',function(e){if(mode==='text')return;var p=pt(e);if(erasing){eraseAt(p);return}if(!cur)return;var l=cur.p[cur.p.length-1];if(Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<0.002)return;cur.p.push(p);seg(cur,cur.p.length-1)});
function end(){if(cur||erasing){var t=cur&&cur.t;cur=null;erasing=false;save();if(t&&t!=='pen')redraw()}}
cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
/* ---------- الأوضاع ---------- */
function setMode(m){mode=m;sheet.classList.toggle('pen',m!=='text');ed.contentEditable=(m==='text');['text','pen','eraser'].forEach(function(n){var b=$('ideas'+n.charAt(0).toUpperCase()+n.slice(1)+'Btn');if(b)b.classList.toggle('on',n===m)})}
['text','pen','eraser'].forEach(function(n){$('ideas'+n.charAt(0).toUpperCase()+n.slice(1)+'Btn').onclick=function(){setMode(n)}});
/* ---------- التنسيق ---------- */
function cmd(c,v){ed.focus();document.execCommand(c,false,v||null);save()}
$('ideasBar').addEventListener('mousedown',function(e){if(e.target.closest('button'))e.preventDefault()});
document.querySelectorAll('#ideasBar [data-cmd]').forEach(function(b){b.addEventListener('click',function(){setMode('text');cmd(b.dataset.cmd)})});
$('ideasHeading').addEventListener('change',function(){setMode('text');cmd('formatBlock',this.value||'p')});
$('ideasColor').addEventListener('input',function(){if(mode==='text')cmd('foreColor',this.value)});
var pendingPx=18;
function fixFonts(){ed.querySelectorAll('font[size="7"]').forEach(function(f){var s=document.createElement('span');s.style.fontSize=pendingPx+'px';s.style.lineHeight=Math.max(34,Math.ceil(pendingPx*1.2/34)*34)+'px';while(f.firstChild)s.appendChild(f.firstChild);f.parentNode.replaceChild(s,f)})}
$('ideasFontSize').addEventListener('change',function(){setMode('text');pendingPx=+this.value;ed.focus();document.execCommand('styleWithCSS',false,false);document.execCommand('fontSize',false,'7');fixFonts();save()});
ed.addEventListener('paste',function(e){if(e.target.closest&&e.target.closest('.xl'))return;e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))});
/* ---------- جدول عادي ---------- */
$('ideasTableBtn').onclick=function(){setMode('text');var r=parseInt(prompt('عدد الصفوف؟','3'),10),c=parseInt(prompt('عدد الأعمدة؟','3'),10);if(!(r>0&&c>0))return;r=Math.min(r,30);c=Math.min(c,10);var h='<table><tbody>';for(var i=0;i<r;i++){h+='<tr>';for(var j=0;j<c;j++)h+='<td><br></td>';h+='</tr>'}cmd('insertHTML',h+'</tbody></table><p><br></p>')};
ed.addEventListener('keydown',function(e){if(e.key!=='Tab')return;if(e.target.closest&&e.target.closest('.xl'))return;var n=getSelection().anchorNode,td=n&&(n.nodeType===1?n:n.parentNode).closest('td');if(!td)return;e.preventDefault();var tr=td.parentNode,nx=td.nextElementSibling||(tr.nextElementSibling&&tr.nextElementSibling.firstElementChild);if(!nx){var t2=tr.cloneNode(true);t2.querySelectorAll('td').forEach(function(x){x.innerHTML='<br>'});tr.parentNode.appendChild(t2);nx=t2.firstElementChild}var g=document.createRange();g.selectNodeContents(nx);g.collapse(true);var s=getSelection();s.removeAllRanges();s.addRange(g)});
/* ---------- إيموجي ---------- */
var box=$('ideasEmojiBox'),E=('😀😊😍🤩😎🤔😴😅😢😡👍👎👏🙏💪🔥⭐✨💡🎯✅❌⚠️❗❓📌📍📅⏰📝📚📖🎓💼💰💳🏠🚗✈️🍎☕🌙☀️🌧️❤️💙💚💜🕌🤲📿🌱🏆🎁🎉📈📉🔔🔒🔑📞💻📱').match(/\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu)||[];
E.forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=function(){setMode('text');cmd('insertText',x)};box.appendChild(b)});
$('ideasEmojiBtn').onclick=function(){box.classList.toggle('open')};
/* ---------- تراجع / مساحة / مسح الصفحة ---------- */
$('ideasUndo').onclick=function(){if(mode==='text')cmd('undo');else if(doc.strokes.length){redoS.push(doc.strokes.pop());redraw();save()}};
$('ideasRedo').onclick=function(){if(mode==='text')cmd('redo');else if(redoS.length){doc.strokes.push(redoS.pop());redraw();save()}};
$('ideasMore').onclick=function(){doc.h+=1000;height();save()};
$('ideasClear').onclick=function(){if(!confirm('مسح الصفحة دي (الكتابة والرسم)؟'))return;ed.innerHTML='';doc.strokes=[];doc.h=1200;height();redraw();save()};
/* ---------- نوع القلم والخط والتظليل ---------- */
var prevCol='#1d2b3a';
$('ideasPenType').addEventListener('change',function(){var c=$('ideasColor');if(this.value==='hl'){prevCol=c.value;c.value='#ffe14d'}else if(c.value==='#ffe14d'){c.value=prevCol}setMode('pen')});
$('ideasFontName').addEventListener('change',function(){if(!this.value)return;setMode('text');cmd('fontName',this.value)});
$('ideasHiliteBtn').onclick=function(){setMode('text');ed.focus();document.execCommand('styleWithCSS',false,true);document.execCommand('hiliteColor',false,'#fff176');document.execCommand('styleWithCSS',false,false);save()};
document.addEventListener('visibilitychange',function(){if(document.hidden){clearTimeout(timer);flush()}});
window.addEventListener('pagehide',function(){clearTimeout(timer);flush()});
/* ---------- خطوط الورق ---------- */
var lb=$('ideasLinesBtn');
lb.onclick=function(){var on=!sheet.classList.contains('lined');sheet.classList.toggle('lined',on);lb.classList.toggle('on',on);try{localStorage.setItem(LKEY,on?'1':'0')}catch(e){}};
try{if(localStorage.getItem(LKEY)==='1'){sheet.classList.add('lined');lb.classList.add('on')}}catch(e){}

/* =====================================================
   الإكسل البسيط: خلايا + معادلات (=A1+B2 ، =SUM(A1:A5) ...)
   ===================================================== */
function norm(s){return String(s==null?'':s).replace(/[٠-٩]/g,function(c){return c.charCodeAt(0)-1632}).replace(/[۰-۹]/g,function(c){return c.charCodeAt(0)-1776}).replace(/٫/g,'.').replace(/[٬،]/g,',').replace(/[×]/g,'*').replace(/[÷]/g,'/').replace(/[−–]/g,'-')}
function colName(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s}
function colIdx(s){s=s.toUpperCase();var n=0;for(var i=0;i<s.length;i++)n=n*26+s.charCodeAt(i)-64;return n-1}
function num(s){var t=norm(s).replace(/,/g,'').trim();return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)?parseFloat(t):null}
function fmt(v){if(typeof v==='number'){if(!isFinite(v))throw new Error('#خطأ');return String(Math.round(v*1e9)/1e9)}return String(v)}
function flat(a){var o=[];a.forEach(function(x){if(Array.isArray(x))o=o.concat(flat(x));else o.push(x)});return o}
var FN={SUM:function(a){return flat(a).reduce(function(s,x){return s+x},0)},AVERAGE:function(a){var f=flat(a);return f.length?FN.SUM(f)/f.length:0},MIN:function(a){var f=flat(a);return f.length?Math.min.apply(null,f):0},MAX:function(a){var f=flat(a);return f.length?Math.max.apply(null,f):0},COUNT:function(a){return flat(a).length},ROUND:function(a){var f=flat(a),d=f[1]||0,m=Math.pow(10,d);return Math.round(f[0]*m)/m},ABS:function(a){return Math.abs(flat(a)[0])}};
var ALIAS={'جمع':'SUM','مجموع':'SUM','متوسط':'AVERAGE','AVG':'AVERAGE','اكبر':'MAX','أكبر':'MAX','اصغر':'MIN','أصغر':'MIN','عدد':'COUNT','تقريب':'ROUND','مطلق':'ABS'};
function evalTable(tb){
  var rows=[].slice.call(tb.querySelectorAll('tbody tr')).map(function(tr){return [].slice.call(tr.querySelectorAll('input'))});
  var raw=rows.map(function(r){return r.map(function(i){return i.getAttribute('value')||''})});
  var memo={},stack={};
  function cell(c,r){if(r<0||c<0||r>=raw.length||c>=(raw[r]||[]).length)throw new Error('#مرجع');var key=r+','+c;if(key in memo){if(memo[key] instanceof Error)throw memo[key];return memo[key]}if(stack[key])throw new Error('#دوري');stack[key]=1;var v;try{v=compute(raw[r][c])}catch(e){stack[key]=0;memo[key]=e;throw e}stack[key]=0;memo[key]=v;return v}
  function numCell(c,r){var v=cell(c,r);if(typeof v==='number')return v;var n=num(v);return n==null?0:n}
  function compute(t){var s=norm(t).trim();if(s.charAt(0)!=='=')return num(t)!=null?num(t):t;s=s.slice(1);
    s=s.replace(/[^\s\d+\-*\/().,:%A-Za-z$؀-ۿ]/g,'');
    s=s.replace(/[A-Za-z؀-ۿ]{2,}(?=\s*\()/g,function(n){var u=n.toUpperCase();return ALIAS[n]||ALIAS[u]||u});
    s=s.replace(/\$/g,'').replace(/(\d+(?:\.\d+)?)\s*%/g,'($1/100)');
    s=s.replace(/([A-Za-z]{1,2})(\d{1,3}):([A-Za-z]{1,2})(\d{1,3})|\b([A-Za-z]{1,2})(\d{1,3})\b/g,function(m,a,b,c,d,e,f){if(e)return 'C("'+e.toUpperCase()+'",'+f+')';return 'R("'+a.toUpperCase()+'",'+b+',"'+c.toUpperCase()+'",'+d+')'});
    var chk=s.replace(/\b(SUM|AVERAGE|MIN|MAX|COUNT|ROUND|ABS)\(/g,'(').replace(/\b[CR]\(/g,'(').replace(/"[A-Z]{1,2}"/g,'0');
    if(!/^[\d\s+\-*\/().,]*$/.test(chk))throw new Error('#خطأ');
    var C=function(c,r){return numCell(colIdx(c),r-1)},R=function(c1,r1,c2,r2){var o=[],a=colIdx(c1),b=colIdx(c2),x=Math.min(r1,r2),y=Math.max(r1,r2);for(var r=x;r<=y;r++)for(var c=Math.min(a,b);c<=Math.max(a,b);c++){var v=cell(c,r-1);if(typeof v==='number')o.push(v);else{var n=num(v);if(n!=null)o.push(n)}}return o};
    var fn=new Function('C','R','SUM','AVERAGE','MIN','MAX','COUNT','ROUND','ABS','"use strict";return ('+s+')');
    var wrap=function(f){return function(){return f([].slice.call(arguments))}};
    var v=fn(C,R,wrap(FN.SUM),wrap(FN.AVERAGE),wrap(FN.MIN),wrap(FN.MAX),wrap(FN.COUNT),wrap(FN.ROUND),wrap(FN.ABS));
    if(typeof v!=='number'||!isFinite(v))throw new Error('#خطأ');return v}
  rows.forEach(function(r,ri){r.forEach(function(inp,ci){var rw=raw[ri][ci],isF=norm(rw).trim().charAt(0)==='=';inp.classList.toggle('f',isF);inp.classList.remove('err');if(!isF){if(inp!==document.activeElement)inp.value=rw;return}
    var shown;try{shown=fmt(cell(ci,ri))}catch(e){shown=e.message||'#خطأ';inp.classList.add('err')}
    if(inp!==document.activeElement)inp.value=shown;inp.title=rw})});
}
function mkTable(r,c){var h='<div class="xl-wrap" contenteditable="false"><div class="xl-scroll"><table class="xl"><thead><tr><th></th>';for(var j=0;j<c;j++)h+='<th>'+colName(j)+'</th>';h+='</tr></thead><tbody>';for(var i=0;i<r;i++){h+='<tr><th>'+(i+1)+'</th>';for(var j2=0;j2<c;j2++)h+='<td><input dir="auto" value=""></td>';h+='</tr>'}return h+'</tbody></table></div></div><p><br></p>'}
function renumber(tb){var hr=tb.querySelector('thead tr'),n=tb.querySelector('tbody tr').children.length-1;hr.innerHTML='<th></th>';for(var j=0;j<n;j++)hr.insertAdjacentHTML('beforeend','<th>'+colName(j)+'</th>');tb.querySelectorAll('tbody tr').forEach(function(tr,i){tr.firstElementChild.textContent=i+1})}
function enhance(w){if(w.querySelector('.xl-tools'))return;w.setAttribute('contenteditable','false');var t=document.createElement('div');t.className='xl-tools';t.innerHTML='<b>📊 إكسل</b><button type="button" data-x="addr">＋ صف</button><button type="button" data-x="addc">＋ عمود</button><button type="button" data-x="sum" title="مجموع الأرقام اللي فوق الخلية الحالية">Σ مجموع</button><button type="button" data-x="delr">− صف</button><button type="button" data-x="delc">− عمود</button><button type="button" data-x="deltb">🗑️</button>';w.insertBefore(t,w.firstChild);evalTable(w.querySelector('table'))}
function enhanceAll(){ed.querySelectorAll('.xl-wrap').forEach(enhance)}
var lastInp=null;
ed.addEventListener('focusin',function(e){if(e.target.matches&&e.target.matches('.xl input')){lastInp=e.target;e.target.value=e.target.getAttribute('value')||''}});
ed.addEventListener('focusout',function(e){if(e.target.matches&&e.target.matches('.xl input'))evalTable(e.target.closest('table'))});
ed.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('.xl input')){e.target.setAttribute('value',e.target.value);evalTable(e.target.closest('table'))}else fixFonts();save()});
ed.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.xl-tools button');if(!b)return;var w=b.closest('.xl-wrap'),tb=w.querySelector('table'),act=b.dataset.x;
  var inp=(lastInp&&tb.contains(lastInp))?lastInp:null,td=inp&&inp.closest('td'),tr=td&&td.parentNode,ci=td?[].indexOf.call(tr.children,td):-1,ri=tr?[].indexOf.call(tb.querySelectorAll('tbody tr'),tr):-1;
  var body=tb.querySelector('tbody'),n=body.rows[0].cells.length-1;
  if(act==='addr'){var nr=document.createElement('tr');nr.innerHTML='<th></th>'+new Array(n+1).join('<td><input dir="auto" value=""></td>');if(tr)body.insertBefore(nr,tr.nextSibling);else body.appendChild(nr)}
  else if(act==='addc'){var at=ci>0?ci+1:n+1;[].forEach.call(body.rows,function(r){var c=document.createElement('td');c.innerHTML='<input dir="auto" value="">';r.insertBefore(c,r.cells[at]||null)})}
  else if(act==='delr'){if(body.rows.length<=1)return warn('لازم يفضل صف واحد على الأقل.');(tr||body.lastElementChild).remove()}
  else if(act==='delc'){if(n<=1)return warn('لازم يفضل عمود واحد على الأقل.');var dc=ci>0?ci:n;[].forEach.call(body.rows,function(r){r.cells[dc].remove()})}
  else if(act==='deltb'){if(!confirm('حذف الجدول ده؟'))return;w.remove();save();return}
  else if(act==='sum'){if(!inp||ri<1)return warn('اضغط على خلية تحت الأرقام الأول، وبعدين Σ مجموع.');var L=colName(ci-1),f='=SUM('+L+'1:'+L+ri+')';inp.setAttribute('value',f);inp.value=f}
  renumber(tb);evalTable(tb);save()});
ed.addEventListener('keydown',function(e){var inp=e.target;if(!(inp.matches&&inp.matches('.xl input')))return;var td=inp.closest('td'),tr=td.parentNode,body=tr.parentNode,ci=[].indexOf.call(tr.children,td),ri=[].indexOf.call(body.rows,tr),tgt=null;
  if(e.key==='Enter'||e.key==='ArrowDown'){tgt=body.rows[ri+1]&&body.rows[ri+1].cells[ci]}else if(e.key==='ArrowUp'){tgt=body.rows[ri-1]&&body.rows[ri-1].cells[ci]}else if(e.key==='Tab'){tgt=e.shiftKey?td.previousElementSibling:(td.nextElementSibling||(body.rows[ri+1]&&body.rows[ri+1].cells[1]));if(tgt&&tgt.tagName==='TH')tgt=null}else return;
  e.preventDefault();var i2=tgt&&tgt.querySelector('input');if(i2){i2.focus();i2.select()}else if(e.key==='Enter')inp.blur()});
$('ideasXlBtn').onclick=function(){setMode('text');var r=parseInt(prompt('عدد الصفوف؟','5'),10),c=parseInt(prompt('عدد الأعمدة؟','4'),10);if(!(r>0&&c>0))return;r=Math.min(r,60);c=Math.min(c,16);ed.focus();document.execCommand('insertHTML',false,mkTable(r,c));enhanceAll();save()};
/* ---------- مجموع المحدد ---------- */
var chip=$('ideasSum'),selCells=[],drag=null;
function stats(vals){if(vals.length<2)return chip.hidden=true;var s=vals.reduce(function(a,b){return a+b},0);chip.textContent='Σ المجموع: '+fmt(s)+'  ·  المتوسط: '+fmt(s/vals.length)+'  ·  العدد: '+vals.length;chip.hidden=false}
function clearSel(){selCells.forEach(function(c){c.classList.remove('sel')});selCells=[]}
function cellVal(i){var s=i.value;var n=num(s);return n}
ed.addEventListener('mousedown',function(e){var i=e.target.matches&&e.target.matches('.xl input')?e.target:null;if(!i){clearSel();return}if(!e.shiftKey)clearSel();drag={tb:i.closest('table'),a:i}});
ed.addEventListener('mouseover',function(e){if(!drag||!(e.buttons&1))return;var i=e.target.matches&&e.target.matches('.xl input')?e.target:null;if(!i||i.closest('table')!==drag.tb||i===drag.a&&!selCells.length)return;rangeSel(drag.tb,drag.a,i)});
document.addEventListener('mouseup',function(){drag=null});
ed.addEventListener('click',function(e){if(e.shiftKey&&lastInp&&e.target.matches&&e.target.matches('.xl input')&&lastInp.closest('table')===e.target.closest('table'))rangeSel(e.target.closest('table'),lastInp,e.target)});
function rangeSel(tb,a,b){clearSel();var ta=a.closest('td'),tbb=b.closest('td'),rs=[].slice.call(tb.querySelectorAll('tbody tr')),r1=rs.indexOf(ta.parentNode),r2=rs.indexOf(tbb.parentNode),c1=[].indexOf.call(ta.parentNode.children,ta),c2=[].indexOf.call(tbb.parentNode.children,tbb),vals=[];
  for(var r=Math.min(r1,r2);r<=Math.max(r1,r2);r++)for(var c=Math.min(c1,c2);c<=Math.max(c1,c2);c++){var td=rs[r].children[c];td.classList.add('sel');selCells.push(td);var n=cellVal(td.firstElementChild);if(n!=null)vals.push(n)}stats(vals)}
document.addEventListener('selectionchange',function(){if(selCells.length)return;var s=getSelection();if(!s||s.isCollapsed||!s.anchorNode||!ed.contains(s.anchorNode)){if(!selCells.length)chip.hidden=true;return}var m=norm(s.toString()).replace(/(\d),(?=\d{3}\b)/g,'$1').match(/[+-]?\d+(?:\.\d+)?/g)||[];stats(m.map(parseFloat))});

/* =====================================================
   الأيام والصفحات والسجل
   ===================================================== */
var dateIn=$('ideasDate');
function dayName(d){try{return new Date(d+'T12:00:00').toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}catch(e){return d}}
function label(){dateIn.value=draft.date;$('ideasTitle').value=draft.title||'';$('ideasDayLabel').textContent=new Date(draft.date+'T12:00:00').toLocaleDateString('ar-EG',{weekday:'long'})+(draft.date===today()?' (اليوم)':'')}
function status(){var s=$('ideasStatus');s.textContent=draft.dirty?'● لسه ماتحفظش':'✓ محفوظ';s.className=draft.dirty?'dirty':'ok'}
function tabs(){var t=$('ideasTabs'),h='';draft.pages.forEach(function(p,i){h+='<button type="button" class="ideas-tab'+(i===draft.cur?' on':'')+'" data-i="'+i+'">صفحة '+(i+1)+'</button>'});h+='<button type="button" class="ideas-tab add" id="ideasAddPage">＋ صفحة</button>';if(draft.pages.length>1)h+='<button type="button" class="ideas-tab del" id="ideasDelPage" title="حذف الصفحة الحالية">🗑️ حذف الصفحة</button>';t.innerHTML=h}
function switchTo(i){clearTimeout(timer);flush();draft.cur=i;doc=draft.pages[i];persist();show()}
$('ideasTabs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.id==='ideasAddPage'){clearTimeout(timer);doc.html=cleanHTML();draft.pages.push(newPage());draft.dirty=true;switchTo(draft.pages.length-1);return}
  if(b.id==='ideasDelPage'){if(!confirm('حذف صفحة '+(draft.cur+1)+' نهائيًا؟'))return;draft.pages.splice(draft.cur,1);draft.cur=Math.max(0,draft.cur-1);doc=draft.pages[draft.cur];draft.dirty=true;persist();show();return}
  if(b.dataset.i!=null&&+b.dataset.i!==draft.cur)switchTo(+b.dataset.i)});
$('ideasTitle').addEventListener('input',function(){draft.title=this.value;draft.dirty=true;status();clearTimeout(timer);timer=setTimeout(flush,500)});
dateIn.onchange=function(){if(!dateIn.value)return label();draft.date=dateIn.value;draft.base=0;draft.dirty=true;flush();label();status()};
function pageNonEmpty(){doc.html=cleanHTML();return draft.pages.filter(function(p){return !isEmptyPage(p)})}
/* حفظ اليوم (يدوي) */
$('ideasSaveDay').onclick=function(){clearTimeout(timer);doc.html=cleanHTML();var keep=draft.pages.filter(function(p){return !isEmptyPage(p)});if(!keep.length){warn('كل الصفحات فاضية، اكتب حاجة الأول.');return}
  var ex=readDay(draft.date);if(ex&&ex.savedAt!==draft.base&&!confirm('فيه يوم محفوظ بنفس التاريخ ('+dayName(draft.date)+'). تستبدله بالصفحات الحالية؟'))return;
  var now=Date.now();try{localStorage.setItem(PFX+draft.date,JSON.stringify({v:2,date:draft.date,title:(draft.title||'').trim(),pages:keep,savedAt:now}))}catch(e){warn('تعذّر الحفظ: مساحة الجهاز ممتلئة. امسح أيام قديمة من السجل أو قلّل الرسم.');return}
  draft.base=now;draft.dirty=false;flush();status();warn('اتحفظ '+(draft.title&&draft.title.trim()?'«'+draft.title.trim()+'» — ':'يوم ')+dayName(draft.date)+' ('+keep.length+' صفحة)',true)};
function loadDay(date){var d=readDay(date);if(!d)return;draft={date:date,title:d.title||'',pages:d.pages,cur:0,dirty:false,base:d.savedAt};doc=draft.pages[0];persist();show()}
function freshDay(){draft={date:today(),title:'',pages:[newPage()],cur:0,dirty:false,base:0};doc=draft.pages[0];persist();show()}
function guard(){return !draft.dirty||confirm('عندك تعديلات ماتحفظتش على اليوم الحالي. تكمل وتسيبها؟')}
$('ideasNewDay').onclick=function(){if(guard())freshDay()};
/* السجل والبحث */
var log=$('ideasLog'),list=$('ideasLogList'),sIn=$('ideasSearch'),idx=[];
function plain(html){var d=document.createElement('div');d.innerHTML=html||'';d.querySelectorAll('input').forEach(function(i){d.appendChild(document.createTextNode(' '+(i.getAttribute('value')||'')))});return d.textContent.replace(/\s+/g,' ').trim()}
function buildIndex(){idx=[];try{for(var i=0;i<localStorage.length;i++){var key=localStorage.key(i);if(key&&key.indexOf(PFX)===0){var date=key.slice(PFX.length),d=readDay(date);if(!d)continue;var txt=d.pages.map(function(p){return plain(p.html)}).join(' ');var strokes=d.pages.reduce(function(a,p){return a+(p.strokes?p.strokes.length:0)},0);idx.push({date:date,title:d.title||'',pages:d.pages.length,text:txt,strokes:strokes,hay:norm(date+' '+(d.title||'')+' '+dayName(date)+' '+txt).toLowerCase()})}}}catch(e){}idx.sort(function(a,b){return a.date<b.date?1:-1})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function renderLog(){var q=norm(sIn.value).trim().toLowerCase(),r=idx.filter(function(x){return !q||x.hay.indexOf(q)>-1});if(!r.length){list.innerHTML='<div class="ideas-log-empty">'+(idx.length?'مفيش نتايج للبحث ده.':'لسه مفيش أيام محفوظة. اكتب واضغط 💾 حفظ اليوم.')+'</div>';return}
  list.innerHTML=r.map(function(x){var sn=x.text.slice(0,90)||(x.strokes?'✍️ رسم بخط اليد':'—');return '<div class="ideas-log-item" data-d="'+x.date+'"><div class="il-main"><b>'+esc(x.title||dayName(x.date))+'</b><span class="il-meta">'+(x.title?esc(dayName(x.date))+' · ':'')+x.pages+' صفحة · '+x.date+'</span><span class="il-snip">'+esc(sn)+'</span></div><div class="il-act"><button type="button" data-a="open">فتح</button><button type="button" data-a="del" title="حذف">🗑️</button></div></div>'}).join('')}
$('ideasLogBtn').onclick=function(){buildIndex();sIn.value='';renderLog();log.hidden=false;setTimeout(function(){sIn.focus()},50)};
$('ideasLogClose').onclick=function(){log.hidden=true};
log.addEventListener('click',function(e){if(e.target===log)log.hidden=true});
sIn.addEventListener('input',renderLog);
list.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var it=b.closest('.ideas-log-item'),date=it.dataset.d;
  if(b.dataset.a==='open'){if(!guard())return;log.hidden=true;loadDay(date)}
  else if(b.dataset.a==='del'){if(!confirm('حذف '+(((idx.filter(function(z){return z.date===date})[0]||{}).title)||('يوم '+dayName(date)))+' نهائيًا من كل أجهزتك؟'))return;try{localStorage.removeItem(PFX+date)}catch(x){}if(draft.date===date){draft.base=0;draft.dirty=true;flush();status()}buildIndex();renderLog()}});
show();
setMode('text');
})();
