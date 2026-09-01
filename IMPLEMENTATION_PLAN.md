# Ghogadaha Union Parishad Certificate Management System V1 — Implementation Plan

**Document type:** Phase 0 architecture plan  
**Status:** Awaiting explicit approval before Phase 1  
**Date:** 2026-09-01  
**Source of truth:** `SPECIFICATION.md` (canonical; same content as `Ghogadaha_Union_Certificate_Management_V1.md`)  
**Priority order:** Reliability > Data safety > Correctness > Print quality > Maintainability > Performance > Development speed

This document does **not** implement the application. It records repository findings, requirements analysis, architecture, technical risks, and a gated phase plan.

**Stop condition:** After this document and `REQUIREMENTS_MATRIX.md` are approved, Phase 1 may begin. Do not implement UI, certificate components, or install runtime packages until then.

---

## 1. Executive summary

V1 is an **offline-first, browser-only office application** for Ghogadaha Union Parishad (Kurigram Sadar, Kurigram, Bangladesh). Operators enter a person’s common information once, then generate Union Parishad certificates without re-typing that information.

Initial certificate types:

1. উত্তরাধিকার/ওয়ারিশ সনদ (approved wording exists)
2. নাগরিকত্ব সনদ
3. প্রত্যয়ন পত্র
4. বেকারত্ব সনদ
5. অবিবাহিত সনদ

There is **no backend in V1**. Operational data lives in IndexedDB. Fonts, QR, PDF, and DOCX are generated locally. Customer mobile numbers are identity/search only and never printed. Historical certificates are reproduced from immutable snapshots, not from live person/settings rows.

The inspected workspace is **not an application codebase**. Phase 1 must scaffold Vite + React + TypeScript from a clean slate. No requirement in `SPECIFICATION.md` is dropped to make implementation easier.

---

## 2. Repository analysis

Inspected path: `C:\Users\KCL\Desktop\SSD Backup Folder\Certificate_Management_Ghogadaha_UP`  
Inspection date: 2026-09-01

| Item | Finding |
| --- | --- |
| Current files | `SPECIFICATION.md`, `Ghogadaha_Union_Certificate_Management_V1.md` (duplicate spec), `IMPLEMENTATION_PLAN.md`, `REQUIREMENTS_MATRIX.md` |
| Existing source code | **None** (`src/` does not exist) |
| Package manager | **None** (no `package.json`, no lockfile, no `node_modules`) |
| Framework | **None** |
| Dependencies | **None** |
| Configuration | **None** (no Vite, TypeScript, ESLint, PWA, or Tailwind config) |
| Database / storage | **None** |
| UI components | **None** |
| Tests | **None** |
| Build system | **None** |
| Local Git repository | **No `.git` directory** |
| Git CLI | **Not installed** on this machine (`git` not in PATH; typical install paths absent) |
| GitHub CLI (`gh`) | **Not installed** |
| Cursor GitHub account | Connected during Phase 0 (source-control prompt succeeded) |
| Remote bound to this folder | **None** — GitHub account connection is not the same as a cloned/initialized repo in this directory |

**Explicit statement:** This is an **empty application repository**. The only artifacts are specification and Phase 0 planning documents. There is no hidden app, no prior template engine, no database to migrate, and no existing test suite.

**Implications:**

- Do not assume files exist in Phase 1.
- Do not import an unrelated Union Parishad project.
- Do not add a backend because GitHub is connected.
- Binding this folder to a GitHub remote (install Git, `git init` / clone, set origin) is an environment task, not a V1 product feature. It should be done when the operator asks, not as a silent Phase 0 side effect.

---

## 3. Requirements analysis

The specification is the product requirement document. Every section (§1–§45) is traced in `REQUIREMENTS_MATRIX.md`. The following is the architectural reading of every major area.

### 3.1 Fully offline operation

Core flows must work with **zero network**: settings, persons, certificates, preview, print, PDF, DOCX, QR, search, backup/restore. Forbidden: online APIs, cloud database, remote PDF/DOCX conversion, remote QR, remote fonts, CDN-only runtime dependencies. A PWA cache is allowed so Chrome/Edge can reopen the app after the first local install/build.

### 3.2 IndexedDB / local storage

Authoritative data lives in IndexedDB via Dexie.js. `localStorage` / `sessionStorage` may hold non-authoritative UI chrome only (last route, density). Persons, drafts, certificates, snapshots, photos, and settings are never RAM-only and never `localStorage`-only.

### 3.3 Temporary vs permanent data

| Stage | Operator action | Persistence | Meaning |
| --- | --- | --- | --- |
| New | Fill person / certificate form | Unsaved | Unsafest |
| Primary Save (`প্রাথমিক সেভ`) | Explicit save | IndexedDB `TEMPORARY` | Working draft; survives reload/crash |
| Certificate preview | Preview / Print / PDF / DOCX | Still temporary unless Final Save | Output does **not** imply permanence |
| Final Save (`চূড়ান্ত সেভ`) | Mobile + relation | IndexedDB `PERMANENT` + snapshot | Customer record + immutable certificate |

Temporary records must be listable, resumable, deletable (one or all). Primary Save is **not** customer storage and must not appear in permanent mobile/NID search.

### 3.4 Person management

Shared fields: নাম (required), পিতা/স্বামীর নাম (required), মাতার নাম (optional), জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন (optional), ছবি (optional), ওয়ার্ড, গ্রাম, plus certificate-specific payload. Internal PK is UUID. Mobile is **not** collected until Final Save and is **never** printed.

### 3.5 Mobile + relation family identity

User-facing identity: `mobile + "-" + relation` with relation codes `own`, `spouse`, `son`, `daughter`, `father`, `mother`, `brother`, `sister`, `other`. Same mobile + new relation = new person (no overwrite). Same mobile + same relation = **duplicate warning, no silent overwrite**.

### 3.6 NID / Birth Registration search

Permanent search: (1) mobile — group all family members sharing the mobile; (2) NID/birth registration. Results: open person, certificate history, preview, print, PDF, DOCX. Must stay fast at thousands of records via indexes.

### 3.7 Ward → Village → Member mapping

Exactly 9 wards (1–9). Each ward has one member name, entered once in admin. Operator selects ward; **member name is never typed on the certificate**. Villages belong to a ward; village dropdown is ward-filtered; local village search is required. Village DB is admin-configurable.

### 3.8 Certificate template engine

Not one unrelated hard-coded page per type. Shared engine: variables, conditional fields, dynamic tables/rows, images, QR, signature blocks, page breaks, page numbering, template versions. Future types register without rewriting the application.

**Wording gap (must not be silently invented):** Spec §20 freezes heir certificate wording. Types 2–5 have **no approved body text** in the specification. Phase 4 must implement engine + layout + settings-driven header/smarak/date, and use **explicit placeholder Bangla** labeled as unapproved until the office provides wording. Heir wording must remain exact.

### 3.9 Heir certificate

Approved header, smarak, title **উত্তরাধিকার/ওয়ারিশ সনদ**, and the two approved body paragraphs only. Do **not** add “তিনি মৃত্যুবরণ করেছেন” or “উক্ত সনদটি প্রয়োজনীয় কাজে ব্যবহারের জন্য প্রদান করা হলো।” Table columns: ক্র. নং, নাম, মৃতের সাথে সম্পর্ক, জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর, মন্তব্য. **No age column.** Default new-row relationship `পুত্র`. Custom via `নিজে লিখুন`. Multiple spouses (১ম/২য়/৩য় … স্ত্রী/স্বামী). Party children in comments without forcing party on unrelated heir types. Empty optional NID/birth must not show empty labels.

### 3.10 QR, A4, margins, multi-page, signatures

- QR offline; minimum non-sensitive payload; exact payload stored on snapshot.
- A4 portrait; content margin **0.50 in** inside the border; **approximately 0.70 in** blank outside the border.
- Multi-page: never split a table row; repeat table header; border every page; signatures + QR **final page only**; page numbers `পৃষ্ঠা ন/ম` on every page.
- Left: ইউপি সদস্যের স্বাক্ষর; center QR; right চেয়ারম্যানের স্বাক্ষর with chairman name **and** chairman mobile.

### 3.11 PDF, DOCX, print

All local. Dedicated print CSS; **application chrome must not print**. DOCX is a dedicated OOXML layer, not “save HTML as Word.”

### 3.12 Historical snapshots and template versioning

On finalize, freeze person data, heir data, ward, village, member name, chairman name, chairman mobile, certificate date, smarak prefix, template version, QR payload, and relevant configuration. Later person or settings edits must not change an old certificate.

### 3.13 Backup / restore, performance, security

Versioned, validated offline backup of settings, wards, members, villages, permanent persons, family mappings, certificate history, template versions, QR payloads, and other essential data. Safety backup before destructive restore. No third-party upload of personal data. No NID/birth/customer mobile/chairman mobile in QR. Lightweight admin protection. Optimize for low/medium office PCs.

### 3.14 Configurable union defaults (seed, not hard-wire into templates)

Seed values:

- গণপ্রজাতন্ত্রী বাংলাদেশ  
- ঘোগাদহ ইউনিয়ন পরিষদ কার্যালয়  
- কুড়িগ্রাম সদর, কুড়িগ্রাম-৫৬০০  
- Website: `ghogadaha.kurigram.gov.bd`  
- Email: `ghogadahaup@gmail.com`

Smarak pattern: `ঘো.ইউ.পি/কুড়ি/সদর/{year}-` with year from the **selected certificate date**. Serial after the hyphen is **manual**. Display year in Bangla digits on the certificate.

### 3.15 UX / dashboard

Bangla-first operator UI: নতুন সনদ, প্রাথমিক সেভ, চূড়ান্ত সেভ, অনুসন্ধান, সনদ ইতিহাস, Backup, Settings. Large controls, keyboard-friendly, desktop-first, responsive.

### 3.16 Browser target

Modern Chrome and Microsoft Edge. After first install/build, the app must work without Internet.

---

## 4. Technical Risks

### 4.1 Browser limitations (IndexedDB quota, private mode, eviction)

- **Why it matters:** IndexedDB is the V1 system of record. Photos, private windows, or Chromium storage eviction can lose office data.
- **Possible solutions:** Quota warnings; compress photos; backup reminders; `navigator.storage.persist()`; treat private mode as unsupported.
- **Recommended solution:** Request persistent storage on first run; resize/compress photos on upload; backup reminder in UI; hard warning if IndexedDB is unavailable.

### 4.2 Exact A4 pagination

- **Why it matters:** 20+ heir rows must paginate without clipped rows, missing borders, or signatures on the wrong page.
- **Possible solutions:** CSS `break-inside: avoid` only; measure-then-pack engine; fixed millimetre row heights.
- **Recommended solution:** A **measure-then-pack pagination engine**: measure rows at A4 content width, pack whole rows onto pages, render discrete page nodes. CSS break hints are a fallback, not the source of truth.

### 4.3 PDF generation (Bangla + layout)

- **Why it matters:** Most JS PDF text engines do not shape Bangla conjuncts correctly. A government certificate that prints correctly but PDFs incorrectly is a failure.
- **Possible solutions:** (a) pdf-lib/pdfmake with embedded TTF (poor shaping); (b) rasterize pre-paginated HTML pages; (c) Print → Save as PDF only; (d) WASM HarfBuzz + pdf-lib (high complexity).
- **Recommended solution:** **Paginated HTML is canonical.** “Save PDF” = high-DPI capture of each A4 page into a local PDF (`jspdf` + `html-to-image`). Browser **Print → Save as PDF** remains a supported high-fidelity path. No remote HTML-to-PDF. Revisit selectable-text PDF only if it becomes an explicit requirement.

### 4.4 DOCX generation

- **Why it matters:** Word is used in Union Parishad offices. HTML saved as `.doc` is not a real DOCX and will break tables/QR.
- **Possible solutions:** `docx` library; HTML paste; mammoth reverse.
- **Recommended solution:** Dedicated `docx` builder from the same document model (A4 section, tables, embedded QR PNG, embedded Bangla font). Accept that Word may reflow slightly vs browser print; match content and structure, then tune page breaks in Phase 6 against desktop Word.

### 4.5 Bangla font / rendering

- **Why it matters:** Missing local fonts produce broken conjuncts when offline.
- **Possible solutions:** System fonts only; Google Fonts CDN (violates offline); bundle OFL fonts.
- **Recommended solution:** Bundle **Noto Sans Bengali** (SIL OFL) in `/public/fonts`. `@font-face` in app and print CSS. Never fetch fonts from the network at runtime.

### 4.6 QR generation

- **Why it matters:** Online QR APIs leak certificate data and fail offline.
- **Possible solutions:** Local `qrcode`; remote chart APIs.
- **Recommended solution:** Local `qrcode` → PNG data URL. Payload built by `qrService` with a deny-list (NID, birth registration, customer mobile, chairman mobile). Unit-test the deny-list.

### 4.7 IndexedDB data safety

- **Why it matters:** Schema upgrades, failed transactions, or restore bugs can destroy office records.
- **Possible solutions:** Dexie versioned schema; transactions; export-before-migrate; checksums.
- **Recommended solution:** Dexie expand-only migrations; multi-table writes in transactions; never update `certificateSnapshots`; safety export before restore and before destructive schema change.

### 4.8 Multi-page table rendering

- **Why it matters:** Spec forbids splitting a row; header must repeat; signatures/QR only on last page.
- **Possible solutions:** One long table + CSS; per-page table clones from a page model.
- **Recommended solution:** Per-page table clones from the pagination engine; header on every page; `isLastPage` controls signature/QR.

### 4.9 Browser print differences (Chrome vs Edge, printer margins)

- **Why it matters:** Default printer margins can eat the 0.50 / 0.70 inch geometry.
- **Possible solutions:** `@page { margin: 0 }`; operator training; printer-specific CSS.
- **Recommended solution:** `@page { size: A4 portrait; margin: 0 }`; draw the ~0.70 in outer blank **inside** the page box; instruct operators to disable headers/footers. Phase 11 requires **real printer** tests.

### 4.10 Large local datasets

- **Why it matters:** Unindexed scans and loading all photos will freeze office PCs.
- **Possible solutions:** Load everything; paginated Dexie queries; photos in a side table.
- **Recommended solution:** Indexes on mobile, NID, status, ward, certificate date; list views without photo blobs; load photos only when editing/printing.

### 4.11 Backup compatibility

- **Why it matters:** A v3 backup restored into v5, or a corrupt file, can brick the office DB.
- **Possible solutions:** Unversioned dump; format version + migrations; reject unknown versions.
- **Recommended solution:** `gucms-backup` JSON envelope with `formatVersion`, `appSchemaVersion`, checksum, counts. Import validates then migrates forward. Future versions rejected with a clear Bangla error. Corrupt files never apply.

### 4.12 Historical certificate reproduction

- **Why it matters:** If reprint reads live person/settings, old certificates silently change.
- **Possible solutions:** Store foreign keys only; freeze a snapshot blob; freeze snapshot + template version.
- **Recommended solution:** Immutable `certificateSnapshots` with a **fully denormalized render payload** plus `templateVersionId`. Reprint uses snapshot only. Engine must render old template versions.

### 4.13 Additional risks

| Risk | Why it matters | Possible solutions | Recommended |
| --- | --- | --- | --- |
| Photo storage bloat | IndexedDB quota | Resize; optional photo | Max ~600px edge, JPEG ~0.7, Blob in `personPhotos` |
| Admin PIN in plaintext | Weak local protection | Plain PIN; hash+salt | Salted hash; rate-limit attempts |
| Bangla / digit search | NID/mobile mixed ০–৯ and 0–9 | Exact only; fold digits | NFC normalize + digit folding |
| `window.print` prints SPA chrome | Spec forbids UI print | Hide hacks; isolated root | Dedicated print root; hide `#app-shell` |
| Empty optional table cells | Unfinished-looking certificates | Hide text; hide column | Hide empty values; hide NID column if all heirs empty |
| Manual smarak collisions | Office register vs app | Auto serial; warn | Never auto-allocate serial; optional duplicate warning |
| Stale PWA cache | Operators keep old JS | skipWaiting; prompt | `vite-plugin-pwa` refresh prompt; already-cached app stays offline |
| Raster PDF not searchable | Text copy from PDF | Accept; HarfBuzz later | Document as known V1 tradeoff; Print-to-PDF available |
| Word reflow | DOCX pages ≠ browser pages | Match “where practical” | Content-complete DOCX; Phase 6 Word QA |
| Non-heir wording invented | Wrong official language | Placeholders; wait | Engine in Phase 4; freeze heir only; other types wait for approved text |

---

## 5. Technology stack

Aligned with the specification’s preferred stack. Alternatives were used only where Bangla / A4 / offline quality required it.

| Layer | Choice | Why |
| --- | --- | --- |
| UI library | **React 18** | Spec-preferred; fits forms + preview; maintainable |
| Language | **TypeScript** | Strong types for persons, snapshots, templates |
| Bundler | **Vite** | Fast local builds; PWA plugin; no server |
| Routing | **react-router-dom** | Simple office screens; no SSR (SSR needs a server) |
| Operator UI styling | **Tailwind CSS (built locally)** | Fast office UI; **not** used inside certificate/print DOM |
| Certificate / print CSS | **Dedicated CSS** (`src/print`) | Geometry must not depend on utility-class churn |
| Database | **IndexedDB via Dexie.js** | Spec-preferred; typed tables, compound indexes, transactions |
| UUID | **`crypto.randomUUID()`** | Browser-native; mobile is never PK |
| QR | **`qrcode`** | Local canvas/PNG; small; no network |
| PDF | **jspdf + html-to-image** on pre-paginated A4 pages | Preserves Chrome Bangla shaping; no remote conversion |
| DOCX | **`docx` (docx.js)** | Real OOXML; tables, images, A4, font embed; local |
| Fonts | **Bundled Noto Sans Bengali** | Offline Unicode Bangla; OFL |
| PWA | **vite-plugin-pwa (Workbox)** | Precache JS/CSS/fonts/icons after first load |
| Forms / validation | **react-hook-form + Zod** | Keyboard-heavy forms; same schemas for backup validation |
| Dates | **Small `bnDate` util** | ISO storage, Bangla digit display; no extra date library unless Phase 6 proves need |
| Unit tests | **Vitest + Testing Library** | Same Vite toolchain |
| E2E / print | **Playwright** | Chromium/Edge; print CSS and file fixtures |
| UI kit | **None (custom `src/ui`)** | Avoid MUI/Ant print conflicts and bundle weight |
| Backend | **None in V1** | Spec: no backend unless future online verification |

### Why each important runtime dependency is selected

- **dexie** — IndexedDB without hand-written IDB; schema versions; unique compound index `(mobileNormalized, relationCode)`.
- **qrcode** — Offline QR; we own the payload.
- **jspdf** — Assemble A4 pages into a downloadable PDF locally.
- **html-to-image** — Rasterize already-paginated HTML so Bangla matches the preview. Chosen for **visual fidelity**, not digital signatures.
- **docx** — Practical local DOCX builder with tables and images.
- **vite-plugin-pwa** — Service worker without a custom Workbox maze at start.
- **zod** — Validate settings, backups, template payloads; block corrupt restore.

Dev-only: TypeScript, Vite, Vitest, Playwright, Testing Library, ESLint, Tailwind.

**Explicitly rejected**

- Next.js / SSR / API routes — implies a server.
- Firebase / Supabase / Appwrite — online.
- Google Fonts CDN, remote QR APIs, cloud HTML-to-PDF — violate offline and privacy.
- `@react-pdf/renderer` / pdfmake as the **primary** Bangla renderer — conjunct shaping is unreliable.
- Mobile number as Dexie primary key — forbidden.

**Packages will not be installed in Phase 0.**

---

## 6. Database design (IndexedDB / Dexie)

Database name: `gucms`  
Primary keys: UUID strings (`crypto.randomUUID()`), except the settings singleton. **Never use mobile as PK.**

### 6.1 Entity overview

```
appSettings (1)
templateVersions (*)
wards (exactly 9) ──1:1── members
wards ──< villages
persons (*) ──0..1── personPhotos
persons (*) ──0..1── familyIdentities     // permanent only
persons (*) ──< temporaryRecords          // drafts / প্রাথমিক সেভ
persons (*) ──< certificates              // permanent finalized certs
certificates (1) ──1:1── certificateSnapshots (immutable)
backupMetadata (*)
auditEvents (*)
```

Logical foreign keys are enforced in services. IndexedDB has no SQL FK.

### 6.2 Tables

#### `appSettings`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Constant `'default'` (singleton PK) |
| `republicLine` | yes | Seed: গণপ্রজাতন্ত্রী বাংলাদেশ |
| `officeTitle` | yes | Seed: ঘোগাদহ ইউনিয়ন পরিষদ কার্যালয় |
| `unionName` | yes | |
| `postOffice` | yes | ডাকঘর |
| `upazila`, `district`, `postCode` | yes | |
| `addressLine` | yes | Seed: কুড়িগ্রাম সদর, কুড়িগ্রাম-৫৬০০ |
| `website`, `email` | optional | Header omits if empty |
| `chairmanName`, `chairmanMobile` | yes | Chairman mobile **is** printed |
| `smarakPrefixPattern` | yes | Default `ঘো.ইউ.পি/কুড়ি/সদর/{yyyy}-` |
| `adminPinSalt`, `adminPinHash` | optional until Phase 10 | Empty = unset |
| `schemaVersion` | yes | Mirrors Dexie version |
| `updatedAt` | yes | ISO |

Indexes: PK `id`.

#### `wards`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `wardNumber` | yes | 1–9, unique |
| `isActive` | yes | |
| `updatedAt` | yes | |

Indexes: `wardNumber` (unique), `isActive`.

#### `members`

One member per ward in V1 (spec: member name entered once per ward). Separate table so member identity is not a loose string on the ward row.

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `wardId` | yes | Unique (1:1 with ward) |
| `name` | yes | Copied onto certificates; never operator-typed |
| `isActive` | yes | |
| `updatedAt` | yes | |

Indexes: `wardId` (unique).

#### `villages`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `wardId` | yes | → `wards.id` |
| `name` | yes | |
| `nameNormalized` | yes | NFC + trim for search |
| `isActive` | yes | |
| `createdAt`, `updatedAt` | yes | |

Indexes: `wardId`, `nameNormalized`, `[wardId+nameNormalized]`.

#### `persons` (temporary and permanent people)

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | Internal person ID |
| `status` | yes | `TEMPORARY` \| `PERMANENT` |
| `name` | yes | |
| `fatherOrHusbandName` | yes | পিতা/স্বামীর নাম |
| `motherName` | optional | Omit on print if empty |
| `nidOrBirthReg` | optional | Indexed; omit on print if empty |
| `wardId`, `villageId` | yes for preview | |
| `notes` | optional | Internal, never printed |
| `createdAt`, `updatedAt` | yes | |

Indexes: `status`, `nidOrBirthReg`, `name`, `updatedAt`, `wardId`.

**Permanent records** = `persons.status === 'PERMANENT'` plus `familyIdentities`.  
**Temporary records** = `persons.status === 'TEMPORARY'` plus `temporaryRecords`.

#### `personPhotos`

| Field | Required | Notes |
| --- | --- | --- |
| `personId` | PK | Same as `persons.id` |
| `blob` | yes | JPEG Blob |
| `mimeType` | yes | |
| `updatedAt` | yes | |

No row ⇒ no photo and no empty photo box on print.

#### `familyIdentities`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `personId` | yes | Unique: one identity per permanent person |
| `mobileNormalized` | yes | Digits only; Bengali digits folded |
| `relationCode` | yes | Spec enum |
| `displayKey` | yes | `{mobile}-{relation}` |
| `createdAt` | yes | |

Indexes: `personId` (unique), `mobileNormalized`, **unique `[mobileNormalized+relationCode]`**.

No family row until Final Save.

#### `temporaryRecords` (safer than RAM — spec §11)

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `personId` | yes | TEMPORARY person (or in-progress edit) |
| `certificateType` | optional | Until type selected |
| `payload` | yes | JSON: date, smarak serial, heirs, extra fields |
| `status` | yes | `TEMPORARY` |
| `updatedAt` | yes | |

Indexes: `personId`, `updatedAt`, `status`.

#### `certificates`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `personId` | yes | |
| `certificateType` | yes | `HEIR` \| `CITIZENSHIP` \| `ATTESTATION` \| `UNEMPLOYMENT` \| `UNMARRIED` |
| `status` | yes | `FINALIZED` |
| `certificateDate` | yes | ISO date |
| `smarakPrefix` | yes | Resolved string including Bangla year |
| `smarakSerialManual` | yes | Operator-entered suffix |
| `templateVersionId` | yes | |
| `snapshotId` | yes | |
| `createdAt` | yes | |

Indexes: `personId`, `certificateType`, `certificateDate`, `[smarakPrefix+smarakSerialManual]`.

#### `certificateSnapshots` (immutable)

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `certificateId` | yes | Unique |
| `templateVersionId` | yes | |
| `frozen` | yes | JSON render payload (denormalized) |
| `qrPayload` | yes | Exact string encoded in QR |
| `createdAt` | yes | |

**Writes:** insert only. Application code must not `put`/`update` this table.

Indexes: `certificateId` (unique).

`frozen` must include at least: certificate type, person data, heir data, ward, village, member name, chairman name, chairman mobile, certificate date, smarak prefix, template version, QR payload, relevant configuration.

#### `templateVersions`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `certificateType` | yes | |
| `version` | yes | Integer, monotonic per type |
| `wordingHash` | yes | Hash of approved strings |
| `definition` | yes | Serializable template definition |
| `isActive` | yes | Current editor uses active version |
| `createdAt` | yes | |

Indexes: `[certificateType+version]` unique, `[certificateType+isActive]`.

#### `backupMetadata`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `kind` | yes | `MANUAL_EXPORT` \| `PRE_RESTORE_SAFETY` |
| `formatVersion` | yes | |
| `appSchemaVersion` | yes | |
| `checksum` | yes | SHA-256 of canonical payload |
| `recordCounts` | yes | JSON counts |
| `fileName` | yes | |
| `createdAt` | yes | |

#### `auditEvents` (lightweight)

| Field | Required | Notes |
| --- | --- | --- |
| `id` | PK UUID | |
| `at` | yes | |
| `action` | yes | e.g. `RESTORE`, `FINAL_SAVE`, `ADMIN_UNLOCK` |
| `entityType`, `entityId` | optional | |
| `detail` | optional | Avoid NID/mobile in detail |

Indexes: `at`, `action`.

### 6.3 Status fields

- Person: `TEMPORARY` | `PERMANENT`
- Temporary record: `TEMPORARY` (removed or consumed on final save)
- Certificate: `FINALIZED`
- Ward / member / village / template: `isActive`

### 6.4 Dexie index sketch

```
appSettings: 'id'
wards: 'id, wardNumber, isActive'
members: 'id, wardId'
villages: 'id, wardId, nameNormalized, [wardId+nameNormalized]'
persons: 'id, status, nidOrBirthReg, name, updatedAt, wardId'
personPhotos: 'personId'
familyIdentities: 'id, personId, mobileNormalized, [mobileNormalized+relationCode], displayKey'
temporaryRecords: 'id, personId, status, updatedAt'
certificates: 'id, personId, certificateType, certificateDate, snapshotId, [smarakPrefix+smarakSerialManual]'
certificateSnapshots: 'id, certificateId, templateVersionId'
templateVersions: 'id, certificateType, [certificateType+version], isActive'
backupMetadata: 'id, kind, createdAt'
auditEvents: 'id, at, action'
```

---

## 7. Data flow

```
[Operator UI]
    → feature hooks
        → services (person, family, certificate, settings, …)
            → Dexie transactions
                → IndexedDB

New person form
    → Primary Save
        → persons(TEMPORARY) + temporaryRecords(TEMPORARY)
    → Certificate type + Preview
        → template engine + pagination → HTML preview
        → print / pdf / docx adapters
    → Final Save (mobile + relation)
        → unique check [mobileNormalized+relationCode]
        → persons(PERMANENT) + familyIdentities
        → certificates + certificateSnapshots (insert-only)
        → temporaryRecords consumed

Search
    → familyIdentities by mobileNormalized (group)
    → persons by nidOrBirthReg (permanent only)
    → certificates by personId
    → reprint from snapshot only
```

UI components do not import Dexie. Pages do not contain PDF/DOCX/print generation logic.

---

## 8. Certificate architecture

### 8.1 Canonical document model

One in-memory model, produced by the template engine, consumed by four adapters:

```
CertificateDocument
  meta: type, templateVersionId, pageSize: A4, orientation
  pages[]: { pageIndex, pageCount, showSignatures, showQr, pageNumberLabel }
    blocks[]:
      header | bodyText | table | image | qr | signatureRow | spacer
```

Templates are **TypeScript modules in a registry**, not a visual designer in V1. Each template:

- Declares variables and optional/conditional rules
- Supplies approved wording (heir wording is frozen constants)
- Maps person + type-specific payload → `CertificateDocument`
- Has a `version` written to `templateVersions` on seed/upgrade

### 8.2 Same data → preview / print / PDF / DOCX (without extra frameworks)

| Output | Adapter | Notes |
| --- | --- | --- |
| Browser preview | `htmlRenderer` | Same CSS as print; A4 pages stacked |
| Print | `printService` | Isolated print root; `@media print`; hide app shell |
| PDF | `pdfService` | Each page node → PNG → jsPDF A4 page |
| DOCX | `docxService` | Blocks → Paragraph/Table/ImageRun; A4 section |

Pagination runs **once** (`paginationService.measureAndPack`) so preview, print, and PDF share page boundaries. DOCX uses the same packed tables and page-break hints; Word may still reflow slightly.

This is four **adapters**, not four template systems.

### 8.3 Engine features

| Feature | Mechanism |
| --- | --- |
| Variables | Typed substitution in template functions (not regex on HTML) |
| Conditional fields | Omit blocks/spans when empty (mother, NID, photo, website/email) |
| Tables / dynamic rows | `TableBlock` with `rows[]`; packed across pages |
| Images | Photo block omitted if no blob |
| QR | `QrBlock` only if `showQr` |
| Signatures | `SignatureRowBlock` only if `showSignatures` |
| Page breaks | New `pages[]` entry from packer |
| Page numbers | `পৃষ্ঠা {n}/{m}` on every page (Bangla digits) |
| Template versioning | `templateVersions` row; snapshot stores id + frozen definition copy |

---

## 9. Heir certificate architecture

Wording is copied from spec §20 and must not be edited without an explicit product change.

### 9.1 Approved body

> এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, [মৃত ব্যক্তির নাম], পিতা: [পিতার নাম], মাতা: [মাতার নাম]। তিনি অত্র ইউনিয়নের [ওয়ার্ড নম্বর] নং ওয়ার্ড-এর অন্তর্গত [গ্রামের নাম] গ্রামের বাসিন্দা ছিলেন।
>
> তিনি মৃত্যুকালে নিম্নে উল্লেখিত উত্তরাধিকারী/ওয়ারিশগণকে রেখে গেছেন।

If মাতার নাম is empty, the `মাতা: …` clause is omitted (no empty label). Do not insert the forbidden extra sentences.

### 9.2 Dynamic heir rows

`HeirRow`: `{ id, name, relationship, relationshipCustom?, nidOrBirthReg?, comment, commentCustom? }`

- New row default `relationship = 'পুত্র'`
- Dropdown: পুত্র, কন্যা, স্ত্রী, স্বামী, পিতা, মাতা, ভাই, বোন, অন্যান্য, নিজে লিখুন
- Custom text when `নিজে লিখুন`
- No age field in types, UI, print, PDF, or DOCX

### 9.3 Multiple wives / husbands

UI helpers insert ordered spouse labels into relationship (or comment, as the template UI chooses, per spec):

- ১ম স্ত্রী, ২য় স্ত্রী, ৩য় স্ত্রী, …
- ১ম স্বামী, ২য় স্বামী, ৩য় স্বামী, …

Count is unbounded. Operator can still use `নিজে লিখুন`.

### 9.4 First / second / third party children

Comment dropdown: প্রথম পক্ষের সন্তান, দ্বিতীয় পক্ষের সন্তান, তৃতীয় পক্ষের সন্তান, plus custom. **Shown only** when relationship is a child type (পুত্র / কন্যা). Unrelated heir types are not forced to pick a party.

### 9.5 Optional NID / Birth Registration

Combined column **জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর**. If empty for a row, no label is printed in that cell. If every heir on the certificate has an empty ID, hide the column.

### 9.6 Ward → Member automatic mapping

On ward change: resolve `members` by `wardId` and set member name read-only. Operator cannot type it.

### 9.7 QR

Offline PNG. Payload (minimum, no sensitive IDs): certificate type, deceased name, certificate date, heir names, relationships, smarak display string, union/office name. Exact string stored in snapshot. No NID, birth registration, customer mobile, chairman mobile, and no mandatory verification URL in V1.

### 9.8 Multi-page table and final-page-only signature/QR

Packer:

1. Measure header + each body row at A4 content width  
   (page width − 0.70 in × 2 − border − 0.50 in × 2).
2. Reserve footer band on last page (signatures + QR + chairman mobile).
3. Fill pages without splitting rows.
4. Repeat column header on every page.
5. Draw full border on every page.
6. `showSignatures` / `showQr` true **only** on last page.
7. Page label `পৃষ্ঠা ১/৩` style on all pages.

### 9.9 Signature layout (final page only)

```
[ ইউপি সদস্যের স্বাক্ষর ]     [ QR ]     [ চেয়ারম্যানের স্বাক্ষর ]
                                           chairmanName
                                           chairmanMobile
```

QR is bottom-center between the two signature blocks.

### 9.10 Header / smarak / date

Header from settings (seeded, not hard-coded in the template). Smarak = pattern with year from **selected certificate date** (default today, editable) + **manual** serial. Date stored on snapshot.

---

## 10. Print / PDF / DOCX / QR architecture

### 10.1 Print

- Geometry: A4 210×297 mm; outer inset ~0.70 in; border; inner 0.50 in content pad.
- `@page { size: A4 portrait; margin: 0; }`
- `#app-shell { display: none }` in print media; only `.certificate-print-root` visible.
- Each `.a4-page` is `width: 210mm; height: 297mm; page-break-after: always;` (last: auto).

### 10.2 PDF

`pdfService.generate(document, pageElements)`:

1. Wait for `document.fonts.ready`.
2. For each page element, `html-to-image` at 2×–3× scale.
3. jsPDF `format: 'a4', unit: 'mm'`, one image per page.
4. Trigger local file download. No upload.

### 10.3 DOCX

`docxService.generate(document)`:

- A4 page size; margins approximating 0.70 in outer + 0.50 in inner; border via table or page-border API.
- Bangla font embedded from `/public/fonts`.
- Heir table as `Table` with repeating header row property.
- QR as PNG `ImageRun`.
- Manual page breaks between packed pages where practical.

### 10.4 QR

`qrService.buildPayload(fields)` → string  
`qrService.toDataUrl(payload)` → PNG  
Deny-list enforced by unit tests.

---

## 11. Temporary and permanent storage lifecycle

```
New → Primary Save → Temporary → Certificate Preview → Final Save → Permanent
```

### 11.1 How temporary records are identified

- `persons.status === 'TEMPORARY'`
- Matching `temporaryRecords` row with `status === 'TEMPORARY'`
- UI badge: প্রাথমিক / অস্থায়ী
- Stored in IndexedDB, **not** React state alone

### 11.2 How permanent records are identified

- `persons.status === 'PERMANENT'`
- `familyIdentities` row present
- Zero or more `certificates` + `certificateSnapshots` (history grows over time)

### 11.3 Duplicate mobile + relation

On Final Save, query unique `[mobileNormalized+relationCode]`. If it exists: Bangla warning, do not overwrite. Operator may choose another relation.

### 11.4 How family members are grouped

All `familyIdentities` sharing `mobileNormalized` are one family. Mobile search returns the group. Persons remain separate UUID rows.

### 11.5 How historical certificates remain unchanged

Reprint path: `certificates.snapshotId` → `certificateSnapshots.frozen` + stored `qrPayload`. Renderer receives frozen payload, not live `persons` or live settings. Updating a person later only affects **new** certificates.

Preview before Final Save does **not** write snapshots.

---

## 12. Backup / restore

### 12.1 Export format

File: `gucms-backup-YYYYMMDD-HHmmss.json`

```json
{
  "kind": "gucms-backup",
  "formatVersion": 1,
  "appSchemaVersion": 1,
  "exportedAt": "ISO-8601",
  "checksum": "sha256-hex-of-canonical-payload",
  "payload": {
    "appSettings": {},
    "wards": [],
    "members": [],
    "villages": [],
    "persons": [],
    "personPhotos": [],
    "familyIdentities": [],
    "temporaryRecords": [],
    "certificates": [],
    "certificateSnapshots": [],
    "templateVersions": [],
    "backupMetadata": [],
    "auditEvents": []
  }
}
```

Photos as base64 inside `personPhotos`. `temporaryRecords` are included so drafts survive machine migration; they are documented as non-customer data.

Checksum covers canonicalized `payload` (sorted keys).

### 12.2 Import / versioning / validation

1. Parse JSON; require `kind === 'gucms-backup'`.
2. Reject `formatVersion` greater than the app’s supported version.
3. If `formatVersion` is older, run backup migrations forward.
4. Zod-validate every table.
5. Verify checksum.
6. Offer/create **safety backup** of current DB (download + `backupMetadata.kind = PRE_RESTORE_SAFETY`).
7. Restore in a Dexie transaction: **replace-all** (clear replaced stores then bulk add). UI must state this clearly in Bangla so operators do not expect a silent merge.
8. On any failure: abort; keep existing DB; show error; never partial-apply.

Corrupt file or checksum mismatch: never restore.

### 12.3 Compatibility

Forward migrations only. Older backups open in newer apps. Newer backups in older apps: reject with “এই ব্যাকআপ নতুন ভার্সনের। অ্যাপ আপডেট করুন।”

### 12.4 Why replace-all (recommended)

Merge-by-UUID can silently keep stale snapshots next to imported ones. Replace-all after a safety backup is the safer office workflow for a single-PC system of record. This is an explicit V1 decision, not an unstated shortcut.

---

## 13. Security

V1 is **local privacy**, not multi-user enterprise IAM.

- No personal data to third-party servers; no analytics SDKs.
- QR deny-list (tested).
- Customer mobile not rendered by any certificate adapter (HTML/print/PDF/DOCX).
- Admin settings behind PIN (Phase 10); operator routes cannot edit wards/union/templates.
- Backup validation; no silent DB overwrite without confirm + safety export.
- Snapshots immutable.
- Admin PIN stored as salted hash.
- Photos leave the machine only inside an operator-initiated backup file.

---

## 14. Performance

- Compound indexes for search (mobile, NID).
- Lists project without `personPhotos.blob`.
- Pagination engine caches last measurement for the same payload.
- No giant component libraries.
- PWA precache; no runtime CDN.
- Debounced village search after loading that ward’s villages.
- Target: form typing unblocked; typical heir preview (≤10 heirs) near-immediate after fonts ready.

---

## 15. Folder structure

Designed for this product’s document pipeline plus office features.

```
/
  SPECIFICATION.md
  IMPLEMENTATION_PLAN.md
  REQUIREMENTS_MATRIX.md
  README.md                         # Phase 1
  CHANGELOG.md                      # Phase 1
  PHASE_X_TEST_REPORT.md            # each phase
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  public/
    fonts/                          # Noto Sans Bengali
    icons/
    manifest.webmanifest
  src/
    main.tsx
    app/
      App.tsx
      router.tsx
      providers.tsx
      ErrorBoundary.tsx
    pages/
      DashboardPage.tsx
      NewCertificatePage.tsx
      TemporaryRecordsPage.tsx
      SearchPage.tsx
      HistoryPage.tsx
      PreviewPage.tsx
      SettingsPage.tsx
      BackupPage.tsx
      AdminPage.tsx
    features/
      settings/
      wards/
      members/
      villages/
      persons/
      family/
      temporaryRecords/
      certificates/
      heirs/
      admin/
      backup/
      search/
    templates/
      registry.ts
      types.ts
      wording/
        heirWording.ts              # frozen approved strings
      heir/
      citizenship/
      attestation/
      unemployment/
      unmarried/
    documents/
      model.ts
      pagination.ts
      htmlRenderer.tsx
    services/
      personService.ts
      familyService.ts
      certificateService.ts
      templateService.ts
      qrService.ts
      pdfService.ts
      docxService.ts
      printService.ts
      backupService.ts
      searchService.ts
      settingsService.ts
      auditService.ts
    db/
      schema.ts
      dexie.ts
      seeds.ts
      migrations.ts
    print/
      a4.css
      print.css
    qr/
      payload.ts
    ui/
    hooks/
    types/
    utils/                          # bnDigits, normalizeMobile, nidFold
    tests/
      unit/
      integration/
      e2e/
      fixtures/                     # Bangla test data
```

Services own Dexie access. Pages never import Dexie. Document generation lives under `documents/` and `services/`, not in page files.

---

## 16. Development phases

### Phase 0 — Analysis (this phase)

- **Objectives:** Inspect repo; analyze spec; write plan + matrix.
- **Files:** `SPECIFICATION.md`, `IMPLEMENTATION_PLAN.md`, `REQUIREMENTS_MATRIX.md`
- **Features:** None (no app)
- **Dependencies:** None installed
- **Tests:** Document completeness vs spec §§1–45
- **Acceptance:** Plan + matrix reviewed; no application code
- **Status:** Delivered; waiting for approval

### Phase 1 — Foundation

- **Objectives:** Vite + React + TS app shell, routing, Bangla UI kit, Dexie open, PWA/offline skeleton, error boundary, bundled fonts, persistent-storage request.
- **Files:** `package.json`, Vite/TS/PWA config, `src/app/*`, `src/ui/*`, `src/db/dexie.ts`, `public/fonts`, `README.md`, `CHANGELOG.md`
- **Features:** Dashboard placeholders with Bangla labels; no CDN
- **Dependencies:** react, react-dom, react-router-dom, typescript, vite, dexie, vite-plugin-pwa, tailwind (dev)
- **Tests:** App boots; router renders; IndexedDB opens; `npm run build` clean; index.html has no CDN
- **Acceptance:** Offline fonts; Bangla shell; Phase 1 test report

### Phase 2 — Database & Settings

- **Objectives:** Full schema; union/chairman; 9 wards; members 1:1; villages; ward → village map
- **Files:** `src/db/*`, `features/settings|wards|members|villages`, `settingsService`
- **Features:** Admin-capable settings screens (PIN stub until Phase 10; route-separated)
- **Dependencies:** Phase 1, zod
- **Tests:** Seed 9 wards + 9 members; village filter by ward; settings round-trip
- **Acceptance:** Configurable union block; member names stored per ward

### Phase 3 — Person Management

- **Objectives:** Person form, optional fields, photo resize, ward/village search, Primary Save, temporary list/resume/delete/clear-all
- **Files:** `features/persons`, `features/temporaryRecords`, `personService`
- **Features:** প্রাথমিক সেভ; TEMPORARY in IndexedDB
- **Dependencies:** Phase 2
- **Tests:** Reload restores draft; empty mother not required; photo optional; restart persistence
- **Acceptance:** Temporary records survive restart; excluded from permanent search

### Phase 4 — Certificate Template Engine

- **Objectives:** Registry, variables, conditionals, date, smarak, preview shell; heir wording constants present; other types layout-only with **unapproved placeholders**
- **Files:** `src/templates/*`, `documents/*`, `templateService`, `PreviewPage`
- **Features:** Type selection; fast HTML preview
- **Dependencies:** Phase 3
- **Tests:** Optional field omission; smarak year from date; template version seeded; heir wording golden file
- **Acceptance:** Switching types does not require a new architecture

### Phase 5 — Heir Certificate

- **Objectives:** Full heir UI + layout + QR + multi-page + signatures; approved wording only
- **Files:** `templates/heir/*`, `features/heirs`, `qr/*`, `print/*`
- **Features:** Default পুত্র; dropdowns; spouses; party children; member auto-map; pagination
- **Dependencies:** Phase 4, `qrcode`
- **Tests:** 1/4/10/20+ heirs; empty NID; no age column; forbidden sentences absent; QR deny-list
- **Acceptance:** Matches spec §§20–29 on preview

### Phase 6 — Print / PDF / DOCX

- **Objectives:** Print CSS; local PDF; local DOCX
- **Files:** `printService`, `pdfService`, `docxService`, `print/*.css`
- **Features:** Preview actions; app chrome excluded from print
- **Dependencies:** Phase 5, jspdf, html-to-image, docx
- **Tests:** Playwright print; PDF page count; DOCX OOXML; Bangla glyphs; chrome hidden
- **Acceptance:** A4, border, 0.50/0.70 in geometry, multi-page, QR, signatures, numbering

### Phase 7 — Permanent Save / Search / Family

- **Objectives:** Final Save; mobile+relation; grouping; NID + mobile search; reuse person
- **Files:** `familyService`, `searchService`, `SearchPage`
- **Features:** Duplicate warning; family group; search actions include preview/print/pdf/docx
- **Dependencies:** Phase 6
- **Tests:** Duplicate pair; same mobile different relations; ≥1000 fixture rows
- **Acceptance:** UUID PK; mobile not printed

### Phase 8 — Certificate History / Snapshots

- **Objectives:** Immutable snapshots; template versioning; reprint
- **Files:** `certificateService` snapshot path, `HistoryPage`
- **Features:** Edit person does not change old cert
- **Dependencies:** Phase 7
- **Tests:** Mutate person after finalize; reprint equals snapshot; frozen keys from spec §16
- **Acceptance:** Historical certificates remain reproducible

### Phase 9 — Backup / Restore

- **Objectives:** Export/import/validate/safety backup/restore
- **Files:** `backupService`, `BackupPage`, `backupMetadata`
- **Features:** Corrupt file rejection; Bangla errors; replace-all after safety export
- **Dependencies:** Phase 8
- **Tests:** Round-trip; checksum fail; safety file created; abort leaves DB intact
- **Acceptance:** Spec §34

### Phase 10 — Admin / Security

- **Objectives:** PIN gate; operator vs admin; validation hardening
- **Files:** `features/admin`, `auditService`
- **Features:** Operators cannot edit wards/union accidentally
- **Dependencies:** Phase 9
- **Tests:** Wrong PIN; route guard
- **Acceptance:** Spec §35, §38

### Phase 11 — Final QA

- **Objectives:** Build, unit, integration, UI, print, PDF, DOCX, offline, backup, performance, real printer
- **Files:** `PHASE_11_TEST_REPORT.md`
- **Features:** Defect fixes only
- **Dependencies:** All prior
- **Tests:** Spec §42 data matrix + §43 acceptance list; Chrome and Edge
- **Acceptance:** V1 complete only when §43 is true

**Rule:** Implement, test, write `PHASE_X_TEST_REPORT.md`, stop, wait for approval. Do not skip testing. Do not start the next phase without approval.

---

## 17. Testing strategy

| Layer | Tool | Focus |
| --- | --- | --- |
| Unit | Vitest | QR deny-list, optional-field omit, pagination packing, mobile normalize, backup checksum, heir wording constants |
| Component | Testing Library | Person form, heir table default পুত্র, duplicate warning |
| Integration | Vitest + fake-indexeddb | Dexie transactions, final save, snapshot immutability |
| E2E | Playwright Chromium/Edge | Offline after first load, search, preview |
| Print/PDF/DOCX | Playwright + fixtures | Page count, screenshots, `%PDF` / DOCX `PK` headers |
| Manual | Office PC + real printer | 0.50/0.70 in, Bangla, Edge vs Chrome |

Realistic Bangla fixtures per spec §42 (long names, 20+ heirs, all 9 wards, reload, restore).

Each phase writes `PHASE_X_TEST_REPORT.md`.

---

## 18. Risks and mitigations (summary)

See §4. Highest residual risks after recommended mitigations:

1. **Printer driver margins** — inner geometry + Phase 11 real-printer QA.
2. **PDF as raster** — visual match over selectable text; Print-to-PDF remains available.
3. **Word reflow vs browser pages** — DOCX content-complete; pagination “where practical.”
4. **Browser storage eviction** — persistent storage + backup reminders in the UI.
5. **Non-heir official wording missing from spec** — placeholders until the office approves text.

No requirement is dropped to avoid these risks.

---

## 19. Decisions that need awareness (not silent simplifications)

These are recommended, not hidden:

| Decision | Recommendation | Why |
| --- | --- | --- |
| PDF engine | Raster of paginated HTML | Bangla shaping reliability |
| Restore | Replace-all after safety backup | Avoid mixed UUID states |
| Members | Separate 1:1 table | Requested entity; cleaner mapping |
| Non-heir body text | Placeholder until approved | Spec only freezes heir wording |
| Operator CSS vs print CSS | Tailwind for UI only | Protect A4 geometry |
| Temporary data | IndexedDB `TEMPORARY` + `temporaryRecords` | Spec §11 safer approach |

---

## 20. Out of scope for V1 (explicit)

- Online verification URL / central government portal
- Backend, multi-device realtime sync
- Using mobile number as database primary key
- Auto-allocation of smarak serial
- Age column on heir table
- Changing approved heir wording
- CDN or cloud conversion
- Implementing Phase 1 in the same change set as this plan
- Inventing official wording for non-heir certificates

---

## 21. Approval gate

**Phase 0 is complete when this plan and `REQUIREMENTS_MATRIX.md` are reviewed.**

Do not start Phase 1 until explicit approval.

Do not install application packages.  
Do not create React components.  
Do not implement the certificate engine.
