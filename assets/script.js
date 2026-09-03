
(function(){
  const search = document.querySelector('[data-search]');
  const select = document.querySelector('[data-category-filter]');
  const cards = Array.from(document.querySelectorAll('[data-listing-card]'));
  function filter(){
    const q=(search?.value||'').toLowerCase();
    const c=(select?.value||'').toLowerCase();
    cards.forEach(card=>{
      const text=card.textContent.toLowerCase();
      const cat=(card.getAttribute('data-category')||'').toLowerCase();
      const ok=(!q||text.includes(q))&&(!c||cat===c);
      card.style.display=ok?'':'none';
    });
  }
  if(search) search.addEventListener('input',filter);
  if(select) select.addEventListener('change',filter);
})();
