import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';

const encoder = new TextEncoder();
const config = JSON.parse(await readFile('page.config.json', 'utf8'));

await mkdir('public/.well-known', { recursive: true });
await mkdir('public/opensocial/actions', { recursive: true });
await mkdir('private', { recursive: true });

const keyPair = await webcrypto.subtle.generateKey(
  {
    name: 'ECDSA',
    namedCurve: 'P-256',
  },
  true,
  ['sign', 'verify'],
);
const publicJwk = await webcrypto.subtle.exportKey('jwk', keyPair.publicKey);
const privateJwk = await webcrypto.subtle.exportKey('jwk', keyPair.privateKey);
const baseUrl = String(config.baseUrl || '').replace(/\/$/u, '');
const profileUrl = baseUrl ? `${baseUrl}/profile.json` : '/profile.json';
const feedUrl = baseUrl ? `${baseUrl}/feed.json` : '/feed.json';

const profile = {
  protocol: 'open-social-network',
  version: '0.1',
  handle: config.handle,
  name: config.name,
  bio: config.bio,
  website: config.website,
  publicKey: {
    alg: 'ES256',
    jwk: publicJwk,
  },
  endpoints: {
    profile: profileUrl,
    feed: feedUrl,
  },
};
const posts = [];

for (const post of config.posts) {
  posts.push(
    await signPost(
      {
        id: post.id,
        author: config.handle,
        createdAt: post.createdAt,
        content: post.content,
      },
      keyPair.privateKey,
    ),
  );
}

const feed = {
  protocol: 'open-social-network',
  version: '0.1',
  author: config.handle,
  posts,
};
const actionLog = {
  protocol: 'open-social-network',
  version: '0.1',
  actor: config.handle,
  actions: [],
};

await writeJson('public/profile.json', profile);
await writeJson('public/.well-known/open-social-network.json', profile);
await writeJson('public/feed.json', feed);
await writeJson('public/opensocial/actions/index.json', actionLog);
await writeJson('private/identity.private.jwk.json', privateJwk);

async function signPost(post, privateKey) {
  const signature = await webcrypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    privateKey,
    encoder.encode(canonicalStringify(post)),
  );

  return {
    ...post,
    signature: {
      alg: 'ES256',
      value: bytesToBase64Url(signature),
    },
  };
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function canonicalStringify(value) {
  return JSON.stringify(toCanonicalValue(value));
}

function toCanonicalValue(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError('Canonical JSON does not support non-finite numbers.');
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => (item === undefined ? null : toCanonicalValue(item)));
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .filter((key) => value[key] !== undefined)
        .map((key) => [key, toCanonicalValue(value[key])]),
    );
  }

  throw new TypeError(`Canonical JSON does not support ${typeof value} values.`);
}

function bytesToBase64Url(bytes) {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}
