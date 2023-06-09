import React from "react";
import clsx from "clsx";
import { useAvailabilityDimensionsWithValues } from "../hooks/useAvailabilityDimensionsValues";
import { ExtensionMessageValueHeaders } from "../interfaces";
import { DimensionCombobox } from "./dimensionCombobox";
import { Input } from "./input";

interface AvailabilityModifierProps {
  className: string;
  skylarkCreds: {
    uri: string;
    apiKey: string;
  };
  activeModifiers: ExtensionMessageValueHeaders;
  disabled?: boolean;
  setActiveModifiers: (m: ExtensionMessageValueHeaders) => void;
}

const headerClassName = "font-heading text-lg font-bold";

export const AvailabilityModifier = ({
  className,
  skylarkCreds,
  activeModifiers,
  disabled,
  setActiveModifiers,
}: AvailabilityModifierProps) => {
  const { dimensions, isDimensionsValuesLoading } =
    useAvailabilityDimensionsWithValues(skylarkCreds.uri, skylarkCreds.apiKey);

  console.log({ dimensions });

  return (
    <div className={clsx("w-full h-full relative", className)}>
      <div className="mt-4">
        <h2 className={clsx(headerClassName, "mb-4")}>{`Time Window`}</h2>
        <Input
          label="Time Travel"
          name="time-travel"
          type={"datetime-local"}
          value={activeModifiers.timeTravel}
          onChange={(timeTravel) =>
            setActiveModifiers({
              ...activeModifiers,
              timeTravel,
            })
          }
        />
      </div>
      <div className="mt-4">
        <h2 className={clsx(headerClassName, "mb-2")}>{`Audience`}</h2>
        <div className="grid grid-cols-2 gap-2">
          {isDimensionsValuesLoading &&
            (dimensions || Array.from({ length: 2 })).map((_, i) => (
              <div
                className="animate-pulse w-full mt-2 h-12 rounded-lg bg-gray-300"
                key={`skeleton-${i}`}
              ></div>
            ))}
          {!isDimensionsValuesLoading &&
            dimensions?.map((dimension) => {
              const options = dimension.values.map(({ slug, title }) => ({
                value: slug,
                label: title || slug,
              }));
              return (
                <div className="my-2 w-full" key={dimension.uid}>
                  <DimensionCombobox
                    key={dimension.uid}
                    label={dimension.title || dimension.slug}
                    options={options}
                    selectedValue={activeModifiers.dimensions[dimension.slug]}
                    onChange={(opt) =>
                      setActiveModifiers({
                        ...activeModifiers,
                        dimensions: {
                          ...activeModifiers.dimensions,
                          [dimension.slug]: opt ? opt.value : "",
                        },
                      })
                    }
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
