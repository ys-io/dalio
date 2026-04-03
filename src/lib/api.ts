import { Alert } from "react-native";

interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

export async function apiCall<T>(
  fn: () => Promise<T>,
): Promise<ApiResult<T>> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err: any) {
    const message = err?.message ?? "알 수 없는 오류가 발생했습니다.";
    return { data: null, error: message };
  }
}

export function showError(message: string) {
  Alert.alert("오류", message);
}

export function showSuccess(message: string) {
  Alert.alert("완료", message);
}

export async function validate<T>(
  schema: { validate: (value: unknown, opts?: any) => Promise<T> },
  values: unknown,
): Promise<{ data: T | null; errors: Record<string, string> }> {
  try {
    const data = await schema.validate(values, { abortEarly: false });
    return { data, errors: {} };
  } catch (err: any) {
    const errors: Record<string, string> = {};
    if (err.inner) {
      for (const e of err.inner) {
        if (e.path && !errors[e.path]) {
          errors[e.path] = e.message;
        }
      }
    }
    return { data: null, errors };
  }
}
