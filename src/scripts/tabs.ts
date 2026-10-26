// Табы правил. Без JavaScript все три блока просто идут друг за другом.
export function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const list = root.querySelector<HTMLElement>('[role="tablist"]');
    if (!list) return;
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')!)!);

    const select = (i: number, focus = false) => {
      tabs.forEach((tab, j) => {
        const on = i === j;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };

    list.hidden = false;
    root.classList.add('is-tabs');
    panels.forEach((p) => (p.tabIndex = 0));
    select(0);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (e) => {
        const n = tabs.length;
        const to = { ArrowRight: i + 1, ArrowLeft: i - 1 + n, Home: 0, End: n - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        select(to % n, true);
      });
    });
  });
}
