(function(){
  function escapeHtml(str){
    return String(str || '').replace(/[&<>'"]/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]);
    });
  }

  function cleanLine(line){
    return line.replace(/^[-•]\s*/, '').trim();
  }

  function formatMetaBlocks(){
    document.querySelectorAll('.meta div').forEach(function(block){
      const labelEl = block.querySelector('b');
      if(!labelEl || block.dataset.formatted === 'true') return;
      const label = labelEl.textContent.trim();
      let value = block.textContent.replace(label, '').trim();
      block.dataset.formatted = 'true';

      const labelHtml = '<b>' + escapeHtml(label) + '</b>';
      const lower = label.toLowerCase();
      const lines = value.split(/\r?\n+/).map(function(line){ return line.trim(); }).filter(Boolean);
      const bulletLike = lines.length > 1 && lines.every(function(line){ return /^[-•]\s*/.test(line); });

      if((lower.includes('eligibility') || lower.includes('cost')) && (bulletLike || /^[-•]\s*/.test(value))){
        const items = lines.length ? lines.map(cleanLine).filter(Boolean) : [cleanLine(value)];
        block.innerHTML = labelHtml + '<ul class="mini-list">' + items.map(function(item){
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('') + '</ul>';
        return;
      }

      if(lower.includes('address') && lines.length > 1){
        block.innerHTML = labelHtml + '<span class="meta-lines">' + lines.map(escapeHtml).join('<br>') + '</span>';
        return;
      }

      block.innerHTML = labelHtml + '<span>' + escapeHtml(value) + '</span>';
    });
  }

  function ensureSearchPanel(){
    const cards = Array.from(document.querySelectorAll('[data-listing-card]'));
    if(!cards.length) return;
    if(document.querySelector('[data-search]')) return;

    const h2s = Array.from(document.querySelectorAll('h2'));
    const listingHeading = h2s.find(function(h){ return h.textContent.toLowerCase().includes('verified listings'); });
    if(!listingHeading) return;

    const panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.innerHTML = '<label for="listing-search" class="search-label">Search this page</label><input id="listing-search" data-search type="search" placeholder="Search by county, service, need, or keyword"><p class="small search-hint">Try “rides,” “meals,” “home safety,” “Prince George’s,” or “veterans.”</p>';
    listingHeading.insertAdjacentElement('afterend', panel);
  }

  function ensureCoverageNotice(){
    const cards = document.querySelectorAll('[data-listing-card]');
    if(!cards.length || !window.location.pathname.startsWith('/find-help/')) return;
    if(document.querySelector('[data-coverage-notice]')) return;
    const heading = Array.from(document.querySelectorAll('h2')).find(function(h){
      const t = h.textContent.toLowerCase();
      return t.includes('verified listings') || t.includes('search all verified listings');
    });
    if(!heading) return;
    const note = document.createElement('div');
    note.className = 'coverage-note';
    note.dataset.coverageNotice = 'true';
    note.innerHTML = '<strong>Where we currently serve:</strong> Parent Stay Home is building its directory county by county, beginning with selected areas of Maryland. Not every Maryland county is covered yet. We add resources as we research and verify them. <a href="/contact/">Suggest a location or service</a>.';
    heading.insertAdjacentElement('beforebegin', note);
  }

  function applyQueryParam(){
    const search = document.querySelector('[data-search]');
    if(!search) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if(q && !search.value){
      search.value = q;
      const target = document.querySelector('[data-search]');
      if(target){
        setTimeout(function(){
          target.focus({preventScroll:true});
          const section = target.closest('.section') || target;
          section.scrollIntoView({behavior:'smooth', block:'start'});
        }, 80);
      }
    }
  }

  function setupFilters(){
    const search = document.querySelector('[data-search]');
    const select = document.querySelector('[data-category-filter]');
    const cards = Array.from(document.querySelectorAll('[data-listing-card]'));
    if(!cards.length) return;

    let status = document.querySelector('[data-filter-status]');
    if(!status){
      status = document.createElement('p');
      status.className = 'small filter-status';
      status.setAttribute('aria-live', 'polite');
      status.dataset.filterStatus = 'true';
      const controls = document.querySelector('.filters') || document.querySelector('.search-panel');
      if(controls) controls.insertAdjacentElement('afterend', status);
    }

    function filter(){
      const q = (search && search.value ? search.value : '').toLowerCase().trim();
      const c = (select && select.value ? select.value : '').toLowerCase().trim();
      let shown = 0;
      cards.forEach(function(card){
        const text = card.textContent.toLowerCase();
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        const ok = (!q || text.includes(q)) && (!c || cat === c);
        card.style.display = ok ? '' : 'none';
        if(ok) shown += 1;
      });
      if(q || c){
        if(shown){
          status.textContent = shown + ' matching listing' + (shown === 1 ? '' : 's') + ' shown.';
        } else {
          status.innerHTML = '<div class="no-results"><strong>We don\\'t have a matching listing yet.</strong><p>We may not have researched your parent\\'s location or the service you need. Try another search term, or use these resources to find help now:</p><ul><li>In Maryland: <a href="https://aging.maryland.gov/programs-and-services/maryland-access-point" target="_blank" rel="noopener">Maryland Access Point</a></li><li>Anywhere in the U.S.: <a href="https://eldercare.acl.gov/home" target="_blank" rel="noopener">Eldercare Locator</a></li></ul><a href="/contact/">Suggest a location or service for future research</a>.</div>';
        }
      } else {
        status.textContent = '';
      }
    }

    if(search) search.addEventListener('input', filter);
    if(select) select.addEventListener('change', filter);
    filter();
  }



  function setupEmailSubmission(){
    const wrap = document.querySelector('[data-email-submission]');
    const button = document.querySelector('[data-compose-email]');
    if(!wrap || !button) return;
    button.addEventListener('click', function(){
      const fields = Array.from(wrap.querySelectorAll('[data-field]'));
      const lines = fields.map(function(field){
        const label = field.getAttribute('data-field') || 'Field';
        const value = (field.value || '').trim();
        return label + ': ' + value;
      });
      const subject = 'Provider/resource submission for Parent Stay Home';
      const body = 'Please review this suggested provider or resource for Parent Stay Home.\n\n' + lines.join('\n') + '\n\nSubmitted from parentstayhome.com';
      window.location.href = 'mailto:hello@parentstayhome.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    setupEmailSubmission();
    formatMetaBlocks();
    ensureSearchPanel();
    ensureCoverageNotice();
    applyQueryParam();
    setupFilters();
  });
})();
