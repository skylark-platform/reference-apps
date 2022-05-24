import React from "react";

interface MetadataPanelProps {
  content: {
    icon: JSX.Element;
    header: string;
    body: string | string[];
  }[];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ content }) => (
  <div className="w-full border-gray-800 bg-gray-900 text-xs text-white md:border-l md:text-base">
    {content.map(({ body, header, icon }) => (
      <div
        className="grid w-full grid-cols-8 py-2 md:grid-cols-8 md:gap-4 md:py-4 lg:grid-cols-10"
        key={header}
      >
        <div className="col-span-1 mt-1 flex justify-center md:col-span-1 md:justify-end lg:col-span-1">
          {icon}
        </div>
        <div className="col-span-2 flex w-full justify-center md:col-span-2 lg:col-span-2">
          {" "}
          {header}
        </div>
        <div className="col-span-5 justify-start text-gray-400 md:col-span-5 lg:col-span-7">
          {body && Array.isArray(body) ? body.join(", ") : body}
        </div>
      </div>
    ))}
  </div>
);

export default MetadataPanel;
