(()=>{'use strict';
/* ===== KONFIGURASI: isi link WhatsApp Channel di sini ===== */
const CONFIG={wa_ann:'https://whatsapp.com/channel/0029VbEJInnA2pLGEGi6rT1g',wa_channel:'https://whatsapp.com/channel/0029VbDvpID7oQhXPaT1ar1B'};
/* ===== LATEST UPDATES: tambah pengumuman baru di paling atas ===== */
const UPDATES=[{title:'Ikuti Channel WhatsApp Announcement',desc:'Dapatkan info terbaru, maintenance, dan update AM Premium Generator langsung dari Channel WhatsApp Announcement.',date:'2026-11-22',isNew:true}];

const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const toastEl=$('#toast');let tt;
const toast=m=>{toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),2200)};

// loader
const t0=performance.now();
addEventListener('load',()=>setTimeout(()=>{$('#loader').classList.add('done')},Math.max(0,900-(performance.now()-t0))));
setTimeout(()=>$('#loader').classList.add('done'),4000);

// link config
$$('[data-link]').forEach(a=>{const u=CONFIG[a.dataset.link];if(u){a.href=u}else{a.classList.add('soon');a.removeAttribute('href');const g=$('.go',a);if(g)g.append(' · segera');a.addEventListener('click',e=>{e.preventDefault();toast('Link segera tersedia')})}});

// updates
const fmt=d=>new Date(d+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#updates-list').innerHTML=UPDATES.map(u=>`<article class="card up rv" style="--c:var(--p)"><div class="row">${u.isNew?'<span class="badge pink">NEW</span>':''}<time datetime="${u.date}">${fmt(u.date)}</time></div><h3>${esc(u.title)}</h3><p>${esc(u.desc)}</p></article>`).join('');

// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(e=>io.observe(e));

// nav state + back to top
const nav=$('#nav'),top=$('#top'),secs=$$('main section'),navLinks=$$('.links a,.bnav a');
const onScroll=()=>{nav.classList.toggle('sc',scrollY>20);top.classList.toggle('show',scrollY>600)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
top.onclick=()=>scrollTo({top:0});
const VIEWS=['home','projects','community','about','contact'],TITLES={home:'HANZPIW OFFICIAL — Welcome to My Digital World',projects:'Projects — HANZPIW OFFICIAL',community:'Community — HANZPIW OFFICIAL',about:'About — HANZPIW OFFICIAL',contact:'Contact — HANZPIW OFFICIAL'};
secs.forEach(s=>s.classList.add('view'));
const route=()=>{let id=location.hash.slice(1);if(id==='updates')id='community';if(!VIEWS.includes(id))id='home';
secs.forEach(s=>s.classList.toggle('active',s.id===id));
navLinks.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+id));
document.title=TITLES[id];scrollTo({top:0,behavior:'instant'});onScroll()};
addEventListener('hashchange',route);route();

// clock WIB
const clk=$$('[data-clock]'),f=new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
const tick=()=>{const s=f.format(new Date()).replace(/\./g,':');clk.forEach(e=>e.textContent=s)};tick();setInterval(tick,1000);

// share + copy
$$('[data-share]').forEach(b=>b.onclick=async()=>{const d={title:document.title,text:'HANZPIW OFFICIAL — Welcome to My Digital World',url:location.href};try{if(navigator.share){await navigator.share(d);return}await navigator.clipboard.writeText(d.url);toast('Link website disalin')}catch(e){if(e.name!=='AbortError')toast('Gagal membagikan')}});
$$('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('Username disalin: '+b.dataset.copy)}catch{toast('Salin manual: '+b.dataset.copy)}});

// visitor counter (real, via /api/visit)
(async()=>{const els=$$('[data-visits]');let first=true;try{first=!sessionStorage.getItem('hp_v')}catch{}
try{const r=await fetch('/api/visit',{method:first?'POST':'GET'});if(!r.ok)throw 0;const{count}=await r.json();try{sessionStorage.setItem('hp_v','1')}catch{}els.forEach(e=>e.textContent=count.toLocaleString('id-ID'))}catch{els.forEach(e=>e.textContent='—')}})();

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
// cursor (desktop only)
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){const c=$('#cur');c.classList.add('on');let x=0,y=0,cx=0,cy=0;
addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY},{passive:true});
(function l(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(l)})();
document.addEventListener('mouseover',e=>c.classList.toggle('hv',!!e.target.closest('a,button')))}

// particles
if(!reduce){const cv=$('#fx'),g=cv.getContext('2d');let w,h,P=[];const n=innerWidth<700?22:48,col=['36,107,253','139,92,246','236,72,153'];
const rs=()=>{w=cv.width=innerWidth;h=cv.height=innerHeight};rs();addEventListener('resize',rs);
for(let i=0;i<n;i++)P.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.4,v:Math.random()*.3+.08,c:col[i%3],a:Math.random()*.5+.2});
(function d(){if(!document.hidden){g.clearRect(0,0,w,h);for(const p of P){p.y-=p.v;if(p.y<-5){p.y=h+5;p.x=Math.random()*w}g.fillStyle=`rgba(${p.c},${p.a})`;g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill()}}requestAnimationFrame(d)})()}
})();
