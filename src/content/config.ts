import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { availability, capabilities, openness } from '../lib/taxonomy';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nonempty = z.string().trim().min(1);
const https = z.url({ protocol: /^https$/ }).refine((value) => value.startsWith('https://'));
const uniqueList = <T extends z.ZodType>(item: T) =>
  z.array(item).min(1).refine((items) => new Set(items).size === items.length, 'Values must be unique');

const developers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/developers' }),
  schema: z.strictObject({
    id: slug,
    name: nonempty,
    tagline: nonempty,
    overview: nonempty,
    headquarters: nonempty,
    foundedYear: z.number().int().min(1800),
    focusAreas: uniqueList(nonempty),
    opennessProfile: z.enum(openness),
    officialSite: https,
    featured: z.boolean(),
  }),
});

const models = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/models' }),
  schema: z.strictObject({
    id: slug,
    name: nonempty,
    family: nonempty,
    developerId: reference('developers'),
    releaseDate: z.iso.date(),
    status: z.enum(['active', 'preview', 'legacy']),
    capabilities: uniqueList(z.enum(capabilities)),
    availability: uniqueList(z.enum(availability)),
    contextWindowTokens: z.number().int().positive().optional(),
    license: nonempty,
    summary: nonempty,
    announcementUrl: https,
  }),
});

export const collections = { developers, models };
