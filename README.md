# EmailShopping — Server

REST API for **EmailShopping**, a marketplace where buyers and sellers register, sign in
(email/password or Google), and manage order inquiries that are delivered by email.

Built with Node.js, Express, PostgreSQL (Sequelize) and Passport. Written by hand
(no AI assistance) as an early full-stack project.

## Features

- Buyer and seller registration flows with bcrypt-hashed passwords
- Sign-in with email + password (JWT sessions)
- Google OAuth 2.0 sign-in for buyers and sellers (Passport strategies)
- Order inquiries persisted to PostgreSQL and delivered by email (AWS SES)
- Sequelize models + migrations for a relational schema

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Server | Express 4 |
| Database | PostgreSQL via Sequelize 6 (+ `sequelize-cli` migrations) |
| Auth | Passport (local, JWT, Google OAuth 2.0), bcryptjs |
| Email | `@aws-sdk/client-ses` (Amazon SES, eu-west-2) |

## Project layout

```
app.js                 # Express entrypoint (port 5000)
passport-config.js     # Passport strategies (local + Google JWT)
config/                # Sequelize config
migrations/            # SQL schema migrations
models/                # Sequelize models (users, orders)
routes/
  buyer-registration.js
  seller-registration.js
  sign-in.js
  order-inquiry.js
  buyer-google-auth.js
  seller.google.auth.js
  user.js
```

## API overview

| Method | Route | Purpose |
|---|---|---|
| POST | `/buyer-registration` | Register a buyer |
| POST | `/seller-registration` | Register a seller |
| POST | `/sign-in` | Email + password sign-in |
| POST | `/auth/*` | Google OAuth exchange (buyer/seller) |
| GET/POST | `/` | Order inquiry handling |
| GET | `/user` | Authenticated user profile |

## Getting started

```bash
npm install
cp .env.example .env        # fill in database + credentials
npx sequelize-cli db:migrate
npm run dev                 # http://localhost:5000
```

### Environment variables

See `.env.example`. Never commit your real `.env`.

| Variable | Purpose |
|---|---|
| `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_DIALECT` | PostgreSQL connection |
| `JWT_SECRET` | Signs session tokens |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `REGION`, `ACCESSKEY`, `SECRETACCESSKEY` | Amazon SES (email delivery) |
| `EMAILSENDER` | Verified SES sender address |

## Notes

- The client app lives in the companion repo: `emailshoppingclient`.
- Email is the core interaction channel: buyers send order inquiries, the server persists
  them and notifies the seller via SES.
