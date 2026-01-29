import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import type { Resume } from '$lib/types';
import { getResumeVariants } from '$lib/server/resumeUtils';

export const prerender = true;

export const load = async () => {
  try {
    const filePath = path.resolve('content/resume.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const resume = yaml.load(fileContents) as Resume;
    const variants = ['default', ...getResumeVariants()];
    return { resume, variants };
  } catch (e) {
    console.error('Error loading resume.yaml:', e);
    return { resume: {} as Resume, variants: ['default'] };
  }
};
