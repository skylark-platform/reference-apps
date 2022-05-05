import React from "react";
import { IconBaseProps } from "react-icons/lib";

interface MetadataPanelProps {
  content: {
    icon: IconBaseProps;
    header: string;
    body: string | string[];
  }[];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ content }) => (
  <div className="w-full bg-black text-xs md:text-base	lg:w-4/12  ">
    {content.map(({ body, header, icon }) => (
      <div
        className="ml-4	 border-l border-gray-800 p-2 text-white"
        key={header}
      >
        <div className="grid w-full grid-cols-7 gap-1	md:grid-cols-10">
          <div className="col-span-1 m-1  ml-4 md:col-span-1">{icon}</div>
          <div className="col-span-2 flex  w-full md:col-span-2	"> {header}</div>
          <div className="col-span-4 text-gray-400  md:col-span-7">
            {body && Array.isArray(body) ? body.join(", ") : body}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MetadataPanel;
