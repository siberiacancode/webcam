import { defineCollection, z } from 'astro:content';

const layoutCollection = defineCollection({
  type: 'content',
  schema: z.object({ 'link.builtBy': z.string(), 'link.sourceCode': z.string() })
});

const javascriptBasicCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    'breadcrumbs.home': z.string(),
    'breadcrumbs.javascript': z.string(),
    'breadcrumbs.basic': z.string(),
    'button.openCamera': z.string(),
    'link.viewSource': z.string()
  })
});

export const collections = {
  layout: layoutCollection,
  'javascript~basic': javascriptBasicCollection
};
