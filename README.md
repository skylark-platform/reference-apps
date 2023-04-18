![image](https://user-images.githubusercontent.com/17385115/196493113-4205645c-9e08-4492-888f-630dd4591723.png)

# StreamTV OTT Reference App

[![Vercel Deploy](https://github.com/skylark-platform/reference-apps/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/skylark-platform/reference-apps/actions/workflows/deploy-vercel.yml)
[![Pull Request Checks](https://github.com/skylark-platform/reference-apps/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/skylark-platform/reference-apps/actions/workflows/pr-checks.yml)

Home to StreamTV, a web app designed to demonstrate the features of [Skylark][skylark], a headless CMS designed to enable customers to build and scale world-class streaming products.

## Overview

We use Lerna and Yarn Workspaces to re-use local packages in multiple projects.

### Apps (`app/`)

- StreamTV - Demo application for Skylark
- Storybook - [React component library][storybook]

#### Running

Create a `.env.local` in the `apps/streamtv` directory containing the corresponding environment variables found in the [Environment Variables document][environment-variables].

Then run:

```bash
# Install workspace dependencies
yarn

# Run all apps
yarn dev
```

### Packages (`packages/`)

- `@skylark-reference-apps/ingestor` - A content ingestor that helps you load large amounts of content into Skylark
- `@skylark-reference-apps/lib` - Helper functions to communicate with the Skylark API, Cognito etc
- `@skylark-reference-apps/react` - React components - [Storybook][storybook]

### Running tests

From the root directory run `yarn test`

[skylark]: https://www.skylarkplatform.com/
[environment-variables]: ./docs/environment-variables.md
[storybook]: https://main--63219df2e93c0d4a4ed861cf.chromatic.com/
