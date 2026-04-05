import { Button } from "@ys-io/ui";
import { styles } from "./SignupActions.styles";

interface Props {
  loading: boolean;
  onBack: () => void;
}

export function SignupActions({ loading, onBack }: Props) {
  return (
    <Button
      title="로그인으로 돌아가기"
      onPress={onBack}
      disabled={loading}
      variant="secondary"
      style={styles.button}
    />
  );
}
