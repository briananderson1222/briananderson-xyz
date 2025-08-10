import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const mdsvexConfig = {
  extensions: ['.md', '.svx'],
  layout: { _: './src/lib/layouts/PostLayout.svelte' }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
    prerender: { entries: ['*'] },
    alias: {
      $lib: 'src/lib'
    }
  }
};
export default config;
