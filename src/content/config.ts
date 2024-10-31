import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection ({ 
  type: 'content',
  schema: z.object({
      isDraft: z.boolean(),
      title: z.string(),
      excerpt: z.string().max(150),
      sortOrder: z.number(),
      image: z.object({
        src: z.string(),
        alt: z.string(),
      }).optional(),
      author: z.string().default('Anonymous'),
      tags: z.array(z.string()),
      publishDate: z.date(),
    }),
    // You can also transform a date string (e.g. "2022-07-08") to a Date object
    // publishDate: z.string().transform((str) => new Date(str)),
})
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'posts': postCollection,
};
