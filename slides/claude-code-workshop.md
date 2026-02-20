---
slug: claude-code-workshop
title: Hands on with Claude Code
description: Agentic Coding in Practice
---

<!-- slide: {"type": "welcome", "theme": "light"} -->
# Welcome!

**Install Claude Code:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**WiFi:** {{wifi_ssid}} &nbsp;|&nbsp; **Password:** {{wifi_password}}

---

<!-- slide: {"type": "title", "theme": "dark"} -->
# Hands on with Claude Code

### Agentic Coding in Practice

**{{event_name}}**

---

<!-- slide: {"type": "speakers", "theme": "light"} -->
## Your Presenters

{{speakers}}

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# What is Claude Code?

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Claude Code

An **agentic coding tool** that lives in your terminal and understands your entire codebase.

- Reads, edits, and writes files
- Runs tests and shell commands
- Searches the web and fetches docs
- Manages git workflows end-to-end
- Calls external tools via MCP servers

> Claude Code operates with agency — it takes actions, not just suggestions.

---

<!-- slide: {"type": "two-col", "theme": "light"} -->
## Agentic vs. Copilot

**IDE Copilot**

- Autocomplete suggestions
- Single-file awareness
- You drive every edit
- Stateless interactions

**Claude Code (Agentic)**

- Multi-step task execution
- Full-repo understanding
- Iterates autonomously
- Maintains context across files

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Key Capabilities

- **Understand** — reads your entire codebase, not just the open file
- **Edit** — makes precise, targeted changes across many files
- **Run** — executes tests, builds, linters and interprets results
- **Search** — finds patterns, definitions, and usage across the repo
- **Plan** — breaks complex tasks into steps and tracks progress
- **Extend** — connects to databases, APIs, and services via MCP

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Getting Started

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Installation & Auth

```bash
# Install
curl -fsSL https://claude.ai/install.sh | bash

# Authenticate
claude
# Follow the browser OAuth flow

# Verify
claude --version
```

Requires: **Node.js 18+** or use the API key flow with `--api-key`

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Core Commands

```bash
# Start interactive session
claude

# One-shot task
claude "add error handling to src/api.ts"

# Ask a question
claude "explain how the auth middleware works"

# Continue last session
claude --continue

# Resume a specific session
claude --resume <session-id>
```

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Slash Commands (in session)

```
/help          — list all commands
/compact       — summarise & compress context
/clear         — start a fresh context window
/cost          — show token usage & cost
/status        — model info, memory, MCP tools
/review        — code review for staged changes
/commit        — write and commit a message
/pr-comments   — respond to PR review comments
```

---

<!-- slide: {"type": "content", "theme": "light"} -->
## CLAUDE.md — Project Memory

Create a `CLAUDE.md` at the root of your repo:

```markdown
# Project Context

## Stack
- SvelteKit + TypeScript frontend
- Supabase (PostgreSQL + RLS) backend
- Deployed on Vercel

## Commands
- `npm run dev` — start dev server
- `npm test` — run vitest suite

## Conventions
- Use named exports, not default exports
- Prefer `$state` runes over writable stores
```

Claude reads this on every session start.

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Advanced Features

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Extended Thinking

Some problems need deeper reasoning before acting.

```bash
claude --thinking "redesign the data model to support multi-tenancy"
```

Claude will:
1. Reason through the problem space
2. Explore trade-offs
3. Propose a plan before making changes

Best for: architecture decisions, complex refactors, debugging subtle bugs.

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Hooks

Run shell commands automatically on Claude Code events:

```json
// ~/.claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{"type": "command", "command": "npm run lint"}]
    }],
    "Stop": [{
      "hooks": [{"type": "command", "command": "say 'Claude is done'"}]
    }]
  }
}
```

**Hook events:** `PreToolUse`, `PostToolUse`, `Notification`, `Stop`

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Model Context Protocol (MCP)

Connect Claude Code to external tools and data sources:

```bash
# Add a server
claude mcp add postgres -- npx @modelcontextprotocol/server-postgres $DATABASE_URL

# Use in session
claude "show me all users who signed up this week"
```

**Popular MCP servers:**
- `@modelcontextprotocol/server-postgres` — query your DB
- `@modelcontextprotocol/server-github` — manage issues & PRs
- `@modelcontextprotocol/server-slack` — post messages
- `@modelcontextprotocol/server-filesystem` — extended file access

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Sub-Agents & Parallelism

Claude Code can spin up sub-agents to work in parallel:

```
claude "run all three migration scripts in parallel,
        verify each succeeds, then run the test suite"
```

Sub-agents can:
- Work on independent branches simultaneously
- Aggregate results back to the parent session
- Be orchestrated with the Task tool in custom agents

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Custom Slash Commands

Create project-specific commands in `.claude/commands/`:

```markdown
<!-- .claude/commands/deploy.md -->
# Deploy to Staging

Run the full pre-deploy checklist:
1. `npm run build`
2. `npm test`
3. Check for TODO comments in staged files
4. Push to `staging` branch
```

Then use `/deploy` in any Claude Code session in this repo.

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Tips & Best Practices

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Prompt Patterns That Work

**Be specific about scope:**
> "Update only `src/lib/auth.ts` — don't touch any other files"

**Provide examples:**
> "Follow the same pattern as `CreateSession.svelte` when building `EditSession.svelte`"

**Ask for a plan first:**
> "Before making changes, explain your approach"

**Iterate, don't micromanage:**
> Let Claude complete the full task, then review and refine

---

<!-- slide: {"type": "content", "theme": "light"} -->
## When Claude Gets Stuck

- Use `/compact` to free up context before a big task
- Add more detail to `CLAUDE.md` if Claude misses conventions
- Break large tasks into smaller, verifiable steps
- Use `--thinking` for architectural or debugging problems
- Check `/cost` if responses slow down — you may be near context limit

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## API Access

Get API credits for today's workshop:

**{{api_credit_url}}**

Your Claude Code already uses your personal account. These credits are for building your own apps with the Anthropic API directly.

```bash
# In your code
npm install @anthropic-ai/sdk

# Quick test
export ANTHROPIC_API_KEY=sk-...
node -e "const Anthropic = require('@anthropic-ai/sdk');
         const c = new Anthropic();
         c.messages.create({model:'claude-opus-4-5',
           max_tokens:100, messages:[{role:'user',content:'hi'}]})
         .then(r => console.log(r.content[0].text))"
```

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Lab Time

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Today's Lab: {{lab_title}}

Open your lab in the browser and follow the steps:

**Session URL:** provided by your presenter

**Questions?** Raise your hand or ask in the chat.

**Goal:** Complete as many steps as you can — bonus points for going beyond the instructions!

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Lab Tips

- Read each step fully before starting
- Use `CLAUDE.md` to give Claude context about the project
- If something fails, describe the error to Claude — don't fix it manually
- Work through the steps in order; later steps build on earlier ones
- **Bonus steps** are optional but worth extra points

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Wrap Up

---

<!-- slide: {"type": "content", "theme": "light"} -->
## What We Covered

- Claude Code installation and core commands
- CLAUDE.md for project-level memory
- Slash commands and hooks
- MCP servers for external integrations
- Sub-agents and parallel execution
- Custom slash commands
- Practical prompt patterns

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Resources

- **Docs:** [claude.ai/code](https://claude.ai/code)
- **MCP Servers:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **API Reference:** [docs.anthropic.com](https://docs.anthropic.com)
- **Community:** [claude.ai/community](https://claude.ai/community)

Feedback form — link in chat.

---

<!-- slide: {"type": "title", "theme": "dark"} -->
# Thank You!

### Questions?

**{{event_name}}** — {{company_name}}

{{speakers}}
