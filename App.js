import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import * as Font from "expo-font";
import { Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset, useAssets } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/tabs";

export default function App() {
  const [assets] = useAssets([require("./my-face.jpeg")]);
  const [loaded] = Font.useFonts(Ionicons.font);
  if (!assets || !loaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
