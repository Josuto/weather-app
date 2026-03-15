export async function fetchInitialLink(url: string): Promise<string> {
  let response;
  if (!process.env.AEMET_API_KEY) {
    throw new Error(
      "Failed to fetch initial link: AEMET_API_KEY environment variable is undefined"
    );
  }

  try {
    response = await fetch(url + `?api_key=${process.env.AEMET_API_KEY}`, {
      cache: "no-store",
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
