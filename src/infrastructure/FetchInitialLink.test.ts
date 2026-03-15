import { fetchInitialLink } from "@infrastructure/FetchInitialLink";

// Mock the fetch function
global.fetch = jest.fn();

describe("Given the fetch initial link function", () => {
  const mockUrl =
    "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/28001";
  const mockDatosUrl = "https://example.com/weather-data.json";
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    process.env.AEMET_API_KEY = mockApiKey;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("Happy path", () => {
    it("should return datos URL when request succeeds", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      const result = await fetchInitialLink(mockUrl);

      expect(result).toBe(mockDatosUrl);
    });

    it("should include Authorization header with API key", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      await fetchInitialLink(mockUrl);

      expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${mockApiKey}`,
        },
      });
    });

    it("should use cache: 'no-store' option", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      await fetchInitialLink(mockUrl);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.cache).toBe("no-store");
    });

    it("should extract and return the datos property from response", async () => {
      const expectedUrl = "https://api.example.com/specific/data/url";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: expectedUrl, someOtherProperty: "ignored" }),
      });

      const result = await fetchInitialLink(mockUrl);

      expect(result).toBe(expectedUrl);
    });
  });

  describe("Error cases - fetch network errors", () => {
    it("should throw an error when fetch fails with network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Network error"
      );
    });

    it("should throw an error when fetch fails with timeout", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Request timeout"));

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Request timeout"
      );
    });

    it("should wrap non-Error exceptions as JSON strings", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce({ error: "Unknown error" });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        'Failed to fetch initial link: {"error":"Unknown error"}'
      );
    });
  });

  describe("Error cases - HTTP response errors", () => {
    it("should throw an error when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Unauthorized"
      );
    });

    it("should throw an error when API returns 401 Unauthorized", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Unauthorized"
      );
    });

    it("should throw an error when API returns 403 Forbidden", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Forbidden",
      });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Forbidden"
      );
    });

    it("should throw an error when API returns 404 Not Found", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Not Found"
      );
    });

    it("should throw an error when API returns 500 Internal Server Error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Failed to fetch initial link: Internal Server Error"
      );
    });
  });

  describe("Error cases - JSON parsing errors", () => {
    it("should throw an error when response JSON is invalid", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Unexpected token < in JSON at position 0");
        },
      });

      await expect(fetchInitialLink(mockUrl)).rejects.toThrow(
        "Unexpected token < in JSON at position 0"
      );
    });

    it("should throw an error when response JSON lacks datos property", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ foo: "bar" }), // Missing 'datos'
      });

      const result = await fetchInitialLink(mockUrl);

      expect(result).toBeUndefined();
    });
  });

  describe("Request configuration", () => {
    it("should call fetch with the correct URL", async () => {
      const testUrl = "https://api.example.com/test";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      await fetchInitialLink(testUrl);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api.example.com"),
        expect.any(Object)
      );
    });

    it("should not share API key in response URL", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ datos: mockDatosUrl }),
      });

      const result = await fetchInitialLink(mockUrl);

      expect(result).not.toContain(mockApiKey);
    });
  });
});
