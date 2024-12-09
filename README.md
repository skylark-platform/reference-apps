![image](https://user-images.githubusercontent.com/17385115/196493113-4205645c-9e08-4492-888f-630dd4591723.png)

# SkylarkTV

[![Vercel Deploy](https://github.com/skylark-platform/skylarktv/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/skylark-platform/skylarktv/actions/workflows/deploy-vercel.yml)
[![Pull Request Checks](https://github.com/skylark-platform/skylarktv/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/skylark-platform/skylarktv/actions/workflows/pr-checks.yml)

Home to SkylarkTV, a web app designed to demonstrate the features of [Skylark][skylark], a headless CMS designed to enable customers to build and scale world-class streaming products.

[Find out more about SkylarkTV here.](https://help.skylarkplatform.com/en/collections/8884205-skylarktv)

## Overview

We use Yarn Workspaces to re-use local packages in multiple projects.

### Packages (`packages/`)

- `@skylark-apps/skylarktv` - Demo application for Skylark
- `@skylark-apps/ingestor` - A content ingestor that helps you load large amounts of content into Skylark

#### Running

Create a `.env.local` in the `packages/skylarktv` directory containing the corresponding environment variables found in the [Environment Variables document][environment-variables].

Then run:

```bash
# Install workspace dependencies
yarn

# Run all apps
yarn dev
```

### Running tests

From the root directory run `yarn test`

[skylark]: https://www.skylarkplatform.com/
[environment-variables]: ./docs/environment-variables.md
[storybook]: https://main--63219df2e93c0d4a4ed861cf.chromatic.com/
