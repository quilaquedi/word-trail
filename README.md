# word-trail

This app currently deploys to [Vercel](https://vercel.com/docs), with a database hosted on [Neon](https://neon.tech/docs). This has implications for how to install and build the application.

## Installing

The following steps are tested only on Linux (WSL2 - Ubuntu 20.04).

Before beginning, ensure you are using Node 18 (required for Vercel): if using nvm, run `nvm use 18 `.

Then install dependencies with `npm install` (or `pnpm install` or `yarn`).

Deploy to Vercel, using Vercel docs and SvelteKit template. This will create a vercel project.

Link this development folder to Vercel: `vercel  link`

Create a Neon db, using Neon docs, and connect to vercel project, using [Neon-Vercel Integration](https://vercel.com/integrations/neon). If you check the optiono to create a development branch, make sure to set it as the primary branch in your Neon dashboard.

Pull vercel environment variables and save in `.env.local`: `vercel env pull`

Set up local database and load data into databases: see `scripts/README.md`.

Add the following environment variables using the vercel UI:

```
    LOCAL_POSTGRES_USER=""
    LOCAL_POSTGRES_PASSWORD=""
    LOCAL_POSTGRES_DATABASE=""
    LOCAL_POSTGRES_HOST=""
```

If you would like to run playwright tests, install playwright dependencies: `sudo npx playwright install-deps`. If this command does not work, install the packages listed when you run `npm run test`.

## Developing

Start the server: `npm run dev``

Run tests: `npm run test`

To add and remove texts from the database, see `scripts/README.md`
