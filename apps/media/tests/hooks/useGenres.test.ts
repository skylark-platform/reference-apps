/**
 * @jest-environment node
 */
import axios from "axios";
import { themeGenresFetcher } from "../../hooks/useGenres";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useGenres hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should get the correct data", async () => {
    // Arrange
    const mockData = ["War", "Crime"];
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

    // Act
    const res = await themeGenresFetcher("genres");

    // Assert
    expect(res).toEqual(mockData);
  });

  it("should throw an error if data is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(themeGenresFetcher("genres")).rejects.toThrow("axios error");
  });
});
