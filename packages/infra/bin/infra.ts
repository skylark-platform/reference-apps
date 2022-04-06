#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SkylarkReferenceAppStack } from "../lib/stack";
import { Builder } from "@sls-next/lambda-at-edge";

console.log("args", process.argv);

// Run the serverless builder, this could be done elsewhere in your workflow

const app = process.env.APP || "media";
const gitBranch = process.env.GIT_BRANCH;
const sanitzedGitBranch =
  gitBranch && gitBranch.toLowerCase().replace(/\./g, "-");

const stackName = [app, sanitzedGitBranch].filter((item) => !!item).join("-");
const description = `${app} Skylark Reference App deployed via CDK`;
const appPath = `../../apps/${app}`;

const builder = new Builder(appPath, "./build", {
  args: ["build"],
  cwd: appPath,
});
builder
  .build()
  .then(() => {
    const app = new cdk.App();
    new SkylarkReferenceAppStack(app, "skylark-reference-app", {
      stackName,
      description,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: "us-east-1",
      },
    });
  })
  .catch((e: any) => {
    console.log(e);
    process.exit(1);
  });
