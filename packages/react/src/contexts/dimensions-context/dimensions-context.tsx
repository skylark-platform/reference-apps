import { Dimensions } from "@skylark-reference-apps/lib";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useDeviceType } from "../../hooks";

interface ReducerAction {
  type: "language" | "customerType" | "deviceType" | "region" | "timeTravel";
  value: string;
}

export type DimensionsContextType = {
  dimensions: Dimensions;
  setLanguage: (language: Dimensions["language"]) => void;
  setCustomerType: (customerType: Dimensions["customerType"]) => void;
  setDeviceType: (deviceType: Dimensions["deviceType"]) => void;
  setRegion: (region: Dimensions["region"]) => void;
  setTimeTravel: (timeTravel: Dimensions["timeTravel"]) => void;
};

const dimensionsReducer = (
  state: Dimensions,
  action: ReducerAction
): Dimensions => {
  switch (action.type) {
    case "language":
      return {
        ...state,
        language: action.value,
      };
    case "customerType":
      return {
        ...state,
        customerType: action.value,
      };
    case "deviceType":
      return {
        ...state,
        deviceType: action.value,
      };
    case "region":
      return {
        ...state,
        region: action.value,
      };
    case "timeTravel":
      return {
        ...state,
        timeTravel: action.value,
      };
    default:
      throw new Error();
  }
};

const DimensionsContext = createContext<DimensionsContextType>({
  dimensions: {
    language: "en-gb",
    customerType: "standard",
    deviceType: "",
    region: "",
    timeTravel: "",
  },
  setLanguage: () => {},
  setCustomerType: () => {},
  setDeviceType: () => {},
  setRegion: () => {},
  setTimeTravel: () => {},
});

export const DimensionsContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const deviceType = useDeviceType();
  const { lang } = useTranslation();

  const [dimensions, dispatch] = useReducer(dimensionsReducer, {
    language: lang,
    customerType: "premium",
    deviceType,
    region: "europe",
    timeTravel: "",
  });

  // Automatically updates device type dimension depending on screen size
  useEffect(() => {
    dispatch({ type: "deviceType", value: deviceType });
  }, [deviceType]);

  useEffect(() => {
    dispatch({ type: "language", value: lang });
  }, [lang]);

  return (
    <DimensionsContext.Provider
      value={{
        dimensions,
        setCustomerType: (value) => dispatch({ type: "customerType", value }),
        setLanguage: (value) => {
          void setLanguage(value);
          dispatch({ type: "language", value });
        },
        setDeviceType: (value) => dispatch({ type: "deviceType", value }),
        setRegion: (value) => dispatch({ type: "region", value }),
        setTimeTravel: (value) => dispatch({ type: "timeTravel", value }),
      }}
    >
      {children}
    </DimensionsContext.Provider>
  );
};

export const useDimensions = (): DimensionsContextType => {
  const { query } = useRouter();
  const { dimensions, ...context } = useContext(DimensionsContext);

  return {
    ...context,
    dimensions: {
      ...dimensions,
      language: (query.language as string) || dimensions.language,
    },
  };
};
