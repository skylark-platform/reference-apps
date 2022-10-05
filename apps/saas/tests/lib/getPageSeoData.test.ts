import { graphQLClient } from "@skylark-reference-apps/lib";
import { getSeoDataForObject } from "../../lib/getPageSeoData";
import { Episode } from "../../types/gql";

jest.spyOn(graphQLClient, "request");

describe("getPageSeoData.ts", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.request as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns the data required for SEO previews", async () => {
    const episode: Episode = {
      uid: "uid",
      title_short: "short title",
      title_medium: "medium title",
      synopsis_short: "short synopsis",
      synopsis_medium: "medium synopsis",
      images: {
        objects: [{ uid: "image-1", url: "https://skylark.com/image.jpg" }],
      },
    };
    graphQlRequest.mockResolvedValueOnce({
      getEpisode: episode,
    });

    const seo = await getSeoDataForObject("Episode", "uid");

    expect(seo).toEqual({
      title: "medium title",
      synopsis: "medium synopsis",
      images: [
        {
          url: "https://skylark.com/image.jpg",
        },
      ],
    });
  });
});
