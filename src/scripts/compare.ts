const comparison = document.querySelector<HTMLElement>('[data-comparison]');
if (comparison) {
  const selectors = [...comparison.querySelectorAll<HTMLSelectElement>('[data-model]')];
  const templates = new Map([...comparison.querySelectorAll<HTMLTemplateElement>('template[data-model-id]')]
    .map((template) => [template.dataset.modelId, template.content]));
  const rows = [...comparison.querySelectorAll<HTMLTableRowElement>('.comparison-table tr')];
  const table = comparison.querySelector<HTMLElement>('.comparison-table');
  const message = comparison.querySelector<HTMLElement>('[data-compare-message]');
  const defaults = selectors.map((select) => select.value).filter(Boolean);

  function render() {
    const models = selectors.map((select) => select.value).filter(Boolean);
    for (const select of selectors) {
      for (const option of select.options) {
        option.disabled = Boolean(option.value && option.value !== select.value && models.includes(option.value));
      }
    }
    const ready = models.length >= 2;
    if (table) table.hidden = !ready;
    if (message) message.hidden = ready;
    rows.forEach((row) => {
      while (row.cells.length > 1) row.deleteCell(-1);
    });
    if (!ready) return;
    for (const id of models) {
      templates.get(id)?.querySelectorAll('th, td').forEach((cell, index) => {
        rows[index]?.append(cell.cloneNode(true));
      });
    }
  }

  function readUrl() {
    const param = new URLSearchParams(location.search).get('models');
    const models = param === null ? defaults : [...new Set(param.split(',').filter((id) => templates.has(id)))];
    selectors.forEach((select, index) => { select.value = models[index] ?? ''; });
    render();
  }

  for (const select of selectors) {
    select.addEventListener('change', () => {
      const url = new URL(location.href);
      url.searchParams.set('models', selectors.map((item) => item.value).filter(Boolean).join(','));
      history.replaceState(history.state, '', url);
      render();
    });
  }
  window.addEventListener('popstate', readUrl);
  readUrl();
}
