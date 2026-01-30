import fs from 'fs';
import path from 'path';

const VARIANT_ORDER = ['platform', 'builder'];

export function getResumeVariants(): string[] {
  const contentDir = path.resolve('content');
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const files = fs.readdirSync(contentDir);
  const variants = files
    .filter(f => f.startsWith('resume-') && f.endsWith('.yaml'))
    .map(f => f.replace('resume-', '').replace('.yaml', ''));
  return VARIANT_ORDER.filter(v => variants.includes(v));
}
