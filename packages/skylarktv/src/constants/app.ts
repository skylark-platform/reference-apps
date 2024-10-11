import { DeviceTypes, DimensionKey } from "../lib/interfaces";

export const ALL_DIMENSION_QUERY_KEYS: DimensionKey[] =
  Object.values(DimensionKey);

export const LOCAL_STORAGE = {
  uri: "skylarktv:uri",
  apikey: "skylarktv:apikey",
};

const defaultAppConfig: {
  name: string;
  colours: {
    primary: string;
    accent: string;
  };
  favicon?: string;
  showBySkylark: boolean;
  dimensions: Record<
    DimensionKey.Region | DimensionKey.CustomerType | DimensionKey.DeviceType,
    { values: { text: string; value: string }[] }
  >;
  withIntercom: boolean;
  hideDimensionsSettings: boolean;
  defaultLanguage?: string;
  header?: {
    logo: {
      src: string;
      alt: string;
    };
    hideAppName: boolean;
  };
  loadingScreen?: {
    logo: {
      src: string;
      alt: string;
    };
    hideAppName: boolean;
  };
} = {
  name: "StreamTV",
  colours: {
    primary: "#5b45ce",
    accent: "#ff385c",
  },
  showBySkylark: true,
  withIntercom: true,
  hideDimensionsSettings: false,
  dimensions: {
    [DimensionKey.CustomerType]: {
      values: [
        { text: "Premium", value: "premium" },
        { text: "Standard", value: "standard" },
        { text: "Kids", value: "kids" },
      ],
    },
    [DimensionKey.DeviceType]: {
      values: [
        { text: "Desktop", value: DeviceTypes.PC },
        { text: "Mobile", value: DeviceTypes.Smartphone },
      ],
    },
    [DimensionKey.Region]: {
      values: [
        { text: "Europe", value: "europe" },
        { text: "North America", value: "north-america" },
        {
          text: "Middle East",
          value: "mena",
        },
      ],
    },
  },
};

export const CLIENT_APP_CONFIG: typeof defaultAppConfig = {
  ...defaultAppConfig,
};
