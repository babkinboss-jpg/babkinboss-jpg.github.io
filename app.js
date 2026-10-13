(()=>{const page=(location.pathname.split('/').pop()||'index.html');const servicePages=new Set(['insurance.html','guarantees.html','leasing.html','credit.html','factoring.html','rko.html','support.html','ved.html']);const solutionPages=new Set(['growth-finance.html','working-capital.html']);let active=page;if(servicePages.has(page))active='services.html';if(solutionPages.has(page))active='solutions.html';document.querySelectorAll('.links a').forEach(a=>{if(a.getAttribute('href')===active)a.classList.add('active')});const footerBrand=document.querySelector('.footerBrand');if(footerBrand)footerBrand.setAttribute('href','#top');const head=document.querySelector('.sitehead');if(head&&!head.querySelector('.menuToggle')){const b=document.createElement('button');b.className='menuToggle';b.type='button';b.setAttribute('aria-label','Открыть меню');b.setAttribute('aria-expanded','false');b.innerHTML='<span></span><span></span><span></span>';head.querySelector('.nav').appendChild(b);b.addEventListener('click',()=>{const open=head.classList.toggle('menuOpen');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>head.classList.remove('menuOpen')))}document.querySelectorAll('.openModal').forEach(b=>{if((b.textContent||'').trim()==='Получить решение')b.textContent='Обсудить задачу'});})();

/* Present the requested 812-ending format before iOS handles the call. */
(()=>{
  const triggers=document.querySelectorAll('a.phoneTrigger');
  if(!triggers.length)return;
  const overlay=document.createElement('div');
  overlay.className='phoneConfirm';
  overlay.hidden=true;
  overlay.innerHTML=
    '<div class="phoneConfirmPanel" role="dialog" aria-modal="true" aria-label="Звонок эксперту">'+
    '<div class="phoneConfirmLabel">Телефон для связи</div>'+
    '<div class="phoneConfirmNumber">8 (966) 88-77-812</div>'+
    '<a class="phoneConfirmCall" href="tel:+79668877812">Позвонить</a>'+
    '<button class="phoneConfirmCancel" type="button">Отмена</button>'+
    '</div>';
  document.body.appendChild(overlay);
  const call=overlay.querySelector('.phoneConfirmCall');
  const cancel=overlay.querySelector('.phoneConfirmCancel');
  let lastTrigger=null;
  const close=()=>{
    overlay.hidden=true;
    if(lastTrigger)lastTrigger.focus();
  };
  triggers.forEach(trigger=>trigger.addEventListener('click',event=>{
    if(!window.matchMedia('(max-width:900px)').matches)return;
    event.preventDefault();
    lastTrigger=trigger;
    overlay.hidden=false;
    call.focus();
  }));
  cancel.addEventListener('click',close);
  overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
  call.addEventListener('click',()=>{overlay.hidden=true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!overlay.hidden)close();
  });
})();
