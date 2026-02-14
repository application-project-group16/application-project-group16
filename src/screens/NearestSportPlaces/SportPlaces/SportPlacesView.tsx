import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../../../Models/Gradient";

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
      <Text style={styles.header}>What sport places do you{"\n"}want to find?</Text>
      {sportTypes.map((type) => (
        <LinearGradient
          key={type.value}
          colors={gradients.brandButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity
            style={styles.buttonInner}
            onPress={() => onSelectType(type.value)}
          >
            <Text style={styles.buttonText}>{type.label}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 24 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 24 },
  button: { borderRadius: 8, marginVertical: 8, width: 220, overflow: "hidden" },
  buttonInner: { padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});