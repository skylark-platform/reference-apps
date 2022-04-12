# Skylark Reference Apps

## Usage

Running apps in `dev` mode works out of the box.

To build an app locally you need to configure Sentry:

1. Create a `.sentryclirc` file in the root repository directory
2. Visit your [auth token user settings page](https://sentry.io/settings/account/api/auth-tokens/) and create or copy an existing token
3. Add the token into the `.sentryclirc` file in the following format:

```
[auth]
token=YOUR_SENTRY_TOKEN_HERE
```

## Tech

### Core tech

- Next.js
- Tailwind CSS
- Typescript

### Monorepo tools

- Yarn workspaces
- Lerna?
- next-transpile-modules

### Additional packages

- Storybook (and Chromatic?)
- next-seo
- @aws-amplify/auth
- @aws-amplify/core
- react-icons

### Code standard tools

- ESlint
- Prettier
- Lint-staged & Husky (used together)

### Testing

- Jest
  - react-testing-library?
  - babel.config.js in packages is required for Jest testing only
- Cypress

### Deployment

- AWS Amplify for Next.js
- Serverless Next.js
- GitHub Actions
