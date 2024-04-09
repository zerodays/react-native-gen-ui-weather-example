import * as Location from "expo-location";

export async function getDeviceLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }

  return await Location.getCurrentPositionAsync();
}
