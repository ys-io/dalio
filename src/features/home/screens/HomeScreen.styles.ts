import { StyleSheet } from "react-native";
import { COLORS } from "@constans/colors";

export const styles = StyleSheet.create({
  calendarPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  calendarText: {
    fontSize: 18,
  },
  headerBorder: {
    borderBottomColor: COLORS.border,
  },
  footerBorder: {
    borderTopColor: COLORS.border,
  },
  titleMargin: {
    marginBottom: 4,
  },
  subtitleMargin: {
    marginBottom: 24,
  },
});
