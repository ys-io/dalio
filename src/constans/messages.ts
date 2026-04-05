export const MSG = {
  // 공통
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",

  // 로그인
  EMAIL_REQUIRED: "이메일을 입력해주세요.",
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  ACCOUNT_NOT_FOUND: "존재하지 않는 계정입니다.",
  PASSWORD_WRONG: "비밀번호가 일치하지 않습니다.",
  EMAIL_ALREADY_REGISTERED: "이미 가입된 이메일입니다.",
  AGREE_REQUIRED: "이용약관과 개인정보처리방침에 동의해주세요.",

  // OTP
  OTP_EXPIRED: "인증 코드가 만료되었습니다. 다시 요청해주세요.",
  OTP_INVALID: "인증 코드가 올바르지 않습니다.",
  RESEND_FAILED: "재전송에 실패했습니다. 인터넷 연결을 확인해주세요.",
} as const;
