import { useState } from "react";
import {
  type Identifier,
  useDataProvider,
  useEvent,
  useGetIdentity,
} from "ra-core";

import type { ConfigurationContextValue } from "../root/ConfigurationContext";
import type { CrmDataProvider } from "../providers/types";
import {
  defaultCompanySectors,
  defaultConfiguration,
} from "../root/defaultConfiguration";
import type {
  Company,
  Contact,
  ContactNote,
  Deal,
  DealNote,
  Sale,
  Tag,
  Task,
} from "../types";

type ExportFromJsonState =
  | {
      status: "idle";
      error: null;
    }
  | {
      status: "exporting";
      error: null;
    }
  | {
      status: "success";
      error: null;
    }
  | {
      status: "error";
      error: Error;
    };

type ExportFromJsonFunction = () => Promise<void>;

type ExportSchema = {
  format_version: 2;
  configuration: ConfigurationContextValue;
  sales: Array<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  }>;
  companies: Array<{
    id: number;
    name: string;
    sales_id?: number;
    logo_src?: string;
    logo_title?: string;
    logo_type?: string;
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
  }>;
  contacts: Array<{
    id: number;
    sales_id?: number;
    company_id?: number;
    first_name: string;
    last_name: string;
    title?: string;
    background?: string;
    avatar?: string;
    linkedin_url?: string | null;
    gender?: string;
    has_newsletter?: boolean;
    status?: string;
    emails?: Contact["email_jsonb"];
    phones?: Contact["phone_jsonb"];
    tags: string[];
    created_at?: string;
    updated_at?: string;
  }>;
  deals: Array<{
    id: number;
    sales_id?: number;
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
  }>;
  notes: Array<{
    contact_id: number;
    sales_id: number;
    text: string;
    date: string;
    status?: string;
    attachments?: Array<{ url: string; name: string }>;
  }>;
  deal_notes: Array<{
    deal_id: number;
    sales_id: number;
    text: string;
    date: string;
    attachments?: Array<{ url: string; name: string }>;
  }>;
  tasks: Array<{
    contact_id: number;
    sales_id: number;
    type?: string;
    text: string;
    due_date?: string;
    done_date?: string;
  }>;
};

const PAGE_SIZE = 1000;

const isDataUrl = (value: string) => value.startsWith("data:");

const readBlobAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });

export const embedFileSrcForExport = async (
  src?: string,
): Promise<string | undefined> => {
  if (!src) {
    return undefined;
  }

  if (isDataUrl(src)) {
    return src;
  }

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    return await readBlobAsDataUrl(blob);
  } catch (error) {
    throw new Error(`Export incomplete: unable to download file ${src}`, {
      cause: error,
    });
  }
};

export const useExportToJson = (): [
  ExportFromJsonState,
  ExportFromJsonFunction,
] => {
  const { identity } = useGetIdentity();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const [state, setState] = useState<ExportFromJsonState>({
    status: "idle",
    error: null,
  });

  const exportFile = useEvent(async () => {
    if (identity == null) {
      throw new Error("Exporting data requires authentication");
    }

    setState({
      status: "exporting",
      error: null,
    });

    try {
      const [
        sales,
        companies,
        contacts,
        deals,
        contactNotes,
        dealNotes,
        tasks,
        tags,
        storedConfiguration,
      ] = await Promise.all([
        getAllRecords<Sale>(dataProvider, "sales"),
        getAllRecords<Company>(dataProvider, "companies"),
        getAllRecords<Contact>(dataProvider, "contacts"),
        getAllRecords<Deal>(dataProvider, "deals"),
        getAllRecords<ContactNote>(dataProvider, "contact_notes"),
        getAllRecords<DealNote>(dataProvider, "deal_notes"),
        getAllRecords<Task>(dataProvider, "tasks"),
        getAllRecords<Tag>(dataProvider, "tags"),
        dataProvider.getConfiguration(),
      ]);

      const configuration = { ...defaultConfiguration, ...storedConfiguration };

      const salesIdMap = createIdMap(sales);
      const companyIdMap = createIdMap(companies);
      const contactIdMap = createIdMap(contacts);
      const dealIdMap = createIdMap(deals);
      const currentSalesId = getSalesIdForExport(identity.id, salesIdMap);
      const tagNameMap = new Map(tags.map((tag) => [tag.id, tag.name]));
      const sectorValueByLabel = new Map(
        (configuration?.companySectors ?? defaultCompanySectors).map(
          (sector) => [sector.label, sector.value],
        ),
      );

      const exportedCompanyLogos = await Promise.all(
        companies.map((company) => embedFileSrcForExport(company.logo?.src)),
      );

      const exportedSalesAvatars = await Promise.all(
        sales.map((sale) => embedFileSrcForExport(getAvatarSrc(sale))),
      );
      const exportedContactAvatars = await Promise.all(
        contacts.map((contact) => embedFileSrcForExport(getAvatarSrc(contact))),
      );
      const contactAttachments = new Map(
        await Promise.all(
          contactNotes.map(
            async (note) =>
              [
                note.id,
                await getNoteAttachmentsForExport(note.attachments),
              ] as const,
          ),
        ),
      );
      const dealAttachments = new Map(
        await Promise.all(
          dealNotes.map(
            async (note) =>
              [
                note.id,
                await getNoteAttachmentsForExport(note.attachments),
              ] as const,
          ),
        ),
      );

      const payload: ExportSchema = {
        format_version: 2,
        configuration: {
          ...configuration,
          lightModeLogo:
            (await embedFileSrcForExport(configuration.lightModeLogo)) ?? "",
          darkModeLogo:
            (await embedFileSrcForExport(configuration.darkModeLogo)) ?? "",
        },
        sales: sales.map((sale, index) => ({
          avatar: exportedSalesAvatars[index],
          id: salesIdMap.get(sale.id)!,
          email: sale.email,
          first_name: sale.first_name,
          last_name: sale.last_name,
        })),
        companies: companies.map((company, index) => ({
          id: companyIdMap.get(company.id)!,
          name: company.name,
          sales_id:
            company.sales_id != null
              ? salesIdMap.get(company.sales_id)
              : undefined,
          logo_src: exportedCompanyLogos[index],
          logo_title: company.logo?.title || undefined,
          logo_type: company.logo?.type || undefined,
          description: company.description || undefined,
          city: company.city || undefined,
          country: company.country || undefined,
          address: company.address || undefined,
          zipcode: company.zipcode || undefined,
          state_abbr: company.state_abbr || undefined,
          sector: normalizeSector(company.sector, sectorValueByLabel),
          size: company.size || undefined,
          linkedin_url: company.linkedin_url || undefined,
          website: company.website || undefined,
          phone_number: company.phone_number || undefined,
          revenue: company.revenue || undefined,
          tax_identifier: company.tax_identifier || undefined,
          context_links: company.context_links?.length
            ? company.context_links
            : undefined,
          created_at: company.created_at || undefined,
        })),
        contacts: contacts.map((contact, index) => ({
          avatar: exportedContactAvatars[index],
          id: contactIdMap.get(contact.id)!,
          sales_id:
            contact.sales_id != null
              ? salesIdMap.get(contact.sales_id)
              : undefined,
          company_id:
            contact.company_id != null
              ? companyIdMap.get(contact.company_id)
              : undefined,
          first_name: contact.first_name,
          last_name: contact.last_name,
          title: contact.title || undefined,
          background: contact.background || undefined,
          linkedin_url: contact.linkedin_url || undefined,
          gender: contact.gender || undefined,
          has_newsletter: contact.has_newsletter,
          status: contact.status || undefined,
          emails: contact.email_jsonb?.length ? contact.email_jsonb : undefined,
          phones: contact.phone_jsonb?.length ? contact.phone_jsonb : undefined,
          tags: contact.tags
            .map(
              (tagId) =>
                tagNameMap.get(Number(tagId)) ??
                tagNameMap.get(tagId as number),
            )
            .filter((tagName): tagName is string => !!tagName),
          created_at: contact.first_seen || undefined,
          updated_at: contact.last_seen || undefined,
        })),
        deals: deals
          .filter((deal) => {
            const contactIds = getDealContactIdsForExport(deal);

            return (
              salesIdMap.has(deal.sales_id) &&
              companyIdMap.has(deal.company_id) &&
              contactIds.every((contactId) => contactIdMap.has(contactId))
            );
          })
          .map((deal) => ({
            id: dealIdMap.get(deal.id)!,
            sales_id:
              deal.sales_id != null ? salesIdMap.get(deal.sales_id) : undefined,
            company_id: companyIdMap.get(deal.company_id)!,
            contact_ids: getDealContactIdsForExport(deal).map(
              (contactId) => contactIdMap.get(contactId)!,
            ),
            name: deal.name,
            category: deal.category || undefined,
            stage: deal.stage,
            description: deal.description || undefined,
            amount: deal.amount,
            created_at: deal.created_at || undefined,
            updated_at: deal.updated_at || undefined,
            archived_at: deal.archived_at || undefined,
            expected_closing_date: deal.expected_closing_date || undefined,
            index: deal.index,
          })),
        notes: contactNotes
          .map((note) => ({
            note,
            salesId: getSalesIdForExport(
              note.sales_id,
              salesIdMap,
              currentSalesId,
            ),
            contactId: contactIdMap.get(note.contact_id),
          }))
          .filter(
            (
              item,
            ): item is {
              note: ContactNote;
              salesId: number;
              contactId: number;
            } => item.salesId != null && item.contactId != null,
          )
          .map(({ note, salesId, contactId }) => ({
            contact_id: contactId,
            sales_id: salesId,
            text: note.text,
            date: note.date,
            status: note.status || undefined,
            attachments: contactAttachments.get(note.id),
          })),
        deal_notes: dealNotes
          .map((note) => ({
            note,
            salesId: getSalesIdForExport(
              note.sales_id,
              salesIdMap,
              currentSalesId,
            ),
            dealId: dealIdMap.get(note.deal_id),
          }))
          .filter(
            (
              item,
            ): item is {
              note: DealNote;
              salesId: number;
              dealId: number;
            } => item.salesId != null && item.dealId != null,
          )
          .map(({ note, salesId, dealId }) => ({
            deal_id: dealId,
            sales_id: salesId,
            text: note.text,
            date: note.date,
            attachments: dealAttachments.get(note.id),
          })),
        tasks: tasks
          .map((task) => ({
            task,
            salesId: getSalesIdForExport(
              task.sales_id,
              salesIdMap,
              currentSalesId,
            ),
            contactId: contactIdMap.get(task.contact_id),
          }))
          .filter(
            (
              item,
            ): item is { task: Task; salesId: number; contactId: number } =>
              item.salesId != null && item.contactId != null,
          )
          .map(({ task, salesId, contactId }) => ({
            contact_id: contactId,
            sales_id: salesId,
            type: task.type || "none",
            text: task.text,
            due_date: task.due_date || undefined,
            done_date: task.done_date || undefined,
          })),
      };

      // A migration must never silently drop records with broken relationships.
      if (
        payload.deals.length !== deals.length ||
        payload.notes.length !== contactNotes.length ||
        payload.deal_notes.length !== dealNotes.length ||
        payload.tasks.length !== tasks.length ||
        contacts.some(
          (contact) =>
            contact.company_id != null && !companyIdMap.has(contact.company_id),
        )
      ) {
        throw new Error(
          "Export incomplete: some records reference missing companies, contacts, deals, or sales. Repair these relationships before exporting.",
        );
      }
      downloadJson(payload, "uptextcrm-export.json");

      setState({
        status: "success",
        error: null,
      });
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Export failed");
      setState({
        status: "error",
        error: normalizedError,
      });
      throw normalizedError;
    }
  });

  return [state, exportFile];
};

const getAllRecords = async <T extends { id: Identifier }>(
  dataProvider: CrmDataProvider,
  resource: string,
): Promise<T[]> => {
  const records: T[] = [];
  let page = 1;
  let total = Number.POSITIVE_INFINITY;

  while (records.length < total) {
    const response = await dataProvider.getList<T>(resource, {
      filter: {},
      pagination: { page, perPage: PAGE_SIZE },
      sort: { field: "id", order: "ASC" },
    });

    records.push(...response.data);
    total = response.total ?? records.length;

    if (response.data.length < PAGE_SIZE) {
      break;
    }

    page += 1;
  }

  return records;
};

const createIdMap = <T extends { id: Identifier }>(records: T[]) => {
  return records.reduce((map, record, index) => {
    map.set(record.id, index + 1);
    return map;
  }, new Map<Identifier, number>());
};

export const getDealContactIdsForExport = (
  deal: Pick<Partial<Deal>, "contact_ids">,
) => (Array.isArray(deal.contact_ids) ? deal.contact_ids : []);

export const getSalesIdForExport = (
  salesId: Identifier | null | undefined,
  salesIdMap: Map<Identifier, number>,
  fallbackSalesId?: number,
) => {
  if (salesId != null && salesIdMap.has(salesId)) {
    return salesIdMap.get(salesId);
  }

  return fallbackSalesId;
};

export const getNoteAttachmentsForExport = async (
  attachments?: Array<{ src?: string; title?: string; path?: string }> | null,
) => {
  if (!attachments?.length) return undefined;
  return Promise.all(
    attachments.map(async (attachment) => {
      if (!attachment.src)
        throw new Error(
          `Export incomplete: attachment ${attachment.title || attachment.path || "attachment"} has no source`,
        );
      return {
        url: (await embedFileSrcForExport(attachment.src))!,
        name: attachment.title || attachment.path || "attachment",
      };
    }),
  );
};

const downloadJson = (data: ExportSchema, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
};

const normalizeSector = (
  sector: string | undefined,
  sectorValueByLabel: Map<string, string>,
) => {
  if (!sector) {
    return undefined;
  }

  if (sectorValueByLabel.has(sector)) {
    return sectorValueByLabel.get(sector);
  }

  return sector.toLowerCase().replace(/\s+/g, "-");
};

const getAvatarSrc = (record: { avatar?: { src?: string } }) =>
  record.avatar?.src ?? (record as { avatar_src?: string }).avatar_src;
