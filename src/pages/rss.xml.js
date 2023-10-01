import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'codeandy | Blog',
    description: 'A website to debug the mind',
    site: 'http://localhost:4321',
    items: await pagesGlobToRssItems(import.meta.glob('./blog/*.md')),
    customData: `<language>en-us</language>`,

  })
}