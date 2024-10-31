import rss, {pagesGlobToRssItems} from '@astrojs/rss';
export async function GET(context) {
  return rss({
    title: 'Debug The Mind',

    description: 'posts about web development, open-source, and devops.',

    site: 'https://debugthemind.art',
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await pagesGlobToRssItems(
      import.meta.glob('./posts/*.{md,mdx}'),
    ),

    customData: `<language>en-us</language>`,
  });
}