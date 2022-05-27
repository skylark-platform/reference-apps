import React from "react";

interface MetadataPanelProps {
  content: {
    icon: JSX.Element;
    header: string;
    body: string | string[];
  }[];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ content }) => (
  <div className="w-full text-xs text-white md:text-base">
    {content.map(({ body, header, icon }) => (
      <div
        className="grid w-7/12 grid-cols-8 py-2 md:w-full md:py-4 lg:grid-cols-10 lg:gap-16"
        key={header}
      >
        <div className="col-span-1 justify-center text-xl md:justify-end md:text-2xl">
          {icon}
        </div>
        <div className="col-span-2 w-full justify-start pt-0.5 sm:pt-0">
          {header}
        </div>
        <div className="col-span-5 mt-0.5 justify-start text-gray-400 md:mt-0 lg:col-span-7">
          {body && Array.isArray(body) ? body.join(", ") : body}
        </div>
      </div>
    ))}
  </div>
);

export default MetadataPanel;
