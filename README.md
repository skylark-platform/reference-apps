# Skylark Reference Apps

Home to StreamTV, a web app designed to demonstrate [Skylark's][skylark] features.

## Overview

We use Lerna and Yarn Workspaces to re-use local packages in multiple projects.

### Apps (`app/`)

- Media (StreamTV) - Demo application for the Skylark Media Data Model
- Storybook - React component library

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
- `@skylark-reference-apps/react` - React components

### Running tests

From the root directory run `yarn test`

[skylark]: https://www.skylarkplatform.com/
[environment-variables]: ./docs/environment-variables.md
