import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxInline: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  checkboxFocused: {
    borderColor: "#6366f1",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#636366",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  allAgreeText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#2c2c2e",
    marginVertical: 4,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  linkFocused: {
    borderColor: "#6366f1",
  },
  error: {
    marginTop: 8,
  },
});
