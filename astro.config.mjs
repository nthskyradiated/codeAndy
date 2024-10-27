import { defineConfig } from 'astro/config';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://debugthemind.art',
  output: "hybrid",
  adapter: vercel()
});