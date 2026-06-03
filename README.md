<p align="center">
  <img src="./assets/open-social-logo.png" width="96" alt="OpenSocial logo" />
</p>

# OpenSocial Page

OpenSocial Page is the official sovereign page template for OpenSocial.

It lets a person publish an identity and feed as ordinary static files:

- `profile.json`
- `feed.json`
- `/.well-known/opensocial.json`
- a human-readable profile page

The page can be hosted on GitHub Pages, Cloudflare Pages, Netlify, a VPS, a personal server, or any static hosting provider.

## In One Minute

OpenSocial Page is a starter kit for owning your social presence.

It creates:

1. a visible profile page
2. a `profile.json` identity file
3. a `feed.json` signed post feed
4. a `/.well-known/opensocial.json` discovery file

An OpenSocial aggregator can read these files and verify that the posts came from this identity.

## Your Social Identity as a Page on the Internet

The web already understands independent ownership.

You can own a domain. You can publish a website. You can send email across providers. Increasingly, AI systems can connect through shared protocols like MCP.

But social media is still mostly platform-owned. Your handle, audience, posts, and reputation are usually locked inside someone else's product.

OpenSocial Page changes the starting point:

Your profile is yours.

Your feed is yours.

Your identity is yours.

Aggregators can read and display your page, but they do not own it.

## Why This Matters

OpenSocial is built around a simple idea: a social profile should be a page on the internet, not a row inside a platform database.

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
opensocial-page/
├── page.config.json
├── public/
│   ├── .well-known/
│   │   └── opensocial.json
│   ├── assets/
│   ├── feed.json
│   ├── index.html
│   ├── page.js
│   ├── profile.json
│   └── styles.css
└── scripts/
    ├── generate-page.mjs
    ├── serve.mjs
    └── validate-page.mjs
```

## Quick Start

The easiest path is the official CLI:

```bash
npx opensocial
```

It guides you through identity creation, signing, validation, preview, and free deployment.

## Manual Template Flow

Edit `page.config.json`, then generate signed OpenSocial files:

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
6. Publish the `public/` directory to a static host.

The generated public files are safe to deploy. The generated private key is not.

## Files You Should Understand

- `page.config.json` - your editable profile and post source
- `public/profile.json` - public identity file
- `public/feed.json` - public signed feed
- `public/.well-known/opensocial.json` - discovery file
- `private/identity.private.jwk.json` - private signing key, never publish this

## Private Keys

The generator writes a private key to:

```text
private/identity.private.jwk.json
```

The `private/` directory is ignored by git. Do not publish it.

The public key is written into `public/profile.json`, and posts in `public/feed.json` are signed with the matching private key.

## Deploy

Publish the contents of `public/` to any static host.

Recommended first deployment targets:

- GitHub Pages
- Cloudflare Pages
- Netlify
- any static web server

After deployment, update `baseUrl` in `page.config.json`, regenerate the files, validate them, and publish again.

## Related Repositories

- [`opensocial-cli`](https://github.com/Open-Social-Organization/opensocial-cli) - guided publishing for real sovereign profiles
- [`opensocial-core`](https://github.com/Open-Social-Organization/opensocial-core) - protocol primitives, schemas, and specification
- [`opensocial-web`](https://github.com/Open-Social-Organization/opensocial-web) - the official web aggregator

## Status

OpenSocial Page is early alpha. The current goal is to make sovereign profile publishing simple, inspectable, and compatible with the OpenSocial v0.1 protocol.

This repository is the smallest practical version of a much larger vision: social identity as open internet infrastructure.
