/* Rosenbaum's original balanced probe blueprints and teaching moves. */
(()=>{


 
 
 
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(str){let h=2166136261;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const ri = (r,a,b) => a + Math.floor(r()*(b-a+1));
const pick = (r,arr) => arr[Math.floor(r()*arr.length)];
const shuffle = (r,arr) => {for(let i=arr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr};
const range = (a,b) => Array.from({length:b-a+1},(_,i)=>a+i);
const median = a => {if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
const mean = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const pct = v => v==null ? '–' : Math.round(v*100)+'%';
const r1 = v => v==null ? '–' : (Math.round(v*10)/10).toString();
function ols(pts){ 
  if(pts.length<2) return null;
  const mx=mean(pts.map(p=>p.x)), my=mean(pts.map(p=>p.y));
  let n=0,d=0; for(const p of pts){n+=(p.x-mx)*(p.y-my);d+=(p.x-mx)**2}
  return d? n/d : 0;
}
 
const D = s => {const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayIso = () => iso(new Date());
function fridayOf(s){const d=D(s);d.setDate(d.getDate()-((d.getDay()+6)%7)+4);return iso(d)}
function fridaysBetween(a,b){const out=[];const d=D(fridayOf(a)),e=D(b);while(d<=e){out.push(iso(d));d.setDate(d.getDate()+7)}return out}
const fmtD = s => D(s).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const monthKey = s => s.slice(0,7);
const monthName = k => D(k+'-01').toLocaleDateString('en-US',{month:'long',year:'numeric'});
const weeksBetween = (a,b) => Math.round((D(b)-D(a))/(7*864e5));

 
 


const ICONS = ['🍎','🐞','⭐','🐟','🍪','🦆'];
function famAdd(a,b){ if(Math.min(a,b)===0) return '+0'; if(Math.min(a,b)<=2) return 'Count on 1-2'; if(a===b) return 'Doubles'; if(Math.abs(a-b)===1) return 'Near doubles'; if(a+b===10) return 'Make 10'; if(a+b>10) return 'Bridge 10'; return 'Other within 10'; }
function famSub(a,b){ if(b===0||a===b) return '−0 / −all'; if(b<=2) return 'Count back 1-2'; if(a===10) return 'From 10'; if(a>10) return a-b<10?'Bridge 10':'Teens, no bridge'; return 'Think addition'; }
function regroupAdd(a,b){let c=0;while(a||b){if(a%10+b%10+c>9)return true;a=Math.floor(a/10);b=Math.floor(b/10)}return false}
function regroupSub(a,b){while(b){if(a%10<b%10)return true;a=Math.floor(a/10);b=Math.floor(b/10)}return false}



const OBJ = {star:'stars',cube:'cubes',rocket:'rocket ships',apple:'apples',dot:'dots'};
function win(r,ans,lo,hi,k=3){const s=clamp(ans-ri(r,0,k-1),lo,Math.max(lo,hi-k+1));return range(s,s+k-1)}
function genKCount(r,p){const out=[];let last=-1;for(let i=0;i<p.items;i++){let n;do{n=ri(r,1,10)}while(n===last);last=n;
  const kinds=n<=5?['frame5','star','cube','rocket','scatter']:['frame','star','cube','scatter'];const k=pick(r,kinds);
  const vis=k==='frame5'?{t:'frame5',n}:k==='frame'?{t:'frame',n}:k==='scatter'?{t:'scatter',n,s:ri(r,1,1e6)}:{t:'objs',n,o:k};
  const say=k==='frame5'||k==='frame'?'How many dots are on the frame?':k==='scatter'?'How many dots are there?':`How many ${OBJ[k]} are there?`;
  out.push({prompt:say,say,answer:n,skill:n<=5?'Quantities 1-5':'Quantities 6-10',vis,choices:win(r,n,1,10,n<=3?3:4)})}return out}
function genKTeen(r,p){const out=[];for(let i=0;i<p.items;i++){const n=ri(r,10,19);out.push({prompt:'How many dots?',say:'How many dots are there in all?',answer:n,skill:n<15?'Ten and 0-4':'Ten and 5-9',vis:{t:'frame',n},choices:win(r,n,10,20,4)})}return out}
function genKAdd5(r,p){const out=[];for(let i=0;i<p.items;i++){const icon=pick(r,ICONS);if(r()<.55){const a=ri(r,0,5),b=ri(r,0,5-a);out.push({prompt:`${a} + ${b}`,say:`${a} and ${b} more. How many in all?`,answer:a+b,skill:'Put together',vis:{t:'pics',a,b,op:'+',icon},choices:win(r,a+b,0,5,4)})}else{const a=ri(r,1,5),b=ri(r,0,a);out.push({prompt:`${a} − ${b}`,say:`${a}, take away ${b}. How many are left?`,answer:a-b,skill:'Take apart',vis:{t:'pics',a,b,op:'−',icon},choices:win(r,a-b,0,5,4)})}}return out}
function genKSeq(r,p){const out=[];for(let i=0;i<p.items;i++){if(r()<.65){const s=ri(r,1,16);out.push({prompt:'What comes next?',say:`${s}, ${s+1}, ${s+2}. What number comes next?`,answer:s+3,skill:'Count forward',vis:{t:'seq',nums:[s,s+1,s+2,null]},choices:win(r,s+3,1,20,3)})}else{const s=ri(r,4,20);out.push({prompt:'What comes next?',say:`${s}, ${s-1}, ${s-2}. Count back. What number comes next?`,answer:s-3,skill:'Count back',vis:{t:'seq',nums:[s,s-1,s-2,null]},choices:win(r,s-3,1,20,3)})}}return out}
const PLACE = [['🐔','hen','hens','barn'],['🐑','sheep','sheep','barn'],['🦆','duck','ducks','pond'],['🐄','cow','cows','barn']];
function genKPlace(r,p){const out=[];for(let i=0;i<p.items;i++){const n=ri(r,1,10),[icon,one,many,scene]=pick(r,PLACE);const say=`Put ${n} ${n===1?one:many} in the picture.`;
  out.push({prompt:say,say,answer:n,skill:n<=5?'Count out 1-5':'Count out 6-10',vis:{t:'place',icon,tray:Math.min(12,Math.max(5,n+ri(r,1,3))),scene}})}return out}
function eqItem(a,b,op,skill){const ans=op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b;return{prompt:`${a} ${op} ${b}`,answer:ans,skill,vis:{t:'eq',text:`${a} ${op} ${b} =`}}}
function vertItem(a,b,op,skill){const ans=op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b;return{prompt:`${a} ${op} ${b}`,answer:ans,skill,vis:op==='÷'?{t:'eq',text:`${a.toLocaleString()} ÷ ${b} =`}:{t:'vert',a,b,op}}}
function genAddSub(max,r,p){const out=[];for(let i=0;i<p.items;i++){if(r()<.5){let a,b;do{a=ri(r,0,Math.min(max,10));b=ri(r,0,Math.min(max,10))}while(a+b>max);out.push(eqItem(a,b,'+',famAdd(a,b)))}else{const a=ri(r,max>10?5:1,max),b=ri(r,0,Math.min(a,10));out.push(eqItem(a,b,'−',famSub(a,b)))}}return out}
function genTenMoreLess(r,p){const out=[];for(let i=0;i<p.items;i++){if(r()<.5){const a=ri(r,10,89);out.push(eqItem(a,10,'+','10 more'))}else{const a=ri(r,20,99);out.push(eqItem(a,10,'−','10 less'))}}return out}
function genTens(r,p){const out=[];for(let i=0;i<p.items;i++){if(r()<.5){const a=ri(r,1,8)*10,b=ri(r,1,9-a/10)*10;out.push(eqItem(a,b,'+','Add tens'))}else{const a=ri(r,2,9)*10,b=ri(r,1,a/10-1)*10;out.push(eqItem(a,b,'−','Subtract tens'))}}return out}
function genMult(r,p){const max=SETTINGS.multMax||10;const out=[];const zeros=new Set(shuffle(r,range(0,p.items-1)).slice(0,2));for(let i=0;i<p.items;i++){let a,b;if(zeros.has(i)){a=0;b=ri(r,1,max);if(r()<.5)[a,b]=[b,a]}else{a=ri(r,1,max);b=ri(r,1,max)}out.push(eqItem(a,b,'×',(Math.max(a,b)===0||Math.min(a,b)===0)?'0s':Math.max(a,b)+'s'))}return out}
function genDiv(r,p){const max=SETTINGS.multMax||10;const out=[];for(let i=0;i<p.items;i++){const d=ri(r,1,max),q=ri(r,0,max);out.push(eqItem(d*q,d,'÷','÷'+d))}return out}
function genMixedFacts(r,p){const a=genMult(r,p),b=genDiv(r,p);return a.map((x,i)=>i%2?b[i]:x)}
function genTimesTens(r,p){const out=[];for(let i=0;i<p.items;i++){const a=ri(r,1,9),b=ri(r,1,9)*10;out.push(r()<.5?eqItem(a,b,'×','× tens'):eqItem(b,a,'×','× tens'))}return out}
function genMulti(digits,r,p){const lo=10**(digits-1),hi=10**digits-1;const out=[];for(let i=0;i<p.items;i++){if(r()<.5){let a,b;do{a=ri(r,lo,hi);b=ri(r,lo,hi)}while(digits<=2&&a+b>100);out.push(vertItem(a,b,'+',regroupAdd(a,b)?'Add with regrouping':'Add, no regrouping'))}else{const a=ri(r,lo+Math.floor(lo/2),hi),b=ri(r,lo,a);out.push(vertItem(a,b,'−',regroupSub(a,b)?'Subtract with regrouping':'Subtract, no regrouping'))}}return out}
function genMult3x2(r,p){const out=[];for(let i=0;i<p.items;i++){const tw=r()<.4;const a=tw?ri(r,12,99):ri(r,102,999),b=ri(r,11,99);out.push(vertItem(a,b,'×',tw?'2-digit × 2-digit':'3-digit × 2-digit'))}return out}
function genDiv4(r,p){const out=[];for(let i=0;i<p.items;i++){const d=ri(r,2,25);let q;do{q=ri(r,Math.ceil(100/d),Math.floor(9999/d))}while(d*q<100);out.push(vertItem(d*q,d,'÷',d<10?'1-digit divisor':'2-digit divisor'))}return out}

const PR = {};
const PROBES = [
 {id:'K.NR.1',grade:'K',label:'How many? Quantities to 10',std:'K.NR.1.1, K.NR.4.1',desc:'Stars, cubes, rockets, five- and ten-frames, scattered dots. Read aloud, 3-4 answer buttons. Unit 1 and 3 focus.',items:20,secs:10,input:'choices',kind:'fact',gen:genKCount},
 {id:'K.NR.1p',grade:'K',label:'Put them in the picture (count out)',std:'K.NR.1.1, K.NR.1.2',desc:'Child hears "Put 4 hens in the picture" and taps animals into the scene. Measures counting out a set and cardinality.',items:12,secs:15,input:'place',kind:'fact',gen:genKPlace},
 {id:'K.NR.2',grade:'K',label:'What comes next? Counting',std:'K.NR.2.1, K.NR.2.2',desc:'Count forward within 20 and back from 20.',items:20,secs:10,input:'choices',kind:'fact',gen:genKSeq},
 {id:'K.NR.3',grade:'K',label:'Ten and some more (11-19)',std:'K.NR.3.1',desc:'Two ten-frames, first one full. Unit 5 focus.',items:20,secs:10,input:'choices',kind:'fact',gen:genKTeen},
 {id:'K.NR.5',grade:'K',label:'Put together, take apart within 5',std:'K.NR.5.4',desc:'Picture addition and subtraction within 5. Unit 4 focus.',items:20,secs:10,input:'choices',kind:'fact',gen:genKAdd5},
 {id:'1.NR.2',grade:'1',label:'Add and subtract within 10',std:'1.NR.2.4',desc:'Fluently add and subtract within 10.',items:30,secs:5,kind:'fact',gen:(r,p)=>genAddSub(10,r,p)},
 {id:'1.NR.5a',grade:'1',label:'10 more, 10 less',std:'1.NR.5.2',desc:'Mentally find 10 more or 10 less than a two-digit number.',items:30,secs:5,kind:'fact',gen:genTenMoreLess},
 {id:'1.NR.5b',grade:'1',label:'Add and subtract tens',std:'1.NR.5.3',desc:'Add and subtract multiples of 10 within 100.',items:30,secs:5,kind:'fact',gen:genTens},
 {id:'2.NR.2a',grade:'2',label:'Add and subtract within 20',std:'2.NR.2.1',desc:'Fluently add and subtract within 20 using mental, part-whole strategies.',items:30,secs:4,kind:'fact',gen:(r,p)=>genAddSub(20,r,p)},
 {id:'2.NR.2b',grade:'2',label:'Add and subtract within 100',std:'2.NR.2.4',desc:'Two-digit addition and subtraction within 100.',items:15,secs:15,kind:'multi',gen:(r,p)=>genMulti(2,r,p)},
 {id:'3.PAR.3m',grade:'3',label:'Multiplication facts',std:'3.PAR.3.2, 3.PAR.3.3',desc:'Single-digit multiplication within 100. Exactly two zero facts per race.',items:30,secs:4,kind:'fact',gen:genMult},
 {id:'3.PAR.3d',grade:'3',label:'Division facts',std:'3.PAR.3.2, 3.PAR.3.3',desc:'Related division facts within 100.',items:30,secs:4,kind:'fact',gen:genDiv},
 {id:'3.PAR.3t',grade:'3',label:'Multiply by multiples of 10',std:'3.PAR.3.5',desc:'One-digit numbers times 10-90.',items:30,secs:5,kind:'fact',gen:genTimesTens},
 {id:'3.PAR.2',grade:'3',label:'Add and subtract within 1,000',std:'3.PAR.2.1',desc:'Three-digit addition and subtraction.',items:12,secs:25,kind:'multi',gen:(r,p)=>genMulti(3,r,p)},
 {id:'4.FACT',grade:'4',label:'Facts maintenance × and ÷',std:'3.PAR.3 (prerequisite)',desc:'Mixed multiplication and division facts. Keeps grade 3 fluency warm.',items:30,secs:4,kind:'fact',gen:genMixedFacts},
 {id:'4.NR.2',grade:'4',label:'Multi-digit add and subtract',std:'4.NR.2.1',desc:'Four-digit addition and subtraction.',items:10,secs:45,kind:'multi',gen:(r,p)=>genMulti(4,r,p)},
 {id:'5.FACT',grade:'5',label:'Facts maintenance × and ÷',std:'3.PAR.3 (prerequisite)',desc:'Mixed multiplication and division facts.',items:30,secs:4,kind:'fact',gen:genMixedFacts},
 {id:'5.NR.2a',grade:'5',label:'Multiply multi-digit',std:'5.NR.2.1',desc:'Up to 3-digit by 2-digit multiplication.',items:8,secs:90,kind:'multi',gen:genMult3x2},
 {id:'5.NR.2b',grade:'5',label:'Divide multi-digit',std:'5.NR.2.2',desc:'Up to 4-digit dividends, divisors 2-25, whole-number quotients.',items:8,secs:90,kind:'multi',gen:genDiv4},
];
PROBES.forEach(p=>{p.input=p.input||'pad';PR[p.id]=p});
const GRADES = ['K','1','2','3','4','5'];
const gradeName = g => g==='K' ? 'Kindergarten' : 'Grade '+g;

 
const DEFAULT_SETTINGS = {
  district:'McIntosh County Schools', school:'Todd Grant Elementary',
  startDate:'2026-08-10', goalDate:'2027-05-14',
  goalFact:.90, goalMulti:.80, watchBand:.20, multMax:10,
  timing:{}, 
  comms:{friday:true, digest:true, family:false, mode:'preview'},
  ecName:'Tiger Downs Math Fluency',
  ecCols:[['sisId','Student ID',1],['name','Student Name',1],['school','School',1],['grade','Grade',1],['teacher','Teacher',1],['assessment','Assessment',1],['measure','Measure',1],['date','Administration Date',1],['score','Score',1],['total','Possible',1],['goal','Goal',1],['accom','Accommodation',1]]
};
let SETTINGS = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
function applyTiming(){PROBES.forEach(p=>{const o=SETTINGS.timing?.[p.id];if(!p._base)p._base={items:p.items,secs:p.secs};p.items=o?.items||p._base.items;p.secs=o?.secs||p._base.secs})}
const goalPct = p => p.kind==='multi' ? SETTINGS.goalMulti : SETTINGS.goalFact;
const goalOf = p => Math.ceil(p.items*goalPct(p));

 
 



 
function allocate(mix,n){
  const keys=Object.keys(mix).filter(k=>mix[k]>0), tot=keys.reduce((a,k)=>a+mix[k],0);
  const raw=keys.map(k=>mix[k]*n/tot), base=raw.map(Math.floor); let rem=n-base.reduce((a,b)=>a+b,0);
  raw.map((v,i)=>[v-base[i],i]).sort((a,b)=>b[0]-a[0]).slice(0,rem).forEach(([,i])=>base[i]++);
  return Object.fromEntries(keys.map((k,i)=>[k,base[i]]));
}
function drawFrom(pool,n,r){ const out=[]; let bag=[]; while(out.length<n){ if(!bag.length) bag=shuffle(r,[...pool]); out.push(bag.pop()) } return out }
const sig = it => it.k+'|'+it.prompt+'|'+it.answer+'|'+(it.vis&&it.vis.t||'');
function arrange(items,r){
  shuffle(r,items);
  const fams=new Set(items.map(i=>i.k)).size, maxRun=fams<=2?3:2; 
  const bad=i=> (i>0 && sig(items[i])===sig(items[i-1])) || (i>=maxRun && items.slice(i-maxRun,i).every(x=>x.k===items[i].k)) || (i===0 && ['0s','+0','−0 / −all','0 ÷ n'].includes(items[i].skill));
  for(let pass=0;pass<60;pass++){ let fixed=true;
    for(let i=0;i<items.length;i++) if(bad(i)){ fixed=false; const j=ri(r,0,items.length-1); [items[i],items[j]]=[items[j],items[i]] }
    if(fixed) break; }
  return items;
}
function strataFrom(list,keyFn,make){ const st={}; list.forEach(x=>{const k=keyFn(x);(st[k]=st[k]||{pool:[],make}).pool.push(x)}); return st }
function prefixed(prefix,st){ return Object.fromEntries(Object.entries(st).map(([k,v])=>[prefix+k,v])) }
function prefixMix(prefix,mix){ return Object.fromEntries(Object.entries(mix).map(([k,v])=>[prefix+k,v])) }

 
const pairs=(a0,a1,b0,b1,ok=()=>true)=>{const o=[];for(let a=a0;a<=a1;a++)for(let b=b0;b<=b1;b++)if(ok(a,b))o.push([a,b]);return o};
const addSubStrata=(addPairs,subPairs)=>({
  ...prefixed('+:',strataFrom(addPairs,([a,b])=>famAdd(a,b),([a,b])=>eqItem(a,b,'+',famAdd(a,b)))),
  ...prefixed('−:',strataFrom(subPairs,([a,b])=>famSub(a,b),([a,b])=>eqItem(a,b,'−',famSub(a,b))))
});
function multStrata(){ const m=SETTINGS.multMax||10; return strataFrom(pairs(0,m,0,m,(a,b)=>a||b),([a,b])=>Math.min(a,b)===0?'0s':Math.max(a,b)+'s',([a,b])=>eqItem(a,b,'×',Math.min(a,b)===0?'0s':Math.max(a,b)+'s')) }
function divStrata(){ const m=SETTINGS.multMax||10;
  return {...strataFrom(pairs(1,m,1,m),([d])=>'÷'+d,([d,q])=>eqItem(d*q,d,'÷','÷'+d)),
          '0 ÷ n':{pool:range(1,m),make:d=>eqItem(0,d,'÷','0 ÷ n')}} }
const MULT_MIX={10:{'0s':2,'1s':1,'2s':2,'3s':3,'4s':3,'5s':2,'6s':4,'7s':4,'8s':4,'9s':3,'10s':2},
                12:{'0s':2,'1s':1,'2s':2,'3s':2,'4s':2,'5s':2,'6s':3,'7s':3,'8s':3,'9s':3,'10s':1,'11s':2,'12s':4}};
const DIV_MIX={10:{'0 ÷ n':1,'÷1':1,'÷2':2,'÷3':3,'÷4':3,'÷5':3,'÷6':4,'÷7':4,'÷8':4,'÷9':3,'÷10':2},
               12:{'0 ÷ n':1,'÷1':1,'÷2':2,'÷3':2,'÷4':2,'÷5':2,'÷6':3,'÷7':4,'÷8':4,'÷9':3,'÷10':1,'÷11':2,'÷12':3}};
const mm=()=>MULT_MIX[SETTINGS.multMax==12?12:10], dm=()=>DIV_MIX[SETTINGS.multMax==12?12:10];

 
function multiFamily(digits,op,regroup){
  const lo=10**(digits-1), hi=10**digits-1;
  return {gen:r=>{ for(let t=0;t<500;t++){
    if(op==='+'){ const a=ri(r,lo,hi), b=ri(r,lo,hi); if(digits<=3&&a+b>10**digits) continue; if(regroupAdd(a,b)===regroup) return vertItem(a,b,'+',regroup?'Add with regrouping':'Add, no regrouping') }
    else { const a=ri(r,lo+Math.floor(lo/2),hi), b=ri(r,lo,a); if(regroupSub(a,b)===regroup) return vertItem(a,b,'−',regroup?'Subtract with regrouping':'Subtract, no regrouping') } }
    return vertItem(lo*2,lo,op,'Add, no regrouping') }};
}
function multiDigitStrata(d){ return {'Add with regrouping':multiFamily(d,'+',true),'Add, no regrouping':multiFamily(d,'+',false),'Subtract with regrouping':multiFamily(d,'−',true),'Subtract, no regrouping':multiFamily(d,'−',false)} }

 
const kKinds = n => n<=5?['frame5','star','cube','rocket','scatter']:['frame','star','cube','scatter'];
function kCountItem(n,r,k){
  k=k||pick(r,kKinds(n));
  const vis=k==='frame5'?{t:'frame5',n}:k==='frame'?{t:'frame',n}:k==='scatter'?{t:'scatter',n,s:ri(r,1,1e6)}:{t:'objs',n,o:k};
  const say=k==='frame5'||k==='frame'?'How many dots are on the frame?':k==='scatter'?'How many dots are there?':`How many ${OBJ[k]} are there?`;
  return {prompt:say,say,answer:n,skill:n<=5?'Quantities 1-5':'Quantities 6-10',vis,choices:win(r,n,1,10,n<=3?3:4)};
}
function kPlaceItem(n,r){ const [icon,one,many,scene]=pick(r,PLACE), say=`Put ${n} ${n===1?one:many} in the picture.`;
  return {prompt:say,say,answer:n,skill:n<=5?'Count out 1-5':'Count out 6-10',vis:{t:'place',icon,tray:Math.min(12,Math.max(5,n+ri(r,1,3))),scene}} }

 
const BLUEPRINTS = {
 'K.NR.1':()=>({strata:Object.fromEntries(range(1,10).map(n=>['n'+n,{pool:kKinds(n).map(k=>[n,k]),make:([n,k],r)=>kCountItem(n,r,k)}])),mix:Object.fromEntries(range(1,10).map(n=>['n'+n,2]))}),
 'K.NR.1p':()=>({strata:{'Count out 1-5':{pool:range(1,5),make:kPlaceItem},'Count out 6-10':{pool:range(6,10),make:kPlaceItem}},mix:{'Count out 1-5':6,'Count out 6-10':6}}),
 'K.NR.2':()=>({strata:{'Count forward':{pool:range(1,16),make:(s,r)=>({prompt:'What comes next?',say:`${s}, ${s+1}, ${s+2}. What number comes next?`,answer:s+3,skill:'Count forward',vis:{t:'seq',nums:[s,s+1,s+2,null]},choices:win(r,s+3,1,20,3)})},
   'Count back':{pool:range(4,20),make:(s,r)=>({prompt:'What comes next?',say:`${s}, ${s-1}, ${s-2}. Count back. What number comes next?`,answer:s-3,skill:'Count back',vis:{t:'seq',nums:[s,s-1,s-2,null]},choices:win(r,s-3,1,20,3)})}},mix:{'Count forward':13,'Count back':7}}),
 'K.NR.3':()=>({strata:strataFrom(range(11,19),n=>'n'+n,(n,r)=>({prompt:'How many dots?',say:'How many dots are there in all?',answer:n,skill:n<15?'Ten and 0-4':'Ten and 5-9',vis:{t:'frame',n},choices:win(r,n,10,20,4)})),mix:Object.fromEntries(range(11,19).map(n=>['n'+n,2]))}),
 'K.NR.5':()=>({strata:{'Put together':{pool:pairs(0,5,0,5,(a,b)=>a+b<=5),make:([a,b],r)=>({prompt:`${a} + ${b}`,say:`${a} and ${b} more. How many in all?`,answer:a+b,skill:'Put together',vis:{t:'pics',a,b,op:'+',icon:pick(r,ICONS)},choices:win(r,a+b,0,5,4)})},
   'Take apart':{pool:pairs(1,5,0,5,(a,b)=>b<=a),make:([a,b],r)=>({prompt:`${a} − ${b}`,say:`${a}, take away ${b}. How many are left?`,answer:a-b,skill:'Take apart',vis:{t:'pics',a,b,op:'−',icon:pick(r,ICONS)},choices:win(r,a-b,0,5,4)})}},mix:{'Put together':11,'Take apart':9}}),
 '1.NR.2':()=>({strata:addSubStrata(pairs(0,10,0,10,(a,b)=>a+b<=10),pairs(1,10,0,10,(a,b)=>b<=a)),
   mix:{'+:+0':1,'+:Count on 1-2':4,'+:Doubles':3,'+:Near doubles':3,'+:Make 10':2,'+:Other within 10':2,'−:−0 / −all':1,'−:Count back 1-2':5,'−:From 10':3,'−:Think addition':6}}),
 '1.NR.5a':()=>({strata:{'10 more':{pool:range(10,89),make:a=>eqItem(a,10,'+','10 more')},'10 less':{pool:range(20,99),make:a=>eqItem(a,10,'−','10 less')}},mix:{'10 more':15,'10 less':15}}),
 '1.NR.5b':()=>({strata:{'Add tens':{pool:pairs(1,8,1,8,(a,b)=>a+b<=9),make:([a,b])=>eqItem(a*10,b*10,'+','Add tens')},'Subtract tens':{pool:pairs(2,9,1,8,(a,b)=>b<a),make:([a,b])=>eqItem(a*10,b*10,'−','Subtract tens')}},mix:{'Add tens':15,'Subtract tens':15}}),
 '2.NR.2a':()=>({strata:addSubStrata(pairs(0,10,0,10),pairs(5,20,0,10,(a,b)=>b<=a)),
   mix:{'+:+0':1,'+:Count on 1-2':2,'+:Doubles':2,'+:Near doubles':2,'+:Make 10':2,'+:Bridge 10':5,'+:Other within 10':1,'−:−0 / −all':1,'−:Count back 1-2':2,'−:From 10':1,'−:Bridge 10':6,'−:Teens, no bridge':2,'−:Think addition':3}}),
 '2.NR.2b':()=>({strata:multiDigitStrata(2),mix:{'Add with regrouping':4,'Add, no regrouping':3,'Subtract with regrouping':5,'Subtract, no regrouping':3}}),
 '3.PAR.3m':()=>({strata:multStrata(),mix:mm()}),
 '3.PAR.3d':()=>({strata:divStrata(),mix:dm()}),
 '3.PAR.3t':()=>({strata:strataFrom(pairs(1,9,1,9),([a])=>'×'+a,([a,b],r)=>r()<.5?eqItem(a,b*10,'×','× tens'):eqItem(b*10,a,'×','× tens')),mix:{'×1':2,'×2':3,'×3':3,'×4':3,'×5':3,'×6':4,'×7':4,'×8':4,'×9':4}}),
 '3.PAR.2':()=>({strata:multiDigitStrata(3),mix:{'Add with regrouping':3,'Add, no regrouping':2,'Subtract with regrouping':5,'Subtract, no regrouping':2}}),
 '4.FACT':()=>({strata:{...prefixed('×:',multStrata()),...prefixed('÷:',divStrata())},mix:{...prefixMix('×:',allocate(mm(),15)),...prefixMix('÷:',allocate(dm(),15))}}),
 '4.NR.2':()=>({strata:multiDigitStrata(4),mix:{'Add with regrouping':3,'Add, no regrouping':1,'Subtract with regrouping':5,'Subtract, no regrouping':1}}),
 '5.NR.2a':()=>({strata:{'2-digit × 2-digit':{gen:r=>vertItem(ri(r,12,99),ri(r,11,99),'×','2-digit × 2-digit')},'3-digit × 2-digit':{gen:r=>vertItem(ri(r,102,999),ri(r,11,99),'×','3-digit × 2-digit')}},mix:{'2-digit × 2-digit':3,'3-digit × 2-digit':5}}),
 '5.NR.2b':()=>{const g=(d0,d1,sk)=>({gen:r=>{const d=ri(r,d0,d1);const q=ri(r,Math.ceil(100/d),Math.floor(9999/d));return vertItem(d*q,d,'÷',sk)}});
   return {strata:{'1-digit divisor':g(2,9,'1-digit divisor'),'2-digit divisor':g(10,25,'2-digit divisor')},mix:{'1-digit divisor':4,'2-digit divisor':4}}},
};
BLUEPRINTS['5.FACT']=BLUEPRINTS['4.FACT'];

function balancedForm(p,r){
  const bp=BLUEPRINTS[p.id](), counts=allocate(bp.mix,p.items), out=[];
  Object.entries(counts).forEach(([k,c])=>{ const s=bp.strata[k]; if(!c||!s) return;
    if(s.pool) drawFrom(s.pool,c,r).forEach(x=>{const it=s.make(x,r);it.k=k;out.push(it)});
    else { const seen=new Set(); for(let i=0;i<c;i++){ let it,t=0; do{it=s.gen(r);t++}while(seen.has(it.prompt)&&t<60); seen.add(it.prompt); it.k=k; out.push(it) } }
  });
  return arrange(out,r);
}
 
function blueprintRows(p){ const bp=BLUEPRINTS[p.id](), c=allocate(bp.mix,p.items); return Object.entries(c).filter(([,n])=>n).map(([k,n])=>[k.replace(/^[+−×÷]:/,m=>({'+:':'Add: ','−:':'Subtract: ','×:':'Multiply: ','÷:':'Divide: '}[m])).replace(/^n(\d+)$/,'$1').replace(/^×(\d)$/,'$1 × tens'),n,bp.strata[k].pool?bp.strata[k].pool.length:null]) }
PROBES.forEach(p=>{ p.gen=(r,pp)=>balancedForm(pp||p,r) });

 
 


const CMP=(a,b)=>a<b?'<':a>b?'>':'=';
const CMP_SAY={'<':'is less than','>':'is greater than','=':'is equal to'};
function cmpItem(a,b,as,bs,skill){ return {prompt:`${as} ? ${bs}`,say:`Compare ${as} and ${bs}.`,answer:CMP(a,b),skill,vis:{t:'cmp',a:as,b:bs},choices:['<','=','>']} }
const fmtN = n => n.toLocaleString('en-US');
const gens = (o) => Object.fromEntries(Object.entries(o).map(([k,g])=>[k,{gen:g}]));
const isPrime = n => { if(n<2) return false; for(let d=2;d*d<=n;d++) if(n%d===0) return false; return true };
const GROUP_LABELS = {red:'<span class="gsw" style="background:#C8102E"></span>', blue:'<span class="gsw" style="background:#1F6FB2"></span>'};

const NEW_PROBES = [
  
 {id:'K.NR.1.3',grade:'K',type:'check',label:'One more, one less (to 20)',std:'K.NR.1.3',desc:'Hear a number and find one more or one less. Read aloud, 3 answer buttons.',items:20,secs:10,input:'choices',kind:'fact'},
 {id:'K.NR.4.1',grade:'K',type:'check',label:'Hear it, tap the numeral (0-20)',std:'K.NR.4.1',desc:'The app says a number; the child taps the matching numeral. Listening task, so speaking answers is turned off.',items:20,secs:10,input:'choices',kind:'fact',noSpeak:true},
 {id:'K.NR.4.2',grade:'K',type:'check',label:'Which group has more? Fewer?',std:'K.NR.4.2',desc:'Two groups of up to 10 pictures; tap the red or blue group.',items:20,secs:10,input:'choices',kind:'fact',noSpeak:true},
 {id:'K.NR.5.1',grade:'K',type:'check',label:'Make 10 (how many more?)',std:'K.NR.5.1',desc:'Ten-frame with some dots; how many more make 10? The runway to 1.NR.2.4.',items:20,secs:10,input:'choices',kind:'fact'},
  
 {id:'1.NR.1',grade:'1',type:'check',label:'What comes next? (to 120)',std:'1.NR.1.1, 1.NR.1.2',desc:'Count forward and back, across decades and past 100.',items:20,secs:6,kind:'fact'},
 {id:'1.NR.1.3',grade:'1',type:'check',label:'Compare numbers to 100',std:'1.NR.1.3',desc:'Tap <, =, or >.',items:20,secs:6,input:'choices',kind:'fact'},
 {id:'1.NR.2.3',grade:'1',type:'check',label:'Missing number within 20',std:'1.NR.2.3',desc:'8 + ? = 13 and 15 − ? = 9, using the inverse relationship.',items:30,secs:6,kind:'fact'},
 {id:'1.NR.2.5',grade:'1',type:'check',label:'True or false? (equal sign)',std:'1.NR.2.5',desc:'Decide whether equations like 7 + 2 = 10 − 1 are true.',items:20,secs:8,input:'choices',kind:'fact'},
  
 {id:'2.NR.1.2',grade:'2',type:'check',label:'Count across tens and hundreds (to 1,000)',std:'2.NR.1.2',desc:'398, 399, ? and 402, 401, ? style sequences.',items:20,secs:6,kind:'fact'},
 {id:'2.NR.1.3',grade:'2',type:'check',label:'Compare numbers to 1,000',std:'2.NR.1.3',desc:'Tap <, =, or >, including reversed digits like 489 and 498.',items:20,secs:6,input:'choices',kind:'fact'},
 {id:'2.NR.3.1',grade:'2',type:'check',label:'Odd or even? (to 20)',std:'2.NR.3.1',desc:'A loose group of up to 20 objects; decide odd or even.',items:20,secs:10,input:'choices',kind:'fact'},
 {id:'2.NR.3.2',grade:'2',type:'check',label:'Arrays: how many in all? (to 5 × 5)',std:'2.NR.3.2',desc:'Rectangular arrays up to 5 rows and 5 columns. Builds toward multiplication.',items:20,secs:10,kind:'fact'},
  
 {id:'3.NR.1.3',grade:'3',type:'check',label:'Round to the nearest 10 or 100',std:'3.NR.1.3',desc:'Numbers to 1,000, including 5s and rounding up into the next hundred.',items:20,secs:8,kind:'fact'},
 {id:'3.NR.1.2',grade:'3',type:'check',label:'Compare numbers to 10,000',std:'3.NR.1.2',desc:'Tap <, =, or >.',items:20,secs:6,input:'choices',kind:'fact'},
  
 {id:'4.PAR.3.3',grade:'4',type:'check',label:'Missing factor (factor pairs)',std:'4.PAR.3.3',desc:'6 × ? = 48 and 48 = ? × 8, products to 100.',items:20,secs:6,kind:'fact'},
 {id:'4.PAR.3.4',grade:'4',type:'check',label:'Prime or composite?',std:'4.PAR.3.4',desc:'Numbers 2-100, including odd composites like 51 and 91.',items:20,secs:8,input:'choices',kind:'fact'},
 {id:'4.NR.1.4',grade:'4',type:'check',label:'Round multi-digit numbers',std:'4.NR.1.4',desc:'To the nearest 100 through 100,000, including rounding across a place.',items:20,secs:12,kind:'fact'},
 {id:'4.NR.5.3',grade:'4',type:'check',label:'Compare decimals to hundredths',std:'4.NR.5.3',desc:'Tap <, =, or >, including 0.5 vs 0.45 and 0.5 = 0.50.',items:20,secs:8,input:'choices',kind:'fact'},
];

Object.assign(BLUEPRINTS,{
 'K.NR.1.3':()=>({strata:{
   'One more':{pool:range(1,19),make:(n,r)=>({prompt:`One more than ${n}`,say:`What number is one more than ${n}?`,answer:n+1,skill:'One more',vis:{t:'onemore',n,dir:'more'},choices:win(r,n+1,0,20,3)})},
   'One less':{pool:range(1,20),make:(n,r)=>({prompt:`One less than ${n}`,say:`What number is one less than ${n}?`,answer:n-1,skill:'One less',vis:{t:'onemore',n,dir:'less'},choices:win(r,n-1,0,20,3)})}},
   mix:{'One more':10,'One less':10}}),
 'K.NR.4.1':()=>{const mk=(n,r)=>({prompt:`Tap ${n}`,say:`Tap ${n}.`,answer:n,quiet:true,skill:n<=10?'Numerals 0-10':'Numerals 11-20',vis:{t:'listen'},choices:shuffle(r,win(r,n,0,20,4))});
   return {strata:{'Numerals 0-10':{pool:range(0,10),make:mk},'Numerals 11-20':{pool:range(11,20),make:mk}},mix:{'Numerals 0-10':10,'Numerals 11-20':10}}},
 'K.NR.4.2':()=>{const mk=q=>([a,b],r)=>({prompt:`Which has ${q}? red ${a}, blue ${b}`,say:`Which group has ${q}?`,answer:(q==='more')===(a>b)?'red':'blue',skill:q==='more'?'Which has more':'Which has fewer',vis:{t:'groups',a,b,icon:pick(r,ICONS),q},choices:['red','blue'],labels:GROUP_LABELS});
   const far=(a,b)=>Math.abs(a-b)>=3, close=(a,b)=>a!==b&&Math.abs(a-b)<=2;
   return {strata:{'More, far apart':{pool:pairs(1,10,1,10,far),make:mk('more')},'More, close':{pool:pairs(1,10,1,10,close),make:mk('more')},'Fewer, far apart':{pool:pairs(1,10,1,10,far),make:mk('fewer')},'Fewer, close':{pool:pairs(1,10,1,10,close),make:mk('fewer')}},mix:{'More, far apart':5,'More, close':6,'Fewer, far apart':4,'Fewer, close':5}}},
 'K.NR.5.1':()=>({strata:Object.fromEntries(range(1,9).map(n=>['n'+n,{pool:[n],make:(n,r)=>({prompt:`${n} + ? = 10`,say:'How many more make 10?',answer:10-n,skill:`${Math.min(n,10-n)} and ${Math.max(n,10-n)}`,vis:{t:'frame',n},choices:win(r,10-n,0,10,4)})}])),
   mix:{n1:2,n2:2,n3:2,n4:3,n5:2,n6:3,n7:2,n8:2,n9:2}}),
 '1.NR.1':()=>{const fw=(s,skill)=>({prompt:`${s}, ${s+1}, ${s+2}, ?`,say:`${s}, ${s+1}, ${s+2}. What comes next?`,answer:s+3,skill,vis:{t:'seq',nums:[s,s+1,s+2,null]}}), bk=s=>({prompt:`${s}, ${s-1}, ${s-2}, ?`,say:`${s}, ${s-1}, ${s-2}. Count back. What comes next?`,answer:s-3,skill:'Count back',vis:{t:'seq',nums:[s,s-1,s-2,null]}});
   return {strata:{'Count forward':{pool:range(1,96).filter(s=>(s+3)%10!==0),make:s=>fw(s,'Count forward')},'Cross a decade':{pool:range(1,9).map(t=>t*10-3),make:s=>fw(s,'Cross a decade')},'Past 100':{pool:range(97,117),make:s=>fw(s,'Past 100')},'Count back':{pool:range(23,120),make:bk}},mix:{'Count forward':7,'Cross a decade':5,'Past 100':3,'Count back':5}}},
 '1.NR.1.3':()=>({strata:gens({'Different tens':r=>{let a,b;do{a=ri(r,1,99);b=ri(r,1,99)}while(Math.floor(a/10)===Math.floor(b/10));return cmpItem(a,b,a,b,'Different tens')},
   'Same tens':r=>{const t=ri(r,1,9)*10;let a,b;do{a=t+ri(r,0,9);b=t+ri(r,0,9)}while(a===b);return cmpItem(a,b,a,b,'Same tens')},
   'Equal':r=>{const a=ri(r,1,99);return cmpItem(a,a,a,a,'Equal')}}),mix:{'Different tens':9,'Same tens':8,'Equal':3}}),
 '1.NR.2.3':()=>{const it=(text,ans,skill)=>({prompt:text,say:text.replace('?','what').replace('−','minus').replace('+','plus'),answer:ans,skill,vis:{t:'eq',text}});
   return {strata:gens({'Missing addend within 10':r=>{const c=ri(r,3,10),a=ri(r,1,c-1);return it(`${a} + ? = ${c}`,c-a,'Missing addend within 10')},
     'Missing addend, teens':r=>{const c=ri(r,11,18),a=ri(r,c-10,9);return it(`${a} + ? = ${c}`,c-a,'Missing addend, teens')},
     'Missing first addend':r=>{const c=ri(r,11,18),b=ri(r,c-10,9);return it(`? + ${b} = ${c}`,c-b,'Missing first addend')},
     'Missing part in subtraction':r=>{const c=ri(r,11,18),d=ri(r,c-10,9);return it(`${c} − ? = ${d}`,c-d,'Missing part in subtraction')}}),
     mix:{'Missing addend within 10':6,'Missing addend, teens':8,'Missing first addend':8,'Missing part in subtraction':8}}},
 '1.NR.2.5':()=>{const tf=(text,ok,skill)=>({prompt:text,say:text.replace(/−/g,'minus').replace(/\+/g,'plus').replace(/=/g,'equals')+'. True or false?',ask:'True or false?',answer:ok?'True':'False',skill,vis:{t:'eq',text},choices:['True','False']});
   const off=(r,v)=>v+(r()<.5||v===0?1:-1);
   const nf=t=>r=>{const a=ri(r,1,9),b=ri(r,1,9);return tf(`${t?a+b:off(r,a+b)} = ${a} + ${b}`,t,'Number first')};
   const bs=t=>r=>{const a=ri(r,1,9),b=ri(r,1,9),s=a+b,c=ri(r,Math.max(1,s-9),Math.min(9,s-1)),d=s-c;const useSub=r()<.5;
     if(useSub){const e=ri(r,1,9),x=s+e;return tf(`${a} + ${b} = ${t?x:off(r,x)} − ${e}`,t,'Both sides')} return tf(`${a} + ${b} = ${c} + ${t?d:off(r,d)}`,t,'Both sides')};
   const sf=t=>r=>{const a=ri(r,2,18),b=ri(r,1,Math.min(9,a));const sub=r()<.5;const v=sub?a-b:a+b;if(!sub&&v>20)return sf(t)(r);return tf(`${a} ${sub?'−':'+'} ${b} = ${t?v:off(r,v)}`,t,'Standard form')};
   return {strata:gens({'Number first|T':nf(true),'Number first|F':nf(false),'Both sides|T':bs(true),'Both sides|F':bs(false),'Standard form|T':sf(true),'Standard form|F':sf(false)}),
     mix:{'Number first|T':3,'Number first|F':3,'Both sides|T':4,'Both sides|F':4,'Standard form|T':3,'Standard form|F':3}}},
 '2.NR.1.2':()=>{const fw=(s,skill)=>({prompt:`${s}, ${s+1}, ${s+2}, ?`,say:`${s}, ${s+1}, ${s+2}. What comes next?`,answer:s+3,skill,vis:{t:'seq',nums:[s,s+1,s+2,null]}}),bk=(s,skill)=>({prompt:`${s}, ${s-1}, ${s-2}, ?`,say:`${s}, ${s-1}, ${s-2}. What comes next?`,answer:s-3,skill,vis:{t:'seq',nums:[s,s-1,s-2,null]}});
   return {strata:gens({'Forward across a hundred':r=>fw(ri(r,1,9)*100-3,'Forward across a hundred'),'Forward across a ten':r=>{let t;do{t=ri(r,11,99)}while(t%10===0);return fw(t*10-3,'Forward across a ten')},
     'Backward across a hundred':r=>bk(ri(r,1,9)*100+2,'Backward across a hundred'),'Backward across a ten':r=>{let t;do{t=ri(r,11,99)}while(t%10===0);return bk(t*10+2,'Backward across a ten')}}),
     mix:{'Forward across a hundred':5,'Forward across a ten':5,'Backward across a hundred':5,'Backward across a ten':5}}},
 '2.NR.1.3':()=>({strata:gens({'Different hundreds':r=>{let a,b;do{a=ri(r,100,999);b=ri(r,100,999)}while(Math.floor(a/100)===Math.floor(b/100));return cmpItem(a,b,a,b,'Different hundreds')},
   'Same hundreds':r=>{const h=ri(r,1,9)*100;let a,b;do{a=h+ri(r,0,99);b=h+ri(r,0,99)}while(Math.floor(a/10)===Math.floor(b/10));return cmpItem(a,b,a,b,'Same hundreds')},
   'Reversed or close digits':r=>{let a,b;do{const h=ri(r,1,9),x=ri(r,0,9),y=ri(r,0,9);a=h*100+x*10+y;b=h*100+y*10+x}while(a===b);return cmpItem(a,b,a,b,'Reversed or close digits')},
   'Equal':r=>{const a=ri(r,100,999);return cmpItem(a,a,a,a,'Equal')}}),mix:{'Different hundreds':6,'Same hundreds':6,'Reversed or close digits':6,'Equal':2}}),
 '2.NR.3.1':()=>{const mk=(n,r)=>({prompt:`${n} objects: odd or even?`,say:'Is this group odd or even?',ask:'Odd or even?',answer:n%2?'Odd':'Even',skill:(n%2?'Odd':'Even')+(n<=10?' to 10':' 11-20'),vis:{t:'loose',n,s:ri(r,1,1e6),icon:pick(r,ICONS)},choices:['Odd','Even']});
   return {strata:{'Even to 10':{pool:[2,4,6,8,10],make:mk},'Odd to 10':{pool:[1,3,5,7,9],make:mk},'Even 11-20':{pool:[12,14,16,18,20],make:mk},'Odd 11-20':{pool:[11,13,15,17,19],make:mk}},mix:{'Even to 10':5,'Odd to 10':5,'Even 11-20':5,'Odd 11-20':5}}},
 '2.NR.3.2':()=>{const mk=([rows,cols])=>({prompt:`${rows} rows of ${cols}`,say:'How many in all?',ask:'How many in all?',answer:rows*cols,skill:rows*cols<=10?'Arrays to 10':rows*cols<=16?'Arrays 12-16':'Arrays 18-25',vis:{t:'array',rows,cols}});
   return {strata:strataFrom(pairs(2,5,2,5),([a,b])=>a*b<=10?'Arrays to 10':a*b<=16?'Arrays 12-16':'Arrays 18-25',mk),mix:{'Arrays to 10':6,'Arrays 12-16':7,'Arrays 18-25':7}}},
 '3.NR.1.3':()=>{const rnd=(n,p)=>Math.round(n/p)*p, it=(n,p,skill)=>({prompt:`Round ${fmtN(n)} to the nearest ${p}`,say:`Round ${n} to the nearest ${p}.`,answer:rnd(n,p),skill,vis:{t:'round',n:fmtN(n),p:fmtN(p)}});
   return {strata:gens({'Nearest 10':r=>{let n;do{n=ri(r,11,989)}while([0,5].includes(n%10)||n%100>=95);return it(n,10,'Nearest 10')},
     'Nearest 10, ones digit 5':r=>{let n;do{n=ri(r,1,98)*10+5}while(n%100===95);return it(n,10,'Nearest 10, ones digit 5')},
     'Nearest 100':r=>{let n;do{n=ri(r,101,949)}while(n%100===0||Math.floor(n/10)%10===5);return it(n,100,'Nearest 100')},
     'Nearest 100, tens digit 5':r=>{const n=ri(r,1,8)*100+50+ri(r,0,9);return it(n,100,'Nearest 100, tens digit 5')},
     'Up into the next hundred':r=>r()<.5?it(ri(r,1,9)*100-ri(r,1,4),10,'Up into the next hundred'):it(ri(r,950,999),100,'Up into the next hundred')}),
     mix:{'Nearest 10':6,'Nearest 10, ones digit 5':2,'Nearest 100':6,'Nearest 100, tens digit 5':2,'Up into the next hundred':4}}},
 '3.NR.1.2':()=>({strata:gens({'Different number of digits':r=>{const a=ri(r,100,999),b=ri(r,1000,9999);return r()<.5?cmpItem(a,b,fmtN(a),fmtN(b),'Different number of digits'):cmpItem(b,a,fmtN(b),fmtN(a),'Different number of digits')},
   'Different thousands':r=>{let a,b;do{a=ri(r,1000,9999);b=ri(r,1000,9999)}while(Math.floor(a/1000)===Math.floor(b/1000));return cmpItem(a,b,fmtN(a),fmtN(b),'Different thousands')},
   'Different hundreds':r=>{const th=ri(r,1,9)*1000;let a,b;do{a=th+ri(r,0,999);b=th+ri(r,0,999)}while(Math.floor(a/100)===Math.floor(b/100));return cmpItem(a,b,fmtN(a),fmtN(b),'Different hundreds')},
   'Different tens or ones':r=>{const base=ri(r,10,99)*100;let a,b;do{a=base+ri(r,0,99);b=base+ri(r,0,99)}while(a===b);return cmpItem(a,b,fmtN(a),fmtN(b),'Different tens or ones')},
   'Equal':r=>{const a=ri(r,1000,9999);return cmpItem(a,a,fmtN(a),fmtN(a),'Equal')}}),mix:{'Different number of digits':4,'Different thousands':4,'Different hundreds':5,'Different tens or ones':5,'Equal':2}}),
 '4.PAR.3.3':()=>{const mk=(lo,hi,skillOf)=>r=>{const a=ri(r,lo,hi),b=ri(r,2,Math.floor(100/a)),p=a*b,f=ri(r,0,2);const text=f===0?`${a} × ? = ${p}`:f===1?`? × ${a} = ${p}`:`${p} = ${a} × ?`;return {prompt:text,say:text.replace('×','times').replace('?','what'),answer:b,skill:a+'s',vis:{t:'eq',text}}};
   return {strata:gens({'Known factor 2-5':mk(2,5),'Known factor 6-9':mk(6,9)}),mix:{'Known factor 2-5':8,'Known factor 6-9':12}}},
 '4.PAR.3.4':()=>{const mk=n=>({prompt:`${n}: prime or composite?`,say:`Is ${n} prime or composite?`,ask:'Prime or composite?',answer:isPrime(n)?'Prime':'Composite',skill:'',vis:{t:'bignum',n},choices:['Prime','Composite']});
   const st=(pool,skill)=>({pool,make:n=>Object.assign(mk(n),{skill})});
   return {strata:{'Prime under 20':st(range(2,19).filter(isPrime),'Prime under 20'),'Prime 20-100':st(range(20,100).filter(isPrime),'Prime 20-100'),'Composite, even':st(range(4,100).filter(n=>n%2===0),'Composite, even'),'Composite, odd':st(range(9,99).filter(n=>n%2&&!isPrime(n)),'Composite, odd')},
     mix:{'Prime under 20':5,'Prime 20-100':5,'Composite, even':4,'Composite, odd':6}}},
 '4.NR.1.4':()=>{const rnd=(n,p)=>Math.round(n/p)*p, it=(n,p,skill)=>({prompt:`Round ${fmtN(n)} to the nearest ${fmtN(p)}`,say:`Round ${fmtN(n)} to the nearest ${fmtN(p)}.`,answer:rnd(n,p),skill,vis:{t:'round',n:fmtN(n),p:fmtN(p)}});
   const plain=(p,lo,hi)=>r=>{let n;do{n=ri(r,lo,hi)}while(n%p===0||Math.floor(n/(p/10))%10===9);return it(n,p,'Nearest '+fmtN(p))};
   return {strata:{'Nearest 100':{gen:plain(100,1000,99999)},'Nearest 1,000':{gen:plain(1000,10000,99999)},'Nearest 10,000':{gen:plain(10000,10000,999999)},'Nearest 100,000':{gen:plain(100000,100000,999999)},
     'Across a place':{gen:r=>{const p=pick(r,[100,1000,10000]);const top=ri(r,1,9)*p*10;return it(top-ri(r,1,p/2-1),p,'Across a place')}}},
     mix:{'Nearest 100':4,'Nearest 1,000':4,'Nearest 10,000':4,'Nearest 100,000':4,'Across a place':4}}},
 '4.NR.5.3':()=>{const d=h=>(h/100).toFixed(2), t=x=>(x/10).toFixed(1);
   return {strata:gens({'Tenths vs hundredths':r=>{const T=ri(r,2,9),H=(T-1)*10+ri(r,1,19);if(H===T*10)return cmpItem(T*10,H+1,t(T),d(H+1),'Tenths vs hundredths');return r()<.5?cmpItem(T*10,H,t(T),d(H),'Tenths vs hundredths'):cmpItem(H,T*10,d(H),t(T),'Tenths vs hundredths')},
     'Same tenths':r=>{const T=ri(r,0,9);let a,b;do{a=T*10+ri(r,1,9);b=T*10+ri(r,1,9)}while(a===b);return cmpItem(a,b,d(a),d(b),'Same tenths')},
     'Different tenths':r=>{let a,b;do{a=ri(r,1,99);b=ri(r,1,99)}while(Math.floor(a/10)===Math.floor(b/10));return cmpItem(a,b,d(a),d(b),'Different tenths')},
     'Equal (0.5 and 0.50)':r=>{const T=ri(r,1,9);return r()<.5?cmpItem(T*10,T*10,t(T),d(T*10),'Equal (0.5 and 0.50)'):cmpItem(T*10,T*10,d(T*10),t(T),'Equal (0.5 and 0.50)')},
     'Different ones':r=>{const a=100+ri(r,0,99),b=ri(r,50,99);return r()<.5?cmpItem(a,b,d(a),d(b),'Different ones'):cmpItem(b,a,d(b),d(a),'Different ones')}}),
     mix:{'Tenths vs hundredths':5,'Same tenths':4,'Different tenths':4,'Equal (0.5 and 0.50)':3,'Different ones':4}}},
});

 
NEW_PROBES.forEach(p=>{ p.gen=(r,pp)=>balancedForm(pp||p,r); PR[p.id]=p; const last=PROBES.map(x=>x.grade).lastIndexOf(p.grade); PROBES.splice(last+1,0,p); });
 
const FLUENCY_IDS=['K.NR.5','1.NR.2','2.NR.2a','2.NR.2b','3.PAR.2','4.NR.2','5.NR.2a'];
PROBES.forEach(p=>{ if(!p.type) p.type = FLUENCY_IDS.includes(p.id)?'fluency':['3.PAR.3m','3.PAR.3d'].includes(p.id)?'local':'check'; });
const TYPE_LABEL={fluency:'Fluency standard',check:'Skill check',local:'Local expectation'};

 
 



const MOVES = {
 'Quantities 1-5':'Quick looks with dot cards and five-frames; name the amount without counting.',
 'Quantities 6-10':'Ten-frame flashes: 5 and some more. Ask, "How did you see it?"',
 'Ten and 0-4':'Two ten-frames: say "ten and ___" before naming the teen number.','Ten and 5-9':'Build teens on a rekenrek: ten and some more.',
 'Count forward':'Choral counting from any number; stop and ask what comes next.','Count back':'Count back from 20 with a number path; launch-style countdowns.',
 'Put together':'Story mats with counters; act out joining stories.','Take apart':'Take-from stories with cubes; cover and remove.',
 'Count on 1-2':'Start with the bigger number and count on.','Doubles':'Doubles pictures and mirror games.','Near doubles':'Doubles plus or minus one number strings.',
 'Make 10':'Ten-frame partners of 10; "What goes with 7 to make 10?"','Bridge 10':'Make-10 strategy: 8 + 5 is 8 + 2 + 3.','Other within 10':'Part-part-whole mats and number bonds.',
 'Count back 1-2':'Count back on a number line.','Think addition':'Think addition: 9 − 4, what plus 4 makes 9?','From 10':'Partners of 10 reversed.','−0 / −all':'Talk through zero and same-number rules.','Teens, no bridge':'Subtract from the ones: 17 − 4, take 4 from 7.',
 '10 more':'Hundred chart moves down one row.','10 less':'Hundred chart moves up one row.','Add tens':'Count by tens; 3 tens and 4 tens.','Subtract tens':'Base-ten rods: remove tens.',
 '0s':'Groups of zero: 5 groups of nothing.','1s':'Identity property talk.','2s':'Doubles.','3s':'Double plus one more group.','4s':'Double the double.','5s':'Clock and nickel counting.',
 '6s':'Break apart: 5 groups plus 1 more group.','7s':'Break apart: 5 groups plus 2 groups.','8s':'Double, double, double.','9s':'Use 10s and take one group away.','10s':'Place value: ten groups.','11s':'Break apart 10 + 1.','12s':'Break apart 10 + 2.',
 '× tens':'Place value: 4 × 30 is 4 × 3 tens.','Add with regrouping':'Place value disks to show the trade before the algorithm.','Subtract with regrouping':'Decompose a ten (or hundred) with base-ten blocks; regrouping across zeros.',
 'Add, no regrouping':'Mental place-value addition.','Subtract, no regrouping':'Mental place-value subtraction.','3-digit × 2-digit':'Area model, then partial products, then the algorithm.','2-digit × 2-digit':'Area model to partial products.',
 '1-digit divisor':'Partial quotients with friendly multiples.',
 'One more':'Number path: put a finger on the number and step forward one.','One less':'Number path: step back one; stair-step cubes.','Numerals 0-10':'Numeral cards with matching dot cards; trace and say.','Numerals 11-20':'Teen numbers on ten-frame cards: say "ten and ___" then the numeral.',
 'Which has more':'Line the two groups up one-to-one and see which has extras.','Which has fewer':'Match one-to-one; the group that runs out first has fewer.',
 'Count forward':'Choral count from any number; stop and predict the next.','Cross a decade':'Hundred chart: what happens after 39? Point to the next row.','Past 100':'Extend the hundred chart to 120 and count across 100.','Count back':'Count back on a number line or hundred chart.',
 'Different tens':'Compare tens first with base-ten rods.','Same tens':'Same tens? Compare the ones.','Equal':'Talk about what = means: the same value on both sides.',
 'Missing addend within 10':'Number bonds: the whole and one part, find the other part.','Missing addend, teens':'Count up through 10: 8 + 2 is 10, then 3 more.','Missing first addend':'Turn it around: ? + 5 = 12 is the same as 5 + ? = 12.','Missing part in subtraction':'Think addition: 15 − ? = 9 means 9 + ? = 15.',
 'Number first':'Read the equal sign as "is the same as."','Both sides':'Balance scale: work out each side, then compare.','Standard form':'Solve, then check the given answer.',
 'Forward across a hundred':'Base-ten blocks: 10 tens make the next hundred.','Forward across a ten':'Hundred chart moves to the next row after a 9.','Backward across a hundred':'Unbundle a hundred into tens.','Backward across a ten':'Unbundle a ten to count back.',
 'Different hundreds':'Compare hundreds first.','Same hundreds':'Same hundreds? Compare the tens, then ones.','Reversed or close digits':'Read both numbers aloud; check the tens place first.',
 'Even to 10':'Pair objects up: everyone has a partner means even.','Odd to 10':'Pair objects up: one left over means odd.','Even 11-20':'Build with cubes in two rows.','Odd 11-20':'Two equal rows plus one left over.',
 'Arrays to 10':'Count by rows: skip count the rows.','Arrays 12-16':'Skip count by the row size.','Arrays 18-25':'Repeated addition by rows: 5 + 5 + 5 + 5.',
 'Nearest 10':'Number line: which ten is it closer to?','Nearest 10, ones digit 5':'Teach the halfway rule: 5 rounds up.','Nearest 100':'Number line between two hundreds.','Nearest 100, tens digit 5':'Halfway is 50: round up.','Up into the next hundred':'296 to the nearest 10 is 300: the tens roll over.',
 'Different number of digits':'More digits means a greater whole number.','Different thousands':'Compare the thousands place first.','Different tens or ones':'Line up the places and compare left to right.',
 'Known factor 2-5':'Think multiplication: 4 × ? = 28.','Known factor 6-9':'Use a known fact: 6 × 8 is 5 × 8 plus 8.',
 'Prime under 20':'Build rectangles with tiles: only one rectangle means prime.','Prime 20-100':'Test small divisors: 2, 3, 5, 7.','Composite, even':'Every even number past 2 is composite.','Composite, odd':'Check 3, 7, and 9 patterns: 51 = 3 × 17, 91 = 7 × 13.',
 'Nearest 1,000':'Number line between two thousands.','Nearest 10,000':'Underline the place, look one place right.','Nearest 100,000':'Underline the place, look one place right.','Across a place':'9,960 to the nearest 100 is 10,000: the places roll over.',
 'Tenths vs hundredths':'Rewrite 0.5 as 0.50 before comparing.','Same tenths':'Same tenths? Compare hundredths.','Different tenths':'Compare tenths first, on a hundredths grid.','Equal (0.5 and 0.50)':'Shade 0.5 and 0.50 on grids: same amount.','Different ones':'Compare the whole number first.','2-digit divisor':'Make a multiples list of the divisor first; estimate with compatible numbers.'
};
const moveFor = k => MOVES[k] || (k.startsWith('÷') ? `Use the related multiplication fact: think ${k.slice(1)} × ? .` : 'Small-group strategy instruction on this fact set.');


const teaching={"K.NR.1":"Use quick looks with five-frames, then ten-frames. Ask how the student saw the quantity; observe one-to-one counting and cardinality.","K.NR.1p":"Model touching or moving one object for each count word, then stop at the requested amount. Ask how the student knows the set has enough.","K.NR.2":"Use a number path and count from different starting numbers. Separate forward-counting difficulty from backward-counting difficulty.","K.NR.3":"Build teen numbers as ten and some more with frames or a rekenrek. Say ten and three before naming thirteen.","K.NR.5":"Act out joining and take-away stories with counters. Connect the picture, spoken situation and equation; ask the student to explain a strategy.","K.NR.1.3":"Use stair-step cubes or a number path. Ask what changes when one is added or removed.","K.NR.4.1":"Match spoken number names to numeral cards and dot cards. Check hearing, audio access and numeral recognition separately.","K.NR.4.2":"Match groups one-to-one. Name which has extras or which runs out first, then connect to more and fewer.","K.NR.5.1":"Fill the empty spaces in a ten-frame. Connect 7 and 3 make 10 to 7 plus what equals 10.","1.NR.2":"Teach count-on, doubles, near doubles and partners of ten. Connect subtraction to a missing addend; ask for a strategy on two examples.","1.NR.5a":"Use base-ten rods and a hundred chart. Ask what changes in the tens place and what stays the same in the ones place.","1.NR.5b":"Rename amounts as units of ten: three tens plus four tens. Model with rods before abstract equations.","1.NR.1":"Count from any number, crossing decades and 100. Use an extended hundred chart to explain transitions.","1.NR.1.3":"Compare tens first and ones when tens match. Read the relation as a sentence and use equal to mean the same value.","1.NR.2.3":"Use number bonds and the inverse relationship. For 15 minus what equals 9, ask what added to 9 makes 15.","1.NR.2.5":"Read equals as is the same as. Model both sides on a balance or with counters; avoid teaching equals as a command to give an answer.","2.NR.2a":"Model make-ten and bridge-ten strategies, doubles and near doubles. Use related addition facts for subtraction and compare efficient strategies.","2.NR.2b":"Partition tens and ones and model trades with base-ten blocks. Ask for an estimate and an explanation of regrouping before encouraging faster practice.","2.NR.1.2":"Use place-value blocks and number lines to cross a ten or hundred. Explain bundling and unbundling rather than only memorizing the sequence.","2.NR.1.3":"Compare hundreds, then tens, then ones. Read numbers aloud when reversed digits cause confusion.","2.NR.3.1":"Pair objects or arrange two equal rows. Explain the leftover object in odd quantities before teaching digit patterns.","2.NR.3.2":"Count equal rows using repeated addition or skip counting. Connect rows, columns and total, and show a rotated array.","3.PAR.3m":"Use arrays and equal groups. Derive unknown facts from known ones: six groups as five groups plus one, or nine groups as ten minus one.","3.PAR.3d":"Connect sharing and grouping to related multiplication facts. Ask which multiplication equation checks the quotient.","3.PAR.3t":"Describe 4 times 30 as 4 times 3 tens. Connect the basic fact to units of ten instead of a rule about adding a zero.","3.PAR.2":"Model trading hundreds and tens, including subtraction across zeros. Compare place-value strategies and check estimates.","3.NR.1.3":"Locate a number between consecutive tens or hundreds on a number line. Compare distance to endpoints, including exact midpoint cases.","3.NR.1.2":"Compare the highest place where digits differ. Use expanded forms to explain the relation rather than comparing isolated digits.","4.FACT":"Keep prerequisite multiplication and division facts active while working on grade-level problems. Review recurring fact families through derived-fact strategies.","4.NR.2":"Use place-value reasoning, estimates and inverse checks. Ask why a trade preserves the amount, especially across zeros.","4.PAR.3.3":"Use factor pairs and related division. Build a rectangle with a known side length and total area to determine the missing factor.","4.PAR.3.4":"List factor pairs or build arrays. Include odd composite examples and explain why odd does not mean prime.","4.NR.1.4":"Locate adjacent multiples of the requested place on a number line. Explain midpoint and rounding across a place value.","4.NR.5.3":"Use hundred grids and place-value units. Explain that five tenths is fifty hundredths and that more digits does not necessarily mean a larger value.","5.FACT":"Maintain prerequisite facts in brief mixed retrieval while connecting them to multi-digit calculations. Ask for a derived fact when recall is uncertain.","5.NR.2a":"Connect an area model to partial products and an efficient procedure. Use estimation and explicit place-value explanations to inspect missing partial products.","5.NR.2b":"Use friendly multiples and partial quotients, then check by multiplication. Estimate the quotient and discuss the meaning of division in a real situation."};
window.RaceCatalog={teaching,probes:PROBES.map(p=>({...p,name:p.label,symbol:'',operation:'mixed',probeId:p.id})),make(id,n=20,seenIds=[],normalize,seed){const p=PR[id],r=rng(seed==null?Math.floor(Math.random()*4294967295):hash(seed));if(!normalize)return balancedForm({...p,items:n},r);const bp=BLUEPRINTS[id](),counts=allocate(bp.mix,n),seen=new Set(seenIds),out=[];for(const [k,count] of Object.entries(counts)){const st=bp.strata[k];if(st.pool){const pool=shuffle(r,st.pool.map(x=>st.make(x,r)));pool.sort((a,b)=>Number(seen.has(normalize(a,id).id))-Number(seen.has(normalize(b,id).id)));for(let i=0;i<count;i++)out.push({...pool[i%pool.length],k})}else{const used=new Set();for(let i=0;i<count;i++){let it,t=0;do{it=st.gen(r);t++}while(used.has(it.prompt)&&t<60);used.add(it.prompt);out.push({...it,k})}}}return arrange(out,r)},pool(id){const bp=BLUEPRINTS[id](),r=rng(42);if(Object.values(bp.strata).some(s=>!s.pool))return null;return Object.values(bp.strata).flatMap(s=>s.pool.map(x=>s.make(x,r)))},moves:MOVES,moveFor,famAdd,famSub};
})();