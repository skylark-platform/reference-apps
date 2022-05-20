import { createSkylarkApiQuery } from "./skylarkApiHelpers";

const fieldsToExpand = {
  items: {
    content_url: {
      items: {
        content_url: {
          image_urls: {},
        },
        image_urls: {},
      },
    },
  },
};

const fields = {
  items: {
    content_url: {
      set_type_slug: {},
      self: {},
      items: {
        content_url: {
          image_urls: {},
          title_short: {},
          self: {},
        },
      },
    },
  },
};

describe("skylarkApiHelpers", () => {
  describe("createSkylarkApiQuery", () => {
    it("returns the expected query", () => {
      const parsedFieldsToExpand = [
        "items",
        "items__content_url",
        "items__content_url__items",
        "items__content_url__items__content_url",
        "items__content_url__items__content_url__image_urls",
        "items__content_url__items__image_urls",
      ].join(",");

      const parsedFields = [
        "items",
        "items__content_url",
        "items__content_url__set_type_slug",
        "items__content_url__self",
        "items__content_url__items",
        "items__content_url__items__content_url",
        "items__content_url__items__content_url__image_urls",
        "items__content_url__items__content_url__title_short",
        "items__content_url__items__content_url__self",
      ].join(",");

      const query = createSkylarkApiQuery({
        fieldsToExpand,
        fields,
      });

      expect(query).toEqual(
        `fields_to_expand=${parsedFieldsToExpand}&fields=${parsedFields}`
      );
    });
  });
});
