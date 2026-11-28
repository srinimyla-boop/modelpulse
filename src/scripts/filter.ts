const catalog = document.querySelector<HTMLElement>('[data-catalog]');
if (catalog) {
  const search = catalog.querySelector<HTMLInputElement>('input[name="q"]');
  const controls = [...catalog.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
  const panels = [...catalog.querySelectorAll<HTMLElement>('[data-panel]')];
  const buttons = [...catalog.querySelectorAll<HTMLButtonElement>('[data-view]')];
  const entries = [...catalog.querySelectorAll<HTMLElement>('[data-release]')];
  const filters = [...new Set(controls.map(({ name }) => name))];
  const count = catalog.querySelector<HTMLElement>('[data-count]');
  const empty = catalog.querySelector<HTMLElement>('[data-empty]');
  let view = 'table';

  function refresh() {
    const query = (search?.value ?? '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const selected = filters.map((name) => [name, controls.filter((input) => input.name === name && input.checked).map(({ value }) => value)] as const);
    const matches = new Set<string>();
    for (const entry of entries) {
      const searchable = entry.dataset.search?.toLowerCase() ?? '';
      const visible = query.every((word) => searchable.includes(word)) &&
        selected.every(([name, values]) => !values.length || values.some((value) => entry.dataset[name]?.split('|').includes(value)));
      entry.hidden = !visible;
      if (visible && entry.dataset.release) matches.add(entry.dataset.release);
    }
    for (const group of catalog!.querySelectorAll('details.filter')) {
      const badge = group.querySelector<HTMLElement>('[data-selected]');
      const size = group.querySelectorAll(':checked').length;
      if (badge) {
        badge.textContent = String(size);
        badge.hidden = size === 0;
      }
    }
    for (const group of catalog!.querySelectorAll<HTMLElement>('[data-release-group]')) {
      group.hidden = !group.querySelector('[data-release]:not([hidden])');
    }
    for (const panel of panels) panel.hidden = panel.dataset.panel !== view || !matches.size;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.view === view));
    if (count) count.textContent = `${matches.size} ${matches.size === 1 ? 'model' : 'models'}`;
    if (empty) empty.hidden = matches.size > 0;
  }

  function readUrl() {
    const params = new URLSearchParams(location.search);
    if (search) search.value = params.get('q') ?? '';
    for (const input of controls) input.checked = params.getAll(input.name).includes(input.value);
    view = params.get('view') === 'cards' ? 'cards' : 'table';
    refresh();
  }

  function update() {
    const url = new URL(location.href);
    if (search) {
      url.searchParams.delete('q');
      if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    }
    for (const name of filters) url.searchParams.delete(name);
    for (const input of controls) if (input.checked) url.searchParams.append(input.name, input.value);
    if (buttons.length) {
      url.searchParams.delete('view');
      if (view === 'cards') url.searchParams.set('view', view);
    }
    history.replaceState(history.state, '', url);
    refresh();
  }

  search?.addEventListener('input', update);
  for (const input of controls) input.addEventListener('change', update);
  for (const button of buttons) button.addEventListener('click', () => {
    view = button.dataset.view ?? 'table';
    update();
  });
  catalog.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (search) search.value = '';
    for (const input of controls) input.checked = false;
    update();
  });
  window.addEventListener('popstate', readUrl);
  readUrl();
}
