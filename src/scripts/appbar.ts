// Верхняя панель меняет тон, когда страница прокручена (как в M3).
export function initAppbar() {
  const bar = document.querySelector<HTMLElement>('.appbar');
  if (!bar) return;
  const sync = () => bar.classList.toggle('is-scrolled', window.scrollY > 8);
  sync();
  window.addEventListener('scroll', sync, { passive: true });
}
