import { ExtensionStorageKeys } from "../constants";
import { ExtensionMessageValueHeaders } from "../interfaces";

export const getCredentialsFromStorage = async () => {
  const uriRes = (await chrome.storage.sync.get(
    ExtensionStorageKeys.SkylarkUri
  )) as { [ExtensionStorageKeys.SkylarkUri]: string };
  const apiKeyRes = (await chrome.storage.session.get(
    ExtensionStorageKeys.SkylarkApiKey
  )) as { [ExtensionStorageKeys.SkylarkApiKey]: string };

  const uri = uriRes[ExtensionStorageKeys.SkylarkUri];
  const apiKey = apiKeyRes[ExtensionStorageKeys.SkylarkApiKey];

  return {
    uri,
    apiKey,
  };
};

export const getModifiersFromStorage =
  async (): Promise<ExtensionMessageValueHeaders> => {
    const res = (await chrome.storage.local.get(
      ExtensionStorageKeys.Modifiers
    )) as { [ExtensionStorageKeys.Modifiers]: ExtensionMessageValueHeaders };

    return res[ExtensionStorageKeys.Modifiers];
  };

export const getExtensionEnabledFromStorage = async (): Promise<boolean> => {
  const res = (await chrome.storage.local.get(
    ExtensionStorageKeys.ExtensionEnabled
  )) as { [ExtensionStorageKeys.ExtensionEnabled]: boolean };

  return res[ExtensionStorageKeys.ExtensionEnabled];
};

export const setExtensionEnabledToStorage = async (enabled: boolean) => {
  await chrome.storage.local.set({
    [ExtensionStorageKeys.ExtensionEnabled]: enabled,
  });
};
