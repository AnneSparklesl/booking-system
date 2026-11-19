# Booking System

A full-stack appointment booking app where customers can browse services, book time slots and manage their appointments.

## Tech stack
- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT

## Features
- Register and log in
- Browse services with prices and durations
- Book an available time slot
- View your appointments and their status
- [Add anything else that works, e.g. admin page]

## Screenshots
[Add screenshots here later]

## Run it locally
1. Clone the repo
2. Server:
   ```
   cd server
   npm install
   copy .env.example .env   (then fill in your own values)
   npx prisma migrate dev
   node app.js
   ```
3. Client (in a second terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## Author
Annie, [link to your GitHub profile]