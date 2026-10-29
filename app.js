const slides=[...document.querySelectorAll('.hero-slide')],dots=document.querySelector('.dots');let current=0,timer;slides.forEach((_,i)=>{const b=document.createElement('button');b.className='dot'+(i===0?' active':'');b.setAttribute('aria-label','輪播第 '+(i+1)+' 張');b.addEventListener('click',()=>{show(i);restart()});dots.appendChild(b)});function show(n){current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current));[...dots.children].forEach((b,i)=>b.classList.toggle('active',i===current))}function restart(){clearInterval(timer);timer=setInterval(()=>show(current+1),5000)}document.querySelector('.hero-prev').addEventListener('click',()=>{show(current-1);restart()});document.querySelector('.hero-next').addEventListener('click',()=>{show(current+1);restart()});restart();(async()=>{try{
const response=await fetch('albums.json',{cache:'no-cache'});
if(!response.ok)throw Error('Album catalog unavailable');
const albums=await response.json();
const candidates=[];
for(const album of albums)for(const photo of album.photos||[])if(photo.src&&/\.(jpe?g|png|webp)$/i.test(photo.src))candidates.push({src:photo.src,group:album.id});
for(const src of ['IMG0684667.JPG','IMG0684668.JPG','IMG0684669.JPG'])candidates.push({src,group:'Hong-Kong-Airport-20261008'});
for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}
const toUrl=src=>src.split('/').map(part=>encodeURIComponent(decodeURIComponent(part))).join('/');
const check=photo=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({photo,landscape:img.naturalWidth/img.naturalHeight>=1.25});img.onerror=()=>resolve(null);img.src=toUrl(photo.src)});
const picked=[],used=new Set(),fallback=[];
for(let i=0;i<candidates.length&&picked.length<slides.length;i+=12){
 const results=await Promise.all(candidates.slice(i,i+12).map(check));
 for(const result of results){if(!result)continue;if(result.landscape&&!used.has(result.photo.group)){picked.push(result.photo);used.add(result.photo.group);if(picked.length>=slides.length)break}else if(fallback.length<slides.length*2)fallback.push(result.photo)}
}
for(const photo of fallback){if(picked.length>=slides.length)break;if(!picked.some(p=>p.src===photo.src)){picked.push(photo)}}
picked.forEach((photo,i)=>{const url=toUrl(photo.src);slides[i].style.backgroundImage='linear-gradient(90deg,rgba(5,5,5,.75) 0%,rgba(5,5,5,.35) 45%,rgba(5,5,5,.12) 100%),url("'+url+'")';slides[i].style.backgroundSize='100% 100%,contain';slides[i].style.backgroundPosition='center,center';slides[i].style.backgroundRepeat='no-repeat';slides[i].setAttribute('aria-label','Jessica Jung 照片 '+(i+1))});
if(picked.length)show(0);
}catch(e){console.warn('Hero carousel unavailable',e)}})();const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));