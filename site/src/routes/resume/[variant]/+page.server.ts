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

  // Load all resumes to show all slides
  const allResumeVariants = ['default', ...getResumeVariants()];
  const allResumes: { variant: string; resume: Resume }[] = [];

  // Load current resume
  const currentFileContents = fs.readFileSync(filePath, 'utf-8');
  const currentResume = yaml.load(currentFileContents) as Resume;

  // Load all other resumes
  for (const v of allResumeVariants) {
    if (v === variant) continue;
    
    const resumeFileName = v === 'default' ? 'resume.yaml' : `resume-${v}.yaml`;
    const resumeFilePath = path.resolve('content', resumeFileName);
    
    try {
      const contents = fs.readFileSync(resumeFilePath, 'utf-8');
      allResumes.push({ variant: v, resume: yaml.load(contents) as Resume });
    } catch (e) {
      console.error(`Error loading ${resumeFileName}:`, e);
    }
  }

  return { 
    resume: currentResume, 
    variants: allResumeVariants,
    allResumes,
    currentVariant: variant 
  };
};

