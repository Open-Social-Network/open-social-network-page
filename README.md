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

## Relationship To Existing Decentralized Social Platforms

Open Social Network is not pretending that decentralized social media begins here.

Mastodon, ActivityPub, Nostr, Bluesky/AT Protocol, Diaspora, Matrix, and the broader fediverse have already done serious work on open social systems, federation, portable identity, relays, community governance, and protocol-based communication. Open Social Network exists because we believe the internet still needs a simpler, user-owned social primitive.

Email has protocols. DNS has protocols. The web has protocols. AI systems are beginning to use open interoperability layers. Social identity should have the same kind of open, inspectable foundation instead of living only inside applications that can change the rules, the algorithm, or the audience relationship at any time.

Open Social Network explores one clear idea: a social profile should be a sovereign web identity first, and an app account second. This template turns that idea into a real page that can be hosted anywhere.

### The Direction

- Profiles are sovereign. A profile belongs to the person, organization, project, or community that publishes it.
- Aggregators are replaceable. They read, verify, rank, moderate, and display the network; they do not own it.
- Creators should keep their audience. The long-term goal is portable followers, portable reputation, and portable social history across apps and hosts.
- Algorithms should compete. No single feed should decide visibility for the whole network.
- The protocol should stay small. The base layer should be easy to inspect, implement, and explain.
- Users should not need to become infrastructure experts. Decentralization belongs in the design, not in the user's daily burden.
- The protocol has no global account switch. Moderation belongs to hosts, apps, aggregators, communities, and users rather than one central protocol owner.

### Why This Is Different

Many decentralized systems still ask users to choose an instance, trust a relay, understand federation, manage provider-specific identity, or accept that visibility and reputation live inside a particular service. Those systems are valuable, but they can still feel like accounts attached to infrastructure.

Open Social Network starts from static, signed, portable web objects: a profile, a feed, posts, public actions, and encrypted message envelopes. A page can live on GitHub Pages, Cloudflare Pages, Netlify, Vercel, S3-compatible storage, a personal server, a community host, or any future compatible storage layer. The official tools are reference implementations, not the network itself.

### What v0.1 Is Trying To Prove

The early protocol is intentionally small. It focuses on identity, profiles, signed posts, signed public actions, and encrypted messages before adding more complex layers such as global search, recommendation systems, media hosting, managed hosting, advanced moderation, or creator monetization.

The bet is that a minimal, verifiable base can make social media feel more like open internet infrastructure: clients can compete, hosts can differ, communities can moderate, algorithms can improve, and users keep the identity underneath.

### Final Thought

Open Social Network has not solved every hard problem in decentralized social media. Spam, safety, abuse, discovery, onboarding, moderation, scaling, and creator incentives require serious work.

This project exists to make that work possible on top of a simple foundation: user-owned social identity, signed public records, portable relationships, encrypted private communication, and interfaces that ordinary people can use.
