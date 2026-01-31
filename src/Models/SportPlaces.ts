export interface SportPlace {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}

export interface UserLocation {
  lat: number;
  lon: number;
}

export const TYPE_CONFIG = {
  gyms: {
    query: `
      node["leisure"="fitness_centre"];
      node["amenity"="gym"];
    `,
    label: "gyms"
  },
  swimming_pools: {
    query: `
      node["leisure"="swimming_pool"];
      node["sport"="swimming"];`,
    label: "swimming pools"
  },
  climbing_gyms: {
    query: `
      node["leisure"="sports_centre"];
      node["sport"="climbing"];`,
    label: "climbing gyms"
  }
};

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}