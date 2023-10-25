# word-trail

This app currently deploys to Vercel. This has implications for how to install and build the application.

## Installing

The following steps are tested only on Linux (WSL2 - Ubuntu 20.04).

Before beginning, ensure you are using Node 18 (required for Vercel): if using nvm, run `nvm use 18 `.

Then install dependencies with `npm install` (or `pnpm install` or `yarn`).

Deploy to vercel, using vercel docs and SvelteKit template. This will create a vercel project.

Link this development folder to vercel: `vercel  link`

Create a vercel postgres db, using vercel docs, and connect to created vercel project.

Pull vercel environment variables: `vercel env pull .env.development.local`.

Set up databases: see `scripts/README.md`.

Add the following environment variables using the vercel UI:
```
    LOCAL_POSTGRES_USER=""
    LOCAL_POSTGRES_PASSWORD=""
    LOCAL_POSTGRES_DATABASE=""
    LOCAL_POSTGRES_HOST=""
```

If you would like to run playwright tests,

1. Install playwright browsers with `npx playwright install`.
2. Install playwright dependencies: `sudo npx playwright install-deps`. If this command does not work, install the packages listed when you run `npm run test`.

## Developing

Start the server: `npm run dev``

Run tests: `npm run test`

To add and remove texts from the database, see `scripts/README.md`
