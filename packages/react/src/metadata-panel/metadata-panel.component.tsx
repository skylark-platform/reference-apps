import React from "react";

interface MetadataPanelProps {
  content: {
    icon: JSX.Element;
    header: string;
    body: string | string[];
  }[];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ content }) => (
  <div className=" text-xs text-white md:text-base">
    {content.map(({ body, header, icon }) => (
      <div
        className="grid grid-cols-5 py-2 md:grid-cols-10 md:py-4 2xl:grid-cols-8"
        key={header}
      >
        <div className="col-span-2 flex w-full md:col-span-4 2xl:col-span-2">
          <div className="flex text-xl md:text-2xl">{icon}</div>
          <div className="ml-2 flex justify-start pt-0.5 sm:pt-0">{header}</div>
        </div>
        <div className="col-span-3 mt-0.5 flex justify-start text-gray-400 md:col-span-6 md:mt-0 2xl:col-span-4">
          {body && Array.isArray(body) ? body.join(", ") : body}
        </div>
      </div>
    ))}
  </div>
);

export default MetadataPanel;
