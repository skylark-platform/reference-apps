export const COGNITO_REGION = process.env.COGNITO_AWS_REGION as string;
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID as string;
export const COGNITO_USER_POOL_CLIENT_ID = process.env
  .COGNITO_CLIENT_ID as string;
export const COGNITO_IDENTITY_POOL_ID = process.env
  .COGNITO_IDENTITY_POOL_ID as string;
export const WORKFLOW_SERVICE_WATCH_BUCKET = process.env
  .AMPLIFY_STORAGE_BUCKET as string;
export const COGNITO_EMAIL = process.env.COGNITO_EMAIL as string;
export const COGNITO_PASSWORD = process.env.COGNITO_PASSWORD as string;
export const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY as string;
export const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID as string;
export const UNLICENSED_BY_DEFAULT =
  (process.env.DEFAULT_UNLICENSED as string) === "true";
export const CREATE_ONLY = process.env.CREATE_ONLY === "true";
export const CHECK_MISSING = (process.env.CHECK_MISSING as string) === "true";

export const CREATE_OBJECT_CHUNK_SIZE = 1;
export const CONCURRENT_CREATE_REQUESTS_NUM = 50;

export const ENUMS = {
  SET_TYPES: [
    "PAGE",
    "COLLECTION",
    "SLIDER",
    "RAIL",
    "RAIL_WITH_SYNOPSIS",
    "RAIL_PORTRAIT",
    "RAIL_INSET",
    "RAIL_MOVIE",
    "GRID",
    "GRID_PORTRAIT",
  ] as string[],
  IMAGE_TYPES: [
    "BACKGROUND",
    "FEATURE",
    "FOOTER",
    "HEADER",
    "MAIN",
    "POSTER",
    "POST_LIVE",
    "PREVIEW",
    "PRE_LIVE",
    "THUMBNAIL",
    "CHARACTER",
  ] as string[],
};
