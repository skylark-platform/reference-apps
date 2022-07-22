/**
 * @jest-environment node
 */
import axios from "axios";
import { assetUrlFetcher } from "../../hooks/useAssetPlaybackUrl";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("assetUrlFetcher hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should get the correct url", async () => {
    // Arrange
    const mockData = "asse_18782827932";

    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { assetId: mockData } });
    const res = await assetUrlFetcher("asse_18782827932");

    // Assert
    expect(res).toEqual({ assetId: mockData });
  });

  it("should throw an error if asset Url is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("assetUrlFetcher axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(assetUrlFetcher("")).rejects.toThrow(
      "assetUrlFetcher axios error"
    );
  });
});
