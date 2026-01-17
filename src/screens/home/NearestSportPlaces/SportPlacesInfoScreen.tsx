import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { BarChart } from "react-native-chart-kit";
import * as Location from 'expo-location';
import { useRoute } from "@react-navigation/native";

const TYPE_CONFIG = {
  gyms: {
    query: `
      node["leisure"="fitness_centre"];
      node["amenity"="gym"];
    `,
    label: "gyms"
  },
  swimming_pools: {
    query: `node["leisure"="swimming_pool"];`,
    label: "swimming pools"
  },
  climbing_gyms: {
    query: `node["sport"="climbing"];`,
    label: "climbing gyms"
  }
};

type Gym = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number; 
};

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

// FIX: Rename the component to match the file and navigation
export default function SportPlacesInfoScreen() {
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
      // Insert the around filter for Overpass query
      const query = `
[out:json];
(
  ${typeConfig.query.replace(/node\[(.*?)\];/g, (match, p1) => `node[${p1}](around:${radius},${userLocation.lat},${userLocation.lon});`)}
);
out body;
      `;
      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });
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
        console.log("Overpass fetch error:", e);
        Alert.alert("Error", "Failed to fetch sport places from Overpass API.");
      }
      setLoading(false);
    };
    fetchPlaces();
  }, [userLocation, type]);

  if (loading || !userLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 2 }}
        initialRegion={{
          latitude: userLocation.lat,
          longitude: userLocation.lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.lat, longitude: place.lon }}
            title={place.name}
            description={`Distance: ${place.distance.toFixed(0)} m`}
          />
        ))}
      </MapView>
      <Text style={styles.header}>Top nearest {TYPE_CONFIG[type]?.label}</Text>
      <BarChart
        data={{
          labels: places.slice(0, 5).map((g) => g.name.length > 10 ? g.name.slice(0, 10) + "…" : g.name),
          datasets: [{ data: places.slice(0, 5).map((g) => Math.round(g.distance)) }],
        }}
        width={Dimensions.get("window").width - 16}
        height={220}
        yAxisLabel="" 
        yAxisSuffix="m"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
          labelColor: () => "#222",
        }}
        style={{ margin: 8, borderRadius: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { fontSize: 18, fontWeight: "bold", margin: 8, textAlign: "center" },
});