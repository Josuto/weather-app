import { decode } from "./DecodeResult";

describe("decode", () => {
  it("should decode a valid JSON response with Windows-1252 encoding", async () => {
    const obj = { name: "Madrid", value: 42 };
    const encoder = new TextEncoder();
    // Simulate Windows-1252 encoded JSON
    const json = JSON.stringify(obj);
    // For test, use UTF-8, but TextDecoder will treat as Windows-1252
    const buffer = encoder.encode(json);
    const response = new Response(buffer);

    const result = await decode(response);
    expect(result).toEqual(obj);
  });

  it("should decode special Spanish characters correctly", async () => {
    const bytes = new Uint8Array([193, 118, 105, 108, 97]); // "Ávila" in Windows-1252
    const jsonString = `["${String.fromCharCode(...bytes)}"]`;
    // IMPORTANT: Use a "binary" approach to create the buffer.
    // TextEncoder.encode() ALWAYS outputs UTF-8, which would ruin your Windows-1252 simulation.
    const buffer = new Uint8Array(jsonString.length);
    for (let i = 0; i < jsonString.length; i++) {
      buffer[i] = jsonString.charCodeAt(i);
    }
    const response = new Response(buffer);

    const result = await decode(response);
    expect(result[0]).toBe("Ávila");
  });

  it("should throw on invalid JSON", async () => {
    const encoder = new TextEncoder();
    const buffer = encoder.encode("not a json");
    const response = new Response(buffer);

    await expect(decode(response)).rejects.toThrow();
  });

  it("should throw on empty response", async () => {
    const buffer = new Uint8Array([]);
    const response = new Response(buffer);

    await expect(decode(response)).rejects.toThrow();
  });
});
