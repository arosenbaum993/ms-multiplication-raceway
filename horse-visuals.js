(()=>{
const art={full:{},ready:null};window.HorseArt=art;
let drawingStill=false;
const completeMascot=mascot;
mascot=function(kind,options={}){const previous=drawingStill;drawingStill=!!options.still;try{return completeMascot(kind,options)}finally{drawingStill=previous}};
// Preserve the original animal artwork. Rebuild complete torsos from its atlas,
// rather than rotating the old torso pieces with missing joints and stray hooves.
art.ready=new Promise(resolve=>{
 let settled=false;const finish=error=>{if(settled)return;settled=true;clearTimeout(timeout);art.error=error||null;resolve()};const timeout=setTimeout(()=>finish('Artwork loading timed out'),15000);const image=new Image();image.onload=async()=>{try{const tasks=[];
  for(const kind of ['horse','zebra','tiger','moto']){
   const crop=RACER_CROPS[kind],colors=kind==='horse'?COATS:['#B5651D'];
   for(const color of colors){const canvas=document.createElement('canvas');canvas.width=crop.w;canvas.height=crop.h;
    const cx=canvas.getContext('2d',{willReadFrequently:true});const sourceWidth=kind==='horse'?830:crop.w;cx.drawImage(image,crop.x,crop.y,sourceWidth,crop.h,0,0,sourceWidth,crop.h);
    if(kind==='horse'&&color!=='#B5651D'){
     const pixels=cx.getImageData(0,0,crop.w,crop.h),data=pixels.data,target=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
     for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<30||r<45||r<g*1.16||r<b*1.35)continue;
      const light=(r*.3+g*.59+b*.11)/125;for(let k=0;k<3;k++)data[i+k]=Math.min(255,target[k]*light);
     }cx.putImageData(pixels,0,0);
    }
    tasks.push(new Promise(done=>canvas.toBlob(blob=>{if(blob)art.full[kind+color]=URL.createObjectURL(blob);else art.error='Artwork could not be prepared';done()},'image/png')));
   }
  }await Promise.all(tasks);finish(art.error);}catch{finish('Artwork could not be prepared')}
 };image.onerror=()=>finish('Artwork could not load');image.src=RACER_ATLAS_URI;
});
const torsos={
 horse:'M33 45 Q42 33 62 38 Q85 37 102 42 L118 24 Q130 11 144 21 L157 22 L166 36 L178 42 L174 50 L165 53 L149 47 L137 47 Q137 61 130 70 Q125 77 115 76 Q93 82 75 77 Q66 74 54 75 Q41 67 35 57Z',
 zebra:'M34 48 Q43 35 66 42 Q91 41 109 46 L125 27 L138 18 L150 19 L163 28 L175 46 L174 53 L165 54 L147 46 Q141 52 139 65 L132 77 L113 74 Q90 82 70 76 Q58 74 48 76 Q35 70 32 57Z',
 tiger:'M30 53 Q34 42 54 40 L111 37 Q122 23 137 23 Q151 20 164 33 L174 43 L174 52 L164 57 L151 54 L142 62 L132 73 L116 70 Q92 76 69 70 L49 73 Q35 68 30 60Z'
};
texturedBody=function(kind,coat,gear,silk,id){
 const crop=RACER_CROPS[kind],color=kind==='horse'&&COATS.includes(coat)?coat:'#B5651D';
 const full=art.full[kind+color];
 if(kind==='moto')return '<image href="'+(full||'horse-pieces/moto-B5651D-body-torso.png')+'" x="0" y="12" width="180" height="98"/>';
 // Store portraits use the complete source silhouette, with no anatomy masks.
 if(drawingStill){const wrap=['horse','zebra'].includes(kind)&&gear.wraps&&gear.wraps!=='none'?'<svg x="0" y="12" width="180" height="98" viewBox="0 0 '+crop.w+' '+crop.h+'"><defs><mask id="'+id+'stillWrap" maskUnits="userSpaceOnUse" x="0" y="0" width="'+crop.w+'" height="'+crop.h+'" style="mask-type:alpha"><image href="'+full+'" width="'+crop.w+'" height="'+crop.h+'"/></mask></defs><path d="M0 '+crop.h*.79+' H'+crop.w+'" stroke="'+(gear.wraps==='white'?'#eee8d9':silk)+'" stroke-width="21" mask="url(#'+id+'stillWrap)"/></svg>':'';return '<image class="complete-racer-body" href="'+full+'" x="0" y="12" width="180" height="98"/>'+wrap}
 const piece=part=>'<image href="horse-pieces/'+kind+'-'+color.slice(1)+'-'+part+'.png" x="0" y="12" width="180" height="98"/>';
const limb=([cls,x,y,path],index)=>{
  // Curved, overlapping roots follow the original shoulder and hip anatomy.
  // The old straight polygons sliced through the muscles into pointed wedges.
  if(kind==='horse')path={
   'rear-far':'M210 250 Q260 250 303 302 Q327 347 378 464 L310 491 L232 405 Q218 335 210 250Z',
   'rear-near':'M150 235 Q207 240 276 296 L222 391 L81 486 L12 487 L75 380 Q133 315 150 235Z',
   'front-far':'M570 225 Q627 221 682 280 L814 366 L832 446 L777 461 L714 355 Q627 323 593 304Z',
   'front-near':'M490 230 Q552 210 598 260 Q615 290 650 326 L699 378 L745 425 L812 470 L819 510 L752 507 L702 468 L630 419 Q570 380 522 337Z'
  }[cls];
  if(kind==='tiger'&&cls==='rear-near')path='M140 205 L265 235 L220 285 L175 312 L80 399 L0 404 L0 330 L80 265Z';
  if(kind==='zebra'&&cls==='rear-far')path='M185 280 L275 290 L310 378 L340 455 L280 465 L235 425 L200 380Z';
  if(kind==='zebra'&&cls==='front-near')path='M420 285 L505 300 L555 375 Q572 407 535 425 L455 443 L402 415 L392 383 L465 377 L450 348Z';
  const rootX=(kind==='horse'?(index<2?245:590):x)/crop.w*180,rootY=12+(kind==='horse'?(index<2?275:250):y-38)/crop.h*98;
  const wraps=['horse','zebra'].includes(kind)&&gear.wraps&&gear.wraps!=='none'?'<defs><mask id="'+id+'wrapAlpha'+index+'" maskUnits="userSpaceOnUse" x="0" y="0" width="'+crop.w+'" height="'+crop.h+'" style="mask-type:alpha"><image href="'+full+'" width="'+crop.w+'" height="'+crop.h+'"/></mask></defs><path d="M0 '+crop.h*.79+' H'+crop.w+'" stroke="'+(gear.wraps==='white'?'#eee8d9':silk)+'" stroke-width="21" mask="url(#'+id+'wrapAlpha'+index+')"/>':'';
  const footFilter=kind==='horse'&&cls==='front-far'?'M0 0 H835 V477 L700 410 H0Z':'';
  const footDef=footFilter?'<clipPath id="'+id+'foot'+index+'"><path clip-rule="evenodd" d="'+footFilter+'"/></clipPath>':'';
  const footOpen=footFilter?'<g clip-path="url(#'+id+'foot'+index+')">':'';
  return '<g class="textured-leg '+cls+'" style="transform-origin:'+rootX+'px '+rootY+'px"><svg x="0" y="12" width="180" height="98" viewBox="0 0 '+crop.w+' '+crop.h+'"><defs><clipPath id="'+id+'limb'+index+'"><path d="'+path+'"/></clipPath>'+footDef+'</defs><g clip-path="url(#'+id+'limb'+index+')">'+footOpen+'<image href="'+full+'" width="'+crop.w+'" height="'+crop.h+'"/>'+wraps+(footFilter?'</g>':'')+'</g></svg></g>';
 };
 const limbs=crop.legs.map(limb),tail='<g class="textured-tail" style="transform-origin:48px 54px">'+piece('textured-tail')+'</g>';
 // Preserve the full head, mane, neck and torso. Upper limbs overlap this
 // complete body band so small stride rotations cannot expose cut-out joints.
 const torso='<defs><clipPath id="'+id+'torso"><rect x="0" y="12" width="180" height="66"/></clipPath></defs><g clip-path="url(#'+id+'torso)"><image href="'+(full||'horse-pieces/'+kind+'-'+color.slice(1)+'-body-torso.png')+'" x="0" y="12" width="180" height="98"/></g>';
 if(kind!=='horse'){const support='<image href="'+full+'" x="0" y="12" width="180" height="98"/><defs><mask id="'+id+'completeSilhouette" maskUnits="userSpaceOnUse" x="0" y="12" width="180" height="98" style="mask-type:alpha"><image href="'+full+'" x="0" y="12" width="180" height="98"/></mask></defs>';return support+'<g mask="url(#'+id+'completeSilhouette)">'+tail+limbs.join('')+torso+'</g>'}
 // Let each horse leg swing beyond the original pose; overlapping roots remain behind the torso.
 return tail+limbs.filter((_,i)=>i%2===0).join('')+limbs.filter((_,i)=>i%2===1).join('')+torso;
};
racerHelmet=function(id,silk,kind){
 const color=kind==='gold'?'#F2B705':silk;
 return `<g class="gear-helmet"><defs><linearGradient id="${id}helmet" x2=".4" y2="1"><stop stop-color="${shade(color,.3)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${shade(color,-.25)}"/></linearGradient></defs><path d="M122 9 C121 2 126 -1 131 -1 C137 -1 141 4 141 10 L129 12 L122 10Z" fill="url(#${id}helmet)" stroke="#29262a" stroke-width=".65"/><path d="M124 5 Q128 0 134 2" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/>${kind==='stripe'?'<path d="M131 0 Q134 5 135 10" stroke="#fff7e8" stroke-width="2.5" fill="none"/>':''}${kind==='stars'?'<path d="M126 4 l.6 1.3 1.5 .1 -1.1 1 .4 1.4 -1.4 -.7 -1.3 .7 .3 -1.4 -1 -1 1.5 -.1Z M135 5 l.6 1.3 1.5 .1 -1.1 1 .4 1.4 -1.4 -.7 -1.3 .7 .3 -1.4 -1 -1 1.5 -.1Z" fill="#fff"/>':''}<path d="M136 9 L145 10 L143 12 L137 12Z" fill="${shade(color,-.25)}"/><path d="M125 11 Q125 18 132 22 L137 18" stroke="#322923" stroke-width=".8" fill="none"/><path d="M136 12 L141 11" stroke="#553c2c" stroke-width=".6"/></g>`;
};
const originalEquipment=equipment;
equipment=function(id,kind,silk,num,gear,marks){
 const base=originalEquipment(id,kind,silk,num,gear,marks).replaceAll('M65 38 L98 39 L97 61 Q80 65 64 58Z','M70 39 Q85 35 101 40 L99 60 Q86 64 70 59Z').replaceAll('M80 35 L105 36 L102 58 Q88 61 78 56Z','M80 36 Q92 33 107 38 L104 57 Q90 62 79 56Z');
 if(kind==='moto')return base+'<path d="M91 47 Q103 44 112 47 L109 51 L90 51Z" fill="#222831" stroke="#797b80" stroke-width=".6"/>';
 const tiger=kind==='tiger',x=tiger?87:83,y=tiger?36:38;
 const seat=`<g class="leather-saddle"><defs><linearGradient id="${id}leather" x2="0" y2="1"><stop stop-color="#a27448"/><stop offset=".4" stop-color="#623b24"/><stop offset="1" stop-color="#2e2019"/></linearGradient></defs><path d="M${x-6} ${y-4} Q${x+3} ${y} ${x+16} ${y-2} L${x+20} ${y+2} Q${x+9} ${y+6} ${x-7} ${y+2}Z" fill="url(#${id}leather)" stroke="#38251b" stroke-width=".7"/><path d="M${x+2} ${y+3} Q${x+14} ${y+1} ${x+13} ${y+12} L${x+8} ${y+21} Q${x+1} ${y+22} ${x-2} ${y+15}Z" fill="url(#${id}leather)" stroke="#39251a" stroke-width=".7"/><path d="M${x+6} ${y+6} L${x+9} ${y+26}" stroke="#493124" stroke-width="1.4"/><path d="M${x+6} ${y+22} L${x+12} ${y+22} L${x+14} ${y+27} L${x+6} ${y+27}Z" fill="none" stroke="#d7c6a5" stroke-width="1"/><path d="M${x+14} ${y+5} Q${x+18} ${y+23} ${x+11} ${y+34}" fill="none" stroke="#63472f" stroke-width="2"/><path d="M${x-4} ${y} Q${x+5} ${y+4} ${x+17} ${y+1}" stroke="#d1ab78" stroke-width=".65" fill="none"/></g>`;
 const reins=kind==='horse'?'<g class="bridle"><path d="M146 30 Q156 34 166 44 M144 32 Q153 38 163 45" stroke="#493024" stroke-width=".7" fill="none"/><path d="M159 37 L166 46 L174 45 M160 36 L157 42" fill="none" stroke="#694936" stroke-width="1"/></g>':'';
 return base+seat+reins;
};
motoSvg=function({silk,num,gear={},marks={}}){const id='r'+(++MASCOT_ID);
 const wheel=(x,y)=>`<defs><clipPath id="${id}wheel${x}"><circle cx="${x}" cy="${y}" r="18.5"/></clipPath></defs><g class="spin" style="transform-origin:${x}px ${y}px;transform-box:view-box"><g clip-path="url(#${id}wheel${x})"><image href="${art.full['moto#B5651D']}" x="0" y="12" width="180" height="98"/></g></g>`;
 return texturedBody('moto','#333333',gear,silk,id)+wheel(39,80)+wheel(140,81)+equipment(id,'moto',silk,num,gear,marks)+`<g transform="translate(-7 10) scale(.98)">${raceJockey(id,silk,gear)}</g>`;
};
sceneSvg=function(){return '<div class="festival-scene" aria-hidden="true"><div class="festival-panorama"></div><div class="festival-ground"></div><div class="festival-rail"></div></div>'};
gearCloseup=function(kind,st,gear,slot,g){
 const crops={blanket:kind==='moto'?'86 42 54 35':kind==='tiger'?'73 28 46 49':'65 30 49 47',helmet:kind==='tiger'?'138 20 27 32':kind==='moto'?'110 3 35 32':'118 -4 32 33',mane:'99 24 65 48',tail:'-5 36 62 55',wraps:'28 66 139 48'};
 const image=mascot(kind,{silk:st.silk,coat:st.coat,gear,size:220,still:true}).replace('viewBox="-10 -12 200 130"','viewBox="'+(crops[slot]||'-10 -12 200 130')+'"').replace('aria-label="'+(kind==='moto'?'motorbike':kind)+' racer"','aria-label="'+esc(g.name)+' close-up on your racer"');
 return '<div class="gear-closeup">'+image+'<span>DETAIL VIEW</span></div>';
};
})();
