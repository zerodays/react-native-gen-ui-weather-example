// https://nominatim.openstreetmap.org/reverse?lat=37.78825&lon=-122.4324&format=json

import { wait } from "./wait";

export const fetchLocation = async (lat: number, lon: number) => {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: "json",
  });

  console.log(`↪️ Fetching Reverse GeoCode for [${lat}, ${lon}]`);

  await wait(2000);

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`
  ).catch((error) => {
    console.error("Error while fetching Reverse GeoCode:", error);
    throw new Error("Location not found");
  });

  const data = await response.json();

  return data;
};
