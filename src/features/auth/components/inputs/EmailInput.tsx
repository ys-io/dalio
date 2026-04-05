import { forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { TextInput } from "@ys-io/ui";

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
        label="이메일"
        placeholder="example@email.com"
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
