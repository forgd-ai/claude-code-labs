---
slug: go-realworld
title: "Claude Code Tutorial - Go RealWorld (Gin)"
description: "A step-by-step guide to use Claude Code with the Go/Gin RealWorld example app, the Gin implementation of the RealWorld/Conduit spec."
difficulty: intermediate
estimated_duration: "90 minutes"
prerequisites: ["Claude Code installed and set up", "Go 1.21+ installed", "Git installed"]
tags: [go, gin, claude-code]
---

# Claude Code Tutorial - Go RealWorld (Gin)

A step-by-step guide to use Claude Code with the Go/Gin RealWorld example app. This is an API-only application — you'll use Claude Code to add HTML views on top of it. By the end, you'll understand how to use Claude Code for common Go web development tasks.

### Troubleshooting

If Claude doesn't succeed initially:

- **Copy error logs directly into Claude** — Paste compiler errors from your terminal output. Go errors are concise — paste the full output for best results.
- **Use screenshots** — Paste images directly into Claude (`Ctrl+V` on Mac, not `Cmd+V`) to show visual bugs or UI issues.
- **Iterate on prompts** — Refine your request based on what worked or didn't.

For complex problems:

- Prompt Claude to **"think harder"** or **"ultrathink"** to allocate more reasoning tokens.
- For Go-specific issues, include the relevant error context and package imports.

To debug Claude's actions:

- Type `Ctrl+O` to toggle the transcript view and see exactly what tools Claude is calling and what files it's reading.

### Common Go/Gin Tips

- Run `go mod tidy` to resolve dependency issues — this adds missing and removes unused modules.
- Go compiler errors are concise — always paste the full output to Claude for best results.
- Use `go vet ./...` to catch common mistakes that the compiler doesn't flag.
- If port 8080 is already in use, check for existing processes or change the port in the configuration.

### Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Go RealWorld on GitHub](https://github.com/gothinkster/golang-gin-realworld-example-app)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [Go html/template Documentation](https://pkg.go.dev/html/template)
- [Claude Code Best Practices](https://www.anthropic.com/blog/claude-code-best-practices)

> **Pro Tip: Claude Code will ask for permission when it needs to:**
>
> - Modify files in your project
> - Run bash commands (go build, go test, etc.)
> - Install new tools (like the Playwright MCP in Step 8)
>
> Press **Enter** to approve each action, or tell Claude what to do instead.
> (Advanced users can configure auto-approvals in `.claude/settings.json`)
>
> This keeps you in control of what happens in your codebase.

---

## Step 1: Clone Repository

<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Clone the Go RealWorld app through one of two methods:

**Option 1: Git**

```bash
git clone https://github.com/gothinkster/golang-gin-realworld-example-app.git
cd golang-gin-realworld-example-app
git checkout -b new_features
```

**Option 2: Direct Download**

Download the [zip from GitHub](https://github.com/gothinkster/golang-gin-realworld-example-app/archive/refs/heads/master.zip), extract it, and navigate to the `golang-gin-realworld-example-app` directory in your terminal.

---

## Step 2: Launch Claude Code

<!-- step: { "id": "step-2", "points": 10, "category": "core" } -->

Start Claude Code and configure your model:

```bash
claude
```

Run `/model` to select your preferred model.

---

## Step 3: Run Go RealWorld Locally

<!-- step: { "id": "step-3", "points": 10, "category": "core" } -->

Start the development server:

```
Download Go dependencies and run the application using go run hello.go
```

Claude will run `go mod download` followed by `go run hello.go`, which compiles and launches the API server at `localhost:8080` as a background task (`Ctrl+B`). The app uses SQLite by default — no external database setup needed.

Keep the background task running. Since this is an API-only app, test it with curl:
- `curl localhost:8080/api/ping/` — Health check (returns `{"message":"pong"}`)
- `curl localhost:8080/api/articles` — List articles
- `curl localhost:8080/api/tags` — List tags

> **Note:** This is an API-only application — there's no web UI yet. In Step 6, you'll use Claude Code to add HTML views!

---

## Step 4: Create and Edit the CLAUDE.md File

<!-- step: { "id": "step-4", "points": 10, "category": "core" } -->

This project does **not** have a CLAUDE.md file — so we'll create one. CLAUDE.md is a project-specific README for Claude Code that provides context about your codebase.

### Generate a CLAUDE.md with /init

Use the `/init` command to have Claude analyze your project and generate a first draft:

```
/init
```

Claude will scan the project structure, Go modules, and source code, then generate a `CLAUDE.md` at the project root. Review what it produces.

### Using @-file mentions

You can reference specific files in your prompts using `@filename`:

```
Print out exactly what is in @CLAUDE.md
```

### Three ways to edit CLAUDE.md

**1. Ask Claude to edit it directly:**

```
Edit my CLAUDE.md file to add "Always handle errors explicitly — never use _ to discard errors"
```

**2. Use # to enter Memory mode:**

In Claude Code, type `#` to enter Memory mode, then type:

```
Follow existing package structure (articles/, users/, common/) when adding new features
```

Save it to your **Project** memory (or **User**, if you want it to persist beyond this demo).

**3. Open the file directly in your editor and add guidelines such as:**

```
- Use Gin's context methods for request/response handling
- Write table-driven tests following Go conventions
- Always validate and sanitize user input in handler functions
```

When you ask Claude Code for help later in this tutorial, it will reference this context automatically.

---

## Step 5: Explore the Codebase

<!-- step: { "id": "step-5", "points": 10, "category": "core" } -->

Let's explore the Go RealWorld codebase by having Claude generate an architecture diagram. This is a great way to get oriented in a new project.

```
Using only the @CLAUDE.md and the source code, create a Mermaid diagram showing the application architecture: Gin router setup, handler packages, GORM models and their relationships, middleware chain, and the RealWorld API endpoints. Save it as architecture.md
```

Claude will analyze the codebase and generate a Mermaid diagram showing:
- Models: `UserModel`, `ArticleModel`, `TagModel`, `CommentModel`
- Relationships: User → Articles, Article → Comments, Article → Tags
- Package structure: routers, handlers, models, middleware
- API endpoints grouped by resource

You can paste the Mermaid diagram into any Mermaid renderer (GitHub renders them natively in markdown, or use [mermaid.live](https://mermaid.live)) to visualize it.

---

## Step 6: Build a Feature

<!-- step: { "id": "step-6", "points": 10, "category": "core" } -->

Enter **Plan Mode** by pressing `Shift+Tab` until you see Plan mode (or type `/plan`). Plan mode lets Claude analyze the codebase and create a detailed implementation plan without making changes yet.

### The Feature: HTML Article Viewer & Search Page

This app is API-only — let's add a web UI! Prompt Claude to add HTML views:

```
Add an HTML article viewer and search page with:
1. Go html/template files in a templates/ directory with a base layout
2. A homepage at / that lists recent articles with titles, descriptions, and tags
3. An article detail page at /articles/:slug showing the full article with comments
4. A search/filter page at /search that lets users filter articles by tag
5. Gin handlers that serve these HTML pages using data from the existing models
6. Tests for the new HTML handlers

Use the AskUserQuestion tool!
```

"Use the AskUserQuestion tool!" will trigger interactive followup questions — Claude may ask about CSS framework, pagination, template engine choice, etc. Answer the questions and Claude will create a plan accordingly.

When Claude's plan looks good, accept it and wait for implementation. This feature will touch:

- **New directory** — `templates/` with base layout and page templates
- **New handlers** — HTML-serving handlers using `html/template`
- **Route wiring** — New Gin routes for `/`, `/articles/:slug`, `/search`
- **Static assets** — Basic CSS for styling the HTML pages
- **Modified router** — Register new HTML routes alongside existing API routes
- **Tests** — HTTP handler tests verifying HTML responses

You can continue to iterate. For example:

```
Add a tag cloud sidebar to the homepage showing the most popular tags with article counts
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

You just tested your new HTML pages manually, but you can also ask Claude to test them with the Playwright MCP.

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
Use Playwright MCP to test the new HTML article viewer:
  1. Start the app (go run hello.go)
  2. Navigate to localhost:8080
  3. Verify the homepage shows a list of articles
  4. Click on an article and verify the detail page renders
  5. Navigate to the search page and filter articles by a tag
  6. Verify the filtered results are correct
  7. Take screenshots of each page
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
Run the full test suite with go test ./... -v and summarize the results
```

This demonstrates Claude's ability to interpret Go test output, compiler errors, and suggest fixes.

---

## Bonus: Create a Subagent

<!-- step: { "id": "bonus-create-subagent", "points": 15, "category": "bonus" } -->

Open the subagents interface by running:

```
/agents
```

Generate an agent with Claude by following the step-by-step guide.

**Example:** Try creating a **Go Debugger Subagent** that can analyze compiler errors, check module dependencies, and identify common Go concurrency or error-handling issues. Test it by asking Claude to call the Debugger Subagent explicitly.

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
/epcc-code Add user authentication with JWT middleware
```

---

## Bonus: Add a Code Formatting Hook

<!-- step: { "id": "bonus-add-formatting-hook", "points": 15, "category": "bonus" } -->

Go includes a built-in code formatter (`gofmt`). Install `jq` for JSON processing in the command line.

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
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.go$'; then gofmt -w \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

> **Note:** Restart your Claude Code session when you're done.

Test the hook by asking Claude Code to write a Go function with intentionally poor formatting (e.g., inconsistent spacing, wrong indentation), save the file, and verify that `gofmt` automatically formats it.

---

## Bonus: Further Edit CLAUDE.md

<!-- step: { "id": "bonus-further-edit-claude-md", "points": 15, "category": "bonus" } -->

Try creating CLAUDE.md files for specific packages:

```
Create a CLAUDE.md for the @articles/ package describing the handler patterns, model relationships, and validation conventions
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
I want to build a skill that can identify Go handlers lacking proper error handling or input validation and generate appropriate error checks and validation code
```

Answer followup questions, let Claude build the skill, and test it.

---

## Bonus: Explore Additional MCP Servers

<!-- step: { "id": "bonus-explore-mcp-servers", "points": 15, "category": "bonus" } -->

View currently installed MCP servers:

```
/mcp
```

Explore additional MCP servers, install them, and test. Some useful ones for Go development:

- **Database MCP** — Connect directly to the SQLite database to inspect data
- **Docker MCP** — Manage containers for running databases or other services

> **Note:** Restart your Claude Code session after installation for changes to take effect.
