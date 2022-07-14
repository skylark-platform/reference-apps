const gitBranch = process.env.GIT_BRANCH;
const baseDomain = process.env.BASE_DOMAIN_NAME;

const strFromArr = (arr: any[], separator: string) =>
  arr.filter((item) => !!item).join(separator);


export const APP = process.env.APP || "media";
export const GIT_BRANCH = gitBranch && gitBranch.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");

export const BASE_DOMAIN = process.env.BASE_DOMAIN_NAME;
export const PRIMARY_DOMAIN = strFromArr(
  [
    APP,
    GIT_BRANCH !== "main" && GIT_BRANCH,
    "apps",
    baseDomain,
  ],
  "."
);

export const STACK_ID = strFromArr([GIT_BRANCH, APP, "skylark-reference-apps"], "-");
export const STACK_NAME = process.env.STACK_NAME || strFromArr(["sl-ref-apps", APP, GIT_BRANCH], "-");
export const STACK_DESCRIPTION = `${APP} Skylark Reference App deployed via CDK`;
