import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DimensionContent } from "./dimension-content";
import { DimensionToggle } from "./dimension-toggle";
import { DimensionRadioButton } from "./dimension-radio-button";
import { SkylarkBranding } from "../skylark-branding";
import { useDimensions } from "../../contexts";

interface DimensionSettingsProps {
  show?: boolean;
}

const variants = {
  hidden: { opacity: 0, y: "90%" },
  animate: { opacity: 1, y: 0 },
};

export const DimensionSettings: React.FC<DimensionSettingsProps> = ({
  show: propShow = false,
}) => {
  const [show, setShow] = useState(propShow);
  const { dimensions, setLanguage, setCustomerType, setDeviceType } =
    useDimensions();

  return (
    <>
      <div
        className={`fixed bottom-0 right-sm-gutter z-20 flex transition-opacity duration-500 md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter ${
          show ? "opacity-0" : "opacity-100"
        }`}
      >
        <DimensionToggle variant="open" onClick={() => setShow(true)} />
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            animate="animate"
            className={`fixed bottom-0 left-0 right-0 z-50 block h-[75vh] bg-white font-skylark-branding md:h-auto`}
            exit="hidden"
            initial="hidden"
            key="dimension-settings"
            transition={{ type: "spring", bounce: 0.2 }}
            variants={variants}
          >
            <div className="absolute -top-9 right-sm-gutter flex md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter">
              <DimensionToggle variant="close" onClick={() => setShow(false)} />
            </div>
            <div className="relative h-full overflow-y-auto py-4 px-sm-gutter md:py-12 md:px-md-gutter  lg:px-lg-gutter xl:px-xl-gutter">
              <div className="flex items-center justify-between">
                <SkylarkBranding className="w-12 md:w-48" />
                <div className="ml-2 flex flex-col items-start justify-end text-sm md:flex-row md:items-center">
                  <p className="text-gray-400">{`Demo v1.0 -`}</p>
                  <a
                    className="text-skylark-blue md:pl-1"
                    href="mailto:hello@skylarkplatform.com?subject=Enquiry from StreamTV"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {`hello@skylarkplatform.com`}
                  </a>
                </div>
              </div>
              <p className="pt-2 text-sm">
                {"Skylark API: "}
                {process.env.NEXT_PUBLIC_SKYLARK_API_URL ? (
                  <a
                    className="text-skylark-blue"
                    href={process.env.NEXT_PUBLIC_SKYLARK_API_URL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {process.env.NEXT_PUBLIC_SKYLARK_API_URL}
                  </a>
                ) : (
                  "not connected"
                )}
              </p>
              <div className="grid grid-cols-1 gap-8 pt-7 md:grid-cols-2 md:pt-14 lg:grid-cols-4">
                <DimensionContent label="Language">
                  <DimensionRadioButton
                    initial={dimensions.language}
                    options={[
                      { text: "English", value: "en-gb" },
                      { text: "Portuguese", value: "pt-pt" },
                    ]}
                    onChange={(value: string) => setLanguage(value)}
                  />
                </DimensionContent>
                <DimensionContent label="Customer Type">
                  <DimensionRadioButton
                    initial={dimensions.customerType}
                    options={[
                      { text: "Premium", value: "premium" },
                      { text: "Standard", value: "standard" },
                    ]}
                    onChange={(value: string) => setCustomerType(value)}
                  />
                </DimensionContent>
                <DimensionContent label="Device Type">
                  <DimensionRadioButton
                    initial={dimensions.deviceType}
                    options={[
                      { text: "Desktop", value: "pc" },
                      { text: "Phone", value: "smartphone" },
                    ]}
                    onChange={(value: string) => setDeviceType(value)}
                  />
                </DimensionContent>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DimensionSettings;
