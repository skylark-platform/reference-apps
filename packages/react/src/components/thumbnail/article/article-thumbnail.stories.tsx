import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ArticleThumbnail as ArticleThumbnailComponent } from "./article-thumbnail.component";

export default {
  title: "React/Thumbnails/Article",
  component: ArticleThumbnailComponent,
  argTypes: {
    contentLocation: {
      options: ["inside", "below"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof ArticleThumbnailComponent>;

const Template: ComponentStory<typeof ArticleThumbnailComponent> = (args) => (
  <div className="mt-10 flex h-[400px] w-full flex-col justify-center overflow-y-visible">
    <div className="w-96 bg-gray-900 p-10">
      <ArticleThumbnailComponent {...args} />
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
