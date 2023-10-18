# word-trail

This app currently deploys to Vercel. This has implications for how to install and build the application.

## Installing

The following steps are tested only on Linux (WSL2 - Ubuntu 20.04).

Before beginning, ensure you are using Node 18 (for Vercel): if using nvm, run `nvm use 18 `.
Then install dependencies with `npm install` (or `pnpm install` or `yarn`).

If you would like to run playwright tests,

1. Install playwright browsers with `npx playwright install`.
2. Install playwright dependencies: `sudo npx playwright install-deps`. If this command does not work, install the packages listed when you run `npm run test`.

## Developing

Start the server: `npm run dev``

Run tests: `npm run test`

## Building

Deploy to vercel, using vercel docs and SvelteKit template. This will create a vercel project.
Link this development folder to vercel: `vercel  link`
Create a vercel postgres db, using vercel docs, and connect to created vercel project.
Pull vercel environment variables: `vercel env pull .env.development.local`
Verify creating a table works: Navigate to `/api/create-pets-table` in the browser.
