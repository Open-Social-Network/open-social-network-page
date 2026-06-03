# Security Policy

OpenSocial Page is early alpha software.

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
