#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Builder } from "@sls-next/lambda-at-edge";
import { pathExists } from "fs-extra";
import { SkylarkReferenceAppStack } from "../lib/stack";
import {
  APP,
  BASE_DOMAIN,
  PRIMARY_DOMAIN,
  STACK_DESCRIPTION,
  STACK_ID,
  STACK_NAME,
} from "../lib/vars";

const main = async () => {
  if (!BASE_DOMAIN) {
    throw new Error(`Must provide environment variable "BASE_DOMAIN_NAME".`);
  }

  const appPath = `../../apps/${APP}`;
  const appExists = await pathExists(appPath);
  if (!appExists) {
    throw new Error(`App ${APP} does not exist in apps directory`);
  }

  const builder = new Builder(appPath, "./build", {
    args: ["build"],
    cwd: appPath,
    env: {
      NEXT_PUBLIC_APP_DOMAIN: PRIMARY_DOMAIN,
    },
  });

  await builder.build();

  const cdkApp = new cdk.App();
  new SkylarkReferenceAppStack(cdkApp, STACK_ID, {
    app: APP,
    stackName: STACK_NAME,
    description: STACK_DESCRIPTION,
    primaryDomain: PRIMARY_DOMAIN,
    baseDomain: BASE_DOMAIN,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
  });

  // eslint-disable-next-line no-console
  console.log(`::set-output name=stack-name::${STACK_NAME}`);
  // eslint-disable-next-line no-console
  console.log(`::set-output name=app::${APP}`);
  // eslint-disable-next-line no-console
  console.log(`::set-output name=domain::${PRIMARY_DOMAIN}`);
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
