#!/usr/bin/env node

/**
 * UI Validation Script
 * 
 * This script validates that dynamic content from resume.yaml
 * is properly rendering in the built static HTML files.
 * 
 * Usage: node scripts/validate-ui.js
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function warn(message) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

async function loadResumeData() {
  try {
    const filePath = path.resolve('content/resume.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(fileContents);
  } catch (e) {
    error(`Failed to load resume.yaml: ${e.message}`);
    process.exit(1);
  }
}

async function loadBuildOutput(page) {
  try {
    let filePath;
    if (page === 'index') {
      filePath = path.resolve('build/index.html');
    } else {
      filePath = path.resolve(`build/${page}/index.html`);
    }
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return fileContents;
  } catch (e) {
    error(`Failed to load build output for ${page}: ${e.message}`);
    return null;
  }
}

async function validatePrintStyles(html) {
  const checks = [];
  
  // Check for print-specific classes instead of @media print in HTML
  checks.push({
    name: 'Print-specific classes present',
    pass: html.includes('print:font-serif') || html.includes('print:hidden'),
    value: 'print: classes found'
  });
  
  // Check for print-specific CSS
  checks.push({
    name: 'Print-specific CSS present',
    pass: html.includes('print:') || html.includes('@media print'),
    value: 'Print CSS detected'
  });
  
  return checks;
}

function validateResumeData(html, resumeData) {
  const checks = [];
  
  // Validate basic resume data
  if (resumeData.name) {
    checks.push({
      name: 'Name in header',
      pass: html.includes(resumeData.name),
      value: resumeData.name
    });
  }
  
  if (resumeData.title) {
    checks.push({
      name: 'Title in header',
      pass: html.includes(resumeData.title),
      value: resumeData.title
    });
  }
  
  if (resumeData.email) {
    checks.push({
      name: 'Email in header',
      pass: html.includes(resumeData.email),
      value: resumeData.email
    });
  }
  
  if (resumeData.summary) {
    checks.push({
      name: 'Summary section',
      pass: html.includes(resumeData.summary),
      value: resumeData.summary.substring(0, 50) + '...'
    });
  }
  
  // Validate experience entries
  if (resumeData.experience && resumeData.experience.length > 0) {
    checks.push({
      name: 'Experience section exists',
      pass: html.includes('Experience') || html.includes('experience'),
      value: `${resumeData.experience.length} entries`
    });
    
    resumeData.experience.forEach((job, index) => {
      if (index < 3) { // Check first 3 jobs to keep output manageable
        checks.push({
          name: `Experience entry ${index + 1}: ${job.role}`,
          pass: html.includes(job.role) && html.includes(job.company),
          value: `${job.role} @ ${job.company}`
        });
        
        // Check for date fields (new structure)
        if (job.start_date) {
          checks.push({
            name: `Experience entry ${index + 1}: start_date`,
            pass: html.includes(job.start_date),
            value: job.start_date
          });
        }
      }
    });
  }
  
  // Validate skills
  if (resumeData.skills) {
    const skillCount = Object.keys(resumeData.skills).length;
    checks.push({
      name: 'Skills section exists',
      pass: html.includes('Skills') || html.includes('skills'),
      value: `${skillCount} categories`
    });
    
    // Check a few skills from each category
    Object.entries(resumeData.skills).forEach(([category, items]) => {
      if (items && items.length > 0) {
        const firstItem = items[0];
        const skillName = typeof firstItem === 'string' ? firstItem : firstItem.name;
        checks.push({
          name: `Skill category: ${category}`,
          pass: html.includes(skillName),
          value: `${items.length} skills (e.g., ${skillName})`
        });
      }
    });
  }
  
  // Validate education
  if (resumeData.education && resumeData.education.length > 0) {
    checks.push({
      name: 'Education section exists',
      pass: html.includes('Education') || html.includes('education'),
      value: `${resumeData.education.length} entries`
    });
    
    resumeData.education.forEach((edu, index) => {
      if (index === 0) {
        checks.push({
          name: 'Education entry 1',
          pass: html.includes(edu.school) && html.includes(edu.degree),
          value: `${edu.school} - ${edu.degree}`
        });
      }
    });
  }
  
  // Validate print styles
  const printChecks = validatePrintStyles(html);
  checks.push(...printChecks);
  
  return checks;
}

function validateHomePage(html, resumeData) {
  const checks = [];
  
  // Validate basic resume data on home page
  if (resumeData.name) {
    checks.push({
      name: 'Name on home page',
      pass: html.includes(resumeData.name),
      value: resumeData.name
    });
  }
  
  if (resumeData.title) {
    checks.push({
      name: 'Title on home page',
      pass: html.includes(resumeData.title),
      value: resumeData.title
    });
  }
  
  // Validate experience items
  if (resumeData.experience && resumeData.experience.length > 0) {
    const recentJobs = resumeData.experience.slice(-3);
    recentJobs.forEach((job, index) => {
      checks.push({
        name: `Experience item ${index + 1} on home page`,
        pass: html.includes(job.role) && html.includes(job.company),
        value: `${job.role} @ ${job.company}`
      });
    });
  }
  
  // Validate skills section
  if (resumeData.skills) {
    checks.push({
      name: 'Skills section on home page',
      pass: html.includes('Skills') || html.includes('skills'),
      value: `${Object.keys(resumeData.skills).length} categories`
    });
  }
  
  return checks;
}

function runChecks(checks, sectionName) {
  info(`\n${sectionName}:`);
  const passed = checks.filter(c => c.pass).length;
  const failed = checks.filter(c => !c.pass).length;
  
  checks.forEach(check => {
    if (check.pass) {
      success(`${check.name}: ${check.value || 'Found'}`);
    } else {
      error(`${check.name}: ${check.value || 'Not found'}`);
    }
  });
  
  info(`  Passed: ${passed}/${checks.length}`);
  if (failed > 0) {
    error(`  Failed: ${failed}/${checks.length}`);
  }
  
  return failed === 0;
}

async function main() {
  info('\n=== UI Validation Script ===\n');
  
  // Load resume data
  const resumeData = await loadResumeData();
  success('Loaded resume.yaml');
  
  // Validate resume page
  const resumeHtml = await loadBuildOutput('resume');
  if (!resumeHtml) {
    error('Resume page build output not found. Run `pnpm build` first.');
    process.exit(1);
  }
  success('Loaded resume.html build output');
  
  const resumeChecks = validateResumeData(resumeHtml, resumeData);
  const resumePassed = runChecks(resumeChecks, 'Resume Page Validation');
  
  // Validate home page
  const homeHtml = await loadBuildOutput('index');
  if (!homeHtml) {
    error('Home page build output not found. Run `pnpm build` first.');
    process.exit(1);
  }
  success('Loaded index.html build output');
  
  const homeChecks = validateHomePage(homeHtml, resumeData);
  const homePassed = runChecks(homeChecks, 'Home Page Validation');
  
  // Summary
  info('\n=== Summary ===');
  if (resumePassed && homePassed) {
    success('All validations passed!');
    info('\n✓ Dynamic content is rendering correctly');
    info('✓ Print styles are present');
    info('✓ Resume page structure is intact');
    process.exit(0);
  } else {
    error('Some validations failed!');
    info('\n✗ Review the failed checks above');
    process.exit(1);
  }
}

main().catch(e => {
  error(`Fatal error: ${e.message}`);
  console.error(e);
  process.exit(1);
});
