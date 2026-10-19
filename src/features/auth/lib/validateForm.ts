export function validateName(values: string): string | null {
  if (values.trim().length === 0) return "이름을 입력해 주세요";
  if (values.length > 10) return "이름은 10자 이하로 입력해주세요";
  return null;
}
// 이메일은 아이디@도메인.com(com,net등등) 의 형식을 따라야합니다.
export function validateEmail(email: string): string | null {
  if (!email) return "이메일을 입력해 주세요";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "이메일 형식이 올바르지 않아요";
  }

  return null;
}
// 비밀번호는 8자이상 32자 이하 입력하여야 합니다.
// 비밀번호는 대소문자를 구분하며, 대문자1개이상을 포함하여야합니다.
// 비밀번호는 숫자 1개 이상을 포함하여야합니다.
// 비밀번호는 영문 숫자 특수문자(@ # ! ^ * ~)만 입력가능합니다.
// 비밀번호는 특수문자 @ # ! ^ * ~  1개이상을 포함하여야 합니다.

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

// 허용 문자: 영문 대소문자, 숫자, 특수문자(@ # ! ^ * ~)
const ALLOWED_CHARS_REGEX = /^[A-Za-z0-9@#!^*~]+$/;
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[@#!^*~]/;

export const validatePassword = (password: string): string | null => {
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 ${PASSWORD_MAX_LENGTH}자 이하 입력하여야 합니다.`;
  }

  if (!ALLOWED_CHARS_REGEX.test(password)) {
    return "비밀번호는 영문, 숫자, 특수문자(@ # ! ^ * ~)만 입력 가능합니다.";
  }

  if (!UPPERCASE_REGEX.test(password)) {
    return "비밀번호는 대문자를 1개 이상 포함하여야 합니다.";
  }

  if (!NUMBER_REGEX.test(password)) {
    return "비밀번호는 숫자를 1개 이상 포함하여야 합니다.";
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return "비밀번호는 특수문자(@ # ! ^ * ~)를 1개 이상 포함하여야 합니다.";
  }

  return null;
};
