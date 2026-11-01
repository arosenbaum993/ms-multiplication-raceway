(()=>{'use strict';
const F=Fluency,grades=['PK','K','1','2','3','4','5'];
const gradeName=g=>g==='PK'?'Pre-K':g==='K'?'Kindergarten':'Grade '+g;
const sequence=grades.flatMap(g=>Object.keys(F.skills).filter(id=>F.skills[id].grade===g));
const startingGrade=g=>Number(g)>=2?'1':'PK';
function model(state=F.read()){const enrolledGrade=String(state.profile?.grade||'3'),startGrade=(grades.includes(state.pathway?.startGrade)?state.pathway.startGrade:startingGrade(enrolledGrade)),steps=sequence.filter(id=>grades.indexOf(F.skills[id].grade)>=grades.indexOf(startGrade));const completed=sequence.filter(id=>F.summary(id).accuracyGoalMet);const currentSkill=steps.find(id=>!completed.includes(id))||steps.at(-1);const assignedSkill=F.hasSkill(state.pathway?.assignedSkill)?state.pathway.assignedSkill:steps[0];return{enrolledGrade,startGrade,steps,completed,currentSkill,assignedSkill,allComplete:steps.every(id=>completed.includes(id))}}
function ensure(){const s=F.read();if(s.pathway?.version===1&&s.profile?.grade)return;const m=model(s);s.profile={...s.profile,grade:m.enrolledGrade};s.pathway={version:1,startGrade:m.startGrade,assignedSkill:m.assignedSkill,assignedAt:new Date().toISOString(),completionNotices:[]};F.save(s)}
function assign(id){if(!F.hasSkill(id))return false;const s=F.read();s.pathway={...s.pathway,version:1,startGrade:model(s).startGrade,assignedSkill:id,assignedAt:new Date().toISOString()};return F.save(s)}
function setGrade(g){if(!grades.includes(String(g)))return false;const s=F.read();s.profile={...s.profile,grade:String(g)};s.pathway={...s.pathway,version:1,startGrade:startingGrade(g),assignedSkill:sequence.find(id=>F.skills[id].grade===startingGrade(g))};return F.save(s)}
function context(){return new URLSearchParams(location.search).get('context')==='intervention'?'intervention':'independent'}
const create=F.create;F.create=function(game,mode){const session=create(game,mode),m=model();session.workContext=context()==='intervention'&&session.skill===m.assignedSkill?'intervention':'independent';session.studentGrade=m.enrolledGrade;session.assignedSkillAtStart=m.assignedSkill;return session};
function reportSkills(state=F.read()){const m=model(state),top=grades.indexOf(m.enrolledGrade),played=new Set(state.attempts.filter(a=>!a.source?.includes('demo')).map(a=>a.skill));return sequence.filter(id=>m.steps.includes(id)&&grades.indexOf(F.skills[id].grade)<=top||id===m.assignedSkill||played.has(id))}
window.StudentPathway={reportSkills,grades,gradeName,sequence,startingGrade,model,ensure,assign,setGrade,context};ensure();
})();
