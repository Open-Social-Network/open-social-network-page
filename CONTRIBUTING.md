# Contributing to OpenSocial Page

OpenSocial Page should make sovereign publishing simple and safe.

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
- notes on compatibility with OpenSocial v0.1
