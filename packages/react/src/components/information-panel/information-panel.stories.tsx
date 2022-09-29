import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InformationPanel } from "./information-panel.component";

export default {
  title: "React/InformationPanel",
  component: InformationPanel,
} as ComponentMeta<typeof InformationPanel>;

const Template: ComponentStory<typeof InformationPanel> = (args) => (
  <InformationPanel {...args} />
);

export const Default = Template.bind({});
Default.args = {
  parentTitle: "Game of Thrones",
  seasonNumber: 1,
  title: "Winter is Coming",
  duration: 57,
  rating: "18+",
  availableUntil: 12,
  description:
    "Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter.",
  themes: ["Drama", "Mythical", "Based on a book"],
  genres: ["Action", "Adventure"],
};
