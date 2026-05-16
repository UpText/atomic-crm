CREATE NONCLUSTERED INDEX [IX_deal_notes_tenant_deal_date_id]
    ON [crm].[deal_notes] ([tenant] ASC, [deal_id] ASC, [date] DESC, [id] ASC);
