"use server";

import {
  HjemlaComparableSalesResponse,
  HjemlaEstimateWithUnitInfo,
  HjemlaUnitFeatures,
} from "@/models";

import {
  searchAddresses as originalSearchAddresses,
  searchHjemlaAddress as originalSearchHjemlaAddress,
  getPropertyEstimate as originalGetPropertyEstimate,
} from "@/app/single-address/actions";

export async function searchAddresses(query: string) {
  return await originalSearchAddresses(query);
}

export async function searchHjemlaAddress(query: string) {
  return await originalSearchHjemlaAddress(query);
}

export async function getPropertyEstimate(addressId: string) {
  return await originalGetPropertyEstimate(addressId);
}

// Get the property unit features
export async function gethHjemlaUnitFeatures(
  addressId: string
): Promise<HjemlaUnitFeatures | null> {
  try {
    const response = await fetch(
      `https://api.hjemla.no/v2/unit_features?address_id=${encodeURIComponent(
        addressId
      )}&limit=12`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_HJEMLA_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch unit features");
    }

    const data = await response.json();

    return data.unit_features;
  } catch (error) {
    console.error("Error fetching unit features:", error);
    return null;
  }
}

// Get the property estimate with relevant unit information
export async function gethHjemlaEstimateWithUnitInfo(
  addressId: string
): Promise<HjemlaEstimateWithUnitInfo | null> {
  try {
    const response = await fetch(
      `https://api.hjemla.no/v2/estimate_with_unit_info?address_id=${encodeURIComponent(
        addressId
      )}&limit=12`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_HJEMLA_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch estimate with unit info");
    }

    const data = await response.json();

    return data.estimate;
  } catch (error) {
    console.error("Error fetching estimate with unit info:", error);
    return null;
  }
}

// Get nearby objects with similar features and their sold price
export async function getHjemlaComparableSales(
  internIdAddres: string,
  pRoom: string
): Promise<HjemlaComparableSalesResponse | null> {
  console.log({
    internIdAddres,
    pRoom,
  });
  try {
    const response = await fetch(
      `https://api.hjemla.no/v2/comparablesales?internidadresse=${encodeURIComponent(
        internIdAddres
      )}&prom=${encodeURIComponent(pRoom)}`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_HJEMLA_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comparable sales");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching comparable sales:", error);
    return null;
  }
}
