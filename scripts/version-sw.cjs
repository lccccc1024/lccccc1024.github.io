const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = crypto.createHash('sha256');
function walk(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (file !== path.join('dist', 'sw.js')) { hash.update(file); hash.update(fs.readFileSync(file)); }
  }
}
walk('dist');
const sw = fs.readFileSync('public/sw.js', 'utf8').replace('__BUILD_VERSION__', hash.digest('hex').slice(0, 16));
fs.writeFileSync('dist/sw.js', sw);
