(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dots=(n,icon='●')=>Array.from({length:n},()=>'<span>'+icon+'</span>').join('');
function visual(it){const v=it.vis||{t:'eq',text:it.prompt};let h='';switch(v.t){
 case 'frame':case 'frame5':h='<div class="iq-frames">'+Array.from({length:Math.ceil(Math.max(v.n,10)/10)},(_,j)=>'<div class="iq-frame">'+Array.from({length:v.t==='frame5'?5:10},(_,i)=>'<span>'+(j*10+i<v.n?'●':'')+'</span>').join('')+'</div>').join('')+'</div>';break;
 case 'objs':case 'scatter':case 'loose':h='<div class="iq-dots">'+dots(v.n,v.icon||({star:'⭐',cube:'🟦',rocket:'🚀'}[v.o]||'●'))+'</div>';break;
 case 'pics':h='<div class="iq-dots">'+dots(v.op==='−'?v.a-v.b:v.a,v.icon)+' <b>'+(v.op==='+'?'+ '+dots(v.b,v.icon):'')+'</b></div>';break;
 case 'seq':h='<div class="iq-seq">'+v.nums.map(n=>'<span>'+esc(n??'?')+'</span>').join('')+'</div>';break;
 case 'vert':h='<div class="iq-vertical"><div>'+esc(v.a.toLocaleString())+'</div><div>'+esc(v.op)+' '+esc(v.b.toLocaleString())+'</div><hr></div>';break;
 case 'groups':h='<div class="iq-groups"><div class="red"><b>Red group</b><div>'+dots(v.a,v.icon)+'</div></div><div class="blue"><b>Blue group</b><div>'+dots(v.b,v.icon)+'</div></div></div>';break;
 case 'array':h='<div class="iq-array" style="grid-template-columns:repeat('+v.cols+',32px)">'+dots(v.cols*v.rows)+'</div>';break;
 case 'cmp':h='<div class="iq-equation">'+esc(v.a)+' ? '+esc(v.b)+'</div>';break;
 case 'place':h='<div class="iq-place-example">'+esc(v.icon)+' Build the set below</div>';break;
 case 'listen':h='<button type="button" class="iq-listen">🔊 Hear the number</button><p class="iq-audio-note">Listen, then choose the numeral.</p>';break;
 case 'round':h='<div class="iq-equation">'+esc(v.n)+'</div><p>Round to the nearest '+esc(v.p)+'</p>';break;
 case 'onemore':h='<div class="iq-equation">'+esc(v.n)+' '+(v.dir==='more'?'+ 1':'− 1')+' = ?</div>';break;
 case 'bignum':h='<div class="iq-equation">'+esc(v.n)+'</div>';break;
 default:h='<div class="iq-equation">'+esc(v.text||it.prompt)+'</div>';
 }return '<div class="iq-item">'+(!it.quiet&&v.t!=='eq'&&v.t!=='vert'&&v.t!=='cmp'&&v.t!=='seq'?'<p class="iq-prompt">'+esc(it.ask||it.say||it.prompt)+'</p>':'')+h+(it.ask&&v.t==='eq'?'<p>'+esc(it.ask)+'</p>':'')+'</div>'}
function speak(it,root){let b=root.querySelector('.iq-listen');if(!b&&it.say){b=document.createElement('button');b.type='button';b.className='iq-listen';b.textContent='🔊 Read the question';root.appendChild(b)}if(!b)return;b.onclick=()=>{if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(it.say||it.prompt);u.rate=.8;speechSynthesis.speak(u)}else{let note=root.querySelector('.iq-audio-note');if(!note){note=document.createElement('p');note.className='iq-audio-note';root.appendChild(note)}note.textContent='Ask your teacher to read this question aloud. Audio is unavailable on this device.'}}}
function controls(root,it,onAnswer,{auto=false,label='Your answer',maxDigits,autoDigits,skill,feedbackMs=300}={}){
let count=0,pending=null,feedbackTimer=null,submitted=false,locked=false,lastEditAt=null,lastMethod='typed';
const numeric=typeof it.answer==='number';
const skillId=skill||it.skillId||window.Fluency?.read()?.skill;
let domainDigits=Number(maxDigits||autoDigits);
if(!Number.isFinite(domainDigits)||domainDigits<1){
 if(window.RaceProtocol?.maxDigits)domainDigits=Number(window.RaceProtocol.maxDigits(skillId));
 if(!Number.isFinite(domainDigits)||domainDigits<1){
  const answers=window.Fluency?.bank?.(skillId)||[];
  domainDigits=answers.length?Math.max(...answers.filter(x=>typeof x.answer==='number').map(x=>String(x.answer).length),1):8;
 }
}
domainDigits=Math.max(1,Math.min(8,Math.floor(domainDigits)));
root.innerHTML=it.vis?.t==='place'?'<div class="iq-scene" aria-label="Your set"></div><div class="iq-choice"><button type="button" data-count="1">Add one '+esc(it.vis.icon)+'</button><button type="button" data-count="-1">Remove one</button><button type="button" data-count="done">Done with my set</button></div>':it.choices?'<div class="iq-choice">'+it.choices.map((c,i)=>'<button type="button" data-choice="'+i+'">'+esc(c==='red'?'🔴 Red group':c==='blue'?'🔵 Blue group':c)+'</button>').join('')+'</div>':'<input class="iq-input" aria-label="'+esc(label)+'" inputmode="'+(numeric?'numeric':'text')+'" autocomplete="off" maxlength="'+(numeric?domainDigits:8)+'"><div class="iq-pad">'+[1,2,3,4,5,6,7,8,9,0].map(n=>'<button type="button" data-digit="'+n+'">'+n+'</button>').join('')+'<button type="button" data-erase>Erase</button>'+(!auto?'<button type="button" data-check>Check answer</button>':'')+'</div>';
const input=root.querySelector('input');
function cancel(){if(pending!==null)clearTimeout(pending);pending=null}
function deliver(value,method,at){if(locked||submitted||!root.isConnected)return false;cancel();submitted=true;onAnswer(value,method,at);return true}
function send(){if(input?.value.trim())return deliver(input.value.trim(),lastMethod,lastEditAt??performance.now());return false}
function edit(method){cancel();if(locked||submitted)return;if(numeric)input.value=input.value.replace(/\D/g,'').slice(0,domainDigits);lastMethod=method;lastEditAt=performance.now();if(auto&&input.value.trim()){if(numeric&&domainDigits===1)send();else pending=setTimeout(send,650)}}
if(input){input.oninput=()=>edit('typed');input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send()}};root.querySelectorAll('[data-digit]').forEach(b=>b.onclick=()=>{if(locked||submitted)return;input.value=(input.value+b.dataset.digit).slice(0,input.maxLength);edit('tapped')});root.querySelector('[data-erase]').onclick=()=>{if(locked||submitted)return;input.value='';cancel();lastEditAt=null};root.querySelector('[data-check]')?.addEventListener('click',send);input.focus()}
root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>deliver(it.choices[Number(b.dataset.choice)],'choice',performance.now()));
root.querySelectorAll('[data-count]').forEach(b=>b.onclick=()=>{if(locked||submitted)return;if(b.dataset.count==='done'){deliver(count,'placed',performance.now());return}count=Math.max(0,Math.min(20,count+Number(b.dataset.count)));root.querySelector('.iq-scene').innerHTML=dots(count,it.vis.icon);root.querySelector('.iq-scene').setAttribute('aria-label','Your set has '+count+' objects')});
function feedback(correct){clearTimeout(feedbackTimer);root.classList.remove('iq-correct','iq-incorrect');root.classList.add(correct?'iq-correct':'iq-incorrect');const box=input||root;box.style.outline='3px solid '+(correct?'#15803d':'#dc2626');box.style.outlineOffset='3px';feedbackTimer=setTimeout(()=>{if(!root.isConnected)return;root.classList.remove('iq-correct','iq-incorrect');box.style.outline='';box.style.outlineOffset=''},feedbackMs)}
return {flush:send,cancel,feedback,clear(){cancel();submitted=false;lastEditAt=null;count=0;if(input){input.value='';input.focus()}const scene=root.querySelector('.iq-scene');if(scene)scene.innerHTML=''},lock(){cancel();locked=true;root.querySelectorAll('button,input').forEach(e=>e.disabled=true)}}}
window.ItemUI={esc,visual,speak,controls};
})();
