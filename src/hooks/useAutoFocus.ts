import { useEffect, type RefObject } from "react";
import type { TextInput } from "react-native";
import { FOCUS_DELAY } from "../constans";

export function useAutoFocus(ref: RefObject<TextInput | null>) {
  useEffect(() => {
    const timer = setTimeout(() => ref.current?.focus(), FOCUS_DELAY);
    return () => clearTimeout(timer);
  }, [ref]);
}
