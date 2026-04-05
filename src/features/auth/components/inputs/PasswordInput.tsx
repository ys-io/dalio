import { forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { TextInput } from "@ys-io/ui";

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
      placeholder = "비밀번호를 입력하세요",
      label = "비밀번호",
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
