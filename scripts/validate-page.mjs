import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';

const encoder = new TextEncoder();
const profile = JSON.parse(await readFile('public/profile.json', 'utf8'));
const discovery = JSON.parse(await readFile('public/.well-known/open-social-network.json', 'utf8'));
const feed = JSON.parse(await readFile('public/feed.json', 'utf8'));
const actionLog = JSON.parse(await readFile('public/opensocial/actions/index.json', 'utf8'));
const messageLog = JSON.parse(await readFile('public/opensocial/messages/inbox/index.json', 'utf8'));
const failures = [];

if (profile.protocol !== 'open-social-network' || profile.version !== '0.1') {
  failures.push('profile.json must declare Open Social Network protocol version 0.1');
}

if (JSON.stringify(profile) !== JSON.stringify(discovery)) {
  failures.push('.well-known/open-social-network.json must match profile.json');
}

if (feed.protocol !== 'open-social-network' || feed.version !== '0.1') {
  failures.push('feed.json must declare Open Social Network protocol version 0.1');
}

if (feed.author !== profile.handle) {
  failures.push('feed author must match profile handle');
}

if (actionLog.protocol !== 'open-social-network' || actionLog.version !== '0.1') {
  failures.push('action log must declare Open Social Network protocol version 0.1');
}

if (actionLog.actor !== profile.handle) {
  failures.push('action log actor must match profile handle');
}

if (!Array.isArray(actionLog.actions)) {
  failures.push('action log actions must be an array');
}

if (messageLog.protocol !== 'open-social-network' || messageLog.version !== '0.1') {
  failures.push('message inbox must declare Open Social Network protocol version 0.1');
}

if (messageLog.owner !== profile.handle) {
  failures.push('message inbox owner must match profile handle');
}

if (!Array.isArray(messageLog.messages)) {
  failures.push('message inbox messages must be an array');
}

for (const post of feed.posts || []) {
  if (!(await verifyPost(post, profile))) {
    failures.push(`post ${post.id || '(missing id)'} failed signature verification`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${feed.posts.length} signed Open Social Network posts for ${profile.handle}`);

async function verifyPost(post, identity) {
  if (post.author !== identity.handle || post.signature?.alg !== 'ES256') {
    return false;
  }

  try {
    const publicKey = await webcrypto.subtle.importKey(
      'jwk',
      identity.publicKey.jwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['verify'],
    );
    const payload = encoder.encode(canonicalStringify(postSigningPayload(post)));

    return webcrypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      base64UrlToBytes(post.signature.value),
      payload,
    );
  } catch {
    return false;
  }
}

function postSigningPayload(post) {
  const { signature, ...payload } = post;

  return payload;
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

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

  return Buffer.from(padded, 'base64');
}
