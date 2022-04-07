import * as cdk from "aws-cdk-lib";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

export interface StackProps extends cdk.StackProps {
  stackName: string;
  description: string;
  primaryDomain: string;
}

export class SkylarkReferenceAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: StackProps) {
    super(scope, id, props);

    const { description, stackName, primaryDomain } = props;

    const hostedZone = new HostedZone(this, "HostedZone", {
      zoneName: primaryDomain,
    });

    const wwwDomain = `www.${primaryDomain}`;

    const certificate = new Certificate(this, "Certificate", {
      domainName: primaryDomain,
      subjectAlternativeNames: [wwwDomain],
      validation: CertificateValidation.fromDnsMultiZone({
        [primaryDomain]: hostedZone,
        [wwwDomain]: hostedZone,
      }),
    });

    new NextJSLambdaEdge(this, "NextJsApp", {
      serverlessBuildOutDir: "./build",
      description,
      cloudfrontProps: {
        comment: stackName,
      },
      domain: {
        domainNames: [primaryDomain, wwwDomain],
        hostedZone,
        certificate,
      },
    });
  }
}

// Domain: media.reference-apps.skylarkplatform.io

// To request cert, Route53 needs to be in place
// - Need a DNS zone maybe is Hosted zone

/**
 * Scenarios
 *
 * 1. Constant deployment on a set domain (media.referenceapps.skylarkplatform.io)
 *    Notes:
 *      * CDK deployment would still need to configure the "media.reference-apps" portion of the URL
 *    Reasons:
 *      * We want a set URL that sales can always use
 *      * Sales may send the URL to clients
 *
 * 2. Deployed as part of a POC deployment via a workflow_dispatch (media.reference-apps.sl-develop-8.skylarkplatform.io)
 *    Notes:
 *      * "sl-develop-8.skylarkplatform.io" would be passed in through the caller workflow_dispatch or equivalent
 *      * "sl-develop-8.skylarkplatform.io" would already be registered with AWS
 *      * App deployment would still need to configure the "media.reference-apps" portion of the URL OR shared resources does this
 *    Reasons:
 *      * Each POC environment would contain its own media reference apps so customers can see the data changing
 *      * Additionally, devs can see if they break anything
 */
