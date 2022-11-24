import { isString } from "lodash";

export const logFoundAndMissingObjects = (
  objectTypes: { [id: string]: string } | string,
  totalObjects: number,
  totalExistingObjects: number
) => {
  const uniqueTypes = isString(objectTypes)
    ? objectTypes
    : [...new Set(Object.values(objectTypes))].join(", ");
  // eslint-disable-next-line no-console
  console.log(
    `[${uniqueTypes}] Found ${totalExistingObjects}, ${
      totalObjects - totalExistingObjects
    } missing`
  );
};

export const logFoundObject = (
  objectType: string,
  lookupValue: string,
  lookupProperty: string
) => {
  // eslint-disable-next-line no-console
  console.log(`[${objectType}] Found "${lookupValue}" (${lookupProperty})`);
};

export const logMissingObject = (
  objectType: string,
  lookupValue: string,
  lookupProperty: string
) => {
  // eslint-disable-next-line no-console
  console.log(`[${objectType}] Missing "${lookupValue}" (${lookupProperty})`);
};

export const logMediaObjectsUploaded = (
  currentAmount: number,
  totalAmount: number
) => {
  // eslint-disable-next-line no-console
  console.log(`Media objects uploaded: ${currentAmount}/${totalAmount}`);
};

export const logUpdatingSetsNotImplemented = () => {
  // eslint-disable-next-line no-console
  console.warn("Updating sets is not implemented");
};
