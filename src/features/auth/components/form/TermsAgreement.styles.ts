import { StyleSheet } from "react-native";
import { COLORS } from "@constans/colors";

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
    borderColor: COLORS.transparent,
  },
  checkboxFocused: {
    borderColor: COLORS.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  allAgreeText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.transparent,
  },
  linkFocused: {
    borderColor: COLORS.primary,
  },
  error: {
    marginTop: 8,
  },
});
