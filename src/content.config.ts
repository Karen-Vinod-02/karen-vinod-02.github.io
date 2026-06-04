import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    ogImage: z.string().optional(),
    draft: z.boolean().optional(),
    bibliography: z.array(z.string()).optional(),
    mermaid: z.object({
      enabled: z.boolean().optional(),
      zoomable: z.boolean().optional(),
    }).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    date: z.date(),
    metrics: z.object({
      primary: z.string(),
      performance: z.string(),
    }).optional(),
    github: z.string(),
    demo: z.string().url().nullable().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };