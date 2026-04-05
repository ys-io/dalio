export const MSG = {
  // ─── 공통 ─────────────────────────────────────
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
  BACK: "돌아가기",
  BACK_TO_LOGIN: "로그인으로 돌아가기",
  OR: "또는",

  // ─── 라벨 ─────────────────────────────────────
  LABEL_NAME: "이름",
  LABEL_EMAIL: "이메일",
  LABEL_PASSWORD: "비밀번호",
  LABEL_PASSWORD_CONFIRM: "비밀번호 확인",
  LABEL_NEW_PASSWORD: "새 비밀번호",
  LABEL_NEW_PASSWORD_CONFIRM: "새 비밀번호 확인",

  // ─── 플레이스홀더 ──────────────────────────────
  PLACEHOLDER_NAME: "홍길동",
  PLACEHOLDER_EMAIL: "example@email.com",
  PLACEHOLDER_PASSWORD: "비밀번호를 입력하세요",
  PLACEHOLDER_PASSWORD_SIGNUP: "8자 이상, 대문자·특수문자 포함",
  PLACEHOLDER_PASSWORD_CONFIRM: "비밀번호를 다시 입력하세요",

  // ─── 버튼 ─────────────────────────────────────
  BTN_LOGIN: "로그인",
  BTN_SIGNUP: "회원가입",
  BTN_SIGNUP_SUBMIT: "가입하기",
  BTN_FORGOT_PASSWORD: "비밀번호를 잊으셨나요?",
  BTN_GOOGLE_LOGIN: "Google로 계속하기",
  BTN_SEND_OTP: "인증 코드 보내기",
  BTN_RESEND_OTP: "코드 재전송",
  BTN_CHANGE_PASSWORD: "비밀번호 변경",
  BTN_LOGOUT: "로그아웃",

  // ─── 에러 ─────────────────────────────────────
  EMAIL_REQUIRED: "이메일을 입력해주세요.",
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  ACCOUNT_NOT_FOUND: "존재하지 않는 계정입니다.",
  PASSWORD_WRONG: "비밀번호가 일치하지 않습니다.",
  EMAIL_ALREADY_REGISTERED: "이미 가입된 이메일입니다.",
  AGREE_REQUIRED: "이용약관과 개인정보처리방침에 동의해주세요.",
  OTP_EXPIRED: "인증 코드가 만료되었습니다. 다시 요청해주세요.",
  OTP_INVALID: "인증 코드가 올바르지 않습니다.",
  RESEND_FAILED: "재전송에 실패했습니다. 인터넷 연결을 확인해주세요.",

  // ─── 소셜 로그인 ───────────────────────────────
  GOOGLE_NO_ID_TOKEN: "Google 로그인에서 ID 토큰을 받지 못했습니다.",

  // ─── 유효성 검사 ──────────────────────────────
  V_NAME_REQUIRED: "이름을 입력해주세요.",
  V_NAME_MIN: "이름은 2자 이상이어야 합니다.",
  V_EMAIL_REQUIRED: "이메일을 입력해주세요.",
  V_EMAIL_INVALID: "올바른 이메일 형식이 아닙니다.",
  V_PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  V_PASSWORD_MIN: "비밀번호는 8자 이상이어야 합니다.",
  V_PASSWORD_UPPERCASE: "대문자를 포함해야 합니다.",
  V_PASSWORD_SPECIAL: "특수문자를 포함해야 합니다.",
  V_PASSWORD_CONFIRM_REQUIRED: "비밀번호를 다시 입력해주세요.",
  V_PASSWORD_CONFIRM_MATCH: "비밀번호가 일치하지 않습니다.",

  // ─── 비밀번호 강도 라벨 ────────────────────────
  PW_RULE_MIN: "8자 이상",
  PW_RULE_UPPERCASE: "대문자 포함",
  PW_RULE_SPECIAL: "특수문자 포함",

  // ─── 타이머 ────────────────────────────────────
  TIMER_EXPIRED: "만료됨",

  // ─── 헤더/타이틀 ───────────────────────────────
  APP_TITLE: "📅 Dalio",
  APP_SUBTITLE: "친구들과 일정을 공유하고\n함께 계획을 세워보세요",
  OTP_TITLE: "인증 코드 입력",
  OTP_SUBTITLE_SUFFIX: "으로\n6자리 코드를 보냈습니다.",
  FORGOT_PASSWORD_TITLE: "비밀번호 찾기",
  FORGOT_PASSWORD_SUBTITLE: "가입한 이메일을 입력하시면\n인증 코드를 보내드립니다.",
  RESET_PASSWORD_TITLE: "새 비밀번호 설정",
  RESET_PASSWORD_SUBTITLE: "새로운 비밀번호를 입력해주세요.",
  PASSWORD_CHANGED_TITLE: "비밀번호가 변경되었습니다!",
  PASSWORD_CHANGED_SUBTITLE: "새 비밀번호로 로그인해주세요.",

  // ─── 홈 ───────────────────────────────────────
  HOME_WELCOME_SUFFIX: "님, 환영합니다!",
  HOME_DEFAULT_USER: "사용자",
  HOME_CALENDAR_PLACEHOLDER: "캘린더 영역",

  // ─── 약관 ─────────────────────────────────────
  TERMS_AGREE_ALL: "전체 동의",
  TERMS_AGREE_TOS: "이용약관 동의 (필수)",
  TERMS_AGREE_PRIVACY: "개인정보처리방침 동의 (필수)",
  TERMS_VIEW: "보기",
} as const;
