---
name: sdlc-visual-docs
description: Presenting QA and SDLC information clearly — test strategies, coverage/metrics dashboards, defect analysis, sprint summaries, pipeline docs, comparison matrices, onboarding guides. Use when the user asks to document, visualize, report, or summarize a QA process with structure (tables, status badges, progress bars, next steps). Output is terminal-markdown by default; HTML widgets are optional for claude.ai/desktop only.
allowed-tools: Read, Glob, Grep
---

# SDLC Visual Documentation

The canonical presentation rules live in
**[.claude/docs/reference/visual-presentation.md](../../docs/reference/visual-presentation.md)**.
Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- **Terminal-markdown first.** The team works in the VSCode terminal extension where
  `show_widget` HTML **does not render** — default to markdown tables, emoji status badges
  (✅/⚠️/❌/ℹ️), and ASCII progress bars. The HTML/`show_widget` path is the optional
  appendix in the reference, for claude.ai/desktop only.
- Pick the document type from the catalog in the reference (Test Strategy, Coverage
  Dashboard, Defect Analysis, Sprint Summary, Pipeline Doc, Comparison Matrix, Onboarding).
  Every document leads with a status/score + 3–5 real metrics and ends with next steps.
- Use the metrics glossary and benchmark bands in the reference to color values ✅/⚠️/❌.
- **English artifacts**, chat may be Spanish — do not translate document content to match
  the chat language.
- Missing data is marked `NO DATA` / `OPEN QUESTION`, never fabricated.
- Ready-to-fill HTML templates (optional path) remain in
  [references/example-outputs.md](references/example-outputs.md).
