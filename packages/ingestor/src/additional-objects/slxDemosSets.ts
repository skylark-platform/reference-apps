/**
 * Specs for Sets that are created by the ingestor outside of Airtable
 * (Usually you'd create these through the CMS)
 */
import { SetConfig } from "../lib/interfaces";

const createStreamTVExternalId = (id: string) => `streamtv_${id}`;

const homePageSlider: SetConfig = {
  externalId: createStreamTVExternalId("home_page_slider"),
  title: "Home page hero",
  slug: "home-page-hero",
  graphQlSetType: "SLIDER",
  contents: [
    { type: "brands", slug: "slx-deep-dives" },
    { type: "brands", slug: "slx-demos" },
  ],
};

const mediaReferenceHomepage: SetConfig = {
  externalId: createStreamTVExternalId("homepage"),
  title: "Homepage",
  slug: "media-reference-homepage",
  graphQlSetType: "PAGE",
  contents: [
    { type: "set", set_type: "slider", slug: homePageSlider.slug },
    { type: "seasons", slug: "slx-beta-1-demos" },
    { type: "seasons", slug: "slx-alpha-2-demos" },
    { type: "seasons", slug: "slx-alpha-1-demos" },
    { type: "seasons", slug: "slx-under-the-hood" },
  ],
};

export const slxDemoSetsToCreate = [
  // Order matters, homepage is last as it includes the rail and slider
  homePageSlider,
  mediaReferenceHomepage,
];
