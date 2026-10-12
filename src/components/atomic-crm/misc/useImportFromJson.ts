import { useState } from "react";
import {
  type Identifier,
  useDataProvider,
  useEvent,
  useGetIdentity,
  useRefresh,
} from "ra-core";
import { JSONParser, type JsonTypes } from "@streamparser/json-whatwg";
import { createImportedFile } from "./portableFiles";
import type { CrmDataProvider } from "../providers/types";
import type { Company, Contact, RAFile, Tag } from "../types";
import { colors } from "../tags/colors";
import {
  useConfigurationUpdater,
  type ConfigurationContextValue,
  useConfigurationContext,
} from "../root/ConfigurationContext";
import { contactGender } from "../contacts/contactModel";
import { defaultConfiguration } from "../root/defaultConfiguration";

export type ImportFromJsonStats = {
  sales: number;
  companies: number;
  contacts: number;
  deals: number;
  notes: number;
  deal_notes: number;
  tasks: number;
};

export type ImportFromJsonFailures = {
  sales: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
  companies: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
  contacts: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
  deals: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
  notes: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
  deal_notes: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
  tasks: Array<JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined>;
};

export type ImportFromJsonIdleState = {
  status: "idle";
  error: null;
  stats: ImportFromJsonStats;
  failedImports: ImportFromJsonFailures;
};

export type ImportFromJsonImportingState = {
  status: "importing";
  stats: ImportFromJsonStats;
  error: null;
  failedImports: ImportFromJsonFailures;
};

export type ImportFromJsonErrorState = {
  status: "error";
  error: Error;
  stats: ImportFromJsonStats;
  failedImports: ImportFromJsonFailures;
  duration: number;
};

export type ImportFromJsonSuccessState = {
  status: "success";
  stats: ImportFromJsonStats;
  error: null;
  failedImports: ImportFromJsonFailures;
  duration: number;
};

export type ImportFromJsonState =
  | ImportFromJsonErrorState
  | ImportFromJsonIdleState
  | ImportFromJsonImportingState
  | ImportFromJsonSuccessState;

export type ImportFromJsonFunction = (file: File) => Promise<void>;
type ResetFunction = () => void;

const defaultFailedImports = {
  sales: [],
  companies: [],
  contacts: [],
  deals: [],
  notes: [],
  deal_notes: [],
  tasks: [],
};

const defaultStats = {
  sales: 0,
  companies: 0,
  contacts: 0,
  deals: 0,
  notes: 0,
  deal_notes: 0,
  tasks: 0,
};

const LOOKUP_PAGE_SIZE = 1000;

const createImportedCompanyLogo = async (data: CompanyImport) =>
  data.logo_src
    ? createImportedFile(data.logo_src, data.logo_title || "Company logo")
    : undefined;

/**
 * A hook that returns a function to import data from a JSON file.
 * We do the import on the client because edge functions are limited in both execution time and memory.
 */
export const useImportFromJson = (): [
  ImportFromJsonState,
  ImportFromJsonFunction,
  ResetFunction,
] => {
  const { data: currentSale } = useGetIdentity();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const refresh = useRefresh();
  const configuration = useConfigurationContext();
  const updateConfiguration = useConfigurationUpdater();
  const [state, setState] = useState<ImportFromJsonState>({
    status: "idle",
    error: null,
    stats: defaultStats,
    failedImports: defaultFailedImports,
  });

  const reset = useEvent(() => {
    setState({
      status: "idle",
      error: null,
      stats: defaultStats,
      failedImports: defaultFailedImports,
    });
  });

  const importFile = useEvent(async (file: File) => {
    if (currentSale == null) {
      throw new Error("Importing data requires to be authenticated");
    }
    const startedAt = new Date();
    let portable = false;
    let companySectors = configuration.companySectors;
    let importFailure: Error | undefined;
    const markImportFailure = () => {
      importFailure ??= new Error(
        "Import stopped because one or more records failed. Review the failed records before retrying.",
      );
    };

    setState({
      status: "importing",
      stats: defaultStats,
      failedImports: defaultFailedImports,
      error: null,
    });

    const idsMaps: {
      sales: Record<number, Identifier>;
      companies: Record<number, Identifier>;
      contacts: Record<number, Identifier>;
      deals: Record<number, Identifier>;
      tags: Record<string, Identifier>;
    } = {
      sales: {},
      companies: {},
      contacts: {},
      deals: {},
      tags: {},
    };
    const companyImportsByName = new Map<
      string,
      Promise<Identifier | undefined>
    >();
    const contactImportsByName = new Map<
      string,
      Promise<Identifier | undefined>
    >();

    const getImportedSalesId = (sourceId?: number): Identifier => {
      if (sourceId == null) return currentSale.id;
      const id = idsMaps.sales[sourceId];
      if (id == null) {
        throw new Error(
          `Missing imported salesperson for sales_id ${sourceId}`,
        );
      }
      return id;
    };

    const importSale = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      try {
        if (!isSale(dataToImport)) {
          throw new Error(`Error while importing sale: Invalid data`);
        }
        const existingRecordResponse = await dataProvider.getList("sales", {
          filter: { email: dataToImport.email.trim() },
          pagination: { page: 1, perPage: 1 },
          sort: { field: "id", order: "ASC" },
        });
        if (existingRecordResponse.total === 1) {
          idsMaps.sales[dataToImport.id] = existingRecordResponse.data[0].id;
          if (dataToImport.avatar)
            await dataProvider.update("sales", {
              id: existingRecordResponse.data[0].id,
              previousData: existingRecordResponse.data[0],
              data: {
                avatar: await createImportedFile(dataToImport.avatar, "Avatar"),
              },
            });
          return existingRecordResponse.data[0].id;
        }

        const data = await dataProvider.salesCreate({
          email: dataToImport.email.trim(),
          first_name: dataToImport.first_name.trim(),
          last_name: dataToImport.last_name.trim(),
          administrator: false,
          disabled: false,
        });

        if (data?.id == null) {
          throw new Error("Salesperson creation returned no ID");
        }
        idsMaps.sales[dataToImport.id] = data.id;
        if (dataToImport.avatar)
          await dataProvider.update("sales", {
            id: data.id,
            previousData: data,
            data: {
              avatar: await createImportedFile(dataToImport.avatar, "Avatar"),
            },
          });
        setState((old) => {
          if (old.status === "error") {
            return {
              ...old,
              stats: {
                ...(old.stats ?? defaultStats),
                sales: (old.stats ?? defaultStats).sales + 1,
              },
            };
          }
          return {
            ...old,
            status: "importing",
            stats: {
              ...(old.stats ?? defaultStats),
              sales: (old.stats ?? defaultStats).sales + 1,
            },
            error: null,
          };
        });
        return data;
      } catch (err) {
        const duration = new Date().valueOf() - startedAt.valueOf();
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "error",
          error: new Error(
            `Error while importing sale: ${(err as Error).message}`,
          ),
          failedImports: {
            ...old.failedImports,
            sales: [
              ...old.failedImports.sales,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
          duration,
        }));
      }
    };

    const importCompany = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      if (!isCompany(dataToImport)) {
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          error: null,
          failedImports: {
            ...old.failedImports,
            companies: [
              ...old.failedImports.companies,
              { ...(dataToImport as any), error: "Invalid format" },
            ],
          },
        }));
        return;
      }
      try {
        const nameKey = getCompanyNameKey(dataToImport.name);
        if (portable) {
          const id = await importUniqueCompany(dataToImport);
          if (id != null) idsMaps.companies[dataToImport.id] = id;
          return id;
        }
        const existingImport = companyImportsByName.get(nameKey);
        if (existingImport) {
          const companyId = await existingImport;
          if (companyId != null) {
            idsMaps.companies[dataToImport.id] = companyId;
          }
          return companyId;
        }

        const importPromise = importUniqueCompany(dataToImport);
        companyImportsByName.set(nameKey, importPromise);
        const companyId = await importPromise;
        if (companyId != null) {
          idsMaps.companies[dataToImport.id] = companyId;
        }
        return companyId;
      } catch (err) {
        console.error(err);
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          error: null,
          failedImports: {
            ...old.failedImports,
            companies: [
              ...old.failedImports.companies,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
        }));
      }
    };

    const importUniqueCompany = async (dataToImport: CompanyImport) => {
      try {
        const salesId = getImportedSalesId(dataToImport.sales_id);
        const existingCompany = portable
          ? undefined
          : await findExistingCompany(dataProvider, dataToImport.name);
        if (existingCompany) {
          return existingCompany.id;
        }

        // Validate sector against configuration
        const sector = dataToImport.sector?.trim();
        if (sector && !companySectors.some((s) => s.value === sector)) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            error: null,
            failedImports: {
              ...old.failedImports,
              companies: [
                ...old.failedImports.companies,
                {
                  ...(dataToImport as any),
                  error: `Invalid sector "${sector}". Must be one of: ${companySectors.map((s) => s.value).join(", ")}`,
                },
              ],
            },
          }));
          return;
        }

        const { data } = await dataProvider.create("companies", {
          data: {
            name: dataToImport.name.trim(),
            logo: await createImportedCompanyLogo(dataToImport),
            description: dataToImport.description?.trim(),
            city: dataToImport.city?.trim(),
            country: dataToImport.country?.trim(),
            address: dataToImport.address?.trim(),
            zipcode: dataToImport.zipcode?.trim(),
            state_abbr: dataToImport.state_abbr?.trim(),
            sector: sector || undefined,
            size: dataToImport.size
              ? portable
                ? dataToImport.size
                : mapSizeToCategory(dataToImport.size)
              : undefined,
            linkedin_url: dataToImport.linkedin_url?.trim(),
            website: dataToImport.website?.trim(),
            phone_number: dataToImport.phone_number?.trim(),
            revenue: dataToImport.revenue?.trim(),
            tax_identifier: dataToImport.tax_identifier?.trim(),
            context_links: Array.isArray(dataToImport.context_links)
              ? dataToImport.context_links
              : undefined,
            sales_id: salesId,
            created_at: dataToImport.created_at,
          },
        });

        setState((old) => ({
          ...old,
          status: "importing",
          stats: {
            ...old.stats,
            companies: old.stats.companies + 1,
          },
          error: null,
        }));
        return data.id;
      } catch (err) {
        companyImportsByName.delete(getCompanyNameKey(dataToImport.name));
        throw err;
      }
    };

    const importContact = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      if (!isContact(dataToImport)) {
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          error: null,
          failedImports: {
            ...old.failedImports,
            contacts: [
              ...old.failedImports.contacts,
              { ...(dataToImport as any), error: "Invalid format" },
            ],
          },
        }));
        return;
      }

      try {
        const nameKey = getContactNameKey(
          dataToImport.first_name,
          dataToImport.last_name,
        );
        if (portable) {
          const id = await importUniqueContact(dataToImport);
          if (id != null) idsMaps.contacts[dataToImport.id] = id;
          return id;
        }
        const existingImport = contactImportsByName.get(nameKey);
        if (existingImport) {
          const contactId = await existingImport;
          if (contactId != null) {
            idsMaps.contacts[dataToImport.id] = contactId;
          }
          return contactId;
        }

        const importPromise = importUniqueContact(dataToImport);
        contactImportsByName.set(nameKey, importPromise);
        const contactId = await importPromise;
        if (contactId != null) {
          idsMaps.contacts[dataToImport.id] = contactId;
        }
        return contactId;
      } catch (err) {
        console.error(err);
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          error: null,
          failedImports: {
            ...old.failedImports,
            contacts: [
              ...old.failedImports.contacts,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
        }));
      }
    };

    const importUniqueContact = async (dataToImport: ContactImport) => {
      try {
        const salesId = getImportedSalesId(dataToImport.sales_id);
        const existingContact = portable
          ? undefined
          : await findExistingContact(
              dataProvider,
              dataToImport.first_name,
              dataToImport.last_name,
            );
        if (existingContact) {
          return existingContact.id;
        }

        // Validate gender against valid values
        const gender = dataToImport.gender?.trim();
        if (gender && !contactGender.some((g) => g.value === gender)) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            error: null,
            failedImports: {
              ...old.failedImports,
              contacts: [
                ...old.failedImports.contacts,
                {
                  ...(dataToImport as any),
                  error: `Invalid gender "${gender}". Must be one of: ${contactGender.map((g) => g.value).join(", ")}`,
                },
              ],
            },
          }));
          return;
        }

        let tagsIds: Array<Identifier> = [];
        if (dataToImport.tags && Array.isArray(dataToImport.tags)) {
          tagsIds = await Promise.all(
            dataToImport.tags.map(async (tag) => {
              if (idsMaps.tags[tag]) {
                return idsMaps.tags[tag];
              }
              const { data } = await dataProvider.create<Tag>("tags", {
                data: {
                  name: tag,
                  color: colors[Math.floor(Math.random() * colors.length)],
                },
              });
              idsMaps.tags[tag] = data.id;
              return data.id;
            }),
          );
        }

        const { data } = await dataProvider.create("contacts", {
          data: {
            avatar: dataToImport.avatar
              ? await createImportedFile(dataToImport.avatar, "Avatar")
              : undefined,
            last_name: dataToImport.last_name.trim(),
            first_name: dataToImport.first_name.trim(),
            title: dataToImport.title?.trim(),
            background: dataToImport.background?.trim(),
            linkedin_url: dataToImport.linkedin_url?.trim(),
            gender: gender || undefined,
            has_newsletter: !!dataToImport.has_newsletter,
            status: dataToImport.status?.trim() || "new",
            company_id: dataToImport.company_id
              ? idsMaps.companies[dataToImport.company_id]
              : undefined,
            email_jsonb: Array.isArray(dataToImport.emails)
              ? dataToImport.emails
              : undefined,
            phone_jsonb: Array.isArray(dataToImport.phones)
              ? dataToImport.phones
              : undefined,
            sales_id: salesId,
            tags: tagsIds,
            first_seen: dataToImport.created_at,
            last_seen: dataToImport.updated_at,
          },
        });
        setState((old) => ({
          ...old,
          status: "importing",
          stats: {
            ...old.stats,
            contacts: old.stats.contacts + 1,
          },
          error: null,
        }));
        return data.id;
      } catch (err) {
        contactImportsByName.delete(
          getContactNameKey(dataToImport.first_name, dataToImport.last_name),
        );
        throw err;
      }
    };

    const importNote = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      if (!isNote(dataToImport)) {
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            notes: [
              ...old.failedImports.notes,
              { ...(dataToImport as any), error: "Invalid format" },
            ],
          },
          error: null,
        }));
        return;
      }
      try {
        const salesId = getImportedSalesId(dataToImport.sales_id);
        if (idsMaps.contacts[dataToImport.contact_id] == null) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            failedImports: {
              ...old.failedImports,
              notes: [
                ...old.failedImports.notes,
                {
                  ...(dataToImport as any),
                  error: `Invalid contact_id ${dataToImport.contact_id}`,
                },
              ],
            },
            error: null,
          }));
          return;
        }

        const attachments: Array<
          Partial<RAFile> & {
            src: string;
            title: string;
            type?: string | null;
          }
        > = [];
        if (Array.isArray(dataToImport.attachments)) {
          for (const file of dataToImport.attachments) {
            attachments.push(await createImportedFile(file.url, file.name));
          }
        }

        await dataProvider.create("contact_notes", {
          data: {
            contact_id: idsMaps.contacts[dataToImport.contact_id],
            sales_id: salesId,
            text: dataToImport.text,
            date: dataToImport.date,
            status: dataToImport.status ?? "cold",
            attachments: attachments.length > 0 ? attachments : undefined,
          },
        });
        setState((old) => ({
          ...old,
          status: "importing",
          stats: {
            ...old.stats,
            notes: old.stats.notes + 1,
          },
          error: null,
        }));
      } catch (err) {
        console.error(err);
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            notes: [
              ...old.failedImports.notes,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
          error: null,
        }));
      }
    };

    const importDealNote = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      if (!isDealNote(dataToImport)) {
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            deal_notes: [
              ...old.failedImports.deal_notes,
              { ...(dataToImport as any), error: "Invalid format" },
            ],
          },
          error: null,
        }));
        return;
      }
      try {
        const salesId = getImportedSalesId(dataToImport.sales_id);
        if (idsMaps.deals[dataToImport.deal_id] == null) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            failedImports: {
              ...old.failedImports,
              deal_notes: [
                ...old.failedImports.deal_notes,
                {
                  ...(dataToImport as any),
                  error: `Invalid deal_id ${dataToImport.deal_id}`,
                },
              ],
            },
            error: null,
          }));
          return;
        }

        const attachments: Array<
          Partial<RAFile> & {
            src: string;
            title: string;
            type?: string | null;
          }
        > = [];
        if (Array.isArray(dataToImport.attachments)) {
          for (const file of dataToImport.attachments) {
            attachments.push(await createImportedFile(file.url, file.name));
          }
        }

        await dataProvider.create("deal_notes", {
          data: {
            deal_id: idsMaps.deals[dataToImport.deal_id],
            sales_id: salesId,
            text: dataToImport.text,
            date: dataToImport.date,
            attachments: attachments.length > 0 ? attachments : undefined,
          },
        });
        setState((old) => ({
          ...old,
          status: "importing",
          stats: {
            ...old.stats,
            deal_notes: old.stats.deal_notes + 1,
          },
          error: null,
        }));
      } catch (err) {
        console.error(err);
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            deal_notes: [
              ...old.failedImports.deal_notes,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
          error: null,
        }));
      }
    };

    const importDeal = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      if (!isDeal(dataToImport)) {
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            deals: [
              ...old.failedImports.deals,
              { ...(dataToImport as any), error: "Invalid format" },
            ],
          },
          error: null,
        }));
        return;
      }
      try {
        const salesId = getImportedSalesId(dataToImport.sales_id);
        if (idsMaps.companies[dataToImport.company_id] == null) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            failedImports: {
              ...old.failedImports,
              deals: [
                ...old.failedImports.deals,
                {
                  ...(dataToImport as any),
                  error: `Invalid company_id ${dataToImport.company_id}`,
                },
              ],
            },
            error: null,
          }));
          return;
        }

        const contactIds = dataToImport.contact_ids
          .map((contactId) => idsMaps.contacts[contactId])
          .filter((contactId): contactId is Identifier => contactId != null);

        if (contactIds.length !== dataToImport.contact_ids.length) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            failedImports: {
              ...old.failedImports,
              deals: [
                ...old.failedImports.deals,
                {
                  ...(dataToImport as any),
                  error: "One or more contact_ids are invalid",
                },
              ],
            },
            error: null,
          }));
          return;
        }

        const { data: importedDeal } = await dataProvider.create("deals", {
          data: {
            name: dataToImport.name.trim(),
            sales_id: salesId,
            company_id: idsMaps.companies[dataToImport.company_id],
            contact_ids: contactIds,
            category: dataToImport.category || undefined,
            stage: dataToImport.stage,
            description: dataToImport.description?.trim(),
            amount: dataToImport.amount,
            created_at: dataToImport.created_at,
            updated_at: dataToImport.updated_at,
            archived_at: dataToImport.archived_at,
            expected_closing_date: dataToImport.expected_closing_date,
            index: dataToImport.index ?? 0,
          },
        });
        idsMaps.deals[dataToImport.id] = importedDeal.id;
        setState((old) => ({
          ...old,
          status: "importing",
          stats: {
            ...old.stats,
            deals: old.stats.deals + 1,
          },
          error: null,
        }));
      } catch (err) {
        console.error(err);
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            deals: [
              ...old.failedImports.deals,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
          error: null,
        }));
      }
    };

    const importTask = async (
      dataToImport: JsonTypes.JsonPrimitive | JsonTypes.JsonStruct | undefined,
    ) => {
      if (!isTask(dataToImport)) {
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            tasks: [
              ...old.failedImports.tasks,
              { ...(dataToImport as any), error: "Invalid format" },
            ],
          },
          error: null,
        }));
        return;
      }
      try {
        const salesId = getImportedSalesId(dataToImport.sales_id);
        if (idsMaps.contacts[dataToImport.contact_id] == null) {
          markImportFailure();
          setState((old) => ({
            ...old,
            status: "importing",
            failedImports: {
              ...old.failedImports,
              tasks: [
                ...old.failedImports.tasks,
                {
                  ...(dataToImport as any),
                  error: `Invalid contact_id ${dataToImport.contact_id}`,
                },
              ],
            },
            error: null,
          }));
          return;
        }

        await dataProvider.create("tasks", {
          data: {
            contact_id: idsMaps.contacts[dataToImport.contact_id],
            sales_id: salesId,
            type: dataToImport.type || "none",
            text: dataToImport.text,
            due_date: dataToImport.due_date || undefined,
            done_date: dataToImport.done_date || undefined,
          },
        });
        setState((old) => ({
          ...old,
          status: "importing",
          stats: {
            ...old.stats,
            tasks: old.stats.tasks + 1,
          },
          error: null,
        }));
      } catch (err) {
        console.error(err);
        markImportFailure();
        setState((old) => ({
          ...old,
          status: "importing",
          failedImports: {
            ...old.failedImports,
            tasks: [
              ...old.failedImports.tasks,
              { ...(dataToImport as any), error: (err as Error).message },
            ],
          },
          error: null,
        }));
      }
    };

    let currentBatch: Array<Promise<unknown>> = [];
    // SQLWebAPI is sensitive to large parallel write bursts during import.
    // Keep the batch small so the service stays responsive across environments.
    const BATCH_SIZE = 5;

    const parser = new JSONParser({
      paths: [
        "$.format_version",
        "$.configuration",
        "$.sales.*",
        "$.companies.*",
        "$.contacts.*",
        "$.deals.*",
        "$.notes.*",
        "$.deal_notes.*",
        "$.tasks.*",
      ],
      keepStack: false,
    });
    const stream = file.stream();
    const reader = stream.pipeThrough(parser).getReader();

    const proccesBatchIfPossible = async (
      shouldProcessIncompleteBatch: boolean = false,
    ) => {
      if (currentBatch.length === BATCH_SIZE || shouldProcessIncompleteBatch) {
        const results = await Promise.allSettled(currentBatch);
        currentBatch = [];
        const rejected = results.find((result) => result.status === "rejected");
        if (rejected?.status === "rejected") throw rejected.reason;
        if (importFailure) throw importFailure;
      }
    };
    let currentType: Types = "sales";
    try {
      while (true) {
        const { done, value: parsedElementInfo } = await reader.read();
        if (done) {
          await proccesBatchIfPossible(true);
          break;
        }
        const { value, stack, partial } = parsedElementInfo;
        if (partial) continue;
        if (parsedElementInfo.key === "format_version") {
          if (value !== 2) throw new Error("Unsupported export format version");
          portable = true;
          continue;
        }
        if (parsedElementInfo.key === "configuration" && portable) {
          const sourceConfiguration =
            value as unknown as ConfigurationContextValue;
          const importedConfiguration = {
            ...defaultConfiguration,
            ...sourceConfiguration,
            // Early v2 exports wrote empty strings for omitted default logos.
            lightModeLogo:
              sourceConfiguration.lightModeLogo ||
              defaultConfiguration.lightModeLogo,
            darkModeLogo:
              sourceConfiguration.darkModeLogo ||
              defaultConfiguration.darkModeLogo,
          };
          await dataProvider.updateConfiguration(importedConfiguration);
          updateConfiguration(importedConfiguration);
          companySectors = importedConfiguration.companySectors;
          continue;
        }
        const type =
          stack.length > 1 ? getType(stack[1].key?.toString()) : undefined;

        if (type == null) {
          continue;
        }

        if (type !== currentType) {
          // When moving to another type, make sure we wait for the previous batch to be imported
          await proccesBatchIfPossible(true);
          currentType = type;
        }
        switch (type) {
          case "sales": {
            currentBatch.push(importSale(value));
            break;
          }
          case "companies": {
            currentBatch.push(importCompany(value));
            break;
          }
          case "contacts": {
            currentBatch.push(importContact(value));
            break;
          }
          case "deals": {
            currentBatch.push(importDeal(value));
            break;
          }
          case "notes": {
            currentBatch.push(importNote(value));
            break;
          }
          case "deal_notes": {
            currentBatch.push(importDealNote(value));
            break;
          }
          case "tasks": {
            currentBatch.push(importTask(value));
            break;
          }
        }
        await proccesBatchIfPossible();
      }
    } catch (error) {
      // Let already-started writes settle before publishing the final error.
      await Promise.allSettled(currentBatch);
      setState((old) => ({
        ...old,
        status: "error",
        error: error instanceof Error ? error : new Error("Import failed"),
        duration: Date.now() - startedAt.valueOf(),
      }));
      await reader.cancel();
      refresh();
      return;
    }
    setState((old) => {
      if (old.status === "error") {
        return old;
      }
      const duration = new Date().valueOf() - startedAt.valueOf();
      return {
        ...old,
        status: "success",
        duration,
      };
    });
    refresh();
  });

  return [state, importFile, reset];
};

const TYPES = [
  "sales",
  "companies",
  "contacts",
  "deals",
  "notes",
  "deal_notes",
  "tasks",
] as const;
type Types = (typeof TYPES)[number];

const getType = (value: string | undefined): Types | undefined => {
  const type = value as Types;
  if (TYPES.includes(type)) return type;
  return undefined;
};

const getCompanyNameKey = (name: string) => name.trim().toLocaleLowerCase();

const getContactNameKey = (firstName: string, lastName: string) =>
  `${firstName.trim().toLocaleLowerCase()}\u0000${lastName.trim().toLocaleLowerCase()}`;

const findExistingCompany = async (
  dataProvider: CrmDataProvider,
  name: string,
) => {
  const response = await dataProvider.getList<Company>("companies", {
    filter: { q: name.trim() },
    pagination: { page: 1, perPage: LOOKUP_PAGE_SIZE },
    sort: { field: "id", order: "ASC" },
  });

  const nameKey = getCompanyNameKey(name);
  return response.data.find(
    (company) => getCompanyNameKey(company.name) === nameKey,
  );
};

const findExistingContact = async (
  dataProvider: CrmDataProvider,
  firstName: string,
  lastName: string,
) => {
  const query = lastName.trim() || firstName.trim();
  const response = await dataProvider.getList<Contact>("contacts", {
    filter: { q: query },
    pagination: { page: 1, perPage: LOOKUP_PAGE_SIZE },
    sort: { field: "id", order: "ASC" },
  });

  const nameKey = getContactNameKey(firstName, lastName);
  return response.data.find(
    (contact) =>
      getContactNameKey(contact.first_name, contact.last_name) === nameKey,
  );
};

type SaleImport = {
  avatar?: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

const isSale = (data: any): data is SaleImport =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.id != null &&
  data.email != null &&
  data.first_name !== null &&
  data.last_name != null;

type CompanyImport = {
  id: number;
  name: string;
  logo_src?: string;
  logo_title?: string;
  logo_path?: string;
  logo_type?: string;
  sales_id?: number;
  description?: string;
  city?: string;
  country?: string;
  address?: string;
  zipcode?: string;
  state_abbr?: string;
  sector?: string;
  size?: number;
  linkedin_url?: string;
  website?: string;
  phone_number?: string;
  revenue?: string;
  tax_identifier?: string;
  context_links?: string[];
  created_at?: string;
  updated_at?: string;
};

const isCompany = (data: any): data is CompanyImport =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.id != null &&
  data.name != null;

type ContactImport = {
  id: number;
  sales_id: number;
  company_id?: number;
  first_name: string;
  last_name: string;
  title?: string;
  background?: string;
  linkedin_url?: string;
  avatar?: string;
  gender?: string;
  has_newsletter?: boolean;
  status?: string;
  emails: Array<{ email: string; type: string }>;
  phones: Array<{ number: string; type: string }>;
  tags: Array<string>;
  created_at?: string;
  updated_at?: string;
};

const isContact = (data: any): data is ContactImport =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.id != null;

type DealImport = {
  id: number;
  sales_id: number;
  company_id: number;
  contact_ids: number[];
  name: string;
  category?: string;
  stage: string;
  description?: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
  archived_at?: string;
  expected_closing_date?: string;
  index?: number;
};

const isDeal = (data: any): data is DealImport =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.id != null &&
  data.sales_id != null &&
  data.company_id != null &&
  Array.isArray(data.contact_ids) &&
  data.name != null &&
  data.stage != null &&
  data.amount != null;

type NoteImport = {
  contact_id: number;
  sales_id: number;
  text: string;
  date: string;
  status?: string;
  attachments: Array<{ url: string; name: string }>;
  created_at?: string;
  updated_at?: string;
};

const isNote = (data: any): data is NoteImport =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.sales_id != null &&
  data.contact_id != null &&
  data.text != null &&
  data.date != null;

type TaskImport = {
  contact_id: number;
  sales_id: number;
  type?: string;
  text: string;
  due_date?: string;
  done_date?: string;
  created_at?: string;
  updated_at?: string;
};

const isTask = (data: any): data is TaskImport =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.sales_id != null &&
  data.contact_id != null &&
  data.text != null;

/**
 * Maps a company size number to the appropriate size category.
 * Categories: 1, 10, 50, 250, 500
 */
const mapSizeToCategory = (size: number): 1 | 10 | 50 | 250 | 500 => {
  if (size === 1) return 1;
  if (size < 10) return 10;
  if (size < 50) return 50;
  if (size < 250) return 250;
  return 500;
};

const isDealNote = (
  data: any,
): data is Omit<NoteImport, "contact_id"> & { deal_id: number } =>
  data != null &&
  typeof data === "object" &&
  !Array.isArray(data) &&
  data.sales_id != null &&
  data.deal_id != null &&
  data.text != null &&
  data.date != null;
