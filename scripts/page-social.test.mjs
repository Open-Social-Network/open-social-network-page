import assert from 'node:assert/strict';
import test from 'node:test';
import { renderPostSocialSummary, summarizePostActions } from '../public/page-social.js';

test('summarizes public actions for one post', () => {
  const post = {
    id: 'post_001',
    author: 'owner@example.test',
  };
  const actionInbox = {
    protocol: 'open-social-network',
    version: '0.1',
    owner: 'owner@example.test',
    actions: [
      action('like_1', 'reaction', 'ada@example.test', post, { reaction: 'like' }),
      action('dislike_1', 'reaction', 'ben@example.test', post, { reaction: 'dislike' }),
      action('comment_1', 'comment', 'chris@example.test', post, { content: 'Good post.' }),
      action('like_other', 'reaction', 'ada@example.test', {
        id: 'post_002',
        author: 'owner@example.test',
      }, { reaction: 'like' }),
      action('wrong_author', 'reaction', 'ada@example.test', {
        id: 'post_001',
        author: 'other@example.test',
      }, { reaction: 'like' }),
    ],
  };

  assert.deepEqual(summarizePostActions(post, actionInbox), {
    likes: 1,
    dislikes: 1,
    comments: [
      {
        id: 'comment_1',
        actor: 'chris@example.test',
        content: 'Good post.',
        createdAt: '2026-06-04T12:00:00.000Z',
      },
    ],
  });
});

test('renders social action counts and escapes public comments', () => {
  const summary = {
    likes: 2,
    dislikes: 1,
    comments: [
      {
        id: 'comment_1',
        actor: 'ada@example.test',
        content: '<script>alert("x")</script>',
        createdAt: '2026-06-04T12:00:00.000Z',
      },
    ],
  };
  const html = renderPostSocialSummary(summary);

  assert.match(html, /2 likes/);
  assert.match(html, /1 dislike/);
  assert.match(html, /1 comment/);
  assert.match(html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('uses the latest reaction from each actor', () => {
  const post = {
    id: 'post_001',
    author: 'owner@example.test',
  };
  const actionInbox = {
    protocol: 'open-social-network',
    version: '0.1',
    owner: 'owner@example.test',
    actions: [
      action('new_dislike', 'reaction', 'ada@example.test', post, {
        reaction: 'dislike',
        createdAt: '2026-06-04T12:01:00.000Z',
      }),
      action('old_like', 'reaction', 'ada@example.test', post, {
        reaction: 'like',
        createdAt: '2026-06-04T12:00:00.000Z',
      }),
    ],
  };

  assert.equal(summarizePostActions(post, actionInbox).likes, 0);
  assert.equal(summarizePostActions(post, actionInbox).dislikes, 1);
});

function action(id, kind, actor, target, extra) {
  return {
    id,
    kind,
    actor,
    createdAt: extra.createdAt ?? '2026-06-04T12:00:00.000Z',
    target: {
      type: 'post',
      id: target.id,
      author: target.author,
    },
    signature: {
      alg: 'ES256',
      value: `${id}_signature`,
    },
    ...extra,
  };
}
