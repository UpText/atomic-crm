type RuntimeAppConfig = {
  VITE_SQLWEBAPI_URL?: string;
  VITE_SQLWEBAPI_SERVICE?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeAppConfig;
  }
}

export const getSqlWebApiUrl = () =>
  window.__APP_CONFIG__?.VITE_SQLWEBAPI_URL ??
  import.meta.env.VITE_SQLWEBAPI_URL;

export const getSqlWebApiService = () =>
  window.__APP_CONFIG__?.VITE_SQLWEBAPI_SERVICE ??
  import.meta.env.VITE_SQLWEBAPI_SERVICE ??
  import.meta.env.VITE_SERVICE;

export const hasSqlWebApiUrl = () => Boolean(getSqlWebApiUrl());
export const hasSqlWebApiService = () => Boolean(getSqlWebApiService());
