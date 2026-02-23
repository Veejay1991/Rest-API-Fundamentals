---
name: jira-bug-fix
# Add an empty 'on' trigger to satisfy the GitHub Actions compiler
on:
  workflow_dispatch:
    inputs:
      branch:
        description: "Branch to checkout"
        required: true
        type: string
      description:
        description: "Jira bug description"
        required: true
        type: string
      issue_key:
        description: "Jira Issue Key"
        required: true
        type: string
description: Fixes a bug reported in Jira against a specific branch
engine: copilot
permissions:
  contents: read
  pull-requests: read
safe-outputs:
  create-pull-request: {}
---

# Instructions

You are currently on the branch where the bug exists.

1. Read the bug description: `${{ inputs.description }}`.
2. Analyze the code and implement a fix for the described issue.
3. Create a new local branch named `fix/${{ inputs.issue_key }}`.
4. `git add` and `git commit` your changes. (Do not change git user/email configurations).
5. Use the `create_pull_request` tool to open a Pull Request.
