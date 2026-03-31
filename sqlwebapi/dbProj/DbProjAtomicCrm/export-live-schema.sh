#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${PROJECT_DIR}/ImportSnapshot"
SCHEMAS_DIR="${OUTPUT_DIR}/Schemas"
TABLES_DIR="${OUTPUT_DIR}/Tables"
FOREIGN_KEYS_DIR="${OUTPUT_DIR}/ForeignKeys"
PROCS_DIR="${OUTPUT_DIR}/StoredProcedures"
TABLE_SCHEMA_FILTER="${TABLE_SCHEMA_FILTER:-crm}"
PROC_SCHEMA_FILTER="${PROC_SCHEMA_FILTER:-crmapi}"

DB_NAME="${DB_NAME:-crm2}"
DB_USER="${DB_USER:-sa}"
DB_PASSWORD="${DB_PASSWORD:-NeroPro1957+}"
DB_HOST="${DB_HOST:-localhost}"
DB_DOCKER_CONTAINER="${DB_DOCKER_CONTAINER:-sql1}"

mkdir -p "${SCHEMAS_DIR}" "${TABLES_DIR}" "${FOREIGN_KEYS_DIR}" "${PROCS_DIR}"
find "${SCHEMAS_DIR}" -type f -name '*.sql' -delete
find "${TABLES_DIR}" -type f -name '*.sql' -delete
find "${FOREIGN_KEYS_DIR}" -type f -name '*.sql' -delete
find "${PROCS_DIR}" -type f -name '*.sql' -delete

sqlcmd_exec() {
  local query="$1"
  if [[ -n "${DB_DOCKER_CONTAINER}" ]]; then
    docker exec "${DB_DOCKER_CONTAINER}" /opt/mssql-tools18/bin/sqlcmd \
      -S localhost \
      -d "${DB_NAME}" \
      -U "${DB_USER}" \
      -P "${DB_PASSWORD}" \
      -C \
      -s $'\t' \
      -w 65535 \
      -y 0 \
      -Y 0 \
      -Q "${query}"
  else
    sqlcmd \
      -S "${DB_HOST}" \
      -d "${DB_NAME}" \
      -U "${DB_USER}" \
      -P "${DB_PASSWORD}" \
      -C \
      -s $'\t' \
      -w 65535 \
      -y 0 \
      -Y 0 \
      -Q "${query}"
  fi
}

escape_sql_literal() {
  printf "%s" "$1" | sed "s/'/''/g"
}

sanitize_filename() {
  printf "%s" "$1" | tr '[:upper:]' '[:lower:]' | tr ' .' '__'
}

build_in_clause() {
  local csv="$1"
  local clause=""
  local item=""

  IFS=',' read -ra items <<< "${csv}"
  for item in "${items[@]}"; do
    item="${item#"${item%%[![:space:]]*}"}"
    item="${item%"${item##*[![:space:]]}"}"
    [[ -z "${item}" ]] && continue
    item="$(escape_sql_literal "${item}")"
    if [[ -n "${clause}" ]]; then
      clause+=","
    fi
    clause+="N'${item}'"
  done

  printf "%s" "${clause}"
}

TABLE_SCHEMA_IN_CLAUSE="$(build_in_clause "${TABLE_SCHEMA_FILTER}")"
PROC_SCHEMA_IN_CLAUSE="$(build_in_clause "${PROC_SCHEMA_FILTER}")"

schema_query="SET NOCOUNT ON; SELECT name FROM sys.schemas WHERE name IN (${TABLE_SCHEMA_IN_CLAUSE}, ${PROC_SCHEMA_IN_CLAUSE}) ORDER BY name;"
while IFS= read -r schema_name; do
  [[ -z "${schema_name}" ]] && continue
  cat > "${SCHEMAS_DIR}/$(sanitize_filename "${schema_name}").sql" <<EOF
CREATE SCHEMA [${schema_name}] AUTHORIZATION [dbo];
GO
EOF
done < <(sqlcmd_exec "${schema_query}")

table_list_query="SET NOCOUNT ON; SELECT s.name + CHAR(9) + t.name FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id WHERE s.name IN (${TABLE_SCHEMA_IN_CLAUSE}) ORDER BY s.name, t.name;"
while IFS=$'\t' read -r table_schema table_name; do
  [[ -z "${table_schema}" || -z "${table_name}" ]] && continue
  schema_literal="$(escape_sql_literal "${table_schema}")"
  table_literal="$(escape_sql_literal "${table_name}")"
  table_query="$(cat <<EOF
SET NOCOUNT ON;
DECLARE @schema sysname = N'${schema_literal}';
DECLARE @table sysname = N'${table_literal}';
DECLARE @object_id int = OBJECT_ID(QUOTENAME(@schema) + N'.' + QUOTENAME(@table));
DECLARE @crlf nchar(2) = NCHAR(13) + NCHAR(10);
DECLARE @comma_crlf nvarchar(10) = N',' + @crlf;
DECLARE @script nvarchar(max) = N'CREATE TABLE [' + @schema + N'].[' + @table + N'] (' + @crlf;

;WITH column_lines AS (
    SELECT
        c.column_id AS item_order,
        N'    [' + c.name + N'] ' +
        CASE
            WHEN cc.definition IS NOT NULL THEN N'AS ' + cc.definition
            ELSE
                CASE
                    WHEN ty.is_user_defined = 1
                        THEN QUOTENAME(SCHEMA_NAME(ty.schema_id)) + N'.' + QUOTENAME(ty.name)
                    ELSE QUOTENAME(ty.name)
                END +
                CASE
                    WHEN ty.name IN (N'varchar', N'char', N'varbinary', N'binary')
                        THEN N'(' + CASE WHEN c.max_length = -1 THEN N'MAX' ELSE CONVERT(nvarchar(10), c.max_length) END + N')'
                    WHEN ty.name IN (N'nvarchar', N'nchar')
                        THEN N'(' + CASE WHEN c.max_length = -1 THEN N'MAX' ELSE CONVERT(nvarchar(10), c.max_length / 2) END + N')'
                    WHEN ty.name IN (N'decimal', N'numeric')
                        THEN N'(' + CONVERT(nvarchar(10), c.precision) + N',' + CONVERT(nvarchar(10), c.scale) + N')'
                    WHEN ty.name IN (N'datetime2', N'datetimeoffset', N'time')
                        THEN N'(' + CONVERT(nvarchar(10), c.scale) + N')'
                    ELSE N''
                END +
                CASE
                    WHEN ic.object_id IS NOT NULL
                        THEN N' IDENTITY(' + CONVERT(nvarchar(30), CONVERT(bigint, ic.seed_value)) + N',' + CONVERT(nvarchar(30), CONVERT(bigint, ic.increment_value)) + N')'
                    ELSE N''
                END +
                CASE WHEN c.is_nullable = 1 THEN N' NULL' ELSE N' NOT NULL' END
        END +
        COALESCE(N' CONSTRAINT [' + dc.name + N'] DEFAULT ' + dc.definition, N'') AS line
    FROM sys.columns c
    JOIN sys.types ty
      ON ty.user_type_id = c.user_type_id
    LEFT JOIN sys.identity_columns ic
      ON ic.object_id = c.object_id
     AND ic.column_id = c.column_id
    LEFT JOIN sys.default_constraints dc
      ON dc.parent_object_id = c.object_id
     AND dc.parent_column_id = c.column_id
    LEFT JOIN sys.computed_columns cc
      ON cc.object_id = c.object_id
     AND cc.column_id = c.column_id
    WHERE c.object_id = @object_id
),
constraint_lines AS (
    SELECT
        1000 + ROW_NUMBER() OVER (ORDER BY kc.type_desc, kc.name) AS item_order,
        N'    CONSTRAINT [' + kc.name + N'] ' +
        CASE WHEN kc.type = N'PK' THEN N'PRIMARY KEY ' ELSE N'UNIQUE ' END +
        CASE i.type WHEN 1 THEN N'CLUSTERED ' WHEN 2 THEN N'NONCLUSTERED ' ELSE N'' END +
        N'(' +
        STRING_AGG(
            N'[' + c.name + N']' + CASE WHEN ic.is_descending_key = 1 THEN N' DESC' ELSE N' ASC' END,
            N', '
        ) WITHIN GROUP (ORDER BY ic.key_ordinal) +
        N')' AS line
    FROM sys.key_constraints kc
    JOIN sys.indexes i
      ON i.object_id = kc.parent_object_id
     AND i.index_id = kc.unique_index_id
    JOIN sys.index_columns ic
      ON ic.object_id = i.object_id
     AND ic.index_id = i.index_id
    JOIN sys.columns c
      ON c.object_id = ic.object_id
     AND c.column_id = ic.column_id
    WHERE kc.parent_object_id = @object_id
      AND ic.key_ordinal > 0
    GROUP BY kc.type_desc, kc.name, kc.type, i.type
    UNION ALL
    SELECT
        2000 + ROW_NUMBER() OVER (ORDER BY cc.name) AS item_order,
        N'    CONSTRAINT [' + cc.name + N'] CHECK ' + cc.definition AS line
    FROM sys.check_constraints cc
    WHERE cc.parent_object_id = @object_id
),
all_lines AS (
    SELECT item_order, line FROM column_lines
    UNION ALL
    SELECT item_order, line FROM constraint_lines
)
SELECT @script += STRING_AGG(line, @comma_crlf) WITHIN GROUP (ORDER BY item_order)
FROM all_lines;

SET @script += @crlf + N');';

SELECT @script;
EOF
)"
  sqlcmd_exec "${table_query}" > "${TABLES_DIR}/$(sanitize_filename "${table_schema}").$(sanitize_filename "${table_name}").sql"
done < <(sqlcmd_exec "${table_list_query}")

fk_list_query="SET NOCOUNT ON; SELECT ps.name + CHAR(9) + pt.name + CHAR(9) + fk.name FROM sys.foreign_keys fk JOIN sys.tables pt ON pt.object_id = fk.parent_object_id JOIN sys.schemas ps ON ps.schema_id = pt.schema_id WHERE ps.name IN (${TABLE_SCHEMA_IN_CLAUSE}) ORDER BY ps.name, pt.name, fk.name;"
while IFS=$'\t' read -r fk_schema fk_table fk_name; do
  [[ -z "${fk_schema}" || -z "${fk_table}" || -z "${fk_name}" ]] && continue
  fk_schema_literal="$(escape_sql_literal "${fk_schema}")"
  fk_table_literal="$(escape_sql_literal "${fk_table}")"
  fk_name_literal="$(escape_sql_literal "${fk_name}")"
  fk_query="$(cat <<EOF
SET NOCOUNT ON;
DECLARE @schema sysname = N'${fk_schema_literal}';
DECLARE @table sysname = N'${fk_table_literal}';
DECLARE @fk sysname = N'${fk_name_literal}';

SELECT
    N'ALTER TABLE [' + ps.name + N'].[' + pt.name + N'] ADD CONSTRAINT [' + fk.name + N'] FOREIGN KEY (' +
    STRING_AGG(QUOTENAME(pc.name), N', ') WITHIN GROUP (ORDER BY fkc.constraint_column_id) +
    N') REFERENCES [' + rs.name + N'].[' + rt.name + N'] (' +
    STRING_AGG(QUOTENAME(rc.name), N', ') WITHIN GROUP (ORDER BY fkc.constraint_column_id) +
    N')' +
    CASE fk.delete_referential_action
        WHEN 1 THEN N' ON DELETE CASCADE'
        WHEN 2 THEN N' ON DELETE SET NULL'
        WHEN 3 THEN N' ON DELETE SET DEFAULT'
        ELSE N''
    END +
    CASE fk.update_referential_action
        WHEN 1 THEN N' ON UPDATE CASCADE'
        WHEN 2 THEN N' ON UPDATE SET NULL'
        WHEN 3 THEN N' ON UPDATE SET DEFAULT'
        ELSE N''
    END +
    N';'
FROM sys.foreign_keys fk
JOIN sys.tables pt
  ON pt.object_id = fk.parent_object_id
JOIN sys.schemas ps
  ON ps.schema_id = pt.schema_id
JOIN sys.tables rt
  ON rt.object_id = fk.referenced_object_id
JOIN sys.schemas rs
  ON rs.schema_id = rt.schema_id
JOIN sys.foreign_key_columns fkc
  ON fkc.constraint_object_id = fk.object_id
JOIN sys.columns pc
  ON pc.object_id = fkc.parent_object_id
 AND pc.column_id = fkc.parent_column_id
JOIN sys.columns rc
  ON rc.object_id = fkc.referenced_object_id
 AND rc.column_id = fkc.referenced_column_id
WHERE ps.name = @schema
  AND pt.name = @table
  AND fk.name = @fk
GROUP BY fk.name, ps.name, pt.name, rs.name, rt.name, fk.delete_referential_action, fk.update_referential_action;
EOF
)"
  sqlcmd_exec "${fk_query}" > "${FOREIGN_KEYS_DIR}/$(sanitize_filename "${fk_schema}").$(sanitize_filename "${fk_table}").$(sanitize_filename "${fk_name}").sql"
done < <(sqlcmd_exec "${fk_list_query}")

proc_list_query="SET NOCOUNT ON; SELECT s.name + CHAR(9) + p.name FROM sys.procedures p JOIN sys.schemas s ON s.schema_id = p.schema_id WHERE s.name IN (${PROC_SCHEMA_IN_CLAUSE}) ORDER BY s.name, p.name;"
while IFS=$'\t' read -r proc_schema proc_name; do
  [[ -z "${proc_schema}" || -z "${proc_name}" ]] && continue
  schema_literal="$(escape_sql_literal "${proc_schema}")"
  proc_literal="$(escape_sql_literal "${proc_name}")"
  proc_query="$(cat <<EOF
SET NOCOUNT ON;
DECLARE @definition nvarchar(max) = OBJECT_DEFINITION(OBJECT_ID(N'[${schema_literal}].[${proc_literal}]'));
SELECT @definition;
EOF
)"
  sqlcmd_exec "${proc_query}" > "${PROCS_DIR}/$(sanitize_filename "${proc_schema}").$(sanitize_filename "${proc_name}").sql"
done < <(sqlcmd_exec "${proc_list_query}")

echo "Exported schemas to ${SCHEMAS_DIR}"
echo "Exported tables to ${TABLES_DIR}"
echo "Exported foreign keys to ${FOREIGN_KEYS_DIR}"
echo "Exported stored procedures to ${PROCS_DIR}"
