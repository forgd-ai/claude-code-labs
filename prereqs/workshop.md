---
title: Technical Prerequisites Checklist
subtitle: Claude Code Workshop
notice: Share with all registered attendees 2+ weeks before the workshop
---

## Required Setup

### Hardware

- [ ] Laptop (Mac or Windows with WSL enabled)

### Software

- [ ] Claude Code installed
- [ ] Claude Code tested and verified working
- [ ] Basic code editor (VS Code recommended but not required)
- [ ] Terminal/command line access verified
- [ ] Internet browser (Chrome, Firefox, or Safari)

### Network

- [ ] Check if corporate firewall might block Claude Code (contact IT if uncertain)
- [ ] Test Claude Code from a non-corporate network if firewall concerns exist
- [ ] Verify Google Meet works on your machine (camera and microphone tested)

### Account Setup

- [ ] Claude Console account created (individual or organization)
- [ ] Account type confirmed (individual vs. organization — affects setup)

### Skills

- Basic familiarity with command line/terminal is helpful
- Basic programming experience (any language) is helpful
- Willingness to troubleshoot and learn

## Installation Instructions

### Step 1: Install Claude Code

Follow the installation guide: [code.claude.com/docs/en/setup](https://code.claude.com/docs/en/setup)

### Step 2: Verify installation

Run claude in your terminal to get started:

```bash
claude
```

Authenticate via Claude Console account (alternatively, you can create an API key on the console and manually enter here).

### Step 3: Test basic functionality

Ask *'Hey Claude, tell me about how to use Claude Code?'*

## Common Setup Issues

### Corporate firewall blocking Claude Code

- **Solution:** Work with your IT team to allow-list Claude Code domains
- **Alternative:** Test on personal device or home network first
- **Backup plan:** Join the pre-workshop office hours for live troubleshooting

### Windows WSL not enabled

- **Solution:** Follow Windows WSL installation guide: [learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install)
- **Time required:** 30–45 minutes
- **Note:** Requires administrator access on your machine

### Account type confusion (individual vs. organization)

- **Solution:** Check your account settings at [console.anthropic.com/settings](https://console.anthropic.com/settings)
- **Difference:** Organization accounts may have additional security requirements

### Corrupted settings.json file

- **Solution:** Delete and regenerate settings file
- **Common on:** Windows systems
- **Prevention:** Don't manually edit settings.json unless necessary

## Recommended Preparation

- Review Claude Code documentation: [code.claude.com/docs](https://code.claude.com/docs)
- Identify a use case you'd like to explore during the workshop
- Prepare 2–3 questions about your specific implementation needs

## Night Before Workshop

- [ ] Claude Code tested and working within last 24 hours
- [ ] Google Meet link saved and tested
- [ ] Calendar reminder set
- [ ] Notebook for taking notes (optional)
