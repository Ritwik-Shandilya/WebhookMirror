# Development Workflow

This document tracks progress on the WebhookMirror project derived from the provided PRD.

## Checklist

### Purpose
- [x] Enable developers to receive, inspect and debug HTTP requests without a server.

### Target Users
- [ ] Backend/API Developers
- [ ] QA Engineers
- [ ] DevOps Professionals
- [ ] Webhook Integrators

### Key Features
- [x] Unique Request Endpoints (UUID URLs, custom URLs, temporary/persistent modes, subdomain support)
- [x] Request Logging (real-time capture, HTTP data, syntax highlighting, history up to 1000 requests)
- [ ] Request Inspector with tabs and export options
- [ ] Filtering & Search capabilities
- [ ] Temporary Email Inbox
- [ ] DNS Endpoint logging
- [ ] Security & Access Control options

### Pages & Routes
- [ ] `/` Landing page
- [ ] `/docs`
- [ ] `/pricing`
- [ ] `/login` and `/signup`
- [ ] `/dashboard`
- [ ] `/endpoint/:uuid`
- [ ] `/endpoint/:uuid/settings`
- [ ] `/endpoint/:uuid/inspector/:requestId`
- [ ] `/admin/users`
- [ ] `/admin/requests`

### Component Architecture
- [ ] Global Components (Header, Footer, Sidebar, etc.)
- [ ] Endpoint Page Components (RequestList, FilterPanel, RequestInspector, etc.)
- [ ] Settings Components
- [ ] Email Inbox Components

### APIs
- [x] `POST /api/endpoints` – Create endpoint
- [x] `GET /api/endpoints/:id/requests` – Fetch all requests
- [x] `GET /api/requests/:id` – Fetch single request

### Technologies
- [x] Frontend: React + TypeScript, TailwindCSS, ShadCN, Socket.IO
- [x] Backend: Ruby on Rails, PostgreSQL, Redis, Sidekiq
- [ ] Optional Integrations: Stripe, Auth0, Postmark, Cloudflare

### Security Considerations
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] Encryption at rest
- [ ] Abuse detection

### Milestones
- [ ] MVP Launch
- [ ] Inbox & DNS features
- [ ] Teams & Sharing

### Success Metrics
- [ ] Time to first log (<3s)
- [ ] Daily active endpoints
- [ ] Average session duration

## Progress Notes
- Initialized repository with backend (Rails API) and frontend (React + Vite) skeletons.
- Set up basic project structure with backend and frontend folders.
- Implemented basic `/api/endpoints` POST route returning a generated UUID.
- Attempted `bundle install` which failed due to missing gems.
- Ran `npm install` for the frontend to verify dependencies.
- Completed `bundle install` successfully after adding gems.
- Generated `Endpoint` and `Request` models with ActiveRecord migrations.
- Added request capture route matching `/:uuid` that stores incoming HTTP requests.
- Implemented `GET /api/endpoints/:id/requests` and `GET /api/requests/:id` APIs.
- Created basic React page to create an endpoint and display its URL.
