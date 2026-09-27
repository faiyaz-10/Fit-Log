# FitLog — Workout Library & Plan Tracker

<p align="center">
	<strong>Train with intent. Log every set.</strong><br />
	A focused workout library for discovering exercises and building a daily plan.
</p>

<p align="center">
	<a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.3.6-black?logo=next.js" alt="Next.js 16.3.6" /></a>
	<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2.8-149eca?logo=react&logoColor=white" alt="React 19.2.8" /></a>
	<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
	<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" /></a>
</p>

FitLog is a responsive, dark-themed workout library and personal planning application built with Next.js. Users can browse API-powered workouts, inspect detailed exercise information, create a five-workout daily plan, save exercises for later, and track completion from one focused interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [How It Works](#how-it-works)
- [API](#api)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Responsive Design](#responsive-design)
- [Future Improvements](#future-improvements)

<a id="overview"></a>

## 🔎 Overview

FitLog is designed around a simple workout workflow:

1. Discover workouts in the library.
2. Search by workout name or category and sort the visible results.
3. Open a workout to review its specifications and instructions.
4. Add workouts to Today's Plan or save them for later.
5. Manage planned and saved workouts from the My Plan page.
6. Mark planned workouts as done or remove them when needed.

Plan, saved, and completion state are restored from browser `localStorage` after a reload.

<a id="key-features"></a>

## ✨ Key Features

- **🏋️ Workout Library** — Browse a responsive card-based collection loaded from the FitLog API.
- **🔎 Search & Sort** — Search by workout name or category, then sort by Duration, Calories, or Rating.
- **📋 Today's Plan** — Build a daily plan with a maximum capacity of five workouts.
- **💾 Saved Workouts** — Save workouts for later and manage them from the My Plan page.
- **✅ Workout Completion** — Mark planned workouts as done with immediate visual feedback.
- **🗑️ Plan Management** — Remove planned or saved workouts independently.
- **📊 Plan Metrics** — View live totals for Exercises, Minutes, and Calories in Today's Plan.
- **🔔 Toast Notifications** — Receive feedback for add, save, duplicate, completion, removal, and full-plan actions.
- **💿 Local Persistence** — Preserve plan, saved, and completion state with browser `localStorage`.
- **🔗 Workout Details** — Review equipment, difficulty, sets, reps, duration, calories, rating, and instructions on a dedicated route.
- **📱 Responsive Interface** — Use the library and plan views across mobile, tablet, and desktop layouts.
- **⚡ Loading & Error States** — Includes API loading feedback, failed-request handling, and a custom 404 page.

<a id="technologies-used"></a>

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | App Router framework, page routing, rendering, and image handling |
| [React 19](https://react.dev/) | Component-based user interface and client-side interactions |
| [TypeScript](https://www.typescriptlang.org/) | Static typing for application and API data |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling and responsive layouts |
| [DaisyUI](https://daisyui.com/) | Tailwind CSS plugin included in the project styling setup |
| `next/font` | Loads the Oswald, Inter, and Bebas Neue display typography used by the interface |
| React Context | Shared plan, saved, completion, readiness, and toast state |
| Browser `localStorage` | Client-side persistence for the current FitLog session |
| FitLog API | Supplies the workout collection and individual workout records |

<a id="how-it-works"></a>

## ⚙️ How It Works

The home page fetches workouts from the API and derives the visible list from the current search and sort selections. Selecting a workout opens `/workout/[id]`, where it can be added to Today's Plan or saved for later.

The shared `Store` provider keeps plan, saved, completed, and toast state available to the navbar and application pages. The My Plan page derives its metrics from the current plan and persists changes to `localStorage` without requiring a server account.

<a id="api"></a>

## 🔌 API

FitLog currently uses the following API base URL:

- [All workouts](https://api.api-store.workers.dev/api/fitlog) — returns the workout collection used by the home library.
- [Single workout](https://api.api-store.workers.dev/api/fitlog/:id) — returns one workout record for the detail page.

The client normalizes supported field-name variations from the API into the app's `Workout` type before rendering.

<a id="project-structure"></a>

## 📁 Project Structure

```text
Fit-Log/
├── app/
│   ├── globals.css              # Global Tailwind theme and shared styles
│   ├── layout.tsx               # Root layout, fonts, provider, navbar, and footer
│   ├── not-found.tsx            # Custom 404 page
│   ├── page.tsx                 # Workout library, search, and sorting
│   ├── my-plan/page.tsx         # Plan/saved tabs, metrics, search, and actions
│   └── workout/[id]/page.tsx    # Workout detail page
├── assets/                      # Local logo and banner images
├── components/
│   ├── Footer.tsx               # Site footer
│   ├── Navbar.tsx               # Navigation and live plan counters
│   ├── stats.tsx                # Reusable workout statistics display
│   └── store.tsx                # Shared state, persistence, and toast system
├── lib/
│   └── api.ts                   # API client, Workout type, and data normalizer
├── public/                      # Public static assets
├── next.config.ts               # Next.js image configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # Tailwind PostCSS configuration
└── tsconfig.json                # TypeScript configuration
```

<a id="getting-started"></a>

## 🚀 Getting Started

### Prerequisites

- Node.js with npm
- Network access to the FitLog API

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

<a id="available-scripts"></a>

## 📦 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server after building |
| `npm run lint` | Runs ESLint across the project |

<a id="responsive-design"></a>

## 📱 Responsive Design

The application uses responsive Tailwind layouts throughout the library, detail, and My Plan views:

- One-column layouts on small screens
- Two-column card grids on medium screens
- Three-column workout library on large screens
- Responsive navigation, controls, images, and plan actions

<a id="future-improvements"></a>

## 🔮 Future Improvements

- Add authenticated profiles and server-side plan synchronization.
- Add richer filtering by equipment, difficulty, and muscle group.
- Replace remaining raw workout-row images with optimized `next/image` usage.
- Add automated component and interaction tests.

---

Built as a Programming Hero assignment with a focused, practical workout-planning workflow.
