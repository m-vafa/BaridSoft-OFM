# TMP45 — Smart Grid Merger

## Purpose

Four Fonix Buttons process product rows across six DataGrids:

1. evaluate1: DG1 -> DG2
2. evaluate2: DG2 -> DG3 (commerce feasibility)
3. evaluate3: DG2 -> DG4 (production feasibility)
4. evaluate4: DG2 + DG3 + DG4 -> DG5/DG6

**Approved classification:** A product goes to DG6 only when its matching DG3 or DG4 record has status `عدم امکان تولید`; otherwise it goes to DG5.

## Property names

Existing names are retained: `Productcodee1..6`, `Productdescription1..6`, `Brand1..6`, `Selectedfieldstatuss2..4`.

Table names: `tmp45_DG1` through `tmp45_DG6`.

## Tests to run in OFM

- Empty DG1/DG2; ensure no destructive replacement.
- Rerun evaluate2/evaluate3 after entering DG3/DG4 statuses (existing statuses will be replaced).
- Duplicate or missing DG2 product codes (evaluate4 blocks operation).
- Same product in both DG3 and DG4 with one rejection (must go to DG6).
- No rejection (must go to DG5).
- Verify all fields in the target grids and saved form state.

The example code has **not** been executed in the live OFM runtime. Spreadsheet comparisons discussed separately are not proof of live button execution.

No customer Schema or Excel workbook is included because this is a public repository and data review is required before publishing.
