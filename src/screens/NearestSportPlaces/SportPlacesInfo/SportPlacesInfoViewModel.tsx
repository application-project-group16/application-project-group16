import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Location from 'expo-location';
import { useRoute } from "@react-navigation/native";
import SportPlacesInfoView from "./SportPlacesInfoView";
import { TYPE_CONFIG, Gym } from "../../../Models/SportPlaces";


function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
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

export default function SportPlacesInfoViewModel() {
  const route = useRoute();
  const { type } = route.params as { type: keyof typeof TYPE_CONFIG };
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [places, setPlaces] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission denied", "Location permission is required.");
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
      if (!userLocation) return;
      const fetchPlaces = async () => {
        setLoading(true);
        const radius = 5000;
        const typeConfig = TYPE_CONFIG[type];
        if (!typeConfig) {
          Alert.alert("Error", "Unknown sport place type.");
          setLoading(false);
          return;
        }
        const query = `
  [out:json];
  (
    ${typeConfig.query.replace(/node\[(.*?)\];/g, (match, p1) => `node[${p1}](around:${radius},${userLocation.lat},${userLocation.lon});`)}
  );
  out body;
        `;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          const data = await response.json();
          const placesWithDistance: Gym[] = data.elements.map((el: any) => ({
            id: el.id,
            name: el.tags?.name || `Unnamed ${typeConfig.label.slice(0, -1)}`,
            lat: el.lat,
            lon: el.lon,
            distance: haversine(userLocation.lat, userLocation.lon, el.lat, el.lon),
          }));
          setPlaces(placesWithDistance.sort((a, b) => a.distance - b.distance));
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') {
            Alert.alert("Timeout", "Overpass API is busy. Please try again later.");
          } else {
            console.log("Overpass fetch error:", e);
            Alert.alert("Error", "Failed to fetch sport places from Overpass API.");
          }
        }
        setLoading(false);
      };
      fetchPlaces();
    }, [userLocation, type]);

  return (
    <SportPlacesInfoView
      loading={loading}
      userLocation={userLocation}
      places={places}
      type={type}
    />
  );
}