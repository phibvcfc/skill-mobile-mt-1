#!/usr/bin/env node

/**
 * @buivietphi/skill-mobile installer
 *
 * Installs skill-mobile-mt/ folder with subfolders for each platform.
 *
 * Usage:
 *   npx @buivietphi/skill-mobile              # Interactive
 *   npx @buivietphi/skill-mobile --all        # All detected agents
 *   npx @buivietphi/skill-mobile --claude     # Claude Code only
 *   npx @buivietphi/skill-mobile --gemini     # Gemini CLI
 *   npx @buivietphi/skill-mobile --kimi       # Kimi
 *   npx @buivietphi/skill-mobile --antigravity # Antigravity
 *   npx @buivietphi/skill-mobile --auto       # Auto-detect (postinstall)
 *   npx @buivietphi/skill-mobile --path DIR   # Custom path
 */

import { existsSync, mkdirSync, cpSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, '..');
const SKILL_NAME = 'skill-mobile-mt';
const HOME = homedir();

// Structure: root files + subfolders
const ROOT_FILES = ['SKILL.md', 'AGENTS.md'];

const SUBFOLDERS = {
  'react-native': ['react-native.md'],
  'flutter':      ['flutter.md'],
  'ios':          ['ios-native.md'],
  'android':      ['android-native.md'],
  'shared':       ['code-review.md', 'bug-detection.md', 'prompt-engineering.md', 'release-checklist.md', 'common-pitfalls.md'],
};

const AGENTS = {
  claude:       { name: 'Claude Code',     dir: join(HOME, '.claude', 'skills'),   detect: () => existsSync(join(HOME, '.claude')) },
  gemini:       { name: 'Gemini CLI',      dir: join(HOME, '.gemini', 'skills'),   detect: () => existsSync(join(HOME, '.gemini')) },
  kimi:         { name: 'Kimi',            dir: join(HOME, '.kimi', 'skills'),     detect: () => existsSync(join(HOME, '.kimi')) },
  antigravity:  { name: 'Antigravity',     dir: join(HOME, '.agents', 'skills'),   detect: () => existsSync(join(HOME, '.agents')) },
  cursor:       { name: 'Cursor',          dir: join(HOME, '.cursor', 'skills'),   detect: () => existsSync(join(HOME, '.cursor')) },
  windsurf:     { name: 'Windsurf',        dir: join(HOME, '.windsurf', 'skills'), detect: () => existsSync(join(HOME, '.windsurf')) },
  copilot:      { name: 'Copilot',         dir: join(HOME, '.copilot', 'skills'),  detect: () => existsSync(join(HOME, '.copilot')) },
};

const c = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m', red: '\x1b[31m' };
const log = m => console.log(m);
const ok = m => log(`  ${c.green}✓${c.reset} ${m}`);
const info = m => log(`  ${c.blue}ℹ${c.reset} ${m}`);
const fail = m => log(`  ${c.red}✗${c.reset} ${m}`);

function banner() {
  log(`\n${c.bold}${c.cyan}  ┌──────────────────────────────────────────────┐`);
  log(`  │  📱 @buivietphi/skill-mobile v1.0.0          │`);
  log(`  │  Master Senior Mobile Engineer                │`);
  log(`  │                                              │`);
  log(`  │  Claude · Gemini · Kimi · Antigravity        │`);
  log(`  │  Cursor · Windsurf · Copilot                 │`);
  log(`  │  React Native · Flutter · iOS · Android      │`);
  log(`  └──────────────────────────────────────────────┘${c.reset}\n`);
}

function tokenCount(filePath) {
  if (!existsSync(filePath)) return 0;
  return Math.ceil(readFileSync(filePath, 'utf-8').length / 3.5);
}

function showContext() {
  log(`${c.bold}  📊 Context:${c.reset}`);
  let total = 0;

  // Root files
  for (const f of ROOT_FILES) {
    const t = tokenCount(join(PKG_ROOT, f));
    total += t;
    log(`  ${c.dim}  ${f.padEnd(30)} ~${t.toLocaleString()} tokens${c.reset}`);
  }

  // Subfolders
  for (const [folder, files] of Object.entries(SUBFOLDERS)) {
    let folderTotal = 0;
    for (const f of files) {
      folderTotal += tokenCount(join(PKG_ROOT, folder, f));
    }
    total += folderTotal;
    log(`  ${c.dim}  ${(folder + '/').padEnd(30)} ~${folderTotal.toLocaleString()} tokens${c.reset}`);
  }

  log(`${c.dim}  ─────────────────────────────────────────${c.reset}`);
  log(`  ${c.bold}  All loaded:${c.reset}                    ~${total.toLocaleString()} tokens`);
  log(`  ${c.green}  Smart load (1 platform):${c.reset}       ~${Math.ceil(total * 0.55).toLocaleString()} tokens\n`);
}

function install(baseDir, agentName) {
  const dst = join(baseDir, SKILL_NAME);
  mkdirSync(dst, { recursive: true });
  let n = 0;

  // Copy root files
  for (const f of ROOT_FILES) {
    const src = join(PKG_ROOT, f);
    if (!existsSync(src)) continue;
    cpSync(src, join(dst, f), { force: true });
    n++;
  }

  // Copy subfolders
  for (const [folder, files] of Object.entries(SUBFOLDERS)) {
    const dstFolder = join(dst, folder);
    mkdirSync(dstFolder, { recursive: true });
    for (const f of files) {
      const src = join(PKG_ROOT, folder, f);
      if (!existsSync(src)) continue;
      cpSync(src, join(dstFolder, f), { force: true });
      n++;
    }
  }

  ok(`${c.bold}${SKILL_NAME}/${c.reset} → ${agentName} ${c.dim}(${dst})${c.reset}`);
  return n;
}

async function ask(q) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => { rl.question(q, a => { rl.close(); r(a.trim()); }); });
}

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.map(a => a.replace(/^--?/, '')));

  banner();
  showContext();

  let targets = [];

  if (flags.has('all')) targets = Object.keys(AGENTS);
  else if (flags.has('auto')) {
    targets = Object.keys(AGENTS).filter(k => AGENTS[k].detect());
    if (!targets.length) { info('No agents found. Using Claude.'); targets = ['claude']; }
  } else if (flags.has('path')) {
    const p = args[args.indexOf('--path') + 1];
    if (!p) { fail('--path needs dir'); process.exit(1); }
    install(resolve(p), 'Custom');
    log(`\n${c.green}${c.bold}  ✅ Done!${c.reset}\n`); return;
  } else {
    for (const k of Object.keys(AGENTS)) if (flags.has(k)) targets.push(k);
  }

  if (!targets.length) {
    const det = Object.keys(AGENTS).filter(k => AGENTS[k].detect());
    log(`${c.bold}  Detected agents:${c.reset}`);
    det.forEach(k => log(`    ${c.green}●${c.reset} ${AGENTS[k].name}`));
    Object.keys(AGENTS).filter(k => !det.includes(k)).forEach(k => log(`    ${c.dim}○ ${AGENTS[k].name}${c.reset}`));
    log('');
    const a = await ask('  Install to detected agents? [Y/n] ');
    if (a.toLowerCase() === 'n') { info('Cancelled.'); return; }
    targets = det.length ? det : ['claude'];
  }

  log(`\n${c.bold}  Installing...${c.reset}\n`);
  for (const k of targets) install(AGENTS[k].dir, AGENTS[k].name);

  log(`\n${c.green}${c.bold}  ✅ Done!${c.reset} → ${targets.length} agent(s)\n`);
  log(`  ${c.bold}Usage:${c.reset}`);
  log(`    ${c.cyan}@skill-mobile-mt${c.reset}         Pre-built patterns (18 production apps)`);
  log(`    ${c.cyan}@skill-mobile-mt local${c.reset}   Read current project, adapt to it\n`);
  log(`  ${c.bold}Installed structure:${c.reset}`);
  log(`    ${SKILL_NAME}/`);
  log(`    ├── SKILL.md                    Entry point + auto-detect`);
  log(`    ├── AGENTS.md                   Multi-agent config`);
  log(`    ├── react-native/`);
  log(`    │   └── react-native.md         React Native patterns`);
  log(`    ├── flutter/`);
  log(`    │   └── flutter.md              Flutter patterns`);
  log(`    ├── ios/`);
  log(`    │   └── ios-native.md           iOS Swift patterns`);
  log(`    ├── android/`);
  log(`    │   └── android-native.md       Android Kotlin patterns`);
  log(`    └── shared/`);
  log(`        ├── code-review.md          Review checklist`);
  log(`        ├── bug-detection.md        Bug scanner`);
  log(`        └── prompt-engineering.md   Auto-think\n`);
}

main().catch(e => { fail(e.message); process.exit(1); });
