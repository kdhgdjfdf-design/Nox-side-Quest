/* NOX SIDE QUEST — دروس تفاعلية: القط يعلّمك ثم يختبرك.
   يعتمد على متغيّرات app.js العامة: state, save, today, todaysCompletions, toast, quests */
(function(){
'use strict';
const CAT='<svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><path d="M9 28 12 6 27 17Z" fill="#f2a65a"/><path d="M55 28 52 6 37 17Z" fill="#f2a65a"/><path d="M14 22 15 12 22 17Z" fill="#f7b6c2"/><path d="M50 22 49 12 42 17Z" fill="#f7b6c2"/><ellipse cx="32" cy="37" rx="24" ry="21" fill="#f2a65a"/><path d="M26 17 28 24M32 15V23M38 17 36 24" stroke="#c97a2e" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="22.5" cy="35" rx="3.2" ry="4" fill="#1b1530"/><ellipse cx="41.5" cy="35" rx="3.2" ry="4" fill="#1b1530"/><circle cx="23.5" cy="33.6" r="1.1" fill="#fff"/><circle cx="42.5" cy="33.6" r="1.1" fill="#fff"/><path d="M29.5 42h5l-2.5 3z" fill="#e5788f"/><path d="M32 45v2.5M32 47.5q-3 3-6 1M32 47.5q3 3 6 1" stroke="#1b1530" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M6 40 17 41M6 46 17 44M58 40 47 41M58 46 47 44" stroke="#fbe3c4" stroke-width="1.4" stroke-linecap="round"/></svg>';
const SPEAKER='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';

function h(tag,attrs){
 const e=document.createElement(tag);
 for(const k in (attrs||{})){const v=attrs[k];
  if(k==='class')e.className=v;else if(k==='style')e.style.cssText=v;
  else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v)}
 for(let i=2;i<arguments.length;i++){const c=arguments[i];
  [].concat(c).forEach(x=>{if(x==null||x===false)return;e.append(x.nodeType?x:document.createTextNode(x))})}
 return e;
}
function svg(str){const t=document.createElement('template');t.innerHTML=str.trim();return t.content.firstChild}
function shuf(a){return a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1])}
function speak(text,lang){try{if(!('speechSynthesis'in window))return;const u=new SpeechSynthesisUtterance(text);u.lang=lang;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}

/* ---------- عناصر مرئية ---------- */
function wordCard(eyebrow,big,say,sub,lang){
 return ()=>h('div',{class:'lv-card'},
  h('div',{class:'lv-eyebrow'},eyebrow),
  h('div',{class:'lv-row'},
   lang?h('button',{class:'lv-speak','aria-label':'استمع للنطق',type:'button',onclick:()=>speak(big,lang)},svg(SPEAKER)):null,
   h('div',{class:'lv-big',dir:lang?'ltr':'rtl'},big)),
  say?h('div',{class:'lv-sub'},say):null,
  sub?h('div',{class:'lv-green'},sub):null);
}
function infoCard(badge,big,text){
 return ()=>h('div',{class:'lv-card'},
  badge?h('div',{class:'lv-badge'},badge):null,
  h('div',{class:'lv-big'},big),
  h('div',{class:'lv-text'},text));
}
const GL={K:'♚︎',Q:'♛︎',R:'♜︎',B:'♝︎',N:'♞︎',P:'♟︎'};
function chess(pos,from,to){
 return ctx=>{
  const p=Object.assign({},pos);
  if(ctx.phase==='after'){p[to]=p[from];delete p[from]}
  const grid=h('div',{class:'lv-board',dir:'ltr',role:'img','aria-label':'رقعة شطرنج'});
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
   const sq='abcdefgh'[c]+(8-r),pc=p[sq];
   let bg=(r+c)%2===0?'#dfe5f5':'#5b6fa8',ring='';
   if(ctx.phase!=='after'&&sq===from)bg='#ffd76a';
   if(ctx.phase==='teach'&&sq===to)ring='box-shadow:inset 0 0 0 3px #3ecf8e;';
   if(ctx.phase==='after'&&sq===to)bg='#7be0b4';
   if(ctx.phase==='after'&&sq===from)bg='#b8c6a0';
   const white=pc&&pc[0]==='w';
   grid.append(h('div',{class:'lv-sq'+(white?' w':''),style:'background:'+bg+';'+ring},pc?GL[pc[1]]:''));
  }
  return grid;
 };
}
function body(organ){
 const f=(id,c)=>organ===id?c:'#3d4f85';
 return ()=>svg('<svg class="lv-body" viewBox="0 0 130 280" role="img" aria-label="رسم لجسم إنسان بلا ملامح مع تمييز العضو"><circle cx="65" cy="30" r="22" fill="#2a3a63"/><rect x="57" y="50" width="16" height="14" rx="5" fill="#2a3a63"/><path d="M30 68 Q65 58 100 68 L106 150 Q65 168 24 150 Z" fill="#2a3a63"/><path d="M30 70 L14 140 L24 144 L40 84Z" fill="#2a3a63"/><path d="M100 70 L116 140 L106 144 L90 84Z" fill="#2a3a63"/><path d="M36 152 L40 262 L56 262 L65 176 L74 262 L90 262 L94 152Z" fill="#2a3a63"/><path d="M65 6 Q48 8 46 26 Q46 44 65 50 Q84 44 84 26 Q82 8 65 6Z" fill="'+f('brain','#c79bff')+'"/><path d="M44 80 Q52 76 60 84 L58 118 Q48 122 42 112Z" fill="'+f('lungs','#5ec8ff')+'"/><path d="M86 80 Q78 76 70 84 L72 118 Q82 122 88 112Z" fill="'+f('lungs','#5ec8ff')+'"/><path d="M69 98 Q78 90 84 98 Q86 110 72 124 Q58 110 62 98 Q66 92 69 98Z" fill="'+f('heart','#ff6b7a')+'"/><path d="M56 128 Q76 124 82 134 Q82 148 66 148 Q52 146 56 128Z" fill="'+f('stomach','#ffb86b')+'"/></svg>');
}
function code(src,out){
 return ctx=>h('div',{class:'lv-code'},
  h('pre',{dir:'ltr',class:'lv-pre'},src),
  h('pre',{dir:'ltr',class:'lv-out'},(ctx.phase==='ask'?'> ...':'> '+out)));
}
function trans(kind){
 return ctx=>{
  const show=ctx.phase!=='ask';
  let b='opacity:0';
  if(show&&kind==='fade')b='opacity:.55;left:0;width:100%';
  if(show&&kind==='slide')b='opacity:1;left:45%;width:55%';
  if(show&&kind==='cut')b='opacity:1;left:0;width:100%';
  return h('div',{class:'lv-trans',dir:'ltr'},
   h('i',{class:'a'}),h('i',{class:'b'}),h('i',{class:'sceneB',style:b}),
   h('em',null,show?{cut:'قطع مباشر',fade:'تلاشي',slide:'انزلاق'}[kind]:'مشهد واحد'));
 };
}
function egg(stage){
 return ()=>svg('<svg class="lv-egg" viewBox="0 0 300 150" role="img" aria-label="مقلاة على النار وبيضة تُقلى"><path d="M70 118 Q150 142 230 118" stroke="#ff9a4d" stroke-width="5" stroke-linecap="round" fill="none"/><ellipse cx="140" cy="86" rx="92" ry="30" fill="#2b3350"/><ellipse cx="140" cy="80" rx="82" ry="24" fill="#1a1f33"/><rect x="228" y="76" width="64" height="12" rx="6" fill="#2b3350"/><g opacity="'+(stage>=2?1:0)+'"><path d="M96 80 Q100 62 132 64 Q150 58 172 66 Q192 76 178 92 Q150 100 116 94 Q92 92 96 80Z" fill="#f4f1e8"/><circle cx="140" cy="78" r="15" fill="#ffb020"/><circle cx="135" cy="73" r="4" fill="#ffd36e"/></g><g opacity="'+(stage>=0?1:0)+'" stroke="#a8b3d1" stroke-width="3" stroke-linecap="round" fill="none"><path d="M104 46 Q98 36 106 28 Q112 20 106 12"/><path d="M140 42 Q134 32 142 24 Q148 16 142 8"/><path d="M176 46 Q170 36 178 28 Q184 20 178 12"/></g></svg>');
}
function Q(ask,qtext,ok,bad,visual,extra){return Object.assign({type:'quiz',ask:ask,q:qtext,options:[ok].concat(bad),ok:ok,visual:visual},extra||{})}
function T(say,visual,title){return {type:'teach',say:say,visual:visual,title:title}}

/* ---------- الدروس ---------- */
const LESSONS={};

(function(){
 const W=[['Hallo','مرحبًا','هالو'],['Danke','شكرًا','دانكه'],['Bitte','من فضلك / العفو','بيته'],['Wasser','ماء','فاسر'],['Haus','منزل','هاوس']];
 const steps=[];
 W.forEach((w,i)=>{
  steps.push(T('هذه كلمة جديدة: «'+w[0]+'». تُنطق «'+w[2]+'» وتعني «'+w[1]+'». اضغط على السماعة وكرّرها معي، ثم سأختبرك!',
   wordCard('كلمة جديدة',w[0],'تُنطق: '+w[2],w[1],'de-DE'),'تعلّم الكلمة'));
  const others=W.filter((_,k)=>k!==i);
  if(i%2===0){
   steps.push(Q('هل تذكر؟ ماذا تعني هذه الكلمة؟','ماذا تعني «'+w[0]+'»؟',w[1],shuf(others).slice(0,2).map(o=>o[1]),
    wordCard('اختبار',w[0],null,null,'de-DE'),{title:'اختبر نفسك'}));
  }else{
   steps.push(Q('كيف تقول «'+w[1]+'» بالألمانية؟','كيف تقول «'+w[1]+'» بالألمانية؟',w[0],shuf(others).slice(0,2).map(o=>o[0]),
    wordCard('اختبار',w[1],null,null,null),{title:'اختبر نفسك',ltr:true}));
  }
 });
 steps.push({type:'build',title:'ركّب جملة',say:'اضغط على الكلمات بالترتيب لتكوّن الجملة.',prompt:'ترجم إلى الألمانية',target:'مرحبًا، شكرًا',tiles:['Danke','Hallo','Bitte','Haus'],answer:['Hallo','Danke'],good:'جملة رائعة! Hallo, Danke تعني مرحبًا، شكرًا.',bad:'الترتيب الصحيح: Hallo, Danke.'});
 LESSONS.german={name:'اللغة الألمانية',title:'أول خمس كلمات',steps:steps,end:'أنهيت الدرس! تعلّمت خمس كلمات ألمانية وكوّنت جملة.'};
})();

(function(){
 const full={a8:'bR',b8:'bN',c8:'bB',d8:'bQ',e8:'bK',f8:'bB',g8:'bN',h8:'bR',a7:'bP',b7:'bP',c7:'bP',d7:'bP',f7:'bP',g7:'bP',h7:'bP',e5:'bP',e4:'wP',a2:'wP',b2:'wP',c2:'wP',d2:'wP',f2:'wP',g2:'wP',h2:'wP',a1:'wR',b1:'wN',c1:'wB',d1:'wQ',e1:'wK',f1:'wB',g1:'wN',h1:'wR'};
 const mate={g8:'bK',f7:'bP',g7:'bP',h7:'bP',e1:'wR',g1:'wK',f2:'wP',g2:'wP',h2:'wP'};
 const fork={g8:'bK',c8:'bQ',f7:'bP',g7:'bP',h7:'bP',d5:'wN',g1:'wK',f2:'wP',g2:'wP',h2:'wP'};
 const S=[
  [full,'g1','f3','Nf3',['Ke2','h4'],'طوّر قطعك','بعد 1.e4 e5: حرّك الحصان من g1 إلى f3. هكذا تطوّر قطعة وتهاجم جندي e5 في خطوة واحدة.','الأبيض يلعب. ما الحركة التي تطوّر الحصان وتهاجم e5؟'],
  [mate,'e1','e8','Re8#',['Rd1','h3'],'كش مات من الصف الأخير','ملك الأسود محاصر بجنوده. القلعة تقفز من e1 إلى e8 فيكون كش مات.','ما حركة الأبيض التي تنهي المباراة فورًا؟'],
  [fork,'d5','e7','Ne7+',['Nb6','Nf6+'],'الشوكة بالحصان','الحصان على e7 يهاجم الملك والوزير معًا. الملك يهرب، ثم يأكل الحصان الوزير.','أي حركة تهاجم الملك والوزير في الوقت نفسه؟']
 ];
 const steps=[];
 S.forEach(s=>{
  const v=chess(s[0],s[1],s[2]);
  steps.push(T(s[6],ctx=>v({phase:'teach'}),s[5]));
  steps.push(Q(s[7],'ما أفضل حركة؟',s[3],s[4],v,{title:'ما أفضل حركة؟',ltr:true,good:'رائع! '+s[3]+' هي الحركة الصحيحة.',bad:'الحركة الصحيحة هي '+s[3]+'. شاهدها على الرقعة.'}));
 });
 LESSONS.logic={name:'المنطق والشطرنج',title:'فكّر قبل أن تتحرك',steps:steps,end:'أنهيت الدرس! تعلّمت التطوير والمات والشوكة.'};
})();

LESSONS.islam={name:'المعرفة الإسلامية',title:'أركان الإسلام الخمسة',steps:(function(){
 const L=[
  ['الشهادتان','هي مدخل الإسلام: شهادة أن لا إله إلا الله وأن محمدًا رسول الله.','ما الركن الأول من أركان الإسلام؟','الشهادتان',['الصلاة','الزكاة']],
  ['الصلاة','خمس صلوات في اليوم والليلة، وهي صلة بين العبد وربه.','كم عدد الصلوات المفروضة في اليوم والليلة؟','خمس صلوات',['ثلاث صلوات','سبع صلوات']],
  ['الزكاة','حق مالي واجب يُعطى للمستحقين إذا بلغ المال النصاب ومرّ عليه عام.','الزكاة حق مالي يُعطى لمن؟','للمستحقين',['لأي شخص','للمسجد فقط']],
  ['صوم رمضان','الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس في شهر رمضان.','في أي شهر يصوم المسلمون الصيام المفروض؟','رمضان',['شعبان','شوال']],
  ['الحج','قصد مكة المكرمة لأداء المناسك، لمن استطاع إليه سبيلًا.','إلى أي مدينة يُقصد لأداء الحج؟','مكة المكرمة',['المدينة المنورة','القدس']]
 ];
 const out=[];
 L.forEach((p,i)=>{
  out.push(T('اقرأ بهدوء ثم سأسألك سؤالًا واحدًا عن «'+p[0]+'».',infoCard(String(i+1),p[0],p[1]),'الركن '+(i+1)));
  out.push(Q(p[2],p[2],p[3],p[4],null,{title:'اختبر نفسك',good:'أحسنت! جزاك الله خيرًا.',bad:'لا بأس، الإجابة الصحيحة: '+p[3]+'.'}));
 });
 return out;
})(),end:'أنهيت أركان الإسلام الخمسة. بارك الله فيك!'};

LESSONS.science={name:'الطب والعلوم',title:'اكتشف جسمك',steps:(function(){
 const O=[
  ['heart','القلب','القلب مضخة عضلية تدفع الدم إلى كل الجسم. ينبض نحو مئة ألف مرة في اليوم.','ما وظيفة العضو المضيء؟','يضخ الدم إلى الجسم',['يهضم الطعام','يتحكم بالتفكير']],
  ['lungs','الرئتان','الرئتان تأخذان الأكسجين وتُخرجان ثاني أكسيد الكربون، في أكياس صغيرة تسمى الحويصلات الهوائية.','ماذا تفعل الرئتان المضيئتان؟','تتبادلان الغازات',['تضخان الدم','تفكّكان الطعام']],
  ['stomach','المعدة','المعدة تخلط الطعام مع عصارات هاضمة، وتفرز حمضًا قويًا يساعد على تفكيك الطعام.','ما أهم عمل للعضو المضيء؟','هضم الطعام',['التنفّس','الرؤية']],
  ['brain','الدماغ','الدماغ مركز التحكم بالجسم كله، ويستهلك نحو خُمس طاقة الجسم رغم صغر حجمه.','ما دور العضو المضيء؟','التحكم بالجسم والتفكير',['هضم الطعام','ضخ الدم']]
 ];
 const out=[];
 O.forEach(o=>{
  out.push(T(o[2],body(o[0]),'تعرّف على '+o[1]));
  out.push(Q(o[3],o[3],o[4],o[5],body(o[0]),{title:'هل تذكر؟',good:'ممتاز! '+o[1]+' يقوم بذلك فعلًا.',bad:'قريب! الإجابة الصحيحة: '+o[4]+'.'}));
 });
 return out;
})(),end:'تعرّفت على القلب والرئتين والمعدة والدماغ. جسمك مذهل!'};

LESSONS.tech={name:'التقنية والبرمجة',title:'أول خطوات البرمجة',steps:(function(){
 const I=[
  ['المتغيّر','المتغيّر صندوق له اسم نضع فيه قيمة. هنا الصندوق message وفيه Hello، والأمر print يعرض ما بداخله.','message = "Hello"\nprint(message)','Hello','جرّب أنت. ماذا سيطبع هذا الكود؟','city = "Rabat"\nprint(city)','Rabat',['city','Error']],
  ['العمليات الحسابية','نستطيع الحساب بالمتغيّرات. x تساوي 5، وx + 2 تعطي 7.','x = 5\nprint(x + 2)','7','ماذا سيطبع هذا الكود؟','y = 4\nprint(y * 3)','12',['7','43']],
  ['التكرار','الحلقة for تكرّر الأمر. range(3) تعني ثلاث مرات، فيظهر Hi ثلاث مرات.','for i in range(3):\n    print("Hi")','Hi\nHi\nHi','كم مرة سيظهر Yo؟','for i in range(2):\n    print("Yo")','Yo\nYo','2',['1','3']]
 ];
 const out=[];
 I.forEach(x=>{
  out.push(T(x[1],code(x[2],x[3]),x[0]));
  const ok=x.length===9?x[7]:x[6];
  const bad=x.length===9?x[8]:x[7];
  const outTxt=x[6];
  out.push(Q(x[4],x[4],ok,bad,code(x[5],x.length===9?x[6]:outTxt),{title:'ما الناتج؟',ltr:true,good:'صحيح! تفكير مبرمج.',bad:'ليس تمامًا. الإجابة الصحيحة: '+ok+'.'}));
 });
 return out;
})(),end:'تعلّمت المتغيّرات والحساب والتكرار. أنت الآن تبرمج!'};

LESSONS.creative={name:'الإبداع',title:'أول انتقال في فيديوك',steps:(function(){
 const D=[
  ['cut','قطع مباشر','القطع المباشر ينقلك فورًا من مشهد إلى آخر. سريع وقوي ويناسب الإيقاع السريع.','أي انتقال يناسب إيقاعًا سريعًا ومشاهد قصيرة؟'],
  ['fade','تلاشي','التلاشي يذوّب المشهد الأول في الثاني. ناعم ويناسب اللحظات الهادئة والمؤثرة.','أي انتقال يناسب مشهدًا هادئًا ومؤثرًا؟'],
  ['slide','انزلاق','الانزلاق يدفع المشهد الثاني من الجانب. يعطي إحساس الحركة، لكن لا تكثر منه.','أي انتقال يعطي إحساس الحركة؟']
 ];
 const out=[];
 D.forEach(d=>{
  out.push(T(d[2],ctx=>trans(d[0])({phase:'teach'}),d[1]));
  const bad=D.filter(x=>x[0]!==d[0]).map(x=>x[1]);
  out.push(Q(d[3],d[3],d[1],bad,trans(d[0]),{title:'اختر الانتقال',good:'ممتاز! تفكير مونتير حقيقي.',bad:'الأنسب هنا: '+d[1]+'. شاهده في المعاينة.'}));
 });
 return out;
})(),end:'تعلّمت ثلاثة انتقالات وعرفت متى تستخدم كل واحد.'};

LESSONS.life={name:'مهارات الحياة',title:'اقلِ بيضة بنجاح',steps:(function(){
 const I=[
  ['سخّن المقلاة على نار متوسطة','ابدأ بنار متوسطة، فالنار القوية تحرق أسفل البيضة قبل أن تنضج.','ما درجة النار المناسبة لبداية القلي؟','نار متوسطة',['نار قوية جدًا','بدون نار']],
  ['أضف قليلًا من الزيت أو الزبدة','قليل يكفي ليغطي قاع المقلاة، فلا تلتصق البيضة.','لماذا نضيف الزيت أو الزبدة؟','حتى لا تلتصق البيضة',['لتبريد المقلاة','لتغيير لون البيضة']],
  ['اكسر البيضة بلطف في المقلاة','اكسرها على سطح مستوٍ ثم افتحها قرب المقلاة حتى لا ينكسر الصفار.','أين يُفضّل أن نكسر البيضة؟','على سطح مستوٍ',['فوق النار مباشرة','في الهواء']],
  ['اتركها دقيقتين ثم قدّمها','انتظر حتى يصير البياض متماسكًا، ثم ارفعها بملعقة عريضة.','متى تكون البيضة جاهزة للتقديم؟','عندما يتماسك البياض',['فور كسرها','بعد ساعة']]
 ];
 const out=[];
 I.forEach((x,i)=>{
  out.push(T(x[1],egg(i),'الخطوة '+(i+1)+': '+x[0]));
  out.push(Q(x[2],x[2],x[3],x[4],egg(i),{title:'اختبر نفسك',good:'ممتاز! طاهٍ ماهر.',bad:'الصحيح: '+x[3]+'.'}));
 });
 return out;
})(),end:'أصبحت تعرف قلي البيضة من البداية إلى التقديم. بالهناء!'};

/* ---------- المحرّك ---------- */
let dlg,body_,cur,ST;
function ensureDialog(){
 if(dlg)return;
 dlg=document.getElementById('lessonDialog');
 body_=document.getElementById('lessonBody');
 dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
}
function quizCount(L){return L.steps.filter(s=>s.type!=='teach').length}
function enter(i){
 ST.i=i;ST.picked=null;ST.built=[];ST.checked=false;
 const s=cur.steps[i];
 ST.opts=s&&s.type==='quiz'?shuf(s.options):null;
 draw();
}
function finish(){
 const L=cur,total=quizCount(L);
 const done=todaysCompletions();
 const first=!done[L.id];
 if(first){
  done[L.id]=true;state.completedByDate[today()]=done;
  state.xp+=25;
  state.history.unshift({title:L.title+' · +25 XP — '+ST.score+'/'+total,date:new Date().toLocaleDateString('ar-MA')});
  save();
 }
 dlg.close();
 toast(first?'أحسنت! أُضيفت 25 نقطة إلى رصيدك ✦':'أنجزت هذا المسار اليوم. يمكنك العودة إليه للمراجعة ✦');
}
function draw(){
 const L=cur,steps=L.steps,total=steps.length,isDone=ST.i>=total;
 const s=steps[ST.i];
 const qn=quizCount(L);
 let title=isDone?'أحسنت!':(s.title||L.title);
 let mode=isDone?'النتيجة':(s.type==='teach'?'تعلّم':'اختبار');
 let say='',btn='',canGo=true,onGo=function(){},fb=null,fbOk=true,visual=null,inter=null;
 if(isDone){
  say=L.end;btn=todaysDone()?'إنهاء':'إنهاء · +25 XP';onGo=finish;
  visual=()=>h('div',{class:'lv-card'},h('div',{class:'lv-eyebrow'},'نتيجتك'),h('div',{class:'lv-big'},ST.score+' ',h('small',null,'من '+qn)),h('div',{class:'lv-green'},'أكملت الدرس'));
 }else if(s.type==='teach'){
  say=s.say;btn='اختبرني';onGo=()=>enter(ST.i+1);
  visual=()=>s.visual({phase:'teach'});
  if(ST.i===0)btn='ابدأ الدرس';
  if(steps[ST.i+1]&&steps[ST.i+1].type==='teach')btn='التالي';
 }else if(s.type==='quiz'){
  const answered=ST.picked!==null,correct=answered&&ST.picked===s.ok;
  say=!answered?s.ask:(correct?(s.good||'ممتاز!'):(s.bad||'الإجابة الصحيحة: '+s.ok));
  btn=answered?'متابعة':'اختر إجابة';canGo=answered;onGo=()=>{if(ST.picked!==null)enter(ST.i+1)};
  if(answered){fbOk=correct;fb=correct?'إجابة صحيحة ✓':'الإجابة الصحيحة: '+s.ok}
  visual=s.visual?()=>s.visual({phase:answered?'after':'ask'}):null;
  inter=h('div',{class:'lv-options'+(s.ltr?' ltr':'')},
   h('div',{class:'lv-q'},s.q),
   ST.opts.map(o=>{
    let cls='lv-opt';
    if(answered){if(o===s.ok)cls+=' ok';else if(o===ST.picked)cls+=' bad'}
    return h('button',{class:cls,type:'button',dir:s.ltr?'ltr':'rtl',onclick:()=>{if(ST.picked!==null)return;ST.picked=o;if(o===s.ok)ST.score++;draw()}},o);
   }));
 }else{ /* build */
  const chosen=ST.built;
  say=ST.checked?(buildOk(s)?s.good:s.bad):s.say;
  canGo=ST.checked||chosen.length>0;
  btn=ST.checked?'متابعة':'تحقّق';
  onGo=()=>{if(ST.checked){enter(ST.i+1)}else if(chosen.length){ST.checked=true;if(buildOk(s))ST.score++;draw()}};
  if(ST.checked){fbOk=buildOk(s);fb=fbOk?'جملة صحيحة ✓':'حاول مرة أخرى في الدرس القادم'}
  inter=h('div',{class:'lv-build'},
   h('div',{class:'lv-q'},s.prompt+': '+s.target),
   h('div',{class:'lv-slot',dir:'ltr'},chosen.map((idx,k)=>h('button',{class:'lv-tile on',type:'button',onclick:()=>{if(ST.checked)return;ST.built.splice(k,1);draw()}},s.tiles[idx]))),
   h('div',{class:'lv-pool',dir:'ltr'},s.tiles.map((t,idx)=>chosen.indexOf(idx)<0?h('button',{class:'lv-tile',type:'button',onclick:()=>{if(ST.checked)return;ST.built.push(idx);draw()}},t):null)));
 }
 /* التركيب */
 document.getElementById('lessonBar').style.width=Math.max(5,Math.round(Math.min(ST.i,total)/total*100))+'%';
 document.getElementById('lessonScore').textContent='✓ '+ST.score;
 body_.replaceChildren(...[
  h('p',{class:'eyebrow'},'SIDE QUEST · '+L.name+' · '+mode),
  h('h2',{class:'lv-title'},title),
  visual?h('div',{class:'lv-visual'},visual()):null,
  h('div',{class:'lv-cat'},svg(CAT),h('div',{class:'lv-bubble'},say)),
  inter,
  fb?h('div',{class:'lv-fb '+(fbOk?'ok':'bad')},fb):null,
  h('button',{class:'primary full',type:'button',style:'opacity:'+(canGo?1:.45),onclick:()=>{if(canGo)onGo()}},btn)].filter(Boolean));
}
function todaysDone(){return !!todaysCompletions()[cur.id]}
function buildOk(s){return ST.built.map(i=>s.tiles[i]).join(' ')===s.answer.join(' ')}

window.openLesson=function(id){
 const L=LESSONS[id];
 if(!L)return false;
 ensureDialog();
 cur=Object.assign({id:id},L);
 ST={i:0,picked:null,built:[],checked:false,score:0,opts:null};
 enter(0);
 dlg.showModal();
 return true;
};
})();
