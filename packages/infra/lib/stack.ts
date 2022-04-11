import * as cdk from "aws-cdk-lib";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import {
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

    const parentHostedZone = HostedZone.fromLookup(this, "ParentHostedZone", {
      domainName: baseDomain,
    });

    const certificate = new DnsValidatedCertificate(this, "Certificate", {
      domainName: primaryDomain,
      subjectAlternativeNames: [catchAllDomain],
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
