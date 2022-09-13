/**
 * @jest-environment node
 */
import { Dimensions } from "@skylark-reference-apps/lib";
import axios from "axios";
import { themeGenresFetcher } from "../../hooks/useGenres";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useGenres hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds the Skylark Dimension Settings to the request", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: "mockData" } });
    await themeGenresFetcher([
      "genres",
      {
        language: "pt-pt",
        deviceType: "pc",
        customerType: "standard",
      } as Dimensions,
    ]);
    // Assert
    expect(mockedAxios.get).toBeCalledWith(
      expect.stringContaining("device_types=pc&customer_types=standard"),
      { headers: { "Accept-Language": "pt-pt,*" } }
    );
  });

  it("Should get the correct data", async () => {
    // Arrange
    const mockData = ["War", "Crime"];
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

    // Act
    const res = await themeGenresFetcher(["genres", {} as Dimensions]);

    // Assert
    expect(res).toEqual(mockData);
  });

  it("should throw an error if data is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("useGenres axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(
      themeGenresFetcher(["genres", {} as Dimensions])
    ).rejects.toThrow("useGenres axios error");
  });
});
