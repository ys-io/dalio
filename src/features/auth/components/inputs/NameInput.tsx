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

export const NameInput = forwardRef<RNTextInput, Props>(
  function NameInput({ value, onChange, onSubmit, error, style }, ref) {
    return (
      <TextInput
        ref={ref}
        label="이름"
        placeholder="홍길동"
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        error={error}
        containerStyle={style}
      />
    );
  },
);
