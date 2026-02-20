---
slug: flask-microblog
title: "Claude Code Tutorial - Flask Microblog"
description: "A step-by-step guide to use Claude Code with Flask Microblog, the canonical Flask sample application from the Flask Mega-Tutorial."
difficulty: beginner
estimated_duration: "75 minutes"
prerequisites: ["Claude Code installed and set up", "Python 3.10+ installed", "Git installed"]
tags: [python, flask, claude-code]
---

# Claude Code Tutorial - Flask Microblog

A step-by-step guide to use Claude Code with Flask Microblog, the canonical Flask sample application from the Flask Mega-Tutorial. By the end, you'll understand how to use Claude Code for common Python/Flask development tasks.

### Troubleshooting

If Claude doesn't succeed initially:

- **Copy error logs directly into Claude** — Paste tracebacks from your terminal output. Python tracebacks are descriptive — Claude handles them well.
- **Use screenshots** — Paste images directly into Claude (`Ctrl+V` on Mac, not `Cmd+V`) to show visual bugs or UI issues.
- **Iterate on prompts** — Refine your request based on what worked or didn't.

For complex problems:

- Prompt Claude to **"think harder"** or **"ultrathink"** to allocate more reasoning tokens.
- For Flask-specific issues, include the relevant route or error context.

To debug Claude's actions:

- Type `Ctrl+O` to toggle the transcript view and see exactly what tools Claude is calling and what files it's reading.

### Common Python/Flask Tips

- If `pip install` fails with permission errors, try `pip install --user -r requirements.txt` or use a virtual environment.
- Use `flask shell` to interactively debug database models and queries.
- Use `flask run --debug` for auto-reload during development.

### Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Flask Microblog on GitHub](https://github.com/miguelgrinberg/microblog)
- [The Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
- [Claude Code Best Practices](https://www.anthropic.com/blog/claude-code-best-practices)

> **Pro Tip: Claude Code will ask for permission when it needs to:**
>
> - Modify files in your project
> - Run bash commands (pip install, flask run, etc.)
> - Install new tools (like the Playwright MCP in Step 8)
>
> Press **Enter** to approve each action, or tell Claude what to do instead.
> (Advanced users can configure auto-approvals in `.claude/settings.json`)
>
> This keeps you in control of what happens in your codebase.

---

## Step 1: Clone Repository

<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Clone Flask Microblog through one of two methods:

**Option 1: Git**

```bash
git clone https://github.com/miguelgrinberg/microblog.git
cd microblog
git checkout -b new_features
```

**Option 2: Direct Download**

Download the [zip from GitHub](https://github.com/miguelgrinberg/microblog/archive/refs/heads/main.zip), extract it, and navigate to the `microblog` directory in your terminal.

---

## Step 2: Launch Claude Code

<!-- step: { "id": "step-2", "points": 10, "category": "core" } -->

Start Claude Code and configure your model:

```bash
claude
```

Run `/model` to select your preferred model.

---

## Step 3: Run Flask Microblog Locally

<!-- step: { "id": "step-3", "points": 10, "category": "core" } -->

Start the development server:

```
Set up a Python virtual environment, install the requirements, and run the Flask app
```

Claude will create a virtual environment, install dependencies from `requirements.txt`, and launch the app at `localhost:5000` by running `flask run` as a background task (`Ctrl+B`). Keep the background task running.

Explore the app for a few minutes:
- **Register** a new account and log in
- **Write a post** and see it on your timeline
- **Explore** the user profile pages
- Try the **search** functionality

---

## Step 4: Create and Edit the CLAUDE.md File

<!-- step: { "id": "step-4", "points": 10, "category": "core" } -->

Flask Microblog does **not** have a CLAUDE.md file — so we'll create one. CLAUDE.md is a project-specific README for Claude Code that provides context about your codebase.

### Generate a CLAUDE.md with /init

Use the `/init` command to have Claude analyze your project and generate a first draft:

```
/init
```

Claude will scan the project structure, Flask blueprints, and source code, then generate a `CLAUDE.md` at the project root. Review what it produces.

### Using @-file mentions

You can reference specific files in your prompts using `@filename`:

```
Print out exactly what is in @CLAUDE.md
```

### Three ways to edit CLAUDE.md

**1. Ask Claude to edit it directly:**

```
Edit my CLAUDE.md file to add "Always use Flask-WTF for form handling and CSRF protection"
```

**2. Use # to enter Memory mode:**

In Claude Code, type `#` to enter Memory mode, then type:

```
Follow existing blueprint structure (auth/, main/) when adding new features
```

Save it to your **Project** memory (or **User**, if you want it to persist beyond this demo).

**3. Open the file directly in your editor and add guidelines such as:**

```
- Use Flask-Migrate for all database schema changes
- Write tests using pytest and the app test client
- Always validate form inputs using Flask-WTF validators
```

When you ask Claude Code for help later in this tutorial, it will reference this context automatically.

---

## Step 5: Explore the Codebase

<!-- step: { "id": "step-5", "points": 10, "category": "core" } -->

Let's explore the Flask Microblog codebase by having Claude generate an architecture diagram. This is a great way to get oriented in a new project.

```
Using only the @CLAUDE.md and the source code, create a Mermaid diagram showing the application architecture: Flask blueprints, SQLAlchemy models and their relationships, forms, and template structure. Save it as architecture.md
```

Claude will analyze the codebase and generate a Mermaid diagram showing:
- Models: `User`, `Post`, `Message`, `Notification`, `Task`
- Relationships: User → Posts, User → Messages, follower associations
- Blueprints: `auth`, `main`, `errors`
- Template inheritance and form classes

You can paste the Mermaid diagram into any Mermaid renderer (GitHub renders them natively in markdown, or use [mermaid.live](https://mermaid.live)) to visualize it.

---

## Step 6: Build a Feature

<!-- step: { "id": "step-6", "points": 10, "category": "core" } -->

Enter **Plan Mode** by pressing `Shift+Tab` until you see Plan mode (or type `/plan`). Plan mode lets Claude analyze the codebase and create a detailed implementation plan without making changes yet.

### The Feature: User Profile Bio Page

Prompt Claude to add a user profile bio feature:

```
Add a user profile bio feature with:
1. A new "bio" text field on the User model with a database migration
2. An "Edit Profile" page where users can update their bio and about me section
3. Display the bio prominently on the user profile page
4. A Flask-WTF form with validation (max 500 characters)
5. Tests for the new route, form validation, and model changes

Use the AskUserQuestion tool!
```

"Use the AskUserQuestion tool!" will trigger interactive followup questions — Claude may ask about markdown support, character limits, visibility settings, etc. Answer the questions and Claude will create a plan accordingly.

When Claude's plan looks good, accept it and wait for implementation. This feature will touch:

- **Model change** — New field on `User` with Alembic migration
- **New form** — `EditProfileForm` with Flask-WTF validators
- **New route** — `/edit_profile` in the main blueprint
- **Modified template** — Updated `user.html` to display bio
- **New template** — `edit_profile.html` with form
- **Tests** — Model, form, and route tests

You can continue to iterate. For example:

```
Add markdown rendering for the bio field so users can format their text with bold, italic, and links
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

You just tested your new profile bio feature manually, but you can also ask Claude to test it with the Playwright MCP.

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
Use Playwright MCP to test the new profile bio feature:
  1. Start the Flask app (flask run)
  2. Navigate to localhost:5000
  3. Register a new user and log in
  4. Navigate to the Edit Profile page
  5. Enter a bio and save it
  6. Verify the bio appears on the user profile page
  7. Take screenshots of the profile page
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
Run the test suite with pytest and summarize the results
```

This demonstrates Claude's ability to interpret Python test output, tracebacks, and suggest fixes.

---

## Bonus: Create a Subagent

<!-- step: { "id": "bonus-create-subagent", "points": 15, "category": "bonus" } -->

Open the subagents interface by running:

```
/agents
```

Generate an agent with Claude by following the step-by-step guide.

**Example:** Try creating a **Flask Debugger Subagent** that can analyze tracebacks, check Flask configuration, and identify common Flask/SQLAlchemy issues. Test it by asking Claude to call the Debugger Subagent explicitly.

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
/epcc-code Add a direct messaging feature between users
```

---

## Bonus: Add a Code Formatting Hook

<!-- step: { "id": "bonus-add-formatting-hook", "points": 15, "category": "bonus" } -->

Install `jq` for JSON processing and [Black](https://github.com/psf/black) for Python formatting:

```bash
pip install black
```

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
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.py$'; then black --quiet \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

> **Note:** Restart your Claude Code session when you're done.

Test the hook by asking Claude Code to write a Python function with intentionally poor formatting (e.g., inconsistent spacing, long lines), save the file, and verify that Black automatically formats it.

---

## Bonus: Further Edit CLAUDE.md

<!-- step: { "id": "bonus-further-edit-claude-md", "points": 15, "category": "bonus" } -->

Try creating CLAUDE.md files for specific packages:

```
Create a CLAUDE.md for the @app/main/ blueprint describing the routes, template patterns, and form handling conventions
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
I want to build a skill that can analyze Flask routes for missing input validation and automatically generate Flask-WTF form validators for unprotected endpoints
```

Answer followup questions, let Claude build the skill, and test it.

---

## Bonus: Explore Additional MCP Servers

<!-- step: { "id": "bonus-explore-mcp-servers", "points": 15, "category": "bonus" } -->

View currently installed MCP servers:

```
/mcp
```

Explore additional MCP servers, install them, and test. Some useful ones for Python development:

- **Database MCP** — Connect directly to the SQLite database to inspect data
- **Docker MCP** — Manage containers for running services like Redis or Elasticsearch

> **Note:** Restart your Claude Code session after installation for changes to take effect.
