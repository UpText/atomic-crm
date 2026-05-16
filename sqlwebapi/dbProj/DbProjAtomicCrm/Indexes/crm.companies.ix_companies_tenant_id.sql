CREATE NONCLUSTERED INDEX [IX_companies_tenant_id]
    ON [crm].[companies] ([tenant] ASC, [id] ASC);
