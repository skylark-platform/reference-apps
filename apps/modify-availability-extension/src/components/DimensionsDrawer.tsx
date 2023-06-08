import React, { useState } from "react";
import { DimensionToggle } from "./dimensionToggle";
import { SkylarkBranding } from "./skylarkBranding";
import { useAvailabilityDimensionsWithValues } from "../hooks/useAvailabilityDimensionsValues";
import { DimensionCombobox } from "./dimensionCombobox";
import { DimensionContent } from "./dimensionContent";

interface DimensionSettingsProps {
  show?: boolean;
  skylarkApiUrl?: string;
}

const sendMessage = async () => {
  await chrome.runtime.sendMessage(true);
};

const updateAvailabilityHeaders = async ({
  dimensions,
  timeTravel,
}: {
  dimensions: Record<string, string>;
  timeTravel?: string;
}) => {
  const dimensionHeaders = Object.entries(dimensions).reduce(
    (prev, [dimensionSlug, valueSlug]) => {
      if (!valueSlug) {
        return prev;
      }

      return {
        ...prev,
        [`x-sl-dimension-${dimensionSlug}`]: valueSlug,
      };
    },
    {}
  );

  const headers: HeadersInit = timeTravel
    ? {
        ...dimensionHeaders,
        "x-time-travel": timeTravel,
      }
    : dimensionHeaders;

  console.log({ headers });

  const res = await chrome.runtime.sendMessage({
    type: "headers",
    value: headers,
  });

  console.log({ res });
};

export const DimensionSettings: React.FC<DimensionSettingsProps> = ({
  show: propShow = false,
  skylarkApiUrl,
}) => {
  const [show, setShow] = useState(propShow);

  const [activeDimensions, setActiveDimensions] = useState<
    Record<string, string>
  >({});

  const { dimensions, isLoading, error } =
    useAvailabilityDimensionsWithValues();

  return (
    <>
      <div
        className={`fixed bottom-0 right-sm-gutter z-20 flex transition-opacity duration-500 md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter ${
          show ? "opacity-0" : "opacity-100"
        }`}
      >
        <DimensionToggle variant="open" onClick={() => setShow(true)} />
      </div>
      {show && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 block bg-white font-skylark-branding md:h-auto`}
          key="dimension-settings"
        >
          <div className="absolute -top-9 right-sm-gutter flex md:right-md-gutter lg:right-lg-gutter xl:right-xl-gutter">
            <DimensionToggle variant="close" onClick={() => setShow(false)} />
          </div>
          <div className="relative h-full overflow-y-auto px-sm-gutter py-4 md:px-md-gutter md:py-8 md:pb-20  lg:px-lg-gutter xl:px-xl-gutter">
            <div className="mb-4 flex items-center justify-between">
              <div className="group flex items-center">
                <SkylarkBranding className="w-12 pr-4" />
                <span>Availability Inspector</span>
                <div className="flex gap-2 ">
                  <button
                    onClick={() =>
                      updateAvailabilityHeaders({
                        dimensions: activeDimensions,
                      })
                    }
                  >
                    UPDATE HEADERS
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-2">
                <DimensionContent label="Time Travel"></DimensionContent>
              </div>
              <div className="hidden lg:col-span-2 lg:block" />
              {dimensions?.map((dimension) => {
                const options = dimension.values.map((value) => value.slug);
                return (
                  <div key={dimension.uid}>
                    <DimensionContent label={dimension.title || dimension.slug}>
                      <DimensionCombobox
                        key={dimension.uid}
                        options={options}
                        selected={activeDimensions[dimension.slug]}
                        onChange={(value) =>
                          setActiveDimensions({
                            ...activeDimensions,
                            [dimension.slug]: value,
                          })
                        }
                      />
                    </DimensionContent>
                  </div>
                );
              })}
              {/* <DimensionContent label="Language">
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
              </DimensionContent> */}
              {/* {timeTravelEnabled && (
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
                )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DimensionSettings;
