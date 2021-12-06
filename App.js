import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import * as Font from "expo-font";
import { Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset, useAssets } from "expo-asset";

/**
 단순히 asset을 preload하는 작업일 경우 Hook을 사용하는 것을 추천
 단, Image.prefetch 또는 DB호출 등 다른 작업은 불가
 */

export default function App() {
  const [assets] = useAssets([require("./my-face.jpeg")]);
  const [loaded] = Font.useFonts(Ionicons.font);
  if (!assets || !loaded) {
    return <AppLoading />;
  }

  return <Text>We are dong loading!</Text>;
}
