CREATE NONCLUSTERED INDEX [IX_deals_tenant_company_category_archived_id]
    ON [crm].[deals] (
        [tenant] ASC,
        [company_id] ASC,
        [category] ASC,
        [archived_at] ASC,
        [id] ASC
    );
