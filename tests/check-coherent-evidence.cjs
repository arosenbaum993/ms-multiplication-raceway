const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base=__dirname+'/../dist/';
const ctx={console,Map,Set,Date,Math,JSON,URLSearchParams,location:{pathname:'/',search:''},sessionStorage:{getItem(){return null}},localStorage:{getItem(){return null}},document:{},performance:{now:()=>0},window:{addEventListener(){}}};
ctx.window=Object.assign(ctx.window,ctx);ctx.window.top=ctx.window;vm.createContext(ctx);
for(const file of ['skill-catalog.js','session.js','race-protocol.js']){vm.runInContext(fs.readFileSync(base+file,'utf8'),ctx);Object.assign(ctx,ctx.window);}
const source=fs.readFileSync(base+'walkthrough.js','utf8'),recordCode=source.slice(source.indexOf('function record('),source.indexOf('\nfunction seed('));
vm.runInContext('const scores=[17,19,18,23,20,29,30,29],dates=["2026-09-14","2026-09-14","2026-09-14","2026-09-16","2026-09-18","2026-09-21","2026-09-23","2026-09-25"];'+recordCode+';globalThis.record=record',ctx);
const records=Array.from({length:8},(_,i)=>ctx.record(i));
for(let i=0;i<8;i++){const r=records[i];assert.equal(r.correct,r.responses.filter(x=>x.correct).length);assert.equal(r.responses.length,30);assert(ctx.RaceProtocol.matches(r,'add10'));assert(r.activeMs<=90000);assert(Date.parse(r.completedAt)>Date.parse(r.startedAt));for(const x of r.items)assert(x.a+x.b<=10);if(i<5)for(const x of r.responses){if(x.subskill==='Make 10')assert.equal(x.correct,false);if(['+0','Doubles'].includes(x.subskill))assert.equal(x.correct,true);}}
ctx.ItemUI={esc:s=>s};vm.runInContext(fs.readFileSync(base+'teacher-notes.js','utf8'),ctx);Object.assign(ctx,ctx.window);
const state={attempts:records.slice(0,5)},summary={officialAttempts:records.slice(0,5),baselineCount:3,passes:0};
const guidance=ctx.TeacherNotes.guidance('add10',{state,summary});
console.log(guidance.rules[0]);console.log(guidance.facts.map(x=>({prompt:x.prompt,family:x.subskill})));
assert.equal(guidance.rules[0].id,'fact-family');assert(guidance.rules[0].message.startsWith('Make 10: 0%'));assert.equal(guidance.facts[0].subskill,'Make 10');
console.log('Eight protocol-valid records; first five Make 10=0%, +0/doubles=100%; evidence-derived lesson matches.');
