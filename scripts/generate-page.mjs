import { access, chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';

const encoder = new TextEncoder();
const config = JSON.parse(await readFile('page.config.json', 'utf8'));
const signingAlgorithm = {
  name: 'ECDSA',
  namedCurve: 'P-256',
};
const messageAlgorithm = {
  name: 'ECDH',
  namedCurve: 'P-256',
};

await mkdir('public/.well-known', { recursive: true });
await mkdir('public/opensocial/actions', { recursive: true });
await mkdir('public/opensocial/actions/inbox', { recursive: true });
await mkdir('public/opensocial/messages/inbox', { recursive: true });
await mkdir('private', { recursive: true });

const { privateJwk, privateKey } = await loadOrCreatePrivateKey(
  'private/identity.private.jwk.json',
  signingAlgorithm,
  ['sign', 'verify'],
  ['sign'],
);
const { privateJwk: messagePrivateJwk } = await loadOrCreatePrivateKey(
  'private/messages.private.jwk.json',
  messageAlgorithm,
  ['deriveKey'],
  ['deriveKey'],
);
const publicJwk = publicSigningJwkFromPrivate(privateJwk);
const messagePublicJwk = publicMessageJwkFromPrivate(messagePrivateJwk);
const baseUrl = String(config.baseUrl || '').replace(/\/$/u, '');
const profileUrl = baseUrl ? `${baseUrl}/profile.json` : '/profile.json';
const feedUrl = baseUrl ? `${baseUrl}/feed.json` : '/feed.json';
const actionsUrl = baseUrl
  ? `${baseUrl}/opensocial/actions/inbox/index.json`
  : '/opensocial/actions/inbox/index.json';
const messagesUrl = baseUrl
  ? `${baseUrl}/opensocial/messages/inbox/index.json`
  : '/opensocial/messages/inbox/index.json';

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
  messagePublicKey: {
    alg: 'ECDH-P256',
    jwk: messagePublicJwk,
  },
  endpoints: {
    profile: profileUrl,
    feed: feedUrl,
    actions: actionsUrl,
    messages: messagesUrl,
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
      privateKey,
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
const actionInbox = {
  protocol: 'open-social-network',
  version: '0.1',
  owner: config.handle,
  actions: [],
};
const messageLog = {
  protocol: 'open-social-network',
  version: '0.1',
  owner: config.handle,
  messages: [],
};

await writeJson('public/profile.json', profile);
await writeJson('public/.well-known/open-social-network.json', profile);
await writeJson('public/feed.json', feed);
await writeJson('public/opensocial/actions/index.json', actionLog);
await writeJson('public/opensocial/actions/inbox/index.json', actionInbox);
await writeJson('public/opensocial/messages/inbox/index.json', messageLog);

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

async function loadOrCreatePrivateKey(path, algorithm, generatedUsages, importedUsages) {
  if (await fileExists(path)) {
    const existingJwk = JSON.parse(await readFile(path, 'utf8'));
    const importedPrivateKey = await webcrypto.subtle.importKey(
      'jwk',
      existingJwk,
      algorithm,
      true,
      importedUsages,
    );

    return { privateJwk: existingJwk, privateKey: importedPrivateKey };
  }

  const keyPair = await webcrypto.subtle.generateKey(algorithm, true, generatedUsages);
  const generatedPrivateJwk = await webcrypto.subtle.exportKey('jwk', keyPair.privateKey);

  await writeJson(path, generatedPrivateJwk);
  await chmod(path, 0o600);

  return { privateJwk: generatedPrivateJwk, privateKey: keyPair.privateKey };
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function publicSigningJwkFromPrivate(privateJwk) {
  const { kty, crv, x, y } = privateJwk;

  return {
    kty,
    crv,
    x,
    y,
    ext: true,
    key_ops: ['verify'],
  };
}

function publicMessageJwkFromPrivate(privateJwk) {
  const { d: _d, key_ops: _keyOps, ...publicJwk } = privateJwk;

  return {
    ...publicJwk,
    kty: publicJwk.kty ?? 'EC',
    crv: publicJwk.crv ?? 'P-256',
    ext: true,
  };
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
