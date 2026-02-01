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

export type Gym = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number; 
};

export const SPORT_TYPES = [
  { label: "Gyms", value: "gyms" },
  { label: "Swimming Pools", value: "swimming_pools" },
  { label: "Climbing Gyms", value: "climbing_gyms" },
];

export type RootStackParamList = {
  SportPlacesInfo: { type: string };
};