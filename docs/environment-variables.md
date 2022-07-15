# Environment Variables

Throughout this monorepo, environment variables are used for configuration to enable apps to run. When the same variables are used in multiple apps, we aim to keep the naming consistent so that we can use a single `.env.local` file currently located in the [apps/media][media-app] directory.

In each app, different combinations of the variables are utilised and so the ones that are required for the app to run as expected differ on a per app basis.

This document is the single source of truth to ensure that you have the correct environment variables configured for the app you are running.

## Complete list (aka development .env.local)

When running multiple apps, it is efficient to set all variables at once. The example below will outline the total number of variables and instruct you where to find their values for your Skylark instance.

```bash
# URL to your Skylark's API endpoint (usually `https://api.` followed by the Skylark URL)
# Used in
# - StreamTV
# - Content ingestor
NEXT_PUBLIC_SKYLARK_API_URL=
# Deployed URL for your app, used for OpenGraph (SEO) headers
# Used in
# - StreamTV
NEXT_PUBLIC_APP_URL=
# Configuration for AWS Cognito
# These should be provided by your customer success representative
# Used in
# - Asset video playback in the StreamTV reference app
# - Loading content into Skylark via the Ingestor
COGNITO_AWS_REGION=
COGNITO_CLIENT_ID=
COGNITO_USER_POOL_ID=
# User credentials to authenticate with your Skylark
# These are the credentials you use to log into Skylark
# Used in
# - Asset video playback in the StreamTV reference app
# - Loading content into Skylark via the Ingestor
COGNITO_EMAIL=
COGNITO_PASSWORD=
# Name of the app to deploy
# Used in
# - AWS CDK deployment (packages/infra) - defaults to media (StreamTV)
APP=media
# Base domain of your Skylark deployment
# The URL to your Skylark instance with the protocol (https) removed
# Used in
# - AWS CDK deployment (packages/infra) - defaults to media (StreamTV)
BASE_DOMAIN_NAME=
# Airtable base ID and access token
# You get these from Airtable directly
# Used in
# - Content ingestor
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

## Individual apps/packages confiurations

If you prefer to only include the environment variables that allow full functionality of your app, the guides below will help you understand which are required.

### apps/media (StreamTV)

```bash
NEXT_PUBLIC_SKYLARK_API_URL=
NEXT_PUBLIC_APP_URL=
COGNITO_AWS_REGION=
COGNITO_CLIENT_ID=
COGNITO_USER_POOL_ID=
COGNITO_EMAIL=
COGNITO_PASSWORD=
```

If you're just testing StreamTV out then you can probably get away with just:

```bash
NEXT_PUBLIC_SKYLARK_API_URL=
```

But note:

1. The site name in the SEO headers will be blank because `NEXT_PUBLIC_APP_URL` isn't provided
2. Asset playback from Skylark will not work as the `COGNITO_` variables are required for that

### packages/infra (AWS deployment)

```bash
APP=media
BASE_DOMAIN_NAME=
NEXT_PUBLIC_SKYLARK_API_URL=
# COGNITO_ used for Asset playback as in apps/media
COGNITO_AWS_REGION=
COGNITO_CLIENT_ID=
COGNITO_USER_POOL_ID=
COGNITO_EMAIL=
COGNITO_PASSWORD=

```

### packages/ingestor (Content ingestor)

```bash
NEXT_PUBLIC_SKYLARK_API_URL=
COGNITO_AWS_REGION=
COGNITO_CLIENT_ID=
COGNITO_USER_POOL_ID=
COGNITO_EMAIL=
COGNITO_PASSWORD=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

[media-app]: ../apps/media
