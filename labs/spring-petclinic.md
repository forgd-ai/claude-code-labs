---
slug: spring-petclinic
title: "Claude Code Tutorial - Spring Petclinic"
description: "A step-by-step guide to use Claude Code with Spring Petclinic, the canonical Spring Boot sample application."
difficulty: intermediate
estimated_duration: "90 minutes"
prerequisites: ["Claude Code installed and set up", "Java 21+ installed", "Git installed"]
tags: [java, spring-boot, claude-code]
---

# Claude Code Tutorial - Spring Petclinic

A step-by-step guide to use Claude Code with Spring Petclinic, the canonical Spring Boot sample application. By the end, you'll understand how to use Claude Code for common Java/Spring development tasks.

### Troubleshooting

If Claude doesn't succeed initially:

- **Copy error logs directly into Claude** — Paste stack traces from your terminal output. Java stack traces are verbose — Claude handles them well.
- **Use screenshots** — Paste images directly into Claude (`Ctrl+V` on Mac, not `Cmd+V`) to show visual bugs or UI issues.
- **Iterate on prompts** — Refine your request based on what worked or didn't.

For complex problems:

- Prompt Claude to **"think harder"** or **"ultrathink"** to allocate more reasoning tokens.
- For Spring-specific issues, include the relevant `application.properties` or configuration context.

To debug Claude's actions:

- Type `Ctrl+O` to toggle the transcript view and see exactly what tools Claude is calling and what files it's reading.

### Common Java/Spring-Specific Tips

- If Maven builds are slow, ask Claude to use `-DskipTests` during development iterations and run tests separately.
- For database issues, point Claude to `localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:petclinic`).
- If you want to test with MySQL or PostgreSQL, ask Claude to start the containers with `docker compose up -d` and use the appropriate profile.

### Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Spring Petclinic on GitHub](https://github.com/spring-projects/spring-petclinic)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Claude Code Best Practices](https://www.anthropic.com/blog/claude-code-best-practices)

> **Pro Tip: Claude Code will ask for permission when it needs to:**
>
> - Modify files in your project
> - Run bash commands (Maven builds, tests, etc.)
> - Install new tools (like the Playwright MCP in Step 8)
>
> Press **Enter** to approve each action, or tell Claude what to do instead.
> (Advanced users can configure auto-approvals in `.claude/settings.json`)
>
> This keeps you in control of what happens in your codebase.

---

## Step 1: Clone Repository

<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Clone Spring Petclinic through one of two methods:

**Option 1: Git**

```bash
git clone https://github.com/spring-projects/spring-petclinic.git
cd spring-petclinic
git checkout -b new_features
```

**Option 2: Direct Download**

Download the [zip from GitHub](https://github.com/spring-projects/spring-petclinic/archive/refs/heads/main.zip), extract it, and navigate to the `spring-petclinic` directory in your terminal.

---

## Step 2: Launch Claude Code

<!-- step: { "id": "step-2", "points": 10, "category": "core" } -->

Start Claude Code and configure your model:

```bash
claude
```

Run `/model` to select your preferred model.

---

## Step 3: Run Spring Petclinic Locally

<!-- step: { "id": "step-3", "points": 10, "category": "core" } -->

Start the development server:

```
Build and run the Spring Petclinic application
```

Claude will run `./mvnw spring-boot:run`, which compiles the project and launches the app at `localhost:8080` as a background task (Ctrl+B). The embedded H2 database is automatically populated with sample data — no external database setup needed.

Keep the background task running. Explore the app for a few minutes:
- Browse the **Find Owners** page and search for owners
- View an owner's pets and visit history
- Check out the **Veterinarians** list
- Try the **Error** page to see Spring's error handling

---

## Step 4: Create and Edit the CLAUDE.md File

<!-- step: { "id": "step-4", "points": 10, "category": "core" } -->

Unlike the Excalidraw tutorial, Spring Petclinic does **not** have a CLAUDE.md file — so we'll create one. CLAUDE.md is a project-specific README for Claude Code that provides context about your codebase.

### Generate a CLAUDE.md with /init

Use the `/init` command to have Claude analyze your project and generate a first draft:

```
/init
```

Claude will scan the project structure, build files, and source code, then generate a `CLAUDE.md` at the project root. Review what it produces.

### Using @-file mentions

You can reference specific files in your prompts using `@filename`:

```
Print out exactly what is in @CLAUDE.md
```

### Three ways to edit CLAUDE.md

**1. Ask Claude to edit it directly:**

```
Edit my CLAUDE.md file to add "Always use constructor injection instead of field injection"
```

**2. Use # to enter Memory mode:**

In Claude Code, type `#` to enter Memory mode, then type:

```
Follow existing domain-package structure (owner/, vet/, system/) when adding new features
```

Save it to your **Project** memory (or **User**, if you want it to persist beyond this demo).

**3. Open the file directly in your editor and add guidelines such as:**

```
- Use Spring Data JPA repository interfaces, not custom implementations
- Write tests using @WebMvcTest for controllers and @DataJpaTest for repositories
- Always validate request inputs using Jakarta Bean Validation annotations
```

When you ask Claude Code for help later in this tutorial, it will reference this context automatically.

---

## Step 5: Explore the Codebase

<!-- step: { "id": "step-5", "points": 10, "category": "core" } -->

Let's explore the Spring Petclinic codebase by having Claude generate an architecture diagram. This is a great way to get oriented in a new project.

```
Using only the @CLAUDE.md and the source code, create a Mermaid class diagram showing the domain model (entities, their relationships, repositories, and controllers). Save it as architecture.md
```

Claude will analyze the codebase and generate a Mermaid diagram showing:
- Entities: `Owner`, `Pet`, `PetType`, `Visit`, `Vet`, `Specialty`
- Relationships: Owner → Pet → Visit, Vet → Specialty
- Spring layers: Controllers → Repositories → Entities

You can paste the Mermaid diagram into any Mermaid renderer (GitHub renders them natively in markdown, or use [mermaid.live](https://mermaid.live)) to visualize it.

---

## Step 6: Build a Feature

<!-- step: { "id": "step-6", "points": 10, "category": "core" } -->

Enter **Plan Mode** by pressing `Shift+Tab` until you see Plan mode (or type `/plan`). Plan mode lets Claude analyze the codebase and create a detailed implementation plan without making changes yet.

### The Feature: Pet Statistics Dashboard

Prompt Claude to add a statistics dashboard with a REST API:

```
Add a pet statistics feature with:
1. A REST API endpoint at /api/stats returning JSON with: most popular pet types, number of visits per month (last 12 months), and busiest veterinarians by visit count
2. A new "Statistics" page in the Thymeleaf UI (linked from the nav bar) that displays this data in a dashboard with simple HTML tables
3. A service layer to compute the statistics
4. Tests for the service, controller, and REST endpoint

Use the AskUserQuestion tool!
```

"Use the AskUserQuestion tool!" will trigger interactive followup questions — Claude may ask about charting libraries, date ranges, caching strategy, etc. Answer the questions and Claude will create a plan accordingly.

When Claude's plan looks good, accept it and wait for implementation. This feature will touch:

- **New entity/query layer** — Custom repository queries with `@Query` or Spring Data derived methods
- **New service** — `StatisticsService` with business logic
- **New REST controller** — `StatisticsRestController` returning JSON
- **New Thymeleaf controller** — `StatisticsController` serving the dashboard page
- **New template** — `statistics.html` with the dashboard layout
- **New tests** — `@WebMvcTest`, `@DataJpaTest`, and integration tests
- **Modified nav layout** — Add "Statistics" link to the navigation fragment

You can continue to iterate. For example:

```
Add caching to the statistics endpoint using Spring's @Cacheable with a 5-minute TTL
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

You just tested your new dashboard manually, but you can also ask Claude to test it with the Playwright MCP.

MCP (Model Context Protocol) servers give LLM models the ability to connect to external tools. One of the most popular MCP servers is Playwright, which gives Claude the ability to control a web browser.

To add the Playwright MCP, in Claude Code type `!` to enter bash mode, then:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Type `/context` to see how much context the Playwright MCP consumes. Knowing each MCP's context footprint helps you manage your budget — disable unused MCPs to free up space.

---

## Step 9: Use Playwright MCP to Test

<!-- step: { "id": "step-9", "points": 10, "category": "core" } -->

Before you can use the Playwright MCP, you need to restart Claude Code. Exit with `/exit` and restart with `claude`.

Ask Claude to use the MCP to test the new feature:

```
Use Playwright MCP to test the new statistics dashboard:
  1. Start the app (./mvnw spring-boot:run)
  2. Navigate to localhost:8080
  3. Click the Statistics link in the navigation
  4. Verify the dashboard shows pet type statistics and visit data
  5. Test the REST API at /api/stats and verify it returns valid JSON
  6. Take screenshots of the dashboard page
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
Run the full test suite with ./mvnw test and summarize the results
```

This demonstrates Claude's ability to interpret Maven test output, stack traces, and suggest fixes.

---

## Bonus: Create a Subagent

<!-- step: { "id": "bonus-create-subagent", "points": 15, "category": "bonus" } -->

Open the subagents interface by running:

```
/agents
```

Generate an agent with Claude by following the step-by-step guide.

**Example:** Try creating a **Spring Boot Debugger Subagent** that can analyze stack traces, check application.properties configuration, and identify common Spring Boot issues. Test it by asking Claude to call the Debugger Subagent explicitly.

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
/epcc-code Add a new Appointment entity with scheduling functionality
```

---

## Bonus: Add a Code Formatting Hook

<!-- step: { "id": "bonus-add-formatting-hook", "points": 15, "category": "bonus" } -->

Install [google-java-format](https://github.com/google/google-java-format) or use the project's existing Spring Java Format plugin.

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
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.java$'; then ./mvnw spring-javaformat:apply -q -pl . 2>/dev/null; fi; }"
          }
        ]
      }
    ]
  }
}
```

> **Note:** Restart your Claude Code session when you're done.

Test the hook by asking Claude Code to write a Java method with intentionally poor formatting, save it, and verify that Spring Java Format automatically formats it.

---

## Bonus: Further Edit CLAUDE.md

<!-- step: { "id": "bonus-further-edit-claude-md", "points": 15, "category": "bonus" } -->

Try creating CLAUDE.md files for specific packages:

```
Create a CLAUDE.md for the @owner/ package describing the domain model, validation rules, and controller patterns
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
I want to build a skill that can analyze a Spring Boot application, identify missing test coverage, and generate tests following the existing test patterns in the project
```

Answer followup questions, let Claude build the skill, and test it.

---

## Bonus: Explore Additional MCP Servers

<!-- step: { "id": "bonus-explore-mcp-servers", "points": 15, "category": "bonus" } -->

View currently installed MCP servers:

```
/mcp
```

Explore additional MCP servers, install them, and test. Some useful ones for Java development:

- **Database MCP** — Connect directly to the H2 database to inspect data
- **Docker MCP** — Manage containers for MySQL/PostgreSQL profiles

> **Note:** Restart your Claude Code session after installation for changes to take effect.
