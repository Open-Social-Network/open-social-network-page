# Contributing to Open Social Network Page

Open Social Network Page should make sovereign publishing simple and safe.

## Principles

- Keep the template static-host friendly.
- Never commit private keys.
- Keep generated protocol files easy to inspect.
- Prefer readable HTML, CSS, and JavaScript over framework complexity.
- Validate signatures before claiming a template is working.

## Local Development

```bash
npm run generate
npm run validate
npm run serve
```

## Pull Requests

Pull requests should include:

- a concise explanation of the user impact
- validation output
- screenshots for visible page changes
- notes on compatibility with Open Social Network v0.1

## Project Context

Open Social Network is not trying to erase the work of Mastodon, ActivityPub, Nostr, Bluesky/AT Protocol, Diaspora, Matrix, or the broader fediverse. Those projects have already moved open social infrastructure forward in serious ways.

This project explores a smaller, web-native primitive: a profile that belongs to its publisher, signed public records that can be read by any compatible aggregator, and publishing that works on ordinary static hosting. Contributions should keep that direction clear for both developers and non-technical users.
