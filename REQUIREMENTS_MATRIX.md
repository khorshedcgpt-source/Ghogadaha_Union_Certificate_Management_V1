# Requirements Traceability Matrix — Ghogadaha Union Parishad Certificate Management V1

**Source:** `SPECIFICATION.md` (canonical copy of `Ghogadaha_Union_Certificate_Management_V1.md`)  
**Plan:** `IMPLEMENTATION_PLAN.md`  
**Status values:** `Not started` | `In progress` | `Implemented` | `Verified` | `Blocked`

Phase 0 does not implement application code. All implementation statuses are **Not started** except documentation deliverables marked **Implemented**.

Test case IDs are the intended cases for later `PHASE_X_TEST_REPORT.md` files. They are not executed in Phase 0.

**Rule:** Do not delete matrix rows. Update status only.

---

## Legend

| Column | Meaning |
| --- | --- |
| ID | Stable requirement ID |
| Spec | Section in `SPECIFICATION.md` |
| Phase | Development phase that delivers the requirement |
| Module / file | Planned primary location (created from Phase 1 onward) |
| Status | Implementation status |
| Test case | Planned verification |

---

## Matrix

| ID | Requirement | Spec | Phase | Module / file | Status | Test case |
| --- | --- | --- | --- | --- | --- | --- |
| R-DOC-01 | Maintain SPECIFICATION as product requirements | §40, §45 | 0 | `SPECIFICATION.md` | Implemented | DOC-01: File present and complete vs original |
| R-DOC-02 | Publish implementation plan | §40, §41 Phase 0 | 0 | `IMPLEMENTATION_PLAN.md` | Implemented | DOC-02: Plan covers stack, DB, certs, backup, phases |
| R-DOC-03 | Publish requirements matrix | §40, §41 Phase 0 | 0 | `REQUIREMENTS_MATRIX.md` | Implemented | DOC-03: Every spec major requirement has a row |
| R-DOC-04 | Maintain README | §40 | 1 | `README.md` | Not started | DOC-04: Offline install/build/run documented |
| R-DOC-05 | Maintain CHANGELOG | §40 | 1+ | `CHANGELOG.md` | Not started | DOC-05: Each phase notes changes |
| R-DOC-06 | Phase test reports | §40, §44.8 | 1–11 | `PHASE_X_TEST_REPORT.md` | Not started | DOC-06: Report exists before phase approval |
| R-DOC-07 | Do not remove requirements from documentation | §40, §44.2 | all | docs | Not started | DOC-07: Matrix rows never deleted; only status updates |
| R-P0-01 | Phase-gated development; no giant bang | §2, §41, §44.10 | all | process | Not started | P0-01: No later phase code before approval |
| R-P0-02 | Phase 0 delivers only analysis docs | §41 Phase 0 | 0 | docs | Implemented | P0-02: No UI/components/packages for the app in Phase 0 |
| R-OBJ-01 | Offline-first office certificate app for Ghogadaha UP | §1 | 1–11 | `src/app` | Not started | OBJ-01: Core flows work with network off |
| R-OBJ-02 | Reusable templates: heir, citizenship, attestation, unemployment, unmarried | §1, §19 | 4–5 | `src/templates/*` | Not started | OBJ-02: Five types selectable; future type can register |
| R-OBJ-03 | Enter person once; reuse for certificates | §1, §9 | 3, 7 | `personService.ts` | Not started | OBJ-03: Permanent person opens new cert without retype |
| R-OBJ-04 | Priority: speed, reliability, offline, safety, Bangla, A4, PDF/DOCX, simple workflow, maintainability, extensibility | §1 | all | architecture | Not started | OBJ-04: Covered by Phase 11 acceptance |
| R-OFF-01 | No online APIs for core function | §3, §44.3–4 | all | all services | Not started | OFF-01: Build has no runtime CDN/API calls for core |
| R-OFF-02 | No cloud database | §3 | 2 | `src/db/dexie.ts` | Not started | OFF-02: Only IndexedDB |
| R-OFF-03 | No remote PDF conversion | §3, §31 | 6 | `pdfService.ts` | Not started | OFF-03: PDF created with network disabled |
| R-OFF-04 | No remote DOCX conversion | §3, §32 | 6 | `docxService.ts` | Not started | OFF-04: DOCX created with network disabled |
| R-OFF-05 | No remote QR generation | §3, §27 | 5 | `qrService.ts` | Not started | OFF-05: QR with network disabled |
| R-OFF-06 | No remote fonts | §3 | 1 | `public/fonts`, `@font-face` | Not started | OFF-06: Fonts load from origin/cache only |
| R-OFF-07 | No CDN-only dependencies | §3 | 1 | `index.html`, `vite.config.ts` | Not started | OFF-07: index.html has no CDN script/link |
| R-OFF-08 | Works with Internet completely unavailable | §3, §39 | 1, 11 | PWA | Not started | OFF-08: Playwright offline after first preview build |
| R-OFF-09 | PWA/offline cache where appropriate | §3, §4 | 1 | `vite-plugin-pwa` | Not started | OFF-09: SW precaches app+fonts |
| R-STK-01 | React + TypeScript + Vite | §4 | 1 | `package.json` | Not started | STK-01: `npm run build` succeeds |
| R-STK-02 | IndexedDB + Dexie.js | §4 | 1–2 | `src/db/dexie.ts` | Not started | STK-02: DB opens; schema versioned |
| R-STK-03 | Local QR, PDF, DOCX libraries | §4 | 5–6 | `qr/pdf/docx` services | Not started | STK-03: Libraries bundled, no network |
| R-STK-04 | CSS print layout | §4, §33 | 6 | `src/print/*` | Not started | STK-04: Print CSS applied; UI hidden |
| R-STK-05 | No backend in V1 | §4 | all | — | Not started | STK-05: No server folder/API |
| R-ARC-01 | Modular services (person, family, certificate, template, qr, pdf, docx, print, backup, search, settings, audit) | §5 | 1–10 | `src/services/*` | Not started | ARC-01: Pages do not import Dexie |
| R-ARC-02 | No DB logic in UI components | §5 | 3+ | features vs services | Not started | ARC-02: Lint/review: no `db.` in `pages/` |
| R-ARC-03 | No document generation in large pages | §5 | 4–6 | `src/documents`, services | Not started | ARC-03: Preview page calls services only |
| R-ARC-04 | Strong TypeScript types | §5 | 1+ | `src/types` | Not started | ARC-04: `tsc --noEmit` clean |
| R-SET-01 | Union name, post office, upazila, district, post code, website, email | §6 | 2 | `appSettings`, `settingsService.ts` | Not started | SET-01: Save/load all fields |
| R-SET-02 | Chairman name and mobile | §6, §26 | 2, 5 | `appSettings` | Not started | SET-02: Chairman mobile prints on cert |
| R-SET-03 | Default Ghogadaha header values seeded | §6 | 2 | `src/db/seeds.ts` | Not started | SET-03: Seed matches spec defaults |
| R-SET-04 | Values configurable, not hard-coded wherever practical | §6 | 2, 4 | templates read settings | Not started | SET-04: Changing settings changes new certs |
| R-WRD-01 | Exactly 9 wards (1–9) | §7 | 2 | `wards` table | Not started | WRD-01: Cannot have ward 10; 1–9 exist |
| R-WRD-02 | Member name per ward entered once | §7 | 2 | `members` table | Not started | WRD-02: Member stored 1:1 per ward |
| R-WRD-03 | Selecting ward auto-selects member | §7 | 3, 5 | person/heir form | Not started | WRD-03: Member field read-only and correct |
| R-WRD-04 | Operator must not type member name on certificate | §7 | 5 | heir template UI | Not started | WRD-04: No editable member input on cert form |
| R-MEM-01 | Members are a first-class entity (UUID PK, ward FK) | §7 | 2 | `src/db/schema.ts`, `features/members` | Not started | MEM-01: Unique wardId; name not used as PK |
| R-VIL-01 | Village associated with a ward | §8 | 2 | `villages.wardId` | Not started | VIL-01: Village belongs to one ward |
| R-VIL-02 | Village dropdown filtered by selected ward | §8 | 3 | person form | Not started | VIL-02: Ward 2 does not list Ward 1 villages |
| R-VIL-03 | Local fast village search | §8 | 3 | village search control | Not started | VIL-03: Search filters without network |
| R-VIL-04 | Village DB configurable by admin | §8 | 2, 10 | Admin villages | Not started | VIL-04: Add/edit/deactivate village |
| R-PER-01 | Person name | §9 | 3 | `persons.name` | Not started | PER-01: Required |
| R-PER-02 | পিতা/স্বামীর নাম | §9 | 3 | `persons.fatherOrHusbandName` | Not started | PER-02: Required |
| R-PER-03 | মাতার নাম optional | §9, §10 | 3 | `persons.motherName` | Not started | PER-03: Can save empty |
| R-PER-04 | NID/birth registration optional | §9, §10 | 3 | `persons.nidOrBirthReg` | Not started | PER-04: Can save empty |
| R-PER-05 | Photo optional | §9, §10 | 3 | `personPhotos` | Not started | PER-05: Can save without photo |
| R-PER-06 | Ward and village on person | §9 | 3 | `persons.wardId`, `villageId` | Not started | PER-06: Required for preview |
| R-PER-07 | Customer mobile NOT displayed on certificate | §9, §38 | 5–6 | templates, print, pdf, docx | Not started | PER-07: Snapshot/HTML/PDF/DOCX have no customer mobile |
| R-PER-08 | Mobile used only for permanent identity/search | §9, §13 | 7 | `familyIdentities` | Not started | PER-08: Mobile collected at Final Save only |
| R-PER-09 | Internal UUID is person PK; mobile is never PK | §13 | 2–3 | `persons.id` | Not started | PER-09: Schema PK is UUID |
| R-OPT-01 | Empty optional fields omit label and value | §10 | 4–5 | template conditionals | Not started | OPT-01: Empty mother → no `মাতা:` |
| R-OPT-02 | Empty NID/birth omitted | §10, §25 | 5 | heir table + body | Not started | OPT-02: No empty NID label |
| R-OPT-03 | Empty photo omitted | §10 | 4–5 | image block | Not started | OPT-03: No empty image box |
| R-TMP-01 | Primary Save = প্রাথমিক সেভ | §11 | 3 | temporary records UI | Not started | TMP-01: Button present, Bangla |
| R-TMP-02 | Primary save is temporary working record | §11 | 3 | `persons.status=TEMPORARY` | Not started | TMP-02: Not in permanent search |
| R-TMP-03 | Store TEMPORARY in local DB, not RAM only | §11 | 3 | `temporaryRecords`, `persons` | Not started | TMP-03: Survives reload and restart |
| R-TMP-04 | Temporary records clearly marked | §11 | 3 | TemporaryRecordsPage | Not started | TMP-04: Badge/list label অস্থায়ী |
| R-TMP-05 | View / resume / delete one / clear all temporary | §11 | 3 | TemporaryRecordsPage | Not started | TMP-05: All four actions work |
| R-TMP-06 | Primary save is not permanent customer storage | §11 | 3, 7 | searchService | Not started | TMP-06: Mobile search ignores temporary |
| R-SEL-01 | Select certificate type after person data | §12 | 4 | NewCertificatePage | Not started | SEL-01: Type list includes five V1 types |
| R-SEL-02 | Preview appears immediately / as fast as possible | §12, §30 | 4–5 | PreviewPage | Not started | SEL-02: No unnecessary loading screen |
| R-SEL-03 | From preview: Print, PDF, DOCX | §12, §30 | 6 | PreviewPage | Not started | SEL-03: Three actions visible |
| R-FIN-01 | Final Save = চূড়ান্ত সেভ, separate from Primary | §13 | 7 | Final Save dialog | Not started | FIN-01: Distinct control |
| R-FIN-02 | Final Save asks mobile + relation extension | §13 | 7 | familyService | Not started | FIN-02: Both required |
| R-FIN-03 | Internal UUID/person ID is PK; mobile is not PK | §13 | 2–3 | `persons.id` | Not started | FIN-03: Schema PK is UUID |
| R-FAM-01 | Identity `mobile + "-" + relation` | §14 | 7 | `familyIdentities.displayKey` | Not started | FAM-01: Examples own/spouse/son/daughter |
| R-FAM-02 | Relation codes: own, spouse, son, daughter, father, mother, brother, sister, other | §14 | 7 | types + UI | Not started | FAM-02: All codes selectable |
| R-FAM-03 | Same mobile, new relation allowed; do not overwrite | §14 | 7 | familyService | Not started | FAM-03: Second relation creates new person |
| R-FAM-04 | Same mobile + same relation → duplicate warning | §14 | 7 | Final Save | Not started | FAM-04: Warning; no overwrite |
| R-SRH-01 | Search by mobile | §15 | 7 | SearchPage, searchService | Not started | SRH-01: Finds family |
| R-SRH-02 | Search by NID/Birth Registration | §15 | 7 | searchService | Not started | SRH-02: Finds person |
| R-SRH-03 | Mobile search groups family members | §15 | 7 | SearchPage | Not started | SRH-03: Grouped UI by mobile |
| R-SRH-04 | Results: open, history, preview, print, PDF, DOCX | §15 | 7–8 | SearchPage | Not started | SRH-04: All actions available |
| R-SRH-05 | Fast with thousands of records | §15, §37 | 7, 11 | indexes | Not started | SRH-05: Indexed query; fixture ≥1000 |
| R-SNP-01 | Snapshot on finalize/generate | §16 | 8 | `certificateSnapshots` | Not started | SNP-01: Row created on Final Save |
| R-SNP-02 | Snapshot includes type, person, heirs, ward, village, member, chairman, chairman mobile, date, smarak prefix, template version, QR payload, config | §16 | 8 | `frozen` JSON | Not started | SNP-02: All keys present |
| R-SNP-03 | Later person edits do not change old certificate | §16, §44.7 | 8 | reprint path | Not started | SNP-03: Mutate person; reprint unchanged |
| R-SMA-01 | Smarak display `ঘো.ইউ.পি/কুড়ি/সদর/YYYY-` | §17 | 4–5 | smarak util + settings pattern | Not started | SMA-01: Prefix matches; year from date |
| R-SMA-02 | Serial after hyphen is manual, not auto-forced | §17 | 4 | form | Not started | SMA-02: No auto increment required |
| R-SMA-03 | Year from selected certificate date | §17–18 | 4 | date + smarak | Not started | SMA-03: Change date changes year |
| R-DAT-01 | Date defaults to current date | §18 | 4 | certificate form | Not started | DAT-01: Default today |
| R-DAT-02 | Date editable | §18 | 4 | certificate form | Not started | DAT-02: Manual edit stored |
| R-DAT-03 | Selected date stored in snapshot | §18 | 8 | snapshot | Not started | DAT-03: frozen.certificateDate equals input |
| R-ENG-01 | Reusable template system, not isolated hard-coded pages | §19 | 4 | `src/templates/registry.ts` | Not started | ENG-01: Types share engine APIs |
| R-ENG-02 | Variables | §19 | 4 | template defs | Not started | ENG-02: Name substitution |
| R-ENG-03 | Conditional fields | §19 | 4 | htmlRenderer | Not started | ENG-03: See OPT-* |
| R-ENG-04 | Dynamic tables and rows | §19 | 4–5 | TableBlock | Not started | ENG-04: Heir row count matches |
| R-ENG-05 | Images | §19 | 4 | image block | Not started | ENG-05: Photo renders when present |
| R-ENG-06 | Signature blocks | §19, §26 | 5 | SignatureRowBlock | Not started | ENG-06: Left member / right chairman |
| R-ENG-07 | QR in engine | §19, §27 | 5 | QrBlock | Not started | ENG-07: QR on last page |
| R-ENG-08 | Page breaks | §19, §29 | 5 | pagination.ts | Not started | ENG-08: 20 heirs → multiple pages |
| R-ENG-09 | Page numbering | §19, §29 | 5 | page footer | Not started | ENG-09: `পৃষ্ঠা ১/৩` format |
| R-ENG-10 | Template versions | §19, §16 | 4, 8 | `templateVersions` | Not started | ENG-10: Active version recorded |
| R-ENG-11 | Future templates addable without rewrite | §19 | 4 | registry | Not started | ENG-11: Register-only extension documented |
| R-ENG-12 | Do not invent official wording for non-heir types | §19, §20, §44.15 | 4 | citizenship/attestation/unemployment/unmarried | Not started | ENG-12: Placeholders labeled unapproved |
| R-HEI-01 | Approved header (Bangladesh / Ghogadaha office / Kurigram Sadar 5600) | §20 | 5 | heir template | Not started | HEI-01: Header strings from settings/seed |
| R-HEI-02 | Website/email in header per UI design if present | §20 | 5 | header block | Not started | HEI-02: Omitted if empty |
| R-HEI-03 | Title উত্তরাধিকার/ওয়ারিশ সনদ | §20 | 5 | heir template | Not started | HEI-03: Exact title |
| R-HEI-04 | Approved body paragraph 1 (resident / ward / village) | §20 | 5 | `templates/wording/heirWording.ts` | Not started | HEI-04: String snapshot test |
| R-HEI-05 | Approved body paragraph 2 (heirs left behind) | §20 | 5 | wording constants | Not started | HEI-05: Exact sentence |
| R-HEI-06 | Do not add তিনি মৃত্যুবরণ করেছেন | §20 | 5 | wording | Not started | HEI-06: Forbidden string absent |
| R-HEI-07 | Do not add উক্ত সনদটি প্রয়োজনীয় কাজে… | §20 | 5 | wording | Not started | HEI-07: Forbidden string absent |
| R-HEI-08 | Preserve exact approved wording unless explicitly changed | §44.15 | 5 | templates/heir | Not started | HEI-08: Golden file of wording |
| R-TBL-01 | Columns: ক্র. নং, নাম, সম্পর্ক, NID/জন্ম, মন্তব্য | §21 | 5 | heir table | Not started | TBL-01: Headers exact |
| R-TBL-02 | No age column | §21 | 5 | types + UI + print | Not started | TBL-02: No বয়স anywhere |
| R-REL-01 | Default new row relationship পুত্র | §22 | 5 | heir row factory | Not started | REL-01: Add row → পুত্র |
| R-REL-02 | Dropdown: পুত্র, কন্যা, স্ত্রী, স্বামী, পিতা, মাতা, ভাই, বোন, অন্যান্য, নিজে লিখুন | §22 | 5 | heir UI | Not started | REL-02: All options present |
| R-REL-03 | Custom relationship text | §22 | 5 | relationshipCustom | Not started | REL-03: Custom prints |
| R-SP-01 | Multiple wives: ১ম/২য়/৩য় স্ত্রী … | §23 | 5 | spouse helpers | Not started | SP-01: Ordered wives |
| R-SP-02 | Multiple husbands: ১ম/২য়/৩য় স্বামী … | §23 | 5 | spouse helpers | Not started | SP-02: Ordered husbands |
| R-CHD-01 | Party comments: প্রথম/দ্বিতীয়/তৃতীয় পক্ষের সন্তান | §24 | 5 | comment dropdown | Not started | CHD-01: Options available |
| R-CHD-02 | Custom party/comment input | §24 | 5 | commentCustom | Not started | CHD-02: Custom prints |
| R-CHD-03 | Do not force party on unrelated heir types | §24 | 5 | heir UI | Not started | CHD-03: Hidden for স্ত্রী/পিতা etc. |
| R-HID-01 | Heir ID field is জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর | §25 | 5 | column | Not started | HID-01: Combined field, not two forced fields |
| R-HID-02 | Empty heir ID does not appear for that heir | §25 | 5 | cell renderer | Not started | HID-02: Empty cell, no label |
| R-HID-03 | Avoid empty table content where possible | §25 | 5 | column hide if all empty | Not started | HID-03: All-empty → column hidden |
| R-SIG-01 | Left: ইউপি সদস্যের স্বাক্ষর | §26 | 5 | signature row | Not started | SIG-01: Left label |
| R-SIG-02 | Center: QR | §26 | 5 | signature row | Not started | SIG-02: QR centered |
| R-SIG-03 | Right: চেয়ারম্যানের স্বাক্ষর | §26 | 5 | signature row | Not started | SIG-03: Right label |
| R-SIG-04 | Chairman name and mobile in chairman block | §26 | 5 | signature row | Not started | SIG-04: Both visible |
| R-SIG-05 | Signatures only on final page | §29 | 5 | pagination | Not started | SIG-05: Absent on page 1 of 3 |
| R-QR-01 | QR works offline | §27 | 5 | qrcode lib | Not started | QR-01: Offline generate |
| R-QR-02 | Payload: type, deceased name, date, heir names, relationships, other non-sensitive | §27 | 5 | `qr/payload.ts` | Not started | QR-02: Fields present |
| R-QR-03 | QR must not contain NID | §27, §38 | 5 | payload deny-list | Not started | QR-03: NID absent |
| R-QR-04 | QR must not contain birth registration | §27, §38 | 5 | deny-list | Not started | QR-04: Birth reg absent |
| R-QR-05 | QR must not contain customer mobile | §27, §38 | 5 | deny-list | Not started | QR-05: Customer mobile absent |
| R-QR-06 | QR must not contain chairman mobile | §27 | 5 | deny-list | Not started | QR-06: Chairman mobile absent |
| R-QR-07 | Exact QR payload stored in snapshot | §27, §16 | 8 | `qrPayload` | Not started | QR-07: Reprint uses stored payload |
| R-QR-08 | V1 must not require Internet for verification URL | §27 | 5 | payload | Not started | QR-08: No mandatory http URL |
| R-QR-09 | QR only on final page | §29 | 5 | pagination | Not started | QR-09: No QR on non-final pages |
| R-A4-01 | A4 portrait | §28 | 6 | print CSS, PDF, DOCX | Not started | A4-01: 210×297 mm |
| R-A4-02 | Content margin 0.50 inch | §28 | 6 | `a4.css` | Not started | A4-02: Measured inner pad |
| R-A4-03 | Certificate border | §28 | 6 | print CSS | Not started | A4-03: Border on every page |
| R-A4-04 | ~0.70 inch blank outside border | §28 | 6 | print CSS | Not started | A4-04: Outer inset ~0.70 in |
| R-A4-05 | Correct page breaks; no clipping; no overflow | §28 | 5–6, 11 | pagination + print | Not started | A4-05: Screenshots; no overflow |
| R-A4-06 | Correct Bangla rendering | §28 | 1, 6, 11 | fonts | Not started | A4-06: Conjuncts visible |
| R-A4-07 | Test on real printers | §28, §41 Phase 11 | 11 | manual | Not started | A4-07: Phase 11 printer log |
| R-MP-01 | Auto multiple pages for many heirs | §29 | 5 | pagination.ts | Not started | MP-01: 20+ heirs >1 page |
| R-MP-02 | Page numbers পৃষ্ঠা ১/৩ style | §29 | 5 | page label | Not started | MP-02: Bangla digits |
| R-MP-03 | Never split a table row across pages | §29 | 5 | packer | Not started | MP-03: Row height fully on one page |
| R-MP-04 | Repeat table header every page | §29 | 5 | per-page table | Not started | MP-04: Header on page 2 |
| R-MP-05 | Border every page | §29 | 5–6 | `.a4-page` | Not started | MP-05: All pages bordered |
| R-PRV-01 | Preview fast and close to print | §30 | 4–6 | PreviewPage + print CSS | Not started | PRV-01: Same page model as print |
| R-PRV-02 | Actions: Print, PDF, DOCX, Close | §30 | 6 | PreviewPage | Not started | PRV-02: Close returns without save |
| R-PRV-03 | No unnecessary loading screens | §30 | 4 | PreviewPage | Not started | PRV-03: No blocking splash |
| R-PDF-01 | PDF generated locally | §31 | 6 | pdfService | Not started | PDF-01: Offline file `%PDF` |
| R-PDF-02 | PDF: A4, Bangla, multi-page, tables, QR, borders, signatures, page numbers | §31 | 6 | pdfService | Not started | PDF-02: Checklist vs fixture |
| R-DOCX-01 | DOCX generated locally | §32 | 6 | docxService | Not started | DOCX-01: Offline `PK` zip |
| R-DOCX-02 | Dedicated DOCX layer, not HTML-as-Word | §32 | 6 | docxService | Not started | DOCX-02: OOXML document.xml present |
| R-DOCX-03 | DOCX: A4, Bangla, dynamic tables/rows, QR image, signatures, page breaks where practical | §32 | 6 | docxService | Not started | DOCX-03: Opens in Word; table rows match |
| R-PRT-01 | Dedicated print CSS | §33 | 6 | `print.css` | Not started | PRT-01: File exists; used by print |
| R-PRT-02 | Application UI must not print | §33 | 6 | print media queries | Not started | PRT-02: Shell hidden in print |
| R-PRT-03 | Print preserves A4, border, breaks, Bangla, tables, QR, signatures, page numbers | §33 | 6, 11 | printService | Not started | PRT-03: Playwright PDF/print |
| R-BKP-01 | Offline backup includes settings, wards, villages, permanent persons, family mappings, certificate history, template versions, QR payloads, essential data | §34 | 9 | backupService | Not started | BKP-01: Envelope contains all keys including members |
| R-BKP-02 | Backup versioned and validated | §34 | 9 | formatVersion + Zod | Not started | BKP-02: Invalid schema rejected |
| R-BKP-03 | Safety backup before destructive restore | §34 | 9 | PRE_RESTORE_SAFETY | Not started | BKP-03: File offered/created first |
| R-BKP-04 | Restore must not silently corrupt existing data | §34, §44.6 | 9 | transactional restore | Not started | BKP-04: Failure leaves DB intact |
| R-BKP-05 | Validate imported backup files | §38 | 9 | backupService | Not started | BKP-05: Checksum mismatch rejected |
| R-BKP-06 | Restore is explicit replace-all after safety backup, not silent merge | §34 | 9 | backupService | Not started | BKP-06: Bangla confirm explains replace |
| R-ADM-01 | Admin area: union, chairman, chairman mobile, ward/member, villages, templates, backup, config | §35 | 2, 9–10 | AdminPage | Not started | ADM-01: All sections reachable |
| R-ADM-02 | Operators cannot accidentally modify admin data | §35 | 10 | admin PIN / route guard | Not started | ADM-02: Operator route cannot save wards |
| R-ADM-03 | Lightweight local admin protection | §35 | 10 | hashed PIN | Not started | ADM-03: Wrong PIN denied |
| R-UX-01 | Bangla-first, simple, fast, clear, large controls, keyboard-friendly, desktop + responsive | §36 | 1, 3 | `src/ui`, pages | Not started | UX-01: Labels Bangla; tab order |
| R-UX-02 | Dashboard: নতুন সনদ, প্রাথমিক সেভ, চূড়ান্ত সেভ, অনুসন্ধান, সনদ ইতিহাস, Backup, Settings | §36 | 1 | DashboardPage | Not started | UX-02: All entries present (wired by later phases) |
| R-PRF-01 | Optimize for low/medium office PCs | §37 | all | architecture | Not started | PRF-01: Phase 11 timing notes |
| R-PRF-02 | Avoid unnecessary re-renders, huge deps, remote requests, blocking UI, repeated full scans | §37 | 1–7 | services | Not started | PRF-02: Search uses indexes |
| R-PRF-03 | Indexes for search fields | §37 | 2, 7 | Dexie indexes | Not started | PRF-03: mobile, NID indexed |
| R-PRF-04 | Fast forms and near-immediate preview | §37 | 3–5 | UI | Not started | PRF-04: Preview <2s typical after fonts |
| R-SEC-01 | Sensitive personal data stays local in V1 | §38 | all | no telemetry | Not started | SEC-01: No third-party analytics |
| R-SEC-02 | Do not send personal data to third-party servers | §38 | all | network policy | Not started | SEC-02: Offline core |
| R-SEC-03 | Prevent accidental overwrite | §38 | 7, 9 | duplicate + restore confirm | Not started | SEC-03: Confirms before replace |
| R-BRW-01 | Primary browsers: modern Chrome and Edge | §39 | 1, 11 | QA | Not started | BRW-01: Both in Phase 11 |
| R-BRW-02 | Works without Internet after initial install/build | §39 | 1, 11 | PWA | Not started | BRW-02: Same as OFF-08 |
| R-TST-01 | Realistic Bangla test data | §42 | 3–11 | `src/tests/fixtures` | Not started | TST-01: Fixtures in Bangla |
| R-TST-02 | Short and very long names | §42 | 5, 11 | fixtures | Not started | TST-02: Layout no overflow |
| R-TST-03 | Long village names | §42 | 5, 11 | fixtures | Not started | TST-03: Wrap inside margin |
| R-TST-04 | Empty mother, empty NID, missing photo | §42 | 3–5 | OPT tests | Not started | TST-04: Combined with OPT-* |
| R-TST-05 | 1, 4, 10, 20+ heirs | §42 | 5 | pagination tests | Not started | TST-05: Page counts increase |
| R-TST-06 | Multiple wives/husbands; multi-party children | §42 | 5 | heir tests | Not started | TST-06: With SP-* CHD-* |
| R-TST-07 | All 9 wards | §42 | 2, 5 | ward tests | Not started | TST-07: Member mapping each ward |
| R-TST-08 | Duplicate mobile+relation; same mobile different relations | §42 | 7 | FAM tests | Not started | TST-08: FAM-03/04 |
| R-TST-09 | Browser reload and restart | §42 | 3 | TMP-03 | Not started | TST-09: Drafts persist |
| R-TST-10 | Backup/restore | §42 | 9 | BKP tests | Not started | TST-10: Round-trip |
| R-TST-11 | Old certificate reproduction | §42 | 8 | SNP-03 | Not started | TST-11: Reprint equals snapshot |
| R-ACC-01 | App works offline | §43 | 11 | QA | Not started | ACC-01 |
| R-ACC-02 | Data stored locally | §43 | 11 | QA | Not started | ACC-02 |
| R-ACC-03 | Permanent records survive restart | §43 | 7, 11 | QA | Not started | ACC-03 |
| R-ACC-04 | Search works | §43 | 7, 11 | QA | Not started | ACC-04 |
| R-ACC-05 | Person data reusable | §43 | 7, 11 | QA | Not started | ACC-05 |
| R-ACC-06 | Certificate templates work | §43 | 4–5, 11 | QA | Not started | ACC-06 |
| R-ACC-07 | Optional fields disappear when empty | §43 | 11 | QA | Not started | ACC-07 |
| R-ACC-08 | Ward auto-maps to member | §43 | 11 | QA | Not started | ACC-08 |
| R-ACC-09 | Heir certificate follows approved format | §43 | 11 | QA | Not started | ACC-09 |
| R-ACC-10 | No age column | §43 | 11 | QA | Not started | ACC-10 |
| R-ACC-11 | Default heir relationship পুত্র | §43 | 11 | QA | Not started | ACC-11 |
| R-ACC-12 | Multiple spouses and party children supported | §43 | 11 | QA | Not started | ACC-12 |
| R-ACC-13 | QR works offline | §43 | 11 | QA | Not started | ACC-13 |
| R-ACC-14 | QR does not expose NID/mobile | §43 | 11 | QA | Not started | ACC-14 |
| R-ACC-15 | A4 print works | §43 | 11 | QA | Not started | ACC-15 |
| R-ACC-16 | Multi-page heir certificate works | §43 | 11 | QA | Not started | ACC-16 |
| R-ACC-17 | Page numbering works | §43 | 11 | QA | Not started | ACC-17 |
| R-ACC-18 | Signatures correctly positioned | §43 | 11 | QA | Not started | ACC-18 |
| R-ACC-19 | Chairman mobile displayed | §43 | 11 | QA | Not started | ACC-19 |
| R-ACC-20 | PDF works | §43 | 11 | QA | Not started | ACC-20 |
| R-ACC-21 | DOCX works | §43 | 11 | QA | Not started | ACC-21 |
| R-ACC-22 | Backup/restore works | §43 | 11 | QA | Not started | ACC-22 |
| R-ACC-23 | Historical certificates remain reproducible | §43 | 11 | QA | Not started | ACC-23 |
| R-ACC-24 | No major TypeScript/build/runtime errors | §43 | 11 | QA | Not started | ACC-24 |
| R-AI-01 | Read docs before architecture changes | §44.1 | all | process | Not started | Process check each phase |
| R-AI-02 | Never invent online dependencies | §44.3 | all | package.json | Not started | Review new deps |
| R-AI-03 | Test after every phase; fix before proceeding | §44.8–9 | 1–11 | test reports | Not started | Phase gate |
| R-AI-04 | Bangla UI labels | §44.14 | 1+ | pages | Not started | UX-01 |
| R-AI-05 | Never overwrite permanent records silently | §44.6 | 7, 9 | familyService, backupService | Not started | AI-05: Same as FAM-04 + BKP-04 |
| R-AI-06 | Never change finalized snapshots | §44.7 | 8 | certificateSnapshots insert-only | Not started | AI-06: Update API absent |
| R-PH-01 | Phase 1 foundation items | §41 | 1 | app shell | Not started | See plan Phase 1 acceptance |
| R-PH-02 | Phase 2 settings and DB | §41 | 2 | settings/wards/villages | Not started | Phase 2 acceptance |
| R-PH-03 | Phase 3 person management | §41 | 3 | persons/temporaryRecords | Not started | Phase 3 acceptance |
| R-PH-04 | Phase 4 certificate engine | §41 | 4 | templates | Not started | Phase 4 acceptance |
| R-PH-05 | Phase 5 heir certificate | §41 | 5 | heir | Not started | Phase 5 acceptance |
| R-PH-06 | Phase 6 print/PDF/DOCX | §41 | 6 | output services | Not started | Phase 6 acceptance |
| R-PH-07 | Phase 7 permanent storage | §41 | 7 | family/search | Not started | Phase 7 acceptance |
| R-PH-08 | Phase 8 snapshot/history | §41 | 8 | snapshots | Not started | Phase 8 acceptance |
| R-PH-09 | Phase 9 backup | §41 | 9 | backup | Not started | Phase 9 acceptance |
| R-PH-10 | Phase 10 admin/security | §41 | 10 | admin | Not started | Phase 10 acceptance |
| R-PH-11 | Phase 11 final QA | §41 | 11 | reports | Not started | Phase 11 acceptance |

---

## Coverage check (specification sections → IDs)

| Spec section | Requirement IDs |
| --- | --- |
| 1 Product objective | R-OBJ-01–04 |
| 2 Development rule | R-P0-01 |
| 3 Offline-first | R-OFF-01–09 |
| 4 Recommended technology | R-STK-01–05 |
| 5 Architecture | R-ARC-01–04 |
| 6 Union/admin settings | R-SET-01–04 |
| 7 Ward configuration | R-WRD-01–04, R-MEM-01 |
| 8 Village configuration | R-VIL-01–04 |
| 9 Person information | R-PER-01–09 |
| 10 Optional field rules | R-OPT-01–03 |
| 11 Primary save | R-TMP-01–06 |
| 12 Certificate selection | R-SEL-01–03 |
| 13 Final save | R-FIN-01–03 |
| 14 Family identity | R-FAM-01–04 |
| 15 Permanent search | R-SRH-01–05 |
| 16 Historical snapshot | R-SNP-01–03 |
| 17 Smarak number | R-SMA-01–03 |
| 18 Date | R-DAT-01–03 |
| 19 Template engine | R-ENG-01–12 |
| 20 Approved heir content | R-HEI-01–08 |
| 21 Heir table | R-TBL-01–02 |
| 22 Heir relationship | R-REL-01–03 |
| 23 Multiple spouses | R-SP-01–02 |
| 24 Child party | R-CHD-01–03 |
| 25 Heir ID field | R-HID-01–03 |
| 26 Signature area | R-SIG-01–05 |
| 27 QR code | R-QR-01–09 |
| 28 A4 print | R-A4-01–07 |
| 29 Multi-page heir | R-MP-01–05 |
| 30 Preview | R-PRV-01–03 |
| 31 PDF | R-PDF-01–02 |
| 32 DOCX | R-DOCX-01–03 |
| 33 Print | R-PRT-01–03 |
| 34 Backup/restore | R-BKP-01–06 |
| 35 Admin settings | R-ADM-01–03 |
| 36 UX | R-UX-01–02 |
| 37 Performance | R-PRF-01–04 |
| 38 Security/privacy | R-SEC-01–03, R-QR-03–06, R-PER-07 |
| 39 Browser compatibility | R-BRW-01–02 |
| 40 Documentation | R-DOC-01–07 |
| 41 Phase plan | R-PH-01–11, R-P0-02 |
| 42 Test data | R-TST-01–11 |
| 43 Acceptance criteria | R-ACC-01–24 |
| 44 AI coding rules | R-AI-01–06 |
| 45 Workflow | R-P0-01, R-DOC-01–03 |

No specification section is left unmapped.

---

## Phase 0 note

Application implementation status for all functional rows remains **Not started** until Phase 1 is explicitly approved.

No packages were installed. No UI or certificate components were created.
