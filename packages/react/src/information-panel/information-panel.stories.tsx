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
  content: [
    {
      show: "Game of Thrones",
      season: 1,
      episode: "1. Winter is Coming",
      duration: 57,
      ageRange: "18+",
      availableUntil: 12,
      description:
        "Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter.",
      genres: ["Drama", "Mythical", "Based on a book"],
    },
  ],
};
