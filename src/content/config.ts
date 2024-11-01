import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection ({ 
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

})

export const collections = {
  'posts': postsCollection,
};

export interface Post {
  data: {
    isDraft: boolean;
    title: string;
    excerpt: string;
    image?: { src: string; alt: string };
    sortOrder: number;
    publishDate: Date;
    author: string;
    tags: string[];
  };
}

export interface Entry {
  slug: string;
  render: () => Promise<{ Content: any }>;
}