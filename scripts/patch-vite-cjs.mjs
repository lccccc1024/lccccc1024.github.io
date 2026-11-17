#!/usr/bin/env node
/**
 * Vite 8 · Windows CJS 互操作补丁
 *
 * 问题：Vite 8 的 SSR module runner 在 Windows 上会把 node_modules 里的 CJS
 * 依赖（yaml、picomatch …）当 ESM 内联执行，于是 `require` / `exports` / `module`
 * 全是 undefined，构建直接报：
 *     require is not defined  (node_modules/yaml/dist/index.js)
 * 同一份代码在 Linux CI（ubuntu）上不触发，所以只能本地想办法。
 *
 * 做法：给 module-runner.js 的内联执行补上 CJS 上下文：
 *   1) 预置 require / exports / module / __filename / __dirname 五个参数；
 *   2) require 以「当前模块的真实文件路径」为基准解析（含相对路径）；
 *   3) 执行后把 `module.exports` 回填到 ESM 的 exports 上（含 default），
 *      这样 `import picomatch from 'picomatch'` 才拿得到函数本体。
 *
 * 说明：
 *   · 只在 Windows 生效（CI 是 Linux，不受影响），可用 --force 强制。
 *   · 幂等：原文件备份为 module-runner.js.orig，每次都用备份重建补丁。
 *   · 失败绝不阻断安装（npm install 里跑，出错只告警并退出 0）。
 *   · `node scripts/patch-vite-cjs.mjs --revert` 还原。
 */

import fs from 'node:fs';
import path from 'node:path';

const MARKER = '__viteCjsInteropPatch';
const ROOT = process.cwd();
const TARGET = path.join(ROOT, 'node_modules', 'vite', 'dist', 'node', 'module-runner.js');
const BACKUP = `${TARGET}.orig`;

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const revert = argv.includes('--revert');

function log(msg) {
  console.log(`[patch-vite-cjs] ${msg}`);
}

function run() {
  if (!fs.existsSync(TARGET)) {
    log('未找到 vite/dist/node/module-runner.js，跳过（未安装依赖？）');
    return;
  }

  if (revert) {
    if (!fs.existsSync(BACKUP)) {
      log('没有 .orig 备份，无法还原');
      return;
    }
    fs.copyFileSync(BACKUP, TARGET);
    log('已还原原始 module-runner.js');
    return;
  }

  if (process.platform !== 'win32' && !force) {
    log('非 Windows 平台，跳过（CI 不需要此补丁）');
    return;
  }

  // 首次运行时留一份原始文件
  if (!fs.existsSync(BACKUP)) {
    const current = fs.readFileSync(TARGET, 'utf8');
    if (current.includes(MARKER)) {
      log('文件已被其它方式改过且无备份，跳过（如需重建请先 git checkout）');
      return;
    }
    fs.copyFileSync(TARGET, BACKUP);
    log('已备份原始文件 -> module-runner.js.orig');
  }

  const pristine = fs.readFileSync(BACKUP, 'utf8');
  if (pristine.includes(MARKER)) {
    log('备份本身已含补丁，跳过');
    return;
  }
  if (fs.readFileSync(TARGET, 'utf8').includes(MARKER)) {
    log('已打过补丁，跳过');
    return;
  }

  const patched = applyPatch(pristine);
  if (!patched) {
    log('当前 vite 版本的内联执行代码与预期不一致，跳过（升级 vite 后需重新适配）');
    return;
  }

  fs.writeFileSync(TARGET, patched);
  log('补丁已应用：Windows 下可正常执行 CJS 依赖');
}

function applyPatch(src) {
  const START = 'async runInlinedModule(context, code) {';
  const startAt = src.indexOf(START);
  if (startAt < 0) return null;

  const endAt = src.indexOf('\n\t}\n', startAt);
  if (endAt < 0) return null;

  const body = [
    `async runInlinedModule(context, code, mod) {`,
    `\t\tconst req = __viteCjsMakeRequire(mod);`,
    `\t\tconst file = req.__file;`,
    `\t\tconst dir = file ? __viteCjsDirname(file) : void 0;`,
    `\t\tconst requireShim = (spec) =>`,
    `\t\t\ttypeof spec === "string" && spec.startsWith(".") && dir ? req(__viteCjsResolve(dir, spec)) : req(spec);`,
    `\t\trequireShim.resolve = req.resolve;`,
    `\t\trequireShim.cache = req.cache;`,
    `\t\tconst exportsObj = context[ssrModuleExportsKey];`,
    `\t\tconst cjsModule = { exports: exportsObj };`,
    `\t\tawait new AsyncFunction("require", "exports", "module", "__filename", "__dirname", ssrModuleExportsKey, ssrImportMetaKey, ssrImportKey, ssrDynamicImportKey, ssrExportAllKey, ssrExportNameKey, "\\"use strict\\";\\n" + code)(requireShim, exportsObj, cjsModule, file, dir, exportsObj, context[ssrImportMetaKey], context[ssrImportKey], context[ssrDynamicImportKey], context[ssrExportAllKey], context[ssrExportNameKey]);`,
    `\t\tif (cjsModule.exports !== exportsObj && cjsModule.exports && (typeof cjsModule.exports === "object" || typeof cjsModule.exports === "function")) {`,
    `\t\t\ttry { for (const key of Object.keys(cjsModule.exports)) if (!(key in exportsObj)) exportsObj[key] = cjsModule.exports[key]; } catch {}`,
    `\t\t\ttry { Object.defineProperty(exportsObj, "default", { enumerable: true, configurable: true, get: () => cjsModule.exports }); } catch {}`,
    `\t\t}`,
    `\t\tObject.seal(exportsObj);`,
    `\t}`,
  ].join('\n');

  let out = src.slice(0, startAt) + body + src.slice(endAt + 4);

  const header = [
    `/* ${MARKER} · 见 scripts/patch-vite-cjs.mjs */`,
    `import { createRequire as __viteCjsCreateRequire } from "node:module";`,
    `import { fileURLToPath as __viteCjsFileURLToPath } from "node:url";`,
    `import { dirname as __viteCjsDirname, resolve as __viteCjsResolve } from "node:path";`,
    `const __viteCjsFallbackRequire = __viteCjsCreateRequire(import.meta.url);`,
    `function __viteCjsMakeRequire(mod) {`,
    `\tlet raw = mod ? String(mod.file || mod.id || mod.url || "") : "";`,
    `\tif (raw.startsWith("file:")) {`,
    `\t\ttry { raw = __viteCjsFileURLToPath(raw); } catch { raw = ""; }`,
    `\t}`,
    `\tif (/^\\/[A-Za-z]:/.test(raw)) raw = raw.slice(1);`,
    `\tif (!/^[A-Za-z]:[\\\\/]/.test(raw) && !raw.startsWith("/")) return __viteCjsFallbackRequire;`,
    `\ttry {`,
    `\t\tconst req = __viteCjsCreateRequire(raw);`,
    `\t\treq.__file = raw;`,
    `\t\treturn req;`,
    `\t} catch {`,
    `\t\treturn __viteCjsFallbackRequire;`,
    `\t}`,
    `}`,
    ``,
  ].join('\n');

  out = header + out;
  return out;
}

try {
  run();
} catch (err) {
  log(`补丁失败（不影响安装继续）：${err && err.message}`);
}
