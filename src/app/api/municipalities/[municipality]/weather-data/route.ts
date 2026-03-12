import { fetchMunicipalityWithWeatherData } from "@infrastructure/FetchMunicipalityWithWeatherData";
import { NextRequest } from "next/server";

type Params = Promise<{ municipality: string }>;

export async function GET(
  request: NextRequest,
  context: { params: Params }
): Promise<Response> {
  try {
    const { municipality } = await context.params;
    const municipalityWithWeatherData =
      await fetchMunicipalityWithWeatherData(municipality);
    return Response.json(municipalityWithWeatherData);
  } catch (error) {
    return new Response(`Failed to fetch municipality with weather data: ${error}`, {
      status: 500,
    });
  }
}
