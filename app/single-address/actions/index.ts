"use server";

import { HjemlaEstimate } from "@/models";
import { HjemlaUnit, SearchResult } from "@/types";
import { normalizeString } from "@/lib/utils";

//Mapbox search addresses
export async function searchAddresses(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      }&limit=5&types=address,poi&country=no`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error searching addresses:", error);
    throw new Error("Failed to search addresses");
  }
}

export async function searchHjemlaAddress(
  query: string
): Promise<HjemlaUnit[] | null> {
  try {
    console.log(normalizeString(query));
    const response = await fetch(
      `https://api.hjemla.no/v2/search?search=${encodeURIComponent(
        normalizeString(query)
      )}&limit=12`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_HJEMLA_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error("Error searching address:", error);
    return null;
  }
}

export async function getPropertyEstimate(
  addressId: string
): Promise<HjemlaEstimate | null> {
  try {
    const response = await fetch(
      `https://api.hjemla.no/v2/estimate?address_id=${addressId}`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_HJEMLA_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch property estimate");
    }

    const data = await response.json();
    return data.estimate;
  } catch (error) {
    console.error("Error fetching property estimate:", error);
    return null;
  }
}
