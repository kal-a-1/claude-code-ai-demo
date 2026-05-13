# ProTrack

ProTrack is a demo project tracker app built using **Claude Code** to show how AI can build a full-stack application from scratch with minimal manual coding.

## About

The goal of this project is not the app itself — it's to demonstrate what Claude Code can do.

## What's Being Demonstrated

- Vibe Coding
- Agent Workflows
- Custom Commands
- MCP Servers
- Building an MCP Server
- LLM Integration

## Built With

- **Frontend** — Vite, React, React Query, Zustand
- **Backend** — NestJS, Prisma, SQLite
- **Monorepo** — NX Workspace
- **AI** — Claude Code, Anthropic API

---

## Getting Started

### Install

```bash
nvm use
npm install
```

### Environment setup

```bash
cp apps/track-api/.env.example apps/track-api/.env
cp apps/track-web/.env.example apps/track-web/.env.local
```

### Database setup (first time)

```bash
cd apps/track-api
npx prisma migrate dev --name init
cd ../..
```

### Run locally

```bash
npm run dev
```

Access the app through <http://localhost:4200>

---

> This project was built almost entirely by Claude Code. Human input was mostly prompts.

---
