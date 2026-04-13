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
import { getSqlWebApiService, getSqlWebApiUrl } from "./runtimeConfig";
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

const baseDataProvider = simpleRestProvider(swa + "/" + service, httpClient);

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
  } else if (logo.rawFile instanceof File) {
    await uploadToBucket(logo);
  }

  return {
    ...params,
    data: {
      ...params.data,
      logo,
    },
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

const dataProviderWithCustomMethods = {
  ...baseDataProvider,
  async getList(resource: string, params: GetListParams) {
    if (resource === "companies") {
      return baseDataProvider.getList("companies_summary", params);
    }
    if (resource === "contacts") {
      return baseDataProvider.getList("contacts_summary", params);
    }

    return baseDataProvider.getList(resource, params);
  },
  async getOne(resource: string, params: any) {
    if (resource === "companies") {
      return baseDataProvider.getOne("companies_summary", params);
    }
    if (resource === "contacts") {
      return baseDataProvider.getOne("contacts_summary", params);
    }

    return baseDataProvider.getOne(resource, params);
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
            ...createParams.data,
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

// @bucket_id='test',@object_path='testpatj',@content_type='bin',@data='123',@upsert='1'
const uploadToBucket = async (fi: RAFile) => {

  const base64 = fi.rawFile
  ? arrayBufferToBase64(await fi.rawFile.arrayBuffer())
  : null;

  if (!base64) {
    return fi;
  }

  const res = await baseDataProvider.create("objects", 
    { 
      data: {
        bucket_id: "attachments",
        object_path: fi.rawFile.name,
        content_type: fi.rawFile.type,
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

  fi.path = res.data.object_path;

  const publicUrl = `${swa}/${service}/objects/attachments?object_path=${fi.path}`;
  fi.src = publicUrl;
  fi.type = fi.rawFile.type;
  // // save MIME type
  // const mimeType = file.type;
  // fi.type = mimeType;

  return fi;
};
