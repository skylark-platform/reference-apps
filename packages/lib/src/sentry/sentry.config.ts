import { NodeOptions } from "@sentry/nextjs";

type NextjsOptions = NodeOptions;

interface SentryOpts {
  dsn?: string;
  environment?: string;
}

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const NODE_ENV = process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV;

// DSN from https://sentry.io/settings/ostmodern/projects/skylark-reference-apps/keys/
const defaultDSN =
  "https://fce3d825bc614eefa9656107dc6df2bb@o732961.ingest.sentry.io/6323940";

export const getSentryOptions = ({
  dsn,
  environment,
}: SentryOpts): NextjsOptions => ({
  dsn: dsn || SENTRY_DSN || defaultDSN,
  environment: environment || NODE_ENV,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
