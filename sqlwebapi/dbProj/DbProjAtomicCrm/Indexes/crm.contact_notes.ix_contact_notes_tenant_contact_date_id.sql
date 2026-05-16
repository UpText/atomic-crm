CREATE NONCLUSTERED INDEX [IX_contact_notes_tenant_contact_date_id]
    ON [crm].[contact_notes] ([tenant] ASC, [contact_id] ASC, [date] DESC, [id] ASC);
