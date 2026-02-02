/* =========================================================
   Atomic CRM → SQL Server schema (for SqlWebApi)
   ========================================================= */

-- 0) Schema
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'crm')
    EXEC('CREATE SCHEMA crm');
GO

/* =========================================================
   1) Core entities
   ========================================================= */

-- Sales (users)
CREATE TABLE crm.sales (
    id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_sales PRIMARY KEY,
    user_id           UNIQUEIDENTIFIER NOT NULL,             -- matches TS "user_id: string" (treat as GUID)
    email             NVARCHAR(320) NOT NULL,
    first_name        NVARCHAR(100) NOT NULL,
    last_name         NVARCHAR(100) NOT NULL,
    administrator     BIT NOT NULL CONSTRAINT DF_sales_admin DEFAULT (0),
    disabled          BIT NOT NULL CONSTRAINT DF_sales_disabled DEFAULT (0),

    -- avatar fields (RAFile / Partial<RAFile>)
    avatar_src        NVARCHAR(2048) NULL,
    avatar_title      NVARCHAR(255) NULL,
    avatar_path       NVARCHAR(1024) NULL,
    avatar_type       NVARCHAR(128) NULL,

    created_at        DATETIME2(0) NOT NULL CONSTRAINT DF_sales_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at        DATETIME2(0) NOT NULL CONSTRAINT DF_sales_updated_at DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT UQ_sales_user_id UNIQUE (user_id),
    CONSTRAINT UQ_sales_email UNIQUE (email)
);
GO

-- Companies
CREATE TABLE crm.company (
    id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_company PRIMARY KEY,
    name              NVARCHAR(200) NOT NULL,
    sector            NVARCHAR(100) NOT NULL,
    size              INT NOT NULL,                          -- 1|10|50|250|500 (use CHECK)
    linkedin_url      NVARCHAR(2048) NOT NULL,
    website           NVARCHAR(2048) NOT NULL,
    phone_number      NVARCHAR(50) NOT NULL,
    address           NVARCHAR(300) NOT NULL,
    zipcode           NVARCHAR(20) NOT NULL,
    city              NVARCHAR(100) NOT NULL,
    state_abbr        NVARCHAR(20) NOT NULL,
    country           NVARCHAR(100) NOT NULL,
    description       NVARCHAR(MAX) NOT NULL,
    revenue           NVARCHAR(50) NOT NULL,
    tax_identifier    NVARCHAR(100) NOT NULL,
    created_at        DATETIME2(0) NOT NULL,                 -- TS: string; store as datetime2
    sales_id          INT NOT NULL,

    -- logo fields (RAFile)
    logo_src          NVARCHAR(2048) NOT NULL,
    logo_title        NVARCHAR(255) NOT NULL,
    logo_path         NVARCHAR(1024) NULL,
    logo_type         NVARCHAR(128) NULL,

    -- context_links?: string[]
    context_links     NVARCHAR(MAX) NULL,                    -- store JSON array of strings

    CONSTRAINT FK_company_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id),
    CONSTRAINT CK_company_size CHECK (size IN (1,10,50,250,500))
);
GO

CREATE INDEX IX_company_sales_id ON crm.company(sales_id);
GO

/* =========================================================
   2) Tags and Contact
   ========================================================= */

-- Tags
CREATE TABLE crm.tag (
    id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_tag PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL,
    color       NVARCHAR(30) NOT NULL,

    CONSTRAINT UQ_tag_name UNIQUE (name)
);
GO

-- Contacts
CREATE TABLE crm.contact (
    id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_contact PRIMARY KEY,
    first_name        NVARCHAR(100) NOT NULL,
    last_name         NVARCHAR(100) NOT NULL,
    title             NVARCHAR(150) NOT NULL,

    company_id        INT NOT NULL,
    sales_id          INT NOT NULL,

    linkedin_url      NVARCHAR(2048) NULL,                   -- string | null
    first_seen        DATETIME2(0) NOT NULL,
    last_seen         DATETIME2(0) NOT NULL,
    has_newsletter    BIT NOT NULL CONSTRAINT DF_contact_has_newsletter DEFAULT (0),

    gender            NVARCHAR(50) NOT NULL,
    status            NVARCHAR(50) NOT NULL,
    background        NVARCHAR(MAX) NOT NULL,

    -- email_jsonb: EmailAndType[]
    emails_json       NVARCHAR(MAX) NOT NULL,                -- JSON array [{email,type},...]

    -- phone_jsonb: PhoneNumberAndType[]
    phones_json       NVARCHAR(MAX) NOT NULL,                -- JSON array [{number,type},...]

    -- avatar?: Partial<RAFile>
    avatar_src        NVARCHAR(2048) NULL,
    avatar_title      NVARCHAR(255) NULL,
    avatar_path       NVARCHAR(1024) NULL,
    avatar_type       NVARCHAR(128) NULL,

    CONSTRAINT FK_contact_company FOREIGN KEY (company_id) REFERENCES crm.company(id),
    CONSTRAINT FK_contact_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id),

    -- validate JSON if you want (requires SQL Server 2016+)
    CONSTRAINT CK_contact_emails_json CHECK (ISJSON(emails_json) = 1),
    CONSTRAINT CK_contact_phones_json CHECK (ISJSON(phones_json) = 1)
);
GO

CREATE INDEX IX_contact_company_id ON crm.contact(company_id);
CREATE INDEX IX_contact_sales_id ON crm.contact(sales_id);
GO

-- Contact <-> Tag (tags: Identifier[])
CREATE TABLE crm.contact_tag (
    contact_id   INT NOT NULL,
    tag_id       INT NOT NULL,
    CONSTRAINT PK_contact_tag PRIMARY KEY (contact_id, tag_id),
    CONSTRAINT FK_contact_tag_contact FOREIGN KEY (contact_id) REFERENCES crm.contact(id) ON DELETE CASCADE,
    CONSTRAINT FK_contact_tag_tag FOREIGN KEY (tag_id) REFERENCES crm.tag(id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_contact_tag_tag_id ON crm.contact_tag(tag_id);
GO

/* =========================================================
   3) Notes
   ========================================================= */

-- Contact Notes
CREATE TABLE crm.contact_note (
    id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_contact_note PRIMARY KEY,
    contact_id  INT NOT NULL,
    sales_id    INT NOT NULL,
    [date]      DATETIME2(0) NOT NULL,
    [text]      NVARCHAR(MAX) NOT NULL,
    status      NVARCHAR(50) NOT NULL,

    CONSTRAINT FK_contact_note_contact FOREIGN KEY (contact_id) REFERENCES crm.contact(id) ON DELETE CASCADE,
    CONSTRAINT FK_contact_note_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id)
);
GO

CREATE INDEX IX_contact_note_contact_id ON crm.contact_note(contact_id, [date] DESC);
GO

-- Deal Notes
CREATE TABLE crm.deal_note (
    id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_deal_note PRIMARY KEY,
    deal_id     INT NOT NULL,
    sales_id    INT NOT NULL,
    [date]      DATETIME2(0) NOT NULL,
    [text]      NVARCHAR(MAX) NOT NULL,

    CONSTRAINT FK_deal_note_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id)
    -- FK_deal_note_deal added after crm.deal exists
);
GO

/* =========================================================
   4) Deals (+ contact_ids join table)
   ========================================================= */

CREATE TABLE crm.deal (
    id                    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_deal PRIMARY KEY,
    name                  NVARCHAR(200) NOT NULL,
    company_id            INT NOT NULL,
    category              NVARCHAR(80) NOT NULL,
    stage                 NVARCHAR(80) NOT NULL,
    description           NVARCHAR(MAX) NOT NULL,
    amount                DECIMAL(18,2) NOT NULL,
    created_at            DATETIME2(0) NOT NULL,
    updated_at            DATETIME2(0) NOT NULL,
    archived_at           DATETIME2(0) NULL,
    expected_closing_date DATETIME2(0) NOT NULL,
    sales_id              INT NOT NULL,
    [index]               INT NOT NULL,

    CONSTRAINT FK_deal_company FOREIGN KEY (company_id) REFERENCES crm.company(id),
    CONSTRAINT FK_deal_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id)
);
GO

CREATE INDEX IX_deal_company_id ON crm.deal(company_id);
CREATE INDEX IX_deal_sales_id ON crm.deal(sales_id);
CREATE INDEX IX_deal_stage ON crm.deal(stage);
GO

-- Deal <-> Contact (contact_ids: Identifier[])
CREATE TABLE crm.deal_contact (
    deal_id     INT NOT NULL,
    contact_id  INT NOT NULL,
    CONSTRAINT PK_deal_contact PRIMARY KEY (deal_id, contact_id),
    CONSTRAINT FK_deal_contact_deal FOREIGN KEY (deal_id) REFERENCES crm.deal(id) ON DELETE CASCADE,
    CONSTRAINT FK_deal_contact_contact FOREIGN KEY (contact_id) REFERENCES crm.contact(id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_deal_contact_contact_id ON crm.deal_contact(contact_id);
GO

-- Now that deal exists, add FK for deal_note
ALTER TABLE crm.deal_note
ADD CONSTRAINT FK_deal_note_deal FOREIGN KEY (deal_id) REFERENCES crm.deal(id) ON DELETE CASCADE;
GO

CREATE INDEX IX_deal_note_deal_id ON crm.deal_note(deal_id, [date] DESC);
GO

/* =========================================================
   5) Tasks
   ========================================================= */

CREATE TABLE crm.task (
    id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_task PRIMARY KEY,
    contact_id  INT NOT NULL,
    sales_id    INT NULL,
    [type]      NVARCHAR(80) NOT NULL,
    [text]      NVARCHAR(MAX) NOT NULL,
    due_date    DATETIME2(0) NOT NULL,
    done_date   DATETIME2(0) NULL,

    CONSTRAINT FK_task_contact FOREIGN KEY (contact_id) REFERENCES crm.contact(id) ON DELETE CASCADE,
    CONSTRAINT FK_task_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id)
);
GO

CREATE INDEX IX_task_contact_id ON crm.task(contact_id, due_date);
GO

/* =========================================================
   6) Attachments for notes
   ========================================================= */

-- One table that can attach files to either contact_note or deal_note
CREATE TABLE crm.note_attachment (
    id              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_note_attachment PRIMARY KEY,

    contact_note_id INT NULL,
    deal_note_id    INT NULL,

    src             NVARCHAR(2048) NOT NULL,
    title           NVARCHAR(255) NOT NULL,
    path            NVARCHAR(1024) NULL,
    [type]          NVARCHAR(128) NULL,

    created_at      DATETIME2(0) NOT NULL CONSTRAINT DF_note_attachment_created_at DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT FK_note_attachment_contact_note FOREIGN KEY (contact_note_id) REFERENCES crm.contact_note(id) ON DELETE CASCADE,
    CONSTRAINT FK_note_attachment_deal_note FOREIGN KEY (deal_note_id) REFERENCES crm.deal_note(id) ON DELETE CASCADE,

    -- Exactly one of the two must be set
    CONSTRAINT CK_note_attachment_one_parent CHECK (
        (CASE WHEN contact_note_id IS NULL THEN 0 ELSE 1 END) +
        (CASE WHEN deal_note_id IS NULL THEN 0 ELSE 1 END) = 1
    )
);
GO

CREATE INDEX IX_note_attachment_contact_note_id ON crm.note_attachment(contact_note_id);
CREATE INDEX IX_note_attachment_deal_note_id ON crm.note_attachment(deal_note_id);
GO

/* =========================================================
   7) Activities (union type)
   ========================================================= */

-- Store a generic activity feed item; use nullable FKs + a type discriminator.
CREATE TABLE crm.activity (
    id            INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_activity PRIMARY KEY,
    [type]        NVARCHAR(50) NOT NULL,   -- COMPANY_CREATED, CONTACT_CREATED, etc.
    [date]        DATETIME2(0) NOT NULL,
    sales_id      INT NULL,
    company_id    INT NULL,
    contact_id    INT NULL,
    contact_note_id INT NULL,
    deal_id       INT NULL,
    deal_note_id  INT NULL,

    CONSTRAINT FK_activity_sales FOREIGN KEY (sales_id) REFERENCES crm.sales(id),
    CONSTRAINT FK_activity_company FOREIGN KEY (company_id) REFERENCES crm.company(id),
    CONSTRAINT FK_activity_contact FOREIGN KEY (contact_id) REFERENCES crm.contact(id),
    CONSTRAINT FK_activity_contact_note FOREIGN KEY (contact_note_id) REFERENCES crm.contact_note(id),
    CONSTRAINT FK_activity_deal FOREIGN KEY (deal_id) REFERENCES crm.deal(id),
    CONSTRAINT FK_activity_deal_note FOREIGN KEY (deal_note_id) REFERENCES crm.deal_note(id)
);
GO

CREATE INDEX IX_activity_date ON crm.activity([date] DESC);
CREATE INDEX IX_activity_type ON crm.activity([type], [date] DESC);
GO
