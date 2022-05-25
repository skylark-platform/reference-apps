import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Hero } from "./hero.component";

const images = [
  "/heros/got.png",
  "/heros/deadpool.png",
  "/heros/sing.png",
  "/heros/us.png",
];

export default {
  title: "React/Hero",
  component: Hero,
  argTypes: {
    bgImage: {
      options: images,
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Hero>;

const Template: ComponentStory<typeof Hero> = (args) => (
  <div className="bg-gray-900">
    <Hero {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  bgImage: images[0],
};

export const ImageLoading = Template.bind({});
ImageLoading.args = {
  bgImage: "/this-will-never-load.jpg",
};
ImageLoading.parameters = {
  chromatic: { disableSnapshot: true },
};
