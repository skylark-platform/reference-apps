# `@skylark-reference-apps/ingestor`

Ingests content and metadata into a Skylark instance using the Media Data Model.

Its purpose is to import content required for the StreamTV demo application.

## Supported services

- Airtable

## Limitations

- Currently the Ingestor can only write data to Skylark, it has no knowledge of any existing data.
  - For this reason, we have all schedule dimensions hardcoded in our Airtable template.
- The Ingestor uses either the `slug`, `name` or `title` (depending on the object) to lookup whether it already exists in Skylark. Due to this, be careful when modifying these fields.
  - Not every object has a `slug` hence why `name` and `title` must be used for some objects.
  - In the future, this may change to be `data_source_id`, but that comes with its own problems.

## Running

1. Target your Skylark instance by adding the following properties to a `.env.local` file in `app/media`:

```
# Airtable API key and base ID
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
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

2. Install NPM dependencies and run:

```bash
yarn && yarn ingest
```

## Supported Skylark objects

### Full support

_These objects can be created or modified via the Ingestor_

- Media objects
  - Brands
  - Seasons
  - Episodes
  - Movies
- People
- Roles
- Credits (using People and Roles)
- Genres
- Themes
- Availibility (Licenses and Editorial Schedules)
- Ratings
- Images
- Dimensions
  - Affiliates
  - Customer Types
  - Device Types
  - Languages
  - Locales
  - Operating Systems
  - Regions
  - Viewing Contexts
- Asset types

### Metadata only support

_These objects are defined in the Ingestor code, but we can add metadata through the Ingestor_

- Sets
  - Homepages
  - Generic views
  - Sliders
  - Rails
  - Collections

### Unsupported

_These objects cannot be created by the Ingestor_

- Assets
- Tags
- Channels
- EPG Programmes
- Parental Guidance
