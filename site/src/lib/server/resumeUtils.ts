import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface ResumeMeta {
  meta?: {
    order?: number;
  };
}

export function getResumeVariants(): string[] {
  const contentDir = path.resolve('content');
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const files = fs.readdirSync(contentDir);

  // 1. Find all variant files (excluding main resume.yaml)
  const variantFiles = files.filter(f => f.startsWith('resume-') && f.endsWith('.yaml'));

  // 2. Read metadata for sorting
  const variantsWithMeta = variantFiles.map(filename => {
    const variantName = filename.replace('resume-', '').replace('.yaml', '');
    let order = 99; // Default low priority

    try {
      const content = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
      const data = yaml.load(content) as ResumeMeta;
      if (data?.meta?.order !== undefined) {
        order = data.meta.order;
      }
    } catch (e) {
      console.error(`Error reading meta for ${filename}:`, e);
    }

    return { name: variantName, order };
  });

  // 3. Sort: Order (asc), then Name (asc)
  variantsWithMeta.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.name.localeCompare(b.name);
  });

  return variantsWithMeta.map(v => v.name);
}
