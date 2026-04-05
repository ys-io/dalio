import { Button, Text, Screen, Body } from "@ys-io/ui";
import { styles } from "./PrivacyScreen.styles";

interface Props {
  onBack: () => void;
}

export function PrivacyScreen({ onBack }: Props) {
  return (
    <Screen scroll>
      <Body>
        <Text variant="title" style={styles.title}>
          개인정보처리방침
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          Dalio(이하 "서비스")는 이용자의 개인정보를 중요시하며, 「개인정보
          보호법」 등 관련 법령을 준수합니다. 본 개인정보처리방침을 통해
          이용자의 개인정보가 어떻게 수집·이용·보관·파기되는지 안내합니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          1. 수집하는 개인정보 항목{"\n\n"}
          필수 항목:{"\n"}
          {"  "}- 이름, 이메일 주소, 비밀번호{"\n\n"}
          자동 수집 항목:{"\n"}
          {"  "}- 서비스 이용 기록, 접속 로그, 기기 정보
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          2. 개인정보의 수집 및 이용 목적{"\n\n"}
          {"  "}- 회원 가입 및 관리{"\n"}
          {"  "}- 서비스 제공 및 운영{"\n"}
          {"  "}- 일정 관리 및 공유 기능 제공{"\n"}
          {"  "}- 서비스 개선 및 신규 기능 개발{"\n"}
          {"  "}- 고객 문의 대응
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          3. 개인정보의 보유 및 이용 기간{"\n\n"}
          회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 따라 보존이 필요한
          경우 해당 기간 동안 보관합니다.{"\n\n"}
          {"  "}- 계약 또는 청약철회에 관한 기록: 5년{"\n"}
          {"  "}- 접속 로그: 3개월
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          4. 개인정보의 제3자 제공{"\n\n"}
          회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          다만, 법령에 의한 경우는 예외로 합니다.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          5. 개인정보의 파기 절차 및 방법{"\n\n"}
          전자적 파일: 복구 불가능한 방법으로 삭제{"\n"}
          종이 문서: 분쇄기로 분쇄 또는 소각
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          6. 이용자의 권리{"\n\n"}
          이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를
          요청할 수 있습니다. 설정 메뉴 또는 고객센터를 통해 요청해주세요.
        </Text>

        <Text variant="body" color="#ababab" style={styles.section}>
          7. 개인정보 보호책임자{"\n\n"}
          성명: 장유수{"\n"}
          이메일: dbtnss@naver.com
        </Text>

        <Text variant="caption" color="#636366" style={styles.date}>
          시행일: 2026년 4월 5일
        </Text>

        <Button
          title="돌아가기"
          onPress={onBack}
          variant="secondary"
          style={styles.backButton}
        />
      </Body>
    </Screen>
  );
}
