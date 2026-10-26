// Полноэкранный просмотр скриншотов: <dialog>, листание кнопками, стрелками и свайпом.
export function initLightbox(text: Record<string, string>) {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', text.galleryTitle || '');
  dlg.innerHTML = `
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__cap"></figcaption>
    </figure>
    <button class="icon-btn lightbox__btn lightbox__close" type="button" aria-label="${text.close}">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
    <button class="icon-btn lightbox__btn lightbox__prev" type="button" aria-label="${text.prev}">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>
    </button>
    <button class="icon-btn lightbox__btn lightbox__next" type="button" aria-label="${text.next}">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
    </button>`;
  document.body.appendChild(dlg);

  const img = dlg.querySelector<HTMLImageElement>('.lightbox__img')!;
  const cap = dlg.querySelector<HTMLElement>('.lightbox__cap')!;
  const prevBtn = dlg.querySelector<HTMLButtonElement>('.lightbox__prev')!;
  const nextBtn = dlg.querySelector<HTMLButtonElement>('.lightbox__next')!;
  let group: HTMLAnchorElement[] = [];
  let index = 0;

  const show = (i: number) => {
    index = (i + group.length) % group.length;
    const a = group[index];
    img.src = a.href;
    img.alt = a.dataset.caption || '';
    cap.textContent = a.dataset.caption || '';
    const many = group.length > 1;
    prevBtn.hidden = nextBtn.hidden = !many;
  };

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      group = links.filter((l) => l.dataset.lightbox === a.dataset.lightbox);
      show(group.indexOf(a));
      dlg.showModal();
    });
  });

  dlg.querySelector('.lightbox__close')!.addEventListener('click', () => dlg.close());
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Свайп влево/вправо на телефоне
  let x0: number | null = null;
  dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50 && group.length > 1) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  dlg.addEventListener('close', () => { img.removeAttribute('src'); });
}
