import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface SportType {
  label: string;
  value: string;
}

interface SportPlacesViewProps {
  sportTypes: SportType[];
  onSelectType: (type: string) => void;
}

export default function SportPlacesView({ sportTypes, onSelectType }: SportPlacesViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>What sport places do you want to find?</Text>
      {sportTypes.map((type) => (
        <TouchableOpacity
          key={type.value}
          style={styles.button}
          onPress={() => onSelectType(type.value)}
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