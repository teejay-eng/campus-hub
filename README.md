# Compass Hub

**Navigate Your Campus. Shape Your Future.**

Compass Hub is a full-stack university student portal built with Next.js (App Router), MySQL, Prisma, Tailwind CSS, and secure role-based authentication. It connects students with accommodation, academic resources, grades, events, and profile management, while giving administrators full CRUD control over campus data.

## Technologies

- **Next.js** (App Router) — JavaScript
- **MySQL** — relational database
- **Prisma ORM** — schema, migrations, seeding
- **NextAuth.js** — JWT sessions, credentials provider
- **bcryptjs** — password hashing
- **Tailwind CSS** — responsive UI
- **Lucide React** — icons

## Features

### Public

- Landing page with hero, carousel, about, dynamic upcoming events, contact form, footer
- Secure login (email or student ID)

### Admin (`/admin`)

- Dashboard statistics
- Students, hostels, events, reading materials, grades (full CRUD, search/filter)
- Automatic grade letter from marks (configurable in `lib/grading.js`)

### Student (`/student`)

- Dashboard, profile editing (restricted fields), accommodation, events, materials, grades, academic history

### Security

- Hashed passwords, protected routes, role-based middleware and API checks
- Secrets via environment variables (see `.env.example`)

---

## Project structure

```
compass-hub/
├── app/
│   ├── api/              # REST API routes
│   ├── admin/            # Admin pages
│   ├── student/          # Student pages
│   ├── login/
│   ├── layout.js
│   ├── page.js           # Landing page
│   └── globals.css
├── components/           # Reusable UI
├── lib/                  # Prisma, auth, grading, helpers
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── middleware.js
├── .env.example
└── README.md
```

---

## Installation

```bash
cd campusHub
npm install

> **Note:** This project uses **Prisma 6.x** (CLI and `@prisma/client` pinned together). Avoid mixing Prisma 7/8 RC with the client unless you upgrade both and update the schema config.
```

## Environment variables

Copy the example file and edit values:

```bash
cp .env.example .env
```

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `DATABASE_URL` | MySQL connection string                          |
| `AUTH_SECRET`  | Session signing secret (32+ random bytes)        |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`)         |

Generate a secret:

```bash
openssl rand -base64 32
```

## Database setup

1. Create a MySQL database:

```sql
CREATE DATABASE compass_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Set `DATABASE_URL` in `.env`, for example:

```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/compass_hub"
```

## Prisma setup

```bash
npm run db:generate
npm run db:migrate
# or: npm run db:push
npm run db:seed
```

## Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo credentials (development only)

> **Do not use these in production.**

| Role    | Email / ID              | Password     |
|---------|-------------------------|--------------|
| Admin   | `admin@compasshub.com`  | `Admin@123`  |
| Student | `amina.okoro@student.compasshub.edu` or `CH2024001` | `Student@123` |
| Student | `james.mbeki@student.compasshub.edu` or `CH2023008` | `Student@123` |
| Student | `sarah.chen@student.compasshub.edu` or `CH2024015` | `Student@123` |

After login, admins redirect to `/admin` and students to `/student`.

---

## Testing the main features

1. **Admin login** — Add a hostel or event; confirm it appears on the landing page events section.
2. **Add student** — `/admin/students` → Add Student with password; verify MySQL records.
3. **Student login** — Use the new student email; check dashboard, grades, materials.
4. **Grades** — Admin adds a grade; student sees it under My Grades and Academic History.
5. **CRUD delete** — Delete an event or material and confirm it is removed from the UI and database.

---

## Scripts

| Command            | Description                |
|--------------------|----------------------------|
| `npm run dev`      | Development server         |
| `npm run build`    | Production build           |
| `npm run start`    | Start production server    |
| `npm run db:generate` | Generate Prisma client  |
| `npm run db:migrate`  | Run migrations           |
| `npm run db:seed`     | Seed demo data           |

---

© 2026 Compass Hub — Final-year style campus management demo.
