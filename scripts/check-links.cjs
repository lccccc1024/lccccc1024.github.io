#!/usr/bin/env node
/**
 * 检查 dist 里所有内部链接是否有对应产物。
 *
 * 为什么需要：Playwright 只测交互，没有任何环节验证"文章里的链接真的指向存在的页面"。
 * 改 slug、删文章、调整目录后产生的断链，现在只能靠人点出来。
 *
 * 只检查内部链接（站内绝对路径与相对路径）。外部 URL、mailto、锚点、data: 一律跳过。
 *
 * 用法：node scripts/check-links.cjs [distDir]
 */

const fs = require("node:fs");
const path = require("node:path");

const DIST = path.resolve(process.argv[2] || "dist");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isSkippable(target) {
  if (!target) return true;
  if (target.startsWith("#")) return true;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) return true; // https: mailto: data: //cdn
  return false;
}

/** 把链接解析成 dist 内的相对路径（已去掉 query 与 hash）。 */
function toRelative(target, fromFile) {
  const clean = decode(target.split("#")[0].split("?")[0]);
  if (!clean) return null;
  const rel = clean.startsWith("/")
    ? clean.slice(1)
    : path.relative(DIST, path.resolve(path.dirname(fromFile), clean)).split(path.sep).join("/");
  return rel === "" ? "" : rel;
}

function exists(rel) {
  const asFile = path.join(DIST, rel);
  if (rel === "") return fs.existsSync(path.join(DIST, "index.html"));
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return true;
  if (fs.existsSync(path.join(asFile, "index.html"))) return true;
  return false;
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error(`[check-links] 找不到构建产物目录：${DIST}`);
    console.error("[check-links] 请先执行 npm run build:all");
    return 1;
  }

  const htmlFiles = walk(DIST).filter((f) => f.endsWith(".html"));
  const attr = /(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  const broken = [];
  let checked = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    let match;
    while ((match = attr.exec(html)) !== null) {
      const target = (match[1] ?? match[2] ?? "").trim();
      if (isSkippable(target)) continue;
      const rel = toRelative(target, file);
      if (rel === null) continue;
      checked++;
      if (!exists(rel)) {
        broken.push({
          from: path.relative(DIST, file).split(path.sep).join("/"),
          target,
        });
      }
    }
  }

  console.log(`[check-links] 扫描 ${htmlFiles.length} 个页面，检查 ${checked} 条内部链接`);

  if (broken.length === 0) {
    console.log("[check-links] 全部可解析");
    return 0;
  }

  const unique = new Map();
  for (const item of broken) {
    const key = item.from + " -> " + item.target;
    if (!unique.has(key)) unique.set(key, item);
  }

  console.error(`[check-links] 发现 ${unique.size} 条断链：`);
  let shown = 0;
  for (const item of unique.values()) {
    console.error(`  ${item.from}  ->  ${item.target}`);
    if (++shown >= 40) {
      console.error(`  ...（共 ${unique.size} 条，仅显示前 40 条）`);
      break;
    }
  }
  return 1;
}

process.exit(main());
