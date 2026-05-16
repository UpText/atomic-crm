CREATE NONCLUSTERED INDEX [IX_sales_tenant_id]
    ON [crm].[sales] ([tenant] ASC, [id] ASC)
    INCLUDE ([email], [user_id], [administrator], [disabled]);
