/**
 * @jest-environment node
 */
import axios from "axios";
import { themeGenresFetcher } from "../../hooks/useGenres";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useGenre hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should get the correct data", async () => {
    // Arrange
    const mockData = ["War", "Crime"];

    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });
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

    // Act

    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);

    // Assert
    await expect(themeGenresFetcher("genres")).rejects.toThrow("axios error");
  });
});
