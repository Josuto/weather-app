import { Municipality } from "@type/Municipality";
import { GET } from "./route";
import { TextEncoder } from "util";
import { ExternalMunicipality } from "../helper";

// Mock the fetch function
global.fetch = jest.fn();

describe("GET /api/municipalities", () => {
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

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
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

      const response = await GET();
      const municipalities = await response.json();

      expect(municipalities).toHaveLength(2);
      expect(
        municipalities.map((municipality: Municipality) => municipality.name)
      ).toEqual(["Madrid", "Barcelona"]);
    });

    it("should trim whitespace from municipality names", async () => {
      mockMunicipalities = [
        { id: "id28001", nombre: "  Abadiño  " },
        { id: "id28002", nombre: "Barrio " },
      ];

      const response = await GET();
      const municipalities = await response.json();

      expect(municipalities[0].name).toBe("Abadiño");
      expect(municipalities[1].name).toBe("Barrio");
    });

    it("should handle empty municipalities array", async () => {
      const response = await GET();
      const municipalities = await response.json();

      expect(response.status).toBe(200);
      expect(municipalities).toEqual([]);
    });
  });

  describe("Error cases - getInitialLink", () => {
    it("should return 500 when initial link request fails with network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Failed to fetch municipalities");
      expect(text).toContain("Failed to fetch initial link");
    });

    it("should return 500 when initial link request returns non-ok response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      });

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Failed to fetch initial link");
      expect(text).toContain("Unauthorized");
    });

    it("should return 500 when API returns 403 Forbidden", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Forbidden",
      });

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Forbidden");
    });

    it("should return 500 when initial response JSON is invalid", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Failed to fetch municipalities");
    });

    it("should include API key in initial request headers", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(0),
      });

      await GET();

      const firstCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual({
        headers: {
          Authorization: `Bearer ${mockApiKey}`,
        },
      });
    });
  });

  describe("Error cases - getMunicipalities", () => {
    it("should return 500 when municipalities data request fails with network error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network timeout"));

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Failed to fetch municipalities");
      expect(text).toContain("Failed to fetch municipalities data");
    });

    it("should return 500 when municipalities data request returns non-ok response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Failed to fetch municipalities data");
      expect(text).toContain("Not Found");
    });

    it("should return 500 when municipalities data is not a valid array", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      const encoder = new TextEncoder();
      const invalidData = encoder.encode(JSON.stringify({ invalid: "data" }));
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => invalidData.buffer,
      });

      const response = await GET();

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toContain("Failed to fetch municipalities");
    });
  });
});
