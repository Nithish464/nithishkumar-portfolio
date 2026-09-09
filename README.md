# Nithishkumar K — Premium Portfolio

A modern, responsive developer portfolio built with **Next.js 14** and **TypeScript**, featuring a premium dark UI, smooth animated hover states, a featured projects showcase, experience & skills timeline, and a live GitHub repository browser.

🔗 **Live Site:** [nithishkumar-portfolio-egvb.vercel.app](https://nithishkumar-portfolio-egvb.vercel.app)

---

## Features

- Built with Next.js 14 App Router + TypeScript
-  Premium dark-themed, fully responsive UI
-  Smooth animated hover states and transitions
-  Featured projects, experience, education & skills sections
-  Live GitHub repository browser (fetches repos at runtime via the public GitHub API)
-  Downloadable resume button
-  Deployed on Vercel with continuous deployment from `main`

---

## Tech Stack

| Category   | Technology |
|------------|-----------|
| Framework  | Next.js 14 |
| Language   | TypeScript |
| UI Library | React 18 |
| Hosting    | Vercel |

---

##  Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Nithish464/nithishkumar-portfolio.git
cd nithishkumar-portfolio/nithish-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

##  Project Structure

```
nithish-portfolio/
├── app/                  # Next.js App Router pages & layout
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── data/                 # Portfolio content (profile, projects, skills, experience)
│   └── portfolio.ts
├── public/               # Static assets (images, resume)
│   ├── profile.jpg
│   └── resume.pdf
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

##  Configuration

Update the following to personalize the portfolio:

- **`data/portfolio.ts`** — profile details, featured projects, skills, experience, and education
- **`public/profile.jpg`** — your profile photo
- **`public/resume.pdf`** — add your resume to activate the Resume button
- **LinkedIn URL** — replace the placeholder link in `data/portfolio.ts` with your real profile URL

---

##  Deployment

This project is deployed on **Vercel**.

1. Push your changes to the `main` branch on GitHub
2. Vercel automatically detects the push and triggers a new build
3. Once the build succeeds, changes go live at the production URL

To deploy your own copy:

```bash
npm install -g vercel
vercel
```

> **Note:** If deploying manually via the Vercel dashboard, make sure the **Framework Preset** is set to **Next.js** and the **Root Directory** points to the folder containing `package.json` (e.g. `nithish-portfolio`).

---

##  Contact

Feel free to reach out via the contact section on the live site, or connect on LinkedIn/GitHub.

---

 If you like this project, consider giving it a star on GitHub!
