import { StyleSheet } from "react-native";

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
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  codeInputFilled: {
    borderColor: "#6366f1",
  },
  codeInputError: {
    borderColor: "#ff453a",
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
