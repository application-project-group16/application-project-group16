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
  fitness_centers: {
    query: `
      node["leisure"="fitness_centree"];
      node["sport"="multi"];`,
    label: "Fitness centers"
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
  { label: "Fitness centers", value: "fitness_centers" },
];

export type RootStackParamList = {
  SportPlacesInfo: { type: string };
};