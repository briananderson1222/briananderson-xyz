import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import type { Resume } from '$lib/types';
import { error } from '@sveltejs/kit';
import { getResumeVariants } from '$lib/server/resumeUtils';

export const prerender = true;

export async function entries() {
  return getResumeVariants().map(variant => ({ variant }));
}

export const load = async ({ params }) => {
  const { variant } = params;
  
  if (!/^[a-z0-9-]+$/i.test(variant)) {
    throw error(400, 'Invalid resume variant');
  }

  const filename = `resume-${variant}.yaml`;
  const filePath = path.resolve('content', filename);

  if (!fs.existsSync(filePath)) {
    throw error(404, 'Resume version not found');
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const resume = yaml.load(fileContents) as Resume;
    const variants = ['default', ...getResumeVariants()];
    return { resume, variants };
  } catch (e) {
    console.error(`Error loading ${filename}:`, e);
    throw error(500, 'Error loading resume');
  }
};
