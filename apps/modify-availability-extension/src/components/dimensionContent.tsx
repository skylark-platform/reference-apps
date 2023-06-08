import React, { ReactNode } from "react";

interface DimensionContentProps {
  label?: string;
  children?: ReactNode;
}

export const DimensionContent = ({
  label,
  children,
}: DimensionContentProps) => (
  <div className="w-full">
    <div className="relative rounded-lg border border-gray-200 p-3 md:p-5">
      {children}
      <h2 className="absolute left-2 top-0 -translate-y-1/2 transform text-xs font-medium uppercase md:left-3">
        <span className="bg-white px-2">{label}</span>
      </h2>
    </div>
  </div>
);

export default DimensionContent;
