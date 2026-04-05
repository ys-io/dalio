import { Button, Divider } from "@ys-io/ui";
import { GoogleIcon } from "@features/auth/components/icons/GoogleIcon";
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
        title="비밀번호를 잊으셨나요?"
        onPress={onForgotPassword}
        disabled={loading}
        variant="secondary"
        style={styles.buttonMargin}
      />
      <Divider label="또는" />
      <Button
        title="Google로 계속하기"
        onPress={onGoogleLogin}
        disabled={loading}
        variant="secondary"
        icon={<GoogleIcon />}
        style={styles.buttonMargin}
      />
      <Button
        title="회원가입"
        onPress={onSignup}
        disabled={loading}
        variant="secondary"
        style={styles.buttonMarginLarge}
      />
    </>
  );
}
