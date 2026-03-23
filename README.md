# Simon Spare Parts MVP

Production-ready spare parts website for Simon Spare Parts, built with React, Vite, Tailwind CSS, Supabase, and Netlify-friendly deployment settings.

## Features

- Responsive public storefront for mobile, tablet, and desktop
- Searchable parts catalog with lightweight vehicle fitment filters
- Product detail pages with WhatsApp inquiry CTA
- Request-a-part flow with vehicle-prefill support
- Real-time customer chat widget with Supabase Realtime
- Admin inbox for live chat replies at `/admin/chats`
- Admin settings for branding, homepage, footer, and media
- Admin CRUD flows for products and categories
- Request status management and category homepage controls
- Supabase-ready image upload support for products, hero images, logos, favicons, and categories
- Netlify SPA routing support

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Supabase
- Supabase Realtime
- Netlify
- lucide-react

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Add your Supabase values in `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the dev server:

```bash
npm run dev
```

## Supabase Setup

Run the SQL in [schema.sql](/c:/Users/Admin/Desktop/unc.Simo/supabase/schema.sql) inside the Supabase SQL editor.

Recommended sequence:

1. Create tables, indexes, and triggers.
2. Create the `part-images` and `site-media` storage buckets.
3. Create at least one Supabase Auth user for admin access.
4. Enable Realtime replication for `chat_conversations` and `chat_messages`.
5. Apply the RLS policies.
6. Seed categories and products if needed.

### Required Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify Environment Variables

In Netlify site settings, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Because this is a Vite app, the variables must keep the `VITE_` prefix or they will not be exposed to the frontend build.

## Admin Areas

- `/admin/site-settings` controls business name, tagline, logo, favicon, and contact details
- `/admin/homepage` controls hero copy, hero image, trust strip, featured products, and CTA copy
- `/admin/products` manages the live catalog entries
- `/admin/products/new` creates new products
- `/admin/products/edit/:id` edits products
- `/admin/categories` manages category copy, images, and homepage visibility/order
- `/admin/requests` manages request statuses
- `/admin/chats` manages live customer conversations
- `/admin/footer` controls footer copy and contact details
- `/admin/media` uploads reusable site images

## Live Chat Notes

- Public chat uses a randomized browser-stored `customer_session_id` so returning visitors can continue the same conversation.
- The owner replies from `/admin/chats`.
- Realtime updates use Supabase Postgres Changes subscriptions.
- Browser notifications for new customer messages can be enabled from the admin chats page.
- For stronger production security, use Supabase anonymous auth or edge functions so public chat access can be validated server-side instead of relying only on local session identifiers.

## Storage Notes

The project includes a Supabase storage upload service in [storageService.js](/c:/Users/Admin/Desktop/unc.Simo/src/services/storageService.js).

Create these public buckets before using uploads:

- `part-images` for product photos
- `site-media` for logos, hero images, favicons, and category images

## Netlify Deployment

This project is already prepared for Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects are configured in both [netlify.toml](/c:/Users/Admin/Desktop/unc.Simo/netlify.toml) and [public/_redirects](/c:/Users/Admin/Desktop/unc.Simo/public/_redirects)

Deploy flow:

1. Push the project to GitHub.
2. Create a new Netlify site from the repo.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Add the two `VITE_` environment variables.
6. Redeploy.

## Admin Auth Notes

- Admin routes are protected with Supabase Auth session checks.
- The current MVP expects admin users to sign in with email and password.
- For stricter access control, pair auth with RLS policies that only allow authorized admins to write.

## Future Growth

- Add server-side search and pagination for larger catalogs
- Add email notifications for new chats and requests
- Add internal notes and assignment for support inbox workflows
- Add richer role-based admin controls
- Add quotation workflows and inventory adjustments
