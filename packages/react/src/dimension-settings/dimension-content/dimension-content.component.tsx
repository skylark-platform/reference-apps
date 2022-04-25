import React from "react";

interface DimensionContentProps {
  label?: string;
}

export const DimensionContent: React.FC<DimensionContentProps> = (props) => (
  <div className="w-full">
    <div className="relative rounded-lg border border-gray-200 p-5">
      {props.children}
      <h2 className="absolute top-0 left-3 -translate-y-1/2 transform text-xs font-semibold	 uppercase">
        <span className="bg-white px-2">{props.label}</span>
      </h2>
    </div>
  </div>
);

export default DimensionContent;
