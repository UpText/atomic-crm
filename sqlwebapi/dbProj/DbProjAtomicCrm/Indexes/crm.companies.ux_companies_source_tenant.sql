CREATE UNIQUE INDEX [ux_companies_source_tenant]
    ON [crm].[companies] ([tenant], [source_tenant])
    WHERE [source_tenant] IS NOT NULL;
