import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import * as Font from "expo-font";
import { Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

export default function App() {
  const [ready, setReady] = useState(false);
  const onFinish = () => setReady(true);
  const startLoading = async () => {
    //Font 사용
    await Font.loadAsync(Ionicons.font);

    //Local Image
    // await Asset.loadAsync(require(".imageName.jpeg"))

    //Web or Server Image
    await Image.prefetch("https://reactnative.dev/img/oss_logo.png");
  };
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }

  return <Text>We are dong loading!</Text>;
}
