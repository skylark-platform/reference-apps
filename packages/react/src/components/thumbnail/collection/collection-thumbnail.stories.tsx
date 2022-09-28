import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CollectionThumbnail as CollectionThumbnailComponent } from "./collection-thumbnail.component";

export default {
  title: "React/Thumbnails/Collection",
  component: CollectionThumbnailComponent,
  argTypes: {
    contentLocation: {
      options: ["inside", "below"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof CollectionThumbnailComponent>;

const Template: ComponentStory<typeof CollectionThumbnailComponent> = (
  args
) => (
  <div className="mt-10 flex h-[400px] w-full flex-col justify-center overflow-y-visible">
    <div className="w-96 bg-gray-900 p-10">
      <CollectionThumbnailComponent {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  href: "/",
  title: "Collection Title",
  subtitle: "Subtitle",
  backgroundImage: "/collections/Brand%20-%20Sherlock.png",
  tags: ["Genres", "Themes"],
};
