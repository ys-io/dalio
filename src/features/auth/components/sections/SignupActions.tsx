import { Button } from "@ys-io/ui";
import { MSG } from "@constans/messages";
import { styles } from "./SignupActions.styles";

interface Props {
  loading: boolean;
  onBack: () => void;
}

export function SignupActions({ loading, onBack }: Props) {
  return (
    <Button
      title={MSG.BACK_TO_LOGIN}
      onPress={onBack}
      disabled={loading}
      variant="secondary"
      style={styles.button}
    />
  );
}
