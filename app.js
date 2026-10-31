const slides=[...document.querySelectorAll('.hero-slide')],dots=document.querySelector('.dots');let current=0,timer;slides.forEach((_,i)=>{const b=document.createElement('button');b.className='dot'+(i===0?' active':'');b.setAttribute('aria-label','輪播第 '+(i+1)+' 張');b.addEventListener('click',()=>{show(i);restart()});dots.appendChild(b)});function show(n){current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current));[...dots.children].forEach((b,i)=>b.classList.toggle('active',i===current))}function restart(){clearInterval(timer);timer=setInterval(()=>show(current+1),5000)}document.querySelector('.hero-prev').addEventListener('click',()=>{show(current-1);restart()});document.querySelector('.hero-next').addEventListener('click',()=>{show(current+1);restart()});restart();(async()=>{try{
const response=await fetch('albums.json',{cache:'default'});
if(!response.ok)throw Error('Album catalog unavailable');
const albums=await response.json();
const toUrl=src=>src.split('/').map(part=>encodeURIComponent(decodeURIComponent(part))).join('/');
const picked=[];
for(const album of albums){
 const photo=(album.photos||[]).find(p=>p.src&&/\.(jpe?g|png|webp)$/i.test(p.src));
 if(photo){picked.push(photo.src);if(picked.length>=slides.length)break}
}
const loaded=new Set();
function loadSlide(i){
 if(loaded.has(i)||!picked[i]||!slides[i])return;
 loaded.add(i);
 const url=toUrl(picked[i]);
 slides[i].style.backgroundImage='linear-gradient(90deg,rgba(5,5,5,.75) 0%,rgba(5,5,5,.35) 45%,rgba(5,5,5,.12) 100%),url("'+url+'")';
 slides[i].style.backgroundSize='100% 100%,contain';
 slides[i].style.backgroundPosition='center,center';
 slides[i].style.backgroundRepeat='no-repeat';
 slides[i].setAttribute('aria-label','Jessica Jung 照片 '+(i+1));
}
const originalShow=show;
show=function(n){const i=(n+slides.length)%slides.length;loadSlide(i);originalShow(n)};
loadSlide(0);
}catch(e){console.warn('Hero carousel unavailable',e)}})();const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));