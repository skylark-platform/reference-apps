# Skylark Legacy to Skylark Ingestor

This directory contains code specifically used to migrate data from Skylark Legacy (REST API) to new Skylark (GraphQL).

It is not designed to handle all data models. Instead you need to modify it to fit the layout of your data model, i.e modify the code in this directory.

## Get Started

Create a `packages/ingestor/.env.legacy` file containing:

```
LEGACY_API_URL=""
LEGACY_SKYLARK_TOKEN=""
```

Where:

- `LEGACY_API_URL` is the API URL of the Skylark Legacy instance.
- `LEGACY_SKYLARK_TOKEN` is an admin access token (you can get this by using the CMS and inspecting the network tab in your browser).

## Outputs

When running, it will record all the objects from Legacy Skylark so that you can read them from disk in future ingests.
