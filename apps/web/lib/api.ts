import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60_000, // เผื่อ Render free tier ตื่นจากหลับ (~50 วิ)
});

// attach access token if present (client-side)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('gv_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// auto-refresh: เมื่อ access token หมดอายุ (401) → ขอ token ใหม่ด้วย refresh token แล้ว retry
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const rt = window.localStorage.getItem('gv_refresh_token');
  if (!rt) return null;
  try {
    // ใช้ axios ตรง ๆ (ไม่ผ่าน instance) กัน interceptor วนซ้ำ
    const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: rt });
    window.localStorage.setItem('gv_access_token', data.accessToken);
    if (data.refreshToken) window.localStorage.setItem('gv_refresh_token', data.refreshToken);
    return data.accessToken as string;
  } catch {
    window.localStorage.removeItem('gv_access_token');
    window.localStorage.removeItem('gv_refresh_token');
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      typeof window !== 'undefined' &&
      window.localStorage.getItem('gv_refresh_token')
    ) {
      original._retry = true;
      // รวม refresh ให้เหลือครั้งเดียวแม้มีหลาย request 401 พร้อมกัน
      if (!refreshing) refreshing = refreshAccessToken().finally(() => (refreshing = null));
      const newToken = await refreshing;
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
