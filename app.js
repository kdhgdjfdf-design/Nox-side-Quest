const KEY='nox-side-quest-v01';
const initial={xp:0,completed:false,reflection:'',history:[]};
let state={...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')};
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function render(){
 $('xpValue').textContent=state.xp;
 const level=Math.floor(state.xp/100)+1,within=state.xp%100;
 $('levelName').textContent='المستكشف · المستوى '+level;
 $('xpBar').style.width=within+'%';
 $('xpCaption').textContent=within+' / 100 XP للمستوى التالي';
 $('startQuest').textContent=state.completed?'أعد مراجعة المهمة':'ابدأ المهمة ←';
 $('emptyHistory').hidden=state.history.length>0;
 $('historyList').innerHTML=state.history.map(item=>'<li>✦ '+item.title+' <small>'+item.date+'</small></li>').join('');
}
$('startQuest').addEventListener('click',()=>{$('reflection').value=state.reflection||'';$('questDialog').showModal()});
$('completeQuest').addEventListener('click',()=>{
 if(state.completed){$('questDialog').close();toast('أنجزت مهمة اليوم بالفعل. يمكنك مراجعتها متى شئت.');return}
 state.completed=true;state.xp+=25;state.reflection=$('reflection').value.trim();
 state.history.unshift({title:'أول خمس كلمات بالألمانية · +25 XP',date:new Date().toLocaleDateString('ar-MA')});
 save();$('questDialog').close();toast('أحسنت! أُضيفت 25 نقطة إلى رصيدك ✦');
});
document.querySelectorAll('.interest').forEach(button=>button.addEventListener('click',()=>toast('سنضيف مهام هذا المسار في التحديث القادم ✦')));
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2400)}
if('serviceWorker'in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
let deferredPrompt;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;const button=document.createElement('button');button.className='install-button';button.textContent='تثبيت التطبيق';button.onclick=async()=>{deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;button.remove()};document.querySelector('.topbar').append(button)});
render();