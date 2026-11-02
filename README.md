# Hermela Bereket — Graphic Designer

A responsive graphic-design portfolio with a public gallery and a Supabase-authenticated admin area.

## Final folder structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
├── supabase/
│   └── schema.sql
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── AdminLayout.jsx
    │   ├── Footer.jsx
    │   ├── Gallery.jsx
    │   ├── Lightbox.jsx
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── ToastProvider.jsx
    │   └── WorkCard.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── hooks/
    │   └── useWorks.js
    ├── lib/
    │   ├── seo.js
    │   └── supabaseClient.js
    └── pages/
        ├── About.jsx
        ├── Contact.jsx
        ├── Home.jsx
        ├── NotFound.jsx
        ├── Works.jsx
        └── admin/
            ├── Dashboard.jsx
            ├── Login.jsx
            ├── Messages.jsx
            └── WorkForm.jsx
```

## Supabase SQL

Run the complete contents of [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase Dashboard's **SQL Editor**. It creates `works` and `messages`, enables row-level security, and creates the public `portfolio-images` bucket and its policies.

The policies allow public portfolio reads and contact submissions, while work changes, message access, and image uploads/updates/deletes require an authenticated user.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the project URL and the `anon`/publishable key.
3. Open **SQL Editor**, paste and run `supabase/schema.sql`.
4. In **Authentication → Users**, choose **Add user** and create Hermela's email/password account. Confirm the email if your project requires it; remove any other accounts that should not have admin access.
5. In **Authentication → Providers → Email**, disable **Allow new users to sign up**. Hermela's existing account can still sign in. Do not expose a service-role key in this frontend.
6. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. Run:

   ```sh
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. Admin sign-in is at `/admin/login`.

8. Replace the general social network and email links in `src/pages/Contact.jsx` with Hermela's own profile URLs and email address when those details are available.

## Deploy

Import the project into Vercel or Netlify, set the two `VITE_SUPABASE_*` environment variables in the deployment settings, and deploy with build command `npm run build` and output directory `dist`. Configure the host to rewrite application routes to `index.html` so React Router routes work on direct visits.
