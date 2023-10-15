# word-trail

This app is currently designed to deploy to vercel.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

All commands should be run from root folder of repo (the folder containing this README).

Deploy to vercel, using vercel docs and SvelteKit template. This will create a vercel project.
Link this development folder to vercel: `vercel  link`
Create a vercel postgres db, using vercel docs, and connect to created vercel project.
Pull vercel environment variables: `vercel env pull .env.development.local`
Verify creating a table works: Navigate to `/api/create-pets-table` in the browser.