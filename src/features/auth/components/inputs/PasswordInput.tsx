import { forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { TextInput } from "@ys-io/ui";
import { MSG } from "@constans/messages";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
  placeholder?: string;
  label?: string;
  style?: any;
}

export const PasswordInput = forwardRef<RNTextInput, Props>(
  function PasswordInput(
    {
      value,
      onChange,
      onSubmit,
      error,
      placeholder = MSG.PLACEHOLDER_PASSWORD,
      label = MSG.LABEL_PASSWORD,
      style,
    },
    ref,
  ) {
    return (
      <TextInput
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry
        onSubmitEditing={onSubmit}
        error={error}
        containerStyle={style}
      />
    );
  },
);
