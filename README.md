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

(Note: if you run `vercel env pull` again after installation, you will need to remove all empty `LOCAL_` variables from the `.env.local` file for the local development version to work.)

Run tests: `npm run test`

To add and remove texts from the database, see `scripts/README.md`

For other webapp-related commands, see `package.json`.

### Standards

The color scheme has been chosen to be accessible for people who have difficulty perceiving color. This has been achieved by following the WCAG 2.1 color scheme guidelines. When selecting colors, keep the following principle in mind: **you should be able to discern the difference between elements either by contrast or some other non-color-related styling (e.g. bold or italics)**.

Use [this tool](https://webaim.org/resources/contrastchecker/) to check contrast of one color against another.

You can also read more about the WCAG color guidelines [here](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html).

### Project Structure

This repository is mostly structured as a SvelteKit project. The web app, frontend and backend, uses the SvelteKit template.
However data used in the app is generated offline by Python scripts, and loaded into a database.

- `src`, `static`, and `tests` directories, as well as most configuration files, concern the webapp.

- `scripts` and `data` directories are outside of the webapp (see the `.vercelignore` file) .

In more detail:

- `src` contains JavaScript code for both the backend and frontend code. Code which runs on the server only (the backend) is in the `lib/server` directory, or has suffix `.server.ts`. See [SvelteKit docs](https://kit.svelte.dev/docs/project-structure) for more info on directory structure.
- `static` is mostly unused and serves static assets for the web app.
- `tests` contains browser-based tests using the [Playwright](https://playwright.dev/docs/writing-tests) library.
- `scripts` contains Python scripts for loading data into databases, to be used by the web app. See [scripts/README.md](scripts/README.md) for more information.
