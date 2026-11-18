/* Focus Garden – drawings v3 (soft, rounded, outlined style).
   Plants are drawn in plant units with ground contact at (100,198). */

const clamp = (x,a=0,b=1) => Math.min(b,Math.max(a,x));
const seg = (p,a,b) => clamp((p-a)/(b-a));
const ease = t => 1 - Math.pow(1-t,3);
function rng(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function mix(c1,c2,t){ const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)); const a=h(c1),b=h(c2);
  return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*clamp(t)).toString(16).padStart(2,'0')).join(''); }
const dk = (c,t=.3) => mix(c,'#1f2a1c',t);
const lt = (c,t=.35) => mix(c,'#ffffff',t);
const S = (c,w=1.3) => `fill="${c}" stroke="${dk(c,.42)}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

const SEEDS = {
  sunflower:  {name:'Sunflower',     desc:'Tall and cheerful. Opens up at the very end.', cm:200},
  tulip:      {name:'Tulip',         desc:'Classic and quick to show colour.', cm:45},
  lavender:   {name:'Lavender',      desc:'Calm purple spikes, one bud at a time.', cm:60},
  chamomile:  {name:'Chamomile',     desc:'Little white daisies with sunny centres.', cm:40},
  aster:      {name:'Asters',        desc:'A bushy cloud of lilac stars.', cm:80},
  forgetmenot:{name:'Forget-me-nots',desc:'Tiny sky-blue flowers with pink buds.', cm:25},
  nepeta:     {name:'Catmint',       desc:'Nepeta: a soft grey mound full of blue spikes.', cm:50},
  geranium:   {name:'Pink geranium', desc:'Round leaves and bright pink flower balls.', cm:40},
  cactus:     {name:'Cactus',        desc:'Slow and steady, with a pink flower on top.', cm:70},
  aloe:       {name:'Aloe vera',     desc:'A chunky rosette that sends up an orange flower.', cm:80},
  mushroom:   {name:'Oyster mushrooms', desc:'Oesterzwammen: soft shelves on a mossy log.', cm:30, noPot:true},
  tomato:     {name:'Cherry tomato', desc:'Up the cane, from yellow flowers to red fruit.', cm:150},
  wisteria:   {name:'Wisteria',      desc:'Climbs the pergola and drips with purple.', cm:250},
  apple:      {name:'Apple tree',    desc:'Blossoms first, then shiny red apples.', cm:280}
};

/* ---------- style helpers ---------- */
function stem(d,w,c='#5fa64f'){
  return `<path d="${d}" fill="none" stroke="${dk(c,.45)}" stroke-width="${w+2.4}" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function fatLeaf(x,y,L,ang,k,c='#6cbf5a'){
  if(k<=.01) return '';
  return `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${k})">
    <path d="M0 0 C${L*.2} ${-L*.5} ${L*.75} ${-L*.45} ${L} 0 C${L*.75} ${L*.38} ${L*.2} ${L*.32} 0 0Z" ${S(c)}/>
    <path d="M${L*.14} ${-L*.1} C${L*.32} ${-L*.33} ${L*.66} ${-L*.32} ${L*.84} ${-L*.06}" fill="none" stroke="${lt(c,.45)}" stroke-width="${Math.max(1,L*.07)}" stroke-linecap="round" opacity=".75"/>
    <path d="M${L*.1} 0 L${L*.78} 0" stroke="${dk(c,.25)}" stroke-width=".9" opacity=".55"/></g>`;
}
// soft rounded clump: outline, shade, body, highlight
function blobs(list,c){
  return list.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r+1.5}" fill="${dk(c,.45)}"/>`).join('')
       + list.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${dk(c,.12)}"/>`).join('')
       + list.map(([x,y,r])=>`<circle cx="${x-r*.05}" cy="${y-r*.12}" r="${r*.9}" fill="${c}"/>`).join('')
       + list.map(([x,y,r])=>`<circle cx="${x-r*.28}" cy="${y-r*.34}" r="${r*.42}" fill="${lt(c,.22)}"/>`).join('');
}
function flower5(x,y,r,c,center='#ffe27a',k=1){
  if(k<=.01) return '';
  let s=''; for(let q=0;q<5;q++){ const a=q*1.2566-1.57; s+=`<circle cx="${Math.cos(a)*r*.6}" cy="${Math.sin(a)*r*.6}" r="${r*.5}" ${S(c,.8)}/>`; }
  return `<g transform="translate(${x} ${y}) scale(${k})">${s}<circle r="${r*.28}" fill="${center}" stroke="${dk(center,.3)}" stroke-width=".6"/></g>`;
}
function daisy(x,y,R,pc,cc,k=1,n=12,thin=.18){
  if(k<=.01) return '';
  let s=''; for(let i=0;i<n;i++) s+=`<ellipse cx="0" cy="${-R*.52}" rx="${R*thin}" ry="${R*.46}" transform="rotate(${i*360/n})" ${S(pc,.7)}/>`;
  return `<g transform="translate(${x} ${y}) scale(${k})">${s}<circle r="${R*.36}" ${S(cc,.8)}/><circle cx="${-R*.1}" cy="${-R*.12}" r="${R*.14}" fill="${lt(cc,.45)}"/></g>`;
}
function seedling(p){
  const k = ease(seg(p,0,0.06));
  let s = `<ellipse cx="100" cy="196" rx="4.5" ry="3" ${S('#9a6a40',.8)}/>`;
  if(k>0) s += stem(`M100 197 L100 ${197-8*k}`,1.6) + fatLeaf(100,197-8*k,9,-30,k) + fatLeaf(100,197-8*k,9,-150,k);
  return s;
}
const plank = (x,y,w,h,c='#c49565') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w,h)*.35}" ${S(c,1.2)}/><rect x="${x+w*.18}" y="${y+1.5}" width="${w*.22}" height="${h-3}" rx="1" fill="${lt(c,.25)}"/>`;

/* ---------- plants ---------- */
const DRAW = {
  sunflower(p){
    const h = 4 + 150*ease(seg(p,.03,.75)), ty=198-h;
    let s = stem(`M100 198 Q104 ${198-h*.5} 100 ${ty}`, 2.8+2*seg(p,0,.6));
    [[.22,1,.12],[.38,-1,.25],[.53,1,.38],[.66,-1,.5]].forEach(([t,side,th])=> s += fatLeaf(100,198-h*t,28,side>0?-28:-152,ease(seg(p,th,th+.14))));
    const b = ease(seg(p,.72,1));
    if(p>.6){
      if(b<.3) s += blobs([[100,ty,5+b*22]],'#7cbb58');
      else { const R=12+22*b; let pe='';
        for(let i=0;i<14;i++) pe += `<ellipse cx="0" cy="${-R*.64}" rx="${R*.2}" ry="${R*.4}" transform="rotate(${i*25.7+12})" ${S('#f2b632',.9)}/>`;
        for(let i=0;i<14;i++) pe += `<ellipse cx="0" cy="${-R*.58}" rx="${R*.19}" ry="${R*.36}" transform="rotate(${i*25.7})" ${S('#ffd84a',.9)}/>`;
        let dots=''; for(let i=0;i<12;i++){ const a=i*.52, d=R*(i%2?.2:.3); dots+=`<circle cx="${Math.cos(a)*d}" cy="${Math.sin(a)*d}" r="${R*.035+.4}" fill="#a8703d"/>`; }
        s += `<g transform="translate(100 ${ty})">${pe}<circle r="${R*.42}" ${S('#7a4a26',1.1)}/>${dots}<circle cx="${-R*.14}" cy="${-R*.16}" r="${R*.12}" fill="#9c6436"/></g>`; }
    }
    return s;
  },
  tulip(p){
    const h = 4 + 100*ease(seg(p,.03,.75)), ty = 198-h;
    let s='';
    const l1=ease(seg(p,.08,.4)), l2=ease(seg(p,.2,.55)), c='#6cbf5a';
    if(l1>0) s += `<path d="M100 198 Q${78-10*l1} ${198-40*l1} ${82-6*l1} ${198-72*l1} Q${97} ${198-38*l1} 100 198Z" ${S(c)}/><path d="M97 192 Q${86-6*l1} ${198-40*l1} ${84-5*l1} ${198-64*l1}" stroke="${lt(c,.4)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    s += stem(`M100 198 Q104 ${198-h*.5} 100 ${ty}`,2.8);
    if(l2>0) s += `<path d="M100 198 Q${122+10*l2} ${198-35*l2} ${119+4*l2} ${198-62*l2} Q${104} ${198-30*l2} 100 198Z" ${S('#5fb04f')}/>`;
    const b = ease(seg(p,.65,1));
    if(p>.55){
      if(b<.25) s += `<ellipse cx="100" cy="${ty-6}" rx="${4+b*12}" ry="${8+b*16}" ${S('#86c262')}/>`;
      else s += `<g transform="translate(100 ${ty+2}) scale(${.45+.55*b})">
        <path d="M-15 0 Q-21 -26 -7 -37 Q-2 -18 0 -4Z" ${S('#d93a4b')}/><path d="M15 0 Q21 -26 7 -37 Q2 -18 0 -4Z" ${S('#d93a4b')}/>
        <path d="M-12 2 Q-15 -24 0 -39 Q15 -24 12 2 Q0 8 -12 2Z" ${S('#f2546a')}/>
        <path d="M-5 -6 Q-4 -22 -1 -31" stroke="#ff9eab" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
    }
    return s;
  },
  lavender(p){
    const g = ease(seg(p,.03,.75)), b = seg(p,.6,1); let s='';
    [-58,-122,-78,-102].forEach((a,i)=> s += fatLeaf(100,197,18,a,ease(seg(p,.05+i*.06,.25+i*.06)),'#9cc093'));
    [[-16,.8],[-8,.95],[0,1],[8,.9],[16,.78]].forEach(([ang,f],si)=>{
      const h = 6+118*g*f;
      s += `<g transform="rotate(${ang} 100 198)">${stem(`M100 198 L100 ${198-h}`,1.4,'#86a97b')}`;
      for(let j=0;j<8;j++){ const k=clamp(b*9-j-si*.3); if(k<=0) continue; const y=198-h+j*5;
        s += `<circle cx="${97.6}" cy="${y}" r="${2.6*k}" ${S('#9b7fd6',.7)}/><circle cx="${102.4}" cy="${y+1.2}" r="${2.5*k}" ${S('#8a6cc9',.7)}/><circle cx="${97}" cy="${y-.8}" r="${.9*k}" fill="#cbb8f2"/>`; }
      s += `</g>`;
    });
    return s;
  },
  chamomile(p){
    const r=rng(21), g=ease(seg(p,.03,.7)), b=ease(seg(p,.6,1)); let s='';
    const st=[]; for(let i=0;i<9;i++) st.push([(i-4)*7+(r()-.5)*4, (60+r()*36)]);
    st.forEach(([dx,H],i)=>{ const h=H*g, tx=100+dx*1.6*g, ty=198-h;
      s += stem(`M${100+dx*.25} 198 Q${100+dx*.6} ${198-h*.5} ${tx} ${ty}`,1.1,'#7cb25f');
      for(let t=.25;t<.8;t+=.18){ const x=100+dx*.25+(tx-100-dx*.25)*t*t, y=198-h*t; const sd=(i+Math.round(t*10))%2?1:-1;
        s += `<path d="M${x} ${y} l${sd*5} -3 m${-sd*2.5} 1.5 l${sd*1} -3 m${-sd*1} 2 l${sd*3} 1" stroke="#7cb25f" stroke-width="1.1" fill="none" stroke-linecap="round"/>`; }
      if(p>.55) s += b<.25 ? `<circle cx="${tx}" cy="${ty}" r="${2+b*6}" ${S('#a6cf7a',.8)}/>` : daisy(tx,ty,9,'#ffffff','#ffcf3a',.4+.6*b,13,.17);
    });
    for(let i=0;i<5;i++) s += fatLeaf(100,197,12+r()*5,-30-i*30,ease(seg(p,.05,.3)),'#7cb25f');
    return s;
  },
  aster(p){
    const r=rng(33), g=ease(seg(p,.03,.65)), b=ease(seg(p,.62,1)); let s='';
    const st=[]; for(let i=0;i<14;i++){ const a=-.35-r()*2.45, L=70+r()*45; st.push([a,L]); }
    st.forEach(([a,L])=> s += stem(`M100 196 Q${100+Math.cos(a)*L*.25*g} ${198-L*.5*g} ${100+Math.cos(a)*L*.55*g} ${198+Math.sin(a)*L*g}`,1.1,'#5f9c4b'));
    for(let i=0;i<26;i++){ const a=-Math.PI*r(), d=Math.sqrt(r())*40*g; s += fatLeaf(100+Math.cos(a)*d*1.1, 194+Math.sin(a)*d*1.2, 11+r()*4, r()*360, g, i%2?'#5fae4e':'#6dbb5a'); }
    st.forEach(([a,L],i)=>{ const x=100+Math.cos(a)*L*.55*g, y=198+Math.sin(a)*L*g;
      const cols=['#a98be6','#b9a0f2','#9274db']; if(p<.55) return;
      s += b<.25 ? `<circle cx="${x}" cy="${y}" r="${2+b*6}" ${S('#7fb35f',.8)}/>` : daisy(x,y,9,cols[i%3],'#ffd23f',.45+.55*b,18,.13);
      if(i%2 && b>.25) s += daisy(x+(i%4?-7:7),y+8,7,cols[(i+1)%3],'#ffd23f',.4+.5*b,16,.13); });
    return s;
  },
  forgetmenot(p){
    const r=rng(44), g=ease(seg(p,.03,.6)), b=ease(seg(p,.55,1)); let s='';
    for(let i=0;i<9;i++){ const a=-15-i*18.75; s += fatLeaf(100,197,14+r()*6,a,ease(seg(p,.05+i*.02,.4+i*.02)),'#6cb85a'); }
    const sprays=[]; for(let i=0;i<8;i++){ const a=-.4-r()*2.35, L=(28+r()*22)*g; sprays.push([100+Math.cos(a)*L*.9, 196+Math.sin(a)*L]); }
    sprays.forEach(([x,y])=> s += stem(`M100 194 Q${(100+x)/2} ${y+8} ${x} ${y}`,.9,'#6aa857'));
    sprays.forEach(([x,y],i)=>{ if(p<.45) return;
      for(let j=0;j<7;j++){ const a=j*.9+i, d=j?5.2:0, fx=x+Math.cos(a)*d, fy=y+Math.sin(a)*d*.8, k=clamp(b*8-j*.6);
        s += j>4 ? `<circle cx="${fx}" cy="${fy}" r="${1.6*k}" ${S('#f2a2c4',.6)}/>` : flower5(fx,fy,4.6,'#7cc4f2','#fff1a0',k); } });
    return s;
  },
  nepeta(p){
    const r=rng(11), g=ease(seg(p,.03,.7)), b=ease(seg(p,.6,1)); let s='';
    const spikes=[]; for(let i=0;i<22;i++){ const a=-.35-r()*2.45; spikes.push([a,22+r()*16,r()]); }
    const tip=(a,L)=>[100+Math.cos(a)*(30+L)*g*1.15, 198+Math.sin(a)*(26+L)*g];
    spikes.forEach(([a,L])=>{ const [tx,ty]=tip(a,L); s += stem(`M${100+Math.cos(a)*14*g} ${196+Math.sin(a)*10*g} L${tx} ${ty}`,1,'#8aa684'); });
    const mound=[]; for(let i=0;i<14;i++){ const a=-Math.PI*r(), d=Math.sqrt(r())*28*g; mound.push([100+Math.cos(a)*d*1.3, 194+Math.sin(a)*d*.9, (6+r()*4)*g+1]); }
    if(g>0) s += blobs(mound,'#a3c39c');
    if(b>0) spikes.forEach(([a,L,q])=>{ const [tx,ty]=tip(a,L);
      for(let j=0;j<6;j++){ const k=clamp(b*7-j-q); if(k<=0) continue; const t=j/6*.42, x=tx+(100-tx)*t, y=ty+(198-ty)*t;
        s += `<circle cx="${x+(j%2?1.6:-1.6)}" cy="${y}" r="${2.3*k}" ${S(j%2?'#8b8fe6':'#a3a3f0',.6)}/>`; } });
    return s;
  },
  geranium(p){
    const r=rng(5), g=ease(seg(p,.03,.65)), b=ease(seg(p,.6,1)); let s='';
    const umb=[]; for(let k=0;k<5;k++) umb.push([100+(k-2)*14+(r()-.5)*6, 198-44*g-r()*14*g]);
    umb.forEach(([x,y])=> s += stem(`M${100+(x-100)*.4} 192 Q${x} ${y+15} ${x} ${y}`,1.2,'#5c9a46'));
    const lv=[]; for(let i=0;i<15;i++){ const a=-.2-r()*2.75, rr=(6+r()*22)*g; lv.push([100+Math.cos(a)*rr*1.3, 196+Math.sin(a)*rr*.8, (6.5+r()*3)*g+1]); }
    lv.sort((a,b)=>a[1]-b[1]).forEach(([x,y,R],i)=> s += `<circle cx="${x}" cy="${y}" r="${R}" ${S(i%2?'#62ad54':'#70b95f')}/><circle cx="${x}" cy="${y}" r="${R*.55}" fill="none" stroke="#4b8a3e" stroke-width="${R*.22}" opacity=".35"/><circle cx="${x-R*.35}" cy="${y-R*.4}" r="${R*.22}" fill="#9fd88b" opacity=".8"/>`);
    if(p>.5) umb.forEach(([x,y])=>{
      if(b<.2){ s += `<circle cx="${x}" cy="${y}" r="${3+b*10}" ${S('#8fbf6f',.8)}/>`; return; }
      for(let j=0;j<8;j++){ const a=j/8*Math.PI*2, d=j?7.5*b:0; s += flower5(x+Math.cos(a)*d, y+Math.sin(a)*d*.8, 6, j%2?'#f66fa3':'#ff8fb8','#fff0f5',b); }
      s += flower5(x,y-1,6,'#ff9cc1','#fff0f5',b); });
    return s;
  },
  cactus(p){
    const g=ease(seg(p,.03,.85)), H=18+92*g, w=22+20*g, top=198-H, c='#6cbf6a'; let s='';
    const arm=(pts,wd,k)=>{ const d=`M${pts.map(q=>q.join(' ')).join(' L')}`;
      return `<path d="${d}" stroke="${dk(c,.42)}" stroke-width="${wd+2.6}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="${d}" stroke="${c}" stroke-width="${wd}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="${d}" stroke="${lt(c,.3)}" stroke-width="${wd*.25}" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-${wd*.15} 0)"/>`; };
    const a1=ease(seg(p,.38,.6)), a2=ease(seg(p,.52,.75));
    if(a1>0){ const y=198-H*.42; s += arm([[100,y],[100-w/2-11,y],[100-w/2-11,y-28*a1]],14,a1); }
    if(a2>0){ const y=198-H*.6; s += arm([[100,y],[100+w/2+10,y],[100+w/2+10,y-22*a2]],12,a2); }
    s += `<rect x="${100-w/2}" y="${top}" width="${w}" height="${H+1}" rx="${w/2}" ${S(c,1.4)}/>`;
    s += `<rect x="${100-w*.3}" y="${top+4}" width="${w*.16}" height="${H-8}" rx="${w*.08}" fill="${lt(c,.3)}"/><rect x="${100+w*.08}" y="${top+5}" width="${w*.1}" height="${H-10}" rx="${w*.05}" fill="${dk(c,.1)}"/>`;
    for(let i=1;i<6;i++){ const y=top+i*H/6; [[-.36,0],[.36,3],[0,1.5]].forEach(([fx,dy])=> s += `<path d="M${100+w*fx-1.4} ${y+dy-1.4} l2.8 2.8 m0 -2.8 l-2.8 2.8" stroke="#f6f8e6" stroke-width=".9"/>`); }
    s += daisy(100,top+2,11,'#ff8fb5','#ffd166',ease(seg(p,.85,1)),9,.24);
    return s;
  },
  aloe(p){
    const g=ease(seg(p,.03,.75)), b=ease(seg(p,.72,1)); let s='';
    if(b>0){ const top=198-108*b;
      s += stem(`M103 192 Q108 ${198-60*b} 106 ${top}`,2,'#7aa57c');
      for(let j=0;j<10;j++){ const t=j/10, y=top+t*38*b, x=106+(j%2?3:-3), k=clamp(b*1.4-t*.4);
        s += `<ellipse cx="${x}" cy="${y}" rx="${2.2*k}" ry="${5.2*k}" transform="rotate(${j%2?24:-24} ${x} ${y})" ${S(j<3?'#ffd068':'#f59a3c',.7)}/>`; } }
    [-76,76,-56,56,-36,36,-17,17,0].forEach((ang,i)=>{ const L=(26+32*(1-Math.abs(ang)/90))*g+5, w=4.5+4.5*g, c=i%2?'#86c4a2':'#78b894';
      let fr=''; for(let t=.2;t<.75;t+=.14) fr += `<circle cx="${(Math.sin(t*20)*.5)*w*.6}" cy="${-L*t}" r="1" fill="#eef7ee"/>`;
      let teeth=''; for(let t=.15;t<.8;t+=.14) teeth += `<path d="M${-w*(1-t)} ${-L*t} l-1.8 -1.2 M${w*(1-t)} ${-L*t} l1.8 -1.2" stroke="${dk(c,.3)}" stroke-width="1" stroke-linecap="round"/>`;
      s += `<g transform="translate(100 198) rotate(${ang*.95})">${teeth}<path d="M${-w} 0 Q${-w*.9} ${-L*.55} 0 ${-L} Q${w*.9} ${-L*.55} ${w} 0Z" ${S(c,1.2)}/>
        <path d="M${-w*.35} -3 Q${-w*.3} ${-L*.5} 0 ${-L*.85}" stroke="${lt(c,.4)}" stroke-width="${w*.3}" fill="none" stroke-linecap="round"/>${fr}</g>`; });
    return s;
  },
  mushroom(p){
    // mossy log lying on the ground, oyster mushrooms grow out of it
    const c='#9b6d45'; let s='';
    s += `<rect x="50" y="176" width="100" height="23" rx="11" ${S(c,1.4)}/>`;
    for(let x=60;x<140;x+=11) s += `<path d="M${x} 180 q2 8 0 15" stroke="${dk(c,.25)}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    s += `<rect x="58" y="179" width="70" height="4" rx="2" fill="${lt(c,.18)}"/>`;
    s += `<ellipse cx="144" cy="187.5" rx="7.5" ry="11.5" ${S('#e3bf88',1.3)}/><ellipse cx="144" cy="187.5" rx="4.5" ry="7.5" fill="none" stroke="#c39a62" stroke-width="1.1"/><ellipse cx="144" cy="187.5" rx="1.8" ry="3" fill="none" stroke="#c39a62" stroke-width="1"/>`;
    s += blobs([[66,177,4.5],[74,176,5.5],[83,177,3.5],[118,177,4],[125,178,3]],'#79c25a');
    const f = ease(seg(p,.04,1));
    const cl=[[78,182,-1],[96,180,1],[112,183,-1],[130,181,1],[66,186,1]];
    cl.forEach(([x,y,sd],ci)=>{ [[0,0,1],[sd*5,-6,.8],[-sd*3,5,.7]].forEach(([dx,dy,sz],j)=>{
      const k=clamp(f*1.35-ci*.06-j*.12)*sz; if(k<=.02) return;
      s += `<g transform="translate(${x+dx} ${y+dy}) scale(${sd*k} ${k})">
        <path d="M0 2 C-12 0 -15 -11 -5 -15 C5 -18 16 -12 14 -4 C12 2 5 3 0 2Z" ${S('#e7dfcf',1.1)}/>
        <path d="M2 1 L-6 -9 M3 0 L0 -12 M4 0 L7 -11 M5 1 L11 -6" stroke="#c4b79f" stroke-width=".8" stroke-linecap="round"/>
        <path d="M-7 -12 C-2 -15 6 -15 10 -11" stroke="#fffaf0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/></g>`; }); });
    return s;
  },
  tomato(p){
    const g=ease(seg(p,.03,.7)), fl=seg(p,.42,.7), f=ease(seg(p,.62,1)), H=130*g+4; let s='';
    s += `<rect x="109" y="56" width="4" height="144" rx="2" ${S('#e2c97f',1)}/>`;
    for(let y=70;y<196;y+=22) s += `<path d="M109 ${y} l4 0" stroke="#b99a52" stroke-width="1"/>`;
    s += stem(`M100 198 Q106 ${198-H*.5} 104 ${198-H}`,2.4,'#5d9e47');
    for(let y=170;y>198-H+10;y-=32) s += `<path d="M103 ${y} L112 ${y-2}" stroke="#f3ecd6" stroke-width="2.2" stroke-linecap="round"/>`;
    for(let i=0,t=.12;t<.95;t+=.15,i++){ const k=ease(clamp((g-t)/.2)); if(k<=0) continue; const y=198-H*t, sd=i%2?1:-1, x=103;
      s += stem(`M${x} ${y} q${sd*12*k} -6 ${sd*24*k} -2`,1,'#5d9e47');
      [[.4,-28],[.4,28],[.75,-28],[.75,28],[1,0]].forEach(([q,o])=> s += fatLeaf(x+sd*24*k*q, y-4*k*q, 9, (sd>0?0:180)+o*sd-12*sd, k*.9,'#5fae4c')); }
    [[.45,1],[.65,-1],[.82,1]].forEach(([t,sd])=>{ if(g<t) return; const x=104+sd*6, y=198-H*t+4;
      s += stem(`M${x} ${y} q${sd*8} 4 ${sd*14} 10`,.8,'#5d9e47');
      for(let j=0;j<6;j++){ const fx=x+sd*(5+j*2.6), fy=y+6+j*3+(j%2?2:-1);
        if(f>0){ const col=mix('#93c45a','#e8473f',clamp(f*1.3-j*.06));
          s += `<circle cx="${fx}" cy="${fy}" r="${1.5+3.2*f}" ${S(col,.9)}/><circle cx="${fx-1.2}" cy="${fy-1.4}" r="${1*f}" fill="#ffffffb0"/><path d="M${fx-1.5} ${fy-3.6*f} l1.5 1 l1.5 -1" stroke="#4f8f3c" stroke-width="1" fill="none"/>`; }
        else if(fl>0) s += flower5(fx,fy,4,'#ffd84a','#f2a72e',fl); } });
    return s;
  },
  wisteria(p){
    const r=rng(9), g1=ease(seg(p,.03,.45)), g2=ease(seg(p,.35,.7)), f=ease(seg(p,.4,.8)), b=ease(seg(p,.7,1));
    let s = plank(46,66,8,134) + plank(142,66,8,134);
    const tt = Math.max(198-130*g1,70);
    s += stem(`M100 198 C92 170 108 140 98 ${tt}`,4,'#8a5d3b') + stem(`M101 198 C110 165 92 130 102 ${Math.max(tt+10,72)}`,2.4,'#9c6c47');
    s += plank(36,59,124,9,'#c9a070');
    for(let x=44;x<=150;x+=17) s += plank(x,53,7,19,'#b88d60');
    if(g2>0) s += stem(`M${100-55*g2} 63 Q100 58 ${100+55*g2} 63`,1.8,'#8a5d3b');
    if(f>0) for(let i=0;i<46;i++){ const x=100+(r()-.5)*112*g2, y=58+(r()-.5)*16; s += fatLeaf(x,y,7,r()*360,f,i%2?'#72b85a':'#86c76a'); }
    if(b>0) for(let x=44;x<=154;x+=9){ if(Math.abs(x-100)>55*g2+2) continue; const L=(26+r()*24)*b, n=10;
      for(let j=0;j<n;j++){ const t=j/(n-1), rr=(3.4-t*2)*Math.min(1,b*1.4); s += `<circle cx="${x+Math.sin(j*1.3)*1.4}" cy="${68+t*L}" r="${rr}" ${S(mix('#8a63cf','#d6c4f7',t),.6)}/>`; } }
    return s;
  },
  apple(p){
    const g=ease(seg(p,.03,.6)), H=14+100*g, tw=3+8*g; let s='';
    s += stem(`M100 198 C 92 ${198-H*.35}, 110 ${198-H*.6}, 100 ${198-H}`,tw,'#9a6a43');
    const br=ease(seg(p,.3,.62)), tips=[[100,198-H]];
    if(br>0){ const y=198-H*.6, L=[100-36*br,y-22*br], R=[100+34*br,y-26*br];
      s += stem(`M101 ${y} Q${100-16*br} ${y-6*br} ${L[0]} ${L[1]}`,tw*.5,'#9a6a43') + stem(`M101 ${y+6} Q${100+16*br} ${y-4*br} ${R[0]} ${R[1]}`,tw*.45,'#9a6a43');
      tips.push(L,R); }
    const f=ease(seg(p,.35,.75)), bl=seg(p,.55,.66)*(1-seg(p,.76,.86)), a=ease(seg(p,.78,1));
    const bl_=[]; tips.forEach(([x,y],i)=>{ const r=(i?20:25)*f; bl_.push([x,y,r],[x-r*.75,y+r*.3,r*.75],[x+r*.75,y+r*.3,r*.72],[x,y-r*.45,r*.7]); });
    if(f>0) s += blobs(bl_,'#6cc25a');
    bl_.forEach(([x,y,r],i)=>{ for(let j=0;j<3;j++){ const an=i*2.1+j*2.3, px=x+Math.cos(an)*r*.6, py=y+Math.sin(an)*r*.6;
      if(bl>0) s += flower5(px,py,5.5,'#fff7f9','#f2a7ba',bl);
      if(a>0 && (i+j)%2===0) s += `<circle cx="${px}" cy="${py}" r="${4.8*a}" ${S('#e8473f',1)}/><circle cx="${px-1.6}" cy="${py-1.8}" r="${1.4*a}" fill="#ffffffb0"/><path d="M${px} ${py-4.6*a} l1 -2.4" stroke="#6b4a2f" stroke-width="1.1" stroke-linecap="round"/>`; } });
    return s;
  }
};

/* ---------- containers ---------- */
const POTK = {sunflower:.62,tulip:.6,lavender:.65,chamomile:.62,aster:.75,forgetmenot:.6,nepeta:.75,geranium:.65,cactus:.62,aloe:.7,tomato:.7,wisteria:1.35,apple:.95,mushroom:.7};
function potSVG(k){
  const t=198-58*k, c='#d57f53';
  return `<path d="M${100-36*k} ${t+12*k} L${100+36*k} ${t+12*k} L${100+28*k} 197 Q100 ${199+2*k} ${100-28*k} 197 Z" ${S(c,1.3)}/>
    <path d="M${100-26*k} ${t+18*k} L${100-21*k} 194" stroke="${lt(c,.3)}" stroke-width="${5*k}" stroke-linecap="round"/>
    <rect x="${100-44*k}" y="${t}" width="${88*k}" height="${15*k}" rx="${6*k}" ${S('#e59468',1.3)}/>
    <rect x="${100-38*k}" y="${t+3*k}" width="${30*k}" height="${3.5*k}" rx="${1.7*k}" fill="#f6b48d"/>
    <ellipse cx="100" cy="${t+3*k}" rx="${38*k}" ry="${4*k}" fill="#6b4630"/>`;
}
function plantGroup(type, p, {pot=false, dead=false, sway=false}={}){
  if(SEEDS[type].noPot) pot=false;
  const body = (p<0.06 && type!=='mushroom' ? seedling(p) : '') + (p>=0.02 || type==='mushroom' ? DRAW[type](p) : '');
  const droop = dead ? (['apple','wisteria','tomato','mushroom','cactus'].includes(type) ? 0 : 18) : 0;
  const plant = `<g class="plant${dead?' wilt':''}"><g class="${sway&&!dead?'sway':''}"><g transform="rotate(${droop} 100 198)">${body}</g></g></g>`;
  if(pot){ const k=POTK[type]; return `<ellipse cx="100" cy="198" rx="${34*k}" ry="${4*k}" fill="#00000022"/>${potSVG(k)}<g transform="translate(0 ${-55*k})">${plant}</g>`; }
  if(type==='mushroom') return `<ellipse cx="100" cy="199" rx="54" ry="5" fill="#00000020"/>${plant}`;
  return `<ellipse cx="100" cy="201" rx="36" ry="8.5" fill="#6b4630"/><ellipse cx="100" cy="200" rx="32" ry="6.2" fill="#87603f"/><ellipse cx="92" cy="199" rx="12" ry="2" fill="#9a7150"/>${plant}`;
}

/* ---------- garden furniture (drawn in plant units: 1 cm ≈ 0.68 units, ground contact at y=198) ---------- */
const FURN = {
  table(){
    const iron='#3a4740';
    return `<ellipse cx="100" cy="198" rx="22" ry="4" fill="#00000022"/>
      ${stem('M100 151 L100 192',2.6,iron)}
      ${stem('M100 190 Q92 192 86 198 M100 190 Q108 192 114 198 M100 190 L100 199',2,iron)}
      <path d="M95 158 Q100 153 105 158" ${'fill="none" stroke="'+iron+'" stroke-width="1.4"'}/>
      <ellipse cx="100" cy="150" rx="27" ry="8.5" fill="#cfc6b4" stroke="#9c9381" stroke-width="1.2"/>
      <ellipse cx="100" cy="147.5" rx="27" ry="8.5" fill="#f4f0e7" stroke="#b5ac99" stroke-width="1.2"/>
      <ellipse cx="92" cy="145.5" rx="10" ry="2.6" fill="#ffffff"/>
      <path d="M86 146 l0 -6 a3 1.2 0 0 0 6 0 l0 6 a3 1.2 0 0 1 -6 0Z" fill="#ffffff" stroke="#a9a49a" stroke-width=".8"/><ellipse cx="89" cy="140" rx="3" ry="1.2" fill="#8a5a3c"/>
      <path d="M108 147 q-2 -5 1 -9 l4 0 q3 4 1 9Z" ${S('#7cc4f2',.8)}/>${stem('M111 138 L111 130',.7,'#5fa64f')}${flower5(111,129,4.5,'#ff8fb8','#ffe27a')}`;
  },
  chair(dir=1){
    const r='#c8925a', cu='#3d7fa6';
    return `<g transform="translate(100 0) scale(${dir} 1) translate(-100 0)">
      <ellipse cx="100" cy="198" rx="17" ry="3.5" fill="#00000022"/>
      ${stem('M89 171 L86 197 M111 171 L114 197',1.8,r)}${stem('M93 172 L92 193 M107 172 L108 193',1.5,dk(r,.1))}
      ${stem('M88 169 Q84 152 86 140 Q90 135 95 138 Q93 152 95 168',2.4,r)}
      ${[144,150,156,162].map(y=>`<path d="M87.3 ${y} L94 ${y}" stroke="${cu}" stroke-width="2.6" stroke-linecap="round"/>`).join('')}
      <ellipse cx="100" cy="169" rx="15.5" ry="5" ${S(cu,1.2)}/><path d="M88 168 L112 168 M90 170.5 L110 170.5" stroke="#f4f1e8" stroke-width="1.2" stroke-linecap="round"/></g>`;
  },
  bistro(){
    return `<g transform="translate(-34 -2)">${FURN.chair(1)}</g><g transform="translate(34 -1)">${FURN.chair(-1)}</g>${FURN.table()}`;
  },
  pond(){
    const r=rng(77); let st='';
    const n=22; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, x=100+Math.cos(a)*66, y=186+Math.sin(a)*22, front=Math.sin(a)>0, sz=front?1.15:.85;
      st += `<ellipse cx="${x}" cy="${y}" rx="${(7+r()*3)*sz}" ry="${(4+r()*1.5)*sz}" ${S(['#bdb7ac','#aca59a','#c9c3b7'][i%3],1.1)}/>`; }
    const back = st.split('/>').filter(Boolean).map(x=>x+'/>');
    const half = (i)=> Math.sin(i/n*Math.PI*2) <= 0;
    return `<ellipse cx="100" cy="190" rx="72" ry="26" fill="#00000018"/>
      ${back.filter((_,i)=>half(i)).join('')}
      <ellipse cx="100" cy="186" rx="61" ry="19" fill="#5fb6dc" stroke="#3f8fb4" stroke-width="1.3"/>
      <ellipse cx="100" cy="188" rx="54" ry="14" fill="#7fcdec"/>
      <path d="M62 184 q10 -4 22 -2 M114 192 q12 2 22 -3 M90 180 q6 -2 12 0" stroke="#e8f8ff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g transform="translate(76 190)"><path d="M0 0 m-9 0 a9 4 0 1 0 18 0 a9 4 0 1 0 -18 0Z M0 0 L8 -2 L6 2Z" ${S('#6cc25a',1)}/></g>
      <g transform="translate(124 184)"><ellipse rx="7" ry="3" ${S('#79c866',1)}/></g>
      ${flower5(120,181,6,'#ffb3cf','#ffe27a')}
      ${back.filter((_,i)=>!half(i)).join('')}
      ${stem('M150 176 q-2 -16 1 -26 M155 177 q1 -14 4 -22 M146 178 q-4 -12 -3 -18',1.6,'#6aa857')}
      <rect x="150" y="146" width="3.6" height="9" rx="1.8" ${S('#8a5d3b',.8)}/>`;
  }
};

/* ---------- close-up (timer screen, previews) ---------- */
const _bb = {};
function plantBBox(type, pot){
  const key=type+(pot&&!SEEDS[type].noPot?'p':'e'); if(_bb[key]) return _bb[key];
  let box={x:40,y:20,width:120,height:185};
  try{ const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg'); svg.setAttribute('style','position:absolute;left:-9999px;width:10px;height:10px');
    const g=document.createElementNS(ns,'g'); g.innerHTML=plantGroup(type,1,{pot}); svg.appendChild(g); document.body.appendChild(svg);
    const b=g.getBBox(); box={x:b.x,y:b.y,width:b.width,height:b.height}; svg.remove(); }catch(e){}
  return _bb[key]=box;
}
function closeupSVG(type, p, {pot=false, dead=false, sway=true}={}){
  const b=plantBBox(type,pot), pad=Math.max(b.width,b.height)*.08;
  const w=Math.max(b.width,b.height*.8)+pad*2, x=100-w/2, y=b.y-pad, h=205-y+pad*.4;
  return `<svg viewBox="${x} ${y} ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
    <ellipse cx="100" cy="200" rx="${w*.48}" ry="${Math.max(10,w*.07)}" fill="#a8dc86" stroke="#8cc56c" stroke-width="1.2"/>
    ${plantGroup(type,p,{pot,dead,sway})}</svg>`;
}

/* ---------- the shared garden ---------- */
const GARDEN_Z=.6, BACK_Y=98;
const depth = y => (.3+.5*(y/260))/(.3+.5*BACK_Y/260);
function itemScale(e){
  if(e.kind) return depth(e.y)*GARDEN_Z;                 // furniture is drawn to scale already
  const b=plantBBox(e.seed,false);                        // plants: scale to real-life height
  return depth(e.y)*GARDEN_Z*(SEEDS[e.seed].cm*.68)/Math.max(30,198-b.y);
}
function itemSVG(e, extra=''){
  const s=itemScale(e);
  const inner = e.kind==='chair' ? FURN.chair(e.dir||1) : e.kind ? FURN[e.kind]() : plantGroup(e.seed, e.ok?1:e.p, {pot:e.pot, dead:!e.ok});
  return `<g transform="translate(${e.x} ${e.y}) scale(${s}) translate(-100 -198)" ${extra}>${inner}</g>`;
}
function gardenBG(){
  const r=rng(42); let s=`<rect width="260" height="260" fill="#93d36f"/>`;
  let y=260,i=0; while(y>0){ const h=6+22*(y/260); if(i%2) s+=`<rect x="0" y="${y-h}" width="260" height="${h}" fill="#9ed87b" opacity=".7"/>`; y-=h; i++; }
  // little grass tufts in a loose pattern, smaller towards the back
  for(let gy=8; gy<262; gy+=9+8*(gy/260)){ const sc=.45+.6*(gy/260);
    for(let gx=(Math.round(gy)%2)*9; gx<262; gx+=18+10*(gy/260)){ const x=gx+(r()-.5)*8, yy=gy+(r()-.5)*4;
      s+=`<path d="M${x} ${yy} l${1.4*sc} ${-3*sc} l${1.4*sc} ${3*sc} m${.6*sc} 0 l${1.2*sc} ${-2.4*sc} l${1.2*sc} ${2.4*sc}" stroke="#74b552" stroke-width="${.9*sc}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; } }
  for(let k=0;k<14;k++){ const x=r()*260, yy=30+r()*225, sc=.4+.5*(yy/260);
    s+=`<g transform="translate(${x} ${yy}) scale(${sc})">${[0,1,2,3].map(q=>`<circle cx="${Math.cos(q*1.57)*1.6}" cy="${Math.sin(q*1.57)*1.6}" r="1.4" fill="#fffdf2"/>`).join('')}<circle r=".9" fill="#ffd94a"/></g>`; }
  return s;
}
// The pond lies flat in the grass: its footprint (stone rim included) in scene units
function pondArea(e){ const s=itemScale(e); return {cx:e.x, cy:e.y-12*s, rx:76*s, ry:27*s}; }
function inPond(x,y,pond){ if(!pond) return false; const a=pondArea(pond); return ((x-a.cx)/a.rx)**2+((y-a.cy)/a.ry)**2 < 1; }
// nearest spot just outside the pond, for something dropped inside it
function outOfPond(x,y,pond){
  if(!inPond(x,y,pond)) return {x,y};
  const a=pondArea(pond); let dx=(x-a.cx)/a.rx, dy=(y-a.cy)/a.ry; const d=Math.hypot(dx,dy)||1; dx/=d; dy/=d;
  return {x:a.cx+dx*a.rx*1.04, y:a.cy+dy*a.ry*1.08};
}
// ground points of an item (a bistro set stands on three spots)
function feet(e){ if(e.kind==='bistro'){ const s=itemScale(e); return [[e.x-34*s,e.y],[e.x,e.y],[e.x+34*s,e.y]]; } return [[e.x,e.y]]; }
function gardenSVG(entries, liftedId){
  const fx = e=> liftedId!=null && e.id===liftedId ? 'opacity=".75"' : '';
  const ponds = entries.filter(e=>e.kind==='pond').map(e=>itemSVG(e,fx(e)));
  const items = entries.filter(e=>e.kind!=='pond').sort((a,b)=>a.y-b.y).map(e=> itemSVG(e,fx(e)));
  items.unshift(...ponds);
  return `<svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">${gardenBG()}${items.join('')}</svg>`;
}

/* bounding box (item units) of furniture, measured once */
function furnBBox(kind){
  const key='f_'+kind; if(_bb[key]) return _bb[key];
  let box={x:30,y:130,width:140,height:70};
  try{ const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg'); svg.setAttribute('style','position:absolute;left:-9999px;width:10px;height:10px');
    const g=document.createElementNS(ns,'g'); g.innerHTML=FURN[kind](); svg.appendChild(g); document.body.appendChild(svg);
    const b=g.getBBox(); box={x:b.x,y:b.y,width:b.width,height:b.height}; svg.remove(); }catch(e){}
  return _bb[key]=box;
}
// screen-space box of a garden item (scene units), for tapping/holding
function itemBox(e){
  const b = e.kind ? furnBBox(e.kind) : plantBBox(e.seed, e.pot), s = itemScale(e);
  return {x1:e.x+(b.x-100)*s, x2:e.x+(b.x+b.width-100)*s, y1:e.y+(b.y-198)*s, y2:e.y+(b.y+b.height-198)*s};
}
