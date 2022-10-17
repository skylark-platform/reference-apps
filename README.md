# StreamTV OTT Reference App

Home to StreamTV, a web app designed to demonstrate the features of [Skylark][skylark], a headless CMS designed to enable customers to build and scale world-class streaming products.

## Overview

We use Lerna and Yarn Workspaces to re-use local packages in multiple projects.

### Apps (`app/`)

- Media (StreamTV) - [Demo application for Skylark V8.x.x][v8-app] (up between 6am and 12am GMT)
- SaaS (StreamTV (SaaS)) - Demo application for SaaS Skylark (up between 6am and 12am GMT)
- Storybook - [React component library][storybook]

#### Running

Create a `.env.local` in the `apps/media` directory containing the corresponding environment variables found in the [Environment Variables document][environment-variables].

Then run:

```bash
# Install workspace dependencies
yarn

# Run all apps
yarn dev
```

### Packages (`packages/`)

- `@skylark-reference-apps/infra` - AWS CDK used to deploy the Next.js apps to an AWS account that contains a running Skylark to connect to
- `@skylark-reference-apps/ingestor` - A content ingestor that helps you load large amounts of content into Skylark
- `@skylark-reference-apps/lib` - Helper functions to communicate with the Skylark API, Cognito etc
- `@skylark-reference-apps/react` - React components - [Storybook][storybook]

### Running tests

From the root directory run `yarn test`

[skylark]: https://www.skylarkplatform.com/
[environment-variables]: ./docs/environment-variables.md
[storybook]: https://main--63219df2e93c0d4a4ed861cf.chromatic.com/
[v8-app]: https://media.apps.showcase.skylarkplatform.io/
