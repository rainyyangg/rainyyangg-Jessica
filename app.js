const slides=[...document.querySelectorAll('.hero-slide')],dots=document.querySelector('.dots');let current=0,timer;slides.forEach((_,i)=>{const b=document.createElement('button');b.className='dot'+(i===0?' active':'');b.setAttribute('aria-label','輪播第 '+(i+1)+' 張');b.addEventListener('click',()=>{show(i);restart()});dots.appendChild(b)});function show(n){current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current));[...dots.children].forEach((b,i)=>b.classList.toggle('active',i===current))}function restart(){clearInterval(timer);timer=setInterval(()=>show(current+1),5000)}document.querySelector('.hero-prev').addEventListener('click',()=>{show(current-1);restart()});document.querySelector('.hero-next').addEventListener('click',()=>{show(current+1);restart()});restart();(async()=>{try{
const response=await fetch('albums.json',{cache:'default'});
if(!response.ok)throw Error('Album catalog unavailable');
const albums=await response.json();
const toUrl=src=>src.split('/').map(part=>encodeURIComponent(decodeURIComponent(part))).join('/');
const candidates=[];
for(const album of albums){
 for(const photo of (album.photos||[]).slice(0,4)){
  if(photo.src&&/\.(jpe?g|png|webp)$/i.test(photo.src))candidates.push(photo.src);
 }
 if(candidates.length>=80)break;
}
const picked=[];
async function check(src){
 return await new Promise(resolve=>{
  const img=new Image();
  img.onload=()=>resolve(img.naturalWidth>0?src:null);
  img.onerror=()=>resolve(null);
  img.src=toUrl(src);
 });
}
for(const src of candidates){
 if(picked.length>=slides.length)break;
 const valid=await check(src);
 if(valid&&!picked.includes(valid))picked.push(valid);
}
if(!picked.length)throw Error('No usable carousel images');
const loaded=new Set();
function loadSlide(i){
 if(loaded.has(i)||!picked[i])return;
 loaded.add(i);
 slides[i].style.backgroundImage='linear-gradient(90deg,rgba(5,5,5,.75) 0%,rgba(5,5,5,.35) 45%,rgba(5,5,5,.12) 100%),url("'+toUrl(picked[i])+'")';
 slides[i].style.backgroundSize='100% 100%,contain';
 slides[i].style.backgroundPosition='center,center';
 slides[i].style.backgroundRepeat='no-repeat';
}
const oldShow=show;
show=function(n){const i=(n+slides.length)%slides.length;loadSlide(i);oldShow(n)};
loadSlide(0);show(0);
}catch(e){console.warn('Hero carousel unavailable',e)}})();const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));