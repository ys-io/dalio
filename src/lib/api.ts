interface ApiResult<T> {
  data: T | null;
  error: string | null;
  raw: string | null;
}

export async function apiCall<T>(
  fn: () => Promise<T>,
): Promise<ApiResult<T>> {
  try {
    const data = await fn();
    return { data, error: null, raw: null };
  } catch (err: any) {
    const raw = err?.message ?? "";
    const message = raw || "알 수 없는 오류가 발생했습니다.";
    return { data: null, error: message, raw };
  }
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
