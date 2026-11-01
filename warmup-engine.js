(()=>{
const F=Fluency;
F.createWarmup=function(game,paceSec=5){
 const storageKey=F.storageKey(),skill=F.currentSkill(),plan=F.warmupPlan(skill),items=plan.items,startedAt=new Date().toISOString();
 const w={id:crypto.randomUUID(),demo:F.isDemo(),storageKey,game,skill,mode:'warmup',date:F.date(),startedAt,version:2,formVersion:'warmup-10-plus-10-v3',focus:{version:plan.version,targetedIds:plan.targetedIds,sourceAttemptIds:plan.sourceAttemptIds,simulated:plan.simulated},paceSec,pacedItems:items.slice(0,10),items:items.slice(10,20),paced:[],responses:[],retries:[],typedIndex:0,correct:0,activeMs:0,mentalAccuracy:null,valid:false,finished:false,status:'in-progress',
 checkpoint(){const s=F.read(storageKey),record=JSON.parse(JSON.stringify(this)),i=s.attempts.findIndex(a=>a.id===this.id);if(i<0)s.attempts.push(record);else s.attempts[i]=record;this.saved=F.save(s,storageKey);return this.saved},
 expose(paceSec,exposureMs,answerViewMs=1000){if(this.finished||this.paced.length>=10)return false;const it=this.pacedItems[this.paced.length];this.paced.push({itemId:it.id,prompt:it.prompt,expected:it.answer,paceSec,exposureMs:Math.round(exposureMs),answerViewMs:Math.round(answerViewMs),mentalCorrect:null});this.activeMs+=exposureMs+answerViewMs;this.checkpoint();return true},
 submit(value,rtMs,responseMethod='typed'){if(this.finished||this.paced.length!==10||this.typedIndex>=10||String(value).trim()==='')return null;const it=this.items[this.typedIndex],ok=String(value).trim()===String(it.answer),record={itemIndex:this.typedIndex,itemId:it.id,prompt:it.prompt,expected:it.answer,response:typeof it.answer==='number'?Number(value):String(value),subskill:it.subskill,correct:ok,rtMs:Math.round(rtMs),responseMethod,at:new Date().toISOString()};if(this.responses.length===this.typedIndex){this.responses.push(record);this.correct+=ok?1:0}else this.retries.push(record);this.activeMs+=rtMs;if(ok)this.typedIndex++;this.percent=this.correct/this.responses.length*100;this.checkpoint();return ok},
 finish(complete=true){if(this.finished)return this;this.finished=true;this.valid=complete&&this.paced.length===10&&this.typedIndex===10;this.status=this.valid?'complete':'interrupted';this.completedAt=new Date().toISOString();this.percent=this.responses.length?this.correct/this.responses.length*100:null;this.checkpoint();return this}
 };w.checkpoint();return w;
};
})();
