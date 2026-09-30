# RoomsForRent — Multi-Tenant Property Management SaaS

A production-ready Property Management SaaS application built with **Laravel**, **Inertia.js**, **React**, and **TypeScript**. Features automated billing pipelines, background queue workers, multi-channel notification architecture (Email + SMS), Inertia SSR support, and real-time operational metrics.

---

## Technical Stack & Infrastructure

- **Backend:** Laravel 11 / PHP 8.3
- **Frontend:** Inertia.js (with SSR) + React 18 + TypeScript + Tailwind CSS
- **Database:** MySQL 8.0
- **Caching & Queues:** Redis
- **Containerization:** Docker Compose (`app`, `queue`, `scheduler`, `redis`, `db`)

---

## Architectural Highlights

- **Automated Billing Pipeline:** Custom Artisan commands (`invoices:generate-monthly`) for recurring monthly invoice generation.
- **Background Reminders:** Daily scheduled task (`reminders:send`) to identify overdue payments and expiring leases, dispatching notifications asynchronously via Redis workers.
- **Decoupled Notification Architecture:** Extensible notification routing supporting Mail, Twilio SMS API, and a custom local development driver (`SmsLogChannel`).
- **Server-Side Rendering (SSR):** Powered by Inertia SSR Node service for optimized search engine visibility and fast initial page loads.
- **Multi-Tenant Room Occupancy Scoping:** Real-time occupancy tracking and revenue metrics scoped by property and room assignments.

---

## Quick Start (Docker One-Liner)

Run the entire application stack using Docker Compose:

```bash
docker compose up -d
docker compose exec app composer install
docker compose exec app npm install
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
docker compose exec app npm run build
