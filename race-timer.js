(()=>{'use strict';
function create(session,{onExpire}={}){let running=false,start=0,elapsed=0,interval,expired=false,bar=document.createElement('div');bar.className='race-time-bar';bar.setAttribute('role','timer');bar.setAttribute('aria-label','Race time remaining');bar.innerHTML='<strong></strong><span></span>';document.body.appendChild(bar);
const now=()=>elapsed+(running?performance.now()-start:0),remaining=()=>Math.max(0,session.timeLimitSec*1000-now());
function tick(){const ms=remaining(),sec=Math.ceil(ms/1000);bar.querySelector('strong').textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');bar.querySelector('span').textContent='Form '+session.formId+' · '+session.responses.length+' / '+session.items.length+' · Goal '+Math.ceil(session.items.length*.95)+' correct';bar.classList.toggle('time-low',sec<=15);if(ms<=0&&!expired){expired=true;running=false;elapsed=session.timeLimitSec*1000;session.activeMs=elapsed;clearInterval(interval);onExpire?.()}}
function resume(){if(session.finished||expired||running)return;start=performance.now();running=true;clearInterval(interval);interval=setInterval(tick,50);tick()}
function pause(at=performance.now()){if(running){elapsed+=Math.max(0,Math.min(performance.now(),at)-start);running=false}session.activeMs=elapsed;tick()}
function stop(){if(running)elapsed+=Math.max(0,performance.now()-start);running=false;clearInterval(interval);bar.remove();session.activeMs=Math.min(elapsed,session.timeLimitSec*1000)}
function finishUnanswered(){session.timedOut=true;const first=session.responses.length;for(let i=first;i<session.items.length;i++){const it=session.items[i];session.responses.push({itemId:it.id,prompt:it.prompt,expected:it.answer,response:'',correct:false,unanswered:true,notPresented:i>first,subskill:it.subskill,rtMs:0})}session.activeMs=session.timeLimitSec*1000}
tick();return{resume,pause,stop,remaining,finishUnanswered};}
window.RaceTimer={create};
})();
