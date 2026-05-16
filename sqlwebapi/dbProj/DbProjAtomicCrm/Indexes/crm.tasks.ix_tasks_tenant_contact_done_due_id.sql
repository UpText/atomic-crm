CREATE NONCLUSTERED INDEX [IX_tasks_tenant_contact_done_due_id]
    ON [crm].[tasks] (
        [tenant] ASC,
        [contact_id] ASC,
        [done_date] ASC,
        [due_date] ASC,
        [id] ASC
    );
