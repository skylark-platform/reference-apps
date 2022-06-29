import React from "react";
import { H4 } from "../../typography";

export interface TextThumbnailProps {
  text: string;
}

export const TextThumbnail: React.FC<TextThumbnailProps> = (props) => {
  const { text } = props;
  return (
    <div className="text-center">
      <H4 className="mt-2 mb-0.5 text-white">{text}</H4>
    </div>
  );
};
