import React, { useState } from "react";
import clsx from "clsx";
import { useAvailabilityDimensionsWithValues } from "../hooks/useAvailabilityDimensionsValues";
import { DimensionCombobox } from "./dimensionCombobox";

interface AvailabilityModifierProps {
  className: string;
}

const headerClassName = "font-heading text-lg font-bold";

export const AvailabilityModifier = ({
  className,
}: AvailabilityModifierProps) => {
  const { dimensions } = useAvailabilityDimensionsWithValues();

  const [activeDimensions, setActiveDimensions] = useState<
    Record<string, string>
  >({});

  console.log({ dimensions });

  return (
    <div className={clsx("w-full h-full", className)}>
      <div className="mt-4">
        <h2 className={clsx(headerClassName, "mb-4")}>{`Time Window`}</h2>
        <div className="w-full relative mt-2">
          <label
            className="absolute left-2 top-0 -translate-y-1/2 transform text-xs font-medium uppercase md:left-3  text-manatee-500"
            htmlFor="time-travel"
          >
            <span className="bg-white px-2">{`Time Travel`}</span>
          </label>
          <input
            className="form-input text-sm p-3 md:p-5 rounded-lg border border-gray-200 text-gray-500 w-full"
            name="time-travel"
            type="datetime-local"
          />
        </div>
      </div>
      <div className="mt-4">
        <h2 className={clsx(headerClassName, "mb-2")}>{`Audience`}</h2>
        <div className="grid grid-cols-2 gap-2">
          {dimensions?.map((dimension) => {
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
                  selectedValue={activeDimensions[dimension.slug]}
                  onChange={(opt) =>
                    setActiveDimensions({
                      ...activeDimensions,
                      [dimension.slug]: opt ? opt.value : "",
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
