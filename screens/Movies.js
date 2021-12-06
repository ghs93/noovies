import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Movies = ({ navigation: { navigate } }) => (
  <TouchableOpacity
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    onPress={() => navigate("Stack", { screen: "Three" })}
  >
    <Text>Movies</Text>
  </TouchableOpacity>
);

export default Movies;
