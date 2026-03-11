export async function fetchInitialLink(url: string): Promise<string> {
  let response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.AEMET_API_KEY}`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to fetch initial link: ${errorMessage}`);
  }

  if (!response.ok)
    throw new Error(`Failed to fetch initial link: ${response.statusText}`);

  const wrapper = await response.json();
  return wrapper.datos;
}

export async function decode(response: Response) {
  // Get raw bytes to avoid automatic (and wrong) UTF-8 parsing
  const buffer = await response.arrayBuffer();
  // Decode using the correct Spanish character set
  const decoder = new TextDecoder("windows-1252");
  return JSON.parse(decoder.decode(buffer));
}
