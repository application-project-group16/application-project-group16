import React from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { BarChart } from "react-native-chart-kit";
import { TYPE_CONFIG, Gym } from "../../../Models/SportPlaces";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


interface SportPlacesInfoViewProps {
  loading: boolean;
  userLocation: { lat: number; lon: number } | null;
  places: Gym[];
  type: keyof typeof TYPE_CONFIG;
}

export default function SportPlacesInfoView({
  loading,
  userLocation,
  places,
  type,
}: SportPlacesInfoViewProps) {
  const navigation = useNavigation();

  if (loading || !userLocation) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FF6B35" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FF6B35" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  container: { flex: 1 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
});