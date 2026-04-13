#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_FILE="${PROJECT_DIR}/DbProjAtomicCrm.sqlproj"
CONFIGURATION="${CONFIGURATION:-Release}"
ARTIFACTS_DIR="${ARTIFACTS_DIR:-${PROJECT_DIR}/dist}"
ENV_FILE="${PROJECT_DIR}/.env.local.deploy"
SQLPACKAGE_DIR="${PROJECT_DIR}/.sqlpackage"
SQLPACKAGE_ZIP="${PROJECT_DIR}/sqlpackage.zip"
VERSION="${VERSION:-$(git -C "${PROJECT_DIR}" describe --tags --always 2>/dev/null || echo manual)}"
DACPAC_BASENAME="DbProjAtomicCrm-${VERSION}"
INITIAL_SQL_BASENAME="DbProjAtomicCrm-initial-${VERSION}"
INITIAL_SCRIPT_TARGET_CONNECTION_STRING="${INITIAL_SCRIPT_TARGET_CONNECTION_STRING:-}"
SERVICE_USER_NAME="${SERVICE_USER_NAME:-}"
SERVICE_USER_PASSWORD="${SERVICE_USER_PASSWORD:-}"

generate_service_user_password() {
  python3 -c "import secrets, string; alphabet = string.ascii_letters + string.digits + '!@#%^*_+='; print(''.join(secrets.choice(alphabet) for _ in range(24)))"
}

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
fi

if [[ -n "${SERVICE_USER_NAME}" && -z "${SERVICE_USER_PASSWORD}" ]]; then
  SERVICE_USER_PASSWORD="$(generate_service_user_password)"
  echo "Generated temporary password for ${SERVICE_USER_NAME}: ${SERVICE_USER_PASSWORD}"
  echo "Change this password after installation."
fi

if ! command -v dotnet >/dev/null 2>&1; then
  echo "dotnet is required but was not found."
  exit 1
fi

if command -v sqlpackage >/dev/null 2>&1; then
  SQLPACKAGE_BIN="$(command -v sqlpackage)"
elif [[ -x "${SQLPACKAGE_DIR}/sqlpackage" ]]; then
  SQLPACKAGE_BIN="${SQLPACKAGE_DIR}/sqlpackage"
elif [[ -f "${SQLPACKAGE_ZIP}" ]]; then
  if ! command -v unzip >/dev/null 2>&1; then
    echo "unzip is required to extract ${SQLPACKAGE_ZIP}."
    exit 1
  fi

  echo "Extracting bundled sqlpackage from ${SQLPACKAGE_ZIP}..."
  rm -rf "${SQLPACKAGE_DIR}"
  mkdir -p "${SQLPACKAGE_DIR}"
  unzip -q "${SQLPACKAGE_ZIP}" -d "${SQLPACKAGE_DIR}"
  chmod +x "${SQLPACKAGE_DIR}/sqlpackage"
  SQLPACKAGE_BIN="${SQLPACKAGE_DIR}/sqlpackage"
else
  echo "sqlpackage is required but was not found."
  echo "Install it or add ${SQLPACKAGE_ZIP}, then rerun this script."
  exit 1
fi

mkdir -p "${ARTIFACTS_DIR}"

echo "Building DACPAC from ${PROJECT_FILE}..."
dotnet build "${PROJECT_FILE}" -c "${CONFIGURATION}"

if [[ "${CONFIGURATION}" == "Release" ]]; then
  DACPAC_FILE="${PROJECT_DIR}/bin/Release/DbProjAtomicCrm.dacpac"
else
  DACPAC_FILE="${PROJECT_DIR}/bin/Debug/DbProjAtomicCrm.dacpac"
fi

if [[ ! -f "${DACPAC_FILE}" ]]; then
  echo "DACPAC not found at ${DACPAC_FILE}"
  exit 1
fi

VERSIONED_DACPAC_FILE="${ARTIFACTS_DIR}/${DACPAC_BASENAME}.dacpac"
LATEST_DACPAC_FILE="${ARTIFACTS_DIR}/DbProjAtomicCrm.dacpac"

cp "${DACPAC_FILE}" "${VERSIONED_DACPAC_FILE}"
cp "${DACPAC_FILE}" "${LATEST_DACPAC_FILE}"

echo "Wrote ${VERSIONED_DACPAC_FILE}"
echo "Wrote ${LATEST_DACPAC_FILE}"

if [[ -n "${INITIAL_SCRIPT_TARGET_CONNECTION_STRING}" ]]; then
  INITIAL_SQL_FILE="${ARTIFACTS_DIR}/${INITIAL_SQL_BASENAME}.sql"
  LATEST_INITIAL_SQL_FILE="${ARTIFACTS_DIR}/DbProjAtomicCrm-initial.sql"
  SQLPACKAGE_ARGS=(
    /Action:Script
    "/SourceFile:${VERSIONED_DACPAC_FILE}"
    "/TargetConnectionString:${INITIAL_SCRIPT_TARGET_CONNECTION_STRING}"
    "/DeployScriptPath:${INITIAL_SQL_FILE}"
    "/v:DeployVersion=${VERSION}"
    "/v:GitCommit=$(git -C "${PROJECT_DIR}" rev-parse --short HEAD 2>/dev/null || echo unknown)"
    "/v:DeployedBy=package-release"
    "/v:DeploymentTarget=initial-script"
  )

  if [[ -n "${SERVICE_USER_NAME}" ]]; then
    SQLPACKAGE_ARGS+=("/v:ServiceUserName=${SERVICE_USER_NAME}")
  fi

  if [[ -n "${SERVICE_USER_PASSWORD}" ]]; then
    SQLPACKAGE_ARGS+=("/v:ServiceUserPassword=${SERVICE_USER_PASSWORD}")
  fi

  echo "Generating initial deployment script at ${INITIAL_SQL_FILE}..."
  "${SQLPACKAGE_BIN}" "${SQLPACKAGE_ARGS[@]}"

  cp "${INITIAL_SQL_FILE}" "${LATEST_INITIAL_SQL_FILE}"

  echo "Wrote ${INITIAL_SQL_FILE}"
  echo "Wrote ${LATEST_INITIAL_SQL_FILE}"
else
  echo "Skipped initial SQL generation."
  echo "Set INITIAL_SCRIPT_TARGET_CONNECTION_STRING to an empty scratch database to produce DbProjAtomicCrm-initial.sql."
fi
