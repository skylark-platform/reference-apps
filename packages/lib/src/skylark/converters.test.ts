import {
  convertObjectToSkylarkApiFields,
} from "./converters";

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

describe("converters", () => {
  describe("convertObjectToSkylarkApiFields", () => {
    it("returns the fieldsToExpand in the expected structure", () => {
      const str = convertObjectToSkylarkApiFields(fieldsToExpand);

      expect(str).toEqual(
        [
          "items",
          "items__content_url",
          "items__content_url__items",
          "items__content_url__items__content_url",
          "items__content_url__items__content_url__image_urls",
          "items__content_url__items__image_urls",
        ].join(",")
      );
    });

    it("returns the fields in the expected structure", () => {
      const str = convertObjectToSkylarkApiFields(fields);

      expect(str).toEqual(
        [
          "items",
          "items__content_url",
          "items__content_url__set_type_slug",
          "items__content_url__self",
          "items__content_url__items",
          "items__content_url__items__content_url",
          "items__content_url__items__content_url__image_urls",
          "items__content_url__items__content_url__title_short",
          "items__content_url__items__content_url__self",
        ].join(",")
      );
    });
  });
});
