import { Municipality } from "@type/Municipality";
import { fetchMunicipalities } from "@infrastructure/FetchMunicipalities";
import { TextEncoder } from "util";
import { ExternalMunicipality } from "../app/api/helper";

// Mock the fetch function
global.fetch = jest.fn();

jest.mock('next/cache', () => ({
  cacheLife: jest.fn(),
}));

describe("Given the fetch municipalities function", () => {
  let mockMunicipalities: ExternalMunicipality[];
  const mockApiKey = "test-api-key";
  process.env.AEMET_API_KEY = mockApiKey;
  const mockDatosUrl = "https://example.com/municipalities.json";

  describe("Happy path", () => {
    beforeEach(() => {
      // Reset/Default value before each test
      mockMunicipalities = [];

      // Clear previous mock history to prevent leakage
      jest.clearAllMocks();

      // Mock the initial link fetch and the municipalities data fetch
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ datos: mockDatosUrl }),
        })
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: async () => {
            const encoded = Buffer.from(JSON.stringify(mockMunicipalities), "latin1");
            return encoded.buffer.slice(
              encoded.byteOffset,
              encoded.byteOffset + encoded.byteLength
            );
          },
        });
    });

    it("should return municipalities when both requests succeed", async () => {
      mockMunicipalities = [
        { id: "id28001", nombre: "Añascua" },
        { id: "id28002", nombre: "Béjar " },
        { id: "id28003", nombre: "Úbeda" },
      ];

      const municipalities = await fetchMunicipalities();

      expect(municipalities).toEqual([
        { id: "28001", name: "Añascua" },
        { id: "28002", name: "Béjar" },
        { id: "28003", name: "Úbeda" },
      ]);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should deduplicate municipalities by name", async () => {
      mockMunicipalities = [
        { id: "id28001", nombre: "Madrid" },
        { id: "id28002", nombre: "Madrid" }, // Duplicate
        { id: "id28003", nombre: "Barcelona" },
      ];

      const municipalities = await fetchMunicipalities();

      expect(municipalities).toHaveLength(2);
      expect(
        municipalities.map((municipality) => municipality.name)
      ).toEqual(["Madrid", "Barcelona"]);
    });

    it("should trim whitespace from municipality names", async () => {
      mockMunicipalities = [
        { id: "id28001", nombre: "  Abadiño  " },
        { id: "id28002", nombre: "Barrio " },
      ];

      const municipalities = await fetchMunicipalities();

      expect(municipalities[0].name).toBe("Abadiño");
      expect(municipalities[1].name).toBe("Barrio");
    });

    it("should handle empty municipalities array", async () => {
      const municipalities = await fetchMunicipalities();

      expect(municipalities).toEqual([]);
    });
  });

  describe("Error cases - getInitialLink", () => {
    beforeEach(() => {
      // Clear previous mock history to prevent leakage
      jest.clearAllMocks();
    });

    it("should throw an error when initial link request fails with network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchMunicipalities()).rejects.toThrow("Network error");
    });

    it("should throw an error when initial link request returns non-ok response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      });

      await expect(fetchMunicipalities()).rejects.toThrow("Unauthorized");
    });

    it("should throw an error when API returns 403 Forbidden", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Forbidden",
      });

      await expect(fetchMunicipalities()).rejects.toThrow("Forbidden");
    });

    it("should throw an error when initial response JSON is invalid", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(fetchMunicipalities()).rejects.toThrow("Invalid JSON");
    });
  });

  describe("Error cases - getMunicipalities", () => {
    it("should throw an error when municipalities data request fails with network error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network timeout"));

      await expect(fetchMunicipalities()).rejects.toThrow("Network timeout");
    });

    it("should throw an error when municipalities data request returns non-ok response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchMunicipalities()).rejects.toThrow("Not Found");
    });
  });
});
