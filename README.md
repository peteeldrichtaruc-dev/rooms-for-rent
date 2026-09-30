# RoomsForRent — Multi-Tenant Property Management SaaS

A production-ready, high-performance Property Management SaaS built with **Laravel 13**, **Inertia.js**, and **React**. Designed with a decoupled multi-channel notification core, automated background billing pipelines, and server-side rendering (SSR) for robust scalability and optimal SEO.

---

## Core Architecture & Engineering Highlights

*   **Multi-Tenant Scoping:** Built-in tenant isolation for real-time room occupancy tracking, financial mapping, and localized revenue metrics.
*   **Automated Billing Pipelines:** Custom Artisan commands (`invoices:generate-monthly`) handle transactional logic for recurring monthly billing cycles.
*   **Asynchronous Background Workers:** Redis-backed scheduled tasks (`reminders:send`) run daily to automatically catch overdue invoices or lease expirations.
*   **Decoupled Notification Layer:** Extensible multi-channel notification architecture supporting Mail, Twilio SMS API, and a local mock driver (`SmsLogChannel`).
*   **Inertia SSR Engine:** Node-powered server-side rendering for lightning-fast initial page loads and deep crawlability.

---

## Technical Stack & Infrastructure

*   **Backend:** PHP 8.3 / Laravel 13
*   **Frontend:** React 18 / TypeScript / Tailwind CSS / Inertia.js (with SSR)
*   **Data & Caching:** PostgreSQL 18 / Redis
*   **Containerization:** Full multi-container Docker suite (`app`, `queue`, `scheduler`, `redis`, `db`)

---

## Quick Start (Docker Environment)

Spin up the entire local development environment including queues, scheduling workers, and database instances with the following steps:

### 1. Boot the Stack
```bash
docker-compose up -d --build
```

### 2. Standard Application Setup
```bash
# Dependencies & Environment
docker compose exec app composer install
docker compose exec app npm install
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate

# Database & Frontend Assets
docker compose exec app php artisan migrate --seed
docker compose exec app npm run build
```

---

## Useful Artisan Commands

*   **`php artisan invoices:generate-monthly`** — Manually execute the recurring billing engine.
*   **`php artisan reminders:send`** — Evaluate overdue payments and dispatch SMS/Email notifications.
