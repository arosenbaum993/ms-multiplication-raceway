(()=>{'use strict';
// Guidance follows official checks, while the last-session recap includes retakes.
function message({name='explorer',skill,summary:s,activity=[]}){
 const checks=activity.filter(a=>a.valid&&a.mode==='assessment').sort((a,b)=>a.startedAt.localeCompare(b.startedAt));
 const last=checks.at(-1),latest=activity.filter(a=>a.valid).sort((a,b)=>a.startedAt.localeCompare(b.startedAt)).at(-1);
 let reached=false,streak=[];for(const a of s.officialAttempts.slice(3)){streak=a.percent>=95&&(!a.timeLimitSec||a.activeMs<=a.timeLimitSec*1000)?[...streak,a]:[];if(streak.length>=3&&(!a.protocolVersion||new Set(streak.map(a=>a.formId)).size>=3))reached=true}
 const count=s.baselineCount,remaining=3-count;
 let title,body,next,stage,progress;
 if(count===0){title='Your journey starts today, '+name+'!';body='Let’s find your starting line in '+skill+'. Complete three baseline checks. You can do them today or across different days. Each check has '+(s.protocol?.items||20)+' questions and a '+(s.protocol?.seconds||90)+'-second time limit.';next='Warm up, then choose any race for your first check.';stage='Your starting line';progress=0}
 else if(count<3){title=count===1?'Great start, '+name+'!':'You’re building your starting line, '+name+'!';body=(count===1?'Your first baseline is complete.':'Your second baseline is complete.')+' You need '+remaining+' more '+(remaining===1?'session':'sessions')+'. You can continue today.';next='Warm up, then choose any race for baseline '+(count+1)+' of 3.';stage='Baseline '+count+' of 3';progress=count}
 else if(reached){title='You reached your goal, '+name+'!';body='You earned three passing checks at 95% or higher within the time limit on different days and forms. Great work sticking with '+skill+'!';next=s.accuracyGoalMet?'This skill is checked off. Your next pathway step opens automatically. Keep these facts strong with a later check.':'One lower score does not erase your progress. Warm up and ask your teacher about a check to see what you remember.';stage='Three passing checks earned';progress=3}
 else{title=s.passes?'Keep it going, '+name+'!':s.officialAttempts.length===3?'Your starting line is set, '+name+'!':'Keep growing, '+name+'!';body='Your baseline is '+s.baseline+'%. '+(s.passes?'You have '+s.passes+' of 3 passing checks. '+(3-s.passes)+' more in a row at 95% or higher within the time limit will reach your accuracy goal.':'Now build toward three passing checks in a row at 95% or higher on different days.');next=s.today?'Your check today is saved. Warm up or race for practice today; your next check will show your progress.':'Warm up, then choose any race for your next check.';stage='Passing checks '+s.passes+' of 3';progress=s.passes}
 let recap='';if(last){const n=Array.isArray(last.items)?last.items.length:Number(last.items)||20;recap=(s.protocol&&last.protocolSignature!==s.protocol.signature?'Earlier race under previous settings: ':'Last race: ')+last.correct+' of '+n+' right ('+Math.round(last.percent)+'%). '+(last.correct===n?'You got every question right. Let’s keep that strong!':'Let’s try to beat that. Take your time and aim for correct answers.');if(s.baselineCount===3&&s.today&&last.id!==s.last?.id&&last.date===s.last?.date)recap+=' Extra races are practice; today’s first check counts.'}
 if(latest?.mode==='warmup'){const n=latest.responses?.length||10;recap=(recap?recap+' ':'')+'Warm-up complete: '+latest.correct+' of '+n+' right on your first try.'}
 return{title,body,next,recap,stage,progress,reached};
}
window.StudentCoach={message};
})();
