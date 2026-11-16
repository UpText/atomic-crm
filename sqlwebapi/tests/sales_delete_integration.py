from pathlib import Path
import subprocess,uuid,argparse
p=argparse.ArgumentParser();p.add_argument('--container',required=True);args=p.parse_args()
root=Path(__file__).resolve().parents[1]/'dbProj/DbProjAtomicCrm'
database='UpTextSalesDeleteTest_'+uuid.uuid4().hex
command=['docker','exec','-i',args.container,'/bin/bash','-c','SQLCMDPASSWORD="${MSSQL_SA_PASSWORD:-$SA_PASSWORD}" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -r1']
def execute(sql):
 result=subprocess.run(command,input=sql,capture_output=True,text=True)
 if result.returncode: raise RuntimeError(result.stdout+result.stderr)
try:
 execute(f'CREATE DATABASE [{database}];\nGO\n')
 ddl=f'USE [{database}];\nGO\nCREATE SCHEMA crm;\nGO\nCREATE SCHEMA crmapi;\nGO\n'
 for path in ['Tables/crm.tenants.sql','Tables/crm.sales.sql','Tables/crm.external_identities.sql','StoredProcedures/crmapi.sales_delete.sql']:
  ddl+=(root/path).read_text()+'\nGO\n'
 ddl+='''CREATE TABLE crm.delete_test_references (id int PRIMARY KEY,sales_id int REFERENCES crm.sales(id));
INSERT crm.tenants(name) VALUES ('a'),('b'),('inactive');
UPDATE crm.tenants SET active=0 WHERE name='inactive';
INSERT crm.sales(tenant,email,administrator,disabled) VALUES
 ('a','admin@a',1,0),('a','user@a',0,0),('a','disabled@a',1,1),
 ('b','user@b',0,0),('a','referenced@a',0,0),('a','unused@a',0,0),('inactive','admin@inactive',1,0);
INSERT crm.delete_test_references VALUES(1,5);
INSERT crm.external_identities(tenant,directory_id,object_id,client_id,sales_id,expires_at) VALUES
 ('a','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333',5,DATEADD(day,7,SYSUTCDATETIME())),
 ('a','11111111-1111-1111-1111-111111111111','44444444-4444-4444-4444-444444444444','33333333-3333-3333-3333-333333333333',6,DATEADD(day,7,SYSUTCDATETIME()));
GO
DECLARE @status int;
EXEC @status=crmapi.sales_delete @ID=NULL,@auth_tenant='a',@auth_id=1;
IF @status<>400 THROW 50999,'Missing ID not rejected.',1;
EXEC @status=crmapi.sales_delete @ID='bad',@auth_tenant='a',@auth_id=1;
IF @status<>400 THROW 50999,'Malformed ID not rejected.',1;
EXEC @status=crmapi.sales_delete @ID='6',@auth_tenant='a',@auth_id=2;
IF @status<>403 THROW 50999,'Non-admin deletion allowed.',1;
EXEC @status=crmapi.sales_delete @ID='6',@auth_tenant='a',@auth_id=3;
IF @status<>403 THROW 50999,'Disabled administrator deletion allowed.',1;
EXEC @status=crmapi.sales_delete @ID='7',@auth_tenant='inactive',@auth_id=7;
IF @status<>403 THROW 50999,'Inactive tenant deletion allowed.',1;
EXEC @status=crmapi.sales_delete @ID='4',@auth_tenant='a',@auth_id=1;
IF @status<>404 THROW 50999,'Cross-tenant deletion not rejected.',1;
EXEC @status=crmapi.sales_delete @ID='999',@auth_tenant='a',@auth_id=1;
IF @status<>404 THROW 50999,'Missing user not rejected.',1;
EXEC @status=crmapi.sales_delete @ID='1',@auth_tenant='a',@auth_id=1;
IF @status<>409 THROW 50999,'Self-deletion not rejected.',1;
EXEC @status=crmapi.sales_delete @ID='5',@auth_tenant='a',@auth_id=1;
IF @status<>409 THROW 50999,'Referenced user deletion not rejected.',1;
IF NOT EXISTS(SELECT 1 FROM crm.sales WHERE id=5) OR NOT EXISTS(SELECT 1 FROM crm.external_identities WHERE sales_id=5)
 THROW 50999,'Failed deletion was not atomic.',1;
EXEC @status=crmapi.sales_delete @ID='6',@auth_tenant='a',@auth_id=1;
IF @status<>204 THROW 50999,'Unused user deletion failed.',1;
IF EXISTS(SELECT 1 FROM crm.sales WHERE id=6) OR EXISTS(SELECT 1 FROM crm.external_identities WHERE sales_id=6)
 THROW 50999,'User or identity link not deleted.',1;
IF NOT EXISTS(SELECT 1 FROM crm.sales WHERE id=4 AND tenant='b') THROW 50999,'Other tenant was modified.',1;
'''
 execute(ddl)
 print('PASS: ID validation, admin authorization, disabled/inactive checks, tenant isolation, missing users, self-deletion protection, referenced-user conflict, atomic rollback and unused-user/Entra-link deletion.')
finally:
 execute(f'USE master;\nGO\nALTER DATABASE [{database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\nDROP DATABASE [{database}];\nGO\n')
