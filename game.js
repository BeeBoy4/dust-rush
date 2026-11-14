
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const UI=$('#ui');
const THREE=window.THREE;
if(!THREE){window.__loader&&__loader.hide(0);UI.innerHTML='<div class="scr"><div class="card" style="max-width:420px">Could not load the 3D engine. Check your connection and reload the page.</div></div>';return}
const glc=$('#gl'),ov=$('#ov2'),octx=ov.getContext('2d');
const gl=new THREE.WebGLRenderer({canvas:glc,antialias:true});
const cam3=new THREE.PerspectiveCamera(52,1,8,9000);
let DPR=1,VW=0,VH=0,SAFE_B=0;
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);VW=innerWidth;VH=innerHeight;
  gl.setPixelRatio(Math.min(window.__pr||1.25,DPR));gl.setSize(VW,VH,false);cam3.aspect=VW/VH;cam3.updateProjectionMatrix();
  ov.width=Math.round(VW*DPR);ov.height=Math.round(VH*DPR);SAFE_B=$('#safeb').offsetHeight||0}
addEventListener('resize',resize);resize();
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- storage ---------------- */
const mem={};
function sget(k,d){try{const v=localStorage.getItem(k);if(v!=null)return JSON.parse(v)}catch(e){}return k in mem?mem[k]:d}
function sset(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const KEY='porvihar.v1';
const DEF={coins:0,owned:{b5:1,b0:1,b1:1,r0:1,p0:1,p1:1,l0:1,s0:1,d0:1},eq:{body:'b5',rim:'r0',paint:'p0',liv:'l0',spoiler:'s0',dust:'d0'},nick:'',story:{},daily:{},custom:[],ghostMode:'best',mute:false,cam:'chase'};
let S=Object.assign({},DEF,sget(KEY,{}));
S.owned=Object.assign({},DEF.owned,S.owned||{});S.eq=Object.assign({},DEF.eq,S.eq||{});
if(!Array.isArray(S.custom))S.custom=[];
const NICK_A=['Turbo','Dusty','Sideways','Muddy','Spicy','Wobbly','Grumpy','Sneaky','Rusty','Fuzzy','Crispy','Bouncy','Sleepy','Feral','Lucky','Soggy','Angry','Chunky','Shiny','Drifty'],NICK_B=['Goose','Potato','Noodle','Donut','Badger','Pickle','Moose','Yeti','Taco','Llama','Gnome','Wombat','Muffin','Walrus','Biscuit','Hamster','Toaster','Penguin','Nugget','Beaver'];
function funnyNick(){for(let i=0;i<20;i++){const n=NICK_A[Math.floor(Math.random()*NICK_A.length)]+' '+NICK_B[Math.floor(Math.random()*NICK_B.length)];if(n.length<=16)return n}return 'Turbo Goose'}
if(!S.nick||/^Pilóta/.test(S.nick)||/^Driver\d*$/.test(S.nick))S.nick=funnyNick();
window.addEventListener('error',e=>{if(!e||!e.message)return;console.error('[DustRush]',e.message,e.error);try{toast('Error: '+String(e.message).slice(0,140))}catch(_){}});
window.addEventListener('unhandledrejection',e=>{const r=e&&e.reason;let m='';try{m=r&&(r.message||r.code)?String(r.message||r.code):JSON.stringify(r)}catch(_){m=String(r)}console.error('[DustRush] unhandled',r);e.preventDefault();});
if(S.cam!=='chase'&&S.cam!=='iso')S.cam='chase';
S.opt=Object.assign({dust:true,skid:true,gfx:'m',sens:'n',view:'above'},S.opt||{});
S.opt.cam=Object.assign({d:6,h:2.5,fov:70},S.opt.cam||{});S.opt.vol=Object.assign({engine:1,fx:1},S.opt.vol||{});
const DEFAULT_KEYS={up:['KeyW','ArrowUp'],down:['KeyS','ArrowDown'],left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight'],hb:['Space',null],pause:['KeyP',null],restart:['KeyR','Backspace'],camera:['KeyC',null]};
const KEY_NAMES={up:'Accelerate',down:'Brake / reverse',left:'Steer left',right:'Steer right',hb:'Handbrake',pause:'Pause',restart:'Restart stage',camera:'Change camera'};
S.keys=(()=>{const o={};for(const a in DEFAULT_KEYS){const v=S.keys&&Array.isArray(S.keys[a])?S.keys[a].slice(0,2):DEFAULT_KEYS[a].slice();while(v.length<2)v.push(null);o[a]=v}return o})();
const VIEWS=['above','chase','low','hood','custom'],VNAME={above:'Above',chase:'Chase',low:'Low',hood:'Bonnet',custom:'Custom'};
const CAM_RANGE={d:[2,12],h:[.5,6],fov:[40,100]};
const SENS=()=>({l:.72,n:1,h:1.3}[S.opt&&S.opt.sens]||1);
function applyGfx(){window.__pr={l:.85,m:1.2,h:1.75}[S.opt.gfx]||1.2;resize()}applyGfx();
if(!S.evo){S.evo=1;S.owned.b5=1;if(S.eq.body==='b0')S.eq.body='b5'}
if(!S.v3){S.v3=1;for(const k of ['b0','b1','b2','b3','b4','b5','b6','b8','b9','b10','b11','b12','b13','b14','b15','b16','l0','l1','l2','l3','l4','l5','s0','s1','s2'])delete S.owned[k];
  Object.assign(S.eq,{body:'b7',paint:'po',liv:'lv0',wing:'w0',decal:'n0',lights:'h0'})}
for(const k of ['b7','po','lv0','lv1','w0','w1','n0','h0','r0','d0','p0','p1'])S.owned[k]=1;
if(!S.v4){S.v4=1;S.story={}}
if(!S.v8){S.v8=1;Object.assign(S.eq,{body:'b7',paint:'po',liv:'lv0'})}
if(!S.v5){S.v5=1;S.story={}}
if(!S.v6){S.v6=1;S.story={}}
if(!S.v7){S.v7=1;S.story={}}
for(const [k,v] of [['liv','lv0'],['wing','w0'],['decal','n0'],['lights','h0']])if(!S.eq[k])S.eq[k]=v;
function save(){sset(KEY,S)}
save();

/* ---------------- utils ---------------- */
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const angD=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
function hash2(i,j,s){let h=(Math.imul(i,374761393)+Math.imul(j,668265263)+Math.imul(s,982451653))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y,s){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);const a=hash2(i,j,s),b=hash2(i+1,j,s),c=hash2(i,j+1,s),d=hash2(i+1,j+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function heightAt(x,z,d,s){const t=clamp((d-300)/450,0,1);const e=t*t*(3-2*t);if(e<=0)return 0;return e*(vnoise(x/360,z/360,s)*270+vnoise(x/140,z/140,s+7)*60)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fmt(t){if(t==null||!isFinite(t))return '–:––.–––';const ms=Math.round(t*1000),m=Math.floor(ms/60000);return m+':'+((ms-m*60000)/1000).toFixed(3).padStart(6,'0')}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
let toastT=0;
function toast(msg){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el)}el.textContent=msg;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true},2600)}
function isDark(hex){const n=parseInt(hex.slice(1),16);const r=(n>>16)&255,g=(n>>8)&255,b=n&255;return (0.299*r+0.587*g+0.114*b)/255<0.5}

/* ---------------- data ---------------- */
const BIOMES={
  spring:{name:'Spring',sky:'#d6e7f0',ground:['#8fd27a','#86ca72','#98d983'],verge:'#8fd27a',track:'#c9965f',rut:'#93613a',rock:'#9a9da0',edge:'#a8c48a',dust:[220,206,180],grip:1,decor:['tree','tree','tree','pine','bush','bush','rock'],treeC:['#f4a6c8','#f7c6dc','#ffe0ec','#9ad06a'],trunk:'#8a5a3b'},
  forest:{name:'Summer',sky:'#cdd6d9',ground:['#7cc887','#76c181','#82cd8c'],verge:'#7cc887',track:'#c08b59',rut:'#8a5733',rock:'#8e9196',edge:'#9fae86',dust:[214,204,182],grip:1,decor:['pine','pine','tree','bush','bush','rock'],treeC:['#5fae4f','#4f9e45','#6cbb5a'],trunk:'#8a5a3b'},
  autumn:{name:'Autumn',sky:'#e3d7c4',ground:['#b8b45a','#a9a650','#c4bf66'],verge:'#b2ae55',track:'#b57c4d',rut:'#7d4f30',rock:'#92897c',edge:'#a8996a',dust:[205,180,145],grip:.97,decor:['tree','tree','pine','bush','rock'],treeC:['#e0782e','#d9a23a','#c4512a','#e8b44a'],trunk:'#7a4c30'},
  desert:{name:'Desert',sky:'#f0dfc0',ground:['#e6c48a','#dcb87c','#ecce98'],verge:'#e0bd84',track:'#d9a066',rut:'#a8703f',rock:'#b98a5c',edge:'#cf9f6e',dust:[232,200,150],grip:.92,decor:['rock','rock','cactus','bush'],treeC:['#7d9a46','#6c8a3c'],trunk:'#7a5a3b'},
  alpine:{name:'Alpine',sky:'#cfe3f2',ground:['#f5f9fc','#e9f1f7','#ffffff'],verge:'#e3ecf3',track:'#d5e1eb',rut:'#a9bccb',rock:'#8f9aa3',edge:'#c9d6e0',dust:[250,252,255],grip:.86,decor:['pine','pine','pine','pine','chalet','rock'],treeC:['#2f6b52','#3a7a5e','#2a5e48'],trunk:'#6e4b33',snowy:true,alpine:true},
  jungle:{name:'Jungle',sky:'#c6d9cc',ground:['#3f9a4a','#358c40','#4aa654'],verge:'#47a04a',track:'#94603a',rut:'#5e3b22',rock:'#7d887a',edge:'#5a8a4a',dust:[160,128,96],grip:.9,decor:['palm','palm','tree','tree','bush','bush','rock'],treeC:['#2f7d3a','#3c8f3f','#256b31','#4aa045'],trunk:'#6b4a2e'},
  snow:{name:'Winter',sky:'#dbe4ea',ground:['#f3f7f9','#e7eef2','#fbfdfe'],verge:'#eef3f6',track:'#bfc8ce',rut:'#97a2aa',rock:'#a5afb6',edge:'#cbd4da',dust:[245,248,252],grip:.8,decor:['pine','pine','pine','rock'],treeC:['#3f7a5c','#4a8a68'],trunk:'#6e4b33',snowy:true}
};
const SHOP={
  body:[['b7','My Rally Car',0],['b11','Boxy Touring Coupe',120],['b8','Group B Compact',150],['b15','Midship Group B',200],['b9','Flat Mid-Engine Coupe',200],['b12','90s AWD Sedan',250],['b14','Wedge Mid-Engine',300],['b10','Modern Rally',300],['b13','Rally1 Crossover',350],['b16','AWD Rally Saloon',400],['b17','Modern Hatch WRC',450],['b18','Hill-Climb Special',500]],
  rim:[['r0','White',0],['r1','Black',40],['r4','Orange',70],['r3','Bronze',90],['r2','Gold',150]],
  paint:[['po','Model Original','#c9ced2',0],['p0','Rally White','#f1efe8',0],['p1','Signal Red','#d8352c',0],['p2','Petrol Blue','#2f6fd0',80],['p3','Mustard','#efb52c',80],['p7','Orange','#f26b1d',120],['p4','Forest Green','#2f8a4c',120],['p5','Violet','#7a4fd0',160],['p6','Matte Black','#2a2d30',200],['p8','Silver','#c3cbd1',260],['p9','Gold','#e0b13e',420]],
  liv:[['lv0','Stock stripes',0],['lv1','Clean',0],['lv2','Red & White',80],['lv3','Blue & Orange',80],['lv4','Black & Yellow',120],['lv5','Green & Lime',120],['lv6','Purple & Pink',160]],
  wing:[['w0','Stock',0],['w1','None',0],['w2','Ducktail',60],['w3','Big Wing',150],['w4','Twin Wing',220]],
  decal:[['n0','None',0],['n1','Number 7',40],['n2','Number 23',40],['n3','Number 88',60]],
  lights:[['h0','Stock',0],['h1','Yellow Tint',50],['h2','Light Pod',120],['h3','Roof Bar',150]],
  dust:[['d0','Natural',0],['d1','Orange Smoke',120],['d2','Blue Smoke',120],['d3','Rainbow',320]]
};
const CAT_NAMES={body:'Car',rim:'Wheels',paint:'Paint',liv:'Livery',wing:'Rear wing',decal:'Decals',lights:'Lights',dust:'Dust color'};
function paintHex(id){if(id==='po')return '#f1efe8';const p=SHOP.paint.find(x=>x[0]===id);return p?p[2]:'#f1efe8'}
function myStyle(){return {paintId:S.eq.paint,body:S.eq.body,rim:S.eq.rim,paint:paintHex(S.eq.paint),liv:S.eq.liv,wing:S.eq.wing,decal:S.eq.decal,lights:S.eq.lights}}
const TIER=['Finished','Bronze','Silver','Gold','Platinum'];
const TIERC=['#6b7378','#c07b3f','#aeb5ba','#e3ad25','#46b9c2'];
const STORY_REWARD=[10,30,65,125,215];
const DAILY_REWARD=[25,60,110,180,260];
function tierOf(t,m){return t<=m[0]?4:t<=m[1]?3:t<=m[2]?2:t<=m[3]?1:0}

/* ---------------- track generation ---------------- */
const SP=10;
function catmull(pts,al){
  const out=[],n=pts.length;
  for(let i=0;i<n-1;i++){
    const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(n-1,i+2)];
    const seg=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);const st=Math.max(4,Math.ceil(seg/6));
    if(al){const q0=i===0?[2*p1[0]-p2[0],2*p1[1]-p2[1]]:p0,q3=i+2>n-1?[2*p2[0]-p1[0],2*p2[1]-p1[1]]:p3;
      const dd=(a,b)=>Math.max(1e-3,Math.pow(Math.hypot(b[0]-a[0],b[1]-a[1]),al));const t0=0,t1=dd(q0,p1),t2=t1+dd(p1,p2),t3=t2+dd(p2,q3);
      for(let k=0;k<st;k++){const t=t1+(t2-t1)*k/st;const L=(a,b,ta,tb)=>{const u=(t-ta)/(tb-ta);return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]};
        const A1=L(q0,p1,t0,t1),A2=L(p1,p2,t1,t2),A3=L(p2,q3,t2,t3),B1=L(A1,A2,t0,t2),B2=L(A2,A3,t1,t3);out.push(L(B1,B2,t1,t2))}
      continue}
    for(let k=0;k<st;k++){const t=k/st,t2=t*t,t3=t2*t;
      out.push([
        .5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
        .5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}
  }
  out.push(pts[n-1].slice());return out;
}
function resample(d){
  const xs=[d[0][0]],ys=[d[0][1]];let acc=0;
  for(let i=1;i<d.length;i++){let px=d[i-1][0],py=d[i-1][1];const qx=d[i][0],qy=d[i][1];let seg=Math.hypot(qx-px,qy-py);
    while(seg>0&&acc+seg>=SP){const t=(SP-acc)/seg;px+=(qx-px)*t;py+=(qy-py)*t;xs.push(px);ys.push(py);seg=Math.hypot(qx-px,qy-py);acc=0}
    acc+=seg}
  if(acc>SP*.3){const L=d[d.length-1];xs.push(L[0]);ys.push(L[1])}
  return {xs,ys};
}
function overlaps(xs,ys,w){
  const N=xs.length,gap=Math.ceil(w*3/SP),lim=(w*1.2)*(w*1.2);
  for(let i=0;i<N;i+=2)for(let j=i+gap;j<N;j+=2){const dx=xs[i]-xs[j],dy=ys[i]-ys[j];if(dx*dx+dy*dy<lim)return true}
  return false;
}
function minRadOf(xs,ys){const N=xs.length,ang=new Float32Array(N);for(let i=0;i<N;i++){const a=Math.max(0,i-1),b=Math.min(N-1,i+1);ang[i]=Math.atan2(ys[b]-ys[a],xs[b]-xs[a])}let m=1e9;for(let i=4;i<N-4;i++){const d=Math.abs(angD(ang[i+4],ang[i-4]));if(d>1e-3)m=Math.min(m,80/d)}return m}
function genTrack(seed,o){
  const clear=Math.max(o.step*1.25,o.w*WF*1.45),c2=clear*clear;
  for(let att=0;att<(o._r?150:400);att++){
    const r=rng(seed*31+att*7919);
    let x=0,y=0,h=-1.5+(r()-.5)*1.6,hv=0;const pts=[[0,0]];let ok=true;
    for(let i=1;i<o.n;i++){
      let placed=false;
      for(let tr=0;tr<(i>2?10:1)&&!placed;tr++){
        let hv2=hv,h2;
        if(i>2){hv2=hv*.55+(r()*2-1)*o.turn*(1+tr*.08);if(r()<(o.hair||.07)*o.turn)hv2=(r()<.5?-1:1)*(1.3+r()*.5);hv2=clamp(hv2,-1.9,1.9)}
        h2=h+hv2;if(h2<-2.95){h2=-2.95;hv2=Math.abs(hv2)*.5}else if(h2>.45){h2=.45;hv2=-Math.abs(hv2)*.5}
        const L=Math.max(o.step*(.7+r()*.6),Math.abs(hv2)*210),nx=x+Math.cos(h2)*L,ny=y+Math.sin(h2)*L;
        let good=true;for(let j=0;j<pts.length-2;j++){const dx=pts[j][0]-nx,dy=pts[j][1]-ny;if(dx*dx+dy*dy<c2){good=false;break}}
        if(good){h=h2;hv=hv2;x=nx;y=ny;placed=true}}
      if(!placed){ok=false;break}
      pts.push([Math.round(x),Math.round(y)]);
    }
    if(!ok)continue;
    const s=resample(catmull(pts));
    if(overlaps(s.xs,s.ys,o.w*WF))continue;
    if(minRadOf(s.xs,s.ys)<Math.max(100,o.w*.9+12))continue;
    return {name:o.name,pts,w:o.w,biome:o.biome,seed};
  }
  if((o._r||0)<5)return genTrack(seed+101,Object.assign({},o,{turn:o.turn*.88,_r:(o._r||0)+1}));
  return {name:o.name,pts:[[0,0],[400,0],[800,200],[1200,0],[1600,200]],w:o.w,biome:o.biome,seed};
}
const STORY=[
  ['Blossom Ridge','spring',30,0.62,96],['Meadowlark Run','spring',36,0.7,94],['Petal Bend','spring',42,0.78,92],['Greenleaf Gorge','spring',48,0.85,90],['Thawwater Sprint','spring',56,0.92,88],
  ['Sunpeak Pass','forest',30,0.62,96],['Pinewood Sprint','forest',36,0.7,94],['Goldenhour Climb','forest',42,0.78,92],['Cicada Hollow','forest',48,0.85,90],['Heatwave Ridge','forest',56,0.92,88],
  ['Amber Hollow','autumn',30,0.62,96],['Rustleaf Descent','autumn',36,0.7,94],['Harvest Moon Run','autumn',42,0.78,92],['Copper Canopy','autumn',48,0.85,90],['Hazelnut Hairpins','autumn',56,0.92,88],
  ['Dune Rattler','desert',30,0.62,96],['Mirage Flats','desert',36,0.7,94],['Scorpion Gulch','desert',42,0.78,92],['Sandstorm Mesa','desert',48,0.85,90],['Cactus Crown','desert',56,0.92,88],
  ['Vinewood Rush','jungle',30,0.62,96],['Monsoon Trail','jungle',36,0.7,94],['Jaguar Switchback','jungle',42,0.78,92],['Canopy Chase','jungle',48,0.85,90],['Orchid Falls','jungle',56,0.92,88],
  ['Frostbite Climb','snow',30,0.62,96],['Glacier Line','snow',36,0.7,94],['Snowcap Sprint','snow',42,0.78,92],['Icicle Alley','snow',48,0.85,90],['Aurora Summit','snow',56,0.92,88],
  ['Powder Run','alpine',30,0.62,96],['Chairlift Chase','alpine',36,0.7,94],['Black Diamond','alpine',42,0.78,92],['Avalanche Gully','alpine',48,0.85,90],['Summit Express','alpine',56,0.92,88]
];
const SEASONS=['spring','forest','autumn','desert','jungle','snow','alpine'];
const storyCache={};
function storyDef(i){if(!storyCache[i]){const s=STORY[i];storyCache[i]=genTrack(1000+i*77,{n:s[2],turn:s[3],step:180+((i*53)%5)*18,hair:.1+((i*37)%4)*.05,w:s[4],biome:s[1],name:s[0]});storyCache[i].id='s'+i}return storyCache[i]}
const FD_LEN={s:[20,'Short · ~0.5 km'],m:[40,'Medium · ~1 km'],l:[70,'Long · ~1.8 km'],x:[105,'Marathon · ~2.7 km']};
const FD={len:'m',biome:'random'};
function freeDef(){const keys=Object.keys(BIOMES);const b=FD.biome==='random'?keys[Math.floor(Math.random()*keys.length)]:FD.biome;const seed=Math.floor(Math.random()*1e9);
  const d=genTrack(seed,{n:FD_LEN[FD.len][0],turn:.5,step:220,w:94,biome:b,name:'Free Drive'});d.id='free';return d}
function startFree(){const d=freeDef();startRace({def:d,kind:'free',title:'Free Drive · '+BIOMES[d.biome].name+' · '+FD_LEN[FD.len][1].split(' ·')[0],back:'free'})}
const DAILY_MODS=[{n:'Standard Stage',d:'Classic gravel road.',g:1,w:92,len:1},{n:'Slippery Road',d:'Icy patches mean less grip.',g:.72,w:96,len:1},{n:'Narrow Trail',d:'A tight road that needs a clean line.',g:1,w:74,len:1},{n:'Marathon Stage',d:'One and a half times longer.',g:1,w:90,len:1.5}];
let dailyCache=null;
function dailyInfo(){
  const ds=today();if(dailyCache&&dailyCache.ds===ds)return dailyCache;
  const seed=hashStr('porvihar-daily-'+ds);const r=rng(seed);
  const biome=['spring','forest','autumn','desert','jungle','snow','alpine'][Math.floor(r()*7)];const mod=DAILY_MODS[Math.floor(r()*4)];
  const def=genTrack(seed,{n:Math.round(40*mod.len),turn:.55,step:220,w:mod.w,biome,name:'Daily Stage'});def.id='d-'+ds;
  dailyCache={ds,def,mod,T:null};return dailyCache;
}
function mpRandomDef(seed,len){const r=rng(seed);const biome=['spring','forest','autumn','desert','jungle','snow','alpine'][Math.floor(r()*7)];const d=genTrack(seed,{n:len||(30+Math.floor(r()*12)),turn:.45+r()*.25,step:220,w:94,biome,name:'Hidden Stage'});d.id='mp-'+seed;return d}

/* ---------------- build track (logic) ---------------- */
const CELL=100;const WF=2.2;
function buildTrack(def,gripMul){
  const B=BIOMES[def.biome]||BIOMES.forest;const w=(def.w||90)*WF;
  const {xs,ys}=resample(catmull(def.pts,def.seed!=null?0:.5));const N=xs.length;
  {const ax=Float64Array.from(xs),ay=Float64Array.from(ys);for(let it=0;it<6;it++){for(let i=3;i<N-3;i++){ax[i]=xs[i]*.5+(xs[i-1]+xs[i+1])*.25;ay[i]=ys[i]*.5+(ys[i-1]+ys[i+1])*.25}for(let i=3;i<N-3;i++){xs[i]=ax[i];ys[i]=ay[i]}}}
  const tx=new Float32Array(N),ty=new Float32Array(N),ang=new Float32Array(N),rad=new Float32Array(N),tdir=new Int8Array(N),cum=new Float32Array(N);
  for(let i=0;i<N;i++){const a=Math.max(0,i-1),b=Math.min(N-1,i+1);let dx=xs[b]-xs[a],dy=ys[b]-ys[a];const l=Math.hypot(dx,dy)||1;tx[i]=dx/l;ty[i]=dy/l;ang[i]=Math.atan2(dy,dx);if(i)cum[i]=cum[i-1]+Math.hypot(xs[i]-xs[i-1],ys[i]-ys[i-1])}
  for(let i=0;i<N;i++){const a=Math.max(0,i-4),b=Math.min(N-1,i+4);const d=angD(ang[b],ang[a]);const arc=(b-a)*SP;rad[i]=Math.abs(d)<1e-3?1e5:arc/Math.abs(d);tdir[i]=d>0?1:-1}
  const sg=new Map();const key=(cx,cy)=>cx+','+cy;
  for(let i=0;i<N;i++){const k=key(Math.floor(xs[i]/CELL),Math.floor(ys[i]/CELL));let a=sg.get(k);if(!a)sg.set(k,a=[]);a.push(i)}
  const distR=(x,y,R)=>{const cx=Math.floor(x/CELL),cy=Math.floor(y/CELL);let best=1e12;for(let ix=-R;ix<=R;ix++)for(let iy=-R;iy<=R;iy++){const a=sg.get(key(cx+ix,cy+iy));if(!a)continue;for(const i of a){const dx=xs[i]-x,dy=ys[i]-y,d=dx*dx+dy*dy;if(d<best)best=d}}return Math.min(Math.sqrt(best),R*CELL+60)};
  const tdist=(x,y)=>distR(x,y,1);
  const farDist=(x,y)=>distR(x,y,6);
  const notes=[];let i=0;
  while(i<N){if(rad[i]<380){const dir=tdir[i];let j=i,minR=rad[i],apex=i,tot=0;while(j<N-1&&rad[j]<380&&tdir[j]===dir){if(rad[j]<minR){minR=rad[j];apex=j}tot+=Math.abs(angD(ang[j+1],ang[j]));j++}
      if(tot>.45){const g=minR<55?1:minR<85?2:minR<125?3:minR<180?4:minR<260?5:6;notes.push({i,e:j,apex,dir,g,hair:g<=2&&tot>2.3})}i=j+1}else i++}
  const hseed=(def.seed||hashStr(JSON.stringify(def.pts)))%100000;
  const r=rng(hseed+99);const decor=[];const dg=new Map();
  const addD=o=>{if(o.col&&tdist(o.x,o.y)<w/2+4)return;decor.push(o);if(o.col){const k=key(Math.floor(o.x/CELL),Math.floor(o.y/CELL));let a=dg.get(k);if(!a)dg.set(k,a=[]);a.push(o)}};
  for(let k=0;k<N;k+=3){for(const side of [-1,1]){if(r()>.72)continue;const off=w/2+30+r()*r()*420;const nx=-ty[k]*side,ny=tx[k]*side;
      const x=xs[k]+nx*off+(r()-.5)*30,y=ys[k]+ny*off+(r()-.5)*30;if(tdist(x,y)<w/2+28)continue;
      const tp=B.decor[Math.floor(r()*B.decor.length)];
      const o={x,y,t:tp,c:B.treeC[Math.floor(r()*B.treeC.length)],s:r()};
      if(tp==='tree'){o.r=11+r()*6;o.col=1}else if(tp==='palm'){o.r=7;o.col=1}else if(tp==='chalet'){o.r=17;o.col=1}else if(tp==='pine'){o.r=9+r()*5;o.col=1}else if(tp==='rock'){o.r=7+r()*9;o.col=1}else if(tp==='cactus'){o.r=6;o.col=1}else{o.r=7+r()*6}
      addD(o)}}
  for(const n of notes){if(n.g>3)continue;const side=n.dir>0?-1:1;for(const d of [-8,-3,2,7]){const k=clamp(n.apex+d,0,N-1);const off=w/2+16;addD({x:xs[k]-ty[k]*side*off,y:ys[k]+tx[k]*side*off,a:ang[k],t:'bale',r:9,col:1})}}
  const fences=[],poles=[];const r3=rng(hseed+51);
  for(const side of [-1,1]){let prev=null;const off=w/2+30;
    for(let k=12;k<N-14;k+=4){const want=!(k>70&&k<N-70)&&vnoise(k/22,side*5.3,hseed)>=.4;let mn=1e9;for(let j=Math.max(0,k-6);j<=Math.min(N-1,k+6);j++)mn=Math.min(mn,rad[j]);
      const inner=(tdir[k]>0)===(side>0)&&mn<off+60;if(!want||inner){prev=null;continue}
      const px=xs[k]-ty[k]*side*off,py=ys[k]+tx[k]*side*off;if(tdist(px,py)<w/2+10){prev=null;continue}
      if(prev){const L=Math.hypot(px-prev.x,py-prev.y);if(L>2&&L<80&&tdist((px+prev.x)/2,(py+prev.y)/2)>=w/2+10){fences.push({ax:prev.x,ay:prev.y,bx:px,by:py,k});
          const n=Math.ceil(L/6);for(let q=0;q<n;q++){const f=q/n;addD({x:prev.x+(px-prev.x)*f,y:prev.y+(py-prev.y)*f,r:3,col:1,t:'fence'})}}else{prev=null}}
      if(!prev||true)prev={x:px,y:py}}}
  for(let k=8;k<N-8;k+=7)for(const side of [-1,1]){if(r3()<.3)continue;const off=w/2+16;const o={x:xs[k]-ty[k]*side*off,y:ys[k]+tx[k]*side*off,tl:(r3()-.5)*.15,r:1.8,col:1,t:'pole'};if(tdist(o.x,o.y)<w/2+4)continue;poles.push(o);addD(o)}
  for(const i of [6,N-7])for(const side of [-1,1]){const off=w/2+14;addD({x:xs[i]-ty[i]*side*off,y:ys[i]+tx[i]*side*off,r:8,col:1,t:'leg'})}
  const v=new Float32Array(N);for(let k=0;k<N;k++){const R=rad[k];v[k]=Math.min(545,3.5*R/(1+.001875*R))}
  v[0]=0;for(let k=1;k<N;k++)v[k]=Math.min(v[k],Math.sqrt(v[k-1]*v[k-1]+2*420*SP));
  for(let k=N-2;k>=0;k--)v[k]=Math.min(v[k],Math.sqrt(v[k+1]*v[k+1]+2*700*SP));
  let est=0;for(let k=3;k<N-7;k++)est+=SP/Math.max(30,v[k]);
  const grip=B.grip*(gripMul||1);est*=1+(1-grip)*.7;
  const medals=[1.03,1.13,1.28,1.5].map(f=>Math.round(est*f*10)/10);
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;for(let k=0;k<N;k++){minx=Math.min(minx,xs[k]);maxx=Math.max(maxx,xs[k]);miny=Math.min(miny,ys[k]);maxy=Math.max(maxy,ys[k])}
  const mm=document.createElement('canvas');mm.width=mm.height=240;const mg=mm.getContext('2d');
  const sc=200/Math.max(maxx-minx,maxy-miny,1);const ox=(240-(maxx-minx)*sc)/2,oy=(240-(maxy-miny)*sc)/2;
  mg.lineJoin=mg.lineCap='round';mg.beginPath();for(let k=0;k<N;k++){const X=ox+(xs[k]-minx)*sc,Y=oy+(ys[k]-miny)*sc;k?mg.lineTo(X,Y):mg.moveTo(X,Y)}
  mg.strokeStyle='rgba(35,40,44,.85)';mg.lineWidth=13;mg.stroke();mg.strokeStyle='#ffffff';mg.lineWidth=6;mg.stroke();
  const T={def,B,w,fences,poles,xs,ys,tx,ty,ang,rad,tdir,cum,N,notes,decor,dg,medals,est,grip,len:cum[N-1],bounds:{minx,miny,maxx,maxy},mm,mmS:sc,mmO:[ox,oy],key,farDist,hseed};
  const BASE=0,ry=new Float32Array(N).fill(BASE);{const fr=rng(hseed+5);let k=30;
    while(k<N-40){let ok=true;for(let j=Math.max(0,k-16);j<Math.min(N,k+40);j++)if(rad[j]<520){ok=false;break}if(!ok){k+=3;continue}
      const q=fr();let L,A,ft,jump=false;if(q<.4){ft='JUMP';L=7+Math.floor(fr()*3);A=9+fr()*3;jump=true}else if(q<.72){ft='CREST';L=9+Math.floor(fr()*4);A=5+fr()*2.5}else{ft='DIP';L=9+Math.floor(fr()*4);A=-(BASE-.6)}
      for(let j=0;j<=L;j++){const u=j/L;let v;if(jump)v=u<.75?.5*(1-Math.cos(Math.PI*u/.75)):.5*(1+Math.cos(Math.PI*(u-.75)/.25));else v=.5*(1-Math.cos(2*Math.PI*u));ry[k+j]+=A*v}
      notes.push({i:k-2,e:k+L,ft,dir:0,g:0});k+=L+65+Math.floor(fr()*60)}
    notes.sort((a,b)=>a.i-b.i)}
  const bridge=new Uint8Array(N),bspan=[];{const gap=Math.ceil(w*3/SP),mark=new Uint8Array(N);
    for(let j=0;j<N;j++){const cx=Math.floor(xs[j]/CELL),cy=Math.floor(ys[j]/CELL);let hit=false;
      for(let ix=-3;ix<=3&&!hit;ix++)for(let iy=-3;iy<=3&&!hit;iy++){const a=sg.get(key(cx+ix,cy+iy));if(!a)continue;for(const i of a){if(i<j-gap){const dx=xs[i]-xs[j],dy=ys[i]-ys[j];if(dx*dx+dy*dy<w*w*1.1){hit=true;break}}}}
      mark[j]=hit?1:0}
    let j=0;while(j<N){if(!mark[j]){j++;continue}let e=j;while(e<N-1&&mark[e+1])e++;
      const s0=Math.max(0,j-26),e0=Math.min(N-1,e+26),H=24;
      for(let k=s0;k<=e0;k++){let v=k<j-2?(k-s0)/Math.max(1,j-2-s0):k>e+2?(e0-k)/Math.max(1,e0-e-2):1;v=Math.max(0,Math.min(1,v));v=v*v*(3-2*v);ry[k]=Math.max(ry[k],H*v);bridge[k]=1}
      bspan.push([s0,e0,j,e]);notes.push({i:s0,e:e0,ft:'BRIDGE',dir:0,g:0});j=e0+1}
    notes.sort((a,b)=>a.i-b.i)}
  T.bridge=bridge;T.bspan=bspan;
  T.ry=ry;T.base=BASE;const SK=22;
  const gridNear=(x,y)=>{const cx=Math.floor(x/CELL),cy=Math.floor(y/CELL);let best=1e12,bi=0;for(let ix=-1;ix<=1;ix++)for(let iy=-1;iy<=1;iy++){const a=sg.get(key(cx+ix,cy+iy));if(!a)continue;for(const i of a){const dx=xs[i]-x,dy=ys[i]-y,d=dx*dx+dy*dy;if(d<best){best=d;bi=i}}}return {i:bi,d:Math.sqrt(best)}};
  T.surfAt=(x,y,hint)=>{const n=hint!=null?trackNear(T,x,y,hint):gridNear(x,y);const g=T.gh?T.gh(x,y):heightAt(x,y,farDist(x,y),hseed);
    if(n.d>=w/2+SK)return g;const i0=n.i,u=((x-xs[i0])*tx[i0]+(y-ys[i0])*ty[i0])/SP;let r=ry[i0];if(u>0&&i0<N-1)r+=(ry[i0+1]-r)*Math.min(1,u);else if(u<0&&i0>0)r+=(ry[i0-1]-r)*Math.min(1,-u);if(n.d<=w/2)return r;if(T.bridge&&T.bridge[i0]&&r>4)return g;const t=(n.d-w/2)/SK;return r+(g-r)*t*t*(3-2*t)};
  let ai=aiTime(T);if(ai<0)ai=T.medals[1]*1.15;T.ai=ai;T.medals=[.92,1,1.12,1.3].map(f=>Math.round(ai*f*10)/10);
  return T;
}
function aiTime(T){let best=-1;
  for(const look of [8,10,12]){const c={x:T.xs[3],y:T.ys[3],a:T.ang[3],vx:0,vy:0,av:0,idx:3,vf:0,vr:0,surf:0,ai:true};let t=0,ok=false,mi=3,mt=0;
    while(t<300&&(best<0||t<best)){if(c.idx>mi){mi=c.idx;mt=t}else if(t-mt>15)break;const L=Math.min(T.N-1,c.idx+look);const err=angD(Math.atan2(T.ys[L]-c.y,T.xs[L]-c.x),c.a);
      let vt=560;for(let k=c.idx,e=Math.min(T.N,c.idx+40);k<e;k++){const v=Math.sqrt(900*T.rad[k])+(k-c.idx)*SP*.9;if(v<vt)vt=v}
      stepCar(c,{up:c.vf<vt,down:c.vf>vt+40,hb:false,steer:clamp(err*3-c.av*.25,-1,1)},STEP,T);t+=STEP;if(c.idx>=T.N-7){ok=true;break}}
    if(ok&&(best<0||t<best))best=t}
  return best}
function trackNear(T,x,y,h){let best=1e12,bi=h;const a=Math.max(0,h-25),b=Math.min(T.N-1,h+45);for(let i=a;i<=b;i++){const dx=T.xs[i]-x,dy=T.ys[i]-y,d=dx*dx+dy*dy;if(d<best){best=d;bi=i}}return {i:bi,d:Math.sqrt(best)}}

/* ---------------- 3D helpers ---------------- */
const dummy=new THREE.Object3D(),tmpC=new THREE.Color();
const wmat=(c,extra)=>new THREE.MeshLambertMaterial(Object.assign({color:c},extra||{}));
const phong=(c,extra)=>new THREE.MeshPhongMaterial(Object.assign({color:c,flatShading:true,shininess:0,specular:0x000000},extra||{}));
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
function dirtTex(B){return canvasTex(128,512,(g,w,h)=>{g.fillStyle=B.track;g.fillRect(0,0,w,h);const r=rng(5);const tc=new THREE.Color(B.track);
  for(let i=0;i<70;i++){const c=tc.clone().multiplyScalar(r()<.5?1.04+r()*.04:.95-r()*.04);g.fillStyle=c.getStyle();g.globalAlpha=.35;g.beginPath();g.ellipse(10+r()*(w-20),r()*h,10+r()*18,18+r()*40,0,0,7);g.fill()}g.globalAlpha=1;
  const rut=(x0,amp,ph,wd,al)=>{g.strokeStyle=B.rut;g.lineCap='round';for(const [lw,a2] of [[wd*2.2,al*.25],[wd,al]]){g.globalAlpha=a2;g.lineWidth=lw;g.beginPath();for(let y=0;y<=h;y+=8){const x=w*x0+Math.sin(y/h*Math.PI*2*2+ph)*amp+Math.sin(y/h*Math.PI*2*3+ph*1.7)*amp*.2;y?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}g.globalAlpha=1};
  rut(.2,.7,0,6.5,.8);rut(.37,.7,0,6.5,.8);rut(.63,.6,1.3,6.5,.8);rut(.8,.6,1.3,6.5,.8);
  for(let i=0;i<260;i++){const y=r()*h,x=r()*w;g.fillStyle=r()<.5?'rgba(255,255,255,.55)':'rgba(60,50,40,.35)';const z=1+r()*1.6;g.fillRect(x,y,z,z)}
  for(let i=0;i<10;i++){const y=r()*h,x=w*(.2+r()*.6);const gr=g.createRadialGradient(x,y,1,x,y,9);gr.addColorStop(0,'rgba(60,55,50,.35)');gr.addColorStop(1,'rgba(60,55,50,0)');g.fillStyle=gr;g.fillRect(x-10,y-10,20,20)}
  const lg=new THREE.Color(B.verge).lerp(new THREE.Color('#ffffff'),.12).getStyle(),dg=new THREE.Color(B.verge).multiplyScalar(.9).getStyle();
  for(const [col,sz,n] of [[dg,1.15,70],[B.verge,1,110],[lg,.6,40]])for(let i=0;i<n;i++){const rr=rng(77+i*3+(sz*10|0));const L=rr()<.5;const dx=rr()*rr()*12;g.fillStyle=col;g.beginPath();g.ellipse(L?dx:w-dx,rr()*h,(3+rr()*6)*sz,(4+rr()*8)*sz,0,0,7);g.fill()}
  g.fillStyle=B.verge;g.fillRect(0,0,3,h);g.fillRect(w-3,0,3,h)})}
const blobTex=canvasTex(64,64,(g)=>{const gr=g.createRadialGradient(32,32,2,32,32,31);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
const NUMTEX=canvasTex(64,64,(g)=>{g.fillStyle='#fff';g.beginPath();g.arc(32,32,30,0,7);g.fill();g.fillStyle='#111';g.font='bold 34px Impact, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('7',32,34)});
const CHKTEX=canvasTex(64,64,(g)=>{for(let x=0;x<8;x++)for(let y=0;y<8;y++){g.fillStyle=(x+y)%2?'#111':'#fff';g.fillRect(x*8,y*8,8,8)}});
const SHARED=new Set([blobTex,NUMTEX,CHKTEX]);
function asphaltTex(fade){return canvasTex(64,fade?128:256,(g,w,h)=>{g.fillStyle='#5a5d61';g.fillRect(0,0,w,h);const r=rng(17);
  for(let i=0;i<w*h/7;i++){const v=70+Math.floor(r()*50);g.fillStyle=`rgba(${v},${v+2},${v+5},.55)`;g.fillRect(r()*w,r()*h,1+r()*1.5,1+r()*1.5)}
  g.fillStyle='rgba(245,245,240,.9)';g.fillRect(3,0,3,h);g.fillRect(w-6,0,3,h);if(!fade)for(let y=0;y<h;y+=64)g.fillRect(w/2-1,y,2,30);
  if(fade){g.globalCompositeOperation='destination-in';const gr=g.createLinearGradient(0,h,0,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle=gr;g.fillRect(0,0,w,h)}})}
function pillarTex(bg,checker){return canvasTex(32,128,(g,w,h)=>{for(let i=0;i<16;i++)for(let j=0;j<2;j++){g.fillStyle=checker?((i+j)%2?'#15171a':'#f4f4f0'):(i%2?bg:'#f4f1ea');g.fillRect(j*16,i*8,16,8)}
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,3,h);g.fillRect(w-3,0,3,h)})}
function bannerTex(text,bg){return canvasTex(512,64,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);
  for(const x0 of [0,w-64])for(let i=0;i<8;i++)for(let j=0;j<2;j++){g.fillStyle=(i+j)%2?'#111':'#fff';g.fillRect(x0+i*8,j*32,8,32)}
  g.fillStyle='#fff';g.font='bold 40px "Lilita One", Impact, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+2)})}
function lights(scene,sky,near,far){scene.add(new THREE.HemisphereLight(0xffffff,0x6a6a58,.78));const d=new THREE.DirectionalLight(0xfff3df,.62);d.position.set(420,600,-260);scene.add(d);scene.background=new THREE.Color(sky);scene.fog=new THREE.Fog(sky,near||900,far||4200)}
function disposeTree(o){o.traverse(n=>{if(n.geometry&&!n.geometry.userData.shared)n.geometry.dispose();if(n.material){const ms=Array.isArray(n.material)?n.material:[n.material];for(const m of ms){if(m.map&&!SHARED.has(m.map))m.map.dispose();m.dispose()}}})}

/* ---------------- 3D car ---------------- */
const CARS={
  b5:{L:36,W:18.4,r:4,fx:11.4,rx:-11.2,lift:0,ar:2.6,lightY:7.4,wing:[-10.6,17.6],
    top:[[18,2.4],[18.6,6],[17.8,8.4],[16,10.4],[6,11],[-12,11.4],[-17.2,11.4],[-18,8],[-17.6,2.4]],cabin:[[5,10.8],[0,15.6],[-10,15.8],[-14,11.2]]},
  b0:{L:37,W:17,r:4,fx:11.6,rx:-11.2,lift:0,ar:1.8,lightY:7.6,wing:[-11.8,17.8],
    top:[[18.4,2.4],[18.9,6.4],[18,9],[16,10.6],[7,11],[-14,11.2],[-18,10.8],[-18.6,6],[-18.2,2.4]],cabin:[[6.4,10.8],[1,15.8],[-11.4,16],[-16.2,11]]},
  b6:{L:40,W:17.4,r:4,fx:12.6,rx:-12.4,lift:0,ar:1.2,lightY:7.4,wing:[-17.4,12.4],
    top:[[19.6,2.4],[20.2,6.2],[19.2,8.6],[17,10.2],[8.5,10.6],[-13,10.8],[-19.4,11],[-20,6.2],[-19.4,2.4]],cabin:[[6.6,10.5],[1.2,15.2],[-8.8,15.4],[-14,10.8]]},
  b1:{L:38,W:16.8,r:3.8,fx:12,rx:-11.6,lift:0,ar:1.2,lightY:6.4,wing:[-16.4,12.4],
    top:[[19,2.2],[19.6,5.4],[18,7.4],[14,10],[8,10.4],[-12,10.8],[-18.5,11.2],[-19,6],[-18.5,2.2]],cabin:[[4,10.2],[-2.6,14.2],[-9.6,14.4],[-16.6,11.2]]},
  b2:{L:37,W:17.8,r:4.2,fx:11.8,rx:-11.4,lift:0,ar:2.4,lightY:7.6,wing:[-10.6,18.6],
    top:[[18,2.6],[18.8,6],[18,8.6],[15.6,11],[8,11.6],[-13,12],[-17.6,11.6],[-18.2,6],[-17.4,2.6]],cabin:[[7.4,11.4],[0.2,16.4],[-10,16.8],[-15.6,11.8]]},
  b3:{L:39,W:18.6,r:5.6,fx:11.6,rx:-11.4,lift:2.6,ar:2,lightY:9,wing:[-15,19.4],
    top:[[19,2.8],[19.6,8.6],[18,11],[15,12.2],[7,12.6],[-17.4,13],[-19.2,11.8],[-19.2,2.8]],cabin:[[5,12.6],[1.2,17.4],[-15.2,17.6],[-17.4,13]]},
  b4:{L:29,W:15.6,r:3.4,fx:8.8,rx:-9,lift:0,ar:1,lightY:7.2,wing:[-10.4,15.8],
    top:[[14,2.2],[14.6,6.6],[13.4,8.8],[11,9.6],[-12.8,10],[-14.2,8.4],[-14.2,2.2]],cabin:[[9,9.4],[6.6,14.2],[-10.2,14.4],[-12.6,10]]}
};
function bodyShape(C){const top=C.top,R=C.r+1.5,ay=C.r-C.lift,y0=top[0][1];const sh=new THREE.Shape();
  sh.moveTo(top[0][0],top[0][1]);
  for(const wx of [C.fx,C.rx]){sh.lineTo(wx+R,y0);sh.lineTo(wx+R,ay);sh.absarc(wx,ay,R,0,Math.PI,false);sh.lineTo(wx-R,y0)}
  const last=top[top.length-1];sh.lineTo(last[0],last[1]);for(let i=top.length-2;i>=1;i--)sh.lineTo(top[i][0],top[i][1]);sh.closePath();return sh}
function contourX(top,y,fromFront){const n=top.length;if(fromFront){for(let i=0;i<n-1;i++){const a=top[i],b=top[i+1];if((a[1]-y)*(b[1]-y)<=0&&a[1]!==b[1])return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1])}return top[0][0]}
  for(let i=n-1;i>0;i--){const a=top[i],b=top[i-1];if((a[1]-y)*(b[1]-y)<=0&&a[1]!==b[1])return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1])}return top[n-1][0]}
const RIMS={r0:'#e7e7e2',r1:'#26292b',r2:'#d9b13f',r3:'#a8723f',r4:'#f26b1d'};
function liveryTex(C,paint,sec,liv){
  const L=C.L,span=L+6,X=x=>(x+L/2+3)/span*512,Y=y=>(1-y/22)*128;
  const t=canvasTex(512,128,(g)=>{g.fillStyle=paint;g.fillRect(0,0,512,128);
    if(liv==='l1'){g.fillStyle=sec;g.fillRect(0,Y(8.4),512,Y(7.4)-Y(8.4));g.fillRect(0,Y(9.8),512,Y(8.9)-Y(9.8))}
    if(liv==='l3'){g.fillStyle=sec;g.fillRect(0,Y(6.2),512,128)}
    if(liv==='l4'){const s=(Y(4)-Y(6.4))/2;for(let i=0;i*s<512;i++)for(let j=0;j<2;j++){g.fillStyle=(i+j)%2?'#111':'#fff';g.fillRect(i*s,Y(6.4)+j*s,s,s)}}
    if(liv==='l5'){g.fillStyle='#f2b51c';g.beginPath();g.moveTo(X(-L/2-2),Y(4));g.lineTo(X(L/2+2),Y(9.4));g.lineTo(X(L/2+2),Y(7.6));g.lineTo(X(-L/2-2),Y(2.6));g.closePath();g.fill()}
    if(liv==='l2'){const cx=X(-1.5),cy=Y(6.4),r=(Y(3)-Y(6.6));g.fillStyle='#fff';g.beginPath();g.arc(cx,cy,r,0,7);g.fill();g.fillStyle='#111';g.font=`bold ${Math.round(r*1.4)}px Impact, sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText('7',cx,cy+2)}
  });
  t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.repeat.set(1/span,1/22);t.offset.set((L/2+3)/span,0);return t;
}
function extr(pts,depth,bev,mat){const sh=new THREE.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));sh.closePath();
  const geo=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:3,curveSegments:10});geo.translate(0,0,-depth/2);return new THREE.Mesh(geo,mat)}
const MODEL_FILES={b7:'my-rally-car',b11:'boxy-touring-coupe',b8:'group-b-compact',b15:'midship-group-b',b9:'flat-mid-engine-coupe',b12:'90s-awd-sedan',b14:'wedge-mid-engine',b10:'modern-rally',b13:'rally1-crossover',b16:'awd-rally-saloon',b17:'modern-hatch-wrc',b18:'hill-climb-special'};
const MODELS={};for(const k in MODEL_FILES)MODELS[k]={};
function loadModel(id){const md=MODELS[id];if(!md)return Promise.resolve(null);if(md.tpl)return Promise.resolve(md);if(md.p)return md.p;
  md.p=fetch('models/'+MODEL_FILES[id]+'.glb').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.arrayBuffer()}).catch(()=>fetch('models/'+MODEL_FILES[id]+'.b64.txt').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(t=>{const bin=atob(t.trim()),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer})).then(buf=>new Promise((res,rej)=>new THREE.GLTFLoader().parse(buf,'',g=>{g.scene.traverse(n=>{if(n.geometry)n.geometry.userData.shared=true});prepModel(id,g.scene);res(md);onModelReady(id)},rej)))
    .catch(e=>{console.error('[DustRush] car model',id,e);md.p=null;return null});return md.p}
function onModelReady(id){if(SR.car&&showStyle().body===id)setShowCar();
  if(mode==='race'&&W&&R){if(W.car&&myStyle().body===id){const p=W.car.position.clone(),r=W.car.rotation.clone();W.scene.remove(W.car);disposeTree(W.car);W.car=makeCar(myStyle(),false);W.scene.add(W.car)}
    if(W.ghost&&myStyle().body===id){W.scene.remove(W.ghost);disposeTree(W.ghost);W.ghost=makeCar(myStyle(),true);W.scene.add(W.ghost)}
    for(const d of W.peers.values())d.sk=''}}
const DW=['Paint_Base','Black_Trim','Paint_Accent1'];
const WINGREG={b7:[-1.72,.88,['Paint_White','Paint_Red','Black_Trim']],b8:[-1.62,.915,DW],b9:[-1.75,.875,DW],b10:[-1.68,.895,DW],b12:[-1.73,.855,DW],b13:[-1.63,.995,DW],b14:[-1.64,.935,DW],b15:[-1.79,.805,DW],b16:[-1.66,1.02,DW.concat(['Paint_Roof','Paint_Accent2'])]};
const LIVS={lv2:['#d8352c','#f4f1ea'],lv3:['#2f6fd0','#f26b1d'],lv4:['#1d1f22','#f2c230'],lv5:['#2f8a4c','#a6e22e'],lv6:['#7a4fd0','#ff6fb5']};
const ROLE={Paint:'base',Paint_Base:'base',Accent1:'acc1',Accent2:'acc2',Paint_Accent1:'acc1',Paint_Accent2:'acc2',Paint_Roof:'roof'};
const numTexCache={};
function numTex(n){if(!numTexCache[n]){numTexCache[n]=canvasTex(128,128,g=>{g.fillStyle='#fff';g.beginPath();g.arc(64,64,60,0,7);g.fill();g.lineWidth=6;g.strokeStyle='#111';g.stroke();g.fillStyle='#111';g.font='bold 68px Impact, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(n,64,70)});SHARED.add(numTexCache[n])}return numTexCache[n]}
function loopSmooth(pos,levels,creaseDeg,lam){
  // weld
  const map=new Map(),V=[],F=[];const q=x=>Math.round(x*1e4);
  for(let i=0;i<pos.length;i+=3){const k=q(pos[i])+','+q(pos[i+1])+','+q(pos[i+2]);let id=map.get(k);if(id==null){id=V.length/3;V.push(pos[i],pos[i+1],pos[i+2]);map.set(k,id)}F.push(id)}
  let P=Float64Array.from(V),T=F.slice();const cc=Math.cos(creaseDeg*Math.PI/180);
  for(let L=0;L<levels;L++){const nv=P.length/3,nf=T.length/3;
    const fn=new Float64Array(nf*3);for(let f=0;f<nf;f++){const a=T[f*3],b=T[f*3+1],c=T[f*3+2];const ux=P[b*3]-P[a*3],uy=P[b*3+1]-P[a*3+1],uz=P[b*3+2]-P[a*3+2],vx=P[c*3]-P[a*3],vy=P[c*3+1]-P[a*3+1],vz=P[c*3+2]-P[a*3+2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;fn[f*3]=nx/l;fn[f*3+1]=ny/l;fn[f*3+2]=nz/l}
    const E=new Map();const ek=(a,b)=>a<b?a*nv+b:b*nv+a;
    for(let f=0;f<nf;f++)for(let e=0;e<3;e++){const a=T[f*3+e],b=T[f*3+(e+1)%3],c=T[f*3+(e+2)%3];const k=ek(a,b);let o=E.get(k);if(!o){o={a,b,f:[],opp:[]};E.set(k,o)}o.f.push(f);o.opp.push(c)}
    const sharp=new Map();for(const [k,o] of E){let s=o.f.length!==2;if(!s){const f1=o.f[0],f2=o.f[1];const d=fn[f1*3]*fn[f2*3]+fn[f1*3+1]*fn[f2*3+1]+fn[f1*3+2]*fn[f2*3+2];if(d<cc)s=true}sharp.set(k,s)}
    const nb=Array.from({length:nv},()=>[]),sn=Array.from({length:nv},()=>[]);
    for(const [k,o] of E){nb[o.a].push(o.b);nb[o.b].push(o.a);if(sharp.get(k)){sn[o.a].push(o.b);sn[o.b].push(o.a)}}
    const NP=[];
    for(let v=0;v<nv;v++){const x=P[v*3],y=P[v*3+1],z=P[v*3+2];let r;
      if(sn[v].length>2)r=[x,y,z];
      else if(sn[v].length===2){const a=sn[v][0],b=sn[v][1];r=[.75*x+.125*(P[a*3]+P[b*3]),.75*y+.125*(P[a*3+1]+P[b*3+1]),.75*z+.125*(P[a*3+2]+P[b*3+2])]}
      else{const n=nb[v].length;const be=n>3?3/(8*n):3/16;let sx=0,sy=0,sz=0;for(const u of nb[v]){sx+=P[u*3];sy+=P[u*3+1];sz+=P[u*3+2]}r=[(1-n*be)*x+be*sx,(1-n*be)*y+be*sy,(1-n*be)*z+be*sz]}
      NP.push(x+(r[0]-x)*lam,y+(r[1]-y)*lam,z+(r[2]-z)*lam)}
    const eid=new Map();
    for(const [k,o] of E){const a=o.a,b=o.b;const mx=(P[a*3]+P[b*3])/2,my=(P[a*3+1]+P[b*3+1])/2,mz=(P[a*3+2]+P[b*3+2])/2;let r=[mx,my,mz];
      if(!sharp.get(k)&&o.opp.length===2){const c=o.opp[0],d=o.opp[1];r=[.375*(P[a*3]+P[b*3])+.125*(P[c*3]+P[d*3]),.375*(P[a*3+1]+P[b*3+1])+.125*(P[c*3+1]+P[d*3+1]),.375*(P[a*3+2]+P[b*3+2])+.125*(P[c*3+2]+P[d*3+2])]}
      eid.set(k,NP.length/3);NP.push(mx+(r[0]-mx)*lam,my+(r[1]-my)*lam,mz+(r[2]-mz)*lam)}
    const NT=[];for(let f=0;f<nf;f++){const a=T[f*3],b=T[f*3+1],c=T[f*3+2];const ab=eid.get(ek(a,b)),bc=eid.get(ek(b,c)),ca=eid.get(ek(c,a));NT.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca)}
    P=Float64Array.from(NP);T=NT}
  return {pos:Float32Array.from(P),idx:T};
}


function creaseGeo(pos,idx,deg){const nf=idx.length/3,fn=new Float32Array(nf*3),inc=Array.from({length:pos.length/3},()=>[]);
  for(let f=0;f<nf;f++){const a=idx[f*3],b=idx[f*3+1],c=idx[f*3+2];const ux=pos[b*3]-pos[a*3],uy=pos[b*3+1]-pos[a*3+1],uz=pos[b*3+2]-pos[a*3+2],vx=pos[c*3]-pos[a*3],vy=pos[c*3+1]-pos[a*3+1],vz=pos[c*3+2]-pos[a*3+2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;fn[f*3]=nx/l;fn[f*3+1]=ny/l;fn[f*3+2]=nz/l;inc[a].push(f);inc[b].push(f);inc[c].push(f)}
  const cc=Math.cos(deg*Math.PI/180),P=new Float32Array(nf*9),N=new Float32Array(nf*9);
  for(let f=0;f<nf;f++)for(let q=0;q<3;q++){const v=idx[f*3+q];let x=0,y=0,z=0;for(const g of inc[v]){if(fn[g*3]*fn[f*3]+fn[g*3+1]*fn[f*3+1]+fn[g*3+2]*fn[f*3+2]>=cc){x+=fn[g*3];y+=fn[g*3+1];z+=fn[g*3+2]}}const l=Math.hypot(x,y,z)||1;const o=f*9+q*3;
    P[o]=pos[v*3];P[o+1]=pos[v*3+1];P[o+2]=pos[v*3+2];N[o]=x/l;N[o+1]=y/l;N[o+2]=z/l}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));return g}
function roundGeo(geo){const P=geo.attributes.position;if(geo.index||P.count>12000)return geo;const r=loopSmooth(P.array,2,88,.4);const g=creaseGeo(r.pos,r.idx,42);g.userData.shared=true;return g}
function prepModel(id,scene){
  const md=MODELS[id];md.tpl=scene;scene.updateMatrixWorld(true);
  const body=scene.getObjectByName('Body')||scene;const meshes=[];body.traverse(n=>{if(n.isMesh)meshes.push(n)});
  md.noWing=new Map();let deckY=null;
  for(const n of meshes){const nm=n.material&&n.material.name;if(ROLE[nm]==='base'&&!md.baseCol)md.baseCol=n.material.color.clone()}
  {const tris=[],v=new THREE.Vector3();for(const n of meshes){if(n.geometry.index)continue;const P=n.geometry.attributes.position;for(let i=0;i<P.count;i+=3){const q=[];for(let k=0;k<3;k++){v.set(P.getX(i+k),P.getY(i+k),P.getZ(i+k)).applyMatrix4(n.matrixWorld);q.push(v.x,v.y,v.z)}tris.push({n,i,q})}}
   const par=new Int32Array(tris.length);for(let i=0;i<par.length;i++)par[i]=i;const f=i=>{while(par[i]!==i){par[i]=par[par[i]];i=par[i]}return i};const vm=new Map();
   tris.forEach((t,i)=>{for(let k=0;k<9;k+=3){const key=Math.round(t.q[k]*1e3)+','+Math.round(t.q[k+1]*1e3)+','+Math.round(t.q[k+2]*1e3);const j=vm.get(key);if(j==null)vm.set(key,i);else{const a=f(i),b=f(j);if(a!==b)par[a]=b}}});
   const comp=new Map();tris.forEach((t,i)=>{const r=f(i);let c=comp.get(r);if(!c)comp.set(r,c={ids:[],minY:1e9,maxY:-1e9,sz:0,minZ:1e9});c.ids.push(i);for(let k=0;k<9;k+=3){c.minY=Math.min(c.minY,t.q[k+1]);c.maxY=Math.max(c.maxY,t.q[k+1]);c.minZ=Math.min(c.minZ,t.q[k+2])}c.sz+=(t.q[2]+t.q[5]+t.q[8])/3});
   let shell=null;for(const c of comp.values())if(!shell||c.ids.length>shell.ids.length)shell=c;
   if(shell){const smz=shell.minZ;let top=-1e9;for(const i of shell.ids){const t=tris[i];if((t.q[2]+t.q[5]+t.q[8])/3<smz+.35)top=Math.max(top,(t.q[1]+t.q[4]+t.q[7])/3)}deckY=top;
     const drop=new Map();for(const c of comp.values()){if(c===shell||c.ids.length>400)continue;if(c.sz/c.ids.length<smz+.8&&c.maxY>top+.1&&c.minY>top-.3)for(const i of c.ids){const t=tris[i];let s2=drop.get(t.n);if(!s2)drop.set(t.n,s2=new Set());s2.add(t.i)}}
     for(const [n,set] of drop){const P=n.geometry.attributes.position,N=n.geometry.attributes.normal,kp=[],kn=[];for(let i=0;i<P.count;i+=3){if(set.has(i))continue;for(let q=0;q<3;q++){kp.push(P.getX(i+q),P.getY(i+q),P.getZ(i+q));if(N)kn.push(N.getX(i+q),N.getY(i+q),N.getZ(i+q))}}
       const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(kp,3));if(N)g.setAttribute('normal',new THREE.Float32BufferAttribute(kn,3));g.userData.shared=true;md.noWing.set(n.geometry.uuid,g)}}}
  const rc=new THREE.Raycaster();const hit=(o,d)=>{rc.set(new THREE.Vector3(...o),new THREE.Vector3(...d).normalize());const h=rc.intersectObjects(meshes,false)[0];return h?h.point:null};
  const fr=hit([0,.5,6],[0,0,-1]),re=hit([0,.55,-6],[0,0,1]);md.front=fr?fr.z:2;md.rear=re?re.z:-2;
  const dr=hit([4,.74,-.4],[-1,0,0]);md.side=dr?dr.x:.86;
  const rf=hit([0,5,-.25],[0,-1,0]);md.roofY=rf?rf.y:1.35;
  const tl=hit([0,5,md.rear+.14],[0,-1,0]);md.tailY=deckY!=null?deckY:(tl?tl.y:.9);
}
function makeModelCar(st,ghost,MD){
  const SC=8.6,g=new THREE.Group(),body=new THREE.Group();g.add(body);
  const m=MD.tpl.clone(true);m.scale.setScalar(SC);m.rotation.y=Math.PI/2;
  const gm=ghost?new THREE.MeshBasicMaterial({color:0x7a8087,transparent:true,opacity:.5,depthWrite:false}):null;
  const keep=st.paintId==='po';const base=keep&&MD.baseCol?MD.baseCol.clone():new THREE.Color(st.paint);
  const sch=LIVS[st.liv];const yellow=st.lights==='h1';const noWing=st.wing&&st.wing!=='w0';
  const P=(c,o)=>new THREE.MeshPhongMaterial(Object.assign({color:c,shininess:55,specular:0x303030},o||{}));
  const hlM=()=>new THREE.MeshPhongMaterial({color:yellow?'#ffd84a':'#fffbe8',emissive:yellow?'#d9a514':'#fff0bf',emissiveIntensity:.55});
  m.traverse(n=>{if(!n.isMesh)return;const nm=(n.material&&n.material.name)||'';const role=ROLE[nm];let mat;
    if(noWing&&MD.noWing&&MD.noWing.has(n.geometry.uuid))n.geometry=MD.noWing.get(n.geometry.uuid);
    if(gm)mat=gm;
    else if(role==='base')mat=P(base);
    else if(role){let c=n.material.color.clone();if(st.liv==='lv1')c=base.clone();else if(sch)c=new THREE.Color(role==='acc2'?sch[1]:sch[0]);mat=P(c)}
    else if(nm==='Rim')mat=new THREE.MeshPhongMaterial({color:keep&&st.rim==='r0'?n.material.color.clone():(RIMS[st.rim]||RIMS.r0),shininess:70,specular:0x444444,flatShading:true});
    else if(nm==='Headlight')mat=hlM();
    else if(nm==='Taillight')mat=new THREE.MeshPhongMaterial({color:'#b3261e',emissive:'#5a0d08',flatShading:true});
    else if(nm==='Glass')mat=new THREE.MeshPhongMaterial({color:'#1d2a33',shininess:90,specular:0x6688aa});
    else if(nm==='Chrome')mat=new THREE.MeshPhongMaterial({color:'#d4d8dc',shininess:100,specular:0xaaaaaa,flatShading:true});
    else mat=new THREE.MeshPhongMaterial({color:n.material.color.clone(),shininess:12});
    n.material=mat});
  // add-ons in model space (meters)
  const add=(geo,mat,x,y,z,rx,ry,rz)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);m.add(o);return o};
  const Bx=(w,h,d,mat,x,y,z,rx)=>add(new THREE.BoxGeometry(w,h,d),mat,x,y,z,rx);
  const dark=gm||P('#1d1f22'),accC=sch?sch[0]:(st.liv==='lv1'?base:'#d8352c');
  const W2=MD.side||.86,ty=MD.tailY||.9,zr=(MD.rear||-2);
  if(st.wing==='w2'){Bx(W2*1.8,.05,.24,gm||P(base),0,ty+.05,zr+.14,-.28)}
  if(st.wing==='w3'||st.wing==='w4'){const zc=zr+.24,h=st.wing==='w4'?.40:.34;
    for(const sx of [-1,1])Bx(.05,h,.12,dark,sx*W2*.55,ty+h/2,zc);
    Bx(W2*2.15,.045,.32,gm||P(base),0,ty+h+.02,zc-.02,-.08);
    for(const sx of [-1,1])Bx(.03,.2,.38,gm||P(accC),sx*W2*1.08,ty+h+.04,zc-.02);
    if(st.wing==='w4')Bx(W2*2.1,.035,.2,gm||P(accC),0,ty+h-.12,zc+.06,-.12)}
  if(!ghost&&(st.lights==='h2'||st.lights==='h3')){const ring=P('#d4d8dc',{shininess:100});
    const roof=st.lights==='h3',y=roof?(MD.roofY||1.35)+.1:.5,z=roof?-.2:(MD.front||2)+.1;
    Bx(W2*(roof?1.15:1.5),.05,.05,dark,0,y-(roof?.06:0),z-.03);
    for(const lx of [-.5,-.18,.18,.5]){const x=lx*W2*(roof?.75:1);const c=add(new THREE.CylinderGeometry(.095,.095,.06,16),ring,x,y,z,Math.PI/2);const l=add(new THREE.CylinderGeometry(.08,.08,.07,16),hlM(),x,y,z+.012,Math.PI/2)}}
  if(!ghost&&st.decal&&st.decal!=='n0'){const num={n1:'7',n2:'23',n3:'88'}[st.decal]||'7';const mt=new THREE.MeshBasicMaterial({map:numTex(num),transparent:true});
    for(const sx of [-1,1])add(new THREE.PlaneGeometry(.36,.36),mt,sx*(W2+.012),.74,-.4,0,sx*Math.PI/2)}
  const wheels=[],fronts=[];let wr=.33;
  for(const nm of ['Wheel_FL','Wheel_FR','Wheel_RL','Wheel_RR']){const w=m.getObjectByName(nm);if(w){w.rotation.order='YXZ';wheels.push(w);wr=w.position.y||wr;if(nm.charAt(6)==='F')fronts.push(w)}}
  body.add(m);
  if(!ghost){const sh=new THREE.Mesh(new THREE.PlaneGeometry(50,28),new THREE.MeshBasicMaterial({map:blobTex,color:0x000000,transparent:true,opacity:.38,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.9;g.add(sh)}
  g.userData={body,wheels,fronts,spin:0,pvf:0,pitch:0,r:wr*SC,model:true};
  return g;
}
function makeCar(st,ghost){
  if(MODELS[st.body]&&MODELS[st.body].tpl)return makeModelCar(st,ghost,MODELS[st.body]);
  if(MODELS[st.body]){loadModel(st.body);const g=new THREE.Group(),body=new THREE.Group();g.add(body);g.userData={body,wheels:[],fronts:[],spin:0,pvf:0,pitch:0,r:4.6,model:true,placeholder:true};return g}
  const C=CARS[st.body]||CARS.b5;
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);body.position.y=C.lift;
  const gm=ghost?new THREE.MeshBasicMaterial({color:0x7a8087,transparent:true,opacity:.5,depthWrite:false}):null;
  const shiny=(c,map)=>new THREE.MeshPhongMaterial(map?{map,shininess:55,specular:0x303030}:{color:c,shininess:55,specular:0x303030});
  const p=st.paint,sec=isDark(p)?'#f1efe8':'#2a2d30';
  const paint=gm||shiny(p),dark=gm||phong('#23272b'),glass=gm||new THREE.MeshPhongMaterial({color:'#25363f',shininess:90,specular:0x6688aa});
  const livM=gm||shiny(null,liveryTex(C,p,sec,st.liv));
  const box=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);body.add(b);return b};
  {const geo=new THREE.ExtrudeGeometry(bodyShape(C),{depth:C.W-1.2,bevelEnabled:true,bevelThickness:.6,bevelSize:.6,bevelSegments:3,curveSegments:14});geo.translate(0,0,-(C.W-1.2)/2);body.add(new THREE.Mesh(geo,[livM,paint]))}
  body.add(extr(C.cabin,C.W-3.6,.9,glass));
  const c1=C.cabin[1],c2=C.cabin[2];
  body.add(extr([[c1[0]+.2,c1[1]-.4],[c1[0]-.8,c1[1]+.9],[c2[0]+.8,c2[1]+.9],[c2[0]-.2,c2[1]-.4]],C.W-4.2,.7,paint));
  const ay=C.r-C.lift,R=C.r+1.5;
  for(const wx of [C.fx,C.rx])for(const side of [-1,1]){
    if(C.ar>0){const sh=new THREE.Shape();const Ri=R-.6,Ro=Ri+C.ar;sh.absarc(0,0,Ro,0,Math.PI,false);sh.lineTo(-Ri,0);sh.absarc(0,0,Ri,Math.PI,0,true);sh.closePath();
      const geo=new THREE.ExtrudeGeometry(sh,{depth:1.2,bevelEnabled:true,bevelThickness:.4,bevelSize:.4,bevelSegments:2,curveSegments:14});geo.translate(0,0,-.6);
      const m=new THREE.Mesh(geo,paint);m.position.set(wx,ay,side*(C.W/2-.4));body.add(m)}
    if(!ghost){const wl=new THREE.Mesh(new THREE.CylinderGeometry(R-.7,R-.7,.6,16),phong('#15171a'));wl.rotation.x=Math.PI/2;wl.position.set(wx,ay,side*(C.W/2-3.6));body.add(wl);
      box(.5,3.6,3.2,wx-R+.3,2.4-C.lift+.6,side*(C.W/2-1.4),dark)}}
  const front=Math.max(...C.top.map(q=>q[0])),rear=Math.min(...C.top.map(q=>q[0]));
  if(!ghost){
    const hx=contourX(C.top,C.lightY,true)+.55;
    const hl=new THREE.MeshPhongMaterial({color:'#fffbe8',emissive:'#fff0bf',emissiveIntensity:.55,shininess:90});
    for(const sd of [-1,1]){box(.9,1.7,C.W*.2,hx,C.lightY,sd*C.W*.3,hl)}
    box(.7,1.5,C.W*.3,hx-.1,C.lightY-.1,0,dark);
    const fy=Math.max(3.4,C.lightY-2.5),fx2=contourX(C.top,fy,true)+.5;
    for(const sd of [-1,1]){const l=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,1,12),hl);l.rotation.z=Math.PI/2;l.position.set(fx2,fy,sd*C.W*.27);body.add(l)}
    const ty2=C.top.find(q=>q[0]===rear)?8:8,tx2=contourX(C.top,8,false)-.5;
    const tl=new THREE.MeshPhongMaterial({color:'#b3261e',emissive:'#5a0d08',shininess:60});box(.8,1.6,C.W*.18,tx2,ty2,-C.W*.32,tl);box(.8,1.6,C.W*.18,tx2,ty2,C.W*.32,tl);
    if(st.body==='b3'){box(14,1,C.W-5,c1[0]-8,c2[1]+2.2,0,dark)}
    if(st.body==='b5'){box(3.6,1,C.W+.6,front-.6,2.2,0,dark);for(const sd of [-1,1])box((C.fx-R)-(C.rx+R),1.6,.8,(C.fx+C.rx)/2,3.2,sd*(C.W/2+.2),dark);box(5,.6,6,11,11.5,0,dark);box(3,1.2,4.6,-2,17.4,0,dark)}
  }
  const [wxp,wyp]=C.wing;
  if(st.sp==='s1')box(3.6,1,C.W-3.6,wxp,wyp,0,dark);
  if(st.sp==='s2'){box(1.2,3.4,1.2,wxp+1,wyp+1.6,-C.W*.3,dark);box(1.2,3.4,1.2,wxp+1,wyp+1.6,C.W*.3,dark);box(6,1.2,C.W+3,wxp,wyp+3.7,0,gm||phong(sec));box(6,3.6,.8,wxp,wyp+2.6,-(C.W+3)/2,dark);box(6,3.6,.8,wxp,wyp+2.6,(C.W+3)/2,dark)}
  const wheels=[],fronts=[];
  const tyre=gm||phong('#17191b'),rim=gm||new THREE.MeshPhongMaterial({color:RIMS[st.rim]||RIMS.r0,shininess:70,specular:0x444444});
  for(const wx of [C.fx,C.rx])for(const side of [-1,1]){const piv=new THREE.Group();piv.position.set(wx,C.r,side*(C.W/2-2));g.add(piv);
    const wh=new THREE.Group();piv.add(wh);const t=new THREE.Mesh(new THREE.CylinderGeometry(C.r,C.r,3.6,18),tyre);t.rotation.x=Math.PI/2;wh.add(t);
    if(!ghost){const rr=new THREE.Mesh(new THREE.CylinderGeometry(C.r*.62,C.r*.62,3.8,6),rim);rr.rotation.x=Math.PI/2;wh.add(rr);const hub=new THREE.Mesh(new THREE.CylinderGeometry(C.r*.18,C.r*.18,4,8),dark);hub.rotation.x=Math.PI/2;wh.add(hub)}
    wheels.push(wh);if(wx>0)fronts.push(piv)}
  if(!ghost){const sh=new THREE.Mesh(new THREE.PlaneGeometry(C.L+12,C.W+10),new THREE.MeshBasicMaterial({map:blobTex,color:0x000000,transparent:true,opacity:.38,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.9;g.add(sh)}
  g.userData={body,wheels,fronts,spin:0,pvf:0,pitch:0,r:C.r};
  return g;
}
function gridH(G,x,z){const fx=(x-G.x0)/G.sx,fz=(z-G.z0)/G.sz;const i=Math.floor(fx),j=Math.floor(fz);if(i<0||j<0||i>=G.cells||j>=G.cells)return 0;
  const u=fx-i,v=fz-j,C1=G.cells+1,H=G.H,h00=H[j*C1+i],h10=H[j*C1+i+1],h01=H[(j+1)*C1+i],h11=H[(j+1)*C1+i+1];
  return u+v<=1?h00+(h10-h00)*u+(h01-h00)*v:h11+(h01-h11)*(1-u)+(h10-h11)*(1-v)}
function groundPose(T,x,y,a,hint){const ca=Math.cos(a),sa=Math.sin(a),g=(px,py)=>T.surfAt(px,py,hint);
  const hC=g(x,y),hF=g(x+ca*13,y+sa*13),hB=g(x-ca*13,y-sa*13),hR=g(x-sa*8,y+ca*8),hL=g(x+sa*8,y-ca*8);
  return {h:Math.max(hC,(hF+hB)/2,(hL+hR)/2),p:Math.atan2(hF-hB,26),r:Math.atan2(hL-hR,16)}}
function poseCar(g,x,y,h,a,vf,vr,steer,dt,tp,tr){
  g.position.set(x,h,y);g.rotation.order='YZX';g.rotation.set(tr||0,-a,tp||0);const u=g.userData;u.spin+=vf*dt/(u.r||4.6);
  if(u.model){for(const w of u.wheels){w.rotation.x=u.spin;w.rotation.y=u.fronts.includes(w)?-steer*.42:0}}
  else{for(const w of u.wheels)w.rotation.z=-u.spin;
  for(const f of u.fronts)f.rotation.y=-steer*.42}
  const acc=dt>0?(vf-u.pvf)/dt:0;u.pvf=vf;u.pitch+=(clamp(acc*.00007,-.06,.06)-u.pitch)*Math.min(1,dt*6);
  u.body.rotation.z=u.pitch;u.body.rotation.x+=(clamp(-vr*.0011,-.14,.14)-u.body.rotation.x)*Math.min(1,dt*8);
}

/* ---------------- 3D world ---------------- */
function groundMesh(B,x0,z0,x1,z1,distFn,hs,flatR){
  const cells=Math.round(clamp(Math.max(x1-x0,z1-z0)/150,24,80));const sx=(x1-x0)/cells,sz=(z1-z0)/cells,C1=cells+1;
  const H=new Float32Array(C1*C1),D=new Float32Array(C1*C1);
  for(let j=0;j<=cells;j++)for(let i=0;i<=cells;i++){const x=x0+i*sx,z=z0+j*sz,d=distFn(x,z);D[j*C1+i]=d;H[j*C1+i]=heightAt(x,z,d,hs)}
  const pos=new Float32Array(cells*cells*18),col=new Float32Array(cells*cells*18);let p=0;
  const gc=B.ground.map(c=>new THREE.Color(c)),vc=new THREE.Color(B.verge),snowTop=new THREE.Color('#ffffff');
  const V=(i,j)=>[x0+i*sx,H[j*C1+i],z0+j*sz];
  for(let j=0;j<cells;j++)for(let i=0;i<cells;i++){
    const tris=[[V(i,j),V(i,j+1),V(i+1,j)],[V(i+1,j),V(i,j+1),V(i+1,j+1)]];const dm=(D[j*C1+i]+D[(j+1)*C1+i+1])/2;
    for(let t=0;t<2;t++){const tr=tris[t];const hm=(tr[0][1]+tr[1][1]+tr[2][1])/3;
      {const nz=vnoise((x0+(i+.5)*sx)/260,(z0+(j+.5)*sz)/260,hs+3);tmpC.copy(dm<flatR?vc:gc[nz<.4?1:nz>.62?2:0]).multiplyScalar(.96+hash2(i*2+t,j,hs)*.07)}if(B.snowy&&hm>70)tmpC.lerp(snowTop,.6);else if(hm>110)tmpC.multiplyScalar(.93);
      {const ax=tr[1][0]-tr[0][0],ay=tr[1][1]-tr[0][1],az=tr[1][2]-tr[0][2],bx=tr[2][0]-tr[0][0],by=tr[2][1]-tr[0][1],bz=tr[2][2]-tr[0][2];const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz2=ax*by-ay*bx;if(Math.abs(ny)/Math.hypot(nx,ny,nz2)<.8&&hm>15&&B.rock)tmpC.set(B.rock).multiplyScalar(.88+hash2(i,j*2+t,hs+5)*.18)}
      for(const v of tr){pos[p]=v[0];pos[p+1]=v[1];pos[p+2]=v[2];col[p]=tmpC.r;col[p+1]=tmpC.g;col[p+2]=tmpC.b;p+=3}}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();
  const gmesh=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}));
  gmesh.userData.grid={x0,z0,sx,sz,cells,H};return gmesh;
}
function roadLim(T){if(T._lim)return T._lim;const N=T.N,l0=new Float32Array(N),lim=new Float32Array(N);
  for(let i=0;i<N;i++){let m=1e9;for(let j=Math.max(0,i-8);j<=Math.min(N-1,i+8);j++)m=Math.min(m,T.rad[j]);l0[i]=Math.max(4,m*.9)}
  for(let i=0;i<N;i++){let a=0,n=0;for(let j=Math.max(0,i-5);j<=Math.min(N-1,i+5);j++){a+=l0[j];n++}lim[i]=Math.min(l0[i],a/n)}
  return T._lim=lim}
function sideHalf(T,i,half){const lim=roadLim(T);let hl=half,hr=half;if(T.tdir[i]>0)hr=Math.min(half,lim[i]);else hl=Math.min(half,lim[i]);return [hl,hr]}
function ribbon(T,half,y,mat,vScale,keep,uvF){
  const N=T.N,pos=new Float32Array(N*6),uv=new Float32Array(N*4),idx=[];
  for(let i=0;i<N;i++){const nx=-T.ty[i],nz=T.tx[i];const [hl,hr]=sideHalf(T,i,half);const yy=typeof y==='number'?y:y[i];
    pos[i*6]=T.xs[i]-nx*hl;pos[i*6+1]=yy;pos[i*6+2]=T.ys[i]-nz*hl;pos[i*6+3]=T.xs[i]+nx*hr;pos[i*6+4]=yy;pos[i*6+5]=T.ys[i]+nz*hr;
    const v=uvF?uvF(i):T.cum[i]/vScale;uv[i*4]=0;uv[i*4+1]=v;uv[i*4+2]=1;uv[i*4+3]=v}
  for(let i=0;i<N-1;i++){if(keep&&!keep(i))continue;const a=2*i,b=a+1,c=a+2,d=a+3;idx.push(a,b,c,b,d,c)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  if(mat.vertexColors){const col=new Float32Array(N*6);for(let i=0;i<N;i++){const d=T.ry[i]-T.base;let r=1,g=1,b=1;if(d>.05){const k=Math.min(1,d/8);r=1+.22*k;g=1+.12*k;b=1-.12*k}else if(d<-.05){const k=Math.min(1,-d/4.4);r=g=1-.38*k;b=1-.3*k}for(const q of [0,3]){col[i*6+q]=r;col[i*6+q+1]=g;col[i*6+q+2]=b}}geo.setAttribute('color',new THREE.BufferAttribute(col,3))}geo.setIndex(idx);geo.computeVertexNormals();
  return new THREE.Mesh(geo,mat);
}
function skirt(T,mat){
  const N=T.N,SK=22,pos=new Float32Array(N*12),idx=[];
  for(let i=0;i<N;i++){const nx=-T.ty[i],nz=T.tx[i];const [il,ir]=sideHalf(T,i,T.w/2-.5),[ol,or]=sideHalf(T,i,T.w/2+SK);const yi=T.ry[i]+.2;
    const ox=T.xs[i]-nx*ol,oz=T.ys[i]-nz*ol,ox2=T.xs[i]+nx*or,oz2=T.ys[i]+nz*or;
    const P=[[ox,T.surfAt(ox,oz)+.3,oz],[T.xs[i]-nx*il,yi,T.ys[i]-nz*il],[T.xs[i]+nx*ir,yi,T.ys[i]+nz*ir],[ox2,T.surfAt(ox2,oz2)+.3,oz2]];
    if(T.bridge&&T.bridge[i]){P[0]=P[1].slice();P[3]=P[2].slice()}
    for(let q=0;q<4;q++){pos[i*12+q*3]=P[q][0];pos[i*12+q*3+1]=P[q][1];pos[i*12+q*3+2]=P[q][2]}}
  for(let i=0;i<N-1;i++)for(const q of [0,2]){const a=i*4+q,b=a+1,c=a+4,d=a+5;idx.push(a,b,c,b,d,c)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();
  return new THREE.Mesh(geo,mat);
}
const TILE=900;
function instanced(geo,mat,list,fn,nocull){
  if(geo.index){const g2=geo.toNonIndexed();geo.dispose();geo=g2}geo.computeVertexNormals();
  const mk=(sub,cx,cz)=>{const m=new THREE.InstancedMesh(geo,mat,Math.max(1,sub.length));sub.forEach((o,i)=>{fn(o,dummy);dummy.position.x-=cx;dummy.position.z-=cz;dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);if(o.col2){tmpC.set(o.col2);m.setColorAt(i,tmpC)}});m.count=sub.length;m.position.set(cx,0,cz);m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;return m};
  if(nocull){const m=mk(list,0,0);m.frustumCulled=false;return m}
  geo.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,0,0),TILE*.75+260);
  const tiles=new Map();for(const o of list){const k=Math.floor(o.x/TILE)+','+Math.floor(o.y/TILE);let a=tiles.get(k);if(!a)tiles.set(k,a=[]);a.push(o)}
  const g=new THREE.Group();for(const [k,sub] of tiles){const [ix,iy]=k.split(',').map(Number);g.add(mk(sub,(ix+.5)*TILE,(iy+.5)*TILE))}return g}
const SHD=[-.85,.53];const shadowMat=new THREE.MeshBasicMaterial({map:blobTex,color:0x1d3a24,transparent:true,opacity:.26,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
function addShadows(grp,items){if(!items.length)return;const th=Math.atan2(-SHD[1],SHD[0]);grp.add(instanced(new THREE.PlaneGeometry(1,1),shadowMat,items,(o,d)=>{const L=o.L,W2=o.W;d.position.set(o.x+SHD[0]*(L*.42),(o.h||0)+.7,o.y+SHD[1]*(L*.42));d.scale.set(L,W2,1);d.rotation.set(-Math.PI/2,0,th)}))}
function addDecor(grp,list,B){
  const by=t=>list.filter(o=>o.t===t);
  const chal=by('chalet');if(chal.length){
    grp.add(instanced(new THREE.BoxGeometry(30,16,24),wmat('#9a6640'),chal,(o,d)=>{d.position.set(o.x,(o.h||0)+8,o.y);d.scale.set(1,1,1);d.rotation.set(0,o.s*6,0)}));
    grp.add(instanced(new THREE.ConeGeometry(23,13,4),wmat('#f7fafc'),chal,(o,d)=>{d.position.set(o.x,(o.h||0)+22.5,o.y);d.scale.set(1,1,.85);d.rotation.set(0,o.s*6+Math.PI/4,0)}));
    grp.add(instanced(new THREE.BoxGeometry(31,4,7),wmat('#3c2a1d'),chal,(o,d)=>{d.position.set(o.x,(o.h||0)+7,o.y);d.scale.set(1,1,1);d.rotation.set(0,o.s*6,0)}))}
  const palms=by('palm');for(const o of palms)o.col2=o.c;
  if(palms.length){grp.add(instanced(new THREE.CylinderGeometry(1.3,2.1,32,6),wmat(B.trunk),palms,(o,d)=>{d.position.set(o.x,(o.h||0)+16,o.y);d.scale.set(1,1,1);d.rotation.set((o.s-.5)*.25,0,(o.s-.5)*.3)}));
    grp.add(instanced(new THREE.ConeGeometry(17,8,7),wmat('#ffffff'),palms,(o,d)=>{d.position.set(o.x+(o.s-.5)*-9,(o.h||0)+32,o.y+(o.s-.5)*8);d.scale.set(1,.7,1);d.rotation.set(Math.PI,o.s*6,0)}))}
  const pines=by('pine'),trees=by('tree'),rocks=by('rock'),cacti=by('cactus'),bush=by('bush'),bales=by('bale');
  const set=(o,d,dy,sx,sy,sz,ry)=>{d.position.set(o.x,(o.h||0)+dy,o.y);d.scale.set(sx,sy,sz);d.rotation.set(0,ry||0,0)};
  for(const o of [...pines,...trees,...cacti,...bush])o.col2=o.c;
  if(pines.length){const w=wmat('#ffffff');
    grp.add(instanced(new THREE.CylinderGeometry(1.6,2.2,10,5),wmat(B.trunk),pines,(o,d)=>{const s=o.r/11;set(o,d,5*s,s,s,s)}));
    grp.add(instanced(new THREE.ConeGeometry(13,22,7),w,pines,(o,d)=>{const s=o.r/11;set(o,d,21*s,s,s,s,o.s*3)}));
    grp.add(instanced(new THREE.ConeGeometry(10,18,7),w,pines,(o,d)=>{const s=o.r/11;set(o,d,32*s,s,s,s,o.s*5)}));
    grp.add(instanced(new THREE.ConeGeometry(6.5,13,7),w,pines,(o,d)=>{const s=o.r/11;set(o,d,41.5*s,s,s,s,o.s*7)}));
    if(B.snowy){const sn=pines.map(o=>({x:o.x,y:o.y,h:o.h,r:o.r}));grp.add(instanced(new THREE.ConeGeometry(4,7,7),wmat('#ffffff'),sn,(o,d)=>{const s=o.r/11;set(o,d,46*s,s,s,s)}))}}
  if(trees.length){grp.add(instanced(new THREE.CylinderGeometry(1.8,2.4,14,5),wmat(B.trunk),trees,(o,d)=>{const s=o.r/13;set(o,d,7*s,s,s,s)}));
    grp.add(instanced(new THREE.IcosahedronGeometry(14,0),wmat('#ffffff'),trees,(o,d)=>{const s=o.r/13;set(o,d,22*s,s,s*1.1,s,o.s*4)}))}
  if(rocks.length)grp.add(instanced(new THREE.DodecahedronGeometry(1,0),wmat(B===BIOMES.desert?'#b48a62':'#9a9c98'),rocks,(o,d)=>{set(o,d,o.r*.35,o.r,o.r*.75,o.r*1.1,o.s*6)}));
  if(cacti.length){const m=wmat('#ffffff');grp.add(instanced(new THREE.CylinderGeometry(3.2,3.8,24,6),m,cacti,(o,d)=>set(o,d,12,1,1,1)));
    grp.add(instanced(new THREE.BoxGeometry(14,3,3),m,cacti,(o,d)=>set(o,d,12,1,1,1,o.s*6)))}
  if(bush.length)grp.add(instanced(new THREE.IcosahedronGeometry(1,0),wmat('#ffffff'),bush,(o,d)=>set(o,d,o.r*.5,o.r,o.r*.75,o.r,o.s*5)));
  if(bales.length)grp.add(instanced(new THREE.BoxGeometry(14,8,9),wmat('#e2bf55'),bales,(o,d)=>{d.position.set(o.x,(o.h||0)+4,o.y);d.scale.set(1,1,1);d.rotation.set(0,-(o.a||0),0)}));
  {const sh=[];for(const o of list){const t=o.t;let L=0,W2=0;const r=o.r||10;
     if(t==='pine'){const sc=r/11;L=46*sc;W2=22*sc}else if(t==='tree'){const sc=r/13;L=38*sc;W2=28*sc}else if(t==='palm'){L=36;W2=24}else if(t==='rock'){L=r*2.6;W2=r*2}else if(t==='cactus'){L=26;W2=10}else if(t==='bush'){L=r*2.4;W2=r*2}else if(t==='chalet'){L=50;W2=36}else if(t==='bale'){L=18;W2=14}
     if(L)sh.push({x:o.x,y:o.y,h:o.h,L,W:W2})}addShadows(grp,sh)}
}
function addWild(root,T,B,fd){
  const r=rng(T.hseed+31);const tufts=[],flowers=[],logs=[],puddles=[],mts=[],caps=[];
  const tuftC=B===BIOMES.jungle?['#2e8a3a','#3fa04a','#277a33']:B===BIOMES.desert?['#c9b071','#b89f60']:B.snowy?['#e8eef2','#dfe7ec']:B===BIOMES.autumn?['#a9a04a','#c0b45a','#b8763a']:['#5aa84a','#6fbf5c','#4e9a42'];
  for(let k=0;k<T.N;k++)for(let q=0;q<2;q++){if(r()<.94)continue;const side=r()<.5?-1:1;const off=T.w/2+8+r()*r()*340;
    const x=T.xs[k]-T.ty[k]*side*off+(r()-.5)*20,y=T.ys[k]+T.tx[k]*side*off+(r()-.5)*20;const d=fd(x,y);if(d<T.w/2+6)continue;const h=T.surfAt(x,y);
    if(B!==BIOMES.desert&&!B.snowy&&r()<.16)flowers.push({x,y,h,col2:['#ffffff','#f4d23c','#b07ad8','#e2574c'][Math.floor(r()*4)],s:.7+r()*.6});
    else tufts.push({x,y,h,col2:tuftC[Math.floor(r()*tuftC.length)],s:.6+r()*.9,a:r()*6})}
  for(let k=20;k<T.N-20;k+=25+Math.floor(r()*30)){const side=r()<.5?-1:1;const off=T.w/2+50+r()*170;const x=T.xs[k]-T.ty[k]*side*off,y=T.ys[k]+T.tx[k]*side*off;const d=fd(x,y);if(d<T.w/2+40)continue;logs.push({x,y,h:T.surfAt(x,y),a:r()*Math.PI,s:.7+r()*.6})}
  if(B!==BIOMES.desert)for(let k=30;k<T.N-30;k+=40+Math.floor(r()*60)){const o=(r()-.5)*T.w*.5;if(Math.abs(T.ry[k]-T.base)>.05)continue;puddles.push({h:T.ry[k],x:T.xs[k]-T.ty[k]*o,y:T.ys[k]+T.tx[k]*o,s:.7+r()*.8,a:r()*3})}
  const b=T.bounds,cx=(b.minx+b.maxx)/2,cy=(b.miny+b.maxy)/2,R0=Math.max(b.maxx-b.minx,b.maxy-b.miny)/2+1500;
  const sky=new THREE.Color(B.sky),mc=new THREE.Color(B===BIOMES.desert?'#c4946a':B.snowy?'#9fb0bc':'#6f8a78');
  for(let i=0;i<30;i++){const a=i/30*Math.PI*2+r()*.15,d=R0+r()*700,rad=380+r()*420,h=380+r()*620;const col=mc.clone().lerp(sky,.25+r()*.25);
    const o={x:cx+Math.cos(a)*d,y:cy+Math.sin(a)*d,rad,hh:h,col2:'#'+col.getHexString(),a:r()*3};mts.push(o);if(h>620||B.snowy)caps.push({x:o.x,y:o.y,rad:rad*.36,hh:h*.36,base:h*.64,a:o.a})}
  const fogless=c=>new THREE.MeshLambertMaterial({color:c,fog:false});
  if(tufts.length)root.add(instanced(new THREE.ConeGeometry(2.6,7,4),wmat('#ffffff'),tufts,(o,d)=>{d.position.set(o.x,o.h+3*o.s,o.y);d.scale.set(o.s,o.s,o.s);d.rotation.set(0,o.a,0)}));
  if(flowers.length)root.add(instanced(new THREE.IcosahedronGeometry(1.5,0),wmat('#ffffff'),flowers,(o,d)=>{d.position.set(o.x,o.h+2,o.y);d.scale.set(o.s,o.s,o.s);d.rotation.set(0,0,0)}));
  if(logs.length)root.add(instanced(new THREE.CylinderGeometry(2.8,3.2,26,7),wmat('#7a5236'),logs,(o,d)=>{d.position.set(o.x,o.h+2.8*o.s,o.y);d.scale.set(o.s,o.s,o.s);d.rotation.set(0,o.a,Math.PI/2)}));
  if(puddles.length){const m=new THREE.MeshPhongMaterial({color:B.snowy?'#9fb6c6':'#6e6a5e',shininess:90,specular:0x99aabb,transparent:true,opacity:.85,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-6});
    root.add(instanced(new THREE.CircleGeometry(10,9),m,puddles,(o,d)=>{d.position.set(o.x,o.h+1.05,o.y);d.scale.set(o.s*1.5,o.s,1);d.rotation.set(-Math.PI/2,0,o.a)}))}
  root.add(instanced(new THREE.ConeGeometry(1,1,6),fogless('#ffffff'),mts,(o,d)=>{d.position.set(o.x,o.hh/2-30,o.y);d.scale.set(o.rad,o.hh,o.rad);d.rotation.set(0,o.a,0)},1));
  if(caps.length)root.add(instanced(new THREE.ConeGeometry(1,1,6),fogless('#f6f8fa'),caps,(o,d)=>{d.position.set(o.x,o.base+o.hh/2-30,o.y);d.scale.set(o.rad,o.hh,o.rad);d.rotation.set(0,o.a,0)},1));
}
function buildWorld(T){
  const B=T.B,scene=new THREE.Scene();lights(scene,B.sky);
  const root=new THREE.Group();scene.add(root);
  const b=T.bounds,pad=1200,fd=T.farDist;
  {const gmesh=groundMesh(B,b.minx-pad,b.miny-pad,b.maxx+pad,b.maxy+pad,fd,T.hseed,T.w/2+38);root.add(gmesh);gmesh.renderOrder=-3;const G=gmesh.userData.grid;T.gh=(x,z)=>gridH(G,x,z)}
  {const sk=skirt(T,new THREE.MeshLambertMaterial({color:B.verge,side:THREE.DoubleSide,depthTest:false}));sk.renderOrder=-2;root.add(sk)}
  const tex=dirtTex(B);tex.wrapS=THREE.ClampToEdgeWrapping;tex.wrapT=THREE.RepeatWrapping;
  {const ry2=Float32Array.from(T.ry,(v,i)=>v+.6+i/T.N*.3),F=9;
   const inDeck=i=>{for(const [s0,e0] of T.bspan)if(i>=s0+F&&i<e0-F)return true;return false};
   const rd=ribbon(T,T.w/2,ry2,new THREE.MeshLambertMaterial({map:tex,vertexColors:true,depthTest:false}),260,i=>!inDeck(i));rd.renderOrder=-1;root.add(rd);
   if(T.bspan.length){const at=asphaltTex(false);at.wrapS=THREE.ClampToEdgeWrapping;at.wrapT=THREE.RepeatWrapping;
     const bm=new THREE.MeshLambertMaterial({map:at,transparent:true,opacity:1});const bd=ribbon(T,T.w/2,ry2,bm,200,inDeck);bd.renderOrder=1;root.add(bd);T.bridgeMat=bm;
     const ft=asphaltTex(true);ft.wrapS=ft.wrapT=THREE.ClampToEdgeWrapping;const fm=new THREE.MeshLambertMaterial({map:ft,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
     const ry3=Float32Array.from(ry2,v=>v+.2);
     for(const [s0,e0] of T.bspan){root.add(ribbon(T,T.w/2,ry3,fm,1,i=>i>=s0&&i<s0+F,i=>clamp((i-s0)/F,0,1)));root.add(ribbon(T,T.w/2,ry3,fm,1,i=>i>=e0-F&&i<e0,i=>clamp((e0-i)/F,0,1)))}
     const face=[],top=[],wall=[],fi=[],ti=[],wi=[];const pil=[];
     const quad=(arr,idx,a0,a1,b0,b1)=>{const o=arr.length/3;arr.push(...a0,...a1,...b0,...b1);idx.push(o,o+1,o+2,o+1,o+3,o+2)};
     for(const [s0,e0,j0,e1] of T.bspan){
       for(let k=s0;k<e0;k++){const k2=k+1;if(T.ry[k]<1.2&&T.ry[k2]<1.2)continue;
         for(const sd of [-1,1]){const P=(i,dl,y)=>{const hs=sideHalf(T,i,T.w/2),h=(sd<0?hs[0]:hs[1])+dl;return [T.xs[i]-T.ty[i]*sd*h,y,T.ys[i]+T.tx[i]*sd*h]};
           const y1=ry2[k],y2=ry2[k2];
           quad(face,fi,P(k,1,y1+.2),P(k,1,y1+5.2),P(k2,1,y2+.2),P(k2,1,y2+5.2));
           quad(top,ti,P(k,-.5,y1+5.3),P(k,2.6,y1+5.3),P(k2,-.5,y2+5.3),P(k2,2.6,y2+5.3));
           if((k<j0-4||k>=e1+4)&&T.ry[k]>.8){const g1=P(k,1,0),g2=P(k2,1,0);g1[1]=T.gh(g1[0],g1[2])-3;g2[1]=T.gh(g2[0],g2[2])-3;quad(wall,wi,P(k,1,y1+.2),g1,P(k2,1,y2+.2),g2)}}}
       for(const k of [Math.max(s0,j0-4),Math.min(e0,e1+4)])for(const sd of [-1,1]){const off=T.w/2-4;pil.push({x:T.xs[k]-T.ty[k]*sd*off,y:T.ys[k]+T.tx[k]*sd*off,h:T.ry[k]})}}
     const mk=(arr,idx,col)=>{if(!arr.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.setIndex(idx);const g2=g.toNonIndexed();g2.computeVertexNormals();root.add(new THREE.Mesh(g2,new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide})))};
     mk(face,fi,'#e8e6df');mk(top,ti,'#f26b1d');mk(wall,wi,'#a9a59b');
     root.add(instanced(new THREE.BoxGeometry(6,1,6),wmat('#9a9c98'),pil,(o,d)=>{d.position.set(o.x,o.h/2,o.y);d.scale.set(1,o.h,1);d.rotation.set(0,0,0)}))}}
  for(const o of T.decor)o.h=T.surfAt(o.x,o.y);
  const extra=[];const r=rng(T.hseed+7);
  for(let k=0;k<T.N;k+=2)for(const side of [-1,1]){if(r()<(S.opt.gfx==='l'?.6:S.opt.gfx==='m'?.3:.1))continue;const off=T.w/2+300+r()*950;const x=T.xs[k]-T.ty[k]*side*off+(r()-.5)*80,y=T.ys[k]+T.tx[k]*side*off+(r()-.5)*80;
    const d=fd(x,y);if(d<T.w/2+260)continue;const tp=B.decor[0]==='rock'?(r()<.5?'rock':'cactus'):B.decor[Math.floor(r()*2)];
    extra.push({x,y,t:tp,c:B.treeC[Math.floor(r()*B.treeC.length)],s:r(),r:tp==='rock'?10+r()*14:12+r()*7,h:T.surfAt(x,y)})}
  addDecor(root,[...T.decor,...extra],B);
  addWild(root,T,B,fd);
  {const r5=rng(T.hseed+404),ppl=[],pdx=[];const SH=['#e04a36','#2f6fd0','#f2c230','#ffffff','#2f9e57','#f26b1d','#8a4fd0'],SK=['#f1c7a0','#d9a47a','#a8754f','#f6d8bd'];
    for(let k=24;k<T.N-24;k+=8){if(T.rad[k]>320||r5()<.55)continue;const side=T.tdir[k]>0?-1:1;const off=T.w/2+42+r5()*26;const n=2+Math.floor(r5()*3);
      for(let q=0;q<n;q++){const t2=(q-(n-1)/2)*9+(r5()-.5)*4;const x=T.xs[k]-T.ty[k]*side*off+T.tx[k]*t2+(r5()-.5)*5,y=T.ys[k]+T.tx[k]*side*off+T.ty[k]*t2+(r5()-.5)*5;if(fd(x,y)<T.w/2+30)continue;
        ppl.push({x,y,h:T.surfAt(x,y),a:Math.atan2(T.ys[k]-y,T.xs[k]-x),col2:SH[Math.floor(r5()*SH.length)],sk:SK[Math.floor(r5()*SK.length)],L:7,W:5})}k+=12}
    if(ppl.length){const yaw=(o,d,y,sx,sy,sz)=>{d.position.set(o.x,o.h+y,o.y);d.scale.set(sx,sy,sz);d.rotation.set(0,-o.a,0)};
      root.add(instanced(new THREE.BoxGeometry(1,1,1),wmat('#2c3440'),ppl.map(o=>({x:o.x,y:o.y,h:o.h,a:o.a})),(o,d)=>yaw(o,d,2.6,1.6,5.2,2.6)));
      root.add(instanced(new THREE.BoxGeometry(1,1,1),wmat('#ffffff'),ppl,(o,d)=>yaw(o,d,7.4,2.2,4.8,3.6)));
      root.add(instanced(new THREE.BoxGeometry(1,1,1),wmat('#ffffff'),ppl.map(o=>({x:o.x,y:o.y,h:o.h,a:o.a,col2:o.sk})),(o,d)=>yaw(o,d,11.2,2.5,2.5,2.5)));
      addShadows(root,ppl)}}
  if(B.alpine){const r2=rng(T.hseed+71);const towers=[],cables=[],chairs=[];const bx=T.bounds;
    for(let line=0;line<2;line++){let x=bx.minx-200+r2()*(bx.maxx-bx.minx+400),y=bx.maxy+300,ang=-Math.PI/2+(r2()-.5)*.9;let prev=null;
      for(let k=0;k<26;k++){const d=fd(x,y);if(d>T.w/2+70){const h=T.gh(x,y);const top=h+62;const o={x,y,h,a:ang};towers.push(o);
          if(prev){const mx=(x+prev.x)/2,my=(y+prev.y)/2,mz=(top+prev.top)/2,len=Math.hypot(x-prev.x,y-prev.y,top-prev.top);cables.push({x:mx,y:my,z:mz,len,a:Math.atan2(y-prev.y,x-prev.x),p:Math.atan2(top-prev.top,Math.hypot(x-prev.x,y-prev.y))});
            for(const f of [.33,.66])chairs.push({x:prev.x+(x-prev.x)*f,y:prev.y+(y-prev.y)*f,z:prev.top+(top-prev.top)*f-7,a:ang})}
          prev={x,y,top}}else prev=null;
        x+=Math.cos(ang)*130;y+=Math.sin(ang)*130}}
    if(towers.length){root.add(instanced(new THREE.CylinderGeometry(1.8,2.6,62,6),wmat('#5d6670'),towers,(o,d)=>{d.position.set(o.x,o.h+31,o.y);d.scale.set(1,1,1);d.rotation.set(0,0,0)}));
      root.add(instanced(new THREE.BoxGeometry(3,3,26),wmat('#5d6670'),towers,(o,d)=>{d.position.set(o.x,o.h+62,o.y);d.scale.set(1,1,1);d.rotation.set(0,-o.a,0)}))}
    if(cables.length)root.add(instanced(new THREE.BoxGeometry(1,.6,.6),wmat('#2a2d30'),cables,(o,d)=>{d.position.set(o.x,o.z,o.y);d.scale.set(o.len,1,1);d.rotation.set(0,-o.a,o.p)}));
    if(chairs.length){root.add(instanced(new THREE.BoxGeometry(8,2,6),wmat('#d8352c'),chairs,(o,d)=>{d.position.set(o.x,o.z-6,o.y);d.scale.set(1,1,1);d.rotation.set(0,-o.a,0)}));
      root.add(instanced(new THREE.BoxGeometry(.6,7,.6),wmat('#2a2d30'),chairs,(o,d)=>{d.position.set(o.x,o.z-2.5,o.y);d.scale.set(1,1,1);d.rotation.set(0,0,0)}))}}
  {const signs=[];for(const n of T.notes){if(!n.ft)continue;const k=Math.max(0,n.i-2);for(const sd of [-1,1]){const off=T.w/2+12,sx=T.xs[k]-T.ty[k]*sd*off,sy=T.ys[k]+T.tx[k]*sd*off;signs.push({x:sx,y:sy,h:T.surfAt(sx,sy),a:T.ang[k],col2:n.ft==='DIP'?'#2f6fd0':n.ft==='JUMP'?'#f26b1d':'#f2c230'})}}
    if(signs.length){root.add(instanced(new THREE.BoxGeometry(1.4,12,1.4),wmat('#2a2d30'),signs,(o,d)=>{d.position.set(o.x,o.h+6,o.y);d.scale.set(1,1,1);d.rotation.set(0,0,0)}));
      root.add(instanced(new THREE.BoxGeometry(1,7,11),wmat('#ffffff'),signs,(o,d)=>{d.position.set(o.x,o.h+12,o.y);d.scale.set(1,1,1);d.rotation.set(0,-o.a,0)}))}}
  {const poles=T.poles;
    root.add(instanced(new THREE.CylinderGeometry(.8,.8,9,6),wmat('#f4f1ea'),poles,(o,d)=>{d.position.set(o.x,(o.h||0)+4.5,o.y);d.scale.set(1,1,1);d.rotation.set(o.tl,0,o.tl)}));
    root.add(instanced(new THREE.CylinderGeometry(.85,.85,3.4,6),wmat('#d8352c'),poles,(o,d)=>{d.position.set(o.x,(o.h||0)+7.4,o.y);d.scale.set(1,1,1);d.rotation.set(o.tl,0,o.tl)}));
    const cones=T.decor.filter(o=>o.t==='bale').filter((_,i)=>i%2===0).map(o=>({x:o.x+7,y:o.y-6,h:o.h||0}));
    if(cones.length)root.add(instanced(new THREE.ConeGeometry(2.2,5.5,8),wmat('#f26b1d'),cones,(o,d)=>{d.position.set(o.x,o.h+2.75,o.y);d.scale.set(1,1,1);d.rotation.set(0,0,0)}))}
  const posts=[],rails=[];const RC=B.alpine?['#f26b1d','#ff8a3d']:['#e04a36','#f4f1ea','#2f6fd0','#f2c230','#f26b1d'];
  for(const f of T.fences){posts.push({x:f.ax,y:f.ay},{x:f.bx,y:f.by});rails.push({x:(f.ax+f.bx)/2,y:(f.ay+f.by)/2,a:Math.atan2(f.by-f.ay,f.bx-f.ax),l:Math.hypot(f.bx-f.ax,f.by-f.ay),col2:RC[(f.k/4|0)%RC.length]})}
  if(posts.length){root.add(instanced(new THREE.BoxGeometry(2,12,2),wmat('#8a5a3b'),posts,(o,d)=>{d.position.set(o.x,6,o.y);d.scale.set(1,1,1);d.rotation.set(0,0,0)}));
    root.add(instanced(new THREE.BoxGeometry(1,1,1),wmat('#ffffff'),rails,(o,d)=>{d.position.set(o.x,7,o.y);d.scale.set(o.l,5,1);d.rotation.set(0,-o.a,0)}))}
  const arch=(i,text,bg)=>{const g=new THREE.Group();const nx=-T.ty[i],nz=T.tx[i];g.position.set(T.xs[i],T.ry[i],T.ys[i]);g.rotation.y=-Math.atan2(nz,nx);
    const Rr=T.w/2+14,H=44;const pm=new THREE.MeshLambertMaterial({map:pillarTex(bg,text==='FINISH')}),dk=wmat('#2a2d30');
    for(const sx of [-Rr,Rr]){const p=new THREE.Mesh(new THREE.BoxGeometry(8,H,8),pm);p.position.set(sx,H/2,0);g.add(p);const f=new THREE.Mesh(new THREE.BoxGeometry(14,3,14),dk);f.position.set(sx,1.5,0);g.add(f)}
    const bt=new THREE.MeshLambertMaterial({map:bannerTex(text,bg)});const beam=new THREE.Mesh(new THREE.BoxGeometry(Rr*2+8,13,5),[dk,dk,dk,dk,bt,bt]);beam.position.set(0,H-2,0);g.add(beam);root.add(g)};
  arch(6,'START','#c8471a');arch(T.N-7,'FINISH','#1f2326');
  {const P=pfInfo(T),cx=P.ex+P.dx*P.L/2,cy=P.ey+P.dy*P.L/2,py=T.gh(cx,cy)+.5;
    const pad=new THREE.Mesh(new THREE.PlaneGeometry(P.L,P.Wd),new THREE.MeshLambertMaterial({color:T.B.track||'#b98a5a',depthTest:false}));pad.rotation.order='YXZ';pad.rotation.set(-Math.PI/2,-Math.atan2(P.dy,P.dx),0);pad.position.set(cx,py,cy);pad.renderOrder=-1.5;root.add(pad);
    const near=(x,y)=>{for(let k=0;k<T.N-25;k+=2){const dx=T.xs[k]-x,dy=T.ys[k]-y;if(dx*dx+dy*dy<(T.w/2+14)**2)return true}return false};
    const bl=[],hw=P.Wd/2+6,ang=Math.atan2(P.dy,P.dx);
    for(let f=20;f<=P.L;f+=15)for(const sd of [-1,1]){const x=P.ex+P.dx*f+P.nx*hw*sd,y=P.ey+P.dy*f+P.ny*hw*sd;if(!near(x,y))bl.push({x,y,a:ang,h:T.gh(x,y)})}
    for(let l=-hw;l<=hw;l+=10){const x=P.ex+P.dx*(P.L+6)+P.nx*l,y=P.ey+P.dy*(P.L+6)+P.ny*l;if(!near(x,y))bl.push({x,y,a:ang+Math.PI/2,h:T.gh(x,y)})}
    if(bl.length){root.add(instanced(new THREE.BoxGeometry(14,8,9),wmat('#e2bf55'),bl,(o,d)=>{d.position.set(o.x,o.h+4,o.y);d.scale.set(1,1,1);d.rotation.set(0,-o.a,0)}));
      root.add(instanced(new THREE.BoxGeometry(14.4,1.2,9.4),wmat('#b8923a'),bl,(o,d)=>{d.position.set(o.x,o.h+5.5,o.y);d.scale.set(1,1,1);d.rotation.set(0,-o.a,0)}))}
    const fx=P.ex+P.dx*(P.L+14),fy=P.ey+P.dy*(P.L+14);if(!near(fx,fy)){const g=new THREE.Group();g.position.set(fx,T.gh(fx,fy),fy);g.rotation.y=-Math.atan2(P.ny,P.nx);
      const bn=new THREE.Mesh(new THREE.PlaneGeometry(110,16),new THREE.MeshBasicMaterial({map:bannerTex('PARC FERMÉ','#2a2d30'),side:THREE.DoubleSide}));bn.position.set(0,26,0);g.add(bn);
      for(const sx of [-52,52]){const pst=new THREE.Mesh(new THREE.BoxGeometry(2.4,34,2.4),wmat('#3a3e42'));pst.position.set(sx,17,0);g.add(pst)}root.add(g)}}
  const flags=[];const FC=['#e04a36','#2f6fd0','#f2c230','#ffffff'];
  for(const base of [6,T.N-7])for(let q=0;q<6;q++){const k=clamp(base+(q-3)*5,0,T.N-1);const side=q%2?1:-1;const off=T.w/2+44+(q%3)*6;flags.push({x:T.xs[k]-T.ty[k]*side*off,y:T.ys[k]+T.tx[k]*side*off,col2:FC[q%4],a:T.ang[k]})}
  root.add(instanced(new THREE.CylinderGeometry(.7,.7,34,5),wmat('#e8e6df'),flags.map(f=>({x:f.x,y:f.y})),(o,d)=>{d.position.set(o.x,17,o.y);d.scale.set(1,1,1);d.rotation.set(0,0,0)}));
  root.add(instanced(new THREE.BoxGeometry(12,7,.5),wmat('#ffffff'),flags,(o,d)=>{d.position.set(o.x+Math.cos(o.a)*6,29,o.y+Math.sin(o.a)*6);d.scale.set(1,1,1);d.rotation.set(0,-o.a,0)}));
  const CAP=4000;const sp=new Float32Array(CAP*12);const si=[];for(let q=0;q<CAP;q++){const a=q*4;si.push(a,a+1,a+2,a+1,a+3,a+2)}
  const sgeo=new THREE.BufferGeometry();sgeo.setAttribute('position',new THREE.BufferAttribute(sp,3));sgeo.setIndex(si);sgeo.setDrawRange(0,0);
  const skid=new THREE.Mesh(sgeo,new THREE.MeshBasicMaterial({color:0x2d2418,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8}));skid.frustumCulled=false;scene.add(skid);
  const PN=360;const pm=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),wmat('#ffffff'),PN);pm.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for(let q=0;q<PN;q++){dummy.position.set(0,-999,0);dummy.scale.set(0,0,0);dummy.rotation.set(0,0,0);dummy.updateMatrix();pm.setMatrixAt(q,dummy.matrix);pm.setColorAt(q,tmpC.set('#ffffff'))}pm.instanceColor.needsUpdate=true;pm.frustumCulled=false;scene.add(pm);
  const dust=[];for(let q=0;q<PN;q++)dust.push({alive:false,shown:false,x:0,y:0,z:0,vx:0,vy:0,vz:0,life:0,max:1,size:1,rot:0});
  return {gh:T.gh,scene,pm,skid:{geo:sgeo,pos:sp,n:0,cap:CAP},dust,dustI:0,car:null,ghost:null,peers:new Map(),camYaw:0,camInit:false,def:null};
}
let W=null;
function setWorld(nw){if(W&&W!==nw)disposeTree(W.scene);W=nw}
function addSkid(x1,y1,x2,y2,h){if(!S.opt.skid)return;const K2=W.skid;const q=K2.n%K2.cap,o=q*12;const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1,px=-dy/l*1.7,py=dx/l*1.7,y=(h||0)+1.05;
  const P=K2.pos;P[o]=x1-px;P[o+1]=y;P[o+2]=y1-py;P[o+3]=x1+px;P[o+4]=y;P[o+5]=y1+py;P[o+6]=x2-px;P[o+7]=y;P[o+8]=y2-py;P[o+9]=x2+px;P[o+10]=y;P[o+11]=y2+py;
  K2.n++;K2.geo.setDrawRange(0,Math.min(K2.n,K2.cap)*6);K2.geo.attributes.position.needsUpdate=true}
function spawnDust(x,y,vx,vy,col,big,h){if(!S.opt.dust)return;const i=W.dustI++%W.dust.length,d=W.dust[i];d.alive=true;d.shown=true;d.x=x;d.z=y;d.y=(h||0)+(big?3:2);d.vx=vx;d.vz=vy;d.vy=big?10+Math.random()*8:6+Math.random()*8;d.life=0;
  d.max=big?1.1+Math.random()*.8:.5+Math.random()*.6;d.size=big?5.5+Math.random()*4:2.6+Math.random()*2.4;d.rot=Math.random()*6;
  W.pm.setColorAt(i,tmpC.setRGB(col[0]/255,col[1]/255,col[2]/255));W.pm.instanceColor.needsUpdate=true}
function updDust(dt){let ch=false;for(let i=0;i<W.dust.length;i++){const d=W.dust[i];
  if(!d.alive){if(d.shown){d.shown=false;dummy.position.set(0,-999,0);dummy.scale.set(0,0,0);dummy.updateMatrix();W.pm.setMatrixAt(i,dummy.matrix);ch=true}continue}
  d.life+=dt;if(d.life>d.max){d.alive=false;continue}
  d.x+=d.vx*dt;d.y+=d.vy*dt;d.z+=d.vz*dt;d.vx*=.95;d.vz*=.95;d.vy*=.97;
  const k=d.life/d.max;const s=d.size*Math.min(1,k/.12)*(1-k)*(1+k*.7);
  dummy.position.set(d.x,d.y,d.z);dummy.scale.set(s,s*.85,s);dummy.rotation.set(d.rot,d.rot+k*2,0);dummy.updateMatrix();W.pm.setMatrixAt(i,dummy.matrix);ch=true}
  if(ch)W.pm.instanceMatrix.needsUpdate=true}

/* ---------------- showroom (menus) ---------------- */
const SR={scene:null,car:null,yaw:.5};
function buildShowroom(){
  const B=BIOMES.forest,scene=new THREE.Scene();lights(scene,'#cdd6d9',300,1100);
  const df=(x,z)=>Math.max(0,Math.hypot(x,z*1.2)-20);
  scene.add(groundMesh(B,-1300,-1300,1300,1300,df,3,90));
  const pad=new THREE.Mesh(new THREE.CircleGeometry(95,28),new THREE.MeshLambertMaterial({color:'#d8cbb2'}));pad.rotation.x=-Math.PI/2;pad.position.y=.4;scene.add(pad);
  const r=rng(42);const list=[];
  for(let i=0;i<150;i++){const a=-Math.PI*(.05+r()*.9),d=150+r()*620;const x=Math.cos(a)*d*1.3,y=Math.sin(a)*d;list.push({x,y,t:r()<.82?'pine':'tree',c:B.treeC[Math.floor(r()*3)],s:r(),r:10+r()*7,h:heightAt(x,y,df(x,y),3)})}
  for(let i=0;i<20;i++){const a=r()*Math.PI*2,d=110+r()*150;list.push({x:Math.cos(a)*d,y:Math.sin(a)*d,t:'rock',s:r(),r:5+r()*8,h:0})}
  list.push({x:-50,y:72,t:'bale',a:.1},{x:-36,y:74,t:'bale',a:.1},{x:44,y:70,t:'bale',a:-.2},{x:58,y:66,t:'bale',a:-.2});
  addDecor(scene,list,B);
  SR.scene=scene;setShowCar();
}
let PV=null;
function showStyle(){if(!PV)return myStyle();const st=myStyle();const m={body:'body',rim:'rim',liv:'liv',wing:'wing',decal:'decal',lights:'lights'};if(PV.cat==='paint'){st.paintId=PV.id;st.paint=paintHex(PV.id)}else if(m[PV.cat])st[m[PV.cat]]=PV.id;return st}
function setShowCar(){if(!SR.scene)return;const st=showStyle();
  if(MODELS[st.body]&&!MODELS[st.body].tpl&&SR.car&&!SR.car.userData.placeholder){loadModel(st.body);return}
  const swap=screen==='garage'&&SR.car&&WS.lastBody&&WS.lastBody!==st.body;
  if(WS.old){if(WS.old.parent)WS.old.parent.remove(WS.old);disposeTree(WS.old);WS.old=null}
  if(SR.car){if(SR.car.parent)SR.car.parent.remove(SR.car);disposeTree(SR.car)}
  SR.car=makeCar(st,false);SR.scene.add(SR.car);WS.lastBody=st.body;WS.sw=swap?performance.now():0}
function buildWorkshop(){
  const sc=new THREE.Scene();sc.background=new THREE.Color('#2b3036');
  sc.add(new THREE.HemisphereLight(0xffffff,0x4a4f55,.72));
  const d=new THREE.DirectionalLight(0xfff4e2,.5);d.position.set(60,160,120);sc.add(d);
  const pl=new THREE.PointLight(0xfff1d6,.55,420);pl.position.set(0,110,10);sc.add(pl);
  const M=(c,o)=>phong(c,o);
  const add=(geo,mat,x,y,z,ry)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;sc.add(m);return m};
  const B=(w,h,dd,c,x,y,z,ry)=>add(new THREE.BoxGeometry(w,h,dd),typeof c==='string'?M(c):c,x,y,z,ry);
  const floorTex=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#9a9fa2';g.fillRect(0,0,w,h);const r=rng(9);
    for(let i=0;i<1600;i++){g.fillStyle=r()<.5?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)';g.fillRect(r()*w,r()*h,2,2)}
    g.strokeStyle='rgba(40,44,48,.35)';g.lineWidth=3;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*w/4,0);g.lineTo(i*w/4,h);g.stroke();g.beginPath();g.moveTo(0,i*h/4);g.lineTo(w,i*h/4);g.stroke()}
    for(let i=0;i<7;i++){g.fillStyle='rgba(30,30,35,.18)';g.beginPath();g.ellipse(r()*w,r()*h,10+r()*30,6+r()*18,r()*3,0,7);g.fill()}});
  floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping;floorTex.repeat.set(3,3);
  const fl=add(new THREE.PlaneGeometry(340,280),new THREE.MeshPhongMaterial({map:floorTex,shininess:20,specular:0x222222}),0,0,-20);fl.rotation.x=-Math.PI/2;
  const haz=canvasTex(256,32,(g,w,h)=>{g.fillStyle='#f2c230';g.fillRect(0,0,w,h);g.fillStyle='#1d1f22';for(let x=-32;x<w+32;x+=32){g.beginPath();g.moveTo(x,h);g.lineTo(x+16,h);g.lineTo(x+32,0);g.lineTo(x+16,0);g.closePath();g.fill()}});
  haz.wrapS=THREE.RepeatWrapping;
  const wallTex=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#5f6e7b';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=16){g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x,0,6,h);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x+8,0,4,h)}});
  wallTex.wrapS=wallTex.wrapT=THREE.RepeatWrapping;wallTex.repeat.set(6,2);
  B(340,140,4,new THREE.MeshPhongMaterial({map:wallTex,shininess:10}),0,70,-160);
  const sideTex=wallTex.clone();sideTex.needsUpdate=true;sideTex.repeat.set(5,2);const sideM=new THREE.MeshPhongMaterial({map:sideTex,shininess:10});
  B(4,140,280,sideM,-170,70,-20);B(4,140,280,sideM,170,70,-20);
  for(const [x,z,w,ry] of [[0,-157.5,340,0],[-167.5,-20,280,Math.PI/2],[167.5,-20,280,Math.PI/2]]){const h2=haz.clone();h2.needsUpdate=true;h2.repeat.set(w/40,1);B(w,6,.6,new THREE.MeshPhongMaterial({map:h2,shininess:0}),x,3,z,ry)}
  const doorTex=canvasTex(128,256,(g,w,h)=>{g.fillStyle='#b9c0c6';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=10){g.fillStyle='rgba(0,0,0,.16)';g.fillRect(0,y,w,2);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(0,y+2,w,2)}});
  B(120,88,2,new THREE.MeshPhongMaterial({map:doorTex,shininess:20}),0,44,-157);
  B(128,6,4,'#3b4148',0,91,-156);B(5,92,4,'#3b4148',-62,46,-156);B(5,92,4,'#3b4148',62,46,-156);
  const sign=canvasTex(512,96,(g,w,h)=>{g.fillStyle='#1d2126';g.fillRect(0,0,w,h);g.fillStyle='#f26b1d';g.fillRect(0,h-10,w,10);g.fillStyle='#fff';g.font='bold 54px "Lilita One", Impact, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('DUST RUSH GARAGE',w/2,h/2-4)});
  add(new THREE.PlaneGeometry(110,20.6),new THREE.MeshBasicMaterial({map:sign}),0,112,-157.5);
  const lm=new THREE.MeshBasicMaterial({color:0xfffbea});for(const x of [-70,0,70])for(const z of [-90,10]){B(40,2,6,lm,x,135,z);B(42,1,8,'#3b4148',x,136.6,z)}
  add(new THREE.CylinderGeometry(36,37,1.4,40),M('#3a3f45'),0,.7,0);
  const ring=add(new THREE.TorusGeometry(35.5,.8,6,48),new THREE.MeshPhongMaterial({color:'#f2c230',shininess:30}),0,1.45,0);ring.rotation.x=Math.PI/2;
  B(36,40,16,'#c8322b',-128,20,-145);for(let i=0;i<5;i++)B(32,.6,.5,'#7a1e19',-128,8+i*7,-136.8);B(36,2,17,'#2a2d30',-128,41,-145);
  B(26,30,14,'#c8322b',-128,58,-148);
  B(60,3,20,'#8a5a3b',110,26,-146);for(const [x,z] of [[84,-138],[136,-138],[84,-154],[136,-154]])B(2.5,25,2.5,'#2a2d30',x,12.5,z);
  B(56,30,1,'#e7e1d2',110,52,-157);for(let i=0;i<7;i++)B(1.2,8+((i*5)%7),1.2,i%2?'#2a2d30':'#c8322b',90+i*6.5,52,-156);
  B(8,5,8,'#3b4148',96,30,-140);
  const tyre=M('#1b1d20'),rimM=M('#8f969c');
  for(const [x,z,n] of [[-140,-60,4],[-142,-30,3],[-118,-110,5]])for(let i=0;i<n;i++){add(new THREE.CylinderGeometry(8,8,5,16),tyre,x,2.5+i*5.2,z);add(new THREE.CylinderGeometry(4.6,4.6,5.2,10),rimM,x,2.5+i*5.2,z)}
  for(const [x,z,c] of [[140,-70,'#2f6fd0'],[150,-52,'#c8322b'],[132,-48,'#2f8a4c']]){add(new THREE.CylinderGeometry(7,7,22,14),M(c),x,11,z);add(new THREE.TorusGeometry(7,.5,6,20),M('#1d1f22'),x,15,z).rotation.x=Math.PI/2}
  for(const [x,z] of [[-60,40],[60,44]]){add(new THREE.ConeGeometry(3.4,9,10),M('#f26b1d'),x,4.5,z);B(7,.8,7,'#1d1f22',x,.4,z)}
  B(18,14,18,'#b98a5c',150,7,-120);B(14,10,14,'#a97b4f',148,19,-122);
  B(30,2,10,'#c8322b',-55,1.2,-40);B(4,6,4,'#2a2d30',-42,4,-40);
  const rr=(w,h,r)=>{const sh=new THREE.Shape(),x=-w/2,y=-h/2;sh.moveTo(x+r,y);sh.lineTo(x+w-r,y);sh.quadraticCurveTo(x+w,y,x+w,y+r);sh.lineTo(x+w,y+h-r);sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);sh.lineTo(x+r,y+h);sh.quadraticCurveTo(x,y+h,x,y+h-r);sh.lineTo(x,y+r);sh.quadraticCurveTo(x,y,x+r,y);return sh};
  const plat=new THREE.Mesh(new THREE.ExtrudeGeometry(rr(150,104,20),{depth:5,bevelEnabled:true,bevelThickness:2.5,bevelSize:2.5,bevelSegments:3,curveSegments:10}),new THREE.MeshLambertMaterial({color:'#e9eaec'}));plat.rotation.x=-Math.PI/2;plat.position.y=-1.5;sc.add(plat);
  const lip=new THREE.Mesh(new THREE.ExtrudeGeometry(rr(132,88,14),{depth:.6,bevelEnabled:false,curveSegments:10}),new THREE.MeshLambertMaterial({color:'#dfe0e3'}));lip.rotation.x=-Math.PI/2;lip.position.y=6;sc.add(lip);
  const shd=new THREE.Mesh(new THREE.PlaneGeometry(70,46),new THREE.MeshBasicMaterial({map:blobTex,color:0x2a2e33,transparent:true,opacity:.45,depthWrite:false}));shd.rotation.x=-Math.PI/2;shd.position.y=6.75;sc.add(shd);
  WS.shd=shd;
  WS.scene=sc;
}

const WS={scene:null,yaw:.6,vel:0,drag:false,t0:0};const G={tab:'paint',enter:false};
function drawShowroom(dt,t){
  const garage=screen==='garage';
  if(garage&&!WS.scene)buildWorkshop();
  const scene=garage?WS.scene:SR.scene;
  if(SR.car.parent!==scene)scene.add(SR.car);
  const narrow=VW<760;
  if(garage){
    const k=clamp((performance.now()-WS.t0)/950,0,1),e=1-Math.pow(1-k,3);
    const Y0=.62;let dy=0,pt=0;
    if(WS.sw){const t=(performance.now()-WS.sw)/1000;if(t<.22){const u=t/.22;dy=5*(1-u*u)}else if(t<.4){const u=(t-.22)/.18;dy=.8*Math.sin(Math.PI*u)}else WS.sw=0;
      if(t>=.2&&t<.3)pt=-.02*Math.sin(Math.PI*(t-.2)/.1)}
    poseCar(SR.car,0,0,6.7+dy,Y0+(1-e)*1.1,(1-e)*60,0,0,dt);if(pt)SR.car.userData.body.rotation.z+=pt;
    if(WS.shd){const k2=1-Math.min(1,dy/5)*.35;WS.shd.scale.set(k2,k2,1);WS.shd.material.opacity=.45*k2}
    const dm=1+(1-e)*.45;camSet(46,8);cam3.position.set(-4*dm,(narrow?58:44)*dm,(narrow?140:112)*dm);cam3.lookAt(0,narrow?8:12,0);
    if(narrow)cam3.setViewOffset(VW,VH,0,VH*.13,VW,VH);else cam3.setViewOffset(VW,VH,0,VH*.03,VW,VH);
  }else{
    poseCar(SR.car,0,0,0,-.55+Math.sin(t*.25)*.12,0,0,0,dt);camSet(52,8);
    cam3.position.set(Math.sin(t*.07)*8,narrow?44:34,narrow?135:105);
    cam3.lookAt(0,narrow?18:10,0);cam3.clearViewOffset();
  }
  gl.render(scene,cam3);
}
function bindGarageDrag(){
  const el=UI.querySelector('.glist');if(!el)return;let acc=0;
  {const inn=el.querySelector('.in'),si=+inn.dataset.sel;G.prevSel=si;G.lastNm=garageCarId();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{inn.style.setProperty('--sel',si);for(const b of inn.querySelectorAll('.gl'))b.style.setProperty('--a',b.dataset.at)}))}
  el.addEventListener('wheel',e=>{if(matchMedia('(max-width:760px)').matches)return;e.preventDefault();acc+=e.deltaY;if(Math.abs(acc)>60){garageStep(acc>0?1:-1);acc=0}},{passive:false});
  G.enter=false}
function garageCarId(){return PV&&PV.cat==='body'?PV.id:S.eq.body}
function garagePick(id){loadModel(id);if(S.owned[id]||SHOP.body.find(x=>x[0]===id)[2]===0){S.owned[id]=1;PV=null;S.eq.body=id;save();if(MP.room)mpPresence({bd:S.eq.body})}else PV={cat:'body',id};setShowCar();renderScreen()}
function garageStep(d){const L=SHOP.body;const i=L.findIndex(x=>x[0]===garageCarId());const n=clamp(i+d,0,L.length-1);if(n!==i)garagePick(L[n][0])}

const K={up:false,down:false,left:false,right:false,hb:false};
const IN={steer:0};
let KEYMAP={};function buildKeymap(){KEYMAP={};for(const a of ['up','down','left','right','hb'])for(const c of S.keys[a])if(c)KEYMAP[c]=a}buildKeymap();
const isKey=(a,code)=>S.keys[a]&&S.keys[a].includes(code);
function keyLabel(c){if(!c)return '—';const m={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Space:'Space',Backspace:'⌫ Back',Enter:'Enter',ShiftLeft:'L Shift',ShiftRight:'R Shift',ControlLeft:'L Ctrl',ControlRight:'R Ctrl',AltLeft:'L Alt',AltRight:'R Alt',Tab:'Tab'};if(m[c])return m[c];if(c.startsWith('Key'))return c.slice(3);if(c.startsWith('Digit'))return c.slice(5);if(c.startsWith('Numpad'))return 'Num '+c.slice(6);return c}
const KB={wait:null};
function cycleView(){const i=VIEWS.indexOf(S.opt.view);S.opt.view=VIEWS[(i+1)%VIEWS.length];save();W&&(W.camInit=false);toast('Camera: '+VNAME[S.opt.view])}
addEventListener('keydown',e=>{
  if(KB.wait){e.preventDefault();e.stopPropagation();const {a,i}=KB.wait;KB.wait=null;if(e.code!=='Escape'){for(const x in S.keys)for(let j=0;j<2;j++)if(S.keys[x][j]===e.code)S.keys[x][j]=null;S.keys[a][i]=e.code;save();buildKeymap()}renderScreen();return}
  if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT'))return;
  if(mode==='menu'&&screen==='garage'&&(e.code==='ArrowUp'||e.code==='ArrowDown')){garageStep(e.code==='ArrowUp'?-1:1);e.preventDefault();return}
  audioInit();
  const k=KEYMAP[e.code];if(k&&mode==='race'){K[k]=true;e.preventDefault()}
  if(mode==='race'&&R){
    if(e.code==='Escape'||isKey('pause',e.code)){togglePause();e.preventDefault()}
    else if(isKey('camera',e.code)){cycleView();e.preventDefault()}
    else if(isKey('restart',e.code)&&R.kind!=='mp'&&!R.paused){restartRace();e.preventDefault()}
    else if(e.code==='Enter'&&R.state==='done'&&R.kind!=='mp'){restartRace()}
  }
},true);
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)K[k]=false});
addEventListener('blur',()=>{for(const k in K)K[k]=false});
const TOUCHY=('ontouchstart' in window)||matchMedia('(pointer: coarse)').matches;
if(TOUCHY)document.body.classList.add('touchy');

/* ---------------- audio ---------------- */
let AC=null,eng=null;
function audioInit(){if(AC||S.mute)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator();o.type='sawtooth';const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=480;const g=AC.createGain();g.gain.value=0;o.connect(f);f.connect(g);g.connect(AC.destination);o.start();eng={o,g}}catch(e){AC=null}}
function beep(fq,d){if(!AC||S.mute)return;try{const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=fq;g.gain.value=.05*S.opt.vol.fx;if(g.gain.value<.0005)return;o.connect(g);g.connect(AC.destination);o.start();g.gain.setTargetAtTime(0,AC.currentTime+d,.03);o.stop(AC.currentTime+d+.25)}catch(e){}}
let NB=null;
function blowoff(){if(!AC||S.mute)return;try{const t=AC.currentTime;if(!NB){NB=AC.createBuffer(1,Math.floor(AC.sampleRate*.5),AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(3400,t);f.frequency.exponentialRampToValueAtTime(900,t+.35);f.Q.value=1.3;
  const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,.2*S.opt.vol.fx),t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.42);s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+.45)}catch(e){}}
function engineUpdate(){if(!eng)return;const on=mode==='race'&&R&&!R.paused&&!S.mute;const sp=on?Math.min(1,Math.abs(R.car.vf)/MAXV):0;
  try{eng.o.frequency.setTargetAtTime(46+sp*140+(K.up&&on?10:0),AC.currentTime,.05);eng.g.gain.setTargetAtTime(on?(.03+sp*.03)*S.opt.vol.engine:0,AC.currentTime,.08)}catch(e){}}

/* ---------------- physics ---------------- */
const MAXV=560,STEP=1/120,GRAV=650;
const SURF=[{grip:4.5,max:1,roll:.35},{grip:3.8,max:.8,roll:.7},{grip:2.9,max:.5,roll:1.6}];
function newCar(T,slot){let i=3,x=T.xs[3],y=T.ys[3];if(slot!=null){const row=Math.floor(slot/5)%2,col=slot%5;i=row?0:4;const off=[0,-.18,.18,-.36,.36][col]*T.w;x=T.xs[i]-T.ty[i]*off;y=T.ys[i]+T.tx[i]*off}
  return {z:T.surfAt(x,y,i),vz:0,air:false,x,y,a:T.ang[i],vx:0,vy:0,av:0,idx:i,vf:0,vr:0,surf:0,pw:null,h:0,mk:0}}
function stepCar(c,inp,dt,T){
  const nr=trackNear(T,c.x,c.y,c.idx);if(nr.d<T.w/2+60)c.idx=nr.i;c.offd=nr.d;
  const half=T.w/2;c.surf=nr.d<half?0:nr.d<half+16?1:2;const sf=SURF[c.surf];
  const fx=Math.cos(c.a),fy=Math.sin(c.a);
  let vf=c.vx*fx+c.vy*fy,vr=-c.vx*fy+c.vy*fx;const max=MAXV*sf.max;
  if(c.air){c.vf=vf;c.vr=vr;c.av*=.995;c.a+=c.av*dt}else{
  if(inp.up)vf+=(520-Math.max(0,vf)*520/max)*dt;else if(!inp.down)vf-=vf*sf.roll*dt;
  if(inp.down){if(vf>15)vf-=900*dt;else vf=Math.max(-170,vf-260*dt)}
  let grip=sf.grip*T.grip;
  if(inp.hb){grip*=.3;const dec=Math.min(Math.abs(vf),(Math.abs(vf)>40?260:520)*dt);vf-=Math.sign(vf)*dec}
  vr-=vr*Math.min(1,grip*dt);
  const sp=Math.abs(vf),k=Math.min(1,sp/95);
  let tr=inp.steer*3.7*(c.ai?1:SENS())*k*(1-.3*Math.min(1,sp/MAXV))*(vf<-5?-1:1);
  const hbOn=inp.hb&&sp>35;if(hbOn)tr*=1.6;
  c.av+=(tr-c.av)*Math.min(1,(hbOn?1.8:8)*dt);if(hbOn){c.av+=clamp(-vr/Math.max(80,sp),-1,1)*2.4*dt*Math.min(1,sp/160);c.av=clamp(c.av,-3.6,3.6)}c.a+=c.av*dt;
  c.vx=fx*vf-fy*vr;c.vy=fy*vf+fx*vr;c.vf=vf;c.vr=vr}
  c.x+=c.vx*dt;c.y+=c.vy*dt;
  if(T.bridge&&T.bridge[c.idx]&&T.ry[c.idx]>4){const i=c.idx,nx=-T.ty[i],ny=T.tx[i],l=(c.x-T.xs[i])*nx+(c.y-T.ys[i])*ny,sg=l<0?-1:1;const hs=sideHalf(T,i,T.w/2),half=sg<0?hs[0]:hs[1];
    const bounce=(out)=>{const vn=c.vx*nx+c.vy*ny;if(vn*sg*out>0){c.vx-=1.5*vn*nx;c.vy-=1.5*vn*ny;c.vx*=.88;c.vy*=.88;c.av*=.5;if(!c.ai&&Math.abs(vn)>80)beep(90,.06)}};
    if((c.z||0)>T.ry[i]-8){const lim=half-6;if(Math.abs(l)>lim){const d=l-sg*lim;c.x-=nx*d;c.y-=ny*d;bounce(1)}}
    else{const lim=half+8;if(Math.abs(l)<lim){const d=sg*lim-l;c.x+=nx*d;c.y+=ny*d;bounce(-1)}}}
  {const gH=T.surfAt(c.x,c.y,c.idx);if(c.z==null){c.z=gH;c.vz=0;c.air=false}
   if(c.air){c.vz-=GRAV*dt;c.z+=c.vz*dt;if(c.z<=gH){c.z=gH;c.air=false;c.vz=0}}
   else{const nv=clamp((gH-c.z)/dt,-300,240);if(c.vz>40&&nv<c.vz-GRAV*dt){c.air=true;c.vz-=GRAV*dt;c.z+=c.vz*dt}else{c.vz=nv;c.z=gH}}}
  const cx=Math.floor(c.x/CELL),cy=Math.floor(c.y/CELL);
  for(let ix=-1;ix<=1;ix++)for(let iy=-1;iy<=1;iy++){const a=T.dg.get(T.key(cx+ix,cy+iy));if(!a)continue;
    for(const o of a){if(o.t==='pole'){const px=c.x-o.x,py=c.y-o.y;if(px*px+py*py<(o.r+9)*(o.r+9)){const now=performance.now();if(!o.hit||now-o.hit>700){o.hit=now;c.vx*=.95;c.vy*=.95;if(!c.ai)beep(150,.05)}}continue}
      const dx=c.x-o.x,dy=c.y-o.y,d=Math.hypot(dx,dy),m=o.r+10;if(d<m&&d>.01){const nx=dx/d,ny=dy/d;c.x+=nx*(m-d);c.y+=ny*(m-d);const vn=c.vx*nx+c.vy*ny;
      if(vn<0){c.vx-=1.5*vn*nx;c.vy-=1.5*vn*ny;c.vx*=.82;c.vy*=.82;if(-vn>80){shake=Math.min(8,-vn/40);beep(90,.06)}}}}}
}

/* ---------------- race ---------------- */
let mode='menu',R=null,shake=0;
function ghostKey(id){return 'pv.g9.'+id}
function loadGhosts(id){return sget(ghostKey(id),{})}
function saveGhosts(id,G){sset(ghostKey(id),G)}
let racePending=false;
function startRace(o){
  if(W&&W.def===o.def){startRaceNow(o);return}
  if(racePending)return;racePending=true;
  if(window.__loader){__loader.paint(paintHex(S.eq.paint));__loader.show()}
  const need=new Set([myStyle().body]);if(o.kind==='mp'&&MP.room)for(const p of MP.room.peers())if(p.presence&&p.presence.bd)need.add(String(p.presence.bd));
  const wait=Promise.race([Promise.all([...need].map(loadModel)),new Promise(r=>setTimeout(r,12000))]);
  setTimeout(()=>wait.finally(()=>{try{startRaceNow(o)}finally{racePending=false;window.__loader&&__loader.hide(1100)}}),80);
}
function startRaceNow(o){
  audioInit();
  const T=buildTrack(o.def,o.gripMul);
  if(W&&W.def===o.def){W.skid.n=0;W.skid.geo.setDrawRange(0,0);for(const d of W.dust)d.alive=false}
  else{const nw=buildWorld(T);nw.def=o.def;setWorld(nw)}
  T.gh=W.gh;
  if(W.car){W.scene.remove(W.car);disposeTree(W.car)}W.car=makeCar(myStyle(),false);W.scene.add(W.car);{const sh=new THREE.Mesh(new THREE.PlaneGeometry(34,22),new THREE.MeshBasicMaterial({map:blobTex,color:0x1d2a20,transparent:true,opacity:.38,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.5;W.car.add(sh)}
  if(W.ghost){W.scene.remove(W.ghost);disposeTree(W.ghost);W.ghost=null}
  for(const d of W.peers.values()){W.scene.remove(d.g);disposeTree(d.g)}W.peers.clear();
  const G=(o.kind==='mp'||o.kind==='free')?{}:loadGhosts(o.def.id);
  const gh=S.ghostMode==='off'?null:(S.ghostMode==='last'?G.last:G.best)||G.best||null;
  if(gh){W.ghost=makeCar(myStyle(),true);W.scene.add(W.ghost)}
  R={...o,T,car:newCar(T,o.slot),t:0,state:'count',cd:3.3,rec:[],prog:[],maxIdx:3,recTick:0,ghost:gh,ghosts:G,paused:false,delta:null,deltaT:0,lastBeep:4,pres:0,ft:null,off:0,pen:0,penT:0};
  W.camInit=false;W.cYaw=null;W.cPos=null;IN.steer=0;ov.classList.remove('edit');
  mode='race';screen='race';renderHUD();document.body.classList.add('racing');
  if(o.kind==='mp')mpPresence({ld:MP.curGo});
}
function restartRace(){if(!R)return;startRace({def:R.def,kind:R.kind,title:R.title,idx:R.idx,gripMul:R.gripMul,back:R.back})}
function resetToTrack(){const c=R.car,T=R.T,i=clamp(c.idx,3,T.N-8);c.x=T.xs[i];c.y=T.ys[i];c.a=T.ang[i];c.vx=c.vy=c.av=0;c.pw=null;c.px=c.py=c.pa=c.pz=null;c.z=T.surfAt(c.x,c.y,i);c.vz=0;c.air=false}
function tick(dt){
  const c=R.car;
  const tgt=(K.right?1:0)-(K.left?1:0);
  {const rr=dt*10*SENS();IN.steer+=clamp(tgt-IN.steer,-rr,rr)}
  if(R.state==='count'&&window.__loader&&__loader.busy())return;
  if(R.state==='count'&&R.kind!=='mp'){if(!K.up)return;R.state='run';R.t=0;R.rec.push(Math.round(c.x),Math.round(c.y),Math.round(c.a*100),Math.round((c.z||0)*10));beep(880,.3)}
  if(R.state==='count'&&R.kind==='mp'&&!R.sync){R.wt=(R.wt||0)+dt;R.wc=(R.wc||0)-dt;
    if(R.wc<=0){R.wc=.25;mpSyncCheck()}
    if(!R.sync)return}
  if(R.state==='count'){if(R.kind==='mp'&&R.cdEnd)R.cd=(R.cdEnd-performance.now())/1000;else R.cd-=dt;const n=Math.ceil(R.cd);if(n<R.lastBeep&&n>0){R.lastBeep=n;beep(440,.12)}
    if(R.cd<=0){R.state='run';R.t=0;R.rec.push(Math.round(c.x),Math.round(c.y),Math.round(c.a*100),Math.round((c.z||0)*10));beep(880,.3)}return}
  const inp=R.state==='run'?{up:K.up,down:K.down,hb:K.hb,steer:IN.steer}:{up:false,down:false,hb:false,steer:0};
  c.px=c.x;c.py=c.y;c.pa=c.a;c.pz=c.z;
  if(R.state==='done'&&R.kind==='mp'){coastStep(c,dt,R.T);effects(c);return}
  if(R.state==='run'){if(R.wasUp&&!K.up&&c.vf>170){blowoff();for(let q=0;q<4;q++)spawnDust(c.x-Math.cos(c.a)*20+(Math.random()-.5)*4,c.y-Math.sin(c.a)*20+(Math.random()-.5)*4,-Math.cos(c.a)*40+c.vx*.5,-Math.sin(c.a)*40+c.vy*.5,[150,150,150],false,c.z)}R.wasUp=K.up}
  stepCar(c,inp,dt,R.T);
  if(R.kind==='mp'&&R.col&&W&&R.state!=='count')for(const d of W.peers.values()){if(d.fin)continue;const dx=c.x-d.x,dy=c.y-d.y,dd=Math.hypot(dx,dy),M=32;
    if(dd<M&&dd>.01){const nx=dx/dd,ny=dy/dd;c.x+=nx*(M-dd)*.5;c.y+=ny*(M-dd)*.5;const rv=(c.vx-(d.vx||0))*nx+(c.vy-(d.vy||0))*ny;
      if(rv<0){const j=-1.4*rv*.5;c.vx+=j*nx;c.vy+=j*ny;c.av+=(Math.random()-.5)*rv*.004;if(-rv>90)beep(120,.05)}}}
  if(R.state==='done'){const f=Math.max(0,1-2.6*dt);c.vx*=f;c.vy*=f;c.av*=f;if(Math.hypot(c.vx,c.vy)<3){c.vx=c.vy=c.av=0}}
  if(R.state==='run'){
    R.t+=dt;
    if(++R.recTick>=4){R.recTick=0;R.rec.push(Math.round(c.x),Math.round(c.y),Math.round(c.a*100),Math.round((c.z||0)*10))}
    while(R.maxIdx<c.idx){R.maxIdx++;R.prog[R.maxIdx]=Math.round(R.t*100);
      if(R.maxIdx%60===0&&R.ghost&&R.ghost.p&&R.ghost.p[R.maxIdx]!=null){R.delta=R.t-R.ghost.p[R.maxIdx]/100;R.deltaT=2.4}}
    if(c.offd>R.T.w/2+22){R.off+=dt;if(R.off>=5){resetToTrack();R.t+=5;R.pen+=5;R.off=0;R.penT=2.2;beep(220,.25)}}else R.off=0;
    if(c.idx>=R.T.N-7)finishRace();
  }
  effects(c);
}
function dustColor(id,B){if(id==='d1')return [240,130,60];if(id==='d2')return [90,160,240];if(id==='d3'){const c=new THREE.Color().setHSL(((performance.now()/6)%360)/360,.8,.62);return [c.r*255,c.g*255,c.b*255]}return B.dust}
function effects(c){
  if(c.air){c.pw=null;return}
  const fx=Math.cos(c.a),fy=Math.sin(c.a),sp=Math.hypot(c.vx,c.vy);
  const slide=Math.abs(c.vr)>50||(K.hb&&sp>50&&R.state==='run');
  const wheels=[[c.x-fx*11+fy*8.6,c.y-fy*11-fx*8.6],[c.x-fx*11-fy*8.6,c.y-fy*11+fx*8.6]];
  if(++c.mk>=3){c.mk=0;if(c.pw&&(slide||(c.surf===2&&sp>60))){for(let k=0;k<2;k++)addSkid(c.pw[k][0],c.pw[k][1],wheels[k][0],wheels[k][1],c.z)}c.pw=wheels}
  const p=(sp/MAXV)*.3+(slide?.5:0)+(c.surf===2&&sp>40?.25:0);
  if(Math.random()<p){const w=wheels[Math.random()<.5?0:1];spawnDust(w[0],w[1],-c.vx*.12+(Math.random()-.5)*50,-c.vy*.12+(Math.random()-.5)*50,dustColor(S.eq.dust,R.T.B),false,c.z)}
  const drift=sp>45&&(Math.abs(c.vr)>40||(K.hb&&R.state==='run'));
  if(drift&&Math.random()<.75){const w=wheels[Math.random()<.5?0:1];const dc=S.eq.dust==='d0'?[232,232,228]:dustColor(S.eq.dust,R.T.B);
    spawnDust(w[0]-fx*4,w[1]-fy*4,-c.vx*.06+(Math.random()-.5)*30,-c.vy*.06+(Math.random()-.5)*30,dc,true,c.z)}
}
function pfInfo(T){if(T.pf)return T.pf;const N=T.N,ex=T.xs[N-1],ey=T.ys[N-1],dx=T.tx[N-1],dy=T.ty[N-1];return T.pf={ex,ey,dx,dy,nx:-dy,ny:dx,L:330,Wd:T.w+60}}
function pfSlot(T,j){const P=pfInfo(T),col=j%5,row=Math.floor(j/5)%2,lat=(row?1:-1)*Math.min(46,P.Wd*.24),fw=95+col*48;return {x:P.ex+P.dx*fw+P.nx*lat,y:P.ey+P.dy*fw+P.ny*lat,ex:P.ex+P.dx*40+P.nx*lat,ey:P.ey+P.dy*40+P.ny*lat,a:Math.atan2(P.dy,P.dx)}}
function coastStep(c,dt,T){let vf=Math.max(0,c.vx*Math.cos(c.a)+c.vy*Math.sin(c.a));vf=Math.max(0,vf-Math.max(120,vf*.9)*dt);if(vf<2){vf=0;if(!R.parked)R.parked=1}
  c.av=0;c.vx=Math.cos(c.a)*vf;c.vy=Math.sin(c.a)*vf;c.vf=vf;c.vr=0;c.x+=c.vx*dt;c.y+=c.vy*dt;c.air=false;c.vz=0;c.z=T.surfAt(c.x,c.y,c.idx)}
function parkStep(c,dt,T){
  if(!R.park){R.park=pfSlot(T,(R.slot||0)%10);R.pst=0;R.parked=0}const P=R.park;
  const tx=R.pst?P.x:P.ex,ty=R.pst?P.y:P.ey,dx=tx-c.x,dy=ty-c.y,dist=Math.hypot(dx,dy);
  let vf=Math.hypot(c.vx,c.vy);
  if(!R.pst&&dist<45)R.pst=1;
  if(R.pst&&dist<4){vf=Math.max(0,vf-500*dt);c.a+=angD(P.a,c.a)*Math.min(1,dt*3);if(vf<1){vf=0;if(!R.parked)R.parked=1}}
  else{const want=R.pst?Math.min(170,dist*1.7+10):220;vf+=clamp(want-vf,-520*dt,300*dt);
    const ta=Math.atan2(dy,dx),da=angD(ta,c.a),mt=2.8*dt*Math.min(1,vf/50+.2);const turn=clamp(da,-mt,mt);c.a+=turn;c.av=turn/dt;if(Math.abs(da)>1.2)vf*=Math.max(0,1-2*dt)}
  if(vf<1)c.av=0;
  c.vx=Math.cos(c.a)*vf;c.vy=Math.sin(c.a)*vf;c.vf=vf;c.vr=0;c.x+=c.vx*dt;c.y+=c.vy*dt;c.air=false;c.vz=0;c.z=T.surfAt(c.x,c.y,c.idx);
}
function finishRace(){
  R.state='done';R.ft=R.t;if(R.kind==='mp'){const k=R.T.N-7;R.camLock={x:R.T.xs[k],y:R.T.ys[k]}}document.body.classList.remove('racing');const c=R.car;R.rec.push(Math.round(c.x),Math.round(c.y),Math.round(c.a*100),Math.round((c.z||0)*10));
  const t=R.t,tier=tierOf(t,R.T.medals);
  const res={t,tier,coins:0,prevBest:null,isBest:false};
  if(R.kind!=='mp'&&R.kind!=='free'){const G=R.ghosts||{};res.prevBest=G.best?G.best.t:null;
    const run={t,f:R.rec,p:R.prog};G.last=run;if(!G.best||t<G.best.t){G.best=run;res.isBest=true}
    try{saveGhosts(R.def.id,G)}catch(e){}}
  if(R.kind==='story'){const s=S.story[R.def.id]||{};const prevT=s.best!=null?(s.tier||0):-1;
    if(s.best==null||t<s.best)s.best=t;if(tier>prevT){res.coins=STORY_REWARD[tier]-(prevT>=0?STORY_REWARD[prevT]:0);s.tier=tier}S.story[R.def.id]=s}
  if(R.kind==='daily'){const di=dailyInfo();let d=S.daily;if(!d||d.date!==di.ds)d={date:di.ds,best:null,tier:-1};
    if(d.best==null||t<d.best)d.best=t;if(tier>d.tier){res.coins=DAILY_REWARD[tier]-(d.tier>=0?DAILY_REWARD[d.tier]:0);d.tier=tier}S.daily=d}
  if(res.coins>0)S.coins+=res.coins;save();
  R.result=res;beep(660,.18);
  if(R.kind==='mp')mpPresence({st:'fin',ft:Math.round(t*1000),pr:100});
  showResults();
}
function togglePause(){if(!R||R.state==='done')return;R.paused=!R.paused;document.body.classList.toggle('racing',!R.paused);for(const k in K)K[k]=false;renderOverlay()}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='race'&&R&&!R.paused&&R.state!=='done'&&R.kind!=='mp')togglePause()});

/* ---------------- render loop ---------------- */
let last=performance.now(),acc=0;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(mode==='race'&&R&&!R.paused){acc+=dt;let n=0;while(acc>=STEP&&n<12){tick(STEP);acc-=STEP;n++}if(n>=12)acc=0}
  const showGL=mode!=='editor'||E.view3d;if(glc.hidden===showGL)glc.hidden=!showGL;
  octx.setTransform(DPR,0,0,DPR,0,0);
  try{
    if(mode==='race'&&R&&W)drawRace(dt);
    else if(mode==='editor'){if(E.view3d){octx.clearRect(0,0,VW,VH);drawEditor3D(dt)}else drawEditor()}
    else{octx.clearRect(0,0,VW,VH);drawShowroom(dt,now/1000)}
  }catch(e){console.error(e)}
  engineUpdate();
  requestAnimationFrame(frame);
}
const v3=new THREE.Vector3();
const MU=12;
function camSet(fov,near){if(Math.abs(cam3.fov-fov)>.05||cam3.near!==near){cam3.fov=Math.abs(cam3.fov-fov)>.05?fov:cam3.fov;cam3.near=near;cam3.updateProjectionMatrix()}}
function camEaseFov(dt,fov,near){const f=cam3.fov+(fov-cam3.fov)*(1-Math.exp(-dt*3));if(Math.abs(f-cam3.fov)>.02||cam3.near!==near){cam3.fov=f;cam3.near=near;cam3.updateProjectionMatrix()}}
function camParams(v){if(v==='low')return {d:3.4,h:.9,la:6,lu:.45,fov:64,ff:78,clr:.3};if(v==='custom'){const c=S.opt.cam;return {d:c.d,h:c.h,la:4+c.d*.2,lu:Math.min(.7,.25+c.h*.15),fov:c.fov,ff:Math.min(115,c.fov+14),clr:Math.min(.5,c.h*.6)}}return {d:4.6,h:1.8,la:4,lu:.7,fov:62,ff:76,clr:.5}}
function camFollow(dt,rx,ry,ra,c,T,view){const sp=Math.min(1,Math.abs(c.vf)/MAXV),base=c.h||0;
  if(!W.camInit||W.cYaw==null){W.cYaw=ra;W.camInit=true;W.cPos=null}
  if(view==='hood'){W.cYaw+=angD(ra,W.cYaw)*(1-Math.exp(-dt*18));const fx=Math.cos(W.cYaw),fy=Math.sin(W.cYaw);const px=rx+fx*4,py=ry+fy*4,pz=base+11+(c.tp||0)*-4;
    cam3.position.set(px,pz,py);cam3.lookAt(px+fx*140,pz-6+(c.tp||0)*-60,py+fy*140);camEaseFov(dt,72+14*sp,1.2);W.camH=base;return}
  const p=camParams(view);W.cYaw+=angD(ra,W.cYaw)*(1-Math.exp(-dt*5));const fx=Math.cos(W.cYaw),fy=Math.sin(W.cYaw);
  let dx=rx-fx*p.d*MU,dy=ry-fy*p.d*MU,dz=base+Math.max(9,p.h*MU);const gnd=T.surfAt(dx,dy,c.idx);dz=Math.max(dz,gnd+p.clr*MU+4);
  if(!W.cPos)W.cPos={x:dx,y:dy,z:dz};else{const k=1-Math.exp(-dt*12);W.cPos.x+=(dx-W.cPos.x)*k;W.cPos.y+=(dy-W.cPos.y)*k;W.cPos.z+=(dz-W.cPos.z)*k}
  cam3.position.set(W.cPos.x,W.cPos.z,W.cPos.y);cam3.lookAt(rx+fx*p.la*MU,base+p.lu*MU+4,ry+fy*p.la*MU);camEaseFov(dt,p.fov+(p.ff-p.fov)*sp,1.5);W.camH=base}
function drawRace(dt){
  const T=R.T,c=R.car;cam3.clearViewOffset();
  if(R.deltaT>0)R.deltaT-=dt;
  const al=(R.paused||c.px==null)?1:clamp(acc/STEP,0,1);
  const rx=c.px==null?c.x:c.px+(c.x-c.px)*al,ry=c.py==null?c.y:c.py+(c.y-c.py)*al,ra=c.pa==null?c.a:c.pa+angD(c.a,c.pa)*al;
  const rz=c.pz==null?c.z:c.pz+(c.z-c.pz)*al;const gp=groundPose(T,rx,ry,ra,c.idx);c.h=c.air?rz:Math.max(rz,gp.h);
  const tP=c.air?clamp(Math.atan2(c.vz,Math.max(80,Math.abs(c.vf)))*.8,-.45,.45):gp.p,tR=c.air?0:gp.r;const kt=Math.min(1,dt*(c.air?5:10));c.tp=(c.tp||0)+(tP-(c.tp||0))*kt;c.tr=(c.tr||0)+(tR-(c.tr||0))*kt;
  poseCar(W.car,rx,ry,c.h,ra,c.vf,c.vr,IN.steer,R.paused?0:dt,c.tp,c.tr);
  if(!R.paused)updDust(dt);
  if(T.bridgeMat){let under=false;for(const [s0,e0,j0,e1] of T.bspan){if(c.idx>=s0-2&&c.idx<=e0+2)continue;for(let k=j0;k<=e1&&!under;k++){const dx=T.xs[k]-c.x,dy=T.ys[k]-c.y;if(dx*dx+dy*dy<(T.w*.75)**2&&T.ry[k]>c.z+8)under=true}if(under)break}
    const tgt=under?.3:1;T.bridgeMat.opacity+=(tgt-T.bridgeMat.opacity)*Math.min(1,dt*8)}
  if(W.ghost&&R.ghost&&R.ghost.f&&R.ghost.f.length>=4){const f=R.ghost.f,nf=f.length/4;const tt=R.state==='count'?0:R.t*30;const i0=Math.min(nf-1,Math.floor(tt)),i1=Math.min(nf-1,i0+1),u=clamp(tt-i0,0,1);
    const gx=f[i0*4]+(f[i1*4]-f[i0*4])*u,gy=f[i0*4+1]+(f[i1*4+1]-f[i0*4+1])*u,ga=f[i0*4+2]/100+angD(f[i1*4+2]/100,f[i0*4+2]/100)*u,gz=(f[i0*4+3]+(f[i1*4+3]-f[i0*4+3])*u)/10;
    W.ghost.position.set(gx,gz,gy);W.ghost.rotation.y=-ga}
  if(R.kind==='mp'&&MP.room){const seen=new Set();
    for(const p of MP.room.peers()){if(p.sameTab)continue;const pr=p.presence||{};if(pr.rd!==MP.curGo||typeof pr.x!=='number')continue;seen.add(p.peer);
      let d=W.peers.get(p.peer);const sk=[pr.pt,pr.lv,pr.wg,pr.dc,pr.lt,pr.bd,pr.rm].join('|');
      if(!d||d.sk!==sk){if(d){W.scene.remove(d.g);disposeTree(d.g)}d={x:pr.x,y:pr.y,a:+pr.a||0,sk,g:makeCar({paintId:String(pr.pt||'po'),body:String(pr.bd||'b7'),rim:String(pr.rm||'r0'),paint:paintHex(String(pr.pt||'po')),liv:String(pr.lv||'lv0'),wing:String(pr.wg||'w0'),decal:String(pr.dc||'n0'),lights:String(pr.lt||'h0')},false),name:''};W.scene.add(d.g);W.peers.set(p.peer,d)}
      const kk=1-Math.exp(-12*dt);const ox=d.x,oy=d.y;d.x+=(pr.x-d.x)*kk;d.y+=(+pr.y-d.y)*kk;if(dt>0){d.vx=(d.vx||0)*.8+(d.x-ox)/dt*.2;d.vy=(d.vy||0)*.8+(d.y-oy)/dt*.2}d.fin=pr.st==='fin';d.a+=angD(+pr.a||0,d.a)*kk;d.name=String(pr.nm||'Driver').slice(0,16);
      poseCar(d.g,d.x,d.y,typeof pr.z==='number'?pr.z:T.surfAt(d.x,d.y),d.a,Math.hypot(d.x-ox,d.y-oy)/Math.max(dt,.001),0,0,dt)}
    for(const [k,d] of W.peers)if(!seen.has(k)){W.scene.remove(d.g);disposeTree(d.g);W.peers.delete(k)}}
  const s=VH>VW?1.45:1;
  if(!W.camInit){W.camH=c.h;W.camInit=true}W.camH+=(c.h-W.camH)*Math.min(1,dt*3);
  const view=S.opt.view||'above';W.car.visible=view!=='hood'||!!R.camLock;
  if(view!=='above'&&!R.camLock){camFollow(dt,rx,ry,ra,c,T,view)}
  else if(R.camLock){camSet(52,8);const L=R.camLock;L.cx=L.cx==null?rx:L.cx+(L.x-L.cx)*Math.min(1,dt*2.5);L.cy=L.cy==null?ry:L.cy+(L.y-L.cy)*Math.min(1,dt*2.5);cam3.position.set(L.cx-120*s,W.camH+330*s,L.cy+270*s);cam3.lookAt(L.cx,W.camH,L.cy)}
  else{camSet(52,8);cam3.position.set(rx-120*s,W.camH+330*s,ry+270*s);
  cam3.lookAt(rx,W.camH,ry)}
  gl.render(W.scene,cam3);
  octx.clearRect(0,0,VW,VH);
  octx.font='800 13px Nunito, sans-serif';octx.textAlign='center';
  const label=(x,y,z,txt)=>{v3.set(x,y,z).project(cam3);if(v3.z>1)return;const sx=(v3.x+1)/2*VW,sy=(1-v3.y)/2*VH;octx.lineWidth=4;octx.strokeStyle='rgba(35,40,44,.85)';octx.strokeText(txt,sx,sy);octx.fillStyle='#fff';octx.fillText(txt,sx,sy)};
  if(W.ghost)label(W.ghost.position.x,W.ghost.position.y+26,W.ghost.position.z,S.ghostMode==='last'?'LAST RUN':'BEST RUN');
  for(const d of W.peers.values())label(d.x,26,d.y,d.name);
  {const short=VH<500,ms=short?190:VW<560?210:380,mx=VW-ms-12,my=short?($('#safe').offsetHeight||0)+50:VH-ms-SAFE_B-(TOUCHY?108:14);
   const pcx=mx+ms*.5,pcy=my+ms*.5,sc=ms/2300;
   const P=(x,y)=>[pcx+(x-rx)*sc,pcy+(y-ry)*sc];
   const i0=Math.max(0,c.idx-110),i1=Math.min(T.N-1,c.idx+230);
   octx.save();octx.beginPath();octx.rect(mx,my,ms,ms);octx.clip();octx.lineJoin=octx.lineCap='round';
   for(const pass of [0,1]){for(let k=i0;k<i1;k+=2){const k2=Math.min(i1,k+2);const d=k<c.idx?(c.idx-k)/110:(k-c.idx)/230;const al=Math.max(0,1-d*d*d)*(pass?.95:.55);if(al<.02)continue;
       const [ax,ay]=P(T.xs[k],T.ys[k]),[bx,by]=P(T.xs[k2],T.ys[k2]);octx.globalAlpha=al;octx.strokeStyle=pass?'#ffffff':'#1d2326';octx.lineWidth=pass?(short?4:6):(short?8:11);octx.beginPath();octx.moveTo(ax,ay);octx.lineTo(bx,by);octx.stroke()}}
   octx.globalAlpha=.9;for(const d of W.peers.values()){const [a2,b2]=P(d.x,d.y);if(a2<mx||a2>mx+ms||b2<my||b2>my+ms)continue;octx.fillStyle=d.fin?'#8a96a3':'#2f6fd0';octx.strokeStyle='#fff';octx.lineWidth=2;octx.beginPath();octx.arc(a2,b2,5,0,7);octx.fill();octx.stroke()}
   octx.globalAlpha=1;octx.translate(pcx,pcy);octx.rotate(ra+Math.PI/2);const u=short?1:1.35;octx.fillStyle='#f26b1d';octx.strokeStyle='#ffffff';octx.lineWidth=2;octx.beginPath();octx.moveTo(0,-9*u);octx.lineTo(-6.5*u,6*u);octx.lineTo(0,3*u);octx.lineTo(6.5*u,6*u);octx.closePath();octx.fill();octx.stroke();
   octx.restore()}
  updateHUD();
  if(R.kind==='mp'&&MP.room&&!(R.state==='done'&&R.parked>1)){R.pres+=dt;if(R.pres>(R.state==='done'?.15:.07)){R.pres=0;if(R.parked)R.parked++;const dn=R.state==='done';mpPresence({x:Math.round(c.x),y:Math.round(c.y),z:Math.round(c.z*10)/10,a:Math.round(c.a*100)/100,st:dn?'fin':R.state==='run'?'race':'wait',rd:MP.curGo,pr:dn?100:Math.round(c.idx/T.N*100)})}}
}

/* ---------------- HUD ---------------- */
let hudEls=null;
const hc={};
const KEYS_HTML=`<span><span class="kc">W</span> <span class="kc">A</span> <span class="kc">S</span> <span class="kc">D</span> drive</span><span><span class="kc">Space</span> handbrake</span><span><span class="kc">R</span> restart</span><span><span class="kc">Esc</span> pause</span>`;
function renderHUD(){
  const stg=R.kind==='story'?'STAGE SS'+(R.idx+1):R.kind==='daily'?'DAILY STAGE':R.kind==='mp'?'LOBBY '+MP.code:R.kind==='test'?'TEST DRIVE':R.kind==='free'?'FREE DRIVE':'CUSTOM STAGE';
  UI.innerHTML=`<div class="hud">
    <div class="hud-tl">
      <div class="stg chunk or">${esc(stg)}</div>
      <div class="clock chunk" id="tm">0:00.00</div>
      <div class="dl" id="dl"></div>
      <div class="dist"><span>DISTANCE</span><span class="bar"><i id="dbar"></i></span><b id="dtx"></b></div>
      <div class="pnote idle" id="pn"><div class="d" id="pnd">START</div><div class="m" id="pnm">&nbsp;</div></div>
    </div>
    <button class="pbtn" data-act="pause" aria-label="Pause">II</button>
    <button class="pbtn fsb" data-act="fs" aria-label="Full screen">⛶</button>
    <button class="pbtn camb" data-act="cam" aria-label="Change camera">🎥</button>
    <div class="cd chunk or" id="cd"></div>
    <div class="offt" id="offt"></div>
    <div class="spd chunk"><b id="spd">0</b><span>KM/H</span></div>
    <div class="ghl" id="ghl"></div>
    <div class="ctrl" id="ctrl"><div class="chunk or">CONTROLS</div><div class="keysbar">${KEYS_HTML}</div></div>
    ${TOUCHY?`<div class="touch"><div class="cl"><button class="tb" data-k="left" aria-label="Steer left">◀</button><button class="tb" data-k="right" aria-label="Steer right">▶</button></div>
      <div class="cl"><button class="tb sm" data-k="hb">HAND</button><button class="tb" data-k="down">BRAKE</button><button class="tb gas" data-k="up">GAS</button></div></div>`:''}
    <div id="ov"></div></div>`;
  for(const k in hc)delete hc[k];
  hudEls={pn:$('#pn'),pnd:$('#pnd'),pnm:$('#pnm'),tm:$('#tm'),dl:$('#dl'),cd:$('#cd'),spd:$('#spd'),ghl:$('#ghl'),ov:$('#ov'),dbar:$('#dbar'),dtx:$('#dtx'),ctrl:$('#ctrl'),offt:$('#offt')};
  hudEls.ghl.textContent=R.kind==='mp'?'':R.ghost?('Ghost: '+(S.ghostMode==='last'?'last run':'best run')+' · '+fmt(R.ghost.t)):'';
  for(const b of UI.querySelectorAll('[data-k]')){const k=b.dataset.k;const on=e=>{e.preventDefault();K[k]=true;b.classList.add('on');try{b.setPointerCapture(e.pointerId)}catch(_){}};const off=()=>{K[k]=false;b.classList.remove('on')};
    b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off)}
}
function setT(el,k,v){if(hc[k]!==v){hc[k]=v;el.textContent=v}}
function updateHUD(){
  if(!hudEls)return;const c=R.car,T=R.T;
  {let html='';if(R.penT>0){R.penT-=1/60;html='<div class="chunk or">+5 SEC PENALTY</div><div class="s">Back on the road</div>'}
   else if(R.state==='count'&&R.kind==='mp'&&!R.sync){html='<div class="chunk">WAITING</div><div class="s">Drivers loaded: '+(R.wn||1)+' / '+(R.wm||1)+'</div>'}
   else if(R.state==='count'&&R.kind!=='mp'){html='<div class="chunk">READY</div><div class="s">'+(TOUCHY?'Press GAS to start':'Press W or ↑ to start')+'</div>'}
   if(hc.off!==html){hc.off=html;hudEls.offt.innerHTML=html}}
  setT(hudEls.tm,'tm',fmt(R.state==='count'?0:R.state==='done'?R.ft:R.t));
  setT(hudEls.spd,'spd',String(Math.round(Math.abs(c.vf)*.3)));
  setT(hudEls.cd,'cd',R.state==='count'&&R.kind!=='mp'?'':R.state==='count'?(!R.sync?'':R.cd>0.3?String(Math.ceil(R.cd-.3)):'GO!'):(R.state==='run'&&R.t<.6?'GO!':''));
  const fr=clamp((T.cum[Math.min(T.N-1,Math.max(3,R.maxIdx))]-T.cum[3])/(T.cum[T.N-7]-T.cum[3]),0,1);
  const w=Math.round(fr*1000)/10+'%';if(hc.db!==w){hc.db=w;hudEls.dbar.style.width=w}
  setT(hudEls.dtx,'dtx',(fr*T.len*.00012).toFixed(2)+' / '+(T.len*.00012).toFixed(2)+' km');
  const op=(R.state==='count'||(R.state==='run'&&R.t<3.5))?'1':'0';if(hc.ct!==op){hc.ct=op;hudEls.ctrl.style.opacity=op}
  if(R.deltaT>0&&R.delta!=null){const d=R.delta;setT(hudEls.dl,'dl',(d>0?'+':'−')+Math.abs(d).toFixed(2));const cls='dl '+(d>0?'up':'dn');if(hudEls.dl.className!==cls)hudEls.dl.className=cls}else setT(hudEls.dl,'dl','');
  let n=null;for(const x of T.notes){if(x.e>c.idx){n=x;break}}
  const m=n?Math.max(0,Math.round((n.i-c.idx)*SP*.12)):0;
  if(n&&m<=180){setT(hudEls.pnd,'pnd',n.ft?n.ft:n.hair?'HAIRPIN '+(n.dir>0?'RIGHT':'LEFT'):(n.dir>0?'RIGHT ':'LEFT ')+n.g);setT(hudEls.pnm,'pnm',m>0?'in '+m+' m':'now');if(hudEls.pn.className!=='pnote')hudEls.pn.className='pnote'}
  else{setT(hudEls.pnd,'pnd',c.idx>T.N-40?'FINISH':'STRAIGHT');setT(hudEls.pnm,'pnm',n?m+' m':'');if(hudEls.pn.className!=='pnote idle')hudEls.pn.className='pnote idle'}
}
function renderOverlay(){
  if(!hudEls)return;
  if(R.paused){hudEls.ov.innerHTML=`<div class="ov"><div class="card res tilt"><h2>Paused</h2><p class="muted">${esc(R.title)}</p><div class="row">
    <button class="btn pri" data-act="resume">Resume</button>${R.kind!=='mp'?'<button class="btn" data-act="restart">Restart</button>':''}<button class="btn" data-act="quit">Quit</button></div>
    </div></div>`}
  else hudEls.ov.innerHTML='';
}
function showResults(){
  if(!hudEls)return;const res=R.result,T=R.T;
  if(R.kind==='mp'){renderMpResults();return}
  const m=T.medals;const names=['Platinum','Gold','Silver','Bronze'];const cols=[TIERC[4],TIERC[3],TIERC[2],TIERC[1]];
  const rows=m.map((t,k)=>`<span class="dot" style="background:${cols[k]}"></span><span>${names[k]}</span><span class="tm" style="${res.t<=t?'color:var(--ok)':''}">${res.t<=t?'✓ ':''}${fmt(t)}</span>`).join('');
  let delta='';if(res.prevBest!=null){const d=res.t-res.prevBest;delta=`<span style="font-family:var(--mono);color:${d>0?'var(--bad)':'var(--ok)'}">${d>0?'+':'−'}${Math.abs(d).toFixed(2)}</span> vs your previous best`}
  const nextOk=R.kind==='story'&&R.idx<STORY.length-1;
  hudEls.ov.innerHTML=`<div class="ov"><div class="card res tilt">
    <div class="eyebrow">${esc(R.title)}</div>
    <div class="big">${fmt(res.t)}</div>
    <div class="tierb t${res.tier}">${TIER[res.tier]}${res.isBest&&res.prevBest!=null?' · new record':''}</div>
    ${delta?`<p class="muted">${delta}</p>`:''}
    ${R.pen?`<p class="muted">Includes +${R.pen} s off-track penalty.</p>`:''}
    <div class="tiers">${rows}</div>
    ${res.coins>0?`<div class="earn"><span class="coin"></span>+${res.coins} coins</div>`:''}
    <div class="row"><button class="btn pri" data-act="restart">Retry</button>${nextOk?'<button class="btn" data-act="next">Next stage</button>':''}${R.kind==='free'?'<button class="btn" data-act="free-new">New stage</button>':''}<button class="btn" data-act="quit">${R.kind==='test'?'Back to editor':'Menu'}</button></div>
    <p class="note-s">${R.kind==='test'?'Test drive – no coins.':'Retry with R or Enter.'}</p>
  </div></div>`;
}

/* ---------------- multiplayer ---------------- */
let roomP=null;
function getRoom(){if(!roomP)roomP=window.__fbRoom?window.__fbRoom().catch(e=>{console.error(e);window.__fbErr=e&&e.code||'error';return null}):(window.claude&&typeof window.claude.use==='function')?window.claude.use('room').catch(()=>null):Promise.resolve(null);return roomP}
getRoom();
const MP={room:null,code:'',host:false,sd:null,tk:null,go:null,curGo:null,unsub:null,joinedAt:0};
const CODECH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function genCode(){let s='';for(let i=0;i<5;i++)s+=CODECH[Math.floor(Math.random()*CODECH.length)];return s}
function mpPresence(p){if(!MP.room)return;MP.room.presence(p).catch(()=>{})}
function mpBase(){return {nm:S.nick.slice(0,16),bd:S.eq.body,rm:S.eq.rim,pt:S.eq.paint,lv:S.eq.liv,wg:S.eq.wing,dc:S.eq.decal,lt:S.eq.lights,st:'lobby'}}
async function mpEnter(code,host,trackCode){
  const room=await getRoom();
  if(!room){toast(window.__fbRoom?'Could not connect to the multiplayer server ('+(window.__fbErr||'offline')+'). Check your internet and reload.':'Multiplayer is not available here. Open the shared page while signed in.');return}
  if(MP.room)await mpLeave(true);
  let nr;try{nr=await room.join('pv-'+code.toLowerCase())}catch(e){toast(e&&e.code==='not_permitted'?'You do not have access to lobbies on this page.':'Could not join. Try again.');return}
  Object.assign(MP,{room:nr,code,host,go:null,curGo:null,joinedAt:Date.now()});
  const base=mpBase();MP.hostSeen=false;MP.hostRaced=false;
  if(host){MP.ln=MPLEN.v;MP.cl=MPLEN.cl;MP.tk=trackCode||null;MP.sd=trackCode?null:Math.floor(Math.random()*1e9);Object.assign(base,{h:1,tk:MP.tk,sd:MP.sd,ln:MP.ln,cl:MP.cl,go:null})}
  mpPresence(base);
  MP.unsub=nr.onPeers(()=>mpOnPeers());
  show('lobby');
  if(!host)setTimeout(()=>{if(MP.room===nr&&nr.peers().length>10){toast('This lobby is full (10 drivers max).');mpLeave()}},1500);
}
async function mpLeave(silent){MP.hostSeen=false;MP.hostRaced=false;if(MP.unsub){try{MP.unsub()}catch(e){}}MP.unsub=null;if(MP.room){try{await MP.room.leave()}catch(e){}}MP.room=null;MP.host=false;MP.curGo=null;if(!silent)show('friends')}
function mpHostPeer(){if(!MP.room)return null;const ps=MP.room.peers().filter(p=>p.presence&&p.presence.h===1);ps.sort((a,b)=>a.peer<b.peer?-1:1);return ps[0]||null}
let mpRT=0,mpTimer=0;
function mpOnPeers(){
  const hp=mpHostPeer();
  if(!hp){if(MP.hostSeen&&!MP.host){MP.hostSeen=false;toast('The host left. The lobby is closed.');mpLeave();return}}else MP.hostSeen=true;
  if(hp&&!MP.host&&mode==='race'&&R&&R.kind==='mp'){const pr=hp.presence;
    if(pr.rd===MP.curGo)MP.hostRaced=true;
    else if((MP.hostRaced||!pr.go)&&!(pr.go&&pr.go!==MP.curGo)){MP.hostRaced=false;toast('The host went back to the lobby.');mpPresence({st:'lobby',rd:null,ld:null,qt:MP.curGo,x:null,y:null});show('lobby');return}}
  if(hp){const pr=hp.presence;
    if(pr.go&&pr.go!==MP.curGo){const def=pr.tk?decTrack(String(pr.tk)):mpRandomDef(Number(pr.sd)||1,FD_LEN[pr.ln]?FD_LEN[pr.ln][0]:0);
      if(def){def.id='mp';MP.curGo=pr.go;MP.hostRaced=false;const ids=MP.room.peers().map(p=>p.peer).sort();const me=MP.room.peers().find(p=>p.sameTab);const slot=me?Math.max(0,ids.indexOf(me.peer)):0;
        startRace({def,kind:'mp',title:pr.tk?def.name:'Hidden random stage',back:'lobby',slot,col:pr.cl===1});mpPresence({rd:MP.curGo,st:'wait',ft:null,pr:0});return}}}
  if(mode==='race'&&R&&R.kind==='mp'&&R.state==='count'&&!R.sync)mpSyncCheck();
  const now=Date.now();if(now-mpRT<350){if(!mpTimer)mpTimer=setTimeout(()=>{mpTimer=0;mpOnPeers()},360);return}mpRT=now;
  if(screen==='lobby'&&mode!=='race')renderScreen();
  if(mode==='race'&&R&&R.kind==='mp'&&R.state==='count'&&!R.sync)mpSyncCheck();
  if(mode==='race'&&R&&R.kind==='mp'&&R.state==='done')renderMpResults();
}
function mpSyncGo(){if(!R||R.kind!=='mp'||R.state!=='count'||R.sync)return;R.sync=true;R.cdEnd=performance.now()+3300;R.cd=3.3}
function mpSyncCheck(){if(!R||R.kind!=='mp'||R.state!=='count'||R.sync)return;if(!MP.room){mpSyncGo();return}
  const all=MP.room.peers().filter(p=>p.presence&&p.presence.qt!==MP.curGo);R.wm=Math.max(1,all.length);R.wn=all.filter(p=>p.sameTab||p.presence.ld===MP.curGo).length;
  const hp=mpHostPeer();
  if(hp&&hp.presence.cs===MP.curGo){mpSyncGo();return}
  if(MP.host){if((R.wt>.8&&R.wn>=R.wm)||R.wt>30){mpPresence({cs:MP.curGo});mpSyncGo()}return}
  if(!hp&&R.wt>3||R.wt>40)mpSyncGo()}
function mpStart(){if(!MP.host||!MP.room)return;if(MP.room.peers().length<2){toast('You need at least 2 drivers in the lobby to start.');return}if(MP.room.peers().length>10){toast('Max 10 drivers per race.');return}MP.go='r'+Math.random().toString(36).slice(2,8);mpPresence({go:MP.go,tk:MP.tk,sd:MP.sd,ln:MP.ln})}
const MPLEN={v:'m',cl:0};
function mpNewTrack(){if(!MP.host)return;MP.tk=null;MP.sd=Math.floor(Math.random()*1e9);mpPresence({tk:null,sd:MP.sd,ln:MP.ln});toast('New hidden stage rolled. Nobody sees it until the countdown.')}
function renderMpResults(){
  if(!hudEls||!MP.room)return;const ps=MP.room.peers().filter(p=>p.presence&&p.presence.rd===MP.curGo);
  ps.sort((a,b)=>{const fa=a.presence.st==='fin',fb=b.presence.st==='fin';if(fa&&fb)return (a.presence.ft||0)-(b.presence.ft||0);if(fa!==fb)return fa?-1:1;return (b.presence.pr||0)-(a.presence.pr||0)});
  const rows=ps.map((p,k)=>{const pr=p.presence;const fin=pr.st==='fin';return `<div class="r ${p.sameTab?'me':''}"><span class="tm">${fin?k+1+'.':'–'}</span><span class="pn">${esc(String(pr.nm||'Driver').slice(0,16))}${p.sameTab?' (you)':''}</span><span class="tm">${fin?fmt((pr.ft||0)/1000):'racing '+(pr.pr||0)+'%'}</span></div>`}).join('');
  const oldOv=hudEls.ov.querySelector('.ov'),scT=oldOv?oldOv.scrollTop:0;
  const html=`<div class="ov"><div class="card res tilt"><div class="eyebrow">Race results · lobby ${esc(MP.code)}</div><div class="big">${fmt(R.ft)}</div>
    <div class="rl">${rows||'<p class="muted">Waiting for the others…</p>'}</div>
    <div class="row">${MP.host?'<button class="btn pri" data-act="mp-again">Next race</button>':''}<button class="btn" data-act="quit">Back to lobby</button></div>
    <p class="note-s">${MP.host?'Next race rolls a new hidden stage and starts everyone.':'The host starts the next race and you will be dropped in automatically.'}</p></div></div>`;
  if(hudEls.mpHtml===html)return;hudEls.mpHtml=html;hudEls.ov.innerHTML=html;const nv=hudEls.ov.querySelector('.ov');if(nv)nv.scrollTop=scT;
}

/* ---------------- track codes ---------------- */
function encTrack(d){const o={n:d.name,b:d.biome,w:d.w,p:[]};for(const p of d.pts)o.p.push(Math.round(p[0]/10),Math.round(p[1]/10));return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/,'')}
function decTrack(s){try{s=String(s).trim().replace(/\s/g,'');while(s.length%4)s+='=';const o=JSON.parse(decodeURIComponent(escape(atob(s))));if(!o||!Array.isArray(o.p)||o.p.length<6)return null;
  const pts=[];for(let i=0;i+1<o.p.length&&pts.length<80;i+=2){const x=+o.p[i]*10,y=+o.p[i+1]*10;if(!isFinite(x)||!isFinite(y)||Math.abs(x)>1e5||Math.abs(y)>1e5)return null;pts.push([x,y])}
  return {name:String(o.n||'Imported stage').slice(0,28),biome:BIOMES[o.b]?o.b:'forest',w:clamp(+o.w||90,60,140),pts}}catch(e){return null}}
function customId(d){return 'c'+hashStr(JSON.stringify(d.pts)+d.w+d.biome).toString(36)}

/* ---------------- editor (2D overlay) ---------------- */
const E={pts:[],w:96,biome:'forest',name:'',tool:'add',cam:{x:0,y:0,z:.45},drag:null,undo:[],idx:null,prev:null,dirty:true,ov:false,len:0,confirmClear:false};
function edNew(){Object.assign(E,{pts:[[-500,0],[-160,-40],[160,80],[420,-60]],w:96,biome:'forest',name:'',idx:null,undo:[],dirty:true,cam:{x:0,y:0,z:clamp(VW/1700,.3,.7)}})}
function edOpen(i){const d=S.custom[i];Object.assign(E,{pts:d.pts.map(p=>p.slice()),w:d.w,biome:d.biome,name:d.name,idx:i,undo:[],dirty:true});edFit()}
function edFit(){if(!E.pts.length)return;let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const p of E.pts){a=Math.min(a,p[0]);b=Math.min(b,p[1]);c=Math.max(c,p[0]);d=Math.max(d,p[1])}
  E.cam.x=(a+c)/2;E.cam.y=(b+d)/2;E.cam.z=clamp(Math.min(VW/((c-a)+400),(VH-200)/((d-b)+400)),.12,1)}
function edRecalc(){if(!E.dirty)return;E.dirty=false;if(E.pts.length>=2){E.prev=resample(catmull(E.pts,.5));E.len=E.prev.xs.length*SP;E.ov=false;E.br=edBridges(E.prev.xs,E.prev.ys,E.w*WF)}else{E.prev=null;E.len=0;E.ov=false;E.br=[]}
  const el=$('#ed-info');if(el){el.textContent=`${E.pts.length} points · ${(E.len*.12/1000).toFixed(2)} km${E.br&&E.br.length?' · '+E.br.length+(E.br.length>1?' bridges':' bridge'):''}`;el.className='ed-info'+(E.ov?' w':'')}}
function s2w(x,y){return [(x-VW/2)/E.cam.z+E.cam.x,(y-VH/2)/E.cam.z+E.cam.y]}
function snap(p){return [Math.round(p[0]/20)*20,Math.round(p[1]/20)*20]}
function edHit(w){const r=16/E.cam.z;let bi=-1,bd=r*r;E.pts.forEach((p,i)=>{const d=(p[0]-w[0])**2+(p[1]-w[1])**2;if(d<bd){bd=d;bi=i}});return bi}
function edPush(){E.undo.push(JSON.stringify(E.pts));if(E.undo.length>60)E.undo.shift()}
const ptrs=new Map();let pinch=null;
ov.addEventListener('pointerdown',e=>{if(mode!=='editor')return;if(E.view3d){E.od={x:e.clientX,y:e.clientY,a:E.oa,p:E.op};try{ov.setPointerCapture(e.pointerId)}catch(_){}return}e.preventDefault();try{ov.setPointerCapture(e.pointerId)}catch(_){}ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),z:E.cam.z};E.drag=null;return}
  const w=s2w(e.clientX,e.clientY),hit=edHit(w);
  if(E.tool==='del'){if(hit>=0){edPush();E.pts.splice(hit,1);E.dirty=true}return}
  if(E.tool==='pan'||e.button===1||e.button===2){E.drag={pan:1,sx:e.clientX,sy:e.clientY,cx:E.cam.x,cy:E.cam.y};return}
  edPush();if(hit>=0)E.drag={pt:hit};else{E.pts.push(snap(w));E.dirty=true;E.drag={pt:E.pts.length-1}}});
ov.addEventListener('pointermove',e=>{if(mode==='editor'&&E.view3d&&E.od){E.oa=E.od.a-(e.clientX-E.od.x)*.006;E.op=clamp(E.od.p+(e.clientY-E.od.y)*.004,.3,1.4);return}if(mode!=='editor'||!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(pinch&&ptrs.size===2){const [a,b]=[...ptrs.values()];E.cam.z=clamp(pinch.z*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch.d,.08,1.6);return}
  const d=E.drag;if(!d)return;if(d.pan){E.cam.x=d.cx-(e.clientX-d.sx)/E.cam.z;E.cam.y=d.cy-(e.clientY-d.sy)/E.cam.z}else{E.pts[d.pt]=snap(s2w(e.clientX,e.clientY));E.dirty=true}});
const edUp=e=>{E.od=null;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;E.drag=null};
ov.addEventListener('pointerup',edUp);ov.addEventListener('pointercancel',edUp);
ov.addEventListener('contextmenu',e=>{if(mode==='editor')e.preventDefault()});
ov.addEventListener('wheel',e=>{if(mode!=='editor')return;e.preventDefault();if(E.view3d){E.oz=clamp(E.oz*(e.deltaY<0?.9:1.1),.3,2.5);return}E.cam.z=clamp(E.cam.z*(e.deltaY<0?1.12:.89),.08,1.6)},{passive:false});
function edBuild3D(){if(E.W3){disposeTree(E.W3.scene);E.W3=null}const d=edDef();d.id='preview';const T=buildTrack(d);const w3=buildWorld(T);
  const car=makeCar(myStyle(),false);w3.scene.add(car);poseCar(car,T.xs[3],T.ys[3],T.surfAt(T.xs[3],T.ys[3],3),T.ang[3],0,0,0,0);
  E.W3=w3;E.T3=T;E.oa=E.oa||.6;E.op=E.op||.9;E.oz=E.oz||1}
function drawEditor3D(dt){if(!E.W3)return;const T=E.T3,b=T.bounds;cam3.clearViewOffset();
  if(!E.od)E.oa+=dt*.05;const cx=(b.minx+b.maxx)/2,cz=(b.miny+b.maxy)/2,span=Math.max(b.maxx-b.minx,b.maxy-b.miny,600);
  const r=span*.85*E.oz;cam3.position.set(cx+Math.sin(E.oa)*Math.cos(E.op)*r,Math.sin(E.op)*r,cz+Math.cos(E.oa)*Math.cos(E.op)*r);cam3.lookAt(cx,0,cz);
  E.W3.scene.fog.near=r*.9;E.W3.scene.fog.far=r*3;gl.render(E.W3.scene,cam3)}
function drawEditor(){
  edRecalc();const B=BIOMES[E.biome];const g=octx;
  g.fillStyle=B.ground[0];g.fillRect(0,0,VW,VH);
  g.save();g.translate(VW/2,VH/2);g.scale(E.cam.z,E.cam.z);g.translate(-E.cam.x,-E.cam.y);
  const v={x0:E.cam.x-VW/2/E.cam.z,y0:E.cam.y-VH/2/E.cam.z,x1:E.cam.x+VW/2/E.cam.z,y1:E.cam.y+VH/2/E.cam.z};
  g.strokeStyle='rgba(35,40,44,.1)';g.lineWidth=1/E.cam.z;g.beginPath();const gs=200;
  for(let x=Math.floor(v.x0/gs)*gs;x<v.x1;x+=gs){g.moveTo(x,v.y0);g.lineTo(x,v.y1)}for(let y=Math.floor(v.y0/gs)*gs;y<v.y1;y+=gs){g.moveTo(v.x0,y);g.lineTo(v.x1,y)}g.stroke();
  if(E.prev){const {xs,ys}=E.prev;g.beginPath();g.moveTo(xs[0],ys[0]);for(let i=1;i<xs.length;i++)g.lineTo(xs[i],ys[i]);
    const W2=E.w*WF,N=xs.length;g.lineJoin=g.lineCap='round';g.strokeStyle=B.verge;g.lineWidth=W2+44;g.stroke();g.strokeStyle=B.track;g.lineWidth=W2;g.stroke();
    g.globalAlpha=.4;g.strokeStyle=B.rut;g.lineWidth=W2*.07;for(const o of [-.22,.22]){edPath(g,xs,ys,0,N-1,o*W2);g.stroke()}g.globalAlpha=1;
    for(const k of [Math.min(6,N-1),Math.max(0,N-7)]){const p=Math.max(0,k-1),q=Math.min(N-1,k+1);const a=Math.atan2(ys[q]-ys[p],xs[q]-xs[p]);g.save();g.translate(xs[k],ys[k]);g.rotate(a);const c=W2/10;for(let i=0;i<10;i++)for(let j=0;j<2;j++){g.fillStyle=(i+j)%2?'#1f2326':'#fff';g.fillRect(-c+j*c,-W2/2+i*c,c,c)}g.restore()}
    for(const [s0,e0,j0,e1] of (E.br||[])){
      g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=W2+16;g.lineCap='butt';g.save();g.translate(14,18);edPath(g,xs,ys,Math.max(s0,j0-6),Math.min(e0,e1+6),0);g.stroke();g.restore();
      edPath(g,xs,ys,s0,e0,0);g.strokeStyle='#f26b1d';g.lineWidth=W2+10;g.stroke();g.strokeStyle='#e8e6df';g.lineWidth=W2+5;g.stroke();
      for(let k=s0;k<e0;k++){const u=Math.min(1,(k-s0)/9,(e0-k)/9);g.globalAlpha=Math.max(0,u);g.beginPath();g.moveTo(xs[k],ys[k]);g.lineTo(xs[k+1],ys[k+1]);g.strokeStyle='#5a5d61';g.lineWidth=W2;g.stroke()}g.globalAlpha=1;
      g.setLineDash([30,34]);edPath(g,xs,ys,s0+9,e0-9,0);g.strokeStyle='rgba(245,245,240,.85)';g.lineWidth=4;g.stroke();g.setLineDash([]);g.lineCap='round'}}
  g.lineWidth=2.5/E.cam.z;g.font=`800 ${11/E.cam.z}px Nunito, sans-serif`;g.textAlign='center';g.textBaseline='middle';
  E.pts.forEach((p,i)=>{const r=10/E.cam.z;g.fillStyle=i===0?'#2f9e57':i===E.pts.length-1?'#23282c':'#f26b1d';g.strokeStyle='#fff';g.beginPath();g.arc(p[0],p[1],r,0,7);g.fill();g.stroke();
    g.fillStyle='#fff';g.fillText(i===0?'S':i===E.pts.length-1?'F':String(i),p[0],p[1]+.5/E.cam.z)});
  g.restore();
}
function edBridges(xs,ys,w){const N=xs.length,gap=Math.ceil(w*3/SP),mark=new Uint8Array(N),out=[];
  for(let j=0;j<N;j++)for(let i=0;i<j-gap;i++){const dx=xs[i]-xs[j],dy=ys[i]-ys[j];if(dx*dx+dy*dy<w*w*1.1){mark[j]=1;break}}
  let j=0;while(j<N){if(!mark[j]){j++;continue}let e=j;while(e<N-1&&mark[e+1])e++;const s0=Math.max(0,j-26),e0=Math.min(N-1,e+26);out.push([s0,e0,j,e]);j=e0+1}return out}
function edPath(g,xs,ys,a,b,off){const N=xs.length;g.beginPath();for(let i=a;i<=b;i++){const p=Math.max(0,i-1),q=Math.min(N-1,i+1);let tx=xs[q]-xs[p],ty=ys[q]-ys[p];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;const x=xs[i]-ty*off,y=ys[i]+tx*off;i===a?g.moveTo(x,y):g.lineTo(x,y)}}
function edDef(){return {name:(E.name||'').trim()||('My stage '+(S.custom.length+(E.idx==null?1:0))),pts:E.pts.map(p=>p.slice()),w:E.w,biome:E.biome}}
function edValid(){edRecalc();if(E.pts.length<3){toast('A stage needs at least 3 points.');return false}if(E.len<600){toast('Too short – spread the points out.');return false}return true}

/* ---------------- screens ---------------- */
let screen='menu';
const tracksState={code:null,del:null};
function coinsHTML(){return `<div class="coins"><span class="coin"></span>${S.coins}</div>`}
function topBar(back){return `<header class="top">${back?`<button class="btn sm" data-act="go" data-to="${back}">‹ Back</button>`:''}<span class="sp"></span>${coinsHTML()}</header>`}
const SCREENS={
  menu(){
    const done=STORY.filter((_,i)=>S.story['s'+i]&&S.story['s'+i].best!=null).length;
    const di=dailyInfo();const dd=S.daily&&S.daily.date===di.ds?S.daily:null;
    let nx=STORY.findIndex((_,i)=>!(S.story['s'+i]&&S.story['s'+i].best!=null));if(nx<0){let lo=9;STORY.forEach((_,i)=>{const t=S.story['s'+i].tier||0;if(t<lo){lo=t;nx=i}})}
    const nst=S.story['s'+nx];const ntier=nst&&nst.best!=null?nst.tier:-1;
    const cnt=[4,3,2,1].map(t=>STORY.filter((_,i)=>S.story['s'+i]&&S.story['s'+i].best!=null&&S.story['s'+i].tier===t).length);
    const carName=(SHOP.body.find(b=>b[0]===S.eq.body)||['','My Rally Car'])[1];
    const swc=S.eq.paint==='po'?'linear-gradient(135deg,#f1efe8 50%,#d8352c 50%)':paintHex(S.eq.paint);
    const mcard=`<div class="card mcard"><div class="row"><span class="eyebrow">${nst&&nst.best!=null?'Chase a better medal':'Next stage'}</span><span class="ssno">SS${nx+1}</span></div>
      <div class="nm">${esc(STORY[nx][0])}</div>
      <div class="row"><span class="note-s">${BIOMES[STORY[nx][1]].name} · ${nst&&nst.best!=null?fmt(nst.best):'No time yet'}</span><span class="pips">${[1,2,3,4].map(k=>`<span class="pip ${ntier>=k?'on'+k:''}"></span>`).join('')}</span></div>
      <button class="btn pri" data-act="story-play" data-i="${nx}">Drive SS${nx+1}</button>
      <div class="mstats">${['Platinum','Gold','Silver','Bronze'].map((n,k)=>`<div class="mstat"><i style="background:${TIERC[4-k]}"></i>${cnt[k]}<small>${n}</small></div>`).join('')}</div>
      <div class="mcar"><span>Your car</span><span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="sw" style="background:${swc}"></span><b>${esc(carName)}</b></span></div></div>`;
    return `<div class="scr menuscr"><div class="menu">
      <div class="title chunk">DUST RUSH<small>RALLY</small></div>
      <div class="mleft">
        <button class="mbtn a chunk" data-act="go" data-to="story">SOLO<span class="sub">${STORY.length} stages · ${done}/${STORY.length} cleared · race your ghost</span></button>
        <button class="mbtn b chunk" data-act="go" data-to="friends">MULTIPLAYER<span class="sub">Hidden random stage · invite with a code</span></button>
        <button class="mbtn c chunk" data-act="go" data-to="daily">DAILY CHALLENGE<span class="sub">${esc(di.mod.n)} · ${dd?'today: '+TIER[dd.tier]:'faster time, more coins'}</span></button>
        <button class="mbtn d chunk" data-act="go" data-to="free">FREE DRIVE<span class="sub">Random stage · pick the length and season</span></button>
      </div>
      <div class="mright">
        ${coinsHTML()}
        <button class="garbtn chunk" data-act="go" data-to="garage">GARAGE</button>
        <div class="icons">
          <button class="ibtn" data-act="go" data-to="tracks" aria-label="Track editor">✎<small>Editor</small></button>
          <button class="ibtn" data-act="go" data-to="settings" aria-label="Settings">⚙<small>Settings</small></button>
          <button class="ibtn" data-act="fs" aria-label="Full screen">⛶<small>${document.fullscreenElement?'Exit':'Full'}</small></button>
          <button class="ibtn" data-act="mute" aria-label="Sound">${S.mute?'×':'♪'}<small>${S.mute?'Muted':'Sound'}</small></button>
        </div>
        ${mcard}
      </div>
      <div class="mfoot"><div class="keysbar">${KEYS_HTML}</div></div>
    </div></div>`},
  story(){
    const card=i=>{const s=STORY[i],st=S.story['s'+i];const tier=st&&st.best!=null?st.tier:-1;const k=i%5;
      const pips=[1,2,3,4].map(k=>`<span class="pip ${tier>=k?'on'+k:''}"></span>`).join('');
      return `<button class="card stage" data-act="story-play" data-i="${i}">
        <div class="ss"><span class="ssno">${k+1}</span><span class="muted">${['Hard','Hard','Very hard','Expert','Insane'][k]}</span></div>
        <div class="nm">${esc(s[0])}</div>
        <div class="meta"><span class="tm">${st&&st.best!=null?fmt(st.best):'–'}</span><span class="pips">${pips}</span></div></button>`};
    const groups=SEASONS.map(b=>{const ids=STORY.map((s,i)=>s[1]===b?i:-1).filter(i=>i>=0);const done=ids.filter(i=>S.story['s'+i]&&S.story['s'+i].best!=null).length;
      return `<section class="sgroup"><div class="shead"><h3 class="chunk">${BIOMES[b].name.toUpperCase()}</h3><span class="sdone">${done}/${ids.length}</span></div><div class="sgrid">${ids.map(card).join('')}</div></section>`}).join('');
    return `<div class="scr dim"><div class="wrap">${topBar('menu')}
      <h2 class="chunk or">SOLO STAGES</h2>
      <div class="card"><p>Seven seasons, five technical stages each, from hard to insane. Every new medal pays coins, and a ghost car shows your best or last run.</p>
      <div class="row"><span class="note-s">Ghost car:</span><div class="seg">${[['best','Best run'],['last','Last run'],['off','Off']].map(([k,n])=>`<button class="${S.ghostMode===k?'on':''}" data-act="ghost" data-m="${k}">${n}</button>`).join('')}</div></div></div>
      ${groups}</div></div>`},
  daily(){
    const di=dailyInfo();if(!di.T)di.T=buildTrack(di.def,di.mod.g);const m=di.T.medals;const d=S.daily&&S.daily.date===di.ds?S.daily:null;const got=d?d.tier:-1;
    const names=['Platinum','Gold','Silver','Bronze','Finish'];const tiersIdx=[4,3,2,1,0];
    const rows=tiersIdx.map((ti,k)=>`<span class="dot" style="background:${TIERC[ti]}"></span><span>${names[k]} <span class="muted tm">${ti>0?fmt(m[4-ti]):''}</span></span><span class="rw ${got>=ti?'got':''}">${got>=ti?'✓ ':''}<span class="coin"></span>${DAILY_REWARD[ti]}</span>`).join('');
    const now=new Date(),mid=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);const left=Math.max(0,mid-now);const hh=Math.floor(left/3.6e6),mm=Math.floor(left%3.6e6/6e4);
    return `<div class="scr dim"><div class="wrap">${topBar('menu')}
      <h2 class="chunk or">DAILY CHALLENGE</h2>
      <div class="card tilt"><div class="eyebrow">${di.ds} · ${BIOMES[di.def.biome].name} · ${(di.T.len*.00012).toFixed(1)} km</div><h3>${esc(di.mod.n)}</h3>
        <p class="muted">${esc(di.mod.d)} Coins stack by tier: beat your time later today and you get the difference.</p>
        <div class="tiers">${rows}</div>
        <div class="meta"><span>Today's best: <span class="tm">${d&&d.best!=null?fmt(d.best):'–'}</span></span><span>New stage in ${hh}h ${mm}m</span></div>
        <div class="row"><button class="btn pri" data-act="daily-play">Start stage</button></div></div></div></div>`},
  friends(){
    const opts=S.custom.map((d,i)=>`<option value="${i}">${esc(d.name)}</option>`).join('');
    return `<div class="scr dim"><div class="wrap">${topBar('menu')}
      <h2 class="chunk">MULTIPLAYER</h2>
      <div class="card"><label class="f">Your nickname<span style="display:flex;gap:8px"><input class="inp" id="nick" maxlength="16" value="${esc(S.nick)}" autocomplete="off" style="flex:1;min-width:0"><button class="btn sm" data-act="nick-rnd" aria-label="Random funny name">🎲 Random</button></span></label></div>
      <div class="card tilt"><h3>Hidden random stage</h3><p class="muted">The game rolls a stage but does not show it. You go straight to the lobby with a code to send your friends.</p>
        <h3 style="font-size:18px">Stage length</h3><div class="seg" style="flex-wrap:wrap">${Object.entries(FD_LEN).map(([k,v])=>`<button class="${MPLEN.v===k?'on':''}" data-act="mplen" data-v="${k}">${v[1]}</button>`).join('')}</div>
        <div class="row"><button class="btn pri" data-act="mp-create">Create lobby</button></div></div>
      <div class="card"><h3>Use one of your stages</h3>${S.custom.length?`<div class="row"><select class="inp" id="mpc">${opts}</select><button class="btn" data-act="mp-create-custom">Create lobby</button></div>`:'<p class="muted">No custom stages yet.</p>'}<div class="row"><button class="btn" data-act="edit-new">Draw a new stage</button></div></div>
      <div class="card"><h3>Join with a code</h3><div class="row"><input class="inp code" id="jcode" maxlength="5" placeholder="CODE" autocomplete="off"><button class="btn pri" data-act="mp-join">Join</button></div>
        <p class="note-s">${window.__fbRoom?'Send your friends the link to this page and the lobby code.':'Friends need access to this page (shared with “can use” or higher) and must be signed in.'}</p></div></div></div>`},
  lobby(){
    if(!MP.room)return SCREENS.friends();
    const ps=MP.room.peers();const hp=mpHostPeer();const hpr=hp?hp.presence:{};
    const list=ps.map(p=>{const pr=p.presence||{};return `<div class="pl"><span class="sw" style="background:${paintHex(String(pr.pt||'p0'))}"></span><span class="pn">${esc(String(pr.nm||'Joining…').slice(0,16))}</span>${pr.h===1?'<span class="tag y">Host</span>':''}${p.sameTab?'<span class="tag">You</span>':''}</div>`}).join('');
    let tname='Hidden random stage'+(FD_LEN[hpr.ln]?' · '+FD_LEN[hpr.ln][1]:'');if(hpr.tk){const d=decTrack(String(hpr.tk));if(d)tname=d.name}
    const waitHost=!hp&&!MP.host&&Date.now()-MP.joinedAt>5000;
    return `<div class="scr dim"><div class="wrap">
      <header class="top"><button class="btn sm" data-act="mp-leave">‹ Leave</button><span class="sp"></span>${coinsHTML()}</header>
      <h2 class="chunk">LOBBY</h2>
      <div class="card tilt"><div class="eyebrow">Lobby code – send it to your friends</div><div class="row"><div class="lobcode">${esc(MP.code)}</div><button class="btn sm" data-act="copy-code">Copy</button></div></div>
      <div class="card"><div class="meta"><h3>Drivers (${ps.length})</h3><span>${esc(tname)}</span></div><div class="plist">${list||'<p class="muted">Connecting…</p>'}</div>
        ${waitHost?'<p class="note-s" style="color:var(--bad)">No host in this lobby. Check the code.</p>':''}
        <div class="row">${MP.host?`<button class="btn pri" data-act="mp-start" ${ps.length<2?'disabled':''}>Start race</button>${ps.length<2?'<span class="note-s">Waiting for at least one more driver…</span>':''}${hpr.tk?'':'<button class="btn" data-act="mp-new">Reroll hidden stage</button>'}</div>${MP.host&&!hpr.tk?`<div class="seg" style="flex-wrap:wrap">${Object.entries(FD_LEN).map(([k,v])=>`<button class="${MP.ln===k?'on':''}" data-act="mplen" data-v="${k}">${v[1]}</button>`).join('')}</div>`:''}<div class="row">`:'<span class="muted">Waiting for the host to start…</span>'}</div></div>
      ${MP.host?`<div class="card"><h3>Car contact</h3><div class="seg">${[[0,'Off · ghost cars'],[1,'On · bump & push']].map(([v,n])=>`<button class="${(MP.cl||0)===v?'on':''}" data-act="mpcol" data-v="${v}">${n}</button>`).join('')}</div></div>`:`<p class="note-s" style="color:#fff;text-shadow:0 1px 0 var(--ink)">Car contact: ${hpr.cl===1?'on, you can bump and push each other':'off, cars pass through each other'}.</p>`}
      <p class="note-s" style="color:#fff;text-shadow:0 1px 0 var(--ink)">The stage is revealed at the countdown. Everyone starts side by side on the grid.</p></div></div>`},
  free(){
    const seg=(k,opts,cur)=>`<div class="seg" style="flex-wrap:wrap">${opts.map(([v,n])=>`<button class="${cur===v?'on':''}" data-act="fd" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
    return `<div class="scr dim"><div class="wrap">${topBar('menu')}
      <h2 class="chunk">FREE DRIVE</h2>
      <div class="card tilt"><p class="muted">A brand new random stage every time. No coins, no pressure: just drive.</p>
        <h3>Length</h3>${seg('len',Object.entries(FD_LEN).map(([k,v])=>[k,v[1]]),FD.len)}
        <h3>Season</h3>${seg('biome',[['random','Random']].concat(Object.entries(BIOMES).map(([k,b])=>[k,b.name])),FD.biome)}
        <div class="row"><button class="btn pri" data-act="free-go">Drive</button></div></div></div></div>`},
  settings(){
    const seg=(k,opts,cur)=>`<div class="seg">${opts.map(([v,n])=>`<button class="${cur===v?'on':''}" data-act="opt" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
    const row=(t,d,c)=>`<div class="meta" style="color:var(--ink);gap:14px"><div><h3 style="font-size:20px">${t}</h3><span class="note-s">${d}</span></div>${c}</div>`;
    return `<div class="scr dim"><div class="wrap">${topBar('menu')}
      <h2 class="chunk">SETTINGS</h2>
      <div class="card tilt">
        ${row('Dust & smoke','Dust puffs behind the wheels and drift smoke.',seg('dust',[['1','On'],['0','Off']],S.opt.dust?'1':'0'))}
        ${row('Ghost car','Which run the grey ghost car replays.',seg('ghost',[['best','Best'],['last','Last'],['off','Off']],S.ghostMode))}
        ${row('Skid marks','Tyre marks left on the road while sliding.',seg('skid',[['1','On'],['0','Off']],S.opt.skid?'1':'0'))}
        ${row('Graphics','Lower it if the game stutters on your device.',`<div class="seg">${[['l','Low'],['m','Medium'],['h','High']].map(([v,n])=>`<button class="${S.opt.gfx===v?'on':''}" data-act="gfx" data-v="${v}">${n}</button>`).join('')}</div>`)}
        ${row('Steering sensitivity','How quickly and how far the car turns when you steer.',`<div class="seg">${[['l','Low'],['n','Normal'],['h','High']].map(([v,n])=>`<button class="${S.opt.sens===v?'on':''}" data-act="sens" data-v="${v}">${n}</button>`).join('')}</div>`)}
        ${row('Sound','Engine, turbo and countdown sounds.',seg('sound',[['1','On'],['0','Off']],S.mute?'0':'1'))}
        ${S.mute?'':row('Volume','Engine and effects (tyres, turbo, beeps).',`<div style="display:flex;flex-direction:column;gap:6px;min-width:170px"><label class="note-s">Engine <input type="range" id="vol-engine" min="0" max="100" value="${Math.round(S.opt.vol.engine*100)}" style="width:100%"></label><label class="note-s">Effects <input type="range" id="vol-fx" min="0" max="100" value="${Math.round(S.opt.vol.fx*100)}" style="width:100%"></label></div>`)}
      </div>
      <h2 class="chunk" style="font-size:26px;margin-top:6px">CAMERA</h2>
      <div class="card tilt">
        ${row('View','Above is the classic rally view. C or the camera button switches during a race.',`<div class="seg" style="flex-wrap:wrap">${VIEWS.map(v=>`<button class="${S.opt.view===v?'on':''}" data-act="view" data-v="${v}">${VNAME[v]}</button>`).join('')}</div>`)}
        ${S.opt.view==='custom'?[['d','Distance','m behind the car',.5],['h','Height','m above it',.25],['fov','Field of view','degrees',1]].map(([k,n,u,st])=>row(n,u,`<div style="display:flex;align-items:center;gap:8px;min-width:170px"><input type="range" id="cam-${k}" min="${CAM_RANGE[k][0]}" max="${CAM_RANGE[k][1]}" step="${st}" value="${S.opt.cam[k]}" style="flex:1"><b class="tm" id="cam-${k}-v">${S.opt.cam[k]}</b></div>`)).join(''):''}
      </div>
      ${TOUCHY?'':`<h2 class="chunk" style="font-size:26px;margin-top:6px">CONTROLS</h2>
      <div class="card tilt">
        <p class="note-s">Click a key, then press the new one. Esc cancels. Esc always pauses too.</p>
        ${Object.keys(DEFAULT_KEYS).map(a=>row(KEY_NAMES[a],'',`<div class="seg">${[0,1].map(i=>`<button class="${KB.wait&&KB.wait.a===a&&KB.wait.i===i?'on':''}" data-act="kb" data-a="${a}" data-i="${i}" style="min-width:74px">${KB.wait&&KB.wait.a===a&&KB.wait.i===i?'Press…':esc(keyLabel(S.keys[a][i]))}</button>`).join('')}</div>`)).join('')}
        <div class="row"><button class="btn sm" data-act="kb-reset">Reset to default</button></div>
      </div>`}
      </div></div>`},
  tracks(){
    const list=S.custom.map((d,i)=>{const G=sget(ghostKey(d.id),{});return `<div class="card"><div class="ss"><span class="ssno">${String(i+1).padStart(2,'0')}</span><span class="muted">${BIOMES[d.biome]?BIOMES[d.biome].name:''}</span></div>
      <div class="nm">${esc(d.name)}</div><div class="meta"><span>${d.pts.length} points</span><span class="tm">${G.best?fmt(G.best.t):'–'}</span></div>
      <div class="row"><button class="btn sm pri" data-act="track-play" data-i="${i}">Drive</button><button class="btn sm" data-act="edit-open" data-i="${i}">Edit</button><button class="btn sm" data-act="track-code" data-i="${i}">Code</button><button class="btn sm warn" data-act="track-del" data-i="${i}">${tracksState.del===i?'Sure?':'Delete'}</button></div>
      ${tracksState.code===i?`<textarea class="inp" id="tcode${i}" readonly>${esc(encTrack(d))}</textarea><div class="row"><button class="btn sm" data-act="copy-track" data-i="${i}">Copy code</button></div>`:''}</div>`}).join('');
    return `<div class="scr dim"><div class="wrap">${topBar('menu')}
      <h2 class="chunk">TRACK EDITOR</h2>
      <div class="row"><button class="btn pri" data-act="edit-new">Draw a new stage</button></div>
      ${list?`<div class="grid">${list}</div>`:'<div class="card"><p class="muted">No saved stages yet. Drop points on the map and the game draws a smooth road through them.</p></div>'}
      <div class="card"><h3>Load a stage from a code</h3><textarea class="inp" id="imp" placeholder="Paste your friend's stage code"></textarea><div class="row"><button class="btn" data-act="import">Load stage</button></div></div></div></div>`},
  garage(){
    const cur=garageCarId(),L=SHOP.body,si=Math.max(0,L.findIndex(x=>x[0]===cur));
    const chips=cat=>SHOP[cat].map(it=>{const id=it[0],nm=it[1],price=cat==='paint'?it[3]:it[2];const own=!!S.owned[id];const eq=S.eq[cat]===id;const can=own||S.coins>=price;const pv=PV&&PV.cat===cat&&PV.id===id;
      return `<button class="chip ${eq?'eq':''} ${pv?'pv':''} ${can?'':'no'}" data-act="shop" data-c="${cat}" data-id="${id}">${cat==='paint'?`<span class="sw" style="background:${it[2]}"></span>`:''}${esc(nm)}${own?'':` <span class="pr"><span class="coin"></span>${price}</span>`}</button>`}).join('');
    const tabs=['paint','liv','wing','decal','lights','rim','dust'];if(!tabs.includes(G.tab))G.tab='paint';
    const pid=PV&&PV.cat==='paint'?PV.id:S.eq.paint,pit=SHOP.paint.find(x=>x[0]===pid),cit=L[si];
    const owned=!!S.owned[cur]||cit[2]===0;
    const pv=(()=>{if(!PV)return '';const it=SHOP[PV.cat].find(x=>x[0]===PV.id);if(!it)return '';const price=PV.cat==='paint'?it[3]:it[2];const ok=S.coins>=price;
      return `<div class="pvbar"><div class="pvt"><span class="muted">Previewing ${esc(CAT_NAMES[PV.cat]||'')}</span><b>${esc(it[1])}</b></div><button class="btn sm" data-act="pv-cancel">Cancel</button><button class="btn sm pri" data-act="pv-buy" ${ok?'':'disabled'}>${ok?'Purchase':'Need '+(price-S.coins)+' more'} <span class="pr"><span class="coin"></span>${price}</span></button></div>`})();
    return `<div class="scr gar ${G.enter?'enter':''} ${PV?'haspv':''}">
      <header class="gtop"><button class="btn sm" data-act="go" data-to="menu">‹ Menu</button><span class="sp"></span>${coinsHTML()}</header>
      <nav class="glist" aria-label="Cars"><div class="in" data-sel="${si}" style="--sel:${G.prevSel!=null?G.prevSel:si}">${L.map((it,i)=>{const ps=G.prevSel!=null?G.prevSel:si,a=Math.min(5,Math.abs(i-ps)),at=Math.min(5,Math.abs(i-si));const own=!!S.owned[it[0]]||it[2]===0;
        return `<button class="gl ${i===si?'on':''} ${at>=5?'far':''}" style="--a:${a}" data-at="${at}" data-act="gcar" data-id="${it[0]}">${esc(it[1])}${own?'':`<span class="lk">🔒 <span class="coin"></span>${it[2]}</span>`}</button>`}).join('')}</div></nav>
      <div class="gname ${!G.enter&&G.lastNm&&G.lastNm!==cit[0]?'swap':''}"><div class="nm">${esc(cit[1])}</div><div class="sub">${esc(pit?pit[1]:'')}${owned?'':' · locked'}</div></div>
      <aside class="gpanel2"><div class="gtabs">${tabs.map(c=>`<button class="${G.tab===c?'on':''}" data-act="gtab" data-c="${c}">${CAT_NAMES[c]}</button>`).join('')}</div>
        <div class="chips">${chips(G.tab)}</div>
        <p class="note-s">Locked items: tap to preview, then Purchase. Coins come from daily challenges and solo medals.</p></aside>
      ${pv}</div>`},
  editor(){
    return `<div class="ed"><div class="ed-top"><button class="btn sm" data-act="ed-back">‹ Exit</button><input class="inp" id="ed-name" maxlength="28" placeholder="Stage name" value="${esc(E.name)}" autocomplete="off"><span class="ed-info" id="ed-info"></span></div>
      <div class="ed-hint">${E.view3d?'3D preview: drag to orbit, scroll to zoom. Switch back to keep editing.':E.tool==='add'?'Tap to add a point at the end, drag points to shape the road. S = start, F = finish.':E.tool==='pan'?'Drag to move the view. Scroll or pinch to zoom.':'Tap a point to delete it.'}</div>
      <div class="ed-sp"></div>
      <div class="ed-bar">
        <div class="seg">${[['add','Point'],['pan','Pan'],['del','Delete']].map(([k,n])=>`<button class="${E.tool===k?'on':''}" data-act="ed-tool" data-t="${k}">${n}</button>`).join('')}</div>
        <div class="grp"><button class="btn sm" data-act="ed-undo">Undo</button><button class="btn sm" data-act="ed-zoom" data-z="1.25" aria-label="Zoom in">+</button><button class="btn sm" data-act="ed-zoom" data-z="0.8" aria-label="Zoom out">−</button><button class="btn sm" data-act="ed-fit">Fit</button></div>
        <label>Width<input type="range" id="ed-w" min="64" max="130" value="${E.w}"></label>
        <label>Scenery<select id="ed-b">${Object.entries(BIOMES).map(([k,b])=>`<option value="${k}" ${E.biome===k?'selected':''}>${b.name}</option>`).join('')}</select></label>
        <div class="grp"><button class="btn sm warn" data-act="ed-clear">${E.confirmClear?'Sure?':'Clear'}</button><button class="btn sm" data-act="ed-save">Save</button><button class="btn sm pri" data-act="ed-test">Test drive</button></div>
      </div></div>`}
};
function show(name){
  const fx=(screen==='menu'&&name==='garage')||(screen==='garage'&&name==='menu');
  if(fx&&!show.busy){show.busy=true;let f=$('#fade');if(!f){f=document.createElement('div');f.id='fade';document.body.appendChild(f)}
    f.style.background=name==='garage'?'#e7e8ea':'#cdd6d9';f.classList.add('on');
    setTimeout(()=>{showNow(name);if(name==='garage'){WS.t0=performance.now();G.enter=true;renderScreen()}requestAnimationFrame(()=>f.classList.remove('on'));show.busy=false},260);return}
  showNow(name)}
function showNow(name){document.body.classList.remove('racing');if(PV&&name!=='garage'){PV=null;setShowCar()}screen=name;mode=name==='editor'?'editor':'menu';ov.classList.toggle('edit',mode==='editor');R=null;hudEls=null;for(const k in K)K[k]=false;renderScreen()}
function renderScreen(){
  if(!SCREENS[screen])return;
  const ae=document.activeElement;const aid=ae&&ae.id;const val=ae&&ae.value;
  const oldScr=UI.querySelector('.scr'),keepScroll=oldScr&&renderScreen.last===screen?oldScr.scrollTop:0;
  const gp=UI.querySelector('.gpanel2'),gps=gp?gp.scrollTop:0;
  UI.innerHTML=SCREENS[screen]();renderScreen.last=screen;
  {const g2=UI.querySelector('.gpanel2');if(g2&&gps)g2.scrollTop=gps}
  if(keepScroll){const ns=UI.querySelector('.scr');if(ns)ns.scrollTop=keepScroll}
  if(screen==='editor'){E.dirty=true;edRecalc()}
  if(screen==='garage')bindGarageDrag();
  if(aid){const el=document.getElementById(aid);if(el){el.focus();if(val!=null&&el.value!==val)el.value=val}}
}

/* ---------------- actions ---------------- */
async function copyText(t,fallbackEl){try{await navigator.clipboard.writeText(t);toast('Copied.')}catch(e){if(fallbackEl){fallbackEl.focus();fallbackEl.select&&fallbackEl.select()}toast('Select the text and copy it manually.')}}
UI.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;audioInit();const a=b.dataset.act,i=+b.dataset.i;
  switch(a){
    case 'go':show(b.dataset.to);break;
    case 'nick-rnd':S.nick=funnyNick();save();renderScreen();if(MP.room)mpPresence({nm:S.nick});break;
    case 'fs':{const de=document.documentElement;const done=()=>{if(screen==='menu')renderScreen()};
      if(document.fullscreenElement){(document.exitFullscreen()||Promise.resolve()).then(done,done)}
      else if(de.requestFullscreen){de.requestFullscreen().then(done,()=>toast('Full screen is not available here. Open the game in its own browser tab and try again.'))}
      else toast('This browser does not support full screen.');break}
    case 'mute':S.mute=!S.mute;save();if(S.mute&&eng){try{eng.g.gain.value=0}catch(_){}}renderScreen();break;
    case 'cam':S.cam=S.cam==='chase'?'iso':'chase';save();renderScreen();toast(S.cam==='chase'?'Camera: chase view behind the car.':'Camera: high view, like a TV helicopter.');break;
    case 'ghost':S.ghostMode=b.dataset.m;save();renderScreen();break;
    case 'fd':FD[b.dataset.k]=b.dataset.v;renderScreen();break;
    case 'mpcol':MP.cl=+b.dataset.v;MPLEN.cl=MP.cl;mpPresence({cl:MP.cl});renderScreen();break;
    case 'mplen':MPLEN.v=b.dataset.v;if(MP.host&&MP.room&&!MP.tk){MP.ln=MPLEN.v;mpNewTrack()}renderScreen();break;
    case 'free-go':case 'free-new':startFree();break;
    case 'view':S.opt.view=b.dataset.v;save();renderScreen();break;
    case 'cam':cycleView();break;
    case 'kb':KB.wait={a:b.dataset.a,i:+b.dataset.i};renderScreen();break;
    case 'kb-reset':for(const a in DEFAULT_KEYS)S.keys[a]=DEFAULT_KEYS[a].slice();KB.wait=null;save();buildKeymap();renderScreen();break;
    case 'sens':S.opt.sens=b.dataset.v;save();renderScreen();break;
    case 'gfx':S.opt.gfx=b.dataset.v;save();applyGfx();if(W){setWorld(null);W=null}renderScreen();break;
    case 'opt':{const k=b.dataset.k,v=b.dataset.v;if(k==='ghost')S.ghostMode=v;else if(k==='sound'){S.mute=v==='0';if(S.mute&&eng){try{eng.g.gain.value=0}catch(_){}}}else S.opt[k]=v==='1';save();renderScreen();break}
    case 'story-play':startRace({def:storyDef(i),kind:'story',idx:i,title:'SS'+(i+1)+' · '+STORY[i][0],back:'story'});break;
    case 'daily-play':{const di=dailyInfo();startRace({def:di.def,kind:'daily',gripMul:di.mod.g,title:'Daily challenge · '+di.mod.n,back:'daily'});break}
    case 'pause':case 'resume':togglePause();break;
    case 'restart':if(R&&R.kind!=='mp')restartRace();break;
    case 'next':if(R&&R.kind==='story'){const n=R.idx+1;startRace({def:storyDef(n),kind:'story',idx:n,title:'SS'+(n+1)+' · '+STORY[n][0],back:'story'})}break;
    case 'quit':{const back=R?R.back:'menu';if(back==='lobby'){if(MP.room)mpPresence(Object.assign({st:'lobby',rd:null,ld:null,qt:MP.curGo,x:null,y:null},MP.host?{go:null}:{}));show(MP.room?'lobby':'friends')}else show(back||'menu');break}
    case 'gcar':garagePick(b.dataset.id);break;
    case 'gtab':G.tab=b.dataset.c;renderScreen();break;
    case 'pv-cancel':PV=null;setShowCar();renderScreen();break;
    case 'pv-buy':{if(!PV)break;const cat=PV.cat,id=PV.id;const it=SHOP[cat].find(x=>x[0]===id);const price=cat==='paint'?it[3]:it[2];
      if(S.coins<price){toast(`You need ${price-S.coins} more coins.`);break}S.coins-=price;S.owned[id]=1;S.eq[cat]=id;PV=null;toast(it[1]+' bought.');save();setShowCar();renderScreen();if(MP.room)mpPresence({bd:S.eq.body,rm:S.eq.rim,pt:S.eq.paint,lv:S.eq.liv,wg:S.eq.wing,dc:S.eq.decal,lt:S.eq.lights});break}
    case 'shop':{const cat=b.dataset.c,id=b.dataset.id;const it=SHOP[cat].find(x=>x[0]===id);
      if(!S.owned[id]){PV={cat,id};setShowCar();renderScreen();break}
      PV=null;S.eq[cat]=id;save();setShowCar();renderScreen();if(MP.room)mpPresence({bd:S.eq.body,rm:S.eq.rim,pt:S.eq.paint,lv:S.eq.liv,wg:S.eq.wing,dc:S.eq.decal,lt:S.eq.lights});break}
    case 'mp-create':mpEnter(genCode(),true,null);break;
    case 'mp-create-custom':{const sel=$('#mpc');const d=S.custom[+sel.value];if(d)mpEnter(genCode(),true,encTrack(d));break}
    case 'mp-join':{const v=($('#jcode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(v.length!==5){toast('Codes are 5 characters.');break}mpEnter(v,false,null);break}
    case 'mp-leave':mpLeave();break;
    case 'mp-start':mpStart();break;
    case 'mp-new':mpNewTrack();renderScreen();break;
    case 'mp-again':mpNewTrack();show('lobby');setTimeout(mpStart,300);break;
    case 'copy-code':copyText(MP.code,null);break;
    case 'edit-new':edNew();show('editor');break;
    case 'edit-open':edOpen(i);show('editor');break;
    case 'track-play':{const d=S.custom[i];startRace({def:d,kind:'custom',title:d.name,back:'tracks'});break}
    case 'track-code':tracksState.code=tracksState.code===i?null:i;tracksState.del=null;renderScreen();break;
    case 'copy-track':copyText(encTrack(S.custom[i]),$('#tcode'+i));break;
    case 'track-del':if(tracksState.del===i){const d=S.custom.splice(i,1)[0];try{localStorage.removeItem(ghostKey(d.id))}catch(_){}tracksState.del=null;tracksState.code=null;save();toast('Stage deleted.')}else tracksState.del=i;renderScreen();break;
    case 'import':{const d=decTrack($('#imp').value);if(!d){toast('That code is not a valid stage.');break}d.id=customId(d);S.custom.push(d);save();toast('“'+d.name+'” loaded.');renderScreen();break}
    case 'ed-back':E.view3d=false;show('tracks');break;
    case 'ed-3d':if(!E.view3d){if(!edValid())break;if(window.__loader){__loader.show()}setTimeout(()=>{try{edBuild3D();E.view3d=true}finally{window.__loader&&__loader.hide(500);renderScreen()}},60)}else{E.view3d=false;if(E.W3){disposeTree(E.W3.scene);E.W3=null}renderScreen()}break;
    case 'ed-tool':E.tool=b.dataset.t;renderScreen();break;
    case 'ed-undo':if(E.undo.length){E.pts=JSON.parse(E.undo.pop());E.dirty=true}break;
    case 'ed-zoom':E.cam.z=clamp(E.cam.z*+b.dataset.z,.08,1.6);break;
    case 'ed-fit':edFit();break;
    case 'ed-clear':if(E.confirmClear){edPush();E.pts=[];E.dirty=true;E.confirmClear=false}else{E.confirmClear=true;setTimeout(()=>{E.confirmClear=false;if(screen==='editor')renderScreen()},2500)}renderScreen();break;
    case 'ed-save':{if(!edValid())break;const d=edDef();d.id=customId(d);if(E.idx!=null)S.custom[E.idx]=d;else{S.custom.push(d);E.idx=S.custom.length-1}E.name=d.name;save();toast('“'+d.name+'” saved.');renderScreen();break}
    case 'ed-test':{if(!edValid())break;E.view3d=false;const d=edDef();d.id='test';startRace({def:d,kind:'test',title:'Test drive · '+d.name,back:'editor'});break}
  }
});
UI.addEventListener('input',e=>{const t=e.target;
  if(t.id==='vol-engine'||t.id==='vol-fx'){S.opt.vol[t.id==='vol-fx'?'fx':'engine']=(+t.value||0)/100;save();if(t.id==='vol-fx')beep(660,.08)}
  if(t.id&&t.id.startsWith('cam-')&&!t.id.endsWith('-v')){const k=t.id.slice(4);S.opt.cam[k]=Math.min(CAM_RANGE[k][1],Math.max(CAM_RANGE[k][0],+t.value));save();const v=$('#'+t.id+'-v');if(v)v.textContent=S.opt.cam[k]}
  if(t.id==='nick'){S.nick=t.value.slice(0,16)||funnyNick();save();if(MP.room)mpPresence({nm:S.nick})}
  if(t.id==='ed-name')E.name=t.value;
  if(t.id==='ed-w'){E.w=+t.value;E.dirty=true}
  if(t.id==='ed-b'){E.biome=t.value}
  if(t.id==='jcode'){const p=t.selectionStart;t.value=t.value.toUpperCase();try{t.setSelectionRange(p,p)}catch(_){}}
});
UI.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='jcode'){const b=UI.querySelector('[data-act="mp-join"]');b&&b.click()}});

loadModel(S.eq.body);
buildShowroom();
renderScreen();
requestAnimationFrame(frame);
window.__loader&&__loader.hide(1400);
})();
