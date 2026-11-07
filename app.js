const KEY='nox-side-quest-v02';
const today=()=>new Date().toLocaleDateString('en-CA');
const defaults={xp:0,history:[],completedByDate:{}};
let state;
try{state={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}
catch{state={...defaults}}
const $=id=>document.getElementById(id);
const quests=[
{id:'german',icon:'🇩🇪',name:'اللغة الألمانية',title:'أول خمس كلمات',desc:'تعرّف على خمس كلمات ألمانية، ثم حاول كتابة جملة قصيرة بإحداها.',items:[['Hallo','مرحبًا'],['Danke','شكرًا'],['Bitte','من فضلك / العفو'],['Wasser','ماء'],['Haus','منزل']],prompt:'اكتب جملة ألمانية أو ملاحظة صغيرة',placeholder:'مثلاً: Hallo!'},
{id:'logic',icon:'♟',name:'المنطق والشطرنج',title:'فكّر قبل أن تتحرك',desc:'درّب عينك على ملاحظة التفاصيل والتفكير بهدوء قبل اختيار الحل.',items:[['الهدف','ابحث عن أفضل نقلة تحقق هدفًا واضحًا.'],['السؤال','ما القطعة التي تحتاج إلى حماية؟'],['التحدي','اكتب سبب اختيارك في سطر واحد.']],prompt:'ما الفكرة التي لاحظتها؟',placeholder:'لاحظت أن...'},
{id:'islam',icon:'☾',name:'المعرفة الإسلامية',title:'قيمة اليوم: الإحسان',desc:'تأمل معنى الإحسان في التعامل اليومي، واختر عملًا بسيطًا تطبّق به هذه القيمة.',items:[['المعنى','أن تحسن العمل وتؤديه بإتقان.'],['تأمل','كيف يظهر الإحسان في الدراسة أو مساعدة الأسرة؟'],['تطبيق','اختر تصرفًا واحدًا تنوي القيام به اليوم.']],prompt:'ما التطبيق الذي اخترته؟',placeholder:'سأحاول أن...'},
{id:'science',icon:'🧬',name:'الطب والعلوم',title:'رحلة الأكسجين',desc:'تعرّف بصورة مبسطة على الطريق الذي يسلكه الأكسجين داخل الجسم.',items:[['الرئتان','يدخل الأكسجين إلى الدم عبر الحويصلات الهوائية.'],['القلب','يضخ الدم ليصل الأكسجين إلى أنحاء الجسم.'],['الخلايا','تستخدم الخلايا الأكسجين لإنتاج الطاقة.']],prompt:'اشرح الرحلة بكلماتك',placeholder:'يدخل الأكسجين من...'},
{id:'tech',icon:'⌘',name:'التقنية والبرمجة',title:'أول صفحة ويب',desc:'تعرّف على ثلاث علامات أساسية تُستخدم لبناء صفحة HTML.',items:[['<h1>','عنوان رئيسي للصفحة'],['<p>','فقرة نصية'],['<button>','زر يمكن للمستخدم التفاعل معه']],prompt:'اكتب فكرة صفحة تريد صنعها',placeholder:'صفحة عن...'},
{id:'creative',icon:'✎',name:'الإبداع',title:'قصة في ثلاثة مشاهد',desc:'اصنع فكرة قصة قصيرة يمكن تحويلها إلى فيديو أو رسوم بسيطة.',items:[['المشهد 1','قدّم المكان أو الشخصية.'],['المشهد 2','أضف حدثًا أو سؤالًا يثير الفضول.'],['المشهد 3','اختم بفكرة أو نتيجة واضحة.']],prompt:'اكتب فكرتك في جملة',placeholder:'تبدأ القصة عندما...'},
{id:'life',icon:'🍳',name:'مهارات الحياة',title:'رتّب يومك بذكاء',desc:'اختر مهمة منزلية صغيرة أو وجبة بسيطة وخطط لها بهدوء، واطلب مساعدة أحد أفراد الأسرة عند الحاجة.',items:[['الخطوة 1','حدد ما تريد إنجازه.'],['الخطوة 2','جهّز ما تحتاجه مسبقًا.'],['الخطوة 3','رتّب المكان بعد الانتهاء.']],prompt:'ما المهارة التي تدربت عليها؟',placeholder:'اليوم تدربت على...'}
];
let activeQuest=quests[0];
function todaysCompletions(){return state.completedByDate[today()]||{}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function render(){
 $('xpValue').textContent=state.xp;
 const level=Math.floor(state.xp/100)+1,within=state.xp%100;
 $('levelName').textContent='المستكشف · المستوى '+level;
 $('xpBar').style.width=within+'%';
 $('xpCaption').textContent=within+' / 100 XP للمستوى التالي';
 $('startQuest').textContent=todaysCompletions().german?'راجع المهمة':'ابدأ المهمة ←';
 $('emptyHistory').hidden=state.history.length>0;
 const list=$('historyList');list.replaceChildren();
 state.history.slice(0,12).forEach(item=>{const li=document.createElement('li');li.textContent='✦ '+item.title+' ';const small=document.createElement('small');small.textContent=item.date;li.append(small);list.append(li)});
 document.querySelectorAll('.interest').forEach((button,i)=>{button.setAttribute('aria-label',quests[i].name+' — فتح المهمة');button.classList.toggle('done',!!todaysCompletions()[quests[i].id])});
}
function openQuest(quest){
 activeQuest=quest;
 $('questEyebrow').textContent='SIDE QUEST · '+quest.name;
 $('questTitle').textContent=quest.title;
 $('questDescription').textContent=quest.desc;
 $('reflectionLabel').textContent=quest.prompt;
 $('reflection').value='';
 $('reflection').placeholder=quest.placeholder;
 const wrap=$('questItems');wrap.replaceChildren();
 quest.items.forEach(([term,meaning])=>{const row=document.createElement('div');const b=document.createElement('b');b.textContent=term;const span=document.createElement('span');span.textContent=meaning;row.append(b,span);wrap.append(row)});
 $('completeQuest').textContent=todaysCompletions()[quest.id]?'أنجزت هذه المهمة اليوم':'أنهيت المهمة · +25 XP';
 $('questDialog').showModal();
}
$('startQuest').addEventListener('click',()=>openQuest(quests[0]));
$('completeQuest').addEventListener('click',()=>{
 const completed=todaysCompletions();
 if(completed[activeQuest.id]){$('questDialog').close();toast('أنجزت هذا المسار اليوم. يمكنك العودة إليه للمراجعة ✦');return}
 completed[activeQuest.id]=true;state.completedByDate[today()]=completed;
 state.xp+=25;
 const note=$('reflection').value.trim();
 state.history.unshift({title:activeQuest.title+' · +25 XP'+(note?' — '+note:''),date:new Date().toLocaleDateString('ar-MA')});
 save();$('questDialog').close();toast('أحسنت! أُضيفت 25 نقطة إلى رصيدك ✦');
});
document.querySelectorAll('.interest').forEach((button,i)=>button.addEventListener('click',()=>openQuest(quests[i])));
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2400)}
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let deferredPrompt;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;const button=document.createElement('button');button.className='install-button';button.textContent='تثبيت التطبيق';button.onclick=async()=>{deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;button.remove()};document.querySelector('.topbar').append(button)});
render();
