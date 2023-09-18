import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { FiExternalLink } from "react-icons/fi";
import {
  LOCAL_STORAGE,
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "@skylark-reference-apps/lib";
import { DimensionContent } from "./dimension-content";
import { DimensionToggle } from "./dimension-toggle";
import { DimensionRadioButton } from "./dimension-radio-button";
import { SkylarkBranding } from "../skylark-branding";
import { useDimensions } from "../../contexts";
import { ConnectToSkylarkModal } from "../connect-to-skylark-modal";

const generateSkylarkAutoconnectUrl = () => {
  const isBrowser = typeof window !== "undefined";
  const url =
    (isBrowser && localStorage.getItem(LOCAL_STORAGE.uri)) || SAAS_API_ENDPOINT;
  const apikey =
    (isBrowser && localStorage.getItem(LOCAL_STORAGE.apikey)) || SAAS_API_KEY;
  return `https://app.skylarkplatform.com/beta/connect?uri=${url}&apikey=${apikey}`;
};

interface DimensionSettingsProps {
  show?: boolean;
  skylarkApiUrl?: string;
  timeTravelEnabled?: boolean;
  children?: React.ReactNode;
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
  const { dimensions, setLanguage, setCustomerType, setRegion, setTimeTravel } =
    useDimensions();

  const nextWeek = dayjs().add(7, "days");
  const nextWeekReadable = nextWeek.format("DD MMMM, h:mm A");
  const nextWeekIso = nextWeek.toISOString();

  const [modalOpen, setModalOpen] = useState(false);

  const customerTypeOptions = [
    { text: "Premium", value: "premium" },
    { text: "Standard", value: "standard" },
    { text: "Kids", value: "kids" },
  ];

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
            dir="ltr"
            exit="hidden"
            initial="hidden"
            key="dimension-settings"
            transition={{ type: "spring", bounce: 0.2 }}
            variants={variants}
            // For debug dimensions
            {...Object.entries(dimensions).reduce(
              (prev, [dimension, value]) => ({
                ...prev,
                [`data-dimension-${dimension.toLowerCase()}`]: value as string,
              }),
              {} as Record<string, string>,
            )}
          >
            <div className="absolute -top-9 right-sm-gutter flex md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter">
              <DimensionToggle variant="close" onClick={() => setShow(false)} />
            </div>
            <div className="relative h-full overflow-y-auto px-sm-gutter py-4 md:px-md-gutter md:py-12  lg:px-lg-gutter xl:px-xl-gutter">
              <div className="mb-4 flex items-center justify-between">
                <div className="group flex items-center">
                  <SkylarkBranding className="w-12 md:w-48" />
                  <a
                    className="invisible ml-2 text-skylark-blue opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-hover:delay-1000"
                    href={generateSkylarkAutoconnectUrl()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FiExternalLink />
                  </a>
                </div>
                <div className="ml-2 flex flex-col items-start justify-end text-sm md:flex-row md:items-center">
                  <p className="text-gray-400">{`Demo v1.0 -`}</p>
                  <a
                    className="text-skylark-blue md:pl-1"
                    href={
                      "mailto:hello@skylarkplatform.com?subject=Enquiry from StreamTV"
                    }
                    rel="noreferrer"
                    target="_blank"
                  >
                    {"hello@skylarkplatform.com"}
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-start">
                <p className="text-sm font-medium">
                  {skylarkApiUrl
                    ? `Connected: ${
                        skylarkApiUrl.includes("skylarkplatform.io") ||
                        skylarkApiUrl.includes("skylarkplatform.com")
                          ? skylarkApiUrl.split(".")[1]
                          : skylarkApiUrl
                      }.`
                    : "Not connected."}
                </p>
                <button
                  className="ml-1.5 rounded-full text-sm font-medium text-skylark-blue  hover:text-blue-600"
                  onClick={() => setModalOpen(true)}
                >
                  {"Change"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 pt-7 md:grid-cols-2 md:pt-10 lg:grid-cols-4">
                <DimensionContent label="Customer Type">
                  <DimensionRadioButton
                    active={dimensions.customerType}
                    options={customerTypeOptions}
                    onChange={(value: string) => setCustomerType(value)}
                  />
                </DimensionContent>
                <DimensionContent label="Region">
                  <DimensionRadioButton
                    active={dimensions.region}
                    options={[
                      { text: "Europe", value: "europe" },
                      { text: "North America", value: "north-america" },
                      {
                        text: "Middle East",
                        value: "mena",
                      },
                    ]}
                    onChange={(value: string) => {
                      setRegion(value);
                      if (
                        (value === "europe" &&
                          !["en-gb", "pt-pt"].includes(dimensions.language)) ||
                        (value === "mena" &&
                          !["en-gb", "ar"].includes(dimensions.language))
                      ) {
                        setLanguage("en-gb");
                      }
                    }}
                  />
                </DimensionContent>
                <DimensionContent label="Language">
                  <DimensionRadioButton
                    active={dimensions.language}
                    options={
                      dimensions.region === "mena"
                        ? [
                            { text: "English", value: "en-gb" },
                            { text: "Arabic (RTL)", value: "ar" },
                          ]
                        : [
                            { text: "English", value: "en-gb" },
                            { text: "Portuguese", value: "pt-pt" },
                          ]
                    }
                    onChange={(value) => setLanguage(value)}
                  />
                </DimensionContent>
                {timeTravelEnabled && (
                  <DimensionContent label="Time Travel">
                    <DimensionRadioButton
                      active={dimensions.timeTravel}
                      labelClassName="chromatic-ignore"
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
