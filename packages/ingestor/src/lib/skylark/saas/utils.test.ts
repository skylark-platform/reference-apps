import { GraphQLMediaObjectTypes } from "@skylark-reference-apps/lib";
import { GraphQLBaseObject } from "../../interfaces";
import { ApiObjectType } from "../../types";
import { getUidsFromField, getValidFields, gqlObjectMeta } from "./utils";

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
    const validProperties = ["title", "slug"];

    const fields = {
      title: "a title",
      slug: "a-title",
      phone_number: "07777777",
      theme: ["theme-1"],
    };

    it("returns fields object containing only properties that exist in the validProperties array", () => {
      const got = getValidFields(fields, validProperties);
      expect(got).toEqual({
        title: fields.title,
        slug: fields.slug,
      });
    });

    it("takes the first item when a field is an array", () => {
      const got = getValidFields(fields, ["theme"]);
      expect(got).toEqual({
        theme: fields.theme[0],
      });
    });
  });
});
