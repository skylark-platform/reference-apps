import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { DimensionContent } from "./dimension-content";
import { DimensionToggle } from "./dimension-toggle";
import { DimensionRadioButton } from "./dimension-radio-button";
import { SkylarkBranding } from "../skylark-branding";
import { useDimensions } from "../../contexts";
import { ConnectToSkylarkModal } from "../connect-to-skylark-modal";

interface DimensionSettingsProps {
  show?: boolean;
  skylarkApiUrl?: string;
  timeTravelEnabled: boolean;
}

const variants = {
  hidden: { opacity: 0, y: "90%" },
  animate: { opacity: 1, y: 0 },
};

export const DimensionSettings: React.FC<DimensionSettingsProps> = ({
  show: propShow = false,
  timeTravelEnabled,
  skylarkApiUrl,
}) => {
  const [show, setShow] = useState(propShow);
  const {
    dimensions,
    setLanguage,
    setCustomerType,
    setDeviceType,
    setTimeTravel,
  } = useDimensions();

  const nextWeek = dayjs().add(7, "days");
  const nextWeekReadable = nextWeek.format("DD MMMM, h:mm A");
  const nextWeekIso = nextWeek.toISOString();

  const [modalOpen, setModalOpen] = useState(false);

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
              <div className="mb-4 flex items-center justify-between">
                <SkylarkBranding className="w-12 md:w-48" />
                <div className="ml-2 flex flex-col items-start justify-end text-sm md:flex-row md:items-center">
                  <p className="text-gray-400">{`Demo v1.0 -`}</p>
                  <a
                    className="text-skylark-blue md:pl-1"
                    href={
                      process.env.NEXT_PUBLIC_REGISTER_BUTTON_HREF ||
                      "mailto:hello@skylarkplatform.com?subject=Enquiry from StreamTV"
                    }
                    rel="noreferrer"
                    target="_blank"
                  >
                    {process.env.NEXT_PUBLIC_REGISTER_BUTTON_HREF
                      ? "Join the Skylark Beta"
                      : "hello@skylarkplatform.com"}
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <p className="ml-4 flex-grow text-sm">
                  {"Skylark: "}
                  {skylarkApiUrl ? (
                    <a
                      className="text-skylark-blue"
                      href={skylarkApiUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {skylarkApiUrl}
                    </a>
                  ) : (
                    "not connected"
                  )}
                </p>
                <button
                  className="rounded-full bg-skylark-blue px-4 py-3 text-sm font-medium text-white hover:bg-blue-600"
                  onClick={() => setModalOpen(true)}
                >
                  {"Connect Skylark Account"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 pt-7 md:grid-cols-2 md:pt-10 lg:grid-cols-4">
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
                {timeTravelEnabled && (
                  <DimensionContent label="Time Travel">
                    <DimensionRadioButton
                      initial={dimensions.timeTravel}
                      options={[
                        { text: "Now", value: "" },
                        {
                          text: `Forward 7 days (${nextWeekReadable})`,
                          value: nextWeekIso,
                          activeOverride: dimensions.timeTravel !== "",
                        },
                      ]}
                      onChange={(value: string) => setTimeTravel(value)}
                    />
                  </DimensionContent>
                )}
              </div>
            </div>
          </motion.div>
        )}
        <ConnectToSkylarkModal
          closeModal={() => setModalOpen(false)}
          isOpen={modalOpen}
        />
      </AnimatePresence>
    </>
  );
};

export default DimensionSettings;
