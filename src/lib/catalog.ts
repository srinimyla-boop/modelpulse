import { getCollection } from 'astro:content';

export async function loadCatalog() {
  const [developers, entries] = await Promise.all([getCollection('developers'), getCollection('models')]);
  const byId = new Map(developers.map((entry) => [entry.id, entry.data]));
  for (const entry of [...developers, ...entries]) {
    const filename = entry.filePath?.split(/[/\\]/).at(-1);
    if (entry.id !== entry.data.id || filename !== entry.id + '.json') {
      throw new Error(`Catalog ID "${entry.data.id}" must match the filename "${filename}".`);
    }
  }
  const models = entries.map(({ data }) => {
    const developer = byId.get(data.developerId.id);
    if (!developer) throw new Error(`Model "${data.id}" references missing developer "${data.developerId.id}".`);
    return { ...data, developer };
  });
  models.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.name.localeCompare(b.name));
  return { models, developers: developers.map(({ data }) => data).sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)) };
}

export type Model = Awaited<ReturnType<typeof loadCatalog>>['models'][number];
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date));
export const monthLabel = (month: string) =>
  new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(new Date(month + '-01'));
export const contextLabel = (tokens?: number) => tokens ? tokens.toLocaleString('en-US') + ' tokens' : 'Unspecified';
