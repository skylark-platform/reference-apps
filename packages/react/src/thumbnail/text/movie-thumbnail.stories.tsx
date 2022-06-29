import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextThumbnail as TextThumbnailComponent } from "./text-thumbnail.component";

export default {
  title: "React/Thumbnails/Text",
  component: TextThumbnailComponent,
} as ComponentMeta<typeof TextThumbnailComponent>;

const Template: ComponentStory<typeof TextThumbnailComponent> = (args) => (
  <div className="my-1 flex h-72 w-full flex-col justify-center overflow-y-visible">
    <div className="w-6/12 bg-gray-900 p-10">
      <TextThumbnailComponent {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  text: "There are no movies listed under this genre",
};
