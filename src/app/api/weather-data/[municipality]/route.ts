import { fetchMunicipalityWithWeatherData } from "@infrastructure/FetchMunicipalityWithWeatherData";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/weather-data/[municipality]">
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
