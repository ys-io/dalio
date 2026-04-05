import { View } from "react-native";
import { Text } from "@ys-io/ui";
import { FocusablePressable } from "@components/common/FocusablePressable";
import { COLORS } from "@constans/colors";
import { MSG } from "@constans/messages";
import { styles } from "./TermsAgreement.styles";

interface Props {
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  onToggleAll: () => void;
  onToggleTerms: () => void;
  onTogglePrivacy: () => void;
  onViewTerms: () => void;
  onViewPrivacy: () => void;
  error?: string;
}

export function TermsAgreement({
  agreedTerms,
  agreedPrivacy,
  onToggleAll,
  onToggleTerms,
  onTogglePrivacy,
  onViewTerms,
  onViewPrivacy,
  error,
}: Props) {
  const allAgreed = agreedTerms && agreedPrivacy;

  return (
    <View style={styles.container}>
      <FocusablePressable
        style={styles.checkboxInline}
        focusedStyle={styles.checkboxFocused}
        onPress={onToggleAll}
      >
        <View style={[styles.checkbox, allAgreed && styles.checkboxChecked]}>
          {allAgreed && <Text variant="caption" color={COLORS.white}>✓</Text>}
        </View>
        <Text variant="body" style={styles.allAgreeText}>{MSG.TERMS_AGREE_ALL}</Text>
      </FocusablePressable>

      <View style={styles.divider} />

      <View style={styles.row}>
        <FocusablePressable
          style={styles.checkboxInline}
          focusedStyle={styles.checkboxFocused}
          onPress={onToggleTerms}
        >
          <View style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}>
            {agreedTerms && <Text variant="caption" color={COLORS.white}>✓</Text>}
          </View>
          <Text variant="caption">{MSG.TERMS_AGREE_TOS}</Text>
        </FocusablePressable>
        <FocusablePressable
          style={styles.linkButton}
          focusedStyle={styles.linkFocused}
          onPress={onViewTerms}
        >
          <Text variant="caption" color={COLORS.primary}>{MSG.TERMS_VIEW}</Text>
        </FocusablePressable>
      </View>

      <View style={styles.row}>
        <FocusablePressable
          style={styles.checkboxInline}
          focusedStyle={styles.checkboxFocused}
          onPress={onTogglePrivacy}
        >
          <View style={[styles.checkbox, agreedPrivacy && styles.checkboxChecked]}>
            {agreedPrivacy && <Text variant="caption" color={COLORS.white}>✓</Text>}
          </View>
          <Text variant="caption">{MSG.TERMS_AGREE_PRIVACY}</Text>
        </FocusablePressable>
        <FocusablePressable
          style={styles.linkButton}
          focusedStyle={styles.linkFocused}
          onPress={onViewPrivacy}
        >
          <Text variant="caption" color={COLORS.primary}>{MSG.TERMS_VIEW}</Text>
        </FocusablePressable>
      </View>

      {error ? (
        <Text variant="caption" color={COLORS.error} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
