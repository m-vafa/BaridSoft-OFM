# OFM-FB-002 — v1.2.0

## Purpose
Search an exact field property name recursively across form record data, including nested objects and DataGrid arrays. Write every matching occurrence to DG0, with the historical record version from the OFM Form/Get endpoint.

## Inputs
- Latintitleform: Latin form name (e.g. tmp100)
- Fieldtitle: selected field property name or object
- Searchfilter: optional case-insensitive substring
- DG1: field schema rows containing Propertynameee

## Outputs
- DG0.Propertynameee0
- DG0.valueee0
- DG0.Sn0
- DG0.FieldPath0
- DG0.FormVersion0
- textareaField1: execution report

## Version API
`GET /Fonix/OFM/api/Form/Get/?formTypeId={record.FormTypeId}&Id={record.Id}`

Use `response.data.Entity.Version`, **not** `LastVersion`. The internal resource listing does not expose historical version. For each matched record, request version once.

## User-reported validation (2026-11-05)
- Form: tmp100; Field: Labelll; Searchfilter: empty
- Records checked: 7; matched records: 4
- Values and DG0 rows: 38 (same as v1.1.0)
- Version requests: 4; version errors: 0
- Versions observed: 48488 → 1, 48489 → 1, 48498 → 4; API for 48499 → 5.
- The user deliberately changed the DG0 version for 48499 to "5555" for a manual update experiment; this is not an API version.
- No post-edit rerun result was supplied.

## Notes
- This repository implementation is a documented, slightly cleaned-up variant of the code tested in chat: it separates records with no matching field from those excluded by Searchfilter and provides structured HTTP errors.
- The original baseline code.js remains unchanged.
- Limit is 100 records; no pagination.
- Historical version requests are performed for matched records only.
