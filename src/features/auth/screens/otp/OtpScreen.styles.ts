import { StyleSheet } from "react-native";
import { COLORS } from "@constans/colors";

export const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 8,
    lineHeight: 24,
  },
  timer: {
    marginBottom: 32,
    fontSize: 20,
    fontWeight: "bold",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  codeInputFilled: {
    borderColor: COLORS.primary,
  },
  codeInputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginBottom: 16,
  },
  spacer: {
    marginBottom: 32,
  },
  resendButton: {
    marginBottom: 12,
  },
});
