# Hermela Bereket — Graphic Designer

A responsive graphic-design portfolio with a public gallery and a Supabase-authenticated admin area.

## Final folder structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── supabase/
│   └── schema.sql
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── AdminLayout.jsx
    │   ├── CategoryManager.jsx
    │   ├── Footer.jsx
    │   ├── Gallery.jsx
    │   ├── Lightbox.jsx
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── ToastProvider.jsx
    │   ├── ThemeToggle.jsx
    │   └── WorkCard.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   └── ThemeContext.jsx
    ├── hooks/
    │   ├── useCategories.js
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

Run the complete contents of [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase Dashboard's **SQL Editor**. It creates `works`, `messages`, and the managed `categories` list, enables row-level security, and creates the public `portfolio-images` bucket and its policies. If the project is already set up, run the updated SQL again to add the categories table and policies.

The policies allow public portfolio and category reads and contact submissions, while work and category changes, message access, and image uploads/updates/deletes require an authenticated user. Admin sessions automatically sign out after 20 minutes without activity; activity is shared across tabs for the same signed-in user.

Admins can add and remove categories from the dashboard. Categories assigned to existing projects cannot be removed until those projects are reassigned, preventing orphaned category values.

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

Import the project into Vercel or Netlify, set the two `VITE_SUPABASE_*` environment variables in the deployment settings, and deploy with build command `npm run build` and output directory `dist`. The included [`vercel.json`](./vercel.json) and [`netlify.toml`](./netlify.toml) configure SPA rewrites to `index.html`, so refreshing routes such as `/works` and `/admin/login` returns the app instead of the host's 404 page. If the site was already deployed, commit and redeploy these configuration files.
