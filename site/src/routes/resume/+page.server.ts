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
    const allResumeVariants = ['default', ...getResumeVariants()];

    // Load all resumes for swiper
    const allResumes: { variant: string; resume: Resume }[] = [];
    
    for (const v of allResumeVariants) {
      const resumeFileName = v === 'default' ? 'resume.yaml' : `resume-${v}.yaml`;
      const resumeFilePath = path.resolve('content', resumeFileName);
      
      try {
        const contents = fs.readFileSync(resumeFilePath, 'utf-8');
        allResumes.push({ variant: v, resume: yaml.load(contents) as Resume });
      } catch (e) {
        console.error(`Error loading ${resumeFileName}:`, e);
      }
    }

    return { resume, variants: allResumeVariants, allResumes, currentVariant: 'default' };
  } catch (e) {
    console.error('Error loading resume.yaml:', e);
    return { resume: {} as Resume, variants: ['default'], allResumes: [], currentVariant: 'default' };
  }
};
