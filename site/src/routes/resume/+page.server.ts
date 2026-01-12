import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export const prerender = true;

export const load = async () => {
  try {
    const filePath = path.resolve('content/resume.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const resume = yaml.load(fileContents);
    return { resume };
  } catch (e) {
    console.error('Error loading resume.yaml:', e);
    return { resume: null };
  }
};
