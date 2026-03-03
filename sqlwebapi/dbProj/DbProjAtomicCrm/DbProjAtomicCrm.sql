CREATE TABLE [crm].[contact_tags] (
    [contact_id] INT NOT NULL,
    [tag_id]     INT NOT NULL,
    CONSTRAINT [PK_contact_tag] PRIMARY KEY CLUSTERED ([contact_id] ASC, [tag_id] ASC),
    CONSTRAINT [FK_contact_tag_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_contact_tag_tag] FOREIGN KEY ([tag_id]) REFERENCES [crm].[tags] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[sales] (
    [id]              INT             NOT NULL,
    [user_id]         NVARCHAR (64)   NOT NULL,
    [first_name]      NVARCHAR (100)  NOT NULL,
    [last_name]       NVARCHAR (100)  NOT NULL,
    [email]           NVARCHAR (255)  NOT NULL,
    [password]        NVARCHAR (255)  NULL,
    [administrator]   BIT             CONSTRAINT [DF_sales_admin] DEFAULT ((0)) NOT NULL,
    [disabled]        BIT             CONSTRAINT [DF_sales_disabled] DEFAULT ((0)) NOT NULL,
    [avatar_src]      NVARCHAR (MAX)  NULL,
    [avatar_title]    NVARCHAR (400)  NULL,
    [avatar_path]     NVARCHAR (400)  NULL,
    [avatar_type]     NVARCHAR (100)  NULL,
    [avatar_raw_file] VARBINARY (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    UNIQUE NONCLUSTERED ([email] ASC)
);


GO

CREATE TABLE [crm].[deal_notes] (
    [id]       INT            IDENTITY (1, 1) NOT NULL,
    [deal_id]  INT            NOT NULL,
    [sales_id] INT            NOT NULL,
    [date]     DATETIME2 (0)  NOT NULL,
    [text]     NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_deal_note] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_deal_note_deal] FOREIGN KEY ([deal_id]) REFERENCES [crm].[deals] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_deal_note_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO

CREATE TABLE [dbo].[contact_tags] (
    [contact_id] INT NOT NULL,
    [tag_id]     INT NOT NULL,
    CONSTRAINT [PK_contact_tags] PRIMARY KEY CLUSTERED ([contact_id] ASC, [tag_id] ASC),
    CONSTRAINT [FK_contact_tags_contacts] FOREIGN KEY ([contact_id]) REFERENCES [dbo].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_contact_tags_tags] FOREIGN KEY ([tag_id]) REFERENCES [dbo].[tags] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [crm].[tags] (
    [id]    INT            IDENTITY (1, 1) NOT NULL,
    [name]  NVARCHAR (100) NOT NULL,
    [color] NVARCHAR (30)  NOT NULL,
    CONSTRAINT [PK_tag] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [UQ_tag_name] UNIQUE NONCLUSTERED ([name] ASC)
);


GO

CREATE TABLE [dbo].[note_statuses] (
    [value] NVARCHAR (100) NOT NULL,
    [label] NVARCHAR (100) NOT NULL,
    [color] NVARCHAR (20)  NULL,
    PRIMARY KEY CLUSTERED ([value] ASC)
);


GO

CREATE TABLE [crm].[activities] (
    [id]              INT           IDENTITY (1, 1) NOT NULL,
    [type]            NVARCHAR (50) NOT NULL,
    [date]            DATETIME2 (0) NOT NULL,
    [sales_id]        INT           NULL,
    [company_id]      INT           NULL,
    [contact_id]      INT           NULL,
    [contact_note_id] INT           NULL,
    [deal_id]         INT           NULL,
    [deal_note_id]    INT           NULL,
    CONSTRAINT [PK_activity] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_activity_company] FOREIGN KEY ([company_id]) REFERENCES [crm].[companies] ([id]),
    CONSTRAINT [FK_activity_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]),
    CONSTRAINT [FK_activity_contact_note] FOREIGN KEY ([contact_note_id]) REFERENCES [crm].[contact_notes] ([id]),
    CONSTRAINT [FK_activity_deal] FOREIGN KEY ([deal_id]) REFERENCES [crm].[deals] ([id]),
    CONSTRAINT [FK_activity_deal_note] FOREIGN KEY ([deal_note_id]) REFERENCES [crm].[deal_notes] ([id]),
    CONSTRAINT [FK_activity_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO

CREATE TABLE [dbo].[deal_contacts] (
    [deal_id]    INT NOT NULL,
    [contact_id] INT NOT NULL,
    CONSTRAINT [PK_deal_contacts] PRIMARY KEY CLUSTERED ([deal_id] ASC, [contact_id] ASC),
    CONSTRAINT [FK_deal_contacts_contacts] FOREIGN KEY ([contact_id]) REFERENCES [dbo].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_deal_contacts_deals] FOREIGN KEY ([deal_id]) REFERENCES [dbo].[deals] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[contact_notes] (
    [id]         INT            NOT NULL,
    [contact_id] INT            NOT NULL,
    [text]       NVARCHAR (MAX) NOT NULL,
    [date]       DATETIME2 (3)  NOT NULL,
    [sales_id]   INT            NOT NULL,
    [status]     NVARCHAR (100) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_contact_notes_contacts] FOREIGN KEY ([contact_id]) REFERENCES [dbo].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_contact_notes_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id]),
    CONSTRAINT [FK_contact_notes_statuses] FOREIGN KEY ([status]) REFERENCES [dbo].[note_statuses] ([value])
);


GO

CREATE TABLE [dbo].[companies] (
    [id]                 INT             NOT NULL,
    [name]               NVARCHAR (255)  NOT NULL,
    [logo_src]           NVARCHAR (255)  NULL,
    [logo_title]         NVARCHAR (MAX)  NULL,
    [logo_path]          NVARCHAR (MAX)  NULL,
    [logo_type]          NVARCHAR (100)  NULL,
    [logo_raw_file]      VARBINARY (MAX) NULL,
    [sector]             NVARCHAR (100)  NULL,
    [size]               INT             NULL,
    [linkedin_url]       NVARCHAR (255)  NULL,
    [website]            NVARCHAR (255)  NULL,
    [phone_number]       NVARCHAR (40)   NULL,
    [address]            NVARCHAR (255)  NULL,
    [zipcode]            NVARCHAR (20)   NULL,
    [city]               NVARCHAR (100)  NULL,
    [stateAbbr]          CHAR (2)        NULL,
    [sales_id]           INT             NULL,
    [created_at]         DATETIME2 (3)   NULL,
    [description]        NVARCHAR (MAX)  NULL,
    [revenue]            NVARCHAR (20)   NULL,
    [tax_identifier]     NVARCHAR (50)   NULL,
    [country]            NVARCHAR (100)  NULL,
    [context_links_json] NVARCHAR (MAX)  NULL,
    [nb_contacts]        INT             NULL,
    [nb_deals]           INT             NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_companies_context_links_json] CHECK ([context_links_json] IS NULL OR isjson([context_links_json])=(1)),
    CONSTRAINT [CK_companies_size] CHECK ([size]=(500) OR [size]=(250) OR [size]=(50) OR [size]=(10) OR [size]=(1) OR [size] IS NULL),
    CONSTRAINT [FK_companies_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id])
);


GO

CREATE TABLE [dbo].[deal_notes] (
    [id]       INT            NOT NULL,
    [deal_id]  INT            NOT NULL,
    [text]     NVARCHAR (MAX) NOT NULL,
    [date]     DATETIME2 (3)  NOT NULL,
    [sales_id] INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_deal_notes_deals] FOREIGN KEY ([deal_id]) REFERENCES [dbo].[deals] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_deal_notes_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id])
);


GO

CREATE TABLE [dbo].[contact_genders] (
    [value] NVARCHAR (50)  NOT NULL,
    [label] NVARCHAR (100) NOT NULL,
    [icon]  NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([value] ASC)
);


GO

CREATE TABLE [crm].[tasks] (
    [id]         INT            IDENTITY (1, 1) NOT NULL,
    [contact_id] INT            NOT NULL,
    [sales_id]   INT            NULL,
    [type]       NVARCHAR (80)  NOT NULL,
    [text]       NVARCHAR (MAX) NOT NULL,
    [due_date]   DATETIME2 (0)  NOT NULL,
    [done_date]  DATETIME2 (0)  NULL,
    CONSTRAINT [PK_task] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_task_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_task_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO

CREATE TABLE [crm].[contact_notes] (
    [id]         INT            IDENTITY (1, 1) NOT NULL,
    [contact_id] INT            NOT NULL,
    [sales_id]   INT            NOT NULL,
    [date]       DATETIME2 (0)  NOT NULL,
    [text]       NVARCHAR (MAX) NOT NULL,
    [status]     NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK_contact_note] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_contact_note_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_contact_note_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO

CREATE TABLE [dbo].[deal_note_attachments] (
    [id]           INT             IDENTITY (1, 1) NOT NULL,
    [deal_note_id] INT             NOT NULL,
    [src]          NVARCHAR (MAX)  NOT NULL,
    [title]        NVARCHAR (400)  NULL,
    [path]         NVARCHAR (400)  NULL,
    [type]         NVARCHAR (100)  NULL,
    [raw_file]     VARBINARY (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_dna_deal_notes] FOREIGN KEY ([deal_note_id]) REFERENCES [dbo].[deal_notes] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [crm].[deals] (
    [id]                    INT             IDENTITY (1, 1) NOT NULL,
    [name]                  NVARCHAR (200)  NOT NULL,
    [company_id]            INT             NOT NULL,
    [category]              NVARCHAR (80)   NOT NULL,
    [stage]                 NVARCHAR (80)   NOT NULL,
    [description]           NVARCHAR (MAX)  NOT NULL,
    [amount]                DECIMAL (18, 2) NOT NULL,
    [created_at]            DATETIME2 (0)   NOT NULL,
    [updated_at]            DATETIME2 (0)   NOT NULL,
    [archived_at]           DATETIME2 (0)   NULL,
    [expected_closing_date] DATETIME2 (0)   NOT NULL,
    [sales_id]              INT             NOT NULL,
    [index]                 INT             NOT NULL,
    CONSTRAINT [PK_deal] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_deal_company] FOREIGN KEY ([company_id]) REFERENCES [crm].[companies] ([id]),
    CONSTRAINT [FK_deal_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO

CREATE TABLE [crm].[companies] (
    [id]             INT             IDENTITY (1, 1) NOT NULL,
    [name]           NVARCHAR (200)  NOT NULL,
    [sector]         NVARCHAR (100)  NULL,
    [size]           INT             CONSTRAINT [DEFAULT_company_size] DEFAULT ((1)) NOT NULL,
    [linkedin_url]   NVARCHAR (2048) NULL,
    [website]        NVARCHAR (2048) NULL,
    [phone_number]   NVARCHAR (50)   NULL,
    [address]        NVARCHAR (300)  NULL,
    [zipcode]        NVARCHAR (20)   NULL,
    [city]           NVARCHAR (100)  NULL,
    [state_abbr]     NVARCHAR (20)   NULL,
    [country]        NVARCHAR (100)  NULL,
    [description]    NVARCHAR (MAX)  NULL,
    [revenue]        NVARCHAR (50)   NULL,
    [tax_identifier] NVARCHAR (100)  NULL,
    [created_at]     DATETIME2 (0)   NOT NULL,
    [sales_id]       INT             NULL,
    [logo_src]       NVARCHAR (2048) NULL,
    [logo_title]     NVARCHAR (255)  NULL,
    [logo_path]      NVARCHAR (1024) NULL,
    [logo_type]      NVARCHAR (128)  NULL,
    [context_links]  NVARCHAR (MAX)  NULL,
    CONSTRAINT [PK_company] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_company_size] CHECK ([size]=(500) OR [size]=(250) OR [size]=(50) OR [size]=(10) OR [size]=(1)),
    CONSTRAINT [FK_company_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO
ALTER TABLE [crm].[companies] NOCHECK CONSTRAINT [FK_company_sales];


GO

CREATE TABLE [crm].[contacts] (
    [id]             INT             IDENTITY (1, 1) NOT NULL,
    [first_name]     NVARCHAR (100)  NOT NULL,
    [last_name]      NVARCHAR (100)  NOT NULL,
    [title]          NVARCHAR (150)  NOT NULL,
    [company_id]     INT             NOT NULL,
    [sales_id]       INT             NOT NULL,
    [linkedin_url]   NVARCHAR (2048) NULL,
    [first_seen]     DATETIME2 (0)   NULL,
    [last_seen]      DATETIME2 (0)   NULL,
    [has_newsletter] BIT             CONSTRAINT [DF_contact_has_newsletter] DEFAULT ((0)) NULL,
    [gender]         NVARCHAR (50)   NULL,
    [status]         NVARCHAR (50)   NULL,
    [background]     NVARCHAR (MAX)  NULL,
    [emails_json]    NVARCHAR (MAX)  NULL,
    [phones_json]    NVARCHAR (MAX)  NULL,
    [avatar_src]     NVARCHAR (2048) NULL,
    [avatar_title]   NVARCHAR (255)  NULL,
    [avatar_path]    NVARCHAR (1024) NULL,
    [avatar_type]    NVARCHAR (128)  NULL,
    CONSTRAINT [PK_contact] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_contact_emails_json] CHECK (isjson([emails_json])=(1)),
    CONSTRAINT [CK_contact_phones_json] CHECK (isjson([phones_json])=(1)),
    CONSTRAINT [FK_contact_company] FOREIGN KEY ([company_id]) REFERENCES [crm].[companies] ([id]),
    CONSTRAINT [FK_contact_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id])
);


GO

CREATE TABLE [dbo].[deal_stages] (
    [value] NVARCHAR (100) NOT NULL,
    [label] NVARCHAR (100) NOT NULL,
    PRIMARY KEY CLUSTERED ([value] ASC)
);


GO

CREATE TABLE [dbo].[contact_note_attachments] (
    [id]              INT             IDENTITY (1, 1) NOT NULL,
    [contact_note_id] INT             NOT NULL,
    [src]             NVARCHAR (MAX)  NOT NULL,
    [title]           NVARCHAR (400)  NULL,
    [path]            NVARCHAR (400)  NULL,
    [type]            NVARCHAR (100)  NULL,
    [raw_file]        VARBINARY (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_cna_contact_notes] FOREIGN KEY ([contact_note_id]) REFERENCES [dbo].[contact_notes] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [crm].[note_attachments] (
    [id]              INT             IDENTITY (1, 1) NOT NULL,
    [contact_note_id] INT             NULL,
    [deal_note_id]    INT             NULL,
    [src]             NVARCHAR (2048) NOT NULL,
    [title]           NVARCHAR (255)  NOT NULL,
    [path]            NVARCHAR (1024) NULL,
    [type]            NVARCHAR (128)  NULL,
    [created_at]      DATETIME2 (0)   CONSTRAINT [DF_note_attachment_created_at] DEFAULT (sysutcdatetime()) NOT NULL,
    CONSTRAINT [PK_note_attachment] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_note_attachment_one_parent] CHECK ((case when [contact_note_id] IS NULL then (0) else (1) end+case when [deal_note_id] IS NULL then (0) else (1) end)=(1)),
    CONSTRAINT [FK_note_attachment_contact_note] FOREIGN KEY ([contact_note_id]) REFERENCES [crm].[contact_notes] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_note_attachment_deal_note] FOREIGN KEY ([deal_note_id]) REFERENCES [crm].[deal_notes] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[tags] (
    [id]    INT            NOT NULL,
    [name]  NVARCHAR (100) NOT NULL,
    [color] CHAR (7)       NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    UNIQUE NONCLUSTERED ([name] ASC)
);


GO

CREATE TABLE [dbo].[contacts] (
    [id]              INT             NOT NULL,
    [first_name]      NVARCHAR (100)  NOT NULL,
    [last_name]       NVARCHAR (100)  NOT NULL,
    [title]           NVARCHAR (150)  NOT NULL,
    [company_id]      INT             NOT NULL,
    [email]           NVARCHAR (255)  NOT NULL,
    [avatar_src]      NVARCHAR (MAX)  NULL,
    [avatar_title]    NVARCHAR (400)  NULL,
    [avatar_path]     NVARCHAR (400)  NULL,
    [avatar_type]     NVARCHAR (100)  NULL,
    [avatar_raw_file] VARBINARY (MAX) NULL,
    [linkedin_url]    NVARCHAR (255)  NULL,
    [first_seen]      DATETIME2 (3)   NOT NULL,
    [last_seen]       DATETIME2 (3)   NOT NULL,
    [has_newsletter]  BIT             CONSTRAINT [DF_contacts_has_news] DEFAULT ((0)) NOT NULL,
    [gender]          NVARCHAR (50)   NOT NULL,
    [sales_id]        INT             NULL,
    [status]          NVARCHAR (100)  NOT NULL,
    [background]      NVARCHAR (MAX)  NOT NULL,
    [phone_1_type]    NVARCHAR (10)   NOT NULL,
    [phone_1_number]  NVARCHAR (40)   NOT NULL,
    [phone_2_type]    NVARCHAR (10)   NOT NULL,
    [phone_2_number]  NVARCHAR (40)   NOT NULL,
    [nb_tasks]        INT             NULL,
    [company_name]    NVARCHAR (255)  NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_contacts_phone1_type] CHECK ([phone_1_type]=N'Other' OR [phone_1_type]=N'Home' OR [phone_1_type]=N'Work'),
    CONSTRAINT [CK_contacts_phone2_type] CHECK ([phone_2_type]=N'Other' OR [phone_2_type]=N'Home' OR [phone_2_type]=N'Work'),
    CONSTRAINT [FK_contacts_companies] FOREIGN KEY ([company_id]) REFERENCES [dbo].[companies] ([id]),
    CONSTRAINT [FK_contacts_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id])
);


GO

CREATE TABLE [dbo].[tasks] (
    [id]         INT            NOT NULL,
    [contact_id] INT            NOT NULL,
    [type]       NVARCHAR (100) NOT NULL,
    [text]       NVARCHAR (MAX) NOT NULL,
    [due_date]   DATETIME2 (3)  NOT NULL,
    [done_date]  DATETIME2 (3)  NULL,
    [sales_id]   INT            NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_tasks_contacts] FOREIGN KEY ([contact_id]) REFERENCES [dbo].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_tasks_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id])
);


GO

CREATE TABLE [crm].[sales] (
    [id]            INT             IDENTITY (1, 1) NOT NULL,
    [user_id]       VARCHAR (50)    NULL,
    [email]         NVARCHAR (320)  NULL,
    [first_name]    NVARCHAR (100)  NULL,
    [last_name]     NVARCHAR (100)  NULL,
    [administrator] BIT             CONSTRAINT [DF_sales_admin] DEFAULT ((0)) NOT NULL,
    [disabled]      BIT             CONSTRAINT [DF_sales_disabled] DEFAULT ((0)) NOT NULL,
    [avatar_src]    NVARCHAR (2048) NULL,
    [avatar_title]  NVARCHAR (255)  NULL,
    [avatar_path]   NVARCHAR (1024) NULL,
    [avatar_type]   NVARCHAR (128)  NULL,
    [created_at]    DATETIME2 (0)   CONSTRAINT [DF_sales_created_at] DEFAULT (sysutcdatetime()) NOT NULL,
    [updated_at]    DATETIME2 (0)   CONSTRAINT [DF_sales_updated_at] DEFAULT (sysutcdatetime()) NOT NULL,
    CONSTRAINT [PK_sales] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [UQ_sales_email] UNIQUE NONCLUSTERED ([email] ASC)
);


GO

CREATE TABLE [dbo].[activities] (
    [id]              INT           NOT NULL,
    [type]            NVARCHAR (50) NOT NULL,
    [date]            DATETIME2 (3) NOT NULL,
    [company_id]      INT           NULL,
    [contact_id]      INT           NULL,
    [contact_note_id] INT           NULL,
    [deal_id]         INT           NULL,
    [deal_note_id]    INT           NULL,
    [sales_id]        INT           NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_activities_type] CHECK ([type]=N'DEAL_NOTE_CREATED' OR [type]=N'DEAL_CREATED' OR [type]=N'CONTACT_NOTE_CREATED' OR [type]=N'CONTACT_CREATED' OR [type]=N'COMPANY_CREATED'),
    CONSTRAINT [FK_activities_companies] FOREIGN KEY ([company_id]) REFERENCES [dbo].[companies] ([id]),
    CONSTRAINT [FK_activities_contact_notes] FOREIGN KEY ([contact_note_id]) REFERENCES [dbo].[contact_notes] ([id]),
    CONSTRAINT [FK_activities_contacts] FOREIGN KEY ([contact_id]) REFERENCES [dbo].[contacts] ([id]),
    CONSTRAINT [FK_activities_deal_notes] FOREIGN KEY ([deal_note_id]) REFERENCES [dbo].[deal_notes] ([id]),
    CONSTRAINT [FK_activities_deals] FOREIGN KEY ([deal_id]) REFERENCES [dbo].[deals] ([id]),
    CONSTRAINT [FK_activities_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id])
);


GO

CREATE TABLE [crm].[deal_contacts] (
    [deal_id]    INT NOT NULL,
    [contact_id] INT NOT NULL,
    CONSTRAINT [PK_deal_contact] PRIMARY KEY CLUSTERED ([deal_id] ASC, [contact_id] ASC),
    CONSTRAINT [FK_deal_contact_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_deal_contact_deal] FOREIGN KEY ([deal_id]) REFERENCES [crm].[deals] ([id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[deals] (
    [id]                    INT             NOT NULL,
    [name]                  NVARCHAR (255)  NOT NULL,
    [company_id]            INT             NOT NULL,
    [category]              NVARCHAR (100)  NOT NULL,
    [stage]                 NVARCHAR (100)  NOT NULL,
    [description]           NVARCHAR (MAX)  NOT NULL,
    [amount]                DECIMAL (18, 2) NOT NULL,
    [created_at]            DATETIME2 (3)   NOT NULL,
    [updated_at]            DATETIME2 (3)   NOT NULL,
    [archived_at]           DATETIME2 (3)   NULL,
    [expected_closing_date] DATETIME2 (3)   NOT NULL,
    [sales_id]              INT             NOT NULL,
    [index]                 INT             NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_deals_companies] FOREIGN KEY ([company_id]) REFERENCES [dbo].[companies] ([id]),
    CONSTRAINT [FK_deals_sales] FOREIGN KEY ([sales_id]) REFERENCES [dbo].[sales] ([id])
);


GO

CREATE NONCLUSTERED INDEX [IX_note_attachment_contact_note_id]
    ON [crm].[note_attachments]([contact_note_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_sales_id]
    ON [crm].[contacts]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_cna_contact_note]
    ON [dbo].[contact_note_attachments]([contact_note_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_stage]
    ON [crm].[deals]([stage] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_note_deal_id]
    ON [crm].[deal_notes]([deal_id] ASC, [date] DESC);


GO

CREATE NONCLUSTERED INDEX [IX_activity_date]
    ON [crm].[activities]([date] DESC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_notes_sales]
    ON [dbo].[contact_notes]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_tag_tag_id]
    ON [crm].[contact_tags]([tag_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_activity_type]
    ON [crm].[activities]([type] ASC, [date] DESC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_notes_contact]
    ON [dbo].[contact_notes]([contact_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_contact_contact_id]
    ON [crm].[deal_contacts]([contact_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_company_id]
    ON [crm].[deals]([company_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_companies_name]
    ON [dbo].[companies]([name] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deals_stage]
    ON [dbo].[deals]([stage] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_companies_sales_id]
    ON [dbo].[companies]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contacts_sales_id]
    ON [dbo].[contacts]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_activities_type_date]
    ON [dbo].[activities]([type] ASC, [date] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_notes_sales]
    ON [dbo].[deal_notes]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deals_company]
    ON [dbo].[deals]([company_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_company_sales_id]
    ON [crm].[companies]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_note_attachment_deal_note_id]
    ON [crm].[note_attachments]([deal_note_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_tasks_contact]
    ON [dbo].[tasks]([contact_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_notes_deal]
    ON [dbo].[deal_notes]([deal_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_notes_date]
    ON [dbo].[contact_notes]([date] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deals_sales]
    ON [dbo].[deals]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_sales_user_id]
    ON [dbo].[sales]([user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_dna_deal_note]
    ON [dbo].[deal_note_attachments]([deal_note_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_company_id]
    ON [crm].[contacts]([company_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contacts_email]
    ON [dbo].[contacts]([email] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_companies_sector]
    ON [dbo].[companies]([sector] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contacts_company]
    ON [dbo].[contacts]([company_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_task_contact_id]
    ON [crm].[tasks]([contact_id] ASC, [due_date] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_deal_sales_id]
    ON [crm].[deals]([sales_id] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_contact_note_contact_id]
    ON [crm].[contact_notes]([contact_id] ASC, [date] DESC);


GO

CREATE LOGIN [up-service-user]
    WITH PASSWORD = N'tcJkeppqjr+{FGnKf7muDbgimsFT7_&#$!~<omlUtdluwleh';


GO

CREATE USER [up-service-user] FOR LOGIN [up-service-user]
    WITH DEFAULT_SCHEMA = [crmapi];


GO

CREATE   FUNCTION dbo.fn_build_procs_for_schema
(
    @schema_name sysname
)
RETURNS TABLE
AS
RETURN
WITH src AS
(
    SELECT
        s.name AS schema_name,
        p.name AS procedure_name,
        m.definition
    FROM sys.procedures p
    JOIN sys.schemas s     ON p.schema_id = s.schema_id
    JOIN sys.sql_modules m ON p.object_id = m.object_id
    WHERE s.name = @schema_name
),
normalized AS
(
    SELECT
        schema_name,
        procedure_name,
        definition =
        CASE
            WHEN CHARINDEX('CREATE ', UPPER(definition)) > 0
                THEN STUFF(
                        definition,
                        CHARINDEX('CREATE ', UPPER(definition)),
                        LEN('CREATE'),
                        'CREATE OR ALTER'
                     )

            WHEN CHARINDEX('ALTER ', UPPER(definition)) > 0
                THEN STUFF(
                        definition,
                        CHARINDEX('ALTER ', UPPER(definition)),
                        LEN('ALTER'),
                        'CREATE OR ALTER'
                     )

            ELSE definition
        END
    FROM src
)
SELECT
    schema_name,
    procedure_name,

    procedure_script =
          'SET ANSI_NULLS ON' + CHAR(13)
        + 'GO' + CHAR(13)
        + 'SET QUOTED_IDENTIFIER ON' + CHAR(13)
        + 'GO' + CHAR(13)
        + definition + CHAR(13)
        + 'GO' + CHAR(13)
FROM normalized;

GO

CREATE     PROCEDURE crmapi.sales_put(@ID varchar(max)  
, @email nvarchar(320)   = NULL 
, @first_name nvarchar(100)   = NULL 
, @last_name nvarchar(100)   = NULL 
, @administrator bit = NULL 
, @disabled bit = NULL 

) AS
IF NOT EXISTS(SELECT id FROM crm.sales WHERE @ID = id)  
BEGIN
   RAISERROR('Unknown sales',1,1) 
   RETURN 404
END
UPDATE crm.sales  SET 
     email = COALESCE(@email,email), 
     first_name = COALESCE(@first_name,first_name), 
     last_name = COALESCE(@last_name,last_name), 
     administrator = COALESCE(@administrator,administrator), 
     disabled = COALESCE(@disabled,disabled)     
     WHERE @ID = id 
EXEC crmapi.sales_Get  @ID=@ID 
RETURN 200 -- OK

GO

 -- OK

GO

CREATE
  PROCEDURE crmapi.contact_notes_post(
    @contact_id int = NULL,
    @sales_id int = NULL,
    @date datetime2 = NULL,
    @text nvarchar(max) = NULL,
    @status nvarchar(50) = NULL
) AS

IF @sales_id = 0 SET @sales_id = 1

INSERT INTO crm.contact_notes (
        contact_id,
        sales_id,
        date,
        text,
        status
    )
VALUES (
        @contact_id,
        @sales_id,
        @date,
        @text,
        @status
    )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY() EXEC crmapi.contact_notes_Get @ID = @NEWID RETURN 200 -- OK

GO

--- exec crmapi2.contacts_get @ID = '222'
 -- OK

GO

CREATE     PROCEDURE crmapi.contact_notes_delete (@ID varchar(max)) 
AS
IF NOT EXISTS(SELECT id FROM crm.contact_notes WHERE @ID = id)  
BEGIN
   RAISERROR('Unknown contact_notes',1,1) 
   RETURN 404
END
DELETE FROM crm.contact_notes  
    WHERE @ID = id 
RETURN 200 -- OK

GO

 -- OK

GO

CREATE     PROCEDURE crmapi.contact_notes_put(@ID varchar(max)  
, @contact_id int = NULL 
, @sales_id int = NULL 
, @date datetime2 = NULL 
, @text nvarchar(max)   = NULL 
, @status nvarchar(50)   = NULL 
) AS
IF NOT EXISTS(SELECT id FROM crm.contact_notes WHERE @ID = id)  
BEGIN
   RAISERROR('Unknown contact_notes',1,1) 
   RETURN 404
END
UPDATE crm.contact_notes  SET 
    contact_id = COALESCE(@contact_id,contact_id), 
     sales_id = COALESCE(@sales_id,sales_id), 
     date = COALESCE(@date,date), 
     text = COALESCE(@text,text), 
     status = COALESCE(@status,status)  
     WHERE @ID = id 
EXEC crmapi.contact_notes_Get  @ID=@ID 
RETURN 200 -- OK

GO

--- exec crmapi.contacts_get @ID = '222'
CREATE   PROCEDURE [crmapi].[contacts_put](@ID varchar(max)  
, @first_name nvarchar(100)   = NULL 
, @last_name nvarchar(100)   = NULL 
, @title nvarchar(150)   = NULL 
, @company_id int = NULL 
, @sales_id int = NULL 
, @linkedin_url nvarchar(2048)   = NULL 
, @first_seen datetime2 = NULL 
, @last_seen datetime2 = NULL 
, @has_newsletter bit = NULL 
, @gender nvarchar(50)   = NULL 
, @status nvarchar(50)   = NULL 
, @background nvarchar(max)   = NULL 
, @email_jsonb nvarchar(max)   = NULL 
, @phone_jsonb nvarchar(max)   = NULL 
, @avatar_src nvarchar(2048)   = NULL 
, @avatar_title nvarchar(255)   = NULL 
, @avatar_path nvarchar(1024)   = NULL 
, @avatar_type nvarchar(128)   = NULL 
, @tags nvarchar(max)   = NULL
) AS
IF NOT EXISTS(SELECT id FROM crm.contacts WHERE @ID = id)  
BEGIN
   RAISERROR('Unknown contacts',1,1) 
   RETURN 404
END
UPDATE crm.contacts  SET 
    first_name = COALESCE(@first_name,first_name), 
     last_name = COALESCE(@last_name,last_name), 
     title = COALESCE(@title,title), 
     company_id = COALESCE(@company_id,company_id), 
--     sales_id = COALESCE(@sales_id,sales_id), 
     linkedin_url = COALESCE(@linkedin_url,linkedin_url), 
     first_seen = COALESCE(@first_seen,first_seen), 
     last_seen = COALESCE(@last_seen,last_seen), 
     has_newsletter = COALESCE(@has_newsletter,has_newsletter), 
     gender = COALESCE(@gender,gender), 
     status = COALESCE(@status,status), 
     background = COALESCE(@background,background), 
     emails_json = COALESCE(@email_jsonb,emails_json), 
     phones_json = COALESCE(@phone_jsonb,phones_json), 
     avatar_src = COALESCE(@avatar_src,avatar_src), 
     avatar_title = COALESCE(@avatar_title,avatar_title), 
     avatar_path = COALESCE(@avatar_path,avatar_path), 
     avatar_type = COALESCE(@avatar_type,avatar_type)
     WHERE @ID = id;

IF @tags IS NOT NULL
BEGIN
    DELETE FROM crm.contact_tags WHERE contact_id = @ID;
    INSERT INTO crm.contact_tags(contact_id, tag_id)
        SELECT @ID, value
        FROM OPENJSON(@tags);
END


EXEC crmapi.contacts_Get  @ID=@ID 
RETURN 200 -- OK

GO

 -- OK

GO

--- Retrieve company 
--- EXEC [crmapi].companies_get @filter='{"id":[513,512]}'

-- EXEC [crmapi].companies_get @filter='{"id":501}',@first_row='0',@last_row='249',@sort_field='created_at',@sort_order='DESC'
     CREATE
  PROCEDURE [crmapi].[contacts_post](
    @first_name nvarchar(100) = NULL,
    @last_name nvarchar(100) = NULL,
    @title nvarchar(150) = NULL,
    @company_id int = NULL,
    @sales_id int = NULL,
    @linkedin_url nvarchar(2048) = NULL,
    @first_seen datetime2 = NULL,
    @last_seen datetime2 = NULL,
    @has_newsletter bit = NULL,
    @gender nvarchar(50) = NULL,
    @status nvarchar(50) = 'new',
    @background nvarchar(max) = NULL,
    @emails_jsonb nvarchar(max) = NULL,
    @phones_jsonb nvarchar(max) = NULL,
    @avatar_src nvarchar(2048) = NULL,
    @avatar_title nvarchar(255) = NULL,
    @avatar_path nvarchar(1024) = NULL,
    @avatar_type nvarchar(128) = NULL
) AS

IF @sales_id IS NULL OR @sales_id = 0
    SET @sales_id = 1
    
INSERT INTO crm.contacts (
        first_name,
        last_name,
        title,
        company_id,
        sales_id,
        linkedin_url,
        first_seen,
        last_seen,
        has_newsletter,
        gender,
        status,
        background,
        emails_json,
        phones_json,
        avatar_src,
        avatar_title,
        avatar_path,
        avatar_type
    )
VALUES (
        @first_name,
        @last_name,
        @title,
        @company_id,
        @sales_id,
        @linkedin_url,
        @first_seen,
        @last_seen,
        @has_newsletter,
        @gender,
        @status,
        @background,
        @emails_jsonb,
        @phones_jsonb,
        @avatar_src,
        @avatar_title,
        @avatar_path,
        @avatar_type
    )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY() EXEC crmapi.contacts_summary_get @ID = @NEWID RETURN 200 -- OK

GO

 -- OK

GO

 -- OK

GO

CREATE   PROCEDURE dbo.build_procs_for_schema
(
      @input_schema  sysname,
      @output_schema sysname = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH src AS
    (
        SELECT
            p.name AS procedure_name,
            m.definition
        FROM sys.procedures p
        JOIN sys.schemas s     ON p.schema_id = s.schema_id
        JOIN sys.sql_modules m ON p.object_id = m.object_id
        WHERE s.name = @input_schema
    ),
    step1 AS
    (
        -- Force CREATE OR ALTER
        SELECT
            procedure_name,
            definition =
            CASE
                WHEN CHARINDEX('CREATE ', UPPER(definition)) > 0
                    THEN STUFF(
                            definition,
                            CHARINDEX('CREATE ', UPPER(definition)),
                            LEN('CREATE'),
                            'CREATE OR ALTER'
                         )
                WHEN CHARINDEX('ALTER ', UPPER(definition)) > 0
                    THEN STUFF(
                            definition,
                            CHARINDEX('ALTER ', UPPER(definition)),
                            LEN('ALTER'),
                            'CREATE OR ALTER'
                         )
                ELSE definition
            END
        FROM src
    ),
    step2 AS
    (
        SELECT
            procedure_name,

            definition =
            CASE
                WHEN @output_schema IS NOT NULL
                THEN
                    -- Replace header
                    REPLACE(
                        REPLACE(
                            definition,
                            '[' + @input_schema + '].[' + procedure_name + ']',
                            '[' + @output_schema + '].[' + procedure_name + ']'
                        ),
                        @input_schema + '.',
                        @output_schema + '.'
                    )
                ELSE definition
            END
        FROM step1
    )
    SELECT
          'SET ANSI_NULLS ON' + CHAR(13)
        + 'GO' + CHAR(13)
        + 'SET QUOTED_IDENTIFIER ON' + CHAR(13)
        + 'GO' + CHAR(13)
        + definition + CHAR(13)
        + 'GO' + CHAR(13)
    FROM step2
    ORDER BY procedure_name;

END

GO

CREATE
  PROCEDURE crmapi.tasks_post(
    @contact_id int = NULL,
    @sales_id int = NULL,
    @type nvarchar(80) = NULL,
    @text nvarchar(max) = NULL,
    @due_date datetime2 = NULL,
    @done_date datetime2 = NULL
) AS

IF @sales_id = 0 SET @sales_id = 1

INSERT INTO crm.tasks (
        contact_id,
        sales_id,
        type,
        text,
        due_date,
        done_date
    )
VALUES (
        @contact_id,
        @sales_id,
        @type,
        @text,
        @due_date,
        @done_date
    )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY() EXEC crmapi.tasks_Get @ID = @NEWID RETURN 200 -- OK

GO

CREATE   PROCEDURE [crmapi].[companies_put](@ID varchar(max)  
, @name nvarchar(200)   = NULL 
, @sector nvarchar(100)   = NULL 
, @size int = NULL 
, @linkedin_url nvarchar(2048)   = NULL 
, @website nvarchar(2048)   = NULL 
, @phone_number nvarchar(50)   = NULL 
, @address nvarchar(300)   = NULL 
, @zipcode nvarchar(20)   = NULL 
, @city nvarchar(100)   = NULL 
, @state_abbr nvarchar(20)   = NULL 
, @country nvarchar(100)   = NULL 
, @description nvarchar(max)   = NULL 
, @revenue nvarchar(50)   = NULL 
, @tax_identifier nvarchar(100)   = NULL 
, @created_at datetime2 = NULL 
, @sales_id int = NULL 
, @logo_src nvarchar(2048)   = NULL 
, @logo_title nvarchar(255)   = NULL 
, @logo_path nvarchar(1024)   = NULL 
, @logo_type nvarchar(128)   = NULL 
, @context_links nvarchar(max)   = NULL 
) AS
IF NOT EXISTS(SELECT id FROM crm.companies WHERE @ID = id)  
BEGIN
   RAISERROR('Unknown companies',1,1) 
   RETURN 404
END
-- select * from crm.companies  

   SET @sales_id = NULL

UPDATE crm.companies  SET 
    name = COALESCE(@name,name), 
     sector = COALESCE(@sector,sector), 
     size = COALESCE(@size,size), 
     linkedin_url = COALESCE(@linkedin_url,linkedin_url), 
     website = COALESCE(@website,website), 
     phone_number = COALESCE(@phone_number,phone_number), 
     address = COALESCE(@address,address), 
     zipcode = COALESCE(@zipcode,zipcode), 
     city = COALESCE(@city,city), 
     state_abbr = COALESCE(@state_abbr,state_abbr), 
     country = COALESCE(@country,country), 
     description = COALESCE(@description,description), 
     revenue = COALESCE(@revenue,revenue), 
     tax_identifier = COALESCE(@tax_identifier,tax_identifier), 
     created_at = COALESCE(@created_at,created_at), 
--     sales_id = COALESCE(@sales_id,sales_id), 
     logo_src = COALESCE(@logo_src,logo_src), 
     logo_title = COALESCE(@logo_title,logo_title), 
     logo_path = COALESCE(@logo_path,logo_path), 
     logo_type = COALESCE(@logo_type,logo_type), 
     context_links = COALESCE(@context_links,context_links)  
     WHERE @ID = id 
EXEC crmapi.companies_Get  @ID=@ID 
RETURN 200 -- OK

GO

--- Retrieve sales 
--- exec crmapi.sales_get
     CREATE   PROCEDURE [crmapi].[sales_get](@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
      SELECT  id, user_id, email, first_name, last_name, administrator, disabled, avatar_src, avatar_title, avatar_path, avatar_type, created_at, updated_at, COUNT(*) OVER() AS total_rows 
           FROM crm.sales  
           WHERE (@ID IS NULL OR @ID = id) 
            AND (
                @filter IS NULL
                OR NOT EXISTS ( SELECT 1 FROM OPENJSON(@filter, '$.id'))
                OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
            )

--           AND (@filter IS NULL OR @filter = id OR CHARINDEX(@filter,CAST(user_id AS varchar)) > 0)
            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'user_id' AND @sort_order = 'ASC' THEN user_id END ASC, 
            CASE WHEN @sort_field = 'user_id' AND @sort_order = 'DESC' THEN user_id END DESC, 
            CASE WHEN @sort_field = 'email' AND @sort_order = 'ASC' THEN email END ASC, 
            CASE WHEN @sort_field = 'email' AND @sort_order = 'DESC' THEN email END DESC, 
            CASE WHEN @sort_field = 'first_name' AND @sort_order = 'ASC' THEN first_name END ASC, 
            CASE WHEN @sort_field = 'first_name' AND @sort_order = 'DESC' THEN first_name END DESC, 
            CASE WHEN @sort_field = 'last_name' AND @sort_order = 'ASC' THEN last_name END ASC, 
            CASE WHEN @sort_field = 'last_name' AND @sort_order = 'DESC' THEN last_name END DESC, 
            CASE WHEN @sort_field = 'avatar_src' AND @sort_order = 'ASC' THEN avatar_src END ASC, 
            CASE WHEN @sort_field = 'avatar_src' AND @sort_order = 'DESC' THEN avatar_src END DESC, 
            CASE WHEN @sort_field = 'avatar_title' AND @sort_order = 'ASC' THEN avatar_title END ASC, 
            CASE WHEN @sort_field = 'avatar_title' AND @sort_order = 'DESC' THEN avatar_title END DESC, 
            CASE WHEN @sort_field = 'avatar_path' AND @sort_order = 'ASC' THEN avatar_path END ASC, 
            CASE WHEN @sort_field = 'avatar_path' AND @sort_order = 'DESC' THEN avatar_path END DESC, 
            CASE WHEN @sort_field = 'avatar_type' AND @sort_order = 'ASC' THEN avatar_type END ASC, 
            CASE WHEN @sort_field = 'avatar_type' AND @sort_order = 'DESC' THEN avatar_type END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

-- exec crmapi.tags_get @filter='{"xid":[2,1]}'
--  SELECT 1 FROM OPENJSON('{"id":[2,3]}', '$.id')
-- SELECT value FROM OPENJSON('{"xid":[2]}', '$.id')
--- Retrieve tags 
     CREATE   PROCEDURE [crmapi].[tags_get](@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
      SELECT  id AS id, id, name, color, COUNT(*) OVER() AS total_rows 
           FROM crm.tags  
           WHERE (@ID IS NULL OR @ID = id) AND
           (
                @filter IS NULL
                OR NOT EXISTS ( SELECT 1 FROM OPENJSON(@filter, '$.id'))
                OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
           )
            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC, 
            CASE WHEN @sort_field = 'color' AND @sort_order = 'ASC' THEN color END ASC, 
            CASE WHEN @sort_field = 'color' AND @sort_order = 'DESC' THEN color END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

--- exec crmapi.tasks_get @filter = '{"contact_id": 227'
--- Retrieve tasks 
     CREATE   PROCEDURE [crmapi].[tasks_get](@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
     DECLARE @filter_done_date VARCHAR(100) = TRY_CONVERT(VARCHAR(100), JSON_VALUE(@filter, N'$."done_date"'), 126);

     DECLARE @contact_id_eq INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."contact_id"'));
PRINT @contact_id_eq
     DECLARE @due_date_gte datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@gte"')));
     DECLARE @due_date_gt  datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@gt"')));
     DECLARE @due_date_lte datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@lte"')));
     DECLARE @due_date_lt  datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@lt"')));
     DECLARE @due_date_eq  datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@eq"')));
 

      SELECT  id AS id, contact_id, sales_id, type, text, due_date, done_date, COUNT(*) OVER() AS total_rows 
           FROM crm.tasks  
           WHERE (@ID IS NULL OR @ID = id) 
               AND (
                    @filter IS NULL
                    OR NOT EXISTS ( SELECT 1 FROM OPENJSON(@filter, '$.id'))
                    OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
               )
               AND ( @filter_done_date IS NULL OR  (@filter_done_date = 'null'  AND done_date IS NULL ) )
               AND ( @contact_id_eq IS NULL OR contact_id = @contact_id_eq )
               AND (@due_date_gte IS NULL OR due_date >= @due_date_gte)
               AND (@due_date_gt  IS NULL OR due_date >  @due_date_gt)
               AND (@due_date_lte IS NULL OR due_date <= @due_date_lte)
               AND (@due_date_lt  IS NULL OR due_date <  @due_date_lt)
               AND (@due_date_eq  IS NULL OR due_date =  @due_date_eq)
            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'ASC' THEN contact_id END ASC, 
            CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'DESC' THEN contact_id END DESC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC, 
            CASE WHEN @sort_field = 'type' AND @sort_order = 'ASC' THEN type END ASC, 
            CASE WHEN @sort_field = 'type' AND @sort_order = 'DESC' THEN type END DESC, 
            CASE WHEN @sort_field = 'text' AND @sort_order = 'ASC' THEN text END ASC, 
            CASE WHEN @sort_field = 'text' AND @sort_order = 'DESC' THEN text END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

--- Retrieve contacts 
     --- Retrieve sales 
--- exec crmapi2.sales_get
     CREATE   PROCEDURE [crmapi].[companies_summary_get](
            @ID varchar(max) = NULL  
         ,  @filter varchar(max)=NULL 
         ,  @first_row INT = 0, @last_row INT = 1000 
         ,  @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 

     DECLARE @size int = TRY_CONVERT(int, JSON_VALUE(@filter, N'$."size"'));
     DECLARE @sector VARCHAR(100) = TRY_CONVERT(VARCHAR(100), JSON_VALUE(@filter, N'$."sector"'));
     DECLARE @search NVARCHAR(200) = (SELECT TOP 1 '%' + value + '%' FROM OPENJSON(@filter, '$."@or"')) ;

    WITH contact_counts AS (
        SELECT company_id, COUNT(*) AS nb_contacts
        FROM crm.contacts
        GROUP BY company_id
    ) 
    SELECT  id,  name, sector, size, linkedin_url, website, phone_number, address, zipcode, city, 
        state_abbr, country, description, revenue, tax_identifier, created_at, sales_id, 
        logo_src, logo_title, logo_path, logo_type, context_links, COUNT(*) OVER() AS total_rows,
        ( SELECT COUNT(*) FROM crm.deals WHERE company_id = crm.companies.id) AS nb_deals,
        ISNULL(cc.nb_contacts, 0) AS nb_contacts
 --           ( SELECT COUNT(*) FROM crm.contacts WHERE company_id = crm.companies.id) AS nb_contacts
        FROM crm.companies  
            LEFT JOIN contact_counts cc ON crm.companies.id = cc.company_id
        WHERE 
                (@ID IS NULL OR @ID = id) 
            AND (@size IS NULL OR size = @size)
            AND (@sector IS NULL OR sector = @sector)
            AND (
                    @search IS NULL
                OR name         LIKE @search
                OR phone_number LIKE @search
                OR website      LIKE @search
                OR zipcode      LIKE @search
                OR city         LIKE @search
                OR state_abbr   LIKE @search
                )
        ORDER BY
            CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC, 
            CASE WHEN @sort_field = 'sector' AND @sort_order = 'ASC' THEN sector END ASC, 
            CASE WHEN @sort_field = 'sector' AND @sort_order = 'DESC' THEN sector END DESC, 
            CASE WHEN @sort_field = 'size' AND @sort_order = 'ASC' THEN size END ASC, 
            CASE WHEN @sort_field = 'size' AND @sort_order = 'DESC' THEN size END DESC, 
            CASE WHEN @sort_field = 'created_at' AND @sort_order = 'ASC' THEN created_at END ASC, 
            CASE WHEN @sort_field = 'created_at' AND @sort_order = 'DESC' THEN created_at END DESC,
            CASE WHEN @sort_field = 'nb_contacts' AND @sort_order = 'ASC' THEN ISNULL(cc.nb_contacts, 0) END ASC,
            CASE WHEN @sort_field = 'nb_contacts' AND @sort_order = 'DESC' THEN ISNULL(cc.nb_contacts, 0) END DESC,
            CASE WHEN @sort_field IS NULL THEN id END ASC 
        OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

--  EXEC [crmapi].contacts_summary_get @filter='{"tags@cs":"{7}"}',@first_row='0',@last_row='9'
CREATE PROCEDURE [crmapi].[contacts_summary_get]
(
    @ID varchar(max) = NULL,
    @filter varchar(max) = NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

DECLARE @search NVARCHAR(200) = (SELECT TOP 1 '%' + value + '%' FROM OPENJSON(@filter, '$."@or"')) ;    
DECLARE @last_seen_gte datetime2(3) =
    TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@gte"')));

DECLARE @last_seen_gt  datetime2(3) =
    TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@gt"')));

DECLARE @last_seen_lte datetime2(3) =
    TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@lte"')));

DECLARE @last_seen_lt  datetime2(3) =
    TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@lt"')));

DECLARE @last_seen_eq  datetime2(3) =
    TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@eq"')));

DECLARE @status NVARCHAR(50) = JSON_VALUE(@filter, N'$.status');
DECLARE @tasks_count_gt INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."nb_tasks@gt"'));
DECLARE @tags_cs NVARCHAR(100) = JSON_VALUE(@filter, N'$."tags@cs"');
DECLARE @tags_id INT = TRY_CAST( REPLACE(REPLACE(@tags_cs, '{', ''), '}', '') AS INT)
DECLARE @company_id INT = JSON_VALUE(@filter, N'$.company_id');
    SELECT
        id,
        first_name,
        last_name,
        title,
        company_id,
        sales_id,
        linkedin_url,
        first_seen,
        last_seen,
        has_newsletter,
        gender,
        status,
        background,
        emails_json  AS email_jsonb, 
        phones_json  AS phone_jsonb, 
        avatar_title,
        avatar_path,
        avatar_type,
        COUNT(*) OVER() AS total_rows,
        (SELECT name FROM crm.companies WHERE companies.id = company_id) AS company_name,
        (SELECT COUNT(*) FROM crm.tasks WHERE tasks.contact_id = crm.contacts.id) AS nb_tasks, -- ✅ comma

        -- tags as numeric JSON array string: [1,2,3]
        COALESCE(
            (
                SELECT
                    '[' + STRING_AGG(CONVERT(varchar(20), ct.tag_id), ',')
                         WITHIN GROUP (ORDER BY ct.tag_id) + ']'
                FROM crm.contact_tags ct
                WHERE ct.contact_id = crm.contacts.id
            ),
            '[]'
        ) AS tags

    FROM crm.contacts
    WHERE (@ID IS NULL OR @ID = id)
        AND (
                @filter IS NULL
                OR NOT EXISTS ( SELECT 1 FROM OPENJSON(@filter, '$.id'))
                OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
           )
        AND (@company_id IS NULL OR company_id = @company_id)
        AND (@tags_id IS NULL OR EXISTS (SELECT 1 FROM crm.contact_tags ct WHERE ct.contact_id = crm.contacts.id AND ct.tag_id = @tags_id))   
        AND (
                @search IS NULL
                OR first_name LIKE @search
                OR last_name LIKE @search
                OR title LIKE @search
                OR linkedin_url LIKE @search
                OR background LIKE @search
                OR emails_json LIKE @search
                OR phones_json LIKE @search
            )
        AND (@last_seen_gte IS NULL OR last_seen >= @last_seen_gte)
        AND (@last_seen_gt  IS NULL OR last_seen >  @last_seen_gt)
        AND (@last_seen_lte IS NULL OR last_seen <= @last_seen_lte)
        AND (@last_seen_lt  IS NULL OR last_seen <  @last_seen_lt)
        AND (@last_seen_eq  IS NULL OR last_seen =  @last_seen_eq)
        AND (@status IS NULL OR status = @status)
        AND (@tasks_count_gt IS NULL OR (SELECT COUNT(*) FROM crm.tasks WHERE tasks.contact_id = crm.contacts.id) > @tasks_count_gt)
  
    ORDER BY
      CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
      CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
      CASE WHEN @sort_field = 'first_name' AND @sort_order = 'ASC' THEN first_name END ASC,
      CASE WHEN @sort_field = 'first_name' AND @sort_order = 'DESC' THEN first_name END DESC,
      CASE WHEN @sort_field = 'last_name' AND @sort_order = 'ASC' THEN last_name END ASC,
      CASE WHEN @sort_field = 'last_name' AND @sort_order = 'DESC' THEN last_name END DESC,
      CASE WHEN @sort_field = 'title' AND @sort_order = 'ASC' THEN title END ASC,
      CASE WHEN @sort_field = 'title' AND @sort_order = 'DESC' THEN title END DESC,
      CASE WHEN @sort_field = 'company_id' AND @sort_order = 'ASC' THEN company_id END ASC,
      CASE WHEN @sort_field = 'company_id' AND @sort_order = 'DESC' THEN company_id END DESC,
      CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC,
      CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC,
      CASE WHEN @sort_field = 'gender' AND @sort_order = 'ASC' THEN gender END ASC,
      CASE WHEN @sort_field = 'gender' AND @sort_order = 'DESC' THEN gender END DESC,
      CASE WHEN @sort_field = 'status' AND @sort_order = 'ASC' THEN status END ASC,
      CASE WHEN @sort_field = 'status' AND @sort_order = 'DESC' THEN status END DESC,
      CASE WHEN @sort_field = 'last_seen' AND @sort_order = 'ASC' THEN last_seen END ASC,
      CASE WHEN @sort_field = 'last_seen' AND @sort_order = 'DESC' THEN last_seen END DESC,
      CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END

GO

 -- OK

GO

 -- OK

GO

 -- OK

GO

--- Retrieve deal_notes 
     CREATE     PROCEDURE crmapi.deal_notes_get(@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
      SELECT  id AS id, deal_id, sales_id, date, text, COUNT(*) OVER() AS total_rows 
           FROM crm.deal_notes  
           WHERE (@ID IS NULL OR @ID = id) 
           AND (@filter IS NULL OR @filter = id OR CHARINDEX(@filter,CAST(deal_id AS varchar)) > 0)
            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'deal_id' AND @sort_order = 'ASC' THEN deal_id END ASC, 
            CASE WHEN @sort_field = 'deal_id' AND @sort_order = 'DESC' THEN deal_id END DESC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC, 
            CASE WHEN @sort_field = 'text' AND @sort_order = 'ASC' THEN text END ASC, 
            CASE WHEN @sort_field = 'text' AND @sort_order = 'DESC' THEN text END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

 -- OK

GO

CREATE     PROCEDURE crmapi.tags_post( 
@name nvarchar(100) = NULL,@color nvarchar(30) = NULL ) AS
INSERT INTO crm.tags (  name ,  color   ) VALUES (
 @name ,  @color   )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY()
EXEC crmapi.tags_Get  @ID=@NEWID 
 RETURN 200 -- OK

GO

 -- OK

GO

--- Retrieve deals 
     CREATE     PROCEDURE crmapi.deals_get(@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
      SELECT  id AS id, name, company_id, category, stage, description, amount, created_at, updated_at, archived_at, expected_closing_date, sales_id, [index], COUNT(*) OVER() AS total_rows 
           FROM crm.deals  
           WHERE (@ID IS NULL OR @ID = id) 
           AND (@filter IS NULL OR @filter = id OR CHARINDEX(@filter,CAST(name AS varchar)) > 0)
            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC, 
            CASE WHEN @sort_field = 'company_id' AND @sort_order = 'ASC' THEN company_id END ASC, 
            CASE WHEN @sort_field = 'company_id' AND @sort_order = 'DESC' THEN company_id END DESC, 
            CASE WHEN @sort_field = 'category' AND @sort_order = 'ASC' THEN category END ASC, 
            CASE WHEN @sort_field = 'category' AND @sort_order = 'DESC' THEN category END DESC, 
            CASE WHEN @sort_field = 'stage' AND @sort_order = 'ASC' THEN stage END ASC, 
            CASE WHEN @sort_field = 'stage' AND @sort_order = 'DESC' THEN stage END DESC, 
            CASE WHEN @sort_field = 'description' AND @sort_order = 'ASC' THEN description END ASC, 
            CASE WHEN @sort_field = 'description' AND @sort_order = 'DESC' THEN description END DESC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC, 
            CASE WHEN @sort_field = 'index' AND @sort_order = 'ASC' THEN [index] END ASC, 
            CASE WHEN @sort_field = 'index' AND @sort_order = 'DESC' THEN [index] END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

CREATE   PROCEDURE [crmapi].[companies_Post](
    @name nvarchar(200) = NULL,
    @sector nvarchar(100) = '',
    @size int = 1,
    @linkedin_url nvarchar(2048) = NULL,
    @website nvarchar(2048) = NULL,
    @phone_number nvarchar(50) = NULL,
    @address nvarchar(300) = NULL,
    @zipcode nvarchar(20) = NULL,
    @city nvarchar(100) = NULL,
    @state_abbr nvarchar(20) = NULL,
    @country nvarchar(100) = NULL,
    @description nvarchar(max) = NULL,
    @revenue nvarchar(50) = NULL,
    @tax_identifier nvarchar(100) = NULL,
    @created_at datetime2 = NULL,
    @sales_id int = NULL,
    @logo_src nvarchar(2048) = NULL,
    @logo_title nvarchar(255) = NULL,
    @logo_path nvarchar(1024) = NULL,
    @logo_type nvarchar(128) = NULL,
    @context_links nvarchar(max) = NULL
) AS
if @sales_id = 0 set @sales_id = 1
INSERT INTO crm.companies (
        name,
        sector,
        size,
        linkedin_url,
        website,
        phone_number,
        address,
        zipcode,
        city,
        state_abbr,
        country,
        description,
        revenue,
        tax_identifier,
        created_at,
        sales_id,
        logo_src,
        logo_title,
        logo_path,
        logo_type,
        context_links
    )
VALUES (
        @name,
        @sector,
        @size,
        @linkedin_url,
        @website,
        @phone_number,
        @address,
        @zipcode,
        @city,
        @state_abbr,
        @country,
        @description,
        @revenue,
        @tax_identifier,
        @created_at,
        @sales_id,
        @logo_src,
        @logo_title,
        @logo_path,
        @logo_type,
        @context_links
    )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY() 
EXEC crmapi.companies_Get @ID = @NEWID 
RETURN 200 -- OK

GO

--- exec crmapi2.contact_notes_Get @filter = '{"contact_id": 224}'
-- EXEC [crmapi].contact_notes_get @filter='{"contact_id@in":"(224,221,233,238,258)"}'


--- Retrieve contact_note 
-- OK

GO

--- Retrieve contacts 
     CREATE   PROCEDURE [crmapi].[contacts_get](@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
     DECLARE @company_id INT = JSON_VALUE(@filter, N'$.company_id');
      SELECT  id, first_name, last_name, title, company_id, sales_id, linkedin_url, first_seen, last_seen, has_newsletter, gender, status, background, emails_json, phones_json, 
            avatar_src, avatar_title, avatar_path, avatar_type, COUNT(*) OVER() AS total_rows,
            COALESCE(
            (
                SELECT
                    '[' + STRING_AGG(CONVERT(varchar(20), ct.tag_id), ',')
                         WITHIN GROUP (ORDER BY ct.tag_id) + ']'
                FROM crm.contact_tags ct
                WHERE ct.contact_id = crm.contacts.id
            ),
            '[]'
            ) AS tags

           FROM crm.contacts  
           WHERE (@ID IS NULL OR @ID = id) 
            AND (
                @filter IS NULL
                OR NOT EXISTS ( SELECT 1 FROM OPENJSON(@filter, '$.id'))
                OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
           )
            AND (@company_id IS NULL OR company_id = @company_id)
            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'first_name' AND @sort_order = 'ASC' THEN first_name END ASC, 
            CASE WHEN @sort_field = 'first_name' AND @sort_order = 'DESC' THEN first_name END DESC, 
            CASE WHEN @sort_field = 'last_name' AND @sort_order = 'ASC' THEN last_name END ASC, 
            CASE WHEN @sort_field = 'last_name' AND @sort_order = 'DESC' THEN last_name END DESC, 
            CASE WHEN @sort_field = 'title' AND @sort_order = 'ASC' THEN title END ASC, 
            CASE WHEN @sort_field = 'title' AND @sort_order = 'DESC' THEN title END DESC, 
            CASE WHEN @sort_field = 'company_id' AND @sort_order = 'ASC' THEN company_id END ASC, 
            CASE WHEN @sort_field = 'company_id' AND @sort_order = 'DESC' THEN company_id END DESC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC, 
            CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'ASC' THEN linkedin_url END ASC, 
            CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'DESC' THEN linkedin_url END DESC, 
            CASE WHEN @sort_field = 'gender' AND @sort_order = 'ASC' THEN gender END ASC, 
            CASE WHEN @sort_field = 'gender' AND @sort_order = 'DESC' THEN gender END DESC, 
            CASE WHEN @sort_field = 'status' AND @sort_order = 'ASC' THEN status END ASC, 
            CASE WHEN @sort_field = 'status' AND @sort_order = 'DESC' THEN status END DESC, 
            CASE WHEN @sort_field = 'background' AND @sort_order = 'ASC' THEN background END ASC, 
            CASE WHEN @sort_field = 'background' AND @sort_order = 'DESC' THEN background END DESC, 
            CASE WHEN @sort_field = 'emails_json' AND @sort_order = 'ASC' THEN emails_json END ASC, 
            CASE WHEN @sort_field = 'emails_json' AND @sort_order = 'DESC' THEN emails_json END DESC, 
            CASE WHEN @sort_field = 'phones_json' AND @sort_order = 'ASC' THEN phones_json END ASC, 
            CASE WHEN @sort_field = 'phones_json' AND @sort_order = 'DESC' THEN phones_json END DESC, 
            CASE WHEN @sort_field = 'avatar_src' AND @sort_order = 'ASC' THEN avatar_src END ASC, 
            CASE WHEN @sort_field = 'avatar_src' AND @sort_order = 'DESC' THEN avatar_src END DESC, 
            CASE WHEN @sort_field = 'avatar_title' AND @sort_order = 'ASC' THEN avatar_title END ASC, 
            CASE WHEN @sort_field = 'avatar_title' AND @sort_order = 'DESC' THEN avatar_title END DESC, 
            CASE WHEN @sort_field = 'avatar_path' AND @sort_order = 'ASC' THEN avatar_path END ASC, 
            CASE WHEN @sort_field = 'avatar_path' AND @sort_order = 'DESC' THEN avatar_path END DESC, 
            CASE WHEN @sort_field = 'avatar_type' AND @sort_order = 'ASC' THEN avatar_type END ASC, 
            CASE WHEN @sort_field = 'avatar_type' AND @sort_order = 'DESC' THEN avatar_type END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

-- exec crmapi2.tags_get @filter='{"xid":[2,1]}'
--  SELECT 1 FROM OPENJSON('{"id":[2,3]}', '$.id')
-- SELECT value FROM OPENJSON('{"xid":[2]}', '$.id')
--- Retrieve tags 
     --- Retrieve deal_notes 
     --  EXEC [crmapi].contacts_summary_get @filter='{"tags@cs":"{7}"}',@first_row='0',@last_row='9'
--- exec crmapi2.tasks_get @filter = '{"contact_id": 227'
--- Retrieve tasks 
     --- exec crmapi.contact_notes_Get @filter = '{"contact_id": 224}'
-- EXEC [crmapi].contact_notes_get @filter='{"contact_id@in":"(224,221,233,238,258)"}'


--- Retrieve contact_note 
CREATE   PROCEDURE [crmapi].[contact_notes_Get](@ID varchar(max) = NULL  
     , @filter varchar(max)=NULL 
     , @first_row INT = 0, @last_row INT = 1000 
     , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
) AS 
     DECLARE @contact_id_eq INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."contact_id"'));

     DECLARE @ids_raw NVARCHAR(MAX)  = JSON_VALUE(@filter, '$."contact_id@in"')
     IF @ids_raw IS NOT NULL
          SET @ids_raw = 
          '[' + 
          REPLACE(REPLACE(@ids_raw, '(', ''), ')', '') 
          + ']'

     SELECT  id AS id, id, contact_id, sales_id, date, text, status, COUNT(*) OVER() AS total_rows 
          FROM crm.contact_notes 
     WHERE (
               @ID IS NULL
               OR @ID = id
          )
          AND (
               @contact_id_eq IS NULL
               OR contact_id = @contact_id_eq
          )
          AND (
               @ids_raw IS NULL
               OR contact_id IN (
                    SELECT TRY_CAST(value AS INT)
                    FROM OPENJSON(@ids_raw)
               )
          )            
     ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'ASC' THEN contact_id END ASC, 
            CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'DESC' THEN contact_id END DESC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC, 
            CASE WHEN @sort_field = 'text' AND @sort_order = 'ASC' THEN text END ASC, 
            CASE WHEN @sort_field = 'text' AND @sort_order = 'DESC' THEN text END DESC, 
            CASE WHEN @sort_field = 'status' AND @sort_order = 'ASC' THEN status END ASC, 
            CASE WHEN @sort_field = 'status' AND @sort_order = 'DESC' THEN status END DESC, 
            CASE WHEN @sort_field = 'date' AND @sort_order = 'ASC' THEN date END ASC,
            CASE WHEN @sort_field = 'date' AND @sort_order = 'DESC' THEN date END DESC,
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

CREATE
  PROCEDURE crmapi.sales_post(
    @user_id varchar(50) = NULL,
    @email nvarchar(320) = NULL,
    @first_name nvarchar(100) = NULL,
    @last_name nvarchar(100) = NULL,
    @administrator bit = NULL,
    @disabled bit = 0,
    @avatar_src nvarchar(2048) = NULL,
    @avatar_title nvarchar(255) = NULL,
    @avatar_path nvarchar(1024) = NULL,
    @avatar_type nvarchar(128) = NULL
) AS
INSERT INTO crm.sales (
        user_id,
        email,
        first_name,
        last_name,
        administrator,
        disabled,
        avatar_src,
        avatar_title,
        avatar_path,
        avatar_type
 
    )
VALUES (
        @user_id,
        @email,
        @first_name,
        @last_name,
        @administrator,
        @disabled,
        @avatar_src,
        @avatar_title,
        @avatar_path,
        @avatar_type
    )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY() EXEC crmapi.sales_Get @ID = @NEWID RETURN 200 -- OK

GO

CREATE   PROCEDURE [crmapi].[tasks_put](@ID varchar(max)  
, @contact_id int = NULL 
, @sales_id int = NULL 
, @type nvarchar(80)   = NULL 
, @text nvarchar(max)   = NULL 
, @due_date datetime2 = NULL 
, @done_date datetime2 = NULL 
) AS
IF NOT EXISTS(SELECT id FROM crm.tasks WHERE @ID = id)  
BEGIN
   RAISERROR('Unknown tasks',1,1) 
   RETURN 404
END
UPDATE crm.tasks  SET 
    contact_id = COALESCE(@contact_id,contact_id), 
     sales_id = COALESCE(@sales_id,sales_id), 
     type = COALESCE(@type,type), 
     text = COALESCE(@text,text), 
     due_date = COALESCE(@due_date,due_date), 
     done_date = COALESCE(@done_date,done_date)  
     WHERE @ID = id 
EXEC crmapi.tasks_Get  @ID=@ID 
RETURN 200 -- OK

GO

--- Retrieve company 
--- EXEC [crmapi].companies_get @filter='{"id":[513,512]}'

-- EXEC [crmapi].companies_get @filter='{"id":501}',@first_row='0',@last_row='249',@sort_field='created_at',@sort_order='DESC'
     CREATE   PROCEDURE [crmapi].[companies_Get](@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 

    DECLARE @ids_raw NVARCHAR(MAX)  = JSON_VALUE(@filter, '$."id"')
   
      SELECT  id, name, sector, size, linkedin_url, website, phone_number, address, zipcode, city, state_abbr, country, description, revenue, tax_identifier, created_at, sales_id, logo_src, logo_title, logo_path, logo_type, context_links, COUNT(*) OVER() AS total_rows 
           FROM crm.companies  
           WHERE (@ID IS NULL OR @ID = id) 
            AND (
                @filter IS NULL
                
                OR NOT EXISTS ( SELECT 1 FROM OPENJSON(@filter, '$.id'))
                OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
           )
           AND (@ids_raw IS NULL OR @ids_raw = id)

            ORDER BY
           CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC, 
            CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC, 
            CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC, 
            CASE WHEN @sort_field = 'sector' AND @sort_order = 'ASC' THEN sector END ASC, 
            CASE WHEN @sort_field = 'sector' AND @sort_order = 'DESC' THEN sector END DESC, 
            CASE WHEN @sort_field = 'size' AND @sort_order = 'ASC' THEN size END ASC, 
            CASE WHEN @sort_field = 'size' AND @sort_order = 'DESC' THEN size END DESC, 
            CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'ASC' THEN linkedin_url END ASC, 
            CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'DESC' THEN linkedin_url END DESC, 
            CASE WHEN @sort_field = 'website' AND @sort_order = 'ASC' THEN website END ASC, 
            CASE WHEN @sort_field = 'website' AND @sort_order = 'DESC' THEN website END DESC, 
            CASE WHEN @sort_field = 'phone_number' AND @sort_order = 'ASC' THEN phone_number END ASC, 
            CASE WHEN @sort_field = 'phone_number' AND @sort_order = 'DESC' THEN phone_number END DESC, 
            CASE WHEN @sort_field = 'address' AND @sort_order = 'ASC' THEN address END ASC, 
            CASE WHEN @sort_field = 'address' AND @sort_order = 'DESC' THEN address END DESC, 
            CASE WHEN @sort_field = 'zipcode' AND @sort_order = 'ASC' THEN zipcode END ASC, 
            CASE WHEN @sort_field = 'zipcode' AND @sort_order = 'DESC' THEN zipcode END DESC, 
            CASE WHEN @sort_field = 'city' AND @sort_order = 'ASC' THEN city END ASC, 
            CASE WHEN @sort_field = 'city' AND @sort_order = 'DESC' THEN city END DESC, 
            CASE WHEN @sort_field = 'state_abbr' AND @sort_order = 'ASC' THEN state_abbr END ASC, 
            CASE WHEN @sort_field = 'state_abbr' AND @sort_order = 'DESC' THEN state_abbr END DESC, 
            CASE WHEN @sort_field = 'country' AND @sort_order = 'ASC' THEN country END ASC, 
            CASE WHEN @sort_field = 'country' AND @sort_order = 'DESC' THEN country END DESC, 
            CASE WHEN @sort_field = 'description' AND @sort_order = 'ASC' THEN description END ASC, 
            CASE WHEN @sort_field = 'description' AND @sort_order = 'DESC' THEN description END DESC, 
            CASE WHEN @sort_field = 'revenue' AND @sort_order = 'ASC' THEN revenue END ASC, 
            CASE WHEN @sort_field = 'revenue' AND @sort_order = 'DESC' THEN revenue END DESC, 
            CASE WHEN @sort_field = 'tax_identifier' AND @sort_order = 'ASC' THEN tax_identifier END ASC, 
            CASE WHEN @sort_field = 'tax_identifier' AND @sort_order = 'DESC' THEN tax_identifier END DESC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC, 
            CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC, 
            CASE WHEN @sort_field = 'logo_src' AND @sort_order = 'ASC' THEN logo_src END ASC, 
            CASE WHEN @sort_field = 'logo_src' AND @sort_order = 'DESC' THEN logo_src END DESC, 
            CASE WHEN @sort_field = 'logo_title' AND @sort_order = 'ASC' THEN logo_title END ASC, 
            CASE WHEN @sort_field = 'logo_title' AND @sort_order = 'DESC' THEN logo_title END DESC, 
            CASE WHEN @sort_field = 'logo_path' AND @sort_order = 'ASC' THEN logo_path END ASC, 
            CASE WHEN @sort_field = 'logo_path' AND @sort_order = 'DESC' THEN logo_path END DESC, 
            CASE WHEN @sort_field = 'logo_type' AND @sort_order = 'ASC' THEN logo_type END ASC, 
            CASE WHEN @sort_field = 'logo_type' AND @sort_order = 'DESC' THEN logo_type END DESC, 
            CASE WHEN @sort_field = 'context_links' AND @sort_order = 'ASC' THEN context_links END ASC, 
            CASE WHEN @sort_field = 'context_links' AND @sort_order = 'DESC' THEN context_links END DESC, 
            CASE WHEN @sort_field IS NULL THEN id END ASC 
           OFFSET @first_row ROWS
           FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY

GO

--- Retrieve deals 
     CREATE SCHEMA [crmapi]
    AUTHORIZATION [dbo];


GO

CREATE SCHEMA [crmapi2]
    AUTHORIZATION [dbo];


GO

CREATE SCHEMA [crm]
    AUTHORIZATION [dbo];


GO

GRANT EXECUTE
    ON SCHEMA::[crmapi2] TO [up-service-user];


GO

GRANT EXECUTE
    ON SCHEMA::[crmapi] TO [up-service-user];


GO

