import React from "react";

interface MetadataPanelProps {
  content: {
    icon: JSX.Element;
    header: string;
    body: string | string[];
  }[];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ content }) => (
  <div className="w-full border-l border-gray-800 bg-black text-xs text-white md:text-base lg:w-4/12">
    {content.map(({ body, header, icon }) => (
      <div
        className="grid w-full grid-cols-7 gap-4 py-2 md:grid-cols-10 md:py-4"
        key={header}
      >
        <div className="col-span-1 mt-1 flex items-start justify-end md:col-span-1">
          {icon}
        </div>
        <div className="col-span-2 flex w-full md:col-span-2"> {header}</div>
        <div className="col-span-4 text-gray-400 md:col-span-7">
          {body && Array.isArray(body) ? body.join(", ") : body}
        </div>
      </div>
    ))}
  </div>
);

export default MetadataPanel;
