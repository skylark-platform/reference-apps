import { graphQLClient } from "@skylark-reference-apps/lib";
import { gql } from "graphql-request";
import {
  EnumType,
  jsonToGraphQLQuery,
  VariableType,
} from "json-to-graphql-query";
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
`;

const ACTIVATE_CONFIGURATION_VERSION = gql`
  mutation ACTIVATE_CONFIGURATION_VERSION($version: Int!) {
    activateConfigurationVersion(version: $version) {
      messages
      version
    }
  }
`;

const GET_ENUM_VALUES = gql`
  query GET_ENUM_VALUES($name: String!) {
    __type(name: $name) {
      enumValues {
        name
      }
    }
  }
`;

const GET_OBJECT_TYPES = gql`
  query GET_OBJECT_TYPES {
    objectTypes: __type(name: "Metadata") {
      possibleTypes {
        name
      }
    }
  }
`;

const getActivationStatus = async () => {
  const res = await graphQLClient.uncachedRequest<{
    getActivationStatus: {
      active_version: string;
      update_in_progress: boolean;
      update_started_at: string;
    };
  }>(GET_ACCOUNT_STATUS);

  return res.getActivationStatus;
};

export const activateConfigurationVersion = async (version: number) => {
  const res = await graphQLClient.uncachedRequest<{
    activateConfigurationVersion: { version: number; messages: string };
  }>(ACTIVATE_CONFIGURATION_VERSION, { version });

  return res.activateConfigurationVersion;
};

const getObjectTypes = async () => {
  const data = await graphQLClient.uncachedRequest<{
    objectTypes?: {
      possibleTypes: {
        name: string;
      }[];
    };
  }>(GET_OBJECT_TYPES);

  const objectTypes =
    data?.objectTypes?.possibleTypes.map(({ name }) => name) || [];

  return objectTypes;
};

const getEnumValues = async (name: string) => {
  const data = await graphQLClient.uncachedRequest<{
    __type: { enumValues: { name: string }[] };
  }>(GET_ENUM_VALUES, { name });

  // eslint-disable-next-line no-underscore-dangle
  const values = data.__type.enumValues.map((e) => e.name.toUpperCase());
  return values;
};

export const updateEnumTypes = async (
  enumName: string,
  values: string[],
  version: number | string,
): Promise<{ version: number | null }> => {
  const existingValues = await getEnumValues(enumName);
  if (values.every((value) => existingValues.includes(value.toUpperCase()))) {
    return {
      version: null,
    };
  }

  const mutation = {
    mutation: {
      __name: `UPDATE_${enumName}`,
      __variables: {
        version: "Int!",
      },
      editEnumConfiguration: {
        __args: {
          version: new VariableType("version"),
          enums: {
            name: enumName,
            operation: new EnumType("UPDATE"),
            values,
          },
        },
        version: true,
        messages: true,
      },
    },
  };

  const graphQLQuery = jsonToGraphQLQuery(mutation);

  // eslint-disable-next-line no-console
  console.log(
    `--- Modifying enum "${enumName}"  to have values: `,
    values.join(", "),
  );

  const { editEnumConfiguration } = await graphQLClient.uncachedRequest<{
    editEnumConfiguration: { version: number; messages: string };
  }>(graphQLQuery, { version });

  return {
    version: editEnumConfiguration.version,
  };
};

const runFieldUpdateQuery = async (query: string, version?: number) => {
  try {
    const { editFieldConfiguration } = await graphQLClient.uncachedRequest<{
      editFieldConfiguration: { version: number; messages: string };
    }>(query, { version });
    return {
      version: editFieldConfiguration.version,
    };
  } catch (e) {
    const err = e as { response?: { errors?: { message: string }[] } };
    // Ignore error if all fields have been added already
    if (
      err?.response?.errors &&
      err.response.errors.length === 1 &&
      err.response.errors[0].message.startsWith(
        "Some fields already exist on type",
      )
    ) {
      return {
        version,
      };
    }
    throw e;
  }
};

const addCustomEpisodeFields = (version: number) => {
  const UPDATE_FIELDS = gql`
    mutation UPDATE_FIELDS($version: Int!) {
      editFieldConfiguration(
        version: $version
        fields: {
          name: "audience_rating"
          operation: CREATE
          type: STRING
          is_translatable: false
        }
        object_class: Episode
      ) {
        messages
        version
      }
    }
  `;

  return runFieldUpdateQuery(UPDATE_FIELDS, version);
};

const addCustomSeasonFields = (version: number) => {
  const UPDATE_FIELDS = gql`
    mutation UPDATE_FIELDS($version: Int!) {
      editFieldConfiguration(
        version: $version
        fields: [
          {
            name: "preferred_image_type"
            operation: CREATE
            type: ENUM
            enum_name: "ImageType"
            is_translatable: false
          }
          {
            name: "audience_rating"
            operation: CREATE
            type: STRING
            is_translatable: false
          }
        ]
        object_class: Season
      ) {
        messages
        version
      }
    }
  `;

  return runFieldUpdateQuery(UPDATE_FIELDS, version);
};

const addCustomBrandFields = (version: number) => {
  const UPDATE_FIELDS = gql`
    mutation UPDATE_FIELDS($version: Int!) {
      editFieldConfiguration(
        version: $version
        fields: {
          name: "audience_rating"
          operation: CREATE
          type: STRING
          is_translatable: false
        }
        object_class: Brand
      ) {
        messages
        version
      }
    }
  `;

  return runFieldUpdateQuery(UPDATE_FIELDS, version);
};

const addCustomMovieFields = (version: number) => {
  const UPDATE_FIELDS = gql`
    mutation UPDATE_FIELDS($version: Int!) {
      editFieldConfiguration(
        version: $version
        fields: [
          {
            name: "budget"
            operation: CREATE
            type: STRING
            is_translatable: false
          }
          {
            name: "audience_rating"
            operation: CREATE
            type: STRING
            is_translatable: false
          }
        ]
        object_class: Movie
      ) {
        messages
        version
      }
    }
  `;

  return runFieldUpdateQuery(UPDATE_FIELDS, version);
};

const addAppConfigObjectType = async (version?: number) => {
  const objectTypes = await getObjectTypes();

  if (
    objectTypes.includes("AppConfig") ||
    objectTypes.includes("StreamtvConfig")
  ) {
    // eslint-disable-next-line no-console
    return { version };
  }

  const CREATE_APP_CONFIG_OBJECT_TYPE = gql`
    mutation CREATE_APP_CONFIG_OBJECT_TYPE($version: Int!) {
      createObjectType(
        version: $version
        object_types: {
          name: "app_config"
          relationships: [
            {
              operation: CREATE
              to_class: SkylarkImage
              relationship_name: "logo"
              reverse_relationship_name: "app_config"
            }
          ]
          fields: [
            { name: "app_name", operation: CREATE, type: STRING }
            { name: "featured_page_url", operation: CREATE, type: URL }
            { name: "primary_color", operation: CREATE, type: STRING }
            { name: "accent_color", operation: CREATE, type: STRING }
            { name: "google_tag_manager_id", operation: CREATE, type: STRING }
          ]
        }
      ) {
        messages
        version
      }
    }
  `;

  const { createObjectType } = await graphQLClient.uncachedRequest<{
    createObjectType: { version: number; messages: string };
  }>(CREATE_APP_CONFIG_OBJECT_TYPE, { version });

  return {
    version: createObjectType.version,
  };
};

export const waitForUpdatingSchema = async () => {
  const {
    active_version: activeVersion,
    update_in_progress: updateInProgress,
  } = await getActivationStatus();

  let updatedVersion = activeVersion;

  if (updateInProgress) {
    let currentlyUpdating = true;
    while (currentlyUpdating) {
      // eslint-disable-next-line no-await-in-loop
      await pause(2500);
      const {
        update_in_progress: updateStillRunning,
        active_version: newVersion,
      } =
        // eslint-disable-next-line no-await-in-loop
        await getActivationStatus();
      updatedVersion = newVersion;
      currentlyUpdating = updateStillRunning;
    }
  }

  return parseInt(updatedVersion, 10);
};

export const updateSkylarkSchema = async ({
  assetTypes,
  imageTypes,
  tagTypes,
}: {
  assetTypes: string[];
  imageTypes: string[];
  tagTypes: string[];
}) => {
  const initialVersion = await waitForUpdatingSchema();

  let updatedVersion = initialVersion;

  const { version: setTypeVersion } = await updateEnumTypes(
    "SetType",
    ENUMS.SET_TYPES,
    updatedVersion,
  );
  if (setTypeVersion) updatedVersion = setTypeVersion;

  const { version: imageTypeVersion } = await updateEnumTypes(
    "ImageType",
    [...new Set([...ENUMS.IMAGE_TYPES, ...imageTypes])] as string[],
    updatedVersion,
  );
  if (imageTypeVersion) updatedVersion = imageTypeVersion;

  if (assetTypes.length > 0) {
    const { version: assetTypeVersion } = await updateEnumTypes(
      "AssetType",
      assetTypes,
      updatedVersion,
    );
    if (assetTypeVersion) updatedVersion = assetTypeVersion;
  }

  if (tagTypes.length > 0) {
    const { version: tagTypeVersion } = await updateEnumTypes(
      "TagType",
      tagTypes,
      updatedVersion,
    );
    if (tagTypeVersion) updatedVersion = tagTypeVersion;
  }

  const { version: episodeUpdateVersion } =
    await addCustomEpisodeFields(updatedVersion);
  if (episodeUpdateVersion) updatedVersion = episodeUpdateVersion;

  const { version: seasonUpdateVersion } =
    await addCustomSeasonFields(updatedVersion);
  if (seasonUpdateVersion) updatedVersion = seasonUpdateVersion;

  const { version: brandUpdateVersion } =
    await addCustomBrandFields(updatedVersion);
  if (brandUpdateVersion) updatedVersion = brandUpdateVersion;

  const { version: movieUpdateVersion } =
    await addCustomMovieFields(updatedVersion);
  if (movieUpdateVersion) updatedVersion = movieUpdateVersion;

  const { version: appConfigVersion } =
    await addAppConfigObjectType(updatedVersion);
  if (appConfigVersion) updatedVersion = appConfigVersion;

  if (updatedVersion !== initialVersion) {
    await activateConfigurationVersion(updatedVersion);

    const activeVersion = await waitForUpdatingSchema();
    return { version: activeVersion };
  }

  return { version: initialVersion };
};
