import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const runFile = promisify(execFile);
const generatorPath = resolve('scripts/generate-page.mjs');

test('generator preserves existing encrypted message inbox envelopes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'open-social-network-page-generate-'));
  const inboxPath = join(root, 'public/opensocial/messages/inbox/index.json');
  const existingMessage = {
    protocol: 'open-social-network',
    version: '0.1',
    kind: 'direct-message',
    id: 'message_001',
    sender: 'ada@example.test',
    recipient: 'owner@example.test',
    createdAt: '2026-06-04T12:00:00.000Z',
    encryption: {
      alg: 'ECDH-P256-A256GCM',
      epk: { kty: 'EC', crv: 'P-256', x: 'x', y: 'y' },
      iv: 'iv',
      ciphertext: 'ciphertext',
    },
    signature: {
      alg: 'ES256',
      value: 'signature',
    },
  };

  try {
    await writeFile(
      join(root, 'page.config.json'),
      `${JSON.stringify(
        {
          handle: 'owner@example.test',
          name: 'Owner',
          bio: 'Owns a page.',
          website: 'https://owner.example.test',
          baseUrl: '',
          posts: [
            {
              id: 'post_001',
              createdAt: '2026-06-04T12:00:00.000Z',
              content: 'Hello from my page.',
            },
          ],
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
    await mkdir(join(root, 'public/opensocial/messages/inbox'), { recursive: true });
    await writeFile(
      inboxPath,
      `${JSON.stringify(
        {
          protocol: 'open-social-network',
          version: '0.1',
          owner: 'owner@example.test',
          messages: [existingMessage],
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await runFile('node', [generatorPath], { cwd: root });

    assert.deepEqual(JSON.parse(await readFile(inboxPath, 'utf8')).messages, [
      existingMessage,
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
