import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, Screen, Body } from "@ys-io/ui";

interface Props {
  onBack: () => void;
}

export function TermsScreen({ onBack }: Props) {
  return (
    <Screen scroll>
      <Body>
        <Text variant="title" style={{ marginBottom: 24 }}>
          이용약관
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제1조 (목적){"\n\n"}
          이 약관은 Dalio(이하 "서비스")의 이용과 관련하여 서비스를 제공하는
          자(이하 "회사")와 이용자 간의 권리, 의무 및 책임 사항을 규정함을
          목적으로 합니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제2조 (정의){"\n\n"}
          1. "서비스"란 회사가 제공하는 캘린더 및 일정 관리 서비스를 의미합니다.
          {"\n"}
          2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.{"\n"}
          3. "회원"이란 서비스에 가입하여 계정을 생성한 이용자를 말합니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제3조 (약관의 효력 및 변경){"\n\n"}
          1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.{"\n"}
          2. 회사는 관련 법률에 위배되지 않는 범위에서 약관을 변경할 수 있으며,
          변경 시 7일 전에 공지합니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제4조 (서비스의 제공){"\n\n"}
          1. 회사는 다음의 서비스를 제공합니다.{"\n"}
          {"  "}- 캘린더 및 일정 관리{"\n"}
          {"  "}- 일정 공유 기능{"\n"}
          {"  "}- 기타 회사가 정하는 서비스{"\n"}
          2. 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검 등의
          사유로 일시 중단될 수 있습니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제5조 (회원의 의무){"\n\n"}
          1. 회원은 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.
          {"\n"}
          2. 회원은 서비스를 이용하여 법령, 공서양속에 반하는 행위를 해서는 안
          됩니다.{"\n"}
          3. 회원은 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제6조 (서비스 이용의 제한){"\n\n"}
          회사는 회원이 본 약관을 위반하거나 서비스의 정상적인 운영을 방해하는
          경우, 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          제7조 (면책조항){"\n\n"}
          1. 회사는 천재지변, 전쟁 등 불가항력으로 인한 서비스 중단에 대해
          책임을 지지 않습니다.{"\n"}
          2. 회사는 이용자의 귀책 사유로 인한 서비스 이용 장애에 대해 책임을
          지지 않습니다.
        </Text>

        <Text
          variant="caption"
          color="#636366"
          style={{ marginBottom: 32 }}
        >
          시행일: 2026년 4월 5일
        </Text>

        <Button
          title="돌아가기"
          onPress={onBack}
          variant="secondary"
          style={{ marginBottom: 24 }}
        />
      </Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    lineHeight: 24,
  },
});
