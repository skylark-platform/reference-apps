/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable no-console */
import React, { useState } from "react";
import { DimensionContent } from "./dimension-content";
import { DimensionToggle } from "./dimension-toggle";
import { DimensionRadioButton } from "./dimension-radio-button";
import { SkylarkBranding } from "../skylark-branding";

export const DimensionSettings: React.FC = () => {
  const [hidden, setHidden] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 right-2 border border-gray-900 sm:right-10 md:right-16 lg:right-20 xl:right-28">
        <DimensionToggle onClick={() => setHidden(!hidden)} />
      </div>

      <div
        className={`p-12 px-2 sm:px-10 md:px-16 lg:px-20 xl:px-28 ${
          hidden ? "hidden" : "block"
        }`}
      >
        <div className="flex items-center justify-between">
          <SkylarkBranding className="w-16 md:w-48" />
          <div className="ml-2 flex  flex-col items-start justify-end text-sm md:flex-row md:items-center md:text-base">
            <p className="text-gray-400">Demo v1.0 - </p>
            <a
              className="text-skylark-blue md:pl-1"
              href="mailto:hello@skylarkplatform.com?subject=Enquiry from demo app"
              rel="noreferrer"
              target="_blank"
            >
              hello@skylarkplatform.com
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 pt-14 md:grid-cols-2 lg:grid-cols-4">
          <DimensionContent label="Time">
            <DimensionRadioButton
              options={["Current", "Tomorrow"]}
              onChange={(value: string) => console.log(value)}
            />
          </DimensionContent>
          <DimensionContent label="Location">
            <DimensionRadioButton
              options={["UK", "South Amercia"]}
              onChange={(value: string) => console.log(value)}
            />
          </DimensionContent>
          <DimensionContent label="Language">
            <DimensionRadioButton
              options={["English", "Spanish"]}
              onChange={(value: string) => console.log(value)}
            />
          </DimensionContent>
          <DimensionContent label="Customer Type">
            <DimensionRadioButton
              options={[
                "Standard",
                "Premium",
                "Something else",
                "One more thing a bit longer",
              ]}
              onChange={(value: string) => console.log(value)}
            />
          </DimensionContent>
        </div>
      </div>
    </>
  );
};

export default DimensionSettings;
