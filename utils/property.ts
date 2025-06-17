import { PropertyInfo } from "@/types";

export function generatePropertyInfo(
  address: string,
  coordinates: [number, number]
): PropertyInfo {
  const propertyTypes = ["Single Family", "Condo", "Townhouse", "Apartment"];
  const statuses: PropertyInfo["status"][] = [
    "For Sale",
    "For Rent",
    "Sold",
    "Off Market",
  ];

  return {
    address,
    coordinates,
    price: `${(Math.random() * 8000000 + 2000000).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })} NOK`,
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    sqft: Math.floor(Math.random() * 150) + 50,
    yearBuilt: Math.floor(Math.random() * 50) + 1970,
    propertyType:
      propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}
