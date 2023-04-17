import { graphQLClient } from "@skylark-reference-apps/lib";
import { gql } from "graphql-request";
import { EnumType, jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { ENUMS } from "../../constants";
import { pause } from "./utils";

const GET_ACCOUNT_STATUS = gql`
  query GET_ACCOUNT_STATUS {
    getActivationStatus {
      active_version
      update_in_progress
      update_started_at
    }
  }
`

const ACTIVATE_CONFIGURATION_VERSION = gql`
mutation ACTIVATE_CONFIGURATION_VERSION($version: Int!) {
  activateConfigurationVersion(version: $version) {
    messages
    version
  }
}`

const getActivationStatus = async() => {
  const res = await graphQLClient.request<{
    getActivationStatus: { active_version: number, update_in_progress: boolean, update_started_at: string };
  }>(GET_ACCOUNT_STATUS);

  return res.getActivationStatus;
}

const activateConfigurationVersion = async(version: number) => {
  const res = await graphQLClient.request<{
    activateConfigurationVersion: { version: number, messages: string };
  }>(ACTIVATE_CONFIGURATION_VERSION, { version });

  return res.activateConfigurationVersion;
}

const updateSetTypes = async (version?: number) => {
  const mutation = {
    mutation: {
      __name: "UPDATE_SET_TYPES",
      __variables: {
        version: "Int!",
      },
      editEnumConfiguration: {
        __args: {
          version: new VariableType("version"),
          enums: {
            name: "SetType",
            operation: new EnumType("UPDATE"),
            values: ENUMS.SET_TYPES,
          },
        },
        version: true,
        messages: true,
      },
    },
  };

  const graphQLQuery = jsonToGraphQLQuery(mutation);

  const { editEnumConfiguration } = await graphQLClient.request<{
    editEnumConfiguration: { version: number, messages: string };
  }>(graphQLQuery , { version })

  return {
    version: editEnumConfiguration.version,
  }
};

export const updateSkylarkSchema = async () => {
  const { active_version: initialVersion } = await getActivationStatus();

  const { version: updatedVersion } = await updateSetTypes(initialVersion);

  await activateConfigurationVersion(updatedVersion);

  let activeVersion = initialVersion;
  while (`${activeVersion}` !== `${updatedVersion}`) {
    // eslint-disable-next-line no-await-in-loop
    const { active_version: currentVersion } = await getActivationStatus();
    activeVersion = currentVersion;
    // eslint-disable-next-line no-await-in-loop
    await pause(5000);
  }

  return { version: activeVersion};
}
