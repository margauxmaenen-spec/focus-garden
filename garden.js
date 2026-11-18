/* Focus Garden – plant + garden-plot drawings (SVG strings).
   Plants are drawn in a local coordinate system with the stem base at (100,198);
   the scene places that point in the plant bed left of the path. */

const clamp = (x,a=0,b=1) => Math.min(b,Math.max(a,x));
const seg = (p,a,b) => clamp((p-a)/(b-a));
const ease = t => 1 - Math.pow(1-t,3);
function rng(seed){ let a = seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function mix(c1,c2,t){ const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)); const a=h(c1),b=h(c2);
  return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,'0')).join(''); }

const SEEDS = {
  sunflower:{name:'Sunflower',  desc:'Tall and cheerful. Opens up at the very end.'},
  tulip:    {name:'Tulip',      desc:'Classic and quick to show colour.'},
  lavender: {name:'Lavender',   desc:'Calm purple spikes, one bud at a time.'},
  nepeta:   {name:'Catmint',    desc:'Nepeta: a soft grey mound full of blue-violet spikes.'},
  grape:    {name:'White grape',desc:'A vine along the trellis, heavy with pale grapes.'},
  geranium: {name:'Pink geranium', desc:'Round leaves and bright pink flower balls.'},
  wisteria: {name:'Wisteria',   desc:'Climbs the pergola and drips with purple.'},
  hops:     {name:'Hops',       desc:'Twines up the strings and grows green cones.'},
  aloe:     {name:'Aloe vera',  desc:'A spiky rosette that sends up an orange flower.'},
  tomato:   {name:'Cherry tomato', desc:'Up the cane, from yellow flowers to red fruit.'},
  apple:    {name:'Apple tree', desc:'Blossoms first, then red apples.'}
};

/* ---------- shared bits ---------- */
function leaf(x,y,size,side,angle,k,color='#5cae5a',vein='#3f8a43'){
  if(k<=0.01) return '';
  const s=size;
  return `<g transform="translate(${x} ${y}) scale(${side} 1) rotate(${angle}) scale(${k})">
    <path d="M0 0 Q${s*.45} ${-s*.42} ${s} 0 Q${s*.5} ${s*.3} 0 0Z" fill="${color}"/>
    <path d="M1 0 L${s*.85} -1" stroke="${vein}" stroke-width="1.2" fill="none" opacity=".6"/></g>`;
}
function lobed(x,y,s,rot,color,k=1){
  if(k<=0.01) return '';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s/20*k})">
    <path d="M0 0 C-8 -2 -13 -9 -10 -15 C-7 -13 -6 -18 -2 -21 C0 -18 0 -18 2 -21 C6 -18 7 -13 10 -15 C13 -9 8 -2 0 0Z" fill="${color}"/>
    <path d="M0 0 L0 -17 M0 -6 L-7 -12 M0 -6 L7 -12" stroke="#00000026" stroke-width="1.2" fill="none"/></g>`;
}
function stemPlant(p,maxH){
  const h = 4 + maxH*ease(seg(p,0.03,0.75));
  return {h, tx:100, ty:198-h, stem:`<path d="M100 198 Q104 ${198-h*.5} 100 ${198-h}" stroke="#4e9a4f" stroke-width="${3+2*seg(p,0,.6)}" fill="none" stroke-linecap="round"/>`};
}
function seedling(p){
  const k = ease(seg(p,0,0.06));
  let s = `<ellipse cx="100" cy="196" rx="4.5" ry="3" fill="#8a5a36"/>`;
  if(k>0) s += `<path d="M100 197 L100 ${197-8*k}" stroke="#5cae5a" stroke-width="2.5" stroke-linecap="round"/>`
            + leaf(100,197-8*k,9,1,-30,k) + leaf(100,197-8*k,9,-1,-30,k);
  return s;
}
const wood = (x1,y1,x2,y2,w=4,c='#9b7653') => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
function trunk(H,tw,bend=8){
  return `<path d="M100 198 C ${100-bend} ${198-H*.35}, ${100+bend*1.2} ${198-H*.6}, 100 ${198-H}" stroke="#7a4b2f" stroke-width="${tw}" fill="none" stroke-linecap="round"/>`;
}

/* ---------- plants ---------- */
const DRAW = {
  sunflower(p){
    const {h,tx,ty,stem} = stemPlant(p,150); let s = stem;
    [[.25,1,.12],[.4,-1,.25],[.55,1,.38],[.68,-1,.5]].forEach(([t,side,th])=> s += leaf(101,198-h*t,30,side,-20,ease(seg(p,th,th+.14))));
    const b = ease(seg(p,.72,1));
    if(p>.6){
      if(b<.3) s += `<circle cx="${tx}" cy="${ty}" r="${5+b*25}" fill="#6aa84f"/>`;
      else { const R=12+22*b; let pe='';
        for(let i=0;i<16;i++) pe += `<ellipse cx="0" cy="${-R*.62}" rx="${R*.17}" ry="${R*.42}" fill="${i%2?'#f6c431':'#ffd43b'}" transform="rotate(${i*22.5})"/>`;
        s += `<g transform="translate(${tx} ${ty})">${pe}<circle r="${R*.42}" fill="#6b3e1f"/><circle r="${R*.3}" fill="#7d4a26"/></g>`; }
    }
    return s;
  },
  tulip(p){
    const {tx,ty,stem} = stemPlant(p,105); let s = stem;
    const l1=ease(seg(p,.08,.4)), l2=ease(seg(p,.2,.55));
    if(l1>0) s += `<path d="M100 198 Q${80-10*l1} ${198-40*l1} ${84-6*l1} ${198-70*l1} Q96 ${198-35*l1} 100 198Z" fill="#5cae5a"/>`;
    if(l2>0) s += `<path d="M100 198 Q${120+10*l2} ${198-35*l2} ${117+4*l2} ${198-60*l2} Q104 ${198-30*l2} 100 198Z" fill="#4f9f4d"/>`;
    const b = ease(seg(p,.65,1));
    if(p>.55){
      if(b<.25) s += `<ellipse cx="${tx}" cy="${ty-6}" rx="${4+b*12}" ry="${8+b*16}" fill="#7ab55c"/>`;
      else s += `<g transform="translate(${tx} ${ty+2}) scale(${.45+.55*b})">
        <path d="M-15 0 Q-20 -26 -6 -36 Q-2 -18 0 -4Z" fill="#c8323f"/><path d="M15 0 Q20 -26 6 -36 Q2 -18 0 -4Z" fill="#c8323f"/>
        <path d="M-12 2 Q-14 -24 0 -38 Q14 -24 12 2 Q0 8 -12 2Z" fill="#e5484d"/>
        <path d="M-4 -6 Q-2 -24 0 -32" stroke="#ff8a8e" stroke-width="2" fill="none" opacity=".6"/></g>`;
    }
    return s;
  },
  lavender(p){
    const g = ease(seg(p,.03,.75)); let s='';
    [[-1,-55],[1,-55],[-1,-35],[1,-35]].forEach(([side,a],i)=> s += leaf(100,197,22,side,a,ease(seg(p,.05+i*.06,.25+i*.06)),'#8fb38a','#6d9468'));
    const b = seg(p,.6,1);
    [[-14,.85],[0,1],[14,.9]].forEach(([ang,f],si)=>{
      const h = 6+120*g*f;
      s += `<g transform="rotate(${ang} 100 198)"><path d="M100 198 L100 ${198-h}" stroke="#7aa070" stroke-width="2.4" stroke-linecap="round"/>`;
      for(let j=0;j<9;j++){ const k=clamp(b*10-j-si*.4); if(k<=0) continue;
        s += `<ellipse cx="${100+(j%2?3:-3)}" cy="${198-h+j*5.2}" rx="${3.4*k}" ry="${4.6*k}" fill="${j%3?'#8e6cc9':'#a487db'}"/>`; }
      s += `</g>`;
    });
    return s;
  },

  nepeta(p){
    const r = rng(11), g = ease(seg(p,.03,.7)), b = ease(seg(p,.6,1)); let s='';
    const spikes = [];
    for(let i=0;i<26;i++){ const a=-0.35-r()*2.45, L=(22+r()*16); spikes.push([a,L,r()]); }
    // stems behind the mound
    spikes.forEach(([a,L])=>{ const bx=100+Math.cos(a)*20*g, by=198+Math.sin(a)*14*g, tx=100+Math.cos(a)*(30+L)*g*1.15, ty=198+Math.sin(a)*(26+L)*g;
      s += `<path d="M${bx} ${by} L${tx} ${ty}" stroke="#7f9c7c" stroke-width="1.4"/>`; });
    for(let i=0;i<80;i++){ const a=-Math.PI*r(), rr=Math.sqrt(r())*36*g;
      s += `<ellipse cx="${100+Math.cos(a)*rr*1.3}" cy="${198+Math.sin(a)*rr*.85}" rx="${3.6*g+.5}" ry="${2.3*g+.4}" transform="rotate(${r()*180} ${100+Math.cos(a)*rr*1.3} ${198+Math.sin(a)*rr*.85})" fill="${i%3?'#93b190':'#a9c3a5'}"/>`; }
    if(b>0) spikes.forEach(([a,L,q])=>{ const tx=100+Math.cos(a)*(30+L)*g*1.15, ty=198+Math.sin(a)*(26+L)*g;
      for(let j=0;j<6;j++){ const k=clamp(b*7-j-q); if(k<=0) continue; const t=j/6*.45;
        const x=tx+(100-tx)*t, y=ty+(198-ty)*t;
        s += `<circle cx="${x+(j%2?1.6:-1.6)}" cy="${y}" r="${2.1*k}" fill="${j%2?'#8b8fe0':'#a6a4ee'}"/>`; } });
    return s;
  },

  grape(p){
    let s = wood(40,200,40,86,5) + wood(160,200,160,86,5);
    [96,128,160].forEach(y=> s += `<path d="M40 ${y} L160 ${y}" stroke="#8a8a8a" stroke-width="1"/>`);
    const g1=ease(seg(p,.03,.35)), g2=ease(seg(p,.28,.62)), g3=ease(seg(p,.45,.75)), f=ease(seg(p,.72,1));
    const topY = 198-70*g1;
    s += `<path d="M100 198 Q96 170 100 ${topY}" stroke="#7a5236" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const arms=[];
    if(g2>0){ arms.push([128,-1,56*g2],[128,1,56*g2]); s += `<path d="M${100-56*g2} 128 L${100+56*g2} 128" stroke="#7a5236" stroke-width="3.2" stroke-linecap="round"/>`; }
    if(g3>0){ s += `<path d="M100 128 L100 ${128-32*g3}" stroke="#7a5236" stroke-width="3" stroke-linecap="round"/>`;
      if(g3>.6){ const k=(g3-.6)/.4; arms.push([96,-1,50*k],[96,1,50*k]); s += `<path d="M${100-50*k} 96 L${100+50*k} 96" stroke="#7a5236" stroke-width="2.4" stroke-linecap="round"/>`; } }
    arms.forEach(([y,side,len])=>{ for(let d=8,i=0; d<=len; d+=13,i++) s += lobed(100+side*d, y+(i%2?2:-1), 17, (i%2?160:-15)+side*10, i%2?'#5f9f4a':'#6fb055'); });
    if(f>0) [[66,128],[90,128],[116,128],[136,128],[78,96],[124,96]].forEach(([x,y],ci)=>{
      const rows=[4,4,3,3,2,1]; rows.forEach((n,ri)=>{ for(let j=0;j<n;j++){
        s += `<circle cx="${x+(j-(n-1)/2)*5.2*f}" cy="${y+6+ri*4.6*f}" r="${2.9*f}" fill="${(ri+j)%2?'#e5edb5':'#d6e39a'}" stroke="#b9c97a" stroke-width=".6"/>`; } }); });
    return s;
  },

  geranium(p){
    const r=rng(5), g=ease(seg(p,.03,.65)), b=ease(seg(p,.6,1)); let s='';
    const umb=[]; for(let k=0;k<5;k++) umb.push([100+(k-2)*15+(r()-.5)*6, 198-42*g-r()*14*g]);
    umb.forEach(([x,y])=> s += `<path d="M${100+(x-100)*.4} 192 Q${x} ${y+15} ${x} ${y}" stroke="#5c8f45" stroke-width="1.6" fill="none"/>`);
    for(let i=0;i<18;i++){ const a=-.2-r()*2.75, rr=(6+r()*24)*g, x=100+Math.cos(a)*rr*1.3, y=197+Math.sin(a)*rr*.8, R=(6+r()*3)*g+1;
      s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${i%2?'#5c9e4c':'#68aa56'}" stroke="#4a8a3d" stroke-width="1.2" stroke-dasharray="2.2 1.6"/>
            <circle cx="${x}" cy="${y}" r="${R*.55}" fill="none" stroke="#3e7a33" stroke-width="1.6" opacity=".35"/>`; }
    if(p>.5) umb.forEach(([x,y])=>{
      if(b<.2){ s += `<circle cx="${x}" cy="${y}" r="${3+b*10}" fill="#8fbf6f"/>`; return; }
      for(let j=0;j<9;j++){ const a=j/9*Math.PI*2, d=j?7*b:0, fx=x+Math.cos(a)*d, fy=y+Math.sin(a)*d*.8;
        let pe=''; for(let q=0;q<5;q++) pe += `<circle cx="${Math.cos(q*1.256)*2.2}" cy="${Math.sin(q*1.256)*2.2}" r="2.3" fill="${q%2?'#f06c9b':'#f584ad'}"/>`;
        s += `<g transform="translate(${fx} ${fy}) scale(${b})">${pe}<circle r="1" fill="#fff3f7"/></g>`; } });
    return s;
  },

  wisteria(p){
    const r=rng(9), g1=ease(seg(p,.03,.45)), g2=ease(seg(p,.35,.7)), f=ease(seg(p,.4,.8)), b=ease(seg(p,.7,1));
    let s = wood(50,200,50,68,6) + wood(146,200,146,68,6);
    const trunkTop = 198-130*g1;
    s += `<path d="M100 198 C92 170 108 140 98 ${Math.max(trunkTop,70)}" stroke="#6e4a33" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M101 198 C110 165 92 130 102 ${Math.max(trunkTop+10,72)}" stroke="#80583c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    s += `<rect x="38" y="60" width="120" height="8" rx="2" fill="#a88360"/>`;
    for(let x=46;x<=150;x+=17) s += `<rect x="${x}" y="55" width="6" height="16" rx="1.5" fill="#94704e"/>`;
    if(g2>0) s += `<path d="M${100-55*g2} 63 Q100 58 ${100+55*g2} 63" stroke="#6e4a33" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    if(f>0) for(let i=0;i<60;i++){ const x=100+(r()-.5)*115*g2, y=60+(r()-.5)*16;
      s += `<ellipse cx="${x}" cy="${y}" rx="${4*f}" ry="${2.2*f}" transform="rotate(${r()*180} ${x} ${y})" fill="${i%2?'#6fae58':'#83bd68'}"/>`; }
    if(b>0) for(let x=44;x<=154;x+=9){ if(Math.abs(x-100)>55*g2+2) continue; const L=(26+r()*24)*b, n=11;
      for(let j=0;j<n;j++){ const t=j/(n-1); s += `<circle cx="${x+Math.sin(j*1.3)*1.4}" cy="${68+t*L}" r="${(3.2-t*1.9)*Math.min(1,b*1.4)}" fill="${mix('#7d5cc0','#cdb9f5',t)}"/>`; } }
    return s;
  },

  hops(p){
    let s = wood(100,200,100,4,5,'#8f6b48') + wood(84,8,116,8,3,'#8f6b48');
    s += `<path d="M86 8 L60 199 M114 8 L140 199" stroke="#c9b17c" stroke-width="1.2"/>`;
    const g=ease(seg(p,.03,.72)), c=ease(seg(p,.7,1));
    [[60,86,0],[140,114,1]].forEach(([x0,x1,k])=>{
      const L=g, pts=[]; for(let t=0;t<=L+1e-6;t+=.02){ const x=x0+(x1-x0)*t, y=199-191*t; pts.push([x+Math.sin(t*38+k)*3.2,y]); }
      if(pts.length>1) s += `<path d="M${pts.map(q=>q.join(' ')).join(' L')}" stroke="#4e8f3c" stroke-width="2" fill="none"/>`;
      for(let t=.08,i=0;t<=L;t+=.085,i++){ const x=x0+(x1-x0)*t, y=199-191*t; s += lobed(x+(i%2?4:-4),y,15,(i%2?55:-55),i%2?'#5aa047':'#69b053'); }
      if(c>0) for(let t=.35,i=0;t<=L;t+=.11,i++){ const x=x0+(x1-x0)*t+(i%2?9:-9), y=199-191*t+8;
        s += `<g transform="translate(${x} ${y}) scale(${c})"><ellipse rx="4.2" ry="6.5" fill="#cfe592"/><path d="M-4 -2 Q0 0 4 -2 M-4 2 Q0 4 4 2" stroke="#a5c16a" stroke-width="1" fill="none"/></g>`; }
    });
    return s;
  },

  aloe(p){
    const g=ease(seg(p,.03,.75)), b=ease(seg(p,.72,1)); let s='';
    if(b>0){ const top=198-110*b;
      s += `<path d="M103 196 Q108 ${198-60*b} 106 ${top}" stroke="#6e9d72" stroke-width="2.6" fill="none"/>`;
      for(let j=0;j<10;j++){ const t=j/10, y=top+t*38*b, x=106+(j%2?3:-3); const k=clamp(b*1.4-t*.4);
        s += `<ellipse cx="${x}" cy="${y}" rx="${1.8*k}" ry="${5*k}" transform="rotate(${j%2?20:-20} ${x} ${y})" fill="${j<3?'#f7c75c':'#f0943a'}"/>`; } }
    const angs=[-78,78,-58,58,-38,38,-18,18,0];
    angs.forEach((ang,i)=>{ const L=(28+34*(1-Math.abs(ang)/90))*g+5, w=4+4*g;
      let teeth=''; for(let t=.15;t<.8;t+=.13) teeth += `<path d="M${-w*(1-t)} ${-L*t} l-1.8 -1.4 M${w*(1-t)} ${-L*t} l1.8 -1.4" stroke="#e7efe0" stroke-width="1"/>`;
      let spots=''; for(let t=.2;t<.7;t+=.15) spots += `<circle cx="${(t*7%2-1)*1.5}" cy="${-L*t}" r=".9" fill="#e9f2e4" opacity=".8"/>`;
      s += `<g transform="translate(100 198) rotate(${ang*.95})"><path d="M${-w} 0 Q${-w*.9} ${-L*.55} 0 ${-L} Q${w*.9} ${-L*.55} ${w} 0Z" fill="${i%2?'#7fb49a':'#6fa88b'}"/>${teeth}${spots}</g>`; });
    return s;
  },

  tomato(p){
    let s = wood(110,200,110,54,3,'#d6bf7a');
    const g=ease(seg(p,.03,.7)), fl=seg(p,.42,.7), f=ease(seg(p,.62,1)); const H=130*g+4;
    s += `<path d="M100 198 Q106 ${198-H*.5} 104 ${198-H}" stroke="#4f8f3c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    for(let y=170;y>198-H+10;y-=32) s += `<path d="M103 ${y} L112 ${y-2}" stroke="#e8e0c6" stroke-width="2"/>`;
    for(let i=0,t=.12;t<.95;t+=.15,i++){ const k=ease(clamp((g-t)/.2)); if(k<=0) continue; const y=198-H*t, side=i%2?1:-1, x=103;
      s += `<path d="M${x} ${y} q${side*12*k} -6 ${side*24*k} -2" stroke="#4f8f3c" stroke-width="1.4" fill="none"/>`;
      [[.35,-1],[.35,1],[.7,-1],[.7,1],[1,0]].forEach(([q,o])=> s += leaf(x+side*24*k*q, y-4*k*q+o*1, 10, side, o*35-10, k*.9,'#5b9c46','#3f7a33')); }
    [[.45,1],[.65,-1],[.82,1]].forEach(([t,side],ti)=>{ if(g<t) return; const x=104+side*6, y=198-H*t+4;
      s += `<path d="M${x} ${y} q${side*8} 4 ${side*14} 10" stroke="#4f8f3c" stroke-width="1.2" fill="none"/>`;
      for(let j=0;j<6;j++){ const fx=x+side*(5+j*2.6), fy=y+6+j*3+(j%2?2:-1);
        if(f>0) s += `<circle cx="${fx}" cy="${fy}" r="${1.5+3*f}" fill="${mix('#93c45a','#e2392e',clamp(f*1.3-j*.06))}"/><circle cx="${fx-1}" cy="${fy-1.2}" r="${.9*f}" fill="#ffffff66"/>`;
        else if(fl>0) s += `<circle cx="${fx}" cy="${fy}" r="${2*fl}" fill="#f6d33c"/>`; } });
    return s;
  },

  apple(p){
    const g=ease(seg(p,.03,.6)), H=14+100*g, tw=3+8*g; let s = trunk(H,tw);
    const br=ease(seg(p,.3,.62)), tips=[[100,198-H]];
    if(br>0){ const y=198-H*.6, L=[100-36*br,y-22*br], R=[100+34*br,y-26*br];
      s += `<path d="M101 ${y} Q${100-16*br} ${y-6*br} ${L[0]} ${L[1]}" stroke="#7a4b2f" stroke-width="${tw*.55}" fill="none" stroke-linecap="round"/>
            <path d="M101 ${y+6} Q${100+16*br} ${y-4*br} ${R[0]} ${R[1]}" stroke="#7a4b2f" stroke-width="${tw*.5}" fill="none" stroke-linecap="round"/>`;
      tips.push(L,R); }
    const f=ease(seg(p,.35,.75)), bl=seg(p,.55,.66)*(1-seg(p,.76,.86)), a=ease(seg(p,.78,1));
    const blobs=[]; tips.forEach(([x,y],i)=>{ const r=(i?20:25)*f; blobs.push([x,y,r],[x-r*.75,y+r*.3,r*.75],[x+r*.75,y+r*.3,r*.72],[x,y-r*.45,r*.7]); });
    if(f>0) blobs.forEach(([x,y,r],i)=> s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${i%2?'#5fa552':'#6db35f'}"/>`);
    blobs.forEach(([x,y,r],i)=>{ for(let j=0;j<3;j++){ const an=i*2.1+j*2.3, px=x+Math.cos(an)*r*.6, py=y+Math.sin(an)*r*.6;
      if(bl>0) s += `<circle cx="${px}" cy="${py}" r="${2.8*bl}" fill="#fff4f6"/><circle cx="${px}" cy="${py}" r="${1.1*bl}" fill="#f2a7ba"/>`;
      if(a>0 && (i+j)%2===0) s += `<circle cx="${px}" cy="${py}" r="${4.6*a}" fill="#d8352f"/><circle cx="${px-1.4}" cy="${py-1.6}" r="${1.3*a}" fill="#ffffff70"/>`; } });
    return s;
  }
};

/* ---------- the garden plot ---------- */
let uid = 0;
function gardenBG(z=1, withBistro=true){
  const r = rng(42);
  let s = `<rect width="260" height="260" fill="#8dc26b"/>`;
  // mowing stripes that get narrower towards the back, for depth
  let y = 260, i = 0;
  while(y > 0){ const h = 6 + 22*(y/260); if(i%2) s += `<rect x="0" y="${y-h}" width="260" height="${h}" fill="#97ca75" opacity=".6"/>`; y -= h; i++; }
  s += `<rect width="260" height="70" fill="#ffffff" opacity=".07"/>`;
  for(let k=0;k<170;k++){ const x=r()*260, yy=r()*260, sc=.45+.55*(yy/260);
    s += `<path d="M${x} ${yy} l${(r()-.5)*2*sc} -${(2+r()*3)*sc}" stroke="${k%2?'#77ad55':'#a6d483'}" stroke-width="${sc}"/>`; }
  if(withBistro) s += bistroAt(z);
  return s;
}
// table + chairs; their 'feet' sit at y=98, so they can be depth-sorted with plants
const BISTRO_Y = 98;
function bistroAt(z=1){
  return `<g transform="translate(203 ${BISTRO_Y}) scale(${1.7*z}) translate(-217 -67)">${bistro()}</g>`;
}
function bistro(){
  const iron='#2d3530';
  const chair=(x,dir)=>`<g transform="translate(${x} 52) scale(${dir} 1)">
      <ellipse cx="0" cy="13" rx="9" ry="2" fill="#00000020"/>
      <path d="M-6 0 L-7 12 M5 0 L6 12 M-3 0 L-3.5 11 M2.5 0 L3 11" stroke="#a8733b" stroke-width="1.3"/>
      <path d="M-6 0 Q-9 -10 -7 -18 Q-3 -21 -1 -18 Q-3 -10 -2 0" fill="none" stroke="#a8733b" stroke-width="1.6"/>
      <path d="M-7 -16 L-2 -16 M-7.6 -12 L-2.4 -12 M-7.6 -8 L-2.2 -8 M-7.2 -4 L-2 -4" stroke="#2f6f8f" stroke-width="1.6"/>
      <ellipse cx="0" cy="0" rx="7.5" ry="2.6" fill="#2f6f8f"/><path d="M-6 -.6 L6 -.6 M-5 .9 L5 .9" stroke="#f2f0ea" stroke-width=".7"/>
    </g>`;
  return `<g class="bistro">
    <ellipse cx="217" cy="66" rx="30" ry="5" fill="#00000018"/>
    ${chair(196,1)}${chair(238,-1)}
    <path d="M217 42 L217 62 M217 62 L209 66 M217 62 L225 66 M217 62 L217 67" stroke="${iron}" stroke-width="1.6" fill="none"/>
    <path d="M214 50 Q217 47 220 50" stroke="${iron}" stroke-width="1" fill="none"/>
    <ellipse cx="217" cy="41" rx="14" ry="4.6" fill="#ece8df" stroke="#bdb6a8" stroke-width=".8"/>
    <ellipse cx="217" cy="43" rx="14" ry="4.6" fill="none" stroke="${iron}" stroke-width=".9" opacity=".6"/>
    <path d="M212 37 l0 -4 l3 0 l0 4z" fill="#ffffffcc" stroke="#9aa" stroke-width=".4"/><ellipse cx="220" cy="38" rx="2.6" ry="1.2" fill="#f5f1e8" stroke="#bbb" stroke-width=".4"/>
  </g>`;
}

/* ---------- containers ---------- */
// pot size per plant (1 = standard pot); big climbers get a big planter
const POTK = {sunflower:.62,tulip:.6,lavender:.65,nepeta:.75,grape:1.35,geranium:.65,wisteria:1.35,hops:.9,aloe:.7,tomato:.7,apple:.95};
function potSVG(k){
  const t = 198-58*k;
  return `<path d="M${100-36*k} ${t+12*k} L${100+36*k} ${t+12*k} L${100+28*k} 197 Q100 ${199+2*k} ${100-28*k} 197 Z" fill="#c9744d"/>
    <path d="M${100-36*k} ${t+12*k} L${100+36*k} ${t+12*k} L${100+35*k} ${t+21*k} L${100-35*k} ${t+21*k}Z" fill="#b5653f" opacity=".6"/>
    <rect x="${100-44*k}" y="${t}" width="${88*k}" height="${15*k}" rx="${5*k}" fill="#dc8a62"/>
    <ellipse cx="100" cy="${t+3*k}" rx="${40*k}" ry="${4.5*k}" fill="#5b3a29"/>`;
}
// One plant in its container, in plant units (ground contact at y=198).
function plantGroup(type, p, {pot=false, dead=false, sway=false}={}){
  const body = (p<0.06 ? seedling(p) : '') + (p>=0.02 ? DRAW[type](p) : '');
  const droop = dead ? (['apple','grape','wisteria','hops','tomato'].includes(type) ? 0 : 18) : 0;
  const plant = `<g class="plant${dead?' wilt':''}"><g class="${sway&&!dead?'sway':''}"><g transform="rotate(${droop} 100 198)">${body}</g></g></g>`;
  if(pot){ const k=POTK[type]; return `<ellipse cx="100" cy="198" rx="${34*k}" ry="${4*k}" fill="#00000022"/>${potSVG(k)}<g transform="translate(0 ${-55*k})">${plant}</g>`; }
  return `<ellipse cx="100" cy="201" rx="38" ry="9" fill="#6b4a33"/><ellipse cx="100" cy="200" rx="33" ry="6.5" fill="#7d5940"/>${plant}`;
}

/* Bounding box (plant units) of the fully grown plant, measured once in the browser */
const _bb = {};
function plantBBox(type, pot){
  const key = type+(pot?'p':'e');
  if(_bb[key]) return _bb[key];
  let box = {x:40,y:20,width:120,height:185};
  try{
    const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg');
    svg.setAttribute('style','position:absolute;left:-9999px;width:10px;height:10px');
    const g=document.createElementNS(ns,'g'); g.innerHTML=plantGroup(type,1,{pot});
    svg.appendChild(g); document.body.appendChild(svg);
    const b=g.getBBox(); box={x:b.x,y:b.y,width:b.width,height:b.height}; svg.remove();
  }catch(e){}
  return _bb[key]=box;
}

/* Close-up of one plant (timer screen, previews). Framed on the fully grown plant so it grows into the frame. */
function closeupSVG(type, p, {pot=false, dead=false, sway=true}={}){
  const b = plantBBox(type,pot), pad = Math.max(b.width,b.height)*.08;
  const w = Math.max(b.width, b.height*.8)+pad*2, x = 100-w/2, y = b.y-pad, h = 205-y+pad*.4;
  return `<svg viewBox="${x} ${y} ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
    <ellipse cx="100" cy="200" rx="${w*.48}" ry="${Math.max(10,w*.07)}" fill="#a5d585"/>
    <ellipse cx="100" cy="200" rx="${w*.38}" ry="${Math.max(7,w*.05)}" fill="#97cb75"/>
    ${plantGroup(type,p,{pot,dead,sway})}</svg>`;
}

/* ---------- the shared garden ---------- */
const GARDEN_Z = .6;
const REAL = {sunflower:.72,tulip:.21,lavender:.31,nepeta:.49,grape:1.09,geranium:.45,wisteria:1.19,hops:1.05,aloe:.55,tomato:.71,apple:1.13};
// further back (higher up) = smaller
function depthScale(y){ return (.3+.5*(y/260))/(.3+.5*BISTRO_Y/260)*.68*GARDEN_Z; }
function plantScale(e){ return depthScale(e.y)*REAL[e.seed]; }
function placedPlant(e, extra=''){
  const s = plantScale(e);
  return `<g transform="translate(${e.x} ${e.y}) scale(${s}) translate(-100 -198)" ${extra}>${plantGroup(e.seed, e.ok?1:e.p, {pot:e.pot, dead:!e.ok})}</g>`;
}
// screen-space box of a placed plant (scene units), for tapping/holding
function placedBox(e){
  const b = plantBBox(e.seed, e.pot), s = plantScale(e);
  return {x1:e.x+(b.x-100)*s, x2:e.x+(b.x+b.width-100)*s, y1:e.y+(b.y-198)*s, y2:e.y+(b.y+b.height-198)*s};
}
function gardenSVG(entries, liftedId){
  const items = entries.map(e=>({y:e.y, svg:placedPlant(e, e.id===liftedId ? 'opacity=".75"' : '')}));
  items.push({y:BISTRO_Y, svg:bistroAt(GARDEN_Z)});
  items.sort((a,b)=>a.y-b.y);
  return `<svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">${gardenBG(GARDEN_Z,false)}${items.map(i=>i.svg).join('')}</svg>`;
}
