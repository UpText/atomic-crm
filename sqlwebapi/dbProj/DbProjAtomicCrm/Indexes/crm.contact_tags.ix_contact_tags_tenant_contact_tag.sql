CREATE NONCLUSTERED INDEX [IX_contact_tags_tenant_contact_tag]
    ON [crm].[contact_tags] ([tenant] ASC, [contact_id] ASC, [tag_id] ASC);
