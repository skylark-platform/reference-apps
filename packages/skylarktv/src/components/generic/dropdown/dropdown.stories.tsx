import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Dropdown } from "./dropdown.component";

export default {
  title: "React/Dropdown",
  component: Dropdown,
} as Meta<typeof Dropdown>;

const Template: StoryFn<typeof Dropdown> = (args) => (
  <div dir="ltr">
    <Dropdown {...args} />
  </div>
);

export const Genre = Template.bind({});
Genre.args = {
  label: "Genres",
  items: [
    "Action & Adventure",
    "Children & Family",
    "Comedy",
    "Drama",
    "Horror",
    "Romantic",
    "Sci-fi & Fantasy",
    "Sports",
    "Thrillers",
    "TV Shows",
  ],
};

export const Themes = Template.bind({});
Themes.args = {
  label: "Themes",
  items: [
    "Love",
    "Redemption",
    "Resurrection",
    "Transformation",
    "Sacrifice",
    "Justice",
    "Innocence",
    "Vengeance",
  ],
};
