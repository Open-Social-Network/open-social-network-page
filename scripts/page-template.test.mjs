import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('page template renders a user-facing following section', async () => {
  const html = await readFile('public/index.html', 'utf8');

  assert.match(html, /<h2>Following<\/h2>/);
  assert.match(html, /data-follows/);
  assert.match(html, /opensocial\/follows\/index\.json/);
});

test('page runtime loads the portable follow list', async () => {
  const pageScript = await readFile('public/page.js', 'utf8');

  assert.match(pageScript, /fetchOptionalJson\('\.\/opensocial\/follows\/index\.json'/);
  assert.match(pageScript, /renderProfileFollows\(followList, profile\.handle\)/);
});

test('page copy keeps protocol details behind user-facing labels', async () => {
  const config = await readFile('page.config.json', 'utf8');
  const pageScript = await readFile('public/page.js', 'utf8');

  assert.doesNotMatch(config, /static JSON files/i);
  assert.doesNotMatch(config, /signatures/i);
  assert.match(pageScript, /<summary>Verification<\/summary>/);
});
