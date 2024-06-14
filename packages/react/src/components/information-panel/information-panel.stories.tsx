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
  brand: { title: "Game of Thrones", uid: "1" },
  season: { number: 1, title: "" },
  title: "Winter is Coming",
  duration: 57,
  rating: "18+",
  availableUntil: { unit: "day", number: 12 },
  description:
    "Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter.",
  themes: ["Drama", "Mythical", "Based on a book"],
  genres: ["Action", "Adventure"],
};
