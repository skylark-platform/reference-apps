import React, { useState } from "react";
import { DimensionContent } from "./dimension-content";
import { DimensionToggle } from "./dimension-toggle";
import { DimensionRadioButton } from "./dimension-radio-button";
import { SkylarkBranding } from "../skylark-branding";

interface DimensionSettingsProps {
  show?: boolean;
}

export const DimensionSettings: React.FC<DimensionSettingsProps> = ({
  show: propShow = false,
}) => {
  const [show, setShow] = useState(propShow);

  return (
    <>
      <div className="fixed bottom-0 right-sm-gutter flex md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter">
        <DimensionToggle iconDir="up" onClick={() => setShow(true)} />
      </div>
      {show && (
        <div
          className={` fixed bottom-0 left-0 right-0 z-50 block h-[60vh] bg-white md:h-auto`}
        >
          <div className="absolute -top-9 right-sm-gutter flex md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter">
            <DimensionToggle iconDir="down" onClick={() => setShow(false)} />
          </div>
          <div className="relative h-full overflow-y-auto py-4 px-sm-gutter md:py-12 md:px-md-gutter  lg:px-lg-gutter xl:px-xl-gutter">
            <div className="flex items-center justify-between">
              <SkylarkBranding className="w-12 md:w-48" />
              <div className="ml-2 flex flex-col items-start justify-end text-sm md:flex-row md:items-center">
                <p className="text-gray-400">{`Demo v1.0 -`}</p>
                <a
                  className="text-skylark-blue md:pl-1"
                  href="mailto:hello@skylarkplatform.com?subject=Enquiry from demo app"
                  rel="noreferrer"
                  target="_blank"
                >
                  {`hello@skylarkplatform.com`}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 pt-7 md:grid-cols-2 md:pt-14 lg:grid-cols-4">
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
        </div>
      )}
    </>
  );
};

export default DimensionSettings;
