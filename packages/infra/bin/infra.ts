#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SkylarkReferenceAppStack } from "../lib/stack";
import { Builder } from "@sls-next/lambda-at-edge";
import { pathExists } from "fs-extra";

const app = process.env.APP || "media";
const gitBranch = process.env.GIT_BRANCH;
const baseDomain = process.env.BASE_DOMAIN_NAME;

if (!baseDomain) {
  throw new Error(`Must provide environment variable "BASE_DOMAIN_NAME".`);
}

const strFromArr = (arr: any[], separator: string) =>
  arr.filter((item) => !!item).join(separator);

const main = async () => {
  const appPath = `../../apps/${app}`;
  const appExists = await pathExists(appPath);
  if (!appExists) {
    throw new Error(`App ${app} does not exist in apps directory`);
  }

  const sanitzedGitBranch =
    gitBranch && gitBranch.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");
  const stackName =
    process.env.STACK_NAME || strFromArr([sanitzedGitBranch, app], "-");
  const primaryDomain = strFromArr([app, "apps", baseDomain], ".");
  const description = `${app} Skylark Reference App deployed via CDK`;

  const builder = new Builder(appPath, "./build", {
    args: ["build"],
    cwd: appPath,
  });

  await builder.build();

  const cdkApp = new cdk.App();
  new SkylarkReferenceAppStack(cdkApp, `${stackName}-skylark-reference-app`, {
    app,
    stackName,
    description,
    primaryDomain,
    baseDomain,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
  });

  console.log(`::notice::${app} stack name: ${stackName}`);
  console.log(`::set-output name=stack-name::${stackName}`);
  console.log(`::set-output name=domain::${primaryDomain}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
