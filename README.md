# Lumi

A modern OTT streaming platform built with **React**, **TypeScript**, and **Redux Toolkit**. Browse movies, TV shows, and live TV, create a personalized watchlist, write reviews, and manage content with role-based access control.

**Live Demo:** https://lumi-mocha.vercel.app/login

---

## Features

* Browse Movies, TV Shows, and Live TV
* Role-based access (Admin & Viewer)
* Personal watchlist (My List)
* Ratings and reviews
* Search movies, shows, and channels
* Genre, language, and category filters
* Light/Dark theme with persistent preferences
* Fully responsive design

---

## Authentication

* New users register as **Viewers**
* A seeded **Admin** manages content and user roles
* Sessions are persisted using `localStorage`

> **Demo Admin Credentials**
>
> **Username:** `Admin`
> **Password:** `admin123`

---

## Tech Stack

* React 18
* TypeScript
* Redux Toolkit
* React Router v6
* Axios
* Bootstrap 5
* Vite
* Vitest & React Testing Library
* json-server (Mock REST API)

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Project Structure

```text
src/
├── components/
├── hooks/
├── store/
├── styles/
├── types/
├── constants/
├── utils/
└── App.tsx
```

---

## Deployment

Deployed on **Vercel** with automatic deployments from the `main` branch.

---
