# Changelog

All notable analysis, architecture, and implementation-planning artifacts for the NEXA platform are recorded here. This file follows a Keep-a-Changelog-style structure.

## [Unreleased]

- 📋 Analysis — US-001 User Authentication and Session Management: BRD, User Story, and Implementation Plan generated for the Sprint 1 backend authentication foundation (login, RS256 JWT + refresh rotation, 30-min inactivity, account lockout, Argon2id hashing, forgot/reset-password via IEmailSender). Includes greenfield solution bootstrap. (US-001)
- 🏗️ ADR — ADR-2026-07-20 JWT Signing Algorithm: RS256 chosen; resolves the "HMAC RS256" documentation inconsistency (WBS §3.1.1 / SAD). (US-001)
- 🏗️ ADR — ADR-2026-07-20 Auth Transactional Email: Auth Module sends reset/invitation email directly via IEmailSender (SendGrid), exempt from the compliance-gated Dispatch path. (US-001)
- 🏗️ ADR — ADR-2026-07-20 OpenAPI Contract Deliverable: `/auth/*` OpenAPI 3 contract published as a US-001 deliverable to unblock US-025 in parallel. (US-001)
