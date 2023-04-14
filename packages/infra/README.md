# @skylark-reference-apps/infra

## Description

`@skylark-reference-apps/infra` is designed to deploy a Next.js app to AWS in the same account as Skylark is deployed.

This requirement exists because:

- We use the [Route 53 Hosted Zone][route-53-hosted-zone] that the Skylark has deployed for the apps domain
- A `[app].apps.` entry is added to the Skylark's DNS settings
- A DNS validated [Certificate][route-53-certificate] using the Hosted Zone is created for the new domain

Removing this requirement would require little work, you would need to either:

1. Remove the custom domain from the Serverless Next.js's CDK, meaning it would use an auto generated Cloudfront URL
2. Create/supply your own [Hosted Zone][route-53-hosted-zone] and [Certificate][route-53-certificate]

## Usage

1. Install dependencies

```bash
yarn
```

2. Configure your terminal to be authenticated with the target AWS account

3. Export required environment variables

```bash
export APP=saas
export BASE_DOMAIN_NAME=
export NEXT_PUBLIC_SKYLARK_API_URL=
export COGNITO_EMAIL=
export COGNITO_PASSWORD=
export COGNITO_AWS_REGION=
export COGNITO_CLIENT_ID=
export COGNITO_USER_POOL_ID=
```

_Information about these can be found in the [Environment Variables document][environment-variables]._

4. Bootstrap and deploy CDK

```
yarn cdk bootstrap && yarn cdk deploy
```

5. Delete the stack (you can also do this via Cloudformation)

```
yarn cdk destroy
```

### With GitHub Actions

We have a composite GitHub Action which will deploy a reference app into the AWS account where your Skylark resides.

[Deploy GitHub Action][deploy-github-action].

```yaml
- uses: actions/checkout@v3
  with:
    repository: ostmodern/skylark-reference-apps
    ref: main
- uses: ./.github/actions/deploy
  with:
    base-domain: ${{ SECRETS.SKYLARK_BASE_DOMAIN }}
    skylark-api-url: ${{ secrets.SKYLARK_API_URL }}
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    cognito-aws-region: ${{ secrets.COGNITO_AWS_REGION }}
    cognito-client-id: ${{ secrets.COGNITO_CLIENT_ID }}
    cognito-user-pool-id: ${{ secrets.COGNITO_USER_POOL_ID }}
    cognito-email: ${{ secrets.COGNITO_EMAIL }}
    cognito-password: ${{ secrets.COGNITO_PASSWORD }}
```

_Note: Information on how to get the values for the `secrets.` variables are found in the [Environment Variables document][environment-variables]._

## Commands

- `yarn build` - Compile TypeScript to js
- `yarn watch` - Watch for changes and compile
- `yarn cdk bootstrap` - Deploys the CDK Toolkit staging stack
- `yarn cdk deploy` - Deploys the stack

Find all `cdk` commands in the [AWS documentation][cdk-commands].

[serverless-nextjs-cdk]: https://serverless-nextjs.com/docs/cdkconstruct/
[cdk-commands]: https://docs.aws.amazon.com/cdk/v2/guide/cli.html
[deploy-github-action]: ../../.github/actions/deploy/action.yml
[environment-variables]: ../../docs/environment-variables.md
[route-53-hosted-zone]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html
[route-53-certificate]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html
