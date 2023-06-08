import React, { useState } from "react";
import { useAvailabilityDimensionsWithValues } from "../hooks/useAvailabilityDimensionsValues";
import { DimensionContent } from "./dimensionContent";
import { DimensionCombobox } from "./dimensionCombobox";

const headerClassName = "font-heading mb-2 text-lg font-bold";

export const AvailabilityModifier = () => {
  const { dimensions } = useAvailabilityDimensionsWithValues();

  const [activeDimensions, setActiveDimensions] = useState<
    Record<string, string>
  >({});

  console.log({ dimensions });

  return (
    <div className="w-full mt-2">
      <div className="my-2">
        <h2 className={headerClassName}>{`Time Window`}</h2>
        <div className="w-full relative mt-2">
          <label
            className="absolute left-2 top-0 -translate-y-1/2 transform text-xs font-medium uppercase md:left-3"
            htmlFor="time-travel"
          >
            <span className="bg-white px-2">{`Time Travel`}</span>
          </label>
          <input
            className="form-input text-sm p-3 md:p-5 rounded-lg border border-gray-200 text-gray-500 min-w-1/2"
            name="time-travel"
            type="datetime-local"
          />
        </div>
      </div>
      <div className="mt-4">
        <h2 className={headerClassName}>{`Audience`}</h2>
        <div className="grid grid-cols-2 gap-2">
          {dimensions?.map((dimension) => {
            const options = dimension.values.map(({ slug, title }) => ({
              value: slug,
              label: title || slug,
            }));
            return (
              <div className="my-2 w-full" key={dimension.uid}>
                <DimensionContent label={dimension.title || dimension.slug}>
                  <DimensionCombobox
                    key={dimension.uid}
                    options={options}
                    selectedValue={activeDimensions[dimension.slug]}
                    onChange={({ value }) =>
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
          {dimensions?.map((dimension) => {
            const options = dimension.values.map(({ slug, title }) => ({
              value: slug,
              label: title || slug,
            }));
            return (
              <div className="my-2 w-full" key={dimension.uid}>
                <DimensionContent label={dimension.title || dimension.slug}>
                  <DimensionCombobox
                    key={dimension.uid}
                    options={options}
                    selectedValue={activeDimensions[dimension.slug]}
                    onChange={({ value }) =>
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
        </div>
      </div>
    </div>
  );
};
