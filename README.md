# word-trail

This app currently deploys to [Vercel](https://vercel.com/docs), with a database hosted on [Neon](https://neon.tech/docs). This has implications for how to install and build the application.

## Installing

The following steps are tested only on Linux (WSL2 - Ubuntu 20.04).

Before beginning, ensure you are using Node 18 (required for Vercel): if using nvm, run `nvm use 18 `.

Then install dependencies with `npm install` (or `pnpm install` or `yarn`).

Deploy to Vercel, using Vercel docs and SvelteKit template. This will create a vercel project.

Link this development folder to Vercel: `vercel  link`

Create a Neon db, using Neon docs, and connect to vercel project, using [Neon-Vercel Integration](https://vercel.com/integrations/neon). DO NOT CHECK option to create a development branch.

Go to Project, then Settings > Environment variables, and set the following Neon variables to be available in all environments (Production, Preview and Development).

- `DATABASE_URL`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `PGHOST`

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

Start the local postgres server. (On WSL: `sudo service postgresql start`)

Use node version 18. (With nvm, `nvm use 18`).

Start the server: `npm run dev`

Run tests: `npm run test`

To add and remove texts from the database, see `scripts/README.md`

Note: if you run `vercel env pull` again after installation, you will need to remove all empty `LOCAL_` variables from the `.env.local` file for the local development version to work.
