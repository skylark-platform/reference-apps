import setupAmpSRSegmentWrapper from "@amplitude/segment-session-replay-wrapper";
import { AnalyticsBrowser } from "@segment/analytics-next";
import { AMPLITUDE_API_KEY, SEGMENT_WRITE_KEY } from "../constants/env";

export const segment: AnalyticsBrowser = AnalyticsBrowser.load({
  writeKey: SEGMENT_WRITE_KEY,
});

export const configureSegment = () => {
  void setupAmpSRSegmentWrapper({
    // @ts-expect-error @amplitude/segment-session-replay-wrapper needs updating to have the correct type
    segmentInstance: segment,
    amplitudeApiKey: AMPLITUDE_API_KEY,
    sessionReplayOptions: {
      logLevel: 4,
      sampleRate: 1,
      debugMode: false,
    },
  });
};
