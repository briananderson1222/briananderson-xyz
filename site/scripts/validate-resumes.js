#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { z } from 'zod';

// Schema is inlined below to avoid TS build complexity in this script

// Since this is a standalone script run by node, we need to handle imports carefully.
// However, the project is "type": "module", so we can use imports.
// But we can't import the .ts file directly without a loader (like ts-node or svelte-kit sync).
//
// A simpler approach for the script without complex build requirements:
// Inline the schema or use JSDoc + standard validation.
// OR rely on 'tsx' or 'ts-node' to run it. 
// Given the user runs `node scripts/validate-ui.js`, they are running raw JS. 
//
// STRATEGY ADJUSTMENT:
// I will create a plain JS version of the schema validation script to avoid TS compilation issues during the `validate` step.
// I'll replicate the Zod schema logic here.

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

function info(message) {
    log(`ℹ ${message}`, 'blue');
}

// Re-define schema in JS to avoid import issues from TS source
const schema = z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string().optional(),
    mission: z.string().optional(),
    email: z.string().email().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),

    meta: z.object({
        order: z.number().int().optional(),
        schema_version: z.string().optional(),
    }).optional(),

    skills: z.record(
        z.string(),
        z.array(
            z.union([
                z.string(),
                z.object({
                    name: z.string(),
                    url: z.string().url().optional(),
                })
            ])
        ).optional()
    ).optional(),

    experience: z.array(
        z.object({
            role: z.string(),
            company: z.string(),
            location: z.string().optional(),
            description: z.string().optional(),
            highlights: z.array(z.string()).optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
        })
    ).optional(),

    'early-career': z.array(
        z.object({
            role: z.string(),
            company: z.string(),
            location: z.string().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
        })
    ).optional(),

    education: z.array(
        z.object({
            school: z.string(),
            degree: z.string(),
            location: z.string().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
        })
    ).optional(),

    certificates: z.array(
        z.object({
            name: z.string(),
            url: z.string().url().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
        })
    ).optional(),
});

function validateFile(filename) {
    try {
        const filePath = path.resolve('content', filename);
        if (!fs.existsSync(filePath)) {
            error(`File not found: ${filename}`);
            return false;
        }

        info(`Validating ${filename}...`);
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.load(fileContents);

        schema.parse(data);
        success(`${filename} is valid.`);
        return true;
    } catch (e) {
        if (e instanceof z.ZodError) {
            error(`${filename} validation failed:`);
            e.errors.forEach(err => {
                log(`  - Path: ${err.path.join('.')} : ${err.message}`, 'red');
            });
        } else {
            error(`${filename} error: ${e.message}`);
        }
        return false;
    }
}

function main() {
    info('\n=== Resume Schema Validation ===\n');

    const contentDir = path.resolve('content');
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

    let allValid = true;

    // Explicitly check known files ensuring they exist
    const requiredFiles = ['resume.yaml'];

    requiredFiles.forEach(f => {
        if (!validateFile(f)) allValid = false;
    });

    // Check all other resume-* files
    files.forEach(f => {
        if (requiredFiles.includes(f)) return; // already checked
        if (f.startsWith('resume-')) {
            if (!validateFile(f)) allValid = false;
        }
    });

    if (allValid) {
        success('\nAll resume YAML files passed validation.');
        process.exit(0);
    } else {
        error('\nValidation failed.');
        process.exit(1);
    }
}

main();
