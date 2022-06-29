/**
 * @jest-environment node
 */
import axios from "axios";
import { genresSetFetcher } from "../../hooks/useGenres";

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
    const res = await genresSetFetcher("genres");

    // Assert
    expect(res).toEqual(mockData);
  });

  it("should throw an error if data is incorrect", async () => {
    // Arrange
    const mockData = "War";

    // Act
    mockedAxios.get.mockResolvedValueOnce({ error: mockData });

    // Assert
    await expect(genresSetFetcher("genre")).rejects.toThrow(
      "Cannot read properties of undefined (reading 'objects')"
    );
  });
});
