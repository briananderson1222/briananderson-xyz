import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
const config: UserConfig = {
  plugins: [sveltekit()],
  preview: {
    allowedHosts: ['brian-media.tailcfcb40.ts.net']
  }
};
export default config;
