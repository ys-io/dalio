import { Button, Divider } from "@ys-io/ui";
import { GoogleIcon } from "@features/auth/components/icons/GoogleIcon";
import { MSG } from "@constans/messages";
import { styles } from "./LoginActions.styles";

interface Props {
  loading: boolean;
  onForgotPassword: () => void;
  onGoogleLogin: () => void;
  onSignup: () => void;
}

export function LoginActions({
  loading,
  onForgotPassword,
  onGoogleLogin,
  onSignup,
}: Props) {
  return (
    <>
      <Button
        title={MSG.BTN_FORGOT_PASSWORD}
        onPress={onForgotPassword}
        disabled={loading}
        variant="secondary"
        style={styles.buttonMargin}
      />
      <Divider label={MSG.OR} />
      <Button
        title={MSG.BTN_GOOGLE_LOGIN}
        onPress={onGoogleLogin}
        disabled={loading}
        variant="secondary"
        icon={<GoogleIcon />}
        style={styles.buttonMargin}
      />
      <Button
        title={MSG.BTN_SIGNUP}
        onPress={onSignup}
        disabled={loading}
        variant="secondary"
        style={styles.buttonMarginLarge}
      />
    </>
  );
}
