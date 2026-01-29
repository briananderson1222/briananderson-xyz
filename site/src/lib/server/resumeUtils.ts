import fs from 'fs';
import path from 'path';

export function getResumeVariants(): string[] {
  const contentDir = path.resolve('content');
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const files = fs.readdirSync(contentDir);
  return files
    .filter(f => f.startsWith('resume-') && f.endsWith('.yaml'))
    .map(f => f.replace('resume-', '').replace('.yaml', ''));
}
