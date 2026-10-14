(()=>{const page=(location.pathname.split('/').pop()||'index.html');const servicePages=new Set(['insurance.html','guarantees.html','leasing.html','credit.html','factoring.html','rko.html','support.html','ved.html']);const solutionPages=new Set(['growth-finance.html','working-capital.html']);let active=page;if(servicePages.has(page))active='services.html';if(solutionPages.has(page))active='solutions.html';document.querySelectorAll('.links a').forEach(a=>{if(a.getAttribute('href')===active)a.classList.add('active')});const footerBrand=document.querySelector('.footerBrand');if(footerBrand)footerBrand.setAttribute('href','#top');const head=document.querySelector('.sitehead');if(head&&!head.querySelector('.menuToggle')){const b=document.createElement('button');b.className='menuToggle';b.type='button';b.setAttribute('aria-label','Открыть меню');b.setAttribute('aria-expanded','false');b.innerHTML='<span></span><span></span><span></span>';head.querySelector('.nav').appendChild(b);b.addEventListener('click',()=>{const open=head.classList.toggle('menuOpen');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>head.classList.remove('menuOpen')))}document.querySelectorAll('.openModal').forEach(b=>{if((b.textContent||'').trim()==='Получить решение')b.textContent='Получить бесплатный расчёт'});})();

/* Present the requested 812-ending format before iOS handles the call. */
(()=>{
  const triggers=document.querySelectorAll('a.phoneTrigger');
  if(!triggers.length)return;
  const overlay=document.createElement('div');
  overlay.className='phoneConfirm';
  overlay.hidden=true;
  overlay.innerHTML=
    '<div class="phoneConfirmPanel" role="dialog" aria-modal="true" aria-label="Звонок эксперту">'+
    '<div class="phoneConfirmLabel">Позвонить эксперту</div>'+
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

/* Position the single phone popover beside the exact desktop button that was clicked.
   "Discuss a task" and header Consultation open directly underneath themselves;
   the floating phone keeps its popover beside the floating button. */
(()=>{
  const pop=document.getElementById('phonePopover');
  if(!pop)return;
  const desktop=window.matchMedia('(min-width:901px)');
  const label=pop.querySelector('span');
  if(label)label.textContent='Телефон';
  const number=pop.querySelector('strong');
  if(number){
    const dial=document.createElement('a');
    dial.href='tel:+79668877812';
    dial.textContent='8 (966) 88-77-812';
    dial.setAttribute('aria-label','Позвонить 8 (966) 88-77-812');
    number.replaceChildren(dial);
  }

  let anchor=null;
  let queued=false;
  const place=()=>{
    queued=false;
    if(!desktop.matches||!pop.classList.contains('show')||!anchor||!anchor.isConnected)return;
    // Avoid legacy fixed placement for the Consultation button.
    pop.classList.remove('fromHeader');
    const rect=anchor.getBoundingClientRect();
    const popup=pop.getBoundingClientRect();
    const width=popup.width||240;
    const height=popup.height||84;
    const inset=12, gap=10;
    const viewportWidth=document.documentElement.clientWidth;
    const viewportHeight=window.innerHeight;
    const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

    let left,top;
    if(anchor.classList.contains('float')){
      // Floating phone: popover to the left, and never on top of the footer.
      left=rect.left-width-gap;
      top=rect.top+(rect.height-height)/2;
      if(left<inset)left=rect.right+gap;
    }else{
      // Header "Консультация" and page "Обсудить задачу": directly below button.
      left=rect.left+(rect.width-width)/2;
      top=rect.bottom+gap;
      if(top+height>viewportHeight-inset && rect.top-height-gap>=inset){
        top=rect.top-height-gap;
      }
    }
    pop.style.left=clamp(left,inset,Math.max(inset,viewportWidth-width-inset))+'px';
    pop.style.top=clamp(top,inset,Math.max(inset,viewportHeight-height-inset))+'px';
    pop.style.right='auto';
    pop.style.bottom='auto';
  };
  const schedule=()=>{
    if(queued)return;
    queued=true;
    window.requestAnimationFrame(place);
  };

  // Inline page handlers toggle visibility on bubble; measure the visible
  // popover after they finish, before the browser paints the next frame.
  document.addEventListener('click',event=>{
    if(!desktop.matches)return;
    const target=event.target;
    const trigger=target instanceof Element?target.closest('a.phoneTrigger'):null;
    if(!trigger)return;
    // Switching from another call button should reposition, not toggle closed.
    if(anchor&&anchor!==trigger&&pop.classList.contains('show')){
      pop.classList.remove('show');
    }
    anchor=trigger;
    schedule();
  },true);

  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',schedule,{passive:true});
    window.visualViewport.addEventListener('scroll',schedule,{passive:true});
  }
})();

/* Keep the floating telephone outside the navy footer on every page.
   Its offset tracks the footer's viewport position while scrolling. */
(()=>{
  const phone=document.querySelector('.float.phoneTrigger');
  const footer=document.querySelector('footer.footer');
  if(!phone||!footer)return;
  const baseBottom=22;
  const gapAboveFooter=16;
  let scheduled=false;
  const positionPhone=()=>{
    scheduled=false;
    const footerTop=footer.getBoundingClientRect().top;
    const overlap=window.innerHeight-footerTop;
    const bottom=Math.max(baseBottom,Math.ceil(overlap+gapAboveFooter));
    phone.style.setProperty('--fin-phone-bottom',bottom+'px');
  };
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    window.requestAnimationFrame(positionPhone);
  };
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',schedule,{passive:true});
    window.visualViewport.addEventListener('scroll',schedule,{passive:true});
  }
  schedule();
})();
