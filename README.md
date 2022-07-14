# Skylark Reference Apps

Home to StreamTV, a web app designed to demonstrate [Skylark's](https://www.skylarkplatform.com/) features.

## Overview

We use Lerna and Yarn Workspaces to re-use local packages in multiple projects.

### Apps (`app/`)

- Media (StreamTV) - Demo application for the Skylark Media Data Model
- Storybook - React component library

#### Running

Create a `.env.local` in the `apps/media` directory containing:

```bash
# URL to your Skylark's API endpoint (usually `https://api.` followed by the Skylark URL)
NEXT_PUBLIC_SKYLARK_API_URL=
# Deployed URL for your app
NEXT_PUBLIC_APP_URL=
# Configuration for AWS Cognito
COGNITO_AWS_REGION=
COGNITO_CLIENT_ID=
COGNITO_USER_POOL_ID=
# Email and password for a user in your Cognito pool
COGNITO_EMAIL=
COGNITO_PASSWORD=
```

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
