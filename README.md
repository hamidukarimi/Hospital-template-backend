# Aura Hospital — Backend

Express API for the Aura Hospital website. It serves public content, accepts contact messages and appointment bookings, and exposes an authenticated admin API for managing the site.

## Stack

- Node.js with TypeScript (ES modules)
- Express 5
- PostgreSQL with Prisma 7 and the `pg` driver adapter
- JWT admin auth (`jsonwebtoken`) and bcrypt passwords
- Multer for image uploads
- Resend for appointment emails

The Prisma client is generated into `src/generated/prisma` (gitignored). Database URL and seed command live in `prisma7.config.ts`.

## Requirements

- Node.js 20 or newer
- A PostgreSQL database

## Setup

From this folder:

```bash
npm install
```

Create a `.env` file (it is gitignored) with the variables below, then:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
npm run dev
```

The server listens on `PORT`, or **5000** if that variable is unset. `GET /` returns `{ "message": "Hospital Website API is running" }`.

CORS allows `http://localhost:5173` and the deployed frontend at `https://hospital-template-iota.vercel.app`.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Signs admin tokens. The process exits if this is missing. |
| `ADMIN_SEED_PASSWORD` | For seed | Password hashed into the seeded admin user |
| `PORT` | No | HTTP port. Defaults to `5000`. |
| `RESEND_API_KEY` | For email | Resend API key. Appointment mail fails closed without it. |
| `RESEND_FROM_EMAIL` | For email | From address, for example `Aura Hospital <you@yourdomain.com>` |
| `PUBLIC_WEBSITE_URL` | No | Site origin used in email links |
| `PUBLIC_API_URL` | No | API origin used to absolute-ize logo URLs in email. `API_PUBLIC_URL` is accepted as an alias. |

Example:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/hospital_db
JWT_SECRET=replace-with-a-long-random-string
ADMIN_SEED_PASSWORD=replace-with-a-strong-password
PORT=5000
RESEND_API_KEY=
RESEND_FROM_EMAIL=
PUBLIC_WEBSITE_URL=http://localhost:5173
PUBLIC_API_URL=http://localhost:5000
```

Do not commit `.env`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Run `src/index.ts` with `tsx watch` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run `node dist/index.js` |

Prisma (always pass the config file in this repo):

```bash
npx prisma migrate dev --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
```

`migrate dev` is for local schema changes. `migrate deploy` applies existing migrations in `prisma/migrations`.

## Seed data

`prisma/seed.ts` upserts sample hospital content and one admin:

- Email: `admin@aurahospital.com`
- Password: the current `ADMIN_SEED_PASSWORD`
- Role: `ADMIN`

Existing admin rows are left unchanged on later seeds (`update: {}`).

## Auth

`POST /api/admin/login` checks email and password and returns a JWT. Tokens expire after **1 day** and must be sent as `Authorization: Bearer <token>`. `authenticateAdmin` rejects missing, invalid, or non-admin tokens. `GET /api/admin/me` returns the signed-in admin.

## API

JSON responses use `{ success, data }` or `{ success: false, message }`.

### Public

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/site-settings` | Hospital identity, phones, address, hours |
| `GET` | `/api/hero` | Home hero |
| `GET` | `/api/help` | Help section and cards |
| `GET` | `/api/about` | About page |
| `GET` | `/api/services` and `/api/services/:slug` | Services |
| `GET` | `/api/testimonials` | Testimonials |
| `GET` | `/api/why-choose-us` | Why choose us |
| `GET` | `/api/lab-tests` | Lab tests |
| `GET` | `/api/doctors` and `/api/doctors/:slug` | Doctors |
| `GET` | `/api/articles` and `/api/articles/:slug` | Articles |
| `GET` | `/api/faqs` | FAQs |
| `GET` | `/api/footer` | Footer settings, columns, and links |
| `GET` | `/api/navbar` | Navbar columns and links |
| `GET` | `/api/contact/contact/info` | Contact page info |
| `POST` | `/api/contact` | Save a contact submission |
| `GET` | `/api/appointments/doctors` | Doctors open for booking |
| `GET` | `/api/appointments/services` | Bookable services |
| `GET` | `/api/appointments/availability/:doctorId` | Open dates, or slots when `?date=YYYY-MM-DD` |
| `POST` | `/api/appointments` | Book an appointment |
| `GET` | `/api/appointments/:reference` | Look up a booking |
| `POST` | `/api/appointments/:reference/cancel` | Cancel a public booking |
| `POST` | `/api/uploads` | Upload one image (`multipart/form-data`, field name `image`, optional `category`) |

### Admin (Bearer token required, except login)

Mounted under `/api/admin`:

| Path | Purpose |
| --- | --- |
| `/login`, `/me` | Sign in and current admin |
| `/dashboard` | Dashboard counts |
| `/services` | Services |
| `/doctors` | Doctors |
| `/articles` | Articles |
| `/faqs` | FAQs |
| `/help-cards` | Help cards |
| `/testimonials` | Testimonials |
| `/why-choose-us` | Why choose us |
| `/lab-tests` | Lab tests |
| `/site-settings` | Site settings |
| `/about` | About content |
| `/social-media` | Social links |
| `/footer-settings`, `/footer-columns`, `/footer-links` | Footer |
| `/navbar-columns`, `/navbar-links` | Navbar |
| `/appointments` | List, update status, reschedule, cancel |
| `/doctor-schedules` | Weekly schedules, breaks, and blocked dates |

## Uploads

Files are stored on disk under `uploads/` and served at `/uploads`. Allowed categories are `hero`, `about`, `services`, `help`, `lab-tests`, `doctors`, `articles`, and `site`. Anything else is saved under `site`.

## Appointment email

On startup the server starts a worker that sends queued appointment emails (confirmed, rescheduled, cancelled) through Resend, with retries. `SIGINT` and `SIGTERM` stop the worker and close the HTTP server.

## Layout

```text
src/
  index.ts           App entry, CORS, routes
  routes/            Public and admin routers
  controllers/       Request handlers
  services/          Database and booking logic
  middleware/        Admin JWT check
  email/             Resend provider, templates, queue worker
  lib/               Prisma client and Multer storage
  utils/             JWT, passwords, hospital time helpers
prisma/
  schema.prisma      Models and enums
  migrations/        PostgreSQL migrations
  seed.ts            Sample content and admin user
prisma7.config.ts    Datasource URL and seed command
```
