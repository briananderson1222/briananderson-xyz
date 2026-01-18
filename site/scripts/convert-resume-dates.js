#!/usr/bin/env node

/**
 * Convert old resume.yaml with `period` format to new `start_date`/`end_date` format
 */

import fs from 'fs';
import yaml from 'js-yaml';

const oldResume = yaml.load(fs.readFileSync('/tmp/restore_resume.yaml', 'utf-8'));
const newResume = yaml.load(fs.readFileSync('site/content/resume.yaml', 'utf-8'));

function convertPeriodToDates(period) {
  if (!period) return {};
  
  const parts = period.split(' - ');
  if (parts.length === 2) {
    return {
      start_date: parts[0].trim(),
      end_date: parts[1].trim() === 'PRESENT' ? undefined : parts[1].trim()
    };
  }
  return {};
}

// Convert old experience entries to new format
if (oldResume.experience) {
  newResume.experience = oldResume.experience.map(job => ({
    role: job.role,
    company: job.company,
    location: job.location,
    description: job.description,
    highlights: job.highlights,
    ...convertPeriodToDates(job.period)
  }));
}

// Convert old early-career entries
if (oldResume['early-career']) {
  newResume['early-career'] = oldResume['early-career'].map(job => ({
    role: job.role,
    company: job.company,
    location: job.location,
    ...convertPeriodToDates(job.period)
  }));
}

// Convert education entries
if (oldResume.education) {
  newResume.education = oldResume.education.map(edu => ({
    school: edu.school,
    degree: edu.degree,
    location: edu.location,
    ...convertPeriodToDates(edu.period)
  }));
}

// Convert certificate entries
if (oldResume.certificates) {
  newResume.certificates = oldResume.certificates.map(cert => ({
    name: cert.name,
    url: cert.url,
    ...convertPeriodToDates(cert.period)
  }));
}

const newYaml = yaml.dump(newResume, { lineWidth: -1, sortKeys: false });
fs.writeFileSync('site/content/resume.yaml', newYaml);
console.log('✓ Converted resume.yaml to new date format');
