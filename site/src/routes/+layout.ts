import posthog from 'posthog-js';
import { browser } from '$app/environment';

export const prerender = true;
export const trailingSlash = 'always';

export const load = async () => {
  if (browser && import.meta.env.PUBLIC_POSTHOG_KEY) {
    posthog.init(
      import.meta.env.PUBLIC_POSTHOG_KEY,
      {
        api_host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false,
        capture_pageleave: false,
        capture_exceptions: true
      }
    );
  }
  return;
};