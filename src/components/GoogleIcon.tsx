import { View, Text, StyleSheet } from "react-native";

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.text, { fontSize: size }]}>G</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    color: "#4285F4",
  },
});
