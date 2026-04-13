CREATE TABLE [crm].[tasks] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_tasks_tenant] DEFAULT ('default'),
    [contact_id] [int] NOT NULL,
    [sales_id] [int] NULL,
    [type] [nvarchar](80) NOT NULL,
    [text] [nvarchar](MAX) NOT NULL,
    [due_date] [datetime2](0) NOT NULL,
    [done_date] [datetime2](0) NULL,
    CONSTRAINT [PK_task] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_task_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
