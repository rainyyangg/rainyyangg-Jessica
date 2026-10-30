(async()=>{
const id=new URLSearchParams(location.search).get('event');
const title=document.getElementById('title'),summary=document.getElementById('summary'),filters=document.getElementById('filters'),grid=document.getElementById('photos'),box=document.getElementById('lightbox');
try{
const response=await fetch('albums.json',{cache:'no-cache'});
if(!response.ok)throw Error('catalog unavailable');
const albums=await response.json(),album=albums.find(a=>a.id===id);
if(!album){title.textContent='ALBUM NOT FOUND';summary.textContent='找不到相簿，請回首頁確認。';return;}
title.textContent=album.title.toUpperCase();
document.title=album.title+' — STILL, JESSICA';
const hasStages=album.photos.some(p=>p.stage==='rehearsal');
let stage=hasStages?'performance':'all',selected='all',visible=[],currentIndex=0;
function showAt(i){
 if(!visible.length)return;
 currentIndex=(i+visible.length)%visible.length;
 const item=visible[currentIndex];
 box.querySelector('img').src=item.src;
 box.querySelector('p').textContent=item.photographer+' · '+item.name+' ('+(currentIndex+1)+'/'+visible.length+')';
 box.classList.add('open');
}
function button(label,active,onclick){
 const b=document.createElement('button');b.textContent=label;b.className=active?'active':'';b.onclick=onclick;return b;
}
function render(){
 filters.replaceChildren();
 const stagePhotos=album.photos.filter(p=>stage==='all'||(p.stage||'performance')===stage);
 const names=[...new Set(stagePhotos.map(p=>p.photographer))];
 if(selected!=='all'&&!names.includes(selected))selected='all';
 if(hasStages){
  const stages=document.createElement('div');stages.className='stage-tabs';
  const performanceCount=album.photos.filter(p=>(p.stage||'performance')==='performance').length;
  const rehearsalCount=album.photos.filter(p=>p.stage==='rehearsal').length;
  stages.append(button('演唱會 ('+performanceCount+')',stage==='performance',()=>{stage='performance';selected='all';render()}));
  stages.append(button('彩排 ('+rehearsalCount+')',stage==='rehearsal',()=>{stage='rehearsal';selected='all';render()}));
  filters.append(stages);
  const heading=document.createElement('h2');heading.className='stage-heading';heading.textContent=stage==='rehearsal'?'彩排':'演唱會';filters.append(heading);
 }
 const photographers=document.createElement('div');photographers.className='photographer-tabs';
 for(const name of names){
  const count=stagePhotos.filter(p=>p.photographer===name).length;
  photographers.append(button(name+' ('+count+')',selected===name,()=>{selected=name;render()}));
 }
 filters.append(photographers);
 visible=stagePhotos.filter(p=>selected==='all'||p.photographer===selected);
 summary.textContent=album.date+' · '+album.photos.length+' 張可瀏覽照片 · '+(hasStages?'演唱會 / 彩排 · ':'')+'依攝影者分類';
 grid.replaceChildren();
 for(const [i,item] of visible.entries()){
  const b=document.createElement('button');b.className='photo-tile';
  const img=document.createElement('img');img.loading='lazy';img.src=item.src;img.alt=item.photographer+' '+item.name;
  const caption=document.createElement('div');caption.className='tile-info';caption.textContent=item.photographer+' · '+item.name;
  b.append(img,caption);b.onclick=()=>showAt(i);grid.append(b);
 }
}

render();
box.querySelector('.photo-nav.prev').onclick=()=>showAt(currentIndex-1);
box.querySelector('.photo-nav.next').onclick=()=>showAt(currentIndex+1);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape')box.classList.remove('open');
 if(!box.classList.contains('open'))return;
 if(e.key==='ArrowRight'){e.preventDefault();showAt(currentIndex+1)}
 else if(e.key==='ArrowLeft'){e.preventDefault();showAt(currentIndex-1)}
});
}catch(e){title.textContent='TEMPORARILY UNAVAILABLE';summary.textContent='相簿資料暫時無法載入，請稍後再試。'}
box.querySelector('button').onclick=()=>box.classList.remove('open');
box.onclick=e=>{if(e.target===box)box.classList.remove('open')};
})();
