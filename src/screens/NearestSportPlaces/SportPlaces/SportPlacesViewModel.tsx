import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import SportPlacesView from "./SportPlacesView";
import { SPORT_TYPES, RootStackParamList } from "../../../Models/SportPlaces";


export default function SportPlacesViewModel() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSelectSportType = (type: string) => {
    navigation.navigate("SportPlacesInfo", { type });
  };

  return <SportPlacesView sportTypes={SPORT_TYPES} onSelectType={handleSelectSportType} />;
}