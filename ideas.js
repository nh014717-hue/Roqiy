/* صفحة أفكاري: كتابة + قلم + جدول + إيموجي، وبتتحفظ تلقائيًا في localStorage */
(function(){
'use strict';
var KEY0='ideas_doc_v1',PFX='ideas_day_',LKEY='ideas_lines_v1',$=function(i){return document.getElementById(i)};
var sheet=$('ideasSheet'),ed=$('ideasEditor'),cv=$('ideasCanvas');
if(!sheet||!ed||!cv)return;
var ctx=cv.getContext('2d'),doc={h:1200,html:'',strokes:[]},mode='text',timer=null,cur=null,erasing=false;
function pad(n){return (n<10?'0':'')+n}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function today(){return ymd(new Date())}
var viewDate=today(),lastToday=viewDate;
/* ترحيل الصفحة القديمة (صفحة واحدة) لتبقى صفحة اليوم */
try{if(localStorage.getItem(KEY0)&&!localStorage.getItem(PFX+viewDate)){localStorage.setItem(PFX+viewDate,localStorage.getItem(KEY0));localStorage.removeItem(KEY0)}}catch(e){}
function warn(t){var w=$('ideasWarn');if(!w){w=document.createElement('div');w.id='ideasWarn';w.style.cssText='background:#fdecea;color:#c0392b;padding:8px 12px;border-radius:10px;margin-bottom:8px;font-size:14px;direction:rtl';sheet.parentNode.insertBefore(w,$('ideasBar'))}w.textContent=t;w.style.display='block';clearTimeout(w._t);w._t=setTimeout(function(){w.style.display='none'},8000)}
function empty(){return !doc.strokes.length&&!ed.textContent.trim()&&!ed.querySelector('table')}
function flush(){doc.html=ed.innerHTML;try{if(!empty())localStorage.setItem(PFX+viewDate,JSON.stringify(doc));else if(localStorage.getItem(PFX+viewDate)!==null)localStorage.removeItem(PFX+viewDate)}catch(e){warn('تعذّر حفظ الصفحة على الجهاز: المساحة ممتلئة. قلّل الرسم أو امسح صفحات قديمة.')}}
function load(date){viewDate=date;doc={h:1200,html:'',strokes:[]};try{var d=JSON.parse(localStorage.getItem(PFX+date)||'null');if(d){doc.h=d.h||1200;doc.html=d.html||'';doc.strokes=d.strokes||[]}}catch(e){}ed.innerHTML=doc.html;height();fit();label()}
function save(){clearTimeout(timer);timer=setTimeout(flush,500)}
function height(){sheet.style.minHeight=ed.style.minHeight=doc.h+'px'}
function k(){return cv.width/Math.max(sheet.clientWidth,1)}
function seg(s,i){ctx.strokeStyle=s.c;ctx.lineWidth=s.w*k();ctx.lineCap=ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(s.p[i-1][0]*cv.width,s.p[i-1][1]*cv.width);ctx.lineTo(s.p[i][0]*cv.width,s.p[i][1]*cv.width);ctx.stroke()}
function dot(s){ctx.fillStyle=s.c;ctx.beginPath();ctx.arc(s.p[0][0]*cv.width,s.p[0][1]*cv.width,s.w*k()/2,0,7);ctx.fill()}
function redraw(){ctx.clearRect(0,0,cv.width,cv.height);doc.strokes.forEach(function(s){if(s.p.length===1)dot(s);else for(var i=1;i<s.p.length;i++)seg(s,i)})}
function fit(){var r=sheet.getBoundingClientRect();if(!r.width)return;var q=window.devicePixelRatio||1;cv.width=Math.round(r.width*q);cv.height=Math.round(r.height*q);redraw()}
height();
if(window.ResizeObserver)new ResizeObserver(fit).observe(sheet);else window.addEventListener('resize',fit);
/* ---- القلم والممحاة ---- */
function pt(e){var r=cv.getBoundingClientRect();return [Math.round((e.clientX-r.left)/r.width*1e4)/1e4,Math.round((e.clientY-r.top)/r.width*1e4)/1e4]}
function eraseAt(p){var n=doc.strokes.length,R=0.03;doc.strokes=doc.strokes.filter(function(s){return !s.p.some(function(q){var x=q[0]-p[0],y=q[1]-p[1];return x*x+y*y<R*R})});if(doc.strokes.length!==n){redraw();save()}}
cv.addEventListener('pointerdown',function(e){if(mode==='text')return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}var p=pt(e);if(mode==='eraser'){erasing=true;eraseAt(p);return}cur={c:$('ideasColor').value,w:+$('ideasSize').value,p:[p]};doc.strokes.push(cur);dot(cur)});
cv.addEventListener('pointermove',function(e){if(mode==='text')return;var p=pt(e);if(erasing){eraseAt(p);return}if(!cur)return;var l=cur.p[cur.p.length-1];if(Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<0.002)return;cur.p.push(p);seg(cur,cur.p.length-1)});
function end(){if(cur||erasing){cur=null;erasing=false;save()}}
cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
/* ---- الأوضاع ---- */
function setMode(m){mode=m;sheet.classList.toggle('pen',m!=='text');ed.contentEditable=(m==='text');['text','pen','eraser'].forEach(function(n){var b=$('ideas'+n.charAt(0).toUpperCase()+n.slice(1)+'Btn');if(b)b.classList.toggle('on',n===m)})}
['text','pen','eraser'].forEach(function(n){$('ideas'+n.charAt(0).toUpperCase()+n.slice(1)+'Btn').onclick=function(){setMode(n)}});
/* ---- التنسيق ---- */
function cmd(c,v){ed.focus();document.execCommand(c,false,v||null);save()}
$('ideasBar').addEventListener('mousedown',function(e){if(e.target.closest('button'))e.preventDefault()});
document.querySelectorAll('#ideasBar [data-cmd]').forEach(function(b){b.addEventListener('click',function(){setMode('text');cmd(b.dataset.cmd)})});
$('ideasHeading').addEventListener('change',function(){setMode('text');cmd('formatBlock',this.value||'p')});
$('ideasColor').addEventListener('input',function(){if(mode==='text')cmd('foreColor',this.value)});
ed.addEventListener('input',function(){fixFonts();save()});
/* ---- حجم الخط (من 12 لحد 60) ---- */
var pendingPx=18;
function fixFonts(){ed.querySelectorAll('font[size="7"]').forEach(function(f){var s=document.createElement('span');s.style.fontSize=pendingPx+'px';s.style.lineHeight=Math.max(34,Math.ceil(pendingPx*1.2/34)*34)+'px';while(f.firstChild)s.appendChild(f.firstChild);f.parentNode.replaceChild(s,f)})}
$('ideasFontSize').addEventListener('change',function(){setMode('text');pendingPx=+this.value;ed.focus();document.execCommand('styleWithCSS',false,false);document.execCommand('fontSize',false,'7');fixFonts();save()});
ed.addEventListener('paste',function(e){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))});
/* ---- جدول ---- */
$('ideasTableBtn').onclick=function(){setMode('text');var r=parseInt(prompt('عدد الصفوف؟','3'),10),c=parseInt(prompt('عدد الأعمدة؟','3'),10);if(!(r>0&&c>0))return;r=Math.min(r,30);c=Math.min(c,10);var h='<table><tbody>';for(var i=0;i<r;i++){h+='<tr>';for(var j=0;j<c;j++)h+='<td><br></td>';h+='</tr>'}cmd('insertHTML',h+'</tbody></table><p><br></p>')};
ed.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var n=getSelection().anchorNode,td=n&&(n.nodeType===1?n:n.parentNode).closest('td');if(!td)return;e.preventDefault();var tr=td.parentNode,nx=td.nextElementSibling||(tr.nextElementSibling&&tr.nextElementSibling.firstElementChild);if(!nx){var t2=tr.cloneNode(true);t2.querySelectorAll('td').forEach(function(x){x.innerHTML='<br>'});tr.parentNode.appendChild(t2);nx=t2.firstElementChild}var g=document.createRange();g.selectNodeContents(nx);g.collapse(true);var s=getSelection();s.removeAllRanges();s.addRange(g)});
/* ---- إيموجي ---- */
var box=$('ideasEmojiBox'),E=('😀😊😍🤩😎🤔😴😅😢😡👍👎👏🙏💪🔥⭐✨💡🎯✅❌⚠️❗❓📌📍📅⏰📝📚📖🎓💼💰💳🏠🚗✈️🍎☕🌙☀️🌧️❤️💙💚💜🕌🤲📿🌱🏆🎁🎉📈📉🔔🔒🔑📞💻📱').match(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu)||[];
E.forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=function(){setMode('text');cmd('insertText',x)};box.appendChild(b)});
$('ideasEmojiBtn').onclick=function(){box.classList.toggle('open')};
/* ---- تراجع / مساحة / مسح ---- */
$('ideasUndo').onclick=function(){if(mode==='text')cmd('undo');else if(doc.strokes.length){doc.strokes.pop();redraw();save()}};
$('ideasMore').onclick=function(){doc.h+=1000;height();save()};
$('ideasClear').onclick=function(){if(!confirm('مسح الصفحة كلها (الكتابة والرسم)؟'))return;ed.innerHTML='';doc.strokes=[];doc.h=1200;height();redraw();save()};
document.addEventListener('visibilitychange',function(){if(document.hidden)flush()});
/* ---- صفحة لكل يوم ---- */
var dateIn=$('ideasDate'),nextB=$('ideasNext');
function addDays(s,n){var p=s.split('-');return ymd(new Date(+p[0],+p[1]-1,+p[2]+n))}
function label(){var t=today();dateIn.value=viewDate;dateIn.max=t;nextB.disabled=viewDate>=t;$('ideasDayLabel').textContent=new Date(viewDate+'T12:00:00').toLocaleDateString('ar-EG',{weekday:'long'})+(viewDate===t?' (اليوم)':'')}
function go(date){if(!date||date===viewDate||date>today())return label();clearTimeout(timer);flush();load(date)}
$('ideasPrev').onclick=function(){go(addDays(viewDate,-1))};
nextB.onclick=function(){go(addDays(viewDate,1))};
$('ideasToday').onclick=function(){go(today())};
dateIn.onchange=function(){go(dateIn.value)};
/* لو التطبيق فضل مفتوح وعدّى منتصف الليل وانت على صفحة اليوم → صفحة جديدة */
function rollover(){var t=today();if(t===lastToday)return;var was=viewDate===lastToday;lastToday=t;if(was){clearTimeout(timer);flush();load(t)}else label()}
setInterval(rollover,60000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)rollover()});
/* ---- خطوط الورق (اختياري) ---- */
var lb=$('ideasLinesBtn');
lb.onclick=function(){var on=!sheet.classList.contains('lined');sheet.classList.toggle('lined',on);lb.classList.toggle('on',on);try{localStorage.setItem(LKEY,on?'1':'0')}catch(e){}};
try{if(localStorage.getItem(LKEY)==='1'){sheet.classList.add('lined');lb.classList.add('on')}}catch(e){}
load(viewDate);
setMode('text');
})();
