(()=>{
const F=Fluency,qs=new URLSearchParams(location.search),isChart=qs.get('view')==='chart',isReports=location.pathname.includes('reports'),isHome=/\/(index.html)?$/.test(location.pathname);
let timer;
function banner(){if(F.isTour())return;if(!F.isDemo()||window.top!==window||F.demo?.loadSamples)return;const bar=document.createElement('div');bar.style.cssText='background:#fff0ba;color:#45360e;padding:10px 18px;text-align:center;font:700 14px system-ui';bar.innerHTML='CONNECTED DEMO · Simulated student scores · <a href="intervention.html" style="color:inherit">Demo controls and intervention</a>';document.body.prepend(bar)}
banner();
if(isChart||isReports||isHome)F.onChange(()=>{clearTimeout(timer);timer=setTimeout(()=>location.reload(),100)});
})();
