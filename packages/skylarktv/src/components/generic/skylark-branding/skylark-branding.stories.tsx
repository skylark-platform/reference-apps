import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { SkylarkBranding } from "./skylark-branding.component";

export default {
  title: "React/SkylarkBranding",
  component: SkylarkBranding,
} as Meta<typeof SkylarkBranding>;

const Template: StoryFn<typeof SkylarkBranding> = (args) => (
  <SkylarkBranding {...args} />
);

export const Tablet = Template.bind({});
Tablet.parameters = {
  chromatic: { viewports: [1200] },
  viewport: {
    defaultViewport: "tablet",
  },
};

export const Mobile = Template.bind({});
Mobile.parameters = {
  chromatic: { viewports: [320] },
  viewport: {
    defaultViewport: "mobile1",
  },
};
