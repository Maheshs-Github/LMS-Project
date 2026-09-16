# LMS — Learning Management System

A full-stack learning management platform with dual instructor/student roles,
course delivery, real-time features, and certification — built to get
hands-on with production-level backend patterns beyond typical CRUD apps.

![screenshot](path/to/screenshot.png)

## Why This Project

Most learning projects stop at "CRUD app with auth." This one is deliberately
scoped to force harder problems: real-time updates across users (Socket.io),
role-based content and progress tracking that differs meaningfully between
instructors and students, and a certification flow that has to be
consistent and verifiable — not just a static PDF generator.

## Features

- **Instructor role**: course creation and content management, student
  progress visibility
- **Student role**: course browsing, progress tracking, certification upon
  completion
- **Real-time**: Socket.io-powered live updates (e.g. progress/notifications)
- **Certification**: automated certificate generation on course completion

## Architecture
Client (React) → REST API (Express) → MongoDB
↓
Socket.io (real-time layer)


## Tech Stack

**Currently implemented:** React · Node.js · Express · MongoDB · Socket.io
**In progress:** Docker (containerized deployment) · Redis (caching/session
layer) · LangGraph-based AI features (planned integration)

## Getting Started

```bash
git clone <repo-url>
cd lms
npm install
npm run dev
```

Environment variables needed: `.env.example` provided.

## Challenges & Learnings

Building the dual-role system required rethinking how progress and content
visibility differ between instructors and students without duplicating
logic across two separate dashboards — this shaped the current data model
around role-scoped queries rather than role-specific collections.

## Roadmap

- [ ] Dockerize the full stack for consistent deployment
- [ ] Add Redis for session/caching layer
- [ ] Integrate LangGraph-based AI features (e.g. course Q&A assistant)
- [ ] Expand certification flow (verifiable certificate links)

## License

MIT
