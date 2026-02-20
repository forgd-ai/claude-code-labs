---
slug: rust-zero2prod
title: "Claude Code Tutorial - Zero To Production (Rust)"
description: "A step-by-step guide to use Claude Code with Zero To Production, the canonical Rust web development book's application built with Actix-web."
difficulty: advanced
estimated_duration: "90 minutes"
prerequisites: ["Claude Code installed and set up", "Rust toolchain installed (rustup)", "Docker installed (for PostgreSQL and Redis)", "Git installed"]
tags: [rust, actix-web, claude-code]
---

# Claude Code Tutorial - Zero To Production (Rust)

A step-by-step guide to use Claude Code with Zero To Production, the canonical Rust web development book's application. This is an advanced lab — you'll work with Actix-web, PostgreSQL, and Rust's type system. By the end, you'll understand how to use Claude Code for Rust web development tasks.

### Troubleshooting

If Claude doesn't succeed initially:

- **Copy error logs directly into Claude** — Paste compiler errors from your terminal. Rust's borrow checker errors can be verbose — paste the full output for best results. Claude is excellent at interpreting Rust compiler messages.
- **Use screenshots** — Paste images directly into Claude (`Ctrl+V` on Mac, not `Cmd+V`) to show visual bugs or UI issues.
- **Iterate on prompts** — Refine your request based on what worked or didn't.

For complex problems:

- Prompt Claude to **"think harder"** or **"ultrathink"** to allocate more reasoning tokens. This is especially useful for borrow checker and lifetime issues.
- For Actix-web-specific issues, include the relevant handler signature and error type context.

To debug Claude's actions:

- Type `Ctrl+O` to toggle the transcript view and see exactly what tools Claude is calling and what files it's reading.

### Common Rust/Actix-web Tips

- Use `cargo check` for fast validation before running full builds — it skips code generation and is much faster than `cargo build`.
- Borrow checker errors are Rust's most common stumbling block — always paste the full compiler output to Claude.
- Check that your Docker containers for PostgreSQL and Redis are running if you get connection errors (`docker ps`).
- Use `cargo clippy` to catch common Rust mistakes and non-idiomatic patterns.
- First build will be slow as Rust compiles all dependencies — subsequent builds are incremental.

### Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Zero To Production on GitHub](https://github.com/LukeMathWalker/zero-to-production)
- [Zero To Production in Rust (Book)](https://www.zero2prod.com/)
- [Actix-web Documentation](https://actix.rs/docs)
- [Claude Code Best Practices](https://www.anthropic.com/blog/claude-code-best-practices)

> **Pro Tip: Claude Code will ask for permission when it needs to:**
>
> - Modify files in your project
> - Run bash commands (cargo build, cargo test, Docker commands, etc.)
> - Install new tools (like the Playwright MCP in Step 8)
>
> Press **Enter** to approve each action, or tell Claude what to do instead.
> (Advanced users can configure auto-approvals in `.claude/settings.json`)
>
> This keeps you in control of what happens in your codebase.

---

## Step 1: Clone Repository

<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Clone Zero To Production through one of two methods:

**Option 1: Git**

```bash
git clone https://github.com/LukeMathWalker/zero-to-production.git
cd zero-to-production
git checkout -b new_features
```

**Option 2: Direct Download**

Download the [zip from GitHub](https://github.com/LukeMathWalker/zero-to-production/archive/refs/heads/main.zip), extract it, and navigate to the `zero-to-production` directory in your terminal.

---

## Step 2: Launch Claude Code

<!-- step: { "id": "step-2", "points": 10, "category": "core" } -->

Start Claude Code and configure your model:

```bash
claude
```

Run `/model` to select your preferred model.

---

## Step 3: Run Zero To Production Locally

<!-- step: { "id": "step-3", "points": 10, "category": "core" } -->

This app requires PostgreSQL and Redis. Start the backing services first, then run the app:

```
Start PostgreSQL using the project's scripts/init_db.sh, start Redis using scripts/init_redis.sh, then build and run the application with cargo run
```

Claude will launch the PostgreSQL and Redis Docker containers using the project's initialization scripts, then run `cargo run` to compile and start the Actix-web server at `localhost:8000` as a background task (`Ctrl+B`).

> **Note:** The `sqlx` CLI is required by `init_db.sh` for running migrations. If it's not installed, Claude will run `cargo install sqlx-cli --version '~0.8' --features rustls,postgres --no-default-features` first.

> **Note:** The first build will take a few minutes as Rust compiles all dependencies. Subsequent builds are much faster.

Keep the background task running. Test the API with curl:
- `curl localhost:8000/health_check` — Health check endpoint
- `curl -X POST localhost:8000/subscriptions -d 'name=Test&email=test@example.com'` — Subscribe
- Verify the subscription was stored in PostgreSQL

---

## Step 4: Create and Edit the CLAUDE.md File

<!-- step: { "id": "step-4", "points": 10, "category": "core" } -->

This project does **not** have a CLAUDE.md file — so we'll create one. CLAUDE.md is a project-specific README for Claude Code that provides context about your codebase.

### Generate a CLAUDE.md with /init

Use the `/init` command to have Claude analyze your project and generate a first draft:

```
/init
```

Claude will scan the project structure, Cargo.toml, and source code, then generate a `CLAUDE.md` at the project root. Review what it produces.

### Using @-file mentions

You can reference specific files in your prompts using `@filename`:

```
Print out exactly what is in @CLAUDE.md
```

### Three ways to edit CLAUDE.md

**1. Ask Claude to edit it directly:**

```
Edit my CLAUDE.md file to add "Always use proper error types — never use unwrap() in production code"
```

**2. Use # to enter Memory mode:**

In Claude Code, type `#` to enter Memory mode, then type:

```
Follow existing module structure (routes/, domain/, configuration/) when adding new features
```

Save it to your **Project** memory (or **User**, if you want it to persist beyond this demo).

**3. Open the file directly in your editor and add guidelines such as:**

```
- Use sqlx for all database queries with compile-time checking
- Write integration tests using the test helper infrastructure in tests/
- Always define custom error types that implement ResponseError for Actix-web
```

When you ask Claude Code for help later in this tutorial, it will reference this context automatically.

---

## Step 5: Explore the Codebase

<!-- step: { "id": "step-5", "points": 10, "category": "core" } -->

Let's explore the Zero To Production codebase by having Claude generate an architecture diagram. This is a great way to get oriented in a new project.

```
Using only the @CLAUDE.md and the source code, create a Mermaid diagram showing the application architecture: Actix-web server setup, route handlers, domain types, middleware chain (tracing, auth), database layer (sqlx + PostgreSQL), and configuration system. Save it as architecture.md
```

Claude will analyze the codebase and generate a Mermaid diagram showing:
- Domain types: `SubscriberName`, `SubscriberEmail`, `NewSubscriber`
- Routes: `health_check`, `subscribe`, `publish_newsletter`
- Middleware: tracing, authentication
- Infrastructure: sqlx connection pool, email client, configuration

You can paste the Mermaid diagram into any Mermaid renderer (GitHub renders them natively in markdown, or use [mermaid.live](https://mermaid.live)) to visualize it.

---

## Step 6: Build a Feature

<!-- step: { "id": "step-6", "points": 10, "category": "core" } -->

Enter **Plan Mode** by pressing `Shift+Tab` until you see Plan mode (or type `/plan`). Plan mode lets Claude analyze the codebase and create a detailed implementation plan without making changes yet.

### The Feature: Subscriber Admin Dashboard

Prompt Claude to add an admin dashboard with HTML views:

```
Add a subscriber admin dashboard with:
1. A new askama or tera template dependency for HTML rendering
2. A base HTML layout template with navigation
3. A dashboard page at /admin/dashboard showing subscriber count, confirmation rate, and recent signups
4. A subscriber list page at /admin/subscribers with name, email, and status
5. Basic auth middleware protecting the /admin routes (reuse existing auth if available)
6. Integration tests for the new routes

Use the AskUserQuestion tool!
```

"Use the AskUserQuestion tool!" will trigger interactive followup questions — Claude may ask about template engine preference, auth mechanism, pagination, etc. Answer the questions and Claude will create a plan accordingly.

When Claude's plan looks good, accept it and wait for implementation. This feature will touch:

- **New dependency** — Template engine (askama or tera) in Cargo.toml
- **New directory** — `templates/` with base layout and page templates
- **New handlers** — Dashboard and subscriber list routes in `src/routes/`
- **New middleware** — Basic auth guard for admin routes (or reuse existing)
- **Database queries** — Subscriber statistics and listing queries
- **Route wiring** — Register admin routes in the Actix-web app
- **Integration tests** — Tests with authenticated requests

You can continue to iterate. For example:

```
Add a subscriber detail view that shows the full confirmation history and email delivery status
```

---

## Step 7: Context Management

<!-- step: { "id": "step-7", "points": 10, "category": "core" } -->

After a while, Claude's context window can fill up with file contents, command outputs, and conversation history. This affects performance and can lead to slower responses.

### Check context usage

```
/context
```

This shows you how much of Claude's context window you're currently using, with a breakdown of what's consuming space.

### Compact or clear context when needed

```
/compact
```

This summarizes the conversation and clears older context while preserving key information.

(Don't run this now) You can also use `/clear` to completely reset the conversation. This is typically only useful when switching to an entirely different task.

These commands help you manage long sessions effectively without losing important context about your project.

---

## Step 8: Add Playwright MCP

<!-- step: { "id": "step-8", "points": 10, "category": "core" } -->

You just tested your new admin dashboard manually, but you can also ask Claude to test it with the Playwright MCP.

MCP (Model Context Protocol) servers give LLM models the ability to connect to external tools. One of the most popular MCP servers is Playwright, which gives Claude the ability to control a web browser.

To add the Playwright MCP, in Claude Code type `!` to enter bash mode, then:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Type `/context` to see how much context the Playwright MCP consumes. Knowing each MCP's context footprint helps you manage your budget — disable unused MCPs to free up space!

---

## Step 9: Use Playwright MCP to Test

<!-- step: { "id": "step-9", "points": 10, "category": "core" } -->

Before you can use the Playwright MCP, you need to restart Claude Code. Exit with `/exit` and restart with `claude`.

Ask Claude to use the MCP to test the new feature:

```
Use Playwright MCP to test the new admin dashboard:
  1. Start the app (cargo run)
  2. Navigate to localhost:8000/admin/dashboard with basic auth credentials
  3. Verify the dashboard shows subscriber statistics
  4. Navigate to the subscriber list page
  5. Verify the subscriber table displays correctly
  6. Take screenshots of the dashboard and subscriber list
```

Keep iterating as you see fit!

---

## Step 10: Commit Your Changes

<!-- step: { "id": "step-10", "points": 10, "category": "core" } -->

Once you are happy with your changes, ask Claude to perform Git operations:

```
Can you please commit the changes you've made in this branch?
```

Claude will review the changes, create an appropriate commit message, and commit to your `new_features` branch.

---

## Bonus: Run the Existing Test Suite

<!-- step: { "id": "bonus-run-test-suite", "points": 15, "category": "bonus" } -->

Ask Claude to run the full test suite and analyze any failures:

```
Run the full test suite with cargo test and summarize the results
```

This demonstrates Claude's ability to interpret Rust test output, compiler errors, and suggest fixes. Rust's test runner output includes compilation errors, test failures, and panic messages — all of which Claude can diagnose.

---

## Bonus: Create a Subagent

<!-- step: { "id": "bonus-create-subagent", "points": 15, "category": "bonus" } -->

Open the subagents interface by running:

```
/agents
```

Generate an agent with Claude by following the step-by-step guide.

**Example:** Try creating a **Rust Debugger Subagent** that can analyze borrow checker errors, lifetime issues, and type mismatch problems. Test it by asking Claude to call the Debugger Subagent explicitly.

---

## Bonus: Install a Plugin

<!-- step: { "id": "bonus-install-plugin", "points": 15, "category": "bonus" } -->

Claude Code supports plugins: custom collections of slash commands, agents, MCP servers, and hooks that install with a single command.

The AWS Solutions Library hosts a marketplace of plugins, which you can add:

```
/plugin marketplace add https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock
```

The EPCC (Explore-Plan-Code-Commit) plugin has 12 specialized agents for exploration, planning, coding, and commit phases:

```
/plugin install epcc-workflow
```

You can now type `/epcc` and see a list of available commands. Example:

```
/epcc-code Add an email delivery status tracking endpoint
```

---

## Bonus: Add a Code Formatting Hook

<!-- step: { "id": "bonus-add-formatting-hook", "points": 15, "category": "bonus" } -->

Rust includes a built-in code formatter (`rustfmt`). Install `jq` for JSON processing in the command line.

Use `/hooks` or add the hook configuration in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.rs$'; then rustfmt \"$file_path\" 2>/dev/null; fi; }"
          }
        ]
      }
    ]
  }
}
```

> **Note:** Restart your Claude Code session when you're done.

Test the hook by asking Claude Code to write a Rust function with intentionally poor formatting (e.g., inconsistent spacing, wrong indentation), save the file, and verify that `rustfmt` automatically formats it.

---

## Bonus: Further Edit CLAUDE.md

<!-- step: { "id": "bonus-further-edit-claude-md", "points": 15, "category": "bonus" } -->

Try creating CLAUDE.md files for specific modules:

```
Create a CLAUDE.md for the @src/routes/ module describing the handler patterns, error types, and middleware conventions
```

Ask Claude questions about implementation details you're curious about, and add additional context to the CLAUDE.md files as you see fit.

---

## Bonus: Create an Agent Skill

<!-- step: { "id": "bonus-create-agent-skill", "points": 15, "category": "bonus" } -->

Use `/skill-creator` to build a skill. Example:

```
/skill-creator
```

```
I want to build a skill that can analyze Actix-web handlers for proper error types, input validation, and ensure all handlers return appropriate HTTP status codes with structured error responses
```

Answer followup questions, let Claude build the skill, and test it.

---

## Bonus: Explore Additional MCP Servers

<!-- step: { "id": "bonus-explore-mcp-servers", "points": 15, "category": "bonus" } -->

View currently installed MCP servers:

```
/mcp
```

Explore additional MCP servers, install them, and test. Some useful ones for Rust development:

- **Database MCP** — Connect directly to the PostgreSQL database to inspect data and run queries
- **Docker MCP** — Manage containers for PostgreSQL and other dependencies

> **Note:** Restart your Claude Code session after installation for changes to take effect.
