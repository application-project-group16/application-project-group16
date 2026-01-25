import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SportPlacesInfo: { type: string };
};

const SPORT_TYPES = [
  { label: "Gyms", value: "gyms" },
  { label: "Swimming Pools", value: "swimming_pools" },
  { label: "Climbing Gyms", value: "climbing_gyms" },
];

export default function SportPlacesScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What sport places do you want to find?</Text>
      {SPORT_TYPES.map((type) => (
        <TouchableOpacity
          key={type.value}
          style={styles.button}
          onPress={() => navigation.navigate("SportPlacesInfo", { type: type.value })}
        >
          <Text style={styles.buttonText}>{type.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 24 },
  button: { backgroundColor: "#2280b0", padding: 16, borderRadius: 8, marginVertical: 8, width: 220, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});