import { forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { TextInput } from "@ys-io/ui";
import { MSG } from "@constans/messages";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
  style?: any;
}

export const EmailInput = forwardRef<RNTextInput, Props>(
  function EmailInput({ value, onChange, onSubmit, error, style }, ref) {
    return (
      <TextInput
        ref={ref}
        label={MSG.LABEL_EMAIL}
        placeholder={MSG.PLACEHOLDER_EMAIL}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        keyboardType="email-address"
        onSubmitEditing={onSubmit}
        error={error}
        containerStyle={style}
      />
    );
  },
);
