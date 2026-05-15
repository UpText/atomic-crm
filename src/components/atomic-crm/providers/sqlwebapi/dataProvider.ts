import { fetchUtils, HttpError } from "ra-core";

import simpleRestProvider from "ra-data-simple-rest";

import {
  withLifecycleCallbacks,
  type CreateParams,
  type DataProvider,
  type GetListParams,
  type Identifier,
  type UpdateParams,
} from "ra-core";

import type {
  Contact,
  ContactNote,
  Deal,
  DealNote,
  RAFile,
  Sale,
  SalesFormData,
  SignUpData,
} from "../../types";
import type { ConfigurationContextValue } from "../../root/ConfigurationContext";
import { getActivityLog } from "../commons/activity";
import { getCompanyAvatar } from "../commons/getCompanyAvatar";
import { getContactAvatar } from "../commons/getContactAvatar";
import {
  buildSqlWebApiUrl,
  getSqlWebApiBaseUrl,
  getSqlWebApiService,
  getSqlWebApiUrl,
  resolveSqlWebApiAttachmentUrl,
} from "./runtimeConfig";
import { ensureValidStoredAuth } from "./token";

export const httpClient = async (
  url: string,
  options: fetchUtils.Options = {},
) => {
  const auth = ensureValidStoredAuth();
  const token = auth?.token ?? null;
  const user = {
    token: token ? `Bearer ${token}` : "",
    authenticated: !!token,
  };
  // return fetchUtils.fetchJson(url, { ...options, user });
  try {
    const response = await fetchUtils.fetchJson(url, { ...options, user });

    return response;
  } catch (error: any) {
    // fetchUtils.fetchJson will already throw HttpError on !res.ok,
    // but we can enrich the error message/body here
    if (error instanceof HttpError) {
      const body = error.body ?? {};
      const message = body.message || error.message || "Request failed";
      throw new HttpError(message, error.status, body);
    }
    throw error;
  }
};


const swa = getSqlWebApiUrl() ?? "";
const service = getSqlWebApiService() ?? "";

if (!swa) {
  throw new Error("Please set the VITE_SQLWEBAPI_URL environment variable");
}
if (!service) {
  throw new Error(
    "Please set the VITE_SQLWEBAPI_SERVICE environment variable",
  );
}

const sqlWebApiBaseUrl = getSqlWebApiBaseUrl();

if (!sqlWebApiBaseUrl) {
  throw new Error("Failed to build the SQLWebAPI base URL");
}

const baseDataProvider = simpleRestProvider(sqlWebApiBaseUrl, httpClient);

async function getIsInitialized() {
  if ((getIsInitialized as any)._is_initialized_cache) {
    return true;
  }

  const sales = await baseDataProvider.getList<Sale>("sales", {
    filter: {},
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
  });
  const isInitialized = sales.data.length > 0;
  if (isInitialized) {
    (getIsInitialized as any)._is_initialized_cache = true;
  }
  return isInitialized;
}

const processCompanyLogo = async (params: any) => {
  let logo = params.data.logo;

  if (typeof logo !== "object" || logo === null || !logo.src) {
    logo = await getCompanyAvatar(params.data);
  } else if (logo.rawFile instanceof File || logo.src.startsWith("data:")) {
    logo = await uploadToBucket(logo, { trimImageWhitespace: true });
  }

  return {
    ...params,
    data: {
      ...params.data,
      logo,
    },
  };
};

const flattenCompanyCreatePayload = (data: Record<string, any>) => {
  const logo = data.logo;

  if (typeof logo !== "object" || logo === null) {
    return data;
  }

  return {
    ...data,
    logo_src: logo.src ?? undefined,
    logo_title: logo.title ?? undefined,
    logo_path: logo.path ?? undefined,
    logo_type: logo.type ?? undefined,
    logo: undefined,
  };
};

const processSaleAvatar = async <
  T extends { avatar?: string | RAFile | Partial<RAFile> | null },
>(
  data: T,
): Promise<T> => {
  if (!data.avatar || typeof data.avatar === "string") {
    return data;
  }

  const avatar =
    data.avatar.rawFile instanceof File
      ? await uploadToBucket(data.avatar as RAFile)
      : data.avatar;

  return {
    ...data,
    avatar,
  };
};

async function processContactAvatar(
  params: UpdateParams<Contact>,
): Promise<UpdateParams<Contact>>;

async function processContactAvatar(
  params: CreateParams<Contact>,
): Promise<CreateParams<Contact>>;

async function processContactAvatar(
  params: CreateParams<Contact> | UpdateParams<Contact>,
): Promise<CreateParams<Contact> | UpdateParams<Contact>> {
  const { data } = params;
  if (data.avatar?.src || !data.email_jsonb || !data.email_jsonb.length) {
    return params;
  }
  const avatarUrl = await getContactAvatar(data);

  // Clone the data and modify the clone
  const newData = { ...data, avatar: { src: avatarUrl || undefined } };

  return { ...params, data: newData };
}

const noteResources = new Set(["contact_notes", "deal_notes"]);

const normalizeAttachment = (attachment: RAFile): RAFile => ({
  ...attachment,
  src:
    resolveSqlWebApiAttachmentUrl({
      src: attachment.src,
      path: attachment.path,
    }) ?? attachment.src,
});

const normalizeCompanyRecord = <
  T extends {
    logo?: RAFile | null;
    logo_src?: string | null;
    logo_title?: string | null;
    logo_path?: string | null;
    logo_type?: string | null;
  },
>(
  record: T,
): T => {
  if (record.logo?.src) {
    return record;
  }

  if (!record.logo_src) {
    return record;
  }

  return {
    ...record,
    logo: {
      src:
        resolveSqlWebApiAttachmentUrl({
          src: record.logo_src,
          path: record.logo_path ?? undefined,
        }) ?? record.logo_src,
      title: record.logo_title ?? "Company logo",
      path: record.logo_path ?? undefined,
      type: record.logo_type ?? undefined,
    },
  };
};

const normalizeNoteRecord = <T extends { attachments?: RAFile[] | null }>(
  record: T,
): T => {
  if (!Array.isArray(record.attachments)) {
    return record;
  }

  return {
    ...record,
    attachments: record.attachments.map(normalizeAttachment),
  };
};

const dataProviderWithCustomMethods = {
  ...baseDataProvider,
  async getList(resource: string, params: GetListParams) {
    if (resource === "companies") {
      const response = await baseDataProvider.getList("companies_summary", params);
      return {
        ...response,
        data: response.data.map(normalizeCompanyRecord),
      };
    }
    if (resource === "contacts") {
      return baseDataProvider.getList("contacts_summary", params);
    }

    const response = await baseDataProvider.getList(resource, params);

    if (!noteResources.has(resource)) {
      return response;
    }

    return {
      ...response,
      data: response.data.map(normalizeNoteRecord),
    };
  },
  async getOne(resource: string, params: any) {
    if (resource === "companies") {
      const response = await baseDataProvider.getOne("companies_summary", params);
      return {
        ...response,
        data: normalizeCompanyRecord(response.data),
      };
    }
    if (resource === "contacts") {
      return baseDataProvider.getOne("contacts_summary", params);
    }

    const response = await baseDataProvider.getOne(resource, params);

    if (!noteResources.has(resource)) {
      return response;
    }

    return {
      ...response,
      data: normalizeNoteRecord(response.data),
    };
  },
  async create(resource: string, params: any) {
    const response = await baseDataProvider.create(resource, params);

    if (resource === "companies") {
      return {
        ...response,
        data: normalizeCompanyRecord(response.data),
      };
    }

    if (!noteResources.has(resource)) {
      return response;
    }

    return {
      ...response,
      data: normalizeNoteRecord(response.data),
    };
  },
  async update(resource: string, params: any) {
    const response = await baseDataProvider.update(resource, params);

    if (resource === "companies") {
      return {
        ...response,
        data: normalizeCompanyRecord(response.data),
      };
    }

    if (!noteResources.has(resource)) {
      return response;
    }

    return {
      ...response,
      data: normalizeNoteRecord(response.data),
    };
  },

  async signUp({ email, password, first_name, last_name }: SignUpData) {
    const response = await baseDataProvider.create("sales", {
      data: {
        email,
        password,
        first_name,
        last_name,
      },
    });

    if (!response.data) {
      throw new Error("Failed to create account");
    }

    // Update the is initialized cache
    (getIsInitialized as any)._is_initialized_cache = true;

    return {
      id: response.data.id,
      email,
      password,
    };
  },
  async salesCreate(body: SalesFormData) {
    const data = await baseDataProvider.create("sales", {
      data: await processSaleAvatar(body),
    });
    return data;
  },

  async salesUpdate(
    id: Identifier,
    data: Partial<Omit<SalesFormData, "password">>,
  ) {
    const { data: previousData } = await baseDataProvider.getOne<Sale>(
      "sales",
      { id },
    );
    const rdata = await baseDataProvider.update("sales", {
      id,
      data: await processSaleAvatar(data),
      previousData,
    });

    return rdata;
  },
  async updatePassword(id: Identifier) {
    if (typeof window === "undefined") {
      throw new Error("Password update is only available in the browser");
    }

    const newPassword = window.prompt("Enter a new password");
    if (newPassword == null) {
      return null;
    }

    const normalizedPassword = newPassword.trim();
    if (!normalizedPassword) {
      throw new Error("Password cannot be empty");
    }

    const { data: previousData } = await baseDataProvider.getOne<Sale>(
      "sales",
      { id },
    );
    const response = await baseDataProvider.update("sales_password", {
      id,
      data: {
        id,
        password: normalizedPassword,
      },
      previousData,
    });

    return response;
  },

  async unarchiveDeal(deal: Deal) {
    // get all deals where stage is the same as the deal to unarchive
    const { data: deals } = await baseDataProvider.getList<Deal>("deals", {
      filter: { stage: deal.stage },
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "index", order: "ASC" },
    });

    // set index for each deal starting from 1, if the deal to unarchive is found, set its index to the last one
    const updatedDeals = deals.map((d, index) => ({
      ...d,
      index: d.id === deal.id ? 0 : index + 1,
      archived_at: d.id === deal.id ? null : d.archived_at,
    }));

    return await Promise.all(
      updatedDeals.map((updatedDeal) =>
        baseDataProvider.update("deals", {
          id: updatedDeal.id,
          data: updatedDeal,
          previousData: deals.find((d) => d.id === updatedDeal.id),
        }),
      ),
    );
  },
  async getActivityLog(companyId?: Identifier) {
    return getActivityLog(baseDataProvider, companyId);
  },
  async isInitialized() {
    return getIsInitialized();
  },
  async getConfiguration(): Promise<ConfigurationContextValue> {
    const { data } = await baseDataProvider.getOne("configuration", { id: 1 });
    return (data?.config as ConfigurationContextValue) ?? {};
  },
  async updateConfiguration(
    config: ConfigurationContextValue,
  ): Promise<ConfigurationContextValue> {
    const { data: previousData } = await baseDataProvider.getOne(
      "configuration",
      { id: 1 },
    );
    await baseDataProvider.update("configuration", {
      id: 1,
      data: { config },
      previousData,
    });
    return config;
  },
} satisfies DataProvider;

export type CrmDataProvider = typeof dataProviderWithCustomMethods;

export const dataProvider = withLifecycleCallbacks(
  dataProviderWithCustomMethods,
  [
    {
      resource: "configuration",
      beforeUpdate: async (params) => {
        const config = params.data.config;
        if (config) {
          config.lightModeLogo = await processConfigLogo(config.lightModeLogo);
          config.darkModeLogo = await processConfigLogo(config.darkModeLogo);
        }
        return params;
      },
    },
    {
      resource: "contact_notes",
      beforeSave: async (data: ContactNote, _, __) => {
        if (data.attachments) {
          for (const fi of data.attachments) {
            await uploadToBucket(fi);
          }
        }
        return data;
      },
    },
    {
      resource: "deal_notes",
      beforeSave: async (data: DealNote, _, __) => {
        if (data.attachments) {
          for (const fi of data.attachments) {
            await uploadToBucket(fi);
          }
        }
        return data;
      },
    },
    {
      resource: "sales",
      beforeSave: async (data: Sale, _, __) => {
        if (data.avatar) {
          return {
            ...data,
            avatar: await uploadToBucket(data.avatar),
          };
        }
        return data;
      },
    },
    {
      resource: "contacts",
      beforeCreate: async (params) => {
        return processContactAvatar(params);
      },
      beforeUpdate: async (params) => {
        return processContactAvatar(params);
      },
      beforeGetList: async (params) => {
        return applyFullTextSearch([
          "first_name",
          "last_name",
          "company_name",
          "title",
          "email",
          "phone",
          "background",
        ])(params);
      },
    },
    {
      resource: "companies",
      beforeGetList: async (params) => {
        return applyFullTextSearch([
          "name",
          "phone_number",
          "website",
          "zipcode",
          "city",
          "state_abbr",
        ])(params);
      },
      beforeCreate: async (params) => {
        const createParams = await processCompanyLogo(params);

        return {
          ...createParams,
          data: {
            ...flattenCompanyCreatePayload(createParams.data),
            created_at: new Date().toISOString(),
          },
        };
      },
      beforeUpdate: async (params) => {
        return await processCompanyLogo(params);
      },
    },
    {
      resource: "contacts_summary",
      beforeGetList: async (params) => {
        return applyFullTextSearch(["first_name", "last_name"])(params);
      },
    },
    {
      resource: "deals",
      beforeGetList: async (params) => {
        return applyFullTextSearch(["name", "type", "description"])(params);
      },
    },
  ],
);

const applyFullTextSearch = (columns: string[]) => (params: GetListParams) => {
  if (!params.filter?.q) {
    return params;
  }
  const { q, ...filter } = params.filter;
  return {
    ...params,
    filter: {
      ...filter,
      "@or": columns.reduce((acc, column) => {
        if (column === "email")
          return {
            ...acc,
            [`email_fts@ilike`]: q,
          };
        if (column === "phone")
          return {
            ...acc,
            [`phone_fts@ilike`]: q,
          };
        else
          return {
            ...acc,
            [`${column}@ilike`]: q,
          };
      }, {}),
    },
  };
};

const processConfigLogo = async (logo: any): Promise<string> => {
  if (typeof logo === "string") {
    return logo;
  }
  if (logo?.rawFile instanceof File) {
    const uploadedLogo = await uploadToBucket(logo);
    return uploadedLogo.src;
  }
  return logo?.src ?? "";
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

const buildUploadFilename = (fi: RAFile, contentType: string) => {
  const fallbackBaseName = "upload";
  const normalizedTitle = (fi.path || fi.title || fallbackBaseName)
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const currentName = normalizedTitle || fallbackBaseName;
  if (currentName.includes(".")) {
    return currentName;
  }

  const subtype = contentType.split("/")[1]?.split("+")[0];
  const extension = subtype || "bin";
  return `${currentName}.${extension}`;
};

const getUploadFile = async (fi: RAFile): Promise<File | null> => {
  if (fi.rawFile instanceof File) {
    return fi.rawFile;
  }

  if (!fi.src?.startsWith("data:")) {
    return null;
  }

  const response = await fetch(fi.src);
  const blob = await response.blob();
  const contentType = blob.type || fi.type || "application/octet-stream";
  const filename = buildUploadFilename(fi, contentType);

  return new File([blob], filename, { type: contentType });
};

const trimTransparentImageWhitespace = async (file: File): Promise<File> => {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !file.type.startsWith("image/")
  ) {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image for trimming"));
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0);

    const { data, width, height } = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha === 0) {
          continue;
        }

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (maxX < minX || maxY < minY) {
      return file;
    }

    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;

    if (trimmedWidth === width && trimmedHeight === height) {
      return file;
    }

    const trimmedCanvas = document.createElement("canvas");
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;

    const trimmedContext = trimmedCanvas.getContext("2d");
    if (!trimmedContext) {
      return file;
    }

    trimmedContext.drawImage(
      canvas,
      minX,
      minY,
      trimmedWidth,
      trimmedHeight,
      0,
      0,
      trimmedWidth,
      trimmedHeight,
    );

    const trimmedBlob = await new Promise<Blob | null>((resolve) => {
      trimmedCanvas.toBlob(resolve, file.type || "image/png");
    });

    if (!trimmedBlob) {
      return file;
    }

    return new File([trimmedBlob], file.name, {
      type: trimmedBlob.type || file.type,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

// @bucket_id='test',@object_path='testpatj',@content_type='bin',@data='123',@upsert='1'
const uploadToBucket = async (
  fi: RAFile,
  options?: { trimImageWhitespace?: boolean },
) => {
  const sourceFile = await getUploadFile(fi);
  const uploadFile =
    sourceFile && options?.trimImageWhitespace
      ? await trimTransparentImageWhitespace(sourceFile)
      : sourceFile;
  if (!uploadFile) {
    return fi;
  }

  const base64 = arrayBufferToBase64(await uploadFile.arrayBuffer());

  const res = await baseDataProvider.create("objects", 
    { 
      data: {
        bucket_id: "attachments",
        object_path: uploadFile.name,
        content_type: uploadFile.type || fi.type || "application/octet-stream",
        data: base64 
      }
    }
  );

 

  // const dataContent = fi.src
  //   ? await fetch(fi.src).then((res) => res.blob())
  //   : fi.rawFile;

  // const file = fi.rawFile;
  // const fileExt = file.name.split(".").pop();
  // const fileName = `${Math.random()}.${fileExt}`;
  // const filePath = `${fileName}`;
  // const { error: uploadError } = await supabase.storage
  //   .from("attachments")
  //   .upload(filePath, dataContent);

  // if (uploadError) {
  //   console.error("uploadError", uploadError);
  //   throw new Error("Failed to upload attachment");
  // }

  // //const { data } = supabase.storage.from("attachments").getPublicUrl(filePath);

  const objectPath = res.data.object_path;
  fi.path = objectPath;

  const publicUrl = buildSqlWebApiUrl("objects/attachments", {
    object_path: objectPath,
  });
  fi.src = publicUrl ?? fi.src;
  fi.type = uploadFile.type || fi.type;
  // // save MIME type
  // const mimeType = file.type;
  // fi.type = mimeType;

  return fi;
};
