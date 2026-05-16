CREATE NONCLUSTERED INDEX [IX_contacts_tenant_company_id]
    ON [crm].[contacts] ([tenant] ASC, [company_id] ASC, [id] ASC);
