# `@skylark-reference-apps/ingestor`

Ingests content and metadata into a Skylark instance using the Media Data Model.

Its purpose is to import content required for the SkylarkTV demo application.

## Supported services

- Airtable

## Limitations

- Currently the Ingestor can only write data to Skylark, it has no knowledge of any existing data.
  - For this reason, we have all schedule dimensions hardcoded in our Airtable template.
- The Ingestor uses either the `slug`, `name` or `title` (depending on the object) to lookup whether it already exists in Skylark. Due to this, be careful when modifying these fields.
  - Not every object has a `slug` hence why `name` and `title` must be used for some objects.
  - In the future, this may change to be `data_source_id`, but that comes with its own problems.

## Running

1. Clone this repository.

1. Add a `.env.local` file which will contain environment variable for your Airtable and Skylark - follow the instructions in the [Environment Variables document][environment-variables]. This will also configure the ingestor to target your Skylark environment.

1. Add these additional properties to your `.env.local` file:

```bash
# Airtable API key and base ID
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

1. Install NPM dependencies and run:

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
  - Assets
- Media Objects (translations)
- People
- Roles
- Credits (using People and Roles)
- Genres
- Themes
- Availability (Licenses and Editorial Schedules)
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
- Image types
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

- Tags
- Channels
- EPG Programmes
- Parental Guidance

[environment-variables]: ../../docs/environment-variables.md
