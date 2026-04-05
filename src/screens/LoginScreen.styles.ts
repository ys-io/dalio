import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    marginBottom: 40,
  },
  fieldMargin: {
    marginBottom: 16,
  },
  fieldMarginSmall: {
    marginBottom: 4,
  },
  buttonMargin: {
    marginBottom: 12,
  },
  buttonMarginLarge: {
    marginBottom: 16,
  },
  checkboxGroup: {
    marginBottom: 24,
  },
  checkboxRow: {
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
  checkboxRowFocused: {
    borderColor: "#6366f1",
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  linkButtonFocused: {
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
  dividerThin: {
    height: 1,
    backgroundColor: "#2c2c2e",
    marginVertical: 4,
  },
  allAgreeText: {
    fontSize: 14,
  },
  errorMargin: {
    marginTop: 8,
  },
});
