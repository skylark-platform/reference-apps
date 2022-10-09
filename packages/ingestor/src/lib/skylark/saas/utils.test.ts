import { GraphQLMediaObjectTypes } from "@skylark-reference-apps/lib";
import { EnumType } from "json-to-graphql-query";
import {
  GraphQLBaseObject,
  GraphQLIntrospectionProperties,
  GraphQLMetadata,
} from "../../interfaces";
import { ApiObjectType } from "../../types";
import {
  getUidsFromField,
  getValidFields,
  gqlObjectMeta,
  createGraphQLOperation,
  getGraphQLObjectAvailability,
} from "./utils";

describe("saas/utils.ts", () => {
  describe("getUidsFromField", () => {
    const objects: GraphQLBaseObject[] = [
      {
        uid: "1",
        external_id: "ext_1",
        slug: "",
      },
      {
        uid: "2",
        external_id: "account#ext_2",
        slug: "",
      },
      {
        uid: "3",
        external_id: "ext_3",
        slug: "",
      },
    ];

    it("returns all objects that match the given external_ids", () => {
      const uids = getUidsFromField(["ext_1", "ext_2"], objects);

      expect(uids).toEqual(["1", "2"]);
    });
  });

  describe("gqlObjectMeta", () => {
    const mediaObjectTypes: GraphQLMediaObjectTypes[] = [
      "Brand",
      "Season",
      "Episode",
      "Movie",
      "Asset",
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const type of mediaObjectTypes) {
      const apiObjectType = `${type.toLowerCase()}s` as ApiObjectType;

      const want = {
        createFunc: `create${type}`,
        updateFunc: `update${type}`,
        objectType: type,
        argName: `${type.toLowerCase()}`,
        relName: `${type.toLowerCase()}s`,
      };

      it(`returns the metadata for ${type} (MediaObjectType)`, () => {
        const got = gqlObjectMeta(type);
        expect(got).toEqual(want);
      });

      it(`returns the metadata for ${apiObjectType} (ApiObjectType)`, () => {
        const got = gqlObjectMeta(apiObjectType);
        expect(got).toEqual(want);
      });
    }
  });

  describe("getValidFields", () => {
    const validProperties: GraphQLIntrospectionProperties[] = [
      { property: "title", kind: "SCALAR" },
      { property: "slug", kind: "SCALAR" },
    ];

    const fields = {
      title: "a title",
      slug: "a-title",
      phone_number: "07777777",
      theme: ["theme-1"],
      enum: "enum",
    };

    it("returns fields object containing only properties that exist in the validProperties array", () => {
      const got = getValidFields(fields, validProperties);
      expect(got).toEqual({
        title: fields.title,
        slug: fields.slug,
      });
    });

    it("takes the first item when a field is an array", () => {
      const got = getValidFields(fields, [
        { property: "theme", kind: "SCALAR" },
      ]);
      expect(got).toEqual({
        theme: fields.theme[0],
      });
    });

    it("converts enums to the EnumType", () => {
      const got = getValidFields(fields, [{ property: "enum", kind: "ENUM" }]);
      expect(got).toEqual({
        enum: new EnumType(fields.enum),
      });
    });
  });

  describe("createGraphQLOperation", () => {
    it("does not include the updateLookup field in the args when the object does not exist", () => {
      const got = createGraphQLOperation(
        "Episode",
        false,
        { title: "title" },
        { external_id: "id" }
      );

      expect(got).toEqual({
        method: "createEpisode",
        operation: {
          __aliasFor: "createEpisode",
          __args: {
            title: "title",
          },
          external_id: true,
          slug: true,
          uid: true,
        },
      });
    });

    it("adds the updateLookup field in the args when the object exists", () => {
      const got = createGraphQLOperation(
        "Episode",
        true,
        { title: "title" },
        { external_id: "id" }
      );

      expect(got).toEqual({
        method: "updateEpisode",
        operation: {
          __aliasFor: "updateEpisode",
          __args: {
            title: "title",
            external_id: "id",
          },
          external_id: true,
          slug: true,
          uid: true,
        },
      });
    });
  });

  describe("getGraphQLObjectAvailability", () => {
    const availability: GraphQLMetadata["availability"] = {
      all: [
        {
          uid: "availability-1-uid",
          external_id: "availability-1-ext-id",
          slug: "availability-1-slug",
        },
        {
          uid: "availability-2-uid",
          external_id: "availability-2-ext-id",
          slug: "availability-2-slug",
        },
        {
          uid: "availability-3-uid",
          external_id: "availability-3-ext-id",
          slug: "availability-3-slug",
        },
      ],
      default: { uid: "default-uid", external_id: "default", slug: "default" },
    };

    it("returns an empty link array when availabilityField is empty and no default is given", () => {
      const got = getGraphQLObjectAvailability({ all: [] });

      expect(got).toEqual({ link: [] });
    });

    it("returns the default when no availabilityField is empty and a default is given", () => {
      const got = getGraphQLObjectAvailability(availability);

      expect(got).toEqual({ link: ["default-uid"] });
    });

    it("returns the availabilities in availabilityFields", () => {
      const got = getGraphQLObjectAvailability(availability, [
        availability.all[0].external_id,
        availability.all[2].external_id,
      ]);

      expect(got).toEqual({
        link: [availability.all[0].uid, availability.all[2].uid],
      });
    });
  });
});
