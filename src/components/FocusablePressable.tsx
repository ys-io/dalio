import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pressable, View, Platform } from "react-native";

interface Props {
  onPress: () => void;
  style: any;
  focusedStyle: any;
  children: ReactNode;
}

export function FocusablePressable({
  onPress,
  style: baseStyle,
  focusedStyle,
  children,
}: Props) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== "web" || !ref.current) return;
    const el = ref.current as unknown as HTMLElement;
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        onPress();
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [onPress]);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[baseStyle, focused && focusedStyle]}
    >
      {children}
    </Pressable>
  );
}
