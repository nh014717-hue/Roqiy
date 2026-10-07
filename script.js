try{
/* ===== script block ===== */
/* One canonical user-facing date formatter; ISO values remain unchanged for storage and inputs. */
window.formatAppDate=function(value){
  let year,month,day;
  if(value instanceof Date){if(Number.isNaN(value.getTime()))return '';year=value.getFullYear();month=value.getMonth()+1;day=value.getDate();}
  else{
    const raw=String(value==null?'':value).trim();
    let m=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|T)/);
    if(m){year=+m[1];month=+m[2];day=+m[3];}
    else{m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!m)return '';day=+m[1];month=+m[2];year=+m[3];}
  }
  const check=new Date(year,month-1,day,12);
  if(!year||month<1||month>12||day<1||check.getFullYear()!==year||check.getMonth()!==month-1||check.getDate()!==day)return '';
  return String(day).padStart(2,'0')+'/'+String(month).padStart(2,'0')+'/'+String(year).padStart(4,'0');
};
/* Accessible presentation layer for native date inputs: the native ISO value stays authoritative. */
window.installAppDateDisplay=function(input){
 if(!input||input.type!=='date'||input.dataset.appDateDisplay==='1'||!input.parentNode)return;
 const cs=getComputedStyle(input);if(input.closest('template'))return;
 const wrap=document.createElement('span');wrap.className='app-date-display-wrap';
 Object.assign(wrap.style,{position:'relative',display:'block',width:'100%',minWidth:'0',boxSizing:'border-box',height:cs.height,minHeight:cs.minHeight,padding:cs.padding,border:cs.border,borderRadius:cs.borderRadius,background:cs.background,boxShadow:cs.boxShadow,gridColumn:cs.gridColumn,gridRow:cs.gridRow,flex:cs.flex,alignSelf:cs.alignSelf,justifySelf:cs.justifySelf,overflow:'hidden'});
 const label=document.createElement('span');label.className='app-date-display-text';label.setAttribute('aria-hidden','true');
 Object.assign(label.style,{position:'absolute',inset:'0',zIndex:'1',display:'flex',alignItems:'center',justifyContent:'center',padding:cs.padding,boxSizing:'border-box',direction:'ltr',unicodeBidi:'isolate',textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',pointerEvents:'none',color:cs.color,font:cs.font,lineHeight:cs.lineHeight,fontVariantNumeric:'tabular-nums'});
 const sync=()=>{label.textContent=window.formatAppDate(input.value)||'DD/MM/YYYY';if(!input.value)label.style.opacity='.55';else label.style.opacity='1'};
 input.parentNode.insertBefore(wrap,input);wrap.appendChild(label);wrap.appendChild(input);
 Object.assign(input.style,{position:'absolute',inset:'0',zIndex:'2',width:'100%',height:'100%',minHeight:'0',margin:'0',padding:'0',border:'0',borderRadius:'0',background:'transparent',boxShadow:'none',opacity:'0',cursor:'pointer',direction:'ltr'});
 input.setAttribute('lang','en-GB');input.setAttribute('dir','ltr');input.dataset.appDateDisplay='1';input.addEventListener('input',sync);input.addEventListener('change',sync);input.__appDateSync=sync;sync();
};
window.refreshAppDateDisplays=function(root=document){if(root.matches&&root.matches('input[type="date"]')){if(root.__appDateSync)root.__appDateSync();else window.installAppDateDisplay(root)}root.querySelectorAll&&root.querySelectorAll('input[type="date"]').forEach(input=>{if(input.__appDateSync)input.__appDateSync();else window.installAppDateDisplay(input)})};
(function(){
 const scan=root=>{if(root.nodeType!==1)return;if(root.matches&&root.matches('input[type="date"]'))window.installAppDateDisplay(root);root.querySelectorAll&&root.querySelectorAll('input[type="date"]').forEach(window.installAppDateDisplay)};
 const start=()=>{document.querySelectorAll('input[type="date"]').forEach(window.installAppDateDisplay);new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(scan))).observe(document.body,{childList:true,subtree:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
}catch(e){window.__jsErr&&window.__jsErr('block 0',e)}

try{
/* ===== Original inline script 1 ===== */
(function(){
/* ================= DATA ================= */
const NEW_CATEGORIES = [
{id:'sabah',icon:'🌞',bg:'#fbeecb',title:'أذكار الصباح',desc:'ورد بداية اليوم',hasAudio:true,audio:'https://d1.islamhouse.com/data/ar/ih_sounds/chain_01/Mishari_Raashid/Azkar_AlSba7_w_AlMsa/ar_1434_Azkar_AlSba7.mp3'},
{id:'masaa',icon:'🌙',bg:'#e4e6fb',title:'أذكار المساء',desc:'ورد نهاية اليوم',hasAudio:true,audio:'https://d1.islamhouse.com/data/ar/ih_sounds/chain_01/Mishari_Raashid/Azkar_AlSba7_w_AlMsa/ar_1434_Azkar_AlMsa.mp3'},
{id:'sleep',icon:'🌌',bg:'#eae0fa',title:'أذكار النوم',desc:'سكينة الليل'},
{id:'wake',icon:'🌅',bg:'#dff3ec',title:'أذكار الاستيقاظ',desc:'بداية يوم مبارك'},
{id:'salah',icon:'🚶',bg:'#dff3ec',title:'بعد الصلاة',desc:'أذكار ما بعد السلام'},
{id:'home',icon:'🏠',bg:'#deeee0',title:'المنزل والخروج',desc:'الدخول والخروج'},
{id:'travel',icon:'🧳',bg:'#e6eef7',title:'السفر والركوب',desc:'دعاء السفر'},
{id:'food',icon:'🍽️',bg:'#fbe6d9',title:'الطعام والشراب',desc:'بركة النعمة'},
{id:'masjid',icon:'🕌',bg:'#dcedf5',title:'المسجد والأذان',desc:'آداب المسجد'},
{id:'wudu',icon:'💧',bg:'#dff3ec',title:'الوضوء',desc:'أذكار الوضوء'},
{id:'worry',icon:'🤍',bg:'#f0e8f5',title:'الهم والكرب',desc:'تفريج الضيق'},
{id:'rain',icon:'🌧️',bg:'#e4edf5',title:'المطر والرياح',desc:'أذكار الطقس'},
{id:'sick',icon:'🩺',bg:'#f7e8eb',title:'المريض والعيادة',desc:'دعاء الشفاء'},
{id:'friday',icon:'🕋',bg:'#f6ecd8',title:'الجمعة',desc:'أذكار يوم الجمعة'},
{id:'jamiah',icon:'✨',bg:'#fbe1e6',title:'أدعية جامعة',desc:'دعوات شاملة للدنيا والآخرة'}
];

const NEW_DHIKR = {
  sabah: [
    {text:'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ', count:'مرة واحدة', ref:'آية الكرسي — سورة البقرة: 255'},
    {text:'قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', count:'3 مرات', ref:'سورة الإخلاص'},
    {text:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', count:'3 مرات', ref:'سورة الفلق'},
    {text:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ', count:'3 مرات', ref:'سورة الناس'},
    {text:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ', count:'مرة واحدة', ref:'حصن المسلم — أذكار الصباح'},
    {text:'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', count:'مرة واحدة', ref:'سيد الاستغفار'},
    {text:'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ', count:'3 مرات', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ', count:'3 مرات', ref:'حصن المسلم'},
    {text:'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count:'7 مرات', ref:'حصن المسلم'},
    {text:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ', count:'3 مرات', ref:'حصن المسلم'},
    {text:'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ رَسُولًا', count:'3 مرات', ref:'حصن المسلم'},
    {text:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count:'100 مرة', ref:'حصن المسلم'},
    {text:'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count:'100 مرة', ref:'حصن المسلم'},
    {text:'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', count:'10 مرات', ref:'حصن المسلم'},
    {text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count:'10 مرات', ref:'حصن المسلم'}
  ],
  masaa: [
    {text:'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ', count:'مرة واحدة', ref:'آية الكرسي — سورة البقرة: 255'},
    {text:'قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', count:'3 مرات', ref:'سورة الإخلاص'},
    {text:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', count:'3 مرات', ref:'سورة الفلق'},
    {text:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ', count:'3 مرات', ref:'سورة الناس'},
    {text:'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا', count:'مرة واحدة', ref:'حصن المسلم — أذكار المساء'},
    {text:'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', count:'مرة واحدة', ref:'سيد الاستغفار'},
    {text:'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ', count:'3 مرات', ref:'حصن المسلم'},
    {text:'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count:'7 مرات', ref:'حصن المسلم'},
    {text:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count:'3 مرات', ref:'حصن المسلم'},
    {text:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count:'100 مرة', ref:'حصن المسلم'},
    {text:'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count:'100 مرة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', count:'10 مرات', ref:'حصن المسلم'},
    {text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count:'10 مرات', ref:'حصن المسلم'}
  ],
  salah: [
    {text:'أَسْتَغْفِرُ اللَّهَ', count:'3 مرات', ref:'بعد السلام مباشرة'},
    {text:'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'سُبْحَانَ اللَّهِ', count:'33 مرة', ref:'حصن المسلم'},
    {text:'الْحَمْدُ لِلَّهِ', count:'33 مرة', ref:'حصن المسلم'},
    {text:'اللَّهُ أَكْبَرُ، وتُكمَّل المئة بقول: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count:'34 مرة', ref:'حصن المسلم'}
  ],
  sleep: [
    {text:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', count:'عند النوم', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', count:'3 مرات', ref:'حصن المسلم'},
    {text:'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', count:'عند الاستيقاظ', ref:'حصن المسلم'}
  ],
  home: [
    {text:'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا، ثُمَّ يُسَلِّمُ عَلَى أَهْلِهِ', count:'عند دخول المنزل', ref:'حصن المسلم'},
    {text:'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count:'عند الخروج من المنزل', ref:'حصن المسلم — من قالها يُقال له: هُديت وكُفيت ووُقيت'},
    {text:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ', count:'عند الخروج', ref:'حصن المسلم'},
    {text:'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى', count:'دعاء السفر', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ', count:'دعاء السفر', ref:'حصن المسلم'},
    {text:'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ', count:'عند العودة من السفر', ref:'حصن المسلم'}
  ],
  food: [
    {text:'بِسْمِ اللَّهِ', count:'قبل الطعام', ref:'حصن المسلم'},
    {text:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', count:'بعد الطعام', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ', count:'مرة واحدة', ref:'حصن المسلم'}
  ],
  jamiah: [
    {text:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', count:'مرة واحدة', ref:'سورة البقرة: 201'},
    {text:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي', count:'مرة واحدة', ref:'سورة طه: 25-26'},
    {text:'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ', count:'مرة واحدة', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا', count:'دعاء عند الكرب والشدة', ref:'حصن المسلم'},
    {text:'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ', count:'دعاء الكرب', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ', count:'مأثور عن النبي ﷺ', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ خَيْرَهُ وَخَيْرَ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ', count:'دعاء لبس الثوب الجديد', ref:'حصن المسلم'},
    {text:'اسْتَخِرِ اللَّهَ: اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ...', count:'دعاء الاستخارة', ref:'حصن المسلم — ذكر حاجته بعدها'},
    {text:'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', count:'دعاء عام للتوبة', ref:'حصن المسلم'}
  ],
  masjid: [
    {text:'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي بَصَرِي نُورًا، وَفِي سَمْعِي نُورًا', count:'الذهاب للمسجد', ref:'حصن المسلم'},
    {text:'أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ، بِسْمِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', count:'عند الدخول', ref:'حصن المسلم'},
    {text:'بِسْمِ اللَّهِ، وَالصَّلَاةُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', count:'عند الخروج', ref:'حصن المسلم'}
  ],
  aam: [
    {text:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', count:'كلمتان خفيفتان على اللسان ثقيلتان في الميزان', ref:'متفق عليه'},
    {text:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count:'كنز من كنوز الجنة', ref:'متفق عليه'},
    {text:'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ', count:'عند رؤية ما يعجبك من نعمة', ref:'حصن المسلم'},
    {text:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', count:'عند الشدة والخوف', ref:'سورة آل عمران: 173'},
    {text:'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا', count:'عند المصيبة', ref:'حصن المسلم'},
    {text:'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', count:'دعاء يونس عليه السلام — عند الكرب', ref:'سورة الأنبياء: 87'},
    {text:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', count:'كثّر منها في يومك', ref:'حصن المسلم'},
    {text:'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', count:'من قالها غُفر له وإن كان فرَّ من الزحف', ref:'حصن المسلم'},
    {text:'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ', count:'عند حصول أمر تسرّ به', ref:'حصن المسلم'},
    {text:'اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ', count:'تُقال بعد كل صلاة مكتوبة', ref:'حصن المسلم'},
    {text:'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ، وَسَلَامٌ عَلَى الْمُرْسَلِينَ، وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', count:'خاتمة جميلة لمجلسك', ref:'سورة الصافات: 180-182'}
  ],
  wake:[{text:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',count:'مرة واحدة',ref:'حصن المسلم'},{text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',count:'مرة واحدة',ref:'حصن المسلم'}],
  travel:[{text:'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',count:'دعاء السفر',ref:'حصن المسلم'},{text:'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',count:'مرة واحدة',ref:'حصن المسلم'}],
  wudu:[{text:'بِسْمِ اللَّهِ',count:'قبل الوضوء',ref:'حصن المسلم'},{text:'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',count:'بعد الوضوء',ref:'رواه مسلم'}],
  worry:[{text:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',count:'مرة واحدة',ref:'حصن المسلم'},{text:'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',count:'عند الكرب',ref:'سورة الأنبياء: 87'}],
  rain:[{text:'اللَّهُمَّ صَيِّبًا نَافِعًا',count:'عند نزول المطر',ref:'صحيح البخاري'},{text:'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّهَا',count:'عند الريح',ref:'صحيح مسلم'}],
  sick:[{text:'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',count:'7 مرات',ref:'رواه أبو داود'},{text:'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي',count:'للمريض',ref:'صحيح البخاري'}],
  friday:[{text:'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',count:'أكثر منها',ref:'يوم الجمعة'},{text:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',count:'مرة واحدة',ref:'سورة البقرة: 201'}]
};

/* ================= RENDER CATEGORY GRID ================= */
const newGrid = document.getElementById('newCatGrid');
newGrid.innerHTML = NEW_CATEGORIES.map(c=>`
  <div class="cat-card" onclick="openSheet('${c.id}')">
    <div class="cat-text">
      <div class="ct-title"><span class="cat-icon" style="background:${c.bg};">${c.icon}</span>${c.title}</div>
      <div class="ct-desc">← ${c.desc}</div>
      <div class="ct-count">${NEW_DHIKR[c.id].length} ذِكرًا</div>
    </div>
  </div>`).join('');

/* ================= SHEET (dhikr detail) ================= */
function openSheet(catId){
  const cat = NEW_CATEGORIES.find(c=>c.id===catId);
  const list = NEW_DHIKR[catId];
  document.getElementById('newSheetTitle').textContent = cat.title;
  document.getElementById('newSheetIcon').textContent = cat.icon;
  document.getElementById('newSheetList').innerHTML = list.map((d,i)=>`
    <div class="dhikr-card">
      <div class="dk-top">
        <span class="dk-idx">${i+1} / ${list.length}</span>
        <span class="dk-count">${d.count}</span>
      </div>
      <div class="dk-text quran">${d.text}</div>
      <div class="dk-ref">${d.ref}</div>
    </div>`).join('');
  const audioBar = document.getElementById('newSheetAudioBar');
  const audioEl = document.getElementById('newSheetAudioEl');
  audioEl.pause();
  document.getElementById('newSaSub').textContent = 'شغّل الصوت لمتابعة القراءة صوتيًا';
  if(cat.hasAudio){
    audioEl.setAttribute('src', cat.audio);
    audioEl.load();
    audioBar.style.display='block';
    audioBar.dataset.audioUrl = cat.audio;
  }else{
    audioEl.removeAttribute('src');
    audioBar.style.display='none';
  }
  document.getElementById('newSheetScroll').scrollTop = 0;
  document.getElementById('newSheetBg')&&document.getElementById('newSheetBg').classList.add('open');
}
function closeSheet(){
  document.getElementById('newSheetBg')&&document.getElementById('newSheetBg').classList.remove('open');
  const audioEl = document.getElementById('newSheetAudioEl');
  audioEl.pause();
}
function showAudioFallback(){
  const audioBar = document.getElementById('newSheetAudioBar');
  const url = audioBar.dataset.audioUrl;
  document.getElementById('newSaSub').innerHTML = `تعذّر التشغيل هنا — <a href="${url}" target="_blank" rel="noopener" style="color:var(--teal);font-weight:800;">اضغط هنا للاستماع مباشرة ↗</a>`;
}
document.getElementById('newSheetAudioEl').addEventListener('error', showAudioFallback);
// Robust audio controls: user gesture starts playback, and switching pages stops it.
document.getElementById('newSheetAudioEl').addEventListener('loadedmetadata',()=>{
  document.getElementById('newSaSub').textContent='اضغط ▶ لتشغيل الورد الصوتي — مشاري راشد العفاسي';
});
document.getElementById('newSheetAudioEl').addEventListener('play',()=>{
  document.getElementById('newSaSub').textContent='يعمل الآن 🎧 — يمكنك الإيقاف أو متابعة القراءة';
});
document.getElementById('newSheetAudioEl').addEventListener('pause',()=>{
  if(!document.getElementById('newSheetAudioEl').ended) document.getElementById('newSaSub').textContent='متوقف مؤقتًا — اضغط ▶ للمتابعة';
});

/* ================= REMINDER ================= */
let remData = JSON.parse(localStorage.getItem('adhkarReminders')||'null') || {sabah:'06:00', masaa:'17:30', on:false};
function updateBellBtn(){
  document.getElementById('remBtn')&&document.getElementById('remBtn').classList.toggle('on', remData.on);
}
function openReminderModal(){
  document.getElementById('remSabah').value = remData.sabah;
  document.getElementById('remMasaa').value = remData.masaa;
  document.getElementById('remModal')&&document.getElementById('remModal').classList.add('open');
}
async function saveReminders(){
  remData.sabah = document.getElementById('remSabah').value;
  remData.masaa = document.getElementById('remMasaa').value;
  remData.on = true;
  localStorage.setItem('adhkarReminders', JSON.stringify(remData));
  document.getElementById('remModal')&&document.getElementById('remModal').classList.remove('open');
  updateBellBtn();
  if('Notification' in window && Notification.permission!=='granted'){
    try{ await Notification.requestPermission(); }catch(e){}
  }
  toast('تم حفظ التذكير — يعمل أثناء فتح الصفحة على جهازك 🔔');
}
document.getElementById('remModal').addEventListener('click', e=>{ if(e.target.id==='remModal') e.currentTarget.classList.remove('open'); });
let lastFiredMinute = null;
setInterval(()=>{
  if(!remData.on) return;
  const now = new Date();
  const hm = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  if(hm===lastFiredMinute) return;
  if(hm===remData.sabah){ fireReminder('🌅 حان وقت أذكار الصباح'); lastFiredMinute=hm; }
  else if(hm===remData.masaa){ fireReminder('🌙 حان وقت أذكار المساء'); lastFiredMinute=hm; }
}, 20000);
function fireReminder(msg){
  toast(msg);
  playReminderChime();
  if('Notification' in window && Notification.permission==='granted'){
    try{ new Notification('حصن المسلم', {body:msg}); }catch(e){}
  }
}
let remAudioCtx = null;
function playReminderChime(){
  try{
    if(!remAudioCtx) remAudioCtx = new (window.AudioContext||window.webkitAudioContext)();
    if(remAudioCtx.state==='suspended') remAudioCtx.resume();
    const now = remAudioCtx.currentTime;
    [988, 1319].forEach((f,i)=>{
      const t0 = now + i*0.2;
      const osc = remAudioCtx.createOscillator();
      const gain = remAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t0);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.2, t0+0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0+0.4);
      osc.connect(gain).connect(remAudioCtx.destination);
      osc.start(t0);
      osc.stop(t0+0.42);
    });
  }catch(e){ /* audio not available */ }
}
updateBellBtn();

/* ================= TOAST ================= */
let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
window.openSheet=openSheet;window.closeSheet=closeSheet;})();
}catch(e){window.__jsErr&&window.__jsErr('block 1',e)}

/* ===== Original inline script 2 ===== */

const KEYS={profile:'habit_profile_v6',moods:'habit_moods_v6',tasks:'habit_tasks_v6',notes:'habit_notes_v6',tasbih:'tasbih_counts_by_date_v4',names:'asma_allah_saved_v3',hadith:'hadith_learning_saved_v1'};
const fixedTasks=[{id:'quran',name:'قراءة القرآن',icon:'📖',type:'ثابت'},{id:'prayers',name:'الصلوات الخمس',icon:'🕌',type:'ثابت'},{id:'adhkar',name:'الأذكار اليومية',icon:'📿',type:'ثابت'}];
const messages=[['وَبَشِّرِ الصَّابِرِينَ','سورة البقرة — الآية 155','🏔️','صبرك اليوم يصنع قوتك غدًا.'],['إِنَّ مَعَ الْعُسْرِ يُسْرًا','سورة الشرح — الآية 6','🌤️','ابدأ بالخطوة الصغيرة، فالثبات أهم من السرعة.'],['وَقُل رَّبِّ زِدْنِي عِلْمًا','سورة طه — الآية 114','📚','كل عادة بسيطة تكررها تبني مستقبلك.']];
const emojiCategories={'😀':['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😐','😶','🙄','😬','🤔','🤭','🤫','🤗','😱','😴','🤤','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶'],'❤️':['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','✨','💫','⭐','🌟','🔥','💥','💯'],'🙏':['🙏','👏','🙌','👐','🤝','👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','💪','🫶','🙏','💐','🌹'],'🎉':['🎉','🎊','🎈','🎁','🎀','🎂','🏆','🥇','🎯','🚀','💡','✅','📌','📝','📚','💻','🧪','🏃','⚽','🎵','🎨','🎮','🎸','🎤'],'🌿':['🌿','🌱','🌲','🌳','🌴','🌵','🌻','🌼','🌷','🌹','🌸','🍀','🍎','🍊','🍋','🍇','🍉','🍓','🍒','🥝','🍕','🍔','☕','🍵'],'🏠':['🏠','🏡','🏢','🏫','🏥','🚗','🚌','✈️','🚲','⏰','📅','📖','📿','🕌','🕋','💼','📦','🔑','🛒','🧹','🛏️']};
const adhkar=[['subhanAllah','سبحان الله','✨'],['alhamdulillah','الحمد لله','🤍'],['allahuAkbar','الله أكبر','☀️'],['laIlaha','لا إله إلا الله','🌙'],['salawat','الصلاة على النبي','🕊️'],['tahlil','لا إله إلا الله وحده…','🤲']];
const TARGET=500;
const PRAYER_TIMES=[{name:'الفجر',icon:'🌅',time:'04:02'},{name:'الظهر',icon:'☀️',time:'12:09'},{name:'العصر',icon:'☁️',time:'15:26'},{name:'المغرب',icon:'🌇',time:'18:02'},{name:'العشاء',icon:'🌙',time:'20:14'}];
const PRAYER_RECORD_KEY='prayer_record_v5';
const PRAYER_SETTINGS_KEY='prayer_settings_v5';
let prayerRecordDate=new Date();
prayerRecordDate.setHours(12,0,0,0);
const names=[['الله','الاسم الجامع للصفات'],['الرحمن','واسع الرحمة'],['الرحيم','الرحيم بعباده'],['الملك','المالك المتصرف'],['القدوس','المنزه عن النقص'],['السلام','السالم من العيوب'],['المؤمن','المؤمّن لعباده'],['المهيمن','الرقيب الحافظ'],['العزيز','الغالب الذي لا يغلب'],['الجبار','الذي يجبر ضعف عباده'],['المتكبر','المتعالي عن صفات الخلق'],['الخالق','الموجد للخلق'],['البارئ','المنشئ للبرية'],['المصور','معطي الخلق صورهم'],['الغفار','كثير المغفرة'],['القهار','القاهر فوق عباده'],['الوهاب','كثير العطاء'],['الرزاق','المتكفل بالأرزاق'],['الفتاح','فاتح أبواب الخير'],['العليم','المحيط بكل علم'],['القابض','يقبض بحكمته'],['الباسط','يبسط الرزق والرحمة'],['الخافض','يخفض بحكمته'],['الرافع','يرفع بفضله'],['المعز','مانح العزة'],['المذل','يذل بعدله'],['السميع','يسمع كل شيء'],['البصير','يرى كل شيء'],['الحكم','الحاكم العدل'],['العدل','المنزه عن الظلم'],['اللطيف','الرفيق بعباده'],['الخبير','العليم بالبواطن'],['الحليم','لا يعاجل بالعقوبة'],['العظيم','عظيم الشأن'],['الغفور','الساتر للذنوب'],['الشكور','يثيب على القليل'],['العلي','العالي فوق خلقه'],['الكبير','الكبير في ذاته'],['الحفيظ','الحافظ لكل شيء'],['المقيت','الموصل للأقوات'],['الحسيب','الكافي والمحاسب'],['الجليل','ذو الجلال'],['الكريم','كثير الخير'],['الرقيب','المطلع على الأعمال'],['المجيب','مجيب الدعاء'],['الواسع','واسع الفضل'],['الحكيم','يضع الأمور مواضعها'],['الودود','المحب لعباده'],['المجيد','كامل المجد'],['الباعث','باعث الخلق'],['الشهيد','المطلع على كل شيء'],['الحق','الثابت الذي لا شك فيه'],['الوكيل','الكفيل بأرزاق عباده'],['القوي','كامل القوة'],['المتين','شديد القوة'],['الولي','ناصر المؤمنين'],['الحميد','المستحق للحمد'],['المحصي','أحصى كل شيء'],['المبدئ','يبدأ الخلق'],['المعيد','يعيد الخلق'],['المحيي','واهب الحياة'],['المميت','مقدر الموت'],['الحي','الكامل الحياة'],['القيوم','القائم بنفسه'],['الواجد','الغني الذي لا يفتقر'],['الماجد','كامل المجد'],['الواحد','المتفرد بالألوهية'],['الصمد','المقصود في الحوائج'],['القادر','كامل القدرة'],['المقتدر','البالغ القدرة'],['المقدم','يقدم من يشاء'],['المؤخر','يؤخر من يشاء'],['الأول','ليس قبله شيء'],['الآخر','ليس بعده شيء'],['الظاهر','فوق خلقه'],['الباطن','المحيط بكل شيء'],['الوالي','المالك للأمور'],['المتعالي','المنزه عن النقص'],['البر','كثير الإحسان'],['التواب','كثير قبول التوبة'],['المنتقم','يعاقب الظالمين'],['العفو','المتجاوز عن الذنوب'],['الرؤوف','شديد الرحمة'],['مالك الملك','المالك لكل شيء'],['ذو الجلال والإكرام','صاحب العظمة والفضل'],['المقسط','العادل'],['الجامع','يجمع الخلق'],['الغني','المستغني عن خلقه'],['المغني','المغني لعباده'],['المانع','يمنع بحكمته'],['الضار','يقدر الضر بحكمته'],['النافع','يقدر النفع'],['النور','منور السماوات والأرض'],['الهادي','المرشد للحق'],['البديع','مبدع الخلق'],['الباقي','الدائم بلا نهاية'],['الوارث','الباقي بعد فناء الخلق'],['الرشيد','الهادي إلى الرشد'],['الصبور','لا يعاجل بالعقوبة']];
const hadiths=[
['h01','إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.','عن عمر بن الخطاب رضي الله عنه — صحيح البخاري، الحديث 1.','ابدأ يومك بنية صالحة؛ فالعمل يقوى بالنية.'],
['h02','لَا يُؤْمِنُ أَحَدُكُمْ حَتَّىٰ يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.','عن أنس رضي الله عنه — متفق عليه.','اجعل الخير الذي تتمناه لنفسك لغيرك أيضًا.'],
['h03','مَنْ لَا يَرْحَمْ لَا يُرْحَمْ.','عن جرير بن عبد الله رضي الله عنه — متفق عليه.','الرحمة بالناس سبب لرحمة الله.'],
['h04','مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ.','عن أبي هريرة رضي الله عنه — متفق عليه.','اختر كلماتك، فالصمت أحيانًا خير.'],
['h05','لَا تَغْضَبْ.','عن أبي هريرة رضي الله عنه — صحيح البخاري، الحديث 6116.','درّب نفسك على ضبط الغضب قبل أن تتصرف.'],
['h06','الطُّهُورُ شَطْرُ الإِيمَانِ.','عن أبي مالك الأشعري رضي الله عنه — صحيح مسلم، الحديث 223.','النظافة والطهارة من أعمال الإيمان.'],
['h07','خَيْرُكُمْ مَنْ تَعَلَّمَ القُرْآنَ وَعَلَّمَهُ.','عن عثمان رضي الله عنه — صحيح البخاري، الحديث 5027.','اجعل لك نصيبًا ثابتًا من القرآن تعليمًا وتعلمًا.'],
['h08','الدِّينُ النَّصِيحَةُ.','عن تميم الداري رضي الله عنه — صحيح مسلم، الحديث 55.','النصيحة الصادقة تكون برفق وإخلاص.'],
['h09','يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا.','عن أنس رضي الله عنه — متفق عليه.','كن سببًا في التيسير والأمل.'],
['h10','إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ.','عن عبد الله بن مسعود رضي الله عنه — صحيح مسلم، الحديث 91.','الجمال المحمود يكون مع حسن الخلق والعمل.'],
['h11','الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ.','عن عبد الله بن عمرو رضي الله عنهما — متفق عليه.','احفظ لسانك ويدك عن أذى الناس.'],
['h12','مَنْ غَشَّنَا فَلَيْسَ مِنَّا.','عن أبي هريرة رضي الله عنه — صحيح مسلم، الحديث 101.','الصدق والأمانة أساس التعامل.'],
['h13','لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا.','عن أبي ذر رضي الله عنه — صحيح مسلم، الحديث 2626.','لا تستصغر أي خير ولو كان بسيطًا.'],
['h14','تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ.','عن أبي ذر رضي الله عنه — رواه الترمذي، الحديث 1956.','ابتسامتك عمل يسير وأثره جميل.'],
['h15','مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ.','عن أبي هريرة رضي الله عنه — صحيح مسلم، الحديث 2699.','استمرارك في التعلم عبادة إذا صلحت النية.'],
['h16','أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ.','عن عائشة رضي الله عنها — متفق عليه.','القليل المستمر أفضل من الحماس المنقطع.'],
['h17','إِنَّ اللَّهَ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ.','عن عائشة رضي الله عنها — صحيح البخاري، الحديث 6024.','الرفق يجمّل التعامل ويخفف المشكلات.'],
['h18','الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ.','عن أبي هريرة رضي الله عنه — متفق عليه.','قل كلمة طيبة كل يوم.'],
['h19','مَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ.','عن ابن عمر رضي الله عنهما — متفق عليه.','ساعد غيرك فيما تستطيع.'],
['h20','المُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا.','عن أبي موسى الأشعري رضي الله عنه — متفق عليه.','التعاون يقوي المجتمع ويعين على الخير.'],
['h21','لَا ضَرَرَ وَلَا ضِرَارَ.','عن أبي سعيد الخدري رضي الله عنه — رواه ابن ماجه، الحديث 2340.','تجنب إيذاء نفسك والآخرين.'],
['h22','اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا.','عن أبي ذر ومعاذ رضي الله عنهما — رواه الترمذي، الحديث 1987.','إذا أخطأت فبادر بحسنة واستغفار.'],
['h23','احْفَظِ اللَّهَ يَحْفَظْكَ.','عن ابن عباس رضي الله عنهما — رواه الترمذي، الحديث 2516.','احفظ حدود الله في السر والعلن.'],
['h24','اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ.','عن ابن عباس رضي الله عنهما — رواه الحاكم.','استثمر صحتك ووقتك وشبابك قبل زوالها.'],
['h25','مَنْ صَمَتَ نَجَا.','عن عبد الله بن عمرو رضي الله عنهما — رواه الترمذي.','لا تدخل في كلام يوقعك في الخطأ.'],
['h26','المَرْءُ مَعَ مَنْ أَحَبَّ.','عن أنس رضي الله عنه — متفق عليه.','اختر من تحبهم وصحبتك بعناية.'],
['h27','الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ.','عن عمران بن حصين رضي الله عنه — متفق عليه.','الحياء خلق يحجز عن القبيح ويقود للخير.'],
['h28','مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ.','عن أبي هريرة رضي الله عنه — رواه الترمذي وأبو داود.','عوّد نفسك على شكر من أحسن إليك.'],
['h29','مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ.','عن أبي مسعود الأنصاري رضي الله عنه — صحيح مسلم، الحديث 1893.','شارك الخير ولو بالدلالة عليه.'],
['h30','إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ.','عن أبي هريرة رضي الله عنه — صحيح مسلم، الحديث 2564.','اهتم بصلاح القلب والعمل قبل المظهر.']
];
let selectedDate=new Date(),view='week',activeDhikr='subhanAllah',selectedTaskIcon='⭐',toastTimer;
selectedDate.setHours(12,0,0,0);
const $=id=>document.getElementById(id);
function load(k,f={}){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);x.setHours(12,0,0,0);return x}
function arDate(d){return window.formatAppDate(d)}
function toast(t){$('toast').textContent=t;$('toast')&&$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast')&&$('toast').classList.remove('show'),1400)}
function monthParts(d){return{ar:new Intl.DateTimeFormat('ar-EG',{month:'long',year:'numeric'}).format(d),en:new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(d)}}
function renderWelcome(){const p=load(KEYS.profile,{name:'',image:''}),h=new Date().getHours();$('welcomeDate').textContent=arDate(new Date());$('greetingText').textContent=(h>=5&&h<12?'صباح الخير':'مساء الخير')+(p.name?' يا '+p.name:' يا صديقي');$('avatarImage').hidden=!p.image;$('avatarFallback').hidden=!!p.image;if(p.image)$('avatarImage').src=p.image}
function renderInspiration(){const n=Math.floor((selectedDate-new Date(selectedDate.getFullYear(),0,0))/86400000)%messages.length,m=messages[n];$('verseText').textContent=m[0];$('verseSource').textContent=m[1];$('verseIcon').textContent=m[2];$('wisdomText').textContent=m[3]}
function weekStart(d){const x=new Date(d);x.setDate(x.getDate()-((x.getDay()+1)%7));return x}
function renderCalendar(){const start=view==='week'?weekStart(selectedDate):new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1),m=monthParts(selectedDate);$('calendarSelectedDate').querySelector('.ar-month').textContent=m.ar;$('calendarSelectedDate').querySelector('.en-month').textContent=m.en;$('dateRow').innerHTML='';for(let i=0;i<7;i++){const d=addDays(start,i),b=document.createElement('button');b.className='date-btn'+(dateKey(d)===dateKey(selectedDate)?' active':'');b.innerHTML=`<span class="date-pill">${d.getDate()}</span><span class="date-day">${new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(d).toUpperCase()}</span>`;b.onclick=()=>{selectedDate=d;renderAll()};$('dateRow').appendChild(b)}}
function taskData(d){const all=load(KEYS.tasks,{}),k=dateKey(d);if(!all[k]){all[k]={tasks:fixedTasks.map(x=>({...x,done:false}))};save(KEYS.tasks,all)}return all[k].tasks}
function saveTaskData(d,t){const all=load(KEYS.tasks,{});all[dateKey(d)]={tasks:t};save(KEYS.tasks,all)}
function taskStats(d){const t=taskData(d),done=t.filter(x=>x.done).length;return{tasks:t,done,total:t.length,p:t.length?Math.round(done/t.length*100):0}}
function renderTasks(){const s=taskStats(selectedDate);$('taskList').innerHTML='';$('summaryProgress').style.setProperty('--p',s.p+'%');$('summaryPercent').textContent=s.p+'%';$('summaryMessage').textContent=s.p===100?'رائع! أنجزت الكل 🎉':s.p?`أنجزت ${s.done}/${s.total} مهام`:'ابدأ أول مهمة 🌱';s.tasks.forEach(t=>{const li=document.createElement('li');li.className='task'+(t.done?' done':'');li.innerHTML=`<button class="check ${t.done?'checked':''}">✓</button><span class="task-icon">${t.icon}</span><span class="task-name"></span>${t.type==='مخصص'?'<button class="delete">🗑</button>':'<span></span>'}`;li.querySelector('.task-name').textContent=t.name;li.querySelector('.check').onclick=()=>{const a=taskData(selectedDate),x=a.find(y=>y.id===t.id);x.done=!x.done;saveTaskData(selectedDate,a);renderAll()};const del=li.querySelector('.delete');if(del)del.onclick=()=>{saveTaskData(selectedDate,taskData(selectedDate).filter(x=>x.id!==t.id));renderAll()};$('taskList').appendChild(li)})}
function renderMood(){const m=load(KEYS.moods,{})[dateKey(selectedDate)]||'';$('moodDateLabel').textContent=arDate(selectedDate);document.querySelectorAll('.mood-btn').forEach(b=>b.classList.toggle('active',b.dataset.mood===m));$('bear').className='bear '+(m?m.toLowerCase():'calm')}
function renderNotes(){$('noteInput').value=load(KEYS.notes,{})[dateKey(selectedDate)]||''}
function saveNote(){const n=load(KEYS.notes,{});n[dateKey(selectedDate)]=$('noteInput').value;save(KEYS.notes,n)}
function historyHTML(target){
  if(!target)return;
  const all=load(KEYS.tasks,{}), notes=load(KEYS.notes,{}), today=new Date();
  const escape=v=>{const el=document.createElement('div');el.textContent=(v!=null?v:'');return el.innerHTML};
  const days=[];
  for(let i=0;i<30;i++){
    const d=addDays(today,-i),k=dateKey(d),record=all[k];
    let tasks=record&&record.tasks?record.tasks:record;
    if(!Array.isArray(tasks))tasks=[];
    const note=notes[k]||'';
    if(tasks.length||String(note).trim())days.push({d,k,tasks,note});
  }
  if(!days.length){
    target.innerHTML='<div class="history-empty-card">لا يوجد سجل محفوظ حتى الآن.</div>';
    return;
  }
  target.innerHTML=days.map(({d,k,tasks,note})=>{
    const done=tasks.filter(x=>x&&x.done).length;
    const items=tasks.map(x=>`<span class="history-task-pill ${x.done?'done':''}">${escape(x.icon||'🎯')} ${escape(x.name||x.text||'مهمة')}</span>`).join('');
    return `<article class="history-day-card">
      <div class="history-day-head"><strong>${k}</strong><span>${done} من ${tasks.length} مكتملة</span></div>
      <div class="history-task-pills">${items||'<span class="history-task-pill empty">لا توجد مهام</span>'}</div>
      ${String(note).trim()?`<div class="history-day-note">📝 ${escape(note)}</div>`:''}
    </article>`;
  }).join('');
}
function renderHistory(){historyHTML($('historyList'));historyHTML($('fullHistoryList'))}
function renderStats(){const s=taskStats(selectedDate);$('statToday').textContent=s.p+'%';let n=0;for(let i=0;i<7;i++)n+=taskStats(addDays(selectedDate,-i)).done;$('statWeek').textContent=n}
function emptyCount(){const x={};adhkar.forEach(a=>x[a[0]]=0);return x}
function todayCount(){const all=load(KEYS.tasbih,{}),k=dateKey(new Date());if(!all[k]){all[k]=emptyCount();save(KEYS.tasbih,all)}return all[k]}
function renderPrayer(){
  const today=new Date();
  const days=Array.from({length:7},(_,i)=>addDays(today,i-6));
  const vals=days.map(d=>{const all=load(KEYS.tasbih,{}),c=all[dateKey(d)]||emptyCount();return Object.values(c).reduce((a,b)=>a+b,0)});
  $('tasbihHomeDate').textContent=arDate(today);
  $('weekTotal').textContent=vals.reduce((a,b)=>a+b,0);
  $('weeklyChart').innerHTML=days.map((d,i)=>{
    const raw=vals[i];
    const percent=raw?Math.round((raw/TARGET)*100):0;
    const barHeight=raw?Math.min(104,Math.max(10,Math.round(18+Math.sqrt(raw/TARGET)*65))):8;
    const isToday=dateKey(d)===dateKey(today);
    const exceeded=raw>TARGET;
    const isGold=raw>500;
    return `<div class="chart-col ${isToday?'today':''}">
      ${exceeded?'<span class="chart-star">⭐</span>':''}
      <span class="chart-percent">${percent}%</span>
      <div class="chart-value ${isGold?'gold':''}" style="height:${barHeight}px"></div>
      <span class="chart-day">${new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(d).toUpperCase()}</span>
    </div>`;
  }).join('');
  renderNamesProgress();
  renderPrayersToday();
}
function pad2(v){return String(v).padStart(2,'0')}
function prayerSettings(){return load(PRAYER_SETTINGS_KEY,{muted:false,notifications:false})}
function arabicTime(value){let[h,m]=value.split(':').map(Number);const suffix=h>=12?'م':'ص';h=h%12||12;return `${h}:${pad2(m)} ${suffix}`}
function nextPrayerCalc(){const now=new Date();for(const p of PRAYER_TIMES){const [h,m]=p.time.split(':').map(Number);const target=new Date();target.setHours(h,m,0,0);if(target>now)return{prayer:p,target}}const p=PRAYER_TIMES[0],[h,m]=p.time.split(':').map(Number),target=new Date();target.setDate(target.getDate()+1);target.setHours(h,m,0,0);return{prayer:p,target}}
function updateRemaining(){const n=nextPrayerCalc(),diff=n.target-new Date(),rt=$('remainingTime'),np=$('nextPrayerName');if(!rt||!np)return;rt.textContent=`${pad2(Math.floor(diff/3600000))}:${pad2(Math.floor((diff%3600000)/60000))}:${pad2(Math.floor((diff%60000)/1000))}`;np.textContent='صلاة '+n.prayer.name}
function allPrayerRecords(){return load(PRAYER_RECORD_KEY,{})}
function prayerRecordFor(d){return allPrayerRecords()[dateKey(d)]||{}}
function setPrayerRecord(d,value){const all=allPrayerRecords();all[dateKey(d)]=value;save(PRAYER_RECORD_KEY,all)}
function renderPrayersToday(){const next=nextPrayerCalc().prayer.name,done=prayerRecordFor(new Date());$('prayerTimesDateLabel').textContent=arDate(new Date());$('prayersList').innerHTML='';PRAYER_TIMES.forEach(p=>{const card=document.createElement('article');card.className='pt-prayer'+(p.name===next?' next':'')+(done[p.name]?' done':'');card.innerHTML=`<span class="pt-prayer-icon">${p.icon}</span><span class="pt-prayer-name">${p.name}</span><span class="pt-prayer-time">${arabicTime(p.time)}</span><button class="pray-check">✓</button>`;card.querySelector('.pray-check').onclick=()=>{const d=prayerRecordFor(new Date());d[p.name]=!d[p.name];setPrayerRecord(new Date(),d);renderPrayersToday();toast(d[p.name]?'تم تسجيل صلاة '+p.name+' ✓':'تم إلغاء تسجيل '+p.name)};$('prayersList').appendChild(card)});const s=prayerSettings();$('notificationButton')&&$('notificationButton').classList.toggle('on',s.notifications);$('muteButton')&&$('muteButton').classList.toggle('muted',s.muted);$('muteButton').textContent=s.muted?'🔇':'🔊'}
function renderPrayerRecordPage(){const today=new Date();today.setHours(12,0,0,0);$('prayerRecordDateLabel').textContent=arDate(prayerRecordDate);$('prayerDateStrip').innerHTML='';for(let i=-3;i<=3;i++){const d=addDays(today,i),b=document.createElement('button');b.className='date-chip'+(dateKey(d)===dateKey(prayerRecordDate)?' active':'');b.textContent=i===0?'اليوم':i===-1?'أمس':i===1?'غدًا':new Intl.DateTimeFormat('ar-EG',{day:'numeric',month:'short'}).format(d);b.onclick=()=>{prayerRecordDate=d;renderPrayerRecordPage()};$('prayerDateStrip').appendChild(b)}const future=prayerRecordDate>today,done=prayerRecordFor(prayerRecordDate);$('prayerRecordList').innerHTML='';PRAYER_TIMES.forEach(p=>{const row=document.createElement('article');row.className='record-row'+(done[p.name]?' done':'');row.innerHTML=`<div class="record-left"><span class="record-icon">${p.icon}</span><span><b>${p.name}</b><small>${arabicTime(p.time)}</small></span></div><button class="record-check" ${future?'disabled':''}>${done[p.name]?'✓':''}</button>`;row.querySelector('.record-check').onclick=()=>{if(future)return;const r=prayerRecordFor(prayerRecordDate);r[p.name]=!r[p.name];setPrayerRecord(prayerRecordDate,r);renderPrayerRecordPage();if(dateKey(prayerRecordDate)===dateKey(today))renderPrayersToday()};$('prayerRecordList').appendChild(row)});$('prayerFutureNote').textContent=future?'الأيام القادمة تعرض المواقيت فقط.':'اضغط على الدائرة بعد أداء الصلاة لتسجيلها.'}
function renderSelector(){$('dhikrSelector').innerHTML=adhkar.map(a=>`<button class="dhikr ${a[0]===activeDhikr?'active':''}" data-d="${a[0]}"><span class="dhikr-icon">${a[2]}</span><span class="dhikr-label">${a[1]}</span></button>`).join('');document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{activeDhikr=b.dataset.d;renderCounter()})}
function renderCounterLog(){const c=todayCount();$('counterLog').innerHTML=adhkar.map(a=>{const n=c[a[0]]||0,p=Math.min(100,Math.round(n/TARGET*100));return `<div class="log-row"><div class="log-icon">${a[2]}</div><div><span class="log-name">${a[1]}</span><div class="log-track"><div class="log-fill" style="width:${p}%"></div></div></div><span class="log-count">${n}/${TARGET}</span></div>`}).join('')}
function renderCounter(){const a=adhkar.find(x=>x[0]===activeDhikr),c=todayCount();$('counterDate').textContent=arDate(new Date());$('activeDhikrName').textContent=a[1];$('activeDhikrTarget').textContent='الهدف اليومي: '+TARGET+' مرة';$('activeCount').textContent=c[a[0]]||0;renderSelector();renderCounterLog()}
function getSavedNames(){return load(KEYS.names,[])}
function renderNamesProgress(){const s=getSavedNames(),p=Math.round(s.length/names.length*100);$('miniNames').textContent=`${s.length} / ${names.length}`;if($('nameSaved')){$('nameSaved').textContent=s.length;$('namePercent').textContent=p+'%';$('nameRing').style.setProperty('--p',p+'%');$('nameFill').style.width=p+'%'}}
function renderNames(){const grid=$('namesGrid');if(!grid)return;const saved=getSavedNames();grid.innerHTML=names.map((n,i)=>`<button type="button" class="name-card ${saved.includes(i)?'saved':''}" data-name="${i}"><span class="name-number">${i+1}</span><span class="name-check">✓</span><span class="allah-name">${n[0]}</span><span class="name-meaning">${n[1]}</span></button>`).join('');grid.querySelectorAll('[data-name]').forEach(b=>b.onclick=()=>{const i=+b.dataset.name,s=getSavedNames(),p=s.indexOf(i);if(p<0){s.push(i);toast('تم حفظ: '+names[i][0]+' ✓')}else{s.splice(p,1);toast('تم إلغاء الحفظ')}s.sort((a,b)=>a-b);save(KEYS.names,s);renderNames();});renderNamesProgress()}
function getSavedHadith(){return load(KEYS.hadith,[])}
function renderHadith(){const list=$('hadithList');if(!list)return;const day=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/86400000),pair=[hadiths[(day*2)%hadiths.length],hadiths[(day*2+1)%hadiths.length]],s=getSavedHadith(),p=Math.round(s.length/hadiths.length*100),todayKey=new Date().toISOString().slice(0,10);let daily=JSON.parse(localStorage.getItem('daily_hadith_done_v1')||'[]');daily=Array.isArray(daily)?daily:[];const isDone=daily.includes(todayKey);$('hadithDate').textContent=arDate(new Date());$('hadithSaved').textContent=s.length;$('hadithTotal').textContent=hadiths.length;$('hadithPercent').textContent=p+'%';$('hadithRing').style.setProperty('--p',p+'%');$('hadithFill').style.width=p+'%';list.innerHTML=`<div class="daily-learning-bar"><div class="daily-meta"><b>📅 حديثا اليوم · ${arDate(new Date())}</b><small>يظهر لك حديثان من مكتبة البرنامج يوميًا، مع المعنى العملي والشرح المختصر.</small></div><button type="button" class="daily-done-btn ${isDone?'done':''}" id="hadithDoneBtn">${isDone?'✓ أتممت اليوم':'أتممت حديث اليوم'}</button></div><p class="hadith-count-note">احفظ الحديث الذي تريد مراجعته لاحقًا، وسجّل إتمام درس اليوم عند الانتهاء.</p>`+pair.map((h,i)=>`<article class="hadith-card ${s.includes(h[0])?'saved':''}"><div class="hadith-head"><span class="hadith-number"><i>${i+1}</i>حديث اليوم</span><button type="button" class="save-hadith" data-hadith="${h[0]}">${s.includes(h[0])?'✓':'حفظ'}</button></div><p class="hadith-text">${h[1]}</p><p class="hadith-source">${h[2]}</p><p class="hadith-meaning"><b>المعنى والشرح:</b> ${h[3]}</p></article>`).join('');list.querySelectorAll('[data-hadith]').forEach(b=>b.onclick=()=>{const id=b.dataset.hadith,a=getSavedHadith(),i=a.indexOf(id);if(i<0){a.push(id);toast('تم حفظ الحديث ✓')}else{a.splice(i,1);toast('تم إلغاء حفظ الحديث')}save(KEYS.hadith,a);renderHadith()});list.querySelector('#hadithDoneBtn').onclick=()=>{let a=JSON.parse(localStorage.getItem('daily_hadith_done_v1')||'[]');if(!Array.isArray(a))a=[];if(!a.includes(todayKey))a.push(todayKey);a=a.slice(-60);localStorage.setItem('daily_hadith_done_v1',JSON.stringify(a));toast('تم تسجيل إتمام حديث اليوم ✓');renderHadith()}}
function showPage(id){document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.style.display='none'});const target=$(id+'Page');if(!target){toast('تعذر فتح الصفحة');return}target.classList.add('active');target.style.display='block';if(id==='prayer'){$('counterPage')&&$('counterPage').classList.remove('show');$('prayerHome').style.display='block';renderPrayer()}if(id==='names')renderNames();if(id==='hadith')renderHadith();if(id==='prayerRecord')renderPrayerRecordPage();window.scrollTo({top:0,behavior:'smooth'})}
function renderAll(){renderWelcome();renderInspiration();renderCalendar();renderMood();renderTasks();renderHistory();renderNotes();renderStats();renderPrayer()}
function renderPicker(tabs,grid,onPick){const cats=Object.keys(emojiCategories);tabs.innerHTML='';function show(cat){grid.innerHTML=emojiCategories[cat].map(e=>`<button class="emoji-choice" type="button">${e}</button>`).join('');grid.querySelectorAll('.emoji-choice').forEach(b=>b.onclick=()=>onPick(b.textContent))}cats.forEach((cat,i)=>{const b=document.createElement('button');b.type='button';b.className='emoji-tab'+(i===0?' active':'');b.textContent=cat;b.onclick=()=>{tabs.querySelectorAll('.emoji-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');show(cat)};tabs.appendChild(b)});show(cats[0])}
document.querySelectorAll('.period').forEach(b=>b.onclick=()=>{document.querySelectorAll('.period').forEach(x=>x.classList.remove('active'));b.classList.add('active');view=b.dataset.view;renderCalendar()});
document.querySelectorAll('.mood-btn').forEach(b=>b.onclick=()=>{const m=load(KEYS.moods,{});m[dateKey(selectedDate)]=b.dataset.mood;save(KEYS.moods,m);renderMood()});
/* tasksTab / historyTab switching + rendering is bound once (see openHistory() below in the goals script). */
$('noteInput').oninput=saveNote;
$('saveNote').onclick=()=>{saveNote();toast('تم حفظ الملاحظة ✓')};
$('addStar').onclick=()=>{$('noteInput').value+=' ✨';saveNote()};
$('addHeart').onclick=()=>{$('noteInput').value+=' ❤️';saveNote()};
$('emojiToggle').onclick=()=>$('noteEmojiPanel')&&$('noteEmojiPanel').classList.toggle('show');
renderPicker($('noteEmojiTabs'),$('noteEmojiGrid'),e=>{$('noteInput').value+=e;saveNote();$('noteInput').focus()});
$('openTaskModal').onclick=()=>{$('taskNameInput').value='';selectedTaskIcon='⭐';$('selectedTaskIcon').textContent='⭐';$('taskEmojiPanel')&&$('taskEmojiPanel').classList.remove('show');$('taskOverlay')&&$('taskOverlay').classList.add('show')};
$('taskEmojiToggle').onclick=()=>$('taskEmojiPanel')&&$('taskEmojiPanel').classList.toggle('show');
renderPicker($('taskEmojiTabs'),$('taskEmojiGrid'),e=>{selectedTaskIcon=e;$('selectedTaskIcon').textContent=e;$('taskEmojiPanel')&&$('taskEmojiPanel').classList.remove('show')});
$('cancelTask').onclick=()=>$('taskOverlay')&&$('taskOverlay').classList.remove('show');
$('saveTask').onclick=()=>{const n=$('taskNameInput').value.trim();if(!n){toast('اكتب اسم المهمة أولًا');return}const a=taskData(selectedDate);a.push({id:'custom_'+Date.now(),name:n,icon:selectedTaskIcon,type:'مخصص',done:false});saveTaskData(selectedDate,a);$('taskOverlay')&&$('taskOverlay').classList.remove('show');renderAll()};
$('openProfile').onclick=()=>{$('profileOverlay')&&$('profileOverlay').classList.add('show');$('nameInput').value=load(KEYS.profile,{name:''}).name||''};
$('settingsProfile').onclick=()=>$('openProfile').click();
$('cancelProfile').onclick=()=>$('profileOverlay')&&$('profileOverlay').classList.remove('show');
$('saveProfile').onclick=()=>{const old=load(KEYS.profile,{}),name=$('nameInput').value.trim(),file=$('imageInput').files[0],finish=image=>{save(KEYS.profile,{name,image:image||old.image||''});$('profileOverlay')&&$('profileOverlay').classList.remove('show');renderWelcome()};if(file){const r=new FileReader();r.onload=e=>finish(e.target.result);r.readAsDataURL(file)}else finish('')};
document.querySelectorAll('.overlay').forEach(x=>x.onclick=e=>{if(e.target===x)x.classList.remove('show')});
$('openCounter').onclick=()=>{$('prayerHome').style.display='none';$('counterPage')&&$('counterPage').classList.add('show');renderCounter()};
$('backToPrayer').onclick=()=>{$('counterPage')&&$('counterPage').classList.remove('show');$('prayerHome').style.display='block';renderPrayer()};
$('openPrayerRecordBtn').onclick=()=>{prayerRecordDate=new Date();prayerRecordDate.setHours(12,0,0,0);showPage('prayerRecord')};
$('midQuranBtn').onclick=()=>toast('القرآن الكريم قريبًا بإذن الله');
$('midAzkarBtn').onclick=()=>showPage('adhkar');
$('openQiblaBtn').onclick=()=>showPage('qibla');
$('getLocationBtn').onclick=()=>toast('موقع الهاتف مخصص لحساب القبلة فقط؛ اختر المحافظة لمواقيت الصلاة.');

$('notificationButton').onclick=async()=>{const s=prayerSettings();if(!s.notifications&&'Notification'in window){const p=await Notification.requestPermission();if(p!=='granted')return toast('لم يتم السماح بالإشعارات')}s.notifications=!s.notifications;save(PRAYER_SETTINGS_KEY,s);renderPrayersToday();toast(s.notifications?'تم تفعيل تنبيهات الصلاة':'تم إيقاف تنبيهات الصلاة')};
$('muteButton').onclick=()=>{const s=prayerSettings();s.muted=!s.muted;save(PRAYER_SETTINGS_KEY,s);renderPrayersToday();toast(s.muted?'تم كتم صوت الأذان':'تم تشغيل صوت الأذان')};
updateRemaining();
setInterval(updateRemaining,1000);
$('tasbihButton').onclick=()=>{const c=todayCount(),a=adhkar.find(x=>x[0]===activeDhikr);c[a[0]]++;save(KEYS.tasbih,{...load(KEYS.tasbih,{}),[dateKey(new Date())]:c});if(navigator.vibrate)navigator.vibrate(10);renderCounter();renderPrayer()};
$('resetCurrentDhikr').onclick=()=>{const c=todayCount();c[activeDhikr]=0;save(KEYS.tasbih,{...load(KEYS.tasbih,{}),[dateKey(new Date())]:c});renderCounter();renderPrayer()};
$('openNames').onclick=()=>showPage('names');
$('openHadith').onclick=()=>showPage('hadith');
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>showPage(b.dataset.back));
document.querySelectorAll('.nav button[data-page]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav button[data-page]').forEach(x=>x.classList.remove('active'));b.classList.add('active');showPage(b.dataset.page)});
$('goalsNavBtn').onclick=()=>$('goalsOverlay')&&$('goalsOverlay').classList.add('open');
 document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.page;if(id){document.getElementById('goalsOverlay')&&document.getElementById('goalsOverlay').classList.remove('open');document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');showPage(id)}else if(btn.id==='goalsNavBtn'){document.getElementById('goalsOverlay')&&document.getElementById('goalsOverlay').classList.add('open')}}));

 document.querySelectorAll('[data-goal-nav]').forEach(btn=>btn.addEventListener('click',()=>{const target=btn.dataset.goalNav;if(target==='goals')return;document.getElementById('goalsOverlay')&&document.getElementById('goalsOverlay').classList.remove('open');if(target==='adhkar')showPage('adhkar');else showPage(target)}));

renderAll();
