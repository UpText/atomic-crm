SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Retrieve company 
--- EXEC [crmapi].companies_get @filter='{"id":[513,512]}'

-- EXEC [crmapi].companies_get @filter='{"id":501}',@first_row='0',@last_row='249',@sort_field='created_at',@sort_order='DESC'
     CREATE OR ALTER   PROCEDURE [crmapi].[companies_Get](@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                          
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER   PROCEDURE [crmapi].[companies_Post](
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER   PROCEDURE [crmapi].[companies_put](@ID varchar(max)  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
     CREATE OR ALTER   PROCEDURE [crmapi].[companies_summary_get](
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER     PROCEDURE crmapi.contact_notes_delete (@ID varchar(max)) 
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- exec crmapi.contact_notes_Get @filter = '{"contact_id": 224}'
-- EXEC [crmapi].contact_notes_get @filter='{"contact_id@in":"(224,221,233,238,258)"}'


--- Retrieve contact_note 
CREATE OR ALTER   PROCEDURE [crmapi].[contact_notes_Get](@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER     PROCEDURE crmapi.contact_notes_put(@ID varchar(max)  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Retrieve contacts 
     CREATE OR ALTER   PROCEDURE [crmapi].[contacts_get](@ID varchar(max) = NULL  
         , @filter varchar(max)=NULL 
         , @first_row INT = 0, @last_row INT = 1000 
         , @sort_field NVARCHAR(100) = NULL, @sort_order NVARCHAR(4) = NULL 
     ) AS 
     DECLARE @company_id INT = JSON_VALUE(@filter, N'$.company_id');
      SELECT  id AS id, id, first_name, last_name, title, company_id, sales_id, linkedin_url, first_seen, last_seen, has_newsletter, gender, status, background, emails_json, phones_json, 
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- exec crmapi.contacts_get @ID = '222'
CREATE OR ALTER   PROCEDURE [crmapi].[contacts_put](@ID varchar(max)  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--  EXEC [crmapi].contacts_summary_get @filter='{"tags@cs":"{7}"}',@first_row='0',@last_row='9'
CREATE OR ALTER PROCEDURE [crmapi].[contacts_summary_get]
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
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Retrieve deal_notes 
     CREATE OR ALTER     PROCEDURE crmapi.deal_notes_get(@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Retrieve deals 
     CREATE OR ALTER     PROCEDURE crmapi.deals_get(@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Retrieve sales 
--- exec crmapi.sales_get
     CREATE OR ALTER   PROCEDURE [crmapi].[sales_get](@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER     PROCEDURE crmapi.sales_put(@ID varchar(max)  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- exec crmapi.tags_get @filter='{"xid":[2,1]}'
--  SELECT 1 FROM OPENJSON('{"id":[2,3]}', '$.id')
-- SELECT value FROM OPENJSON('{"xid":[2]}', '$.id')
--- Retrieve tags 
     CREATE OR ALTER   PROCEDURE [crmapi].[tags_get](@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER     PROCEDURE crmapi.tags_post( 
@name nvarchar(100) = NULL,@color nvarchar(30) = NULL ) AS
INSERT INTO crm.tags (  name ,  color   ) VALUES (
 @name ,  @color   )
DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY()
EXEC crmapi.tags_Get  @ID=@NEWID 
 RETURN 200 -- OK

GO
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- exec crmapi.tasks_get @filter = '{"contact_id": 227'
--- Retrieve tasks 
     CREATE OR ALTER   PROCEDURE [crmapi].[tasks_get](@ID varchar(max) = NULL  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER   PROCEDURE [crmapi].[tasks_put](@ID varchar(max)  
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

