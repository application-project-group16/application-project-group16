import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../../../Models/Gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="map-marker-radius" size={32} color="#FF6B35" />
        <Text style={styles.headerTitle}>Discover Sport Places</Text>
        <Text style={styles.headerSubtitle}>Find your next workout spot nearby</Text>
      </View>
      
      <View style={styles.warningContainer}>
        <View style={styles.warningIconWrapper}>
          <MaterialCommunityIcons name="information" size={20} color="#FF6B35" />
        </View>
        <View style={styles.warningTextContainer}>
          <Text style={styles.warningTitle}>Limited API Access</Text>
          <Text style={styles.warningText}>
            Using free Overpass API - service may be slow or unavailable during high traffic periods
          </Text>
        </View>
      </View>

      <Text style={styles.selectLabel}>Select sport place type:</Text>

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
            <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5D0',
    maxWidth: 340,
    width: '100%',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warningIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
  selectLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  button: { 
    borderRadius: 12, 
    marginVertical: 6, 
    width: '100%',
    maxWidth: 340,
    overflow: "hidden",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonInner: { 
    padding: 16, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600",
  },
});