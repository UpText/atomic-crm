CREATE UNIQUE INDEX [ux_contacts_source_sales_id]
    ON [crm].[contacts] ([tenant], [source_sales_id])
    WHERE [source_sales_id] IS NOT NULL;
