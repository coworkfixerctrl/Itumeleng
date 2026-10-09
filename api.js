import axios from "axios";

export const TOKEN_KEY = "ik_admin_token";

export const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const formatErr = (err) => {
  const detail = err?.response?.data?.detail;
  if (detail == null) return err?.message || "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (typeof e?.msg === "string" ? e.msg.replace(/^Value error, /, "") : "")).filter(Boolean).join(" ");
  return String(detail);
};

export const asArray = (v) => (Array.isArray(v) ? v : []);

export const linkedInShareUrl = (url) =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

export const articleUrl = (slug) => `${window.location.origin}/market-analysis/${slug}`;

export const fmtDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
