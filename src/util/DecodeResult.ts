export async function decode(response: Response) {
  // Get raw bytes to avoid automatic (and wrong) UTF-8 parsing
  const buffer = await response.arrayBuffer();
  // Decode using the correct Spanish character set
  const decoder = new TextDecoder("windows-1252");
  return JSON.parse(decoder.decode(buffer));
}
