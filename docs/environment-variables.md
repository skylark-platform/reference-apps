# Environment Variables

Throughout this monorepo, environment variables are used for configuration to enable apps to run. When the same variables are used in multiple apps, we aim to keep the naming consistent so that we can use a single `.env.local` file currently located in the [apps/streamtv][streamtv-app] directory.

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
# Deployed domain for your app, used for OpenGraph (SEO) headers
# Used in
# - StreamTV
NEXT_PUBLIC_APP_DOMAIN=
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
# Airtable base ID and access token
# You get these from Airtable directly
# Used in
# - Content ingestor
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

## Individual apps/packages confiurations

If you prefer to only include the environment variables that allow full functionality of your app, the guides below will help you understand which are required.

### apps/streamtv (StreamTV)

```bash
NEXT_PUBLIC_SAAS_API_ENDPOINT=
NEXT_PUBLIC_SAAS_API_KEY=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
# Title is optional, defaults to `StreamTV`
NEXT_PUBLIC_APP_TITLE=
```

If you're just testing StreamTV out then you can probably get away with just:

```bash
NEXT_PUBLIC_SAAS_API_ENDPOINT=
NEXT_PUBLIC_SAAS_API_KEY=
NEXT_PUBLIC_APP_TITLE=
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

[streamtv-app]: ../apps/streamtv
