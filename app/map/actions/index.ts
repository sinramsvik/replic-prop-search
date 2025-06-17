"use server";

import { HjemlaUnit, SearchResult } from "@/types";

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

interface HjemlaEstimateResponse {
  estimate: {
    price: number;
    sold_price: number;
    address: string;
    certainty: string;
    max: number;
    min: number;
    common_debt: number;
    indicator: number;
    price_per_sqm: number;
    unit_page: string;
    clean_unit_page: string;
  };
}

function normalizeString(str: string): string {
  return str
    .normalize("NFD") // Decompose characters into base + accent
    .replace(/[\u0300-\u036f]/g, ""); // Remove all diacritics
}

export async function searchHjemlaAddress(
  query: string
): Promise<HjemlaUnit[] | null> {
  try {
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
): Promise<HjemlaEstimateResponse | null> {
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
    return data;
  } catch (error) {
    console.error("Error fetching property estimate:", error);
    return null;
  }
}
