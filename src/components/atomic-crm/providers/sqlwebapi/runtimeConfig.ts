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

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const getSqlWebApiBaseUrl = () => {
  const swa = getSqlWebApiUrl();
  const service = getSqlWebApiService();

  if (!swa || !service) {
    return null;
  }

  return new URL(
    `${trimSlashes(service)}/`,
    `${swa.replace(/\/+$/, "")}/`,
  ).toString().replace(/\/$/, "");
};

export const buildSqlWebApiUrl = (
  pathname: string,
  searchParams?: Record<string, string>,
) => {
  const baseUrl = getSqlWebApiBaseUrl();

  if (!baseUrl) {
    return null;
  }

  const url = new URL(pathname.replace(/^\/+/, ""), `${baseUrl}/`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
};

export const resolveSqlWebApiAttachmentUrl = ({
  src,
  path,
}: {
  src?: string | null;
  path?: string | null;
}) => {
  if (src?.startsWith("blob:") || src?.startsWith("data:")) {
    return src;
  }

  if (path) {
    return buildSqlWebApiUrl("objects/attachments", {
      object_path: path,
    }) ?? src;
  }

  if (!src) {
    return src;
  }

  try {
    const parsedUrl = new URL(src, window.location.origin);
    const objectPath = parsedUrl.searchParams.get("object_path");

    if (parsedUrl.pathname.endsWith("/objects/attachments") && objectPath) {
      return (
        buildSqlWebApiUrl("objects/attachments", {
          object_path: objectPath,
        }) ?? src
      );
    }
  } catch {
    return src;
  }

  return src;
};
