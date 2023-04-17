# StreamTV

![StreamTV Homepage](../../docs/images/streamtv-homepage.png?raw=true "StreamTV Homepage")

A [Skylark X][skylark] reference application built using Next.js and Tailwind CSS.

## Running

1. Create a `.env.local` and populate it using the instructions in the [Environment Variables document][environment-variables].

2. Install dependencies

```bash
yarn
```

3. Run in development mode

```
yarn dev
```

4. Build and run in production mode

```
yarn build && yarn start
```

### Password protected deployment

Optionally, you can enable simple password protected deployments by setting the following environment variables:

```
NEXT_PUBLIC_PASSWORD_PROTECT=true
SITE_PASSWORD=yoursitepassword
```

## Deployment

As this is a Next.js app, we recommend that you deploy through [Vercel][vercel] to ensure full feature compatibility, but you can use any provider that supports Next.js.

When deploying StreamTV, you will need values for environment variables. This is covered in the [Environment Variables document][environment-variables].

### Vercel

The fastest method to deploy StreamTV is by using the [Vercel Deploy Button][vercel-deploy-button] below. It allows users to deploy a new project through the Vercel Project Creation Flow, while cloning the source Git repository to GitHub, GitLab, or Bitbucket.

By using it, you will deploy StreamTV into your Vercel account and receive prompts to add required configuration such as environment variables that connect your deployment to your Skylark instance. This should ensure that StreamTV works first time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fskylark-platform%2Freference-apps%2Ftree%2Fmain%2Fapps%2Fstreamtv&env=NEXT_PUBLIC_SAAS_API_ENDPOINT,NEXT_PUBLIC_SAAS_API_KEY,NEXT_PUBLIC_APP_TITLE&envDescription=Envs%20required%20for%20StreamTV%20to%20connect%20to%20Skylark&envLink=https%3A%2F%2Fgithub.com%2Fskylark-platform%2Freference-apps%2Fblob%2Fmain%2Fdocs%2Fenvironment-variables.md&project-name=streamtv&repository-name=streamtv)

<!-- Generated using https://vercel.com/docs/deploy-button -->

[skylark]: https://www.skylarkplatform.com/
[vercel]: https://vercel.com/
[vercel-deploy-button]: https://vercel.com/docs/deploy-button
[environment-variables]: ../../docs/environment-variables.md
