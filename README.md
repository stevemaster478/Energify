# Energy Consumption Calculator (MERN)

This repository contains a **full‑stack MERN example** that exposes a simple API for computing electrical energy consumption and a responsive, multi‑language web frontend built with **Next.js** and **Tailwind CSS**.  The goal of this project is to demonstrate how to assemble a lightweight application that makes it easy to estimate annual and monthly energy usage and to run simulations with different parameters.  It also illustrates common best practices for performance, accessibility and internationalisation.

## Features

- **MERN architecture**: the backend is an Express/Node application with optional MongoDB integration (via Mongoose).  It provides a `/api/calculate` endpoint that accepts input parameters and returns monthly and annual energy consumption figures.  Results can optionally be persisted via the `/api/simulations` endpoint.
- **Next.js frontend**: the client is a Next.js application built with React and Tailwind CSS.  It uses server‑side rendering (SSR) by default and is ready for deployment on platforms like Vercel.  Tailwind’s `dark` class is used to implement a dark/light theme toggle.
- **Internationalisation (i18n)**: the UI supports English, Italian and Arabic.  A language selector allows users to change the interface language at runtime.  Text direction automatically changes for right‑to‑left (RTL) languages such as Arabic.
- **Energy calculator**: users can input power consumption (in watts), hours of use per day, number of days per month, number of months per year and energy cost (€/kWh).  The form computes annual and monthly energy consumption as well as estimated costs.  Extra fields are provided for simulation scenarios.
- **Dark/light theme**: a toggle in the header lets the user switch between dark and light modes.  The preference is stored in local storage so the selection persists across sessions.
- **Performance considerations**: the application is intentionally minimalist.  The Next.js pages use static assets where possible, compress CSS using PostCSS and enable caching headers via Vercel configuration (when deployed).  Form logic runs on the client, avoiding unnecessary round‑trips.

## Getting Started

These instructions assume you have [Node.js](https://nodejs.org) installed.  Clone this repository and install the dependencies for both the backend and the frontend:

```bash
git clone <this‑repo>
cd energify

cd backend
npm install

cd ../frontend
npm install
```

### Running the backend

The Express server exposes two API routes: `/api/calculate` for stateless calculations and `/api/simulations` for storing or retrieving saved simulations in MongoDB.  The latter route requires a valid MongoDB URI in an `.env` file.  To start the server in development mode:

```bash
cd backend

# copy the example environment variables
cp .env.example .env

# edit .env to set MONGO_URI if you want to enable persistence
npm start
```

By default the server listens on port `5000`.  You can test the calculation API with `curl`:

```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{ "power": 100, "hoursPerDay": 5, "daysPerMonth": 30, "monthsPerYear": 12, "costPerKwh": 0.25 }'

# Response:
{ "monthlyKwh": 15, "annualKwh": 180, "monthlyCost": 3.75, "annualCost": 45 }
```

If `MONGO_URI` is configured, POSTing to `/api/simulations` will also save the simulation to MongoDB.

### Running the frontend

The frontend is a Next.js project configured for Tailwind, dark/light mode and multilingual support.  In development you can start it like this:

```bash
cd frontend
npm run dev

# open http://localhost:3000 in your browser
```

By default the frontend expects the API server to run on `http://localhost:5000`.  If your backend runs on a different port or domain, update the `NEXT_PUBLIC_API_BASE_URL` environment variable in `frontend/.env.local`.

### Deployment

Deploy the frontend to Vercel by connecting the `frontend` directory as the root of your project.  Vercel will detect the Next.js framework automatically.  For the backend you can use a separate service (e.g. Vercel Serverless Functions, Render, Railway) or container.  Be sure to set environment variables for `MONGO_URI` and `NEXT_PUBLIC_API_BASE_URL` accordingly.

## Testing

To test the frontend quickly without configuring MongoDB, simply run both servers locally and navigate to the application in your browser.  The energy calculator will work offline using only the `/api/calculate` endpoint.  You can also inspect the dark/light and language toggles.  For a production‑like test on Vercel, push the `frontend` directory to a Git repository and import it into Vercel.

## Project structure

```
energify/
├── backend/
│   ├── server.js          # Express API server
│   ├── models/
│   │   └── Simulation.js  # Mongoose model for persisted simulations
│   ├── package.json       # Backend dependencies and scripts
│   └── .env.example       # Example environment variables
└── frontend/
    ├── pages/
    │   ├── _app.jsx       # Global styles and providers
    │   └── index.jsx      # Main calculator page
    ├── components/
    │   ├── CalculatorForm.jsx
    │   ├── LanguageContext.js
    │   ├── LanguageSelector.jsx
    │   └── ThemeToggle.jsx
    ├── public/
    │   └── locales/
    │       ├── en/translation.json
    │       ├── it/translation.json
    │       └── ar/translation.json
    ├── styles/
    │   └── globals.css    # Tailwind CSS imports
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json       # Frontend dependencies and scripts
```