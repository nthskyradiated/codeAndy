import { pagesGlobToRssItems, rss } from '@astrojs/rss';


export async function GET(context) {
  return rss({

    title: 'Debug The Mind',

    description: 'Debug the Mind',

    site: 'https://debugthemind.art',
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),

    customData: `<language>en-us</language>`,
  });
}