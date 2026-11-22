import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
writeFileSync('out/build-info.json', JSON.stringify({ commit, builtAt: new Date().toISOString() }, null, 2) + '\n');
console.log(`Cloudflare static export prepared from ${commit}`);
