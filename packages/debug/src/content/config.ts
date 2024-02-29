import { defineCollection, z } from 'astro:content';

const homeBasicCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
});

const javascriptCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    'card.basic.title': z.string(),
    'card.basic.description': z.string(),

    'card.snapshot.title': z.string(),
    'card.snapshot.description': z.string(),

    'card.selectResolution.title': z.string(),
    'card.selectResolution.description': z.string(),

    'card.selectSources.title': z.string(),
    'card.selectSources.description': z.string()
  })
});

const javascriptBasicCollection = defineCollection({
  type: 'data',
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

const javascriptSelectResolutionBasicCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),

    'breadcrumbs.home': z.string(),
    'breadcrumbs.javascript': z.string(),
    'breadcrumbs.selectResolution': z.string(),

    'slider.width.label': z.string(),
    'checkbox.lockAspectRatio.label': z.string(),
    'link.viewSource': z.string()
  })
});

const javascriptSelectSourcesBasicCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),

    'breadcrumbs.home': z.string(),
    'breadcrumbs.javascript': z.string(),
    'breadcrumbs.selectSources': z.string(),

    'select.audioInput.label': z.string(),
    'select.audioOutput.label': z.string(),
    'select.videoSource.label': z.string(),

    'link.viewSource': z.string()
  })
});

const javascriptSnapshotBasicCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),

    'breadcrumbs.home': z.string(),
    'breadcrumbs.javascript': z.string(),
    'breadcrumbs.snapshot': z.string(),

    'button.takeSnapshot': z.string(),
    'link.viewSource': z.string()
  })
});

const layoutCollection = defineCollection({
  type: 'data',
  schema: z.object({ title: z.string(), 'link.builtBy': z.string(), 'link.sourceCode': z.string() })
});

export const collections = {
  home: homeBasicCollection,
  javascript: javascriptCollection,
  'javascript~basic': javascriptBasicCollection,
  'javascript~select-sources': javascriptSelectSourcesBasicCollection,
  'javascript~select-resolution': javascriptSelectResolutionBasicCollection,
  'javascript~snapshot': javascriptSnapshotBasicCollection,
  layout: layoutCollection
};
