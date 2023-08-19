import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Carousel } from "./carousel.component";
import { heros } from "./carousel.fixtures";

export default {
  title: "React/Carousel",
  component: Carousel,
  parameters: {
    // sm, md and lg Tailwind viewports covered by Chromatic
    chromatic: { viewports: [500, 800, 1200] },
  },
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = (args) => (
  <div className="flex h-[600px] w-full flex-col justify-center overflow-y-visible bg-gray-900 lg:w-4/5 xl:w-2/3">
    <Carousel {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  items: heros,
};

export const DefaultRTL = Template.bind({});
DefaultRTL.args = {
  items: heros,
  forceRtl: true,
};

export const WithSingleItem = Template.bind({});
WithSingleItem.args = {
  items: [heros[0]],
};

export const WithChangeInterval = Template.bind({});
WithChangeInterval.args = {
  items: heros,
  changeInterval: 4,
};
WithChangeInterval.parameters = {
  // disables Chromatic's snapshotting as the timer animation causes issues
  chromatic: { disableSnapshot: true },
};
