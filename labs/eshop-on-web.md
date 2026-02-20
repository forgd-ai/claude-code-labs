---
slug: eshop-on-web
title: "Claude Code Tutorial - eShopOnWeb"
description: "A step-by-step guide to use Claude Code with eShopOnWeb, Microsoft's official ASP.NET Core reference application."
difficulty: intermediate
estimated_duration: "90 minutes"
prerequisites: ["Claude Code installed and set up", ".NET 8 SDK installed", "Git installed"]
tags: [dotnet, aspnet-core, claude-code]
---

# Claude Code Tutorial - eShopOnWeb

A step-by-step guide to use Claude Code with eShopOnWeb, Microsoft's official ASP.NET Core reference application. By the end, you'll understand how to use Claude Code for common .NET/ASP.NET Core development tasks.

### Troubleshooting

If Claude doesn't succeed initially:

- **Copy error logs directly into Claude** — Paste compiler errors or stack traces from your terminal output. .NET error messages are detailed — Claude handles them well.
- **Use screenshots** — Paste images directly into Claude (`Ctrl+V` on Mac, not `Cmd+V`) to show visual bugs or UI issues.
- **Iterate on prompts** — Refine your request based on what worked or didn't.

For complex problems:

- Prompt Claude to **"think harder"** or **"ultrathink"** to allocate more reasoning tokens.
- For ASP.NET-specific issues, include the relevant configuration or middleware context.

To debug Claude's actions:

- Type `Ctrl+O` to toggle the transcript view and see exactly what tools Claude is calling and what files it's reading.

### Common .NET/ASP.NET Tips

- Run `dotnet --info` to verify your SDK version matches the project's `global.json` requirements.
- Use `dotnet watch run --project src/Web` for hot reload during development.
- The app defaults to SQL Server LocalDB, but we'll configure it to use an **in-memory database** for this workshop — no external database setup needed.
- If restore fails, try `dotnet nuget locals all --clear` to clear the NuGet cache.

### Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [eShopOnWeb on GitHub](https://github.com/NimblePros/eShopOnWeb)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Claude Code Best Practices](https://www.anthropic.com/blog/claude-code-best-practices)

> **Pro Tip: Claude Code will ask for permission when it needs to:**
>
> - Modify files in your project
> - Run bash commands (dotnet build, dotnet test, etc.)
> - Install new tools (like the Playwright MCP in Step 8)
>
> Press **Enter** to approve each action, or tell Claude what to do instead.
> (Advanced users can configure auto-approvals in `.claude/settings.json`)
>
> This keeps you in control of what happens in your codebase.

---

## Step 1: Clone Repository

<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Clone eShopOnWeb through one of two methods:

**Option 1: Git**

```bash
git clone https://github.com/NimblePros/eShopOnWeb.git
cd eShopOnWeb
git checkout -b new_features
```

**Option 2: Direct Download**

Download the [zip from GitHub](https://github.com/NimblePros/eShopOnWeb/archive/refs/heads/main.zip), extract it, and navigate to the `eShopOnWeb` directory in your terminal.

---

## Step 2: Launch Claude Code

<!-- step: { "id": "step-2", "points": 10, "category": "core" } -->

Start Claude Code and configure your model:

```bash
claude
```

Run `/model` to select your preferred model.

---

## Step 3: Run eShopOnWeb Locally

<!-- step: { "id": "step-3", "points": 10, "category": "core" } -->

First, configure the app to use an in-memory database so you don't need SQL Server:

```
Add "UseOnlyInMemoryDatabase": true to src/Web/appsettings.json, then restore dependencies and run the web application
```

Claude will add the in-memory database setting to `appsettings.json`, run `dotnet restore`, then `dotnet run --project src/Web`, which compiles the project and launches the app at `https://localhost:5001` as a background task (`Ctrl+B`). The in-memory database is automatically seeded with sample catalog data.

> **Note:** Without the `UseOnlyInMemoryDatabase` setting, the app defaults to SQL Server LocalDB which may not be available on your system. The in-memory option is perfect for this workshop.

Keep the background task running. Explore the app for a few minutes:
- Browse the **product catalog** and filter by brand or type
- Add items to the **shopping basket**
- View the **checkout** flow
- Log in with the default admin credentials shown in the README

---

## Step 4: Create and Edit the CLAUDE.md File

<!-- step: { "id": "step-4", "points": 10, "category": "core" } -->

eShopOnWeb does **not** have a CLAUDE.md file — so we'll create one. CLAUDE.md is a project-specific README for Claude Code that provides context about your codebase.

### Generate a CLAUDE.md with /init

Use the `/init` command to have Claude analyze your project and generate a first draft:

```
/init
```

Claude will scan the project structure, solution files, and source code, then generate a `CLAUDE.md` at the project root. Review what it produces.

### Using @-file mentions

You can reference specific files in your prompts using `@filename`:

```
Print out exactly what is in @CLAUDE.md
```

### Three ways to edit CLAUDE.md

**1. Ask Claude to edit it directly:**

```
Edit my CLAUDE.md file to add "Always use the repository pattern through interfaces in ApplicationCore"
```

**2. Use # to enter Memory mode:**

In Claude Code, type `#` to enter Memory mode, then type:

```
Follow Clean Architecture layers: ApplicationCore has no dependencies, Infrastructure depends on ApplicationCore, Web depends on both
```

Save it to your **Project** memory (or **User**, if you want it to persist beyond this demo).

**3. Open the file directly in your editor and add guidelines such as:**

```
- Use EF Core migrations for all schema changes
- Write tests using xUnit with the existing test infrastructure
- Always use specification pattern for complex queries (see BaseSpecification)
```

When you ask Claude Code for help later in this tutorial, it will reference this context automatically.

---

## Step 5: Explore the Codebase

<!-- step: { "id": "step-5", "points": 10, "category": "core" } -->

Let's explore the eShopOnWeb codebase by having Claude generate an architecture diagram. This is a great way to get oriented in a new project.

```
Using only the @CLAUDE.md and the source code, create a Mermaid diagram showing the Clean Architecture layers: ApplicationCore (entities, interfaces, specifications), Infrastructure (EF Core, repositories, identity), and Web (controllers, Razor pages, view models). Save it as architecture.md
```

Claude will analyze the codebase and generate a Mermaid diagram showing:
- Entities: `CatalogItem`, `CatalogBrand`, `CatalogType`, `Basket`, `Order`
- Clean Architecture layers and their dependencies
- Repository pattern: Interfaces → EF Core implementations
- Service layer: `BasketService`, `OrderService`

You can paste the Mermaid diagram into any Mermaid renderer (GitHub renders them natively in markdown, or use [mermaid.live](https://mermaid.live)) to visualize it.

---

## Step 6: Build a Feature

<!-- step: { "id": "step-6", "points": 10, "category": "core" } -->

Enter **Plan Mode** by pressing `Shift+Tab` until you see Plan mode (or type `/plan`). Plan mode lets Claude analyze the codebase and create a detailed implementation plan without making changes yet.

### The Feature: Product Reviews & Ratings

Prompt Claude to add a product review system:

```
Add a product reviews and ratings feature with:
1. A new Review entity in ApplicationCore with rating (1-5 stars), title, body, and reviewer name
2. An EF Core migration to add the reviews table
3. A Razor partial view on the product detail page showing reviews and an average star rating
4. A form to submit new reviews with model validation and anti-forgery tokens
5. A service layer following the existing repository/specification pattern
6. Tests for the service, specifications, and page model

Use the AskUserQuestion tool!
```

"Use the AskUserQuestion tool!" will trigger interactive followup questions — Claude may ask about moderation, pagination, anonymous reviews, etc. Answer the questions and Claude will create a plan accordingly.

When Claude's plan looks good, accept it and wait for implementation. This feature will touch:

- **New entity** — `Review` in ApplicationCore with relationships to `CatalogItem`
- **New specification** — Query reviews by product with filtering
- **New migration** — EF Core migration for the reviews table
- **New service** — `ReviewService` with business logic
- **Razor partial views** — Star rating display and review form
- **Modified product detail page** — Include the reviews section
- **Tests** — xUnit tests for service, specification, and page model

You can continue to iterate. For example:

```
Add pagination to the reviews list showing 5 reviews per page with next/previous links
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

You just tested your new reviews feature manually, but you can also ask Claude to test it with the Playwright MCP.

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
Use Playwright MCP to test the new product reviews feature:
  1. Start the app (dotnet run --project src/Web)
  2. Navigate to localhost:5001
  3. Browse the catalog and click on a product
  4. Submit a new review with a 5-star rating
  5. Verify the review appears on the product detail page
  6. Check that the average rating updates correctly
  7. Take screenshots of the product page with reviews
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
Run the full test suite with dotnet test and summarize the results
```

This demonstrates Claude's ability to interpret .NET test output, compiler errors, and suggest fixes.

---

## Bonus: Create a Subagent

<!-- step: { "id": "bonus-create-subagent", "points": 15, "category": "bonus" } -->

Open the subagents interface by running:

```
/agents
```

Generate an agent with Claude by following the step-by-step guide.

**Example:** Try creating an **ASP.NET Core Debugger Subagent** that can analyze stack traces, check middleware configuration, and identify common EF Core or dependency injection issues. Test it by asking Claude to call the Debugger Subagent explicitly.

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
/epcc-code Add a wishlist feature to the catalog
```

---

## Bonus: Add a Code Formatting Hook

<!-- step: { "id": "bonus-add-formatting-hook", "points": 15, "category": "bonus" } -->

.NET includes a built-in code formatter. Install `jq` for JSON processing in the command line.

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
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.cs$'; then dotnet format --include \"$file_path\" 2>/dev/null; fi; }"
          }
        ]
      }
    ]
  }
}
```

> **Note:** Restart your Claude Code session when you're done.

Test the hook by asking Claude Code to write a C# method with intentionally poor formatting (e.g., inconsistent spacing, wrong indentation), save the file, and verify that `dotnet format` automatically formats it.

---

## Bonus: Further Edit CLAUDE.md

<!-- step: { "id": "bonus-further-edit-claude-md", "points": 15, "category": "bonus" } -->

Try creating CLAUDE.md files for specific project layers:

```
Create a CLAUDE.md for the @src/ApplicationCore/ project describing the entity model, specification pattern, and interface conventions
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
I want to build a skill that can find Razor pages lacking model validation or anti-forgery tokens and automatically add the appropriate data annotations and security attributes
```

Answer followup questions, let Claude build the skill, and test it.

---

## Bonus: Explore Additional MCP Servers

<!-- step: { "id": "bonus-explore-mcp-servers", "points": 15, "category": "bonus" } -->

View currently installed MCP servers:

```
/mcp
```

Explore additional MCP servers, install them, and test. Some useful ones for .NET development:

- **Database MCP** — Connect directly to the SQL Server or SQLite database to inspect data
- **Docker MCP** — Manage containers for running SQL Server or other dependencies

> **Note:** Restart your Claude Code session after installation for changes to take effect.
