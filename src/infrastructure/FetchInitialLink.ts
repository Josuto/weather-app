export async function fetchInitialLink(url: string): Promise<string> {
  let response;
  try {
    if (!process.env.AEMET_API_KEY) {
      throw new Error("AEMET_API_KEY environment variable is undefined");
    }
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
