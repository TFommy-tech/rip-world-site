(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const year=$('#year'); if(year) year.textContent=new Date().getFullYear();

  // Reveal on scroll.
  const reveal=$$('.reveal');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
    reveal.forEach(el=>io.observe(el));
  }else reveal.forEach(el=>el.classList.add('in'));

  // Cursor ambience.
  const glow=$('.cursor-glow');
  window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}},{passive:true});

  // Visual mode.
  const ambient=$('#ambientToggle');
  if(localStorage.getItem('rw-calm')==='1') document.body.classList.add('calm');
  ambient?.addEventListener('click',()=>{
    document.body.classList.toggle('calm');
    localStorage.setItem('rw-calm',document.body.classList.contains('calm')?'1':'0');
  });

  // System tabs + search.
  const cards=$$('.system-card'), tabs=$$('.tab'), search=$('#systemSearch'), empty=$('#emptySearch');
  let currentTab='all';
  function render(){
    const q=(search?.value||'').trim().toLowerCase(); let shown=0;
    cards.forEach(card=>{
      const cat=card.dataset.cat||''; const text=(card.dataset.search||'').toLowerCase();
      const okTab=currentTab==='all'||cat===currentTab; const okSearch=!q||text.includes(q);
      const show=okTab&&okSearch; card.classList.toggle('hidden-filter',!show); if(show) shown++;
    });
    if(empty) empty.hidden=shown!==0;
  }
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');currentTab=t.dataset.tab;render()}));
  search?.addEventListener('input',render);

  // Copy helpers.
  async function copy(text,button){
    try{await navigator.clipboard.writeText(text);const old=button.textContent;button.textContent='Скопировано ✓';setTimeout(()=>button.textContent=old,1300)}catch{window.prompt('Скопируй адрес:',text)}
  }
  $$('[data-copy-page]').forEach(btn=>btn.addEventListener('click',()=>copy(window.location.href,btn)));
  $$('[data-copy]').forEach(btn=>btn.addEventListener('click',()=>copy(window.location.href,btn)));

  // Active section in navigation.
  const navLinks=$$('.nav a[href^="#"]'); const sections=$$('#systems,#docs,#faq');
  if('IntersectionObserver' in window && navLinks.length){
    const sio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55% 0px',threshold:0}); sections.forEach(s=>sio.observe(s));
  }

  // Document pages: generated TOC + reading progress.
  const article=$('.doc-article');
  if(article){
    const toc=$('.toc-items'); const hs=$$('h2',article);
    hs.forEach((h,i)=>{if(!h.id)h.id='section-'+(i+1);if(toc){const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;toc.appendChild(a)}});
    const progress=$('.reading-progress');
    window.addEventListener('scroll',()=>{if(progress){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+'%'}},{passive:true});
  }
})();
