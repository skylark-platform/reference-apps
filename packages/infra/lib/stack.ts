import * as cdk from "aws-cdk-lib";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import {
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { CachePolicy } from "aws-cdk-lib/aws-cloudfront";

export interface StackProps extends cdk.StackProps {
  app: string;
  stackName: string;
  description: string;
  primaryDomain: string;
  baseDomain: string;
}

export class SkylarkReferenceAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: StackProps) {
    super(scope, id, props);
    const { app, description, stackName, primaryDomain, baseDomain } = props;

    const catchAllDomain = `*.${primaryDomain}`;
    const wwwDomain = `www.${primaryDomain}`;

    const parentHostedZone = HostedZone.fromLookup(this, "ParentHostedZone", {
      domainName: baseDomain,
    });

    const certificate = new DnsValidatedCertificate(this, "Certificate", {
      // Use a shorter domain for the certificate due to the 64 character limit
      domainName: `${app}.${baseDomain}`,
      subjectAlternativeNames: [primaryDomain, catchAllDomain],
      hostedZone: parentHostedZone,
      validation: CertificateValidation.fromDns(parentHostedZone),
    });

    const nextJsApp = new NextJSLambdaEdge(this, "NextJsApp", {
      serverlessBuildOutDir: "./build",
      description,
      cloudfrontProps: {
        comment: stackName,
      },
      domain: {
        domainNames: [primaryDomain, wwwDomain],
        hostedZone: parentHostedZone,
        certificate,
      },
      // Use a default cache policy so we don't hit the limit of 20 cache policies per AWS account
      // Not recommended for production deployments
      nextImageCachePolicy: CachePolicy.CACHING_DISABLED as CachePolicy,
      nextLambdaCachePolicy: CachePolicy.CACHING_DISABLED as CachePolicy,
      withLogging: true,
    });
    // https://github.com/serverless-nextjs/serverless-next.js/issues/2432
    const defaultLambda = nextJsApp.defaultNextLambda.node
      .defaultChild as cdk.CfnResource;
    defaultLambda.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
    const apiLambda = nextJsApp.nextApiLambda?.node.defaultChild as
      | cdk.CfnResource
      | undefined;
    apiLambda?.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
  }
}
