# Fable

A reflective companion: answer a few questions, walk away with your life as a story and a hero still. Stories run on OpenAI `gpt-5.6-luna`. Vision boards run on `gpt-image-2.5-flare`.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connect the hangar (Supabase)

Think of this as giving Fable its own hangar — Peter Parker’s photos should not sit in the Daily Bugle’s accounting cabinet. Create a **new** Supabase project just for Fable.

1. In the Supabase dashboard, create the project.
2. **Authentication → Providers → Email**: turn **off** “Confirm email” for the first demo pass so a new pilot can taxi straight to onboarding. Turn it back on before a public 500-user test if you want verified inboxes.
3. **Authentication → URL configuration**
   - Site URL: `http://localhost:3000` (then your production URL)
   - Redirect URLs: `http://localhost:3000/auth/confirm` and your production equivalent
4. Copy **Project URL** and the **publishable** key (or the legacy anon key) into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
```

Never put the **service role** key in this app. That key is the master hangar key — it bypasses the canopy lock.

Add a server-only `OPENAI_API_KEY` for Story Mode (`gpt-5.6-luna`) and Vision Board (`gpt-image-2.5-flare`). Image models may require OpenAI organization verification.

5. In the SQL editor, paste and run [`supabase/migrations/20260912153000_fable_init.sql`](supabase/migrations/20260912153000_fable_init.sql). That builds:
   - `profiles` — name, answers, callsign, ambience
   - `entries` — stories and vision boards (History and Dashboard just read this table)
   - `waitlist` — landing emails; clients can join, not list
   - `vision-images` — private locker for Flare posters
   - Row Level Security so one pilot cannot read another’s logbook

6. Restart `npm run dev`.

## What 500 users get

- Each account is a solo aircraft. Postgres refuses another user’s rows (RLS), even if someone types a URL.
- Sessions refresh in `src/proxy.ts` with `getClaims()` — we do not trust raw `getSession()` on the server.
- Story and vision writes go through Server Actions; `user_id` is stamped from the verified user, not from the browser.
- History is not a third table. It is the logbook view of `entries`.

## Scripts

```bash
npx tsc --noEmit
npm run build
npm run dev
```
