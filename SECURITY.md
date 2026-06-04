# Security Policy

Open Social Network Page is early alpha software.

## Private Key Safety

The generator writes private keys to `private/`, which is ignored by git. Do not publish this directory. If a private key is accidentally exposed, generate a new page identity.

## Reporting Security Issues

Please report suspected vulnerabilities privately through GitHub Security Advisories when available. If advisories are not enabled, open a minimal public issue without exploit details and request a private channel.

## Areas of Interest

We especially care about:

- private key leakage
- invalid signatures being accepted
- unsafe rendering of post content
- incorrect `.well-known` discovery files
- confusing deployment instructions that could publish private material

## Security Philosophy

Open Social Network treats social identity as portable web infrastructure rather than an account inside one platform. That only works if users can trust the boundary between public files and private keys.

Security work should prioritize clear key handling, verifiable signatures, safe rendering, and deployment flows that ordinary users can follow without accidentally publishing secrets.
