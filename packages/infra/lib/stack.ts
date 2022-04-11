import * as cdk from "aws-cdk-lib";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import {
  HostedZone,
  NsRecord,
  RecordSet,
  RecordTarget,
  RecordType,
} from "aws-cdk-lib/aws-route53";
import {
  Certificate,
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";

export interface StackProps extends cdk.StackProps {
  stackName: string;
  description: string;
  primaryDomain: string;
  baseDomain: string;
}

export class SkylarkReferenceAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: StackProps) {
    super(scope, id, props);
    const { description, stackName, primaryDomain, baseDomain } = props;

    const catchAllDomain = `*.${primaryDomain}`;
    const wwwDomain = `www.${primaryDomain}`;

    // media.apps.legacy-skylark.io
    // www.media.apps

    // const hostedZone = new HostedZone(this, "HostedZone", {
    //   zoneName: primaryDomain,
    // });

    const parentHostedZone = HostedZone.fromLookup(this, "ParentHostedZone", {
      domainName: baseDomain,
    });

    // new NsRecord(this, "NSRecord", {
    //   zone: parentHostedZone,
    //   recordName: primaryDomain,
    //   values: hostedZone.hostedZoneNameServers as string[],
    // });

    const certificate = new DnsValidatedCertificate(this, "Certificate", {
      domainName: catchAllDomain,
      subjectAlternativeNames: [primaryDomain],
      hostedZone: parentHostedZone,
      validation: CertificateValidation.fromDns(parentHostedZone),
    });

    new NextJSLambdaEdge(this, "NextJsApp", {
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
