// Combined build: builds the hub + every module and assembles a single
// static output in ./dist, each module under its own sub-path. Vercel runs
// this as the project build command and serves ./dist.
import { execSync } from 'node:child_process';
import { cpSync, rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const run = (cmd, cwd, env) =>
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });

// [directory, sub-path slug]  — hub ('' slug) lands at the site root.
const viteModules = [
  ['saarthi-empower-hub-revamp-main', ''],
  ['SheCare', 'shecare'],
  ['VaxAlert', 'vaxalert'],
  ['NGO-HEAL', 'ngoheal'],
  ['carecircle-women-unite-main', 'carecircle'],
  ['gyno3-main', 'gynoconnect'],
  ['health-yojana', 'healthyojana'],
  ['medi-safe-journal-vault-main', 'medivault'],
];

for (const [dir, slug] of viteModules) {
  const cwd = path.join(ROOT, dir);
  console.log(`\n=== Building ${dir || 'hub'}${slug ? ` -> /${slug}` : ' -> /'} ===`);
  run('npm install --no-audit --no-fund', cwd);
  run('npm run build', cwd);
  const dest = slug ? path.join(OUT, slug) : OUT;
  cpSync(path.join(cwd, 'dist'), dest, { recursive: true });
}

// SymptoScan (Create React App). CI=false so lint warnings don't fail the build.
const sy = path.join(ROOT, 'SymptoScan', 'frontend');
console.log('\n=== Building SymptoScan -> /symptoscan ===');
run('npm install --no-audit --no-fund', sy);
run('npm run build', sy, { CI: 'false' });
cpSync(path.join(sy, 'build'), path.join(OUT, 'symptoscan'), { recursive: true });

console.log('\nCombined build complete -> ./dist');
