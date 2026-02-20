---
slug: excalidraw
title: "Claude Code Tutorial - Excalidraw"
description: "A step-by-step guide to use Claude Code with Excalidraw, an open-source diagramming tool."
difficulty: beginner
estimated_duration: "75 minutes"
prerequisites: ["Claude Code installed and set up", "Node.js 18+ installed", "npm installed", "Git installed"]
tags: [typescript, react, claude-code]
---

### Troubleshooting

If Claude doesn't succeed initially:

- **Copy error logs directly into Claude** — Paste error logs from your terminal output.
- **Use screenshots** — Paste images directly into Claude (`Ctrl+V` on Mac, not `Cmd+V`) to show visual bugs or UI issues.
- **Iterate on prompts** — Refine your request based on what worked or didn't.

For complex problems:

- Prompt Claude to **"think harder"** or **"ultrathink"** to allocate more reasoning tokens.

To debug Claude's actions:

- Type `Ctrl+O` to toggle the transcript view and see exactly what tools Claude is calling and what files it's reading.

### Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Video Course](https://docs.anthropic.com/en/docs/claude-code/tutorials)
- [Claude Code Best Practices](https://www.anthropic.com/blog/claude-code-best-practices)

> **Pro Tip: Claude Code will ask for permission when it needs to:**
>
> - Modify files in your project
> - Run bash commands
> - Install new tools (like the Playwright MCP in Step 8)
>
> Press **Enter** to approve each action, or tell Claude what to do instead.
> (Advanced users can configure auto-approvals in `.claude/settings.json`)
>
> This keeps you in control of what happens in your codebase.

---

## Step 1: Clone Repository
<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Clone Excalidraw, a sample project, through one of two methods:

**Option 1: Git**

```bash
git clone git@github.com:excalidraw/excalidraw.git
cd excalidraw
git checkout -b new_features
```

**Option 2: Direct Download**

Download the [zip from GitHub](https://github.com/excalidraw/excalidraw/archive/refs/heads/master.zip), extract it, and navigate to the `excalidraw` directory in your terminal.

---

## Step 2: Launch Claude Code
<!-- step: { "id": "step-2", "points": 10, "category": "core" } -->

Start Claude Code and configure your model:

```bash
claude
```

Run `/model` to select your preferred model.

---

## Step 3: Run Excalidraw Locally
<!-- step: { "id": "step-3", "points": 10, "category": "core" } -->

Start the development server:

```
Install yarn and run the development server
```

Claude will install yarn and other necessary dependencies, then launch the app at `localhost:3000` by running `yarn start` as a background task (`Ctrl+B`). Keep the background task running.

Explore the app for a few minutes.

---

## Step 4: Edit the CLAUDE.md File
<!-- step: { "id": "step-4", "points": 10, "category": "core" } -->

Excalidraw includes a CLAUDE.md file at the root — a project-specific README for Claude Code. For repos without a CLAUDE.md, use the `/init` command to generate a first draft (don't need to run it now).

### Using @-file mentions

You can reference specific files in your prompts using `@filename`.

Ask Claude to show you the repo's existing CLAUDE.md file, to get a summary of the Excalidraw repo structure and development workflow:

```
Print out exactly what is in @CLAUDE.md
```

You can also find this file in the root of your repo and open it in the text editor of your choice.

### Three ways to edit CLAUDE.md

**1. Ask Claude to edit it directly:**

```
Edit my CLAUDE.md file to add "Always document non-obvious logic changes with comments"
```

**2. Use # to enter Memory mode:**

In Claude Code, type `#` to enter Memory mode, then type:

```
Always document non-obvious logic changes with comments
```

Save it to your **Project** memory (or **User**, if you want it to persist beyond this demo).

**3. Open the file directly in your editor and add guidelines.**

When you ask Claude Code for help later in this tutorial, it will reference this context automatically.

---

## Step 5: Explore the Codebase
<!-- step: { "id": "step-5", "points": 10, "category": "core" } -->

Let's explore the Excalidraw codebase by having Claude generate an architecture diagram. This is a great way to get oriented in a new project.

In the case of Excalidraw, you can ask Claude to create a diagram in the form of a `.excalidraw` file, which is JSON containing geometric elements and their relationships:

```
Use only the @CLAUDE.md #Project structure section, create a .excalidraw file based of this repo's architecture, with labels and arrows showcasing dependencies
```

Claude will generate a new file with the `.excalidraw` file extension. You can ask Claude to open the folder where the new file is:

```
Open the folder where the new .excalidraw file is for me
```

You can then drag this into your local Excalidraw app to visualize it.

---

## Step 6: Build a Feature
<!-- step: { "id": "step-6", "points": 10, "category": "core" } -->

Enter **Plan Mode** by pressing `Shift+Tab` twice to cycle through permission modes. Plan mode lets Claude analyze the codebase and create detailed implementation plans without making changes yet.

Prompt Claude to change the top toolbar color:

```
Make the main top toolbar background animate through rainbow colors.

Use the AskUserQuestion tool!
```

"Use the AskUserQuestion tool!" will trigger interactive followup questions. Answer the questions and Claude will make changes accordingly.

When Claude's plans look good, accept them and wait for it to finish — then test out your new toolbar!

You can continue to iterate on the plan further. For example:

```
Let's make the animation speed / cycle time 1 second so it goes super fast.
```

---

## Step 7: Context Management
<!-- step: { "id": "step-7", "points": 10, "category": "core" } -->

After a while, Claude's context window can fill up with file contents, command outputs, and conversation history. This affects performance and can lead to slower responses or context pollution.

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

You just tested your new toolbar manually, but you can also ask Claude to test it with the Playwright MCP.

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

Ask Claude to use the MCP we just installed or type `/mcp` to see installed servers:

```
Use Playwright MCP to test the new toolbar:
  1. Start the dev server (yarn start)
  2. Navigate to localhost:3000
  3. Click the new toolbar and take a new screenshot
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

## Bonus: Create a Subagent
<!-- step: { "id": "bonus-1", "points": 15, "category": "bonus" } -->

Open the subagents interface by running:

```
/agents
```

Generate an agent with Claude by following the step-by-step guide.

**Example:** Try creating a **Debugger Subagent**. Test it by asking Claude to call the Debugger Subagent explicitly.

---

## Bonus: Install a Plugin
<!-- step: { "id": "bonus-2", "points": 15, "category": "bonus" } -->

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
/epcc-code Add a new heart shape to the top toolbar
```

You'll notice that it plans out the feature very carefully as if it's writing a product spec — this is helpful for "systematic development".

---

## Bonus: Add a Code Formatting Hook
<!-- step: { "id": "bonus-3", "points": 15, "category": "bonus" } -->

Install `jq` for JSON processing in the command line.

Install Prettier:

```bash
npm install --save-dev prettier
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
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.tsx?$'; then npx prettier --write \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

> **Note:** Restart your Claude Code session when you're done.

Test the hook by asking Claude Code to make an intentional formatting change (e.g. add extra spaces or remove indentation), save the file and verify that Prettier automatically formats it.

---

## Bonus: Further Edit CLAUDE.md
<!-- step: { "id": "bonus-4", "points": 15, "category": "bonus" } -->

Try creating a CLAUDE.md file for each subdirectory within `excalidraw/excalidraw-app` (e.g. app-language, collab, components).

You cannot use `/init` to generate CLAUDE.md files within a subdirectory, but you can prompt Claude to:

```
Create a CLAUDE.md for the @components/ subdirectory
```

Ask Claude questions about implementation details you're curious about, and add additional context to the CLAUDE.md files as you see fit.

---

## Bonus: Create an Agent Skill
<!-- step: { "id": "bonus-5", "points": 15, "category": "bonus" } -->

Use `/skill-creator` to build a skill:

```
/skill-creator
```

Example:

```
I want to build a skill that can open a .excalidraw file, analyze it, and iterate to improve the architecture diagram by fixing issues like overlapping arrows, inconsistent spacing, and missing labels
```

Answer followup questions, let Claude build the skill, and test it.

---

## Bonus: Explore Additional MCP Servers
<!-- step: { "id": "bonus-6", "points": 15, "category": "bonus" } -->

View currently installed MCP servers:

```
/mcp
```

Explore additional MCP servers, install them, and test.

> **Note:** Restart your Claude Code session after installation for changes to take effect.
