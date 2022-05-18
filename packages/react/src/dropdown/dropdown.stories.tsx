import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Dropdown } from "./dropdown.component";

export default {
  title: "React/Dropdown",
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args} />
);

export const Genre = Template.bind({});
Genre.args = {
  text: "Genres",
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
  text: "Themes",
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
