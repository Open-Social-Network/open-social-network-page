<p align="center">
  <img src="./assets/open-social-network-logo.png" width="96" alt="Open Social Network logo" />
</p>

# Open Social Network Page

Open Social Network Page is the official sovereign page template for Open Social Network.

It is a simple social page you can host anywhere static files work.

It lets a person publish a page, posts, and verification data as ordinary static files:

- `profile.json`
- `feed.json`
- `/.well-known/open-social-network.json`
- a human-readable profile page

The page can be hosted on GitHub Pages, Cloudflare Pages, Netlify, a VPS, a personal server, or any static hosting provider.

## In One Minute

Open Social Network Page is a starter kit for owning your social presence.

It creates:

1. a visible profile page
2. signed posts
3. public files that any aggregator can read
4. technical files for verification

An Open Social Network aggregator can read these files and verify that the posts came from this identity.

## Your Social Identity as a Page on the Internet

The web already understands independent ownership.

You can own a domain. You can publish a website. You can send email across providers. Increasingly, AI systems can connect through shared protocols like MCP.

But social media is still mostly platform-owned. Your handle, audience, posts, and reputation are usually locked inside someone else's product.

Open Social Network Page changes the starting point:

Your profile is yours.

Your feed is yours.

Your identity is yours.

Aggregators can read and display your page, but they do not own it.

## Why This Matters

Open Social Network is built around a simple idea: a social profile should be a page on the internet, not a row inside a platform database.

This template makes that idea real. It gives a user a sovereign page that aggregators can read, verify, and display without owning the user's identity or audience.

## What You Get

- a human-readable profile page
- a machine-readable `profile.json`
- a signed `feed.json`
- a `.well-known` discovery file
- local key generation
- validation that verifies every post signature
- a deployment model that works with ordinary static hosting

## Benefits

For individuals:

- publish without asking a platform for permission
- keep your identity portable
- move hosts without abandoning your audience
- let many clients read the same source of truth

For communities:

- build independent social spaces without owning user identities
- choose moderation and discovery layers independently
- make archives and mirrors easier to preserve

For developers:

- build against signed public files
- experiment with clients and aggregators
- use the existing web instead of waiting for a centralized API

## What Is Included

```text
open-social-network-page/
├── page.config.json
├── public/
│   ├── .well-known/
│   │   └── open-social-network.json
│   ├── assets/
│   ├── feed.json
│   ├── index.html
│   ├── opensocial/
│   │   ├── actions/index.json
│   │   └── messages/inbox/index.json
│   ├── page.js
│   ├── profile.json
│   └── styles.css
└── scripts/
    ├── generate-page.mjs
    ├── serve.mjs
    └── validate-page.mjs
```

## Quick Start

The easiest path for most users is Open Social Network Web. It can create a page in the browser and export files you can host anywhere.

The terminal path is the official CLI:

```bash
npx open-social-network
```

It guides you through page creation, posting, checking, previewing, and publishing.

## Manual Template Flow

Edit `page.config.json`, then generate signed Open Social Network files:

```bash
npm run generate
npm run validate
npm run serve
```

Open `http://127.0.0.1:4173/`.

## Step-by-Step

1. Clone this repository.
2. Edit `page.config.json`.
3. Run `npm run generate`.
4. Run `npm run validate`.
5. Run `npm run serve` to preview locally.
6. Publish the `public/` directory to any static host.

The generated public files are safe to deploy. The generated private key is not.

## Files You Should Understand

- `page.config.json` - your editable profile and post source
- `public/` - safe files you can host anywhere, including the public action log and encrypted message inbox
- `private/identity.private.jwk.json` - the file that proves the page is yours; never publish this
- `private/messages.private.jwk.json` - the file that decrypts messages sent to the page; never publish this

## Private Keys

The generator writes a private key to:

```text
private/identity.private.jwk.json
```

The generator also writes a private message key to:

```text
private/messages.private.jwk.json
```

The `private/` directory is ignored by git. Do not publish it.

The public key is written into `public/profile.json`, and posts in `public/feed.json` are signed with the matching private key.

## Deploy

Publish the contents of `public/` to any static host.

Example deployment targets:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- S3-compatible hosting
- any static web server

After deployment, update `baseUrl` in `page.config.json`, regenerate the files, validate them, and publish again.

## Related Repositories

- [`open-social-network-cli`](https://github.com/Open-Social-Network/open-social-network-cli) - guided publishing for real sovereign profiles
- [`open-social-network-core`](https://github.com/Open-Social-Network/open-social-network-core) - protocol primitives, schemas, and specification
- [`open-social-network-web`](https://github.com/Open-Social-Network/open-social-network-web) - the official web aggregator

## Status

Open Social Network Page is early alpha. The current goal is to make sovereign profile publishing simple, inspectable, and compatible with the Open Social Network v0.1 protocol.

This repository is the smallest practical version of a much larger vision: social identity as open internet infrastructure.

## How Open Social Network Differs From Existing Decentralized Social Platforms

Open Social Network does not start from the claim that decentralized social media is new.

Mastodon, ActivityPub, Nostr, Bluesky, Diaspora, Matrix, and the broader fediverse have already proven that open social systems matter. They have advanced federation, decentralized identity, relays, public protocols, community governance, and user choice.

Open Social Network exists because we think some problems still deserve a simpler protocol-first experiment: ownership that starts at the user's page, an experience that feels familiar to nontechnical people, and social records that remain portable across clients, hosts, and aggregators.

The goal is to learn from prior work, not to erase it.

### The Different Bet

Open Social Network treats a profile as a sovereign web object. It should feel closer to a website, a domain, or an email identity than to an account rented from one instance, relay, provider, or app.

The protocol keeps the first layer small: profiles, feeds, signed posts, signed public actions, and encrypted message envelopes. Everything else - ranking, moderation, search, media hosting, notifications, recommendation systems, and managed hosting - can be built as replaceable layers around that foundation.

### Problems We Are Designing Around

Identity should not be trapped in infrastructure users do not control. A person should be able to move hosts, change apps, use mirrors, or self-host without restarting their social existence.

Decentralization should not become homework for everyday users. People should not need to understand federation, relays, instances, key formats, or static hosting before they can create a page and post.

Creators should keep their audience and reputation. Followers, visibility, comments, reactions, and trust signals should be portable protocol data, not private database rows that disappear when a user changes clients.

Aggregators should be replaceable. They should read, verify, rank, moderate, and display the network, but they should not own the identities or the graph. Different aggregators and algorithms should be able to compete.

The protocol should stay small enough to inspect. Open Social Network should feel more like a set of web conventions for social identity than a distributed operating system.

### What This Means In Practice

- A page can be hosted anywhere static files work.
- The public folder is safe to publish; private keys are never published.
- Posts and public actions are signed so any client can verify them.
- Direct messages are stored as encrypted envelopes so hosts can carry them without reading them.
- Official tools are reference implementations, not the network itself.
- Moderation remains possible at the host, app, aggregator, community, and user layer without creating one global protocol owner.

### Final Note

Open Social Network does not claim to have solved decentralized social media. Moderation, spam, abuse handling, discovery, scaling, onboarding, incentives, and safety are hard problems.

This project is an attempt to explore a smaller and more user-centered path: social identity as open internet infrastructure, where platforms become interfaces and users keep the underlying identity, audience, and content.
