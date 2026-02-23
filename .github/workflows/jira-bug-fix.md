---
name: jira-bug-fix
# Add an empty 'on' trigger to satisfy the GitHub Actions compiler
on:
  workflow_dispatch:
description: Fixes a bug reported in Jira against a specific branch
engine: copilot # Uses your GHE Copilot license
permissions:
  contents: read
  pull-requests: read
safe-outputs:
  create-pull-request: {}
---

# Instructions

1. Check out the branch provided: `${{ env.AGENT_PAYLOAD.branch }}`.
2. Read the bug description: `${{ env.AGENT_PAYLOAD.description }}`.
3. Analyze the code in the branch and implement a fix for the described issue.
4. Create a new branch named `bugfix/${{ env.AGENT_PAYLOAD.issue_key }}`.
5. Commit the changes and open a Pull Request against the original testing branch.
