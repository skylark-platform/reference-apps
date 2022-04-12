// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { getSentryOptions } from "@skylark-reference-apps/lib";

Sentry.init({
  ...getSentryOptions(),
});
