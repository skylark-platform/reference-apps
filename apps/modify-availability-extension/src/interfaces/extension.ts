export enum ExtensionMessageType {
  UpdateHeaders = "UpdateHeaders",
  GetActiveHeaders = "GetActiveHeaders",
  ClearHeaders = "ClearHeaders",
  RefreshTab = "RefreshTab",
  TogglePaused = "TogglePaused",
}

export type ExtensionMessageValueHeaders = {
  timeTravel: string;
  dimensions: Record<string, string>;
};

export type ExtensionMessage =
  | {
      type: ExtensionMessageType.UpdateHeaders;
      value: ExtensionMessageValueHeaders;
    }
  | {
      type:
        | ExtensionMessageType.GetActiveHeaders
        | ExtensionMessageType.ClearHeaders
        | ExtensionMessageType.TogglePaused
        | ExtensionMessageType.RefreshTab;
    };
