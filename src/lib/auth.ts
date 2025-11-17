const API_URL = "http://localhost:5000/api/v1/auth";

/** 🟢 Đăng nhập */
export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Đăng nhập thất bại");
  return data;
};

/** 🟢 Đăng ký */
export const registerApi = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Đăng ký thất bại");
  return data;
};

/** 🔵 Quên mật khẩu */
export const forgotPasswordApi = async (email: string) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Không thể gửi yêu cầu quên mật khẩu.");
  return data;
};

/** 🟣 Đặt lại mật khẩu */
export const resetPasswordApi = async (token: string, password: string) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Không thể đặt lại mật khẩu.");
  return data;
};
