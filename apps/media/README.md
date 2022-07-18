# StreamTV

![StreamTV Homepage](../../docs/images/streamtv-homepage.png?raw=true "StreamTV Homepage")

A [Skylark][skylark] reference application built using Next.js and Tailwind CSS.

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

## Deployment

As this is a Next.js app, we recommend that you deploy through [Vercel][vercel] to ensure full feature compatibility, but you can use any provider that supports Next.js.

Due to our internal infrastructure we deploy to AWS using the [Serverless Next.js CDK][serverless-nextjs-cdk].

When deploying StreamTV, you will need values for environment variables. This is covered in the [Environment Variables document][environment-variables].

### Vercel

The fastest method to deploy StreamTV is by using the [Vercel Deploy Button][vercel-deploy-button] below. It allows users to deploy a new project through the Vercel Project Creation Flow, while cloning the source Git repository to GitHub, GitLab, or Bitbucket.

By using it, you will deploy StreamTV into your Vercel account and receive prompts to add required configuration such as environment variables that connect your deployment to your Skylark instance. This should ensure that StreamTV works first time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fostmodern%2Fskylark-reference-apps%2Ftree%2Fmain%2Fapps%2Fmedia&env=NEXT_PUBLIC_SKYLARK_API_URL,NEXT_PUBLIC_APP_URL,COGNITO_AWS_REGION,COGNITO_CLIENT_ID,COGNITO_USER_POOL_ID,COGNITO_EMAIL,COGNITO_PASSWORD&envDescription=Environment%20variables%20needed%20to%20run%20the%20app&envLink=https%3A%2F%2Fgithub.com%2Fostmodern%2Fskylark-reference-apps%2Fblob%2Fmain%2Fdocs%2Fenvironment-variables.md&project-name=skylark-stream-tv&repo-name=skylark-reference-apps&demo-title=StreamTV%20Showcase&demo-description=StreamTV%20deployed%20connected%20to%20Skylark's%20Showcase%20environment&demo-url=https%3A%2F%2Fmedia.apps.showcase.skylarkplatform.io&demo-image=https%3A%2F%2Fgithub.com%2Fostmodern%2Fskylark-reference-apps%2Fblob%2Fmain%2Fdocs%2Fimages%2Fstreamtv-homepage.png%3Fraw%3Dtrue)

<!-- Generated using https://vercel.com/docs/deploy-button -->

### AWS

Due to our internal infrastructure at [Skylark][skylark], we deploy to AWS using the [Serverless Next.js CDK][serverless-nextjs-cdk].

We've taken steps to ensure that it is can deploy StreamTV into the same AWS Account where your Skylark resides.
In the future we will make this configurable so that you can deploy it into an AWS Account separate from your Skylark into any AWS Account. [More information about this here][infra-project-more-info].

Use the [`@skylark-reference-apps/infra`][infra-project] package to deploy to AWS and connect to a deployed Skylark instance.

[skylark]: https://www.skylarkplatform.com/
[vercel]: https://vercel.com/
[vercel-deploy-button]: https://vercel.com/docs/deploy-button
[serverless-nextjs-cdk]: https://serverless-nextjs.com/docs/cdkconstruct/
[infra-project]: ../../packages/infra/
[infra-project-more-info]: ../../packages/infra/README.md#Description
[environment-variables]: ../../docs/environment-variables.md
