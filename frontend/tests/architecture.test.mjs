// Run: node --test tests/architecture.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
test('five distinct routed finance pages exist', () => {
  const app = read('../src/App.jsx');
  for (const page of ['Dashboard','Transactions','Forecast','Assistant','Bills']) {
    assert.match(app, new RegExp(`import ${page} from`));
    assert.match(app, new RegExp(`<${page} vm=`));
    assert.match(read(`../src/pages/${page}.jsx`), new RegExp(`function ${page}\\(`));
  }
});
test('all network requests use the centralized API service', () => {
  const app = read('../src/App.jsx');
  assert.match(app, /from "\.\/services\/api"/);
  for (const page of ['Dashboard','Transactions','Forecast','Assistant','Bills']) {
    const contents = read(`../src/pages/${page}.jsx`);
    assert.doesNotMatch(contents, /\b(fetch|axios)\s*\(/);
  }
});
test('mobile menu and loading and error states exist', () => {
  const app = read('../src/App.jsx');
  for (const expected of ['aria-expanded={menuOpen}', 'aria-busy={loading}', 'role="alert"', 'role="status"', 'Filter month']) assert.ok(app.includes(expected));
});
test('secret never enters client application', () => {
  const app = read('../src/App.jsx');
  const api = read('../src/services/api.js');
  assert.doesNotMatch(app+api, /GEMINI_API_KEY|AIza[0-9A-Za-z_-]{25,}/);
});
