import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [sveltekit()],
  preview: {
    allowedHosts: ["brian-media.python-smelt.ts.net"],
    host: true,
    port: 4137,
  },
};
export default config;
