import { useState } from "react";
import {
  type Identifier,
  useDataProvider,
  useEvent,
  useGetIdentity,
} from "ra-core";

import type { CrmDataProvider } from "../providers/types";
import { defaultCompanySectors } from "../root/defaultConfiguration";
import type {
  Company,
  Contact,
  ContactNote,
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
  sales: Array<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  }>;
  companies: Array<{
    id: number;
    name: string;
    sales_id?: number;
    logo_src?: string;
    logo_title?: string;
    logo_path?: string;
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
  notes: Array<{
    contact_id: number;
    sales_id: number;
    text: string;
    date: string;
    status?: string;
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
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });

export const embedFileSrcForExport = async (src?: string): Promise<string | undefined> => {
  if (!src) {
    return undefined;
  }

  if (isDataUrl(src)) {
    return src;
  }

  try {
    const response = await fetch(src);
    if (!response.ok) {
      return src;
    }

    const blob = await response.blob();
    return await readBlobAsDataUrl(blob);
  } catch {
    return src;
  }
};

export const useExportToJson = (): [ExportFromJsonState, ExportFromJsonFunction] => {
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
      const [sales, companies, contacts, notes, tasks, tags, configuration] =
        await Promise.all([
          getAllRecords<Sale>(dataProvider, "sales"),
          getAllRecords<Company>(dataProvider, "companies"),
          getAllRecords<Contact>(dataProvider, "contacts"),
          getAllRecords<ContactNote>(dataProvider, "contact_notes"),
          getAllRecords<Task>(dataProvider, "tasks"),
          getAllRecords<Tag>(dataProvider, "tags"),
          dataProvider.getConfiguration().catch(() => undefined),
        ]);

      const salesIdMap = createIdMap(sales);
      const companyIdMap = createIdMap(companies);
      const contactIdMap = createIdMap(contacts);
      const tagNameMap = new Map(tags.map((tag) => [tag.id, tag.name]));
      const sectorValueByLabel = new Map(
        (configuration?.companySectors ?? defaultCompanySectors).map((sector) => [
          sector.label,
          sector.value,
        ]),
      );

      const exportedCompanyLogos = await Promise.all(
        companies.map((company) => embedFileSrcForExport(company.logo?.src)),
      );

      const payload: ExportSchema = {
        sales: sales.map((sale) => ({
          id: salesIdMap.get(sale.id)!,
          email: sale.email,
          first_name: sale.first_name,
          last_name: sale.last_name,
        })),
        companies: companies.map((company, index) => ({
          id: companyIdMap.get(company.id)!,
          name: company.name,
          sales_id:
            company.sales_id != null ? salesIdMap.get(company.sales_id) : undefined,
          logo_src: exportedCompanyLogos[index],
          logo_title: company.logo?.title || undefined,
          logo_path: company.logo?.path || undefined,
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
        contacts: contacts.map((contact) => ({
          id: contactIdMap.get(contact.id)!,
          sales_id:
            contact.sales_id != null ? salesIdMap.get(contact.sales_id) : undefined,
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
            .map((tagId) => tagNameMap.get(Number(tagId)) ?? tagNameMap.get(tagId as number))
            .filter((tagName): tagName is string => !!tagName),
          created_at: contact.first_seen || undefined,
          updated_at: contact.last_seen || undefined,
        })),
        notes: notes
          .filter(
            (note) =>
              salesIdMap.has(note.sales_id) && contactIdMap.has(note.contact_id),
          )
          .map((note) => ({
            contact_id: contactIdMap.get(note.contact_id)!,
            sales_id: salesIdMap.get(note.sales_id)!,
            text: note.text,
            date: note.date,
            status: note.status || undefined,
          })),
        tasks: tasks
          .filter(
            (task) =>
              task.sales_id != null &&
              salesIdMap.has(task.sales_id) &&
              contactIdMap.has(task.contact_id),
          )
          .map((task) => ({
            contact_id: contactIdMap.get(task.contact_id)!,
            sales_id: salesIdMap.get(task.sales_id!)!,
            type: task.type || "none",
            text: task.text,
            due_date: task.due_date || undefined,
            done_date: task.done_date || undefined,
          })),
      };

      downloadJson(payload, "atomic-crm-export.json");

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
