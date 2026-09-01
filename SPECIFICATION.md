# Ghogadaha Union Certificate Management System — V1
## AI Coding Specification & Phase-by-Phase Development Plan

**Project:** Ghogadaha Union Parishad Certificate Management System  
**Location:** Ghogadaha Union Parishad, Kurigram Sadar, Kurigram, Bangladesh  
**Version:** V1  
**Architecture:** Offline-first, local browser application  
**Primary language:** Bangla  
**Target:** Office desktop/laptop browser, with responsive support

---

# 1. PRODUCT OBJECTIVE

Build a fast, reliable, offline-first browser application for managing and generating Union Parishad certificates.

The system will contain reusable certificate templates such as:

- উত্তরাধিকার/ওয়ারিশ সনদ
- নাগরিকত্ব সনদ
- প্রত্যয়ন পত্র
- বেকারত্ব সনদ
- অবিবাহিত সনদ
- ভবিষ্যতে অন্যান্য সনদ

A person's common information should be entered once. The operator can then select a certificate type and generate the appropriate certificate without re-entering the same information.

The application must prioritize:

1. Speed
2. Reliability
3. Offline operation
4. Data safety
5. Accurate Bangla rendering
6. A4 print quality
7. PDF/DOCX generation
8. Simple office workflow
9. Maintainability
10. Future extensibility

---

# 2. IMPORTANT DEVELOPMENT RULE

The application MUST NOT be developed as one giant implementation.

Development must follow:

1. Requirements analysis
2. Architecture plan
3. Foundation
4. Database/settings
5. Person management
6. Certificate engine
7. Heir certificate
8. Print/PDF/DOCX
9. Permanent save/search/history
10. Backup/restore
11. Security/admin
12. Final QA

Each phase must be implemented, tested, reviewed and documented before proceeding.

---

# 3. OFFLINE-FIRST REQUIREMENT

Core functionality must work without Internet.

Do not depend on:

- Online APIs
- Cloud database
- Remote PDF conversion
- Remote DOCX conversion
- Remote QR generation
- Remote fonts
- CDN-only dependencies

All important assets and application logic must be available locally.

The application should continue working when Internet access is completely unavailable.

A PWA/offline cache may be used where appropriate.

---

# 4. RECOMMENDED TECHNOLOGY

Preferred stack:

- React
- TypeScript
- Vite
- IndexedDB
- Dexie.js
- Local QR generation library
- Local PDF generation
- Local DOCX generation
- CSS print layout
- PWA/offline caching where useful

The AI may recommend an alternative if there is a clear technical reason.

Do not introduce a backend unless required by a future online verification system. V1 must remain fully functional offline.

---

# 5. APPLICATION ARCHITECTURE

Use modular architecture.

Suggested services:

- personService
- familyService
- certificateService
- templateService
- qrService
- pdfService
- docxService
- printService
- backupService
- searchService
- settingsService
- audit/history service

Do not place database logic directly inside UI components.

Do not place document-generation logic directly inside large pages.

Use strong TypeScript types.

---

# 6. UNION/ADMIN SETTINGS

The following information is entered once in Settings:

- ইউনিয়নের নাম
- ডাকঘর
- উপজেলা
- জেলা
- পোস্ট কোড
- Website
- Email
- চেয়ারম্যানের নাম
- চেয়ারম্যানের মোবাইল নম্বর

For the current application:

**গণপ্রজাতন্ত্রী বাংলাদেশ**  
**ঘোগাদহ ইউনিয়ন পরিষদ কার্যালয়**  
**কুড়িগ্রাম সদর, কুড়িগ্রাম-৫৬০০**  
Website: `ghogadaha.kurigram.gov.bd`  
Email: `ghogadahaup@gmail.com`

However, these should be configurable rather than hard-coded wherever practical.

Chairman's mobile number is displayed on the certificate.

---

# 7. WARD CONFIGURATION

There are exactly 9 wards.

For each ward, the administrator enters:

- Ward number
- Member name

Ward numbers:

1–9

The member mapping is entered once.

When an operator selects a ward in a certificate, the corresponding member name is automatically selected.

The operator must not manually type the member name in the certificate.

---

# 8. VILLAGE CONFIGURATION

Each village must be associated with a ward.

Workflow:

1. Select Ward 1–9.
2. Village dropdown displays only villages belonging to that ward.
3. A search bar is available below/near the village dropdown.
4. Search is local and fast.

The village database is configurable by the administrator.

---

# 9. PERSON INFORMATION

Common person information may include:

- নাম
- পিতা/স্বামীর নাম
- মাতার নাম — optional
- জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন নম্বর — optional
- ছবি — optional
- ওয়ার্ড
- গ্রাম
- Other certificate-specific information

Important:

## Mobile number

Mobile number is NOT displayed on the certificate.

Mobile number is used only for permanent customer identity/search.

---

# 10. OPTIONAL FIELD RULES

If the following fields are empty, their labels and values must not appear in the printed certificate:

- মাতার নাম
- জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন নম্বর
- জন্ম নিবন্ধন নম্বর
- ছবি
- Any other optional field

Do not leave empty labels.

Example:

Wrong:

`মাতার নাম:`

Correct:

Nothing is rendered if the value is empty.

---

# 11. PRIMARY SAVE

The operator can press:

**প্রাথমিক সেভ**

after filling the person's information.

Primary-save records are temporary working records.

Recommended safer implementation:

Store them locally with status:

`TEMPORARY`

rather than relying only on volatile in-memory storage.

This protects against accidental browser crashes or reloads.

Temporary records should be clearly marked.

The UI should allow:

- View temporary records
- Resume editing
- Delete temporary record
- Clear all temporary records

Primary save is NOT permanent customer storage.

---

# 12. CERTIFICATE SELECTION

After entering/saving person data:

1. Select certificate type.
2. Click Preview/Print.
3. Certificate preview appears immediately or as quickly as technically possible.
4. From preview the operator can:
   - Print
   - Save PDF
   - Save DOCX

---

# 13. FINAL SAVE

Final Save is separate from Primary Save.

When the operator clicks:

**চূড়ান্ত সেভ**

the application asks for:

- Mobile number
- Relation extension

The mobile number becomes the family/customer search identifier, but NOT the database primary key.

Use an internal UUID/person ID as the real database primary key.

---

# 14. FAMILY IDENTITY

A single mobile number may represent multiple family members.

The user-facing unique identity is:

`mobile + "-" + relation`

Examples:

- `017XXXXXXXX-own`
- `017XXXXXXXX-spouse`
- `017XXXXXXXX-son`
- `017XXXXXXXX-daughter`

Possible relationship extensions:

- own
- spouse
- son
- daughter
- father
- mother
- brother
- sister
- other

If the same mobile number already exists:

Do not overwrite the existing person.

Allow another relation extension.

If the same mobile + relation already exists, show a clear duplicate warning.

---

# 15. PERMANENT SEARCH

There is a separate search feature.

Search options:

1. Mobile number
2. NID/Birth Registration number

Mobile search should group all family members belonging to the same mobile number.

Search results should allow:

- Open person
- View certificate history
- Preview certificate
- Print
- PDF
- DOCX

Search must remain fast with thousands of records.

---

# 16. HISTORICAL CERTIFICATE SNAPSHOT

When a certificate is finalized/generated, preserve a snapshot containing enough information to reproduce the certificate later.

Snapshot should include:

- Certificate type
- Person data
- Heir data
- Ward
- Village
- Member name
- Chairman name
- Chairman mobile
- Certificate date
- Smarak prefix
- Template version
- QR payload
- Relevant certificate configuration

Changing the current person information later must NOT change an old finalized certificate.

---

# 17. SMARAK NUMBER

The certificate should display:

`ঘো.ইউ.পি/কুড়ি/সদর/YYYY-`

The serial portion after the hyphen is entered manually according to the office register.

Do NOT force the operator to enter the manual serial suffix as part of the automatic numbering system.

The year should come from the selected certificate date.

---

# 18. DATE

Certificate date:

- Defaults to current date.
- Can be edited manually.
- The final selected date is stored in the certificate snapshot.

---

# 19. CERTIFICATE TEMPLATE ENGINE

Do not create every certificate as one unrelated hard-coded page.

Build a reusable template system supporting:

- Variables
- Conditional fields
- Dynamic tables
- Dynamic rows
- Images
- Signature blocks
- QR code
- Page breaks
- Page numbering
- Template versions

Initial certificate templates:

1. উত্তরাধিকার/ওয়ারিশ সনদ
2. নাগরিকত্ব সনদ
3. প্রত্যয়ন পত্র
4. বেকারত্ব সনদ
5. অবিবাহিত সনদ

Future templates should be addable without rewriting the whole application.

---

# 20. APPROVED HEIR CERTIFICATE CONTENT

The inheritance certificate must follow the approved format.

Header:

**গণপ্রজাতন্ত্রী বাংলাদেশ**  
**ঘোগাদহ ইউনিয়ন পরিষদ কার্যালয়**  
**কুড়িগ্রাম সদর, কুড়িগ্রাম-৫৬০০**

Website and email may appear in the header according to the final UI design.

Smarak:

`ঘো.ইউ.পি/কুড়ি/সদর/২০২৬-`

Date is editable.

Title:

**উত্তরাধিকার/ওয়ারিশ সনদ**

Body should use:

"এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, [মৃত ব্যক্তির নাম], পিতা: [পিতার নাম], মাতা: [মাতার নাম]। তিনি অত্র ইউনিয়নের [ওয়ার্ড নম্বর] নং ওয়ার্ড-এর অন্তর্গত [গ্রামের নাম] গ্রামের বাসিন্দা ছিলেন।

তিনি মৃত্যুকালে নিম্নে উল্লেখিত উত্তরাধিকারী/ওয়ারিশগণকে রেখে গেছেন।"

Do NOT separately add:

"তিনি মৃত্যুবরণ করেছেন"

Do NOT add:

"উক্ত সনদটি প্রয়োজনীয় কাজে ব্যবহারের জন্য প্রদান করা হলো।"

---

# 21. HEIR TABLE

Columns:

| ক্র. নং | নাম | মৃতের সাথে সম্পর্ক | জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর | মন্তব্য |

There is NO age column.

---

# 22. HEIR RELATIONSHIP

Default relationship for every newly added row:

**পুত্র**

The operator can change it.

Dropdown should support:

- পুত্র
- কন্যা
- স্ত্রী
- স্বামী
- পিতা
- মাতা
- ভাই
- বোন
- অন্যান্য
- নিজে লিখুন

Custom relationship text should be possible.

---

# 23. MULTIPLE SPOUSES

If a deceased person has multiple wives/husbands, support:

- ১ম স্ত্রী
- ২য় স্ত্রী
- ৩য় স্ত্রী
- ...
- ১ম স্বামী
- ২য় স্বামী
- ৩য় স্বামী

The appropriate spouse order can be represented in the relationship or comment according to the template UI.

---

# 24. CHILD PARTY

For children of different spouses/parties, the comment field should support:

- প্রথম পক্ষের সন্তান
- দ্বিতীয় পক্ষের সন্তান
- তৃতীয় পক্ষের সন্তান
- etc.

Use dropdown where appropriate, with custom input if needed.

Do not force irrelevant party selection for unrelated heir types.

---

# 25. HEIR ID NUMBER FIELD

The heir identity field is:

**জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর**

If empty:

- The field must not appear for that heir in the printed certificate.
- Avoid unnecessary empty table content where technically possible.

---

# 26. SIGNATURE AREA

At the bottom of the final certificate page:

LEFT:
**ইউপি সদস্যের স্বাক্ষর**

CENTER:
QR Code

RIGHT:
**চেয়ারম্যানের স্বাক্ষর**

Chairman's name and mobile number are displayed in the chairman block.

The QR is positioned at the bottom center between the two signature blocks.

---

# 27. QR CODE

QR must work offline.

QR should contain only minimum necessary certificate verification information.

Recommended payload:

- Certificate type
- Deceased person's name
- Certificate date
- Heir names
- Relationships
- Appropriate non-sensitive certificate information

Do NOT put these into the QR:

- NID
- Birth registration number
- Customer mobile number
- Chairman mobile number
- Unnecessary sensitive information

The exact QR payload should be stored in the certificate snapshot.

Future V2 may support an official online verification URL, but V1 must not require Internet.

---

# 28. A4 PRINT SPECIFICATION

Certificate output:

- A4
- Portrait
- Intended content margin: 0.50 inch
- Certificate border
- Approximately 0.70 inch blank area outside the border
- Correct page breaks
- No clipping
- No overflow
- Correct Bangla rendering

The visual layout should be tested using real printers.

---

# 29. MULTI-PAGE HEIR CERTIFICATE

If the number of heirs is large:

- Automatically create multiple pages.
- Show page numbering such as:
  - পৃষ্ঠা ১/৩
  - পৃষ্ঠা ২/৩
  - পৃষ্ঠা ৩/৩

Rules:

- Never split a table row across pages.
- Repeat table header on every page.
- Border on every page.
- Signature blocks only on final page.
- QR only on final page.
- Page numbering on each page.

---

# 30. PREVIEW

Preview must be fast.

The operator should see the final A4 layout as close as possible to printed output.

Main actions:

- Print
- Save PDF
- Save DOCX
- Close preview

Do not create unnecessary loading screens.

---

# 31. PDF

PDF must be generated locally.

No online conversion service.

Must support:

- A4
- Bangla
- Multi-page
- Tables
- QR
- Borders
- Signatures
- Page numbering

---

# 32. DOCX

DOCX must be generated locally.

Must support:

- A4 page size
- Bangla
- Dynamic tables
- Dynamic heir rows
- QR image
- Signature blocks
- Page breaks where practical

Do not assume browser HTML automatically produces a correct DOCX.

Use a dedicated DOCX generation layer.

---

# 33. PRINT

Use dedicated print CSS.

Application UI must not print.

Print should preserve:

- A4
- Border
- Page breaks
- Bangla text
- Tables
- QR
- Signatures
- Page numbers

---

# 34. BACKUP AND RESTORE

Create offline backup/restore.

Backup must include:

- Settings
- Wards
- Villages
- Permanent persons
- Family identity mappings
- Certificate history
- Template versions
- QR payloads
- Other essential application data

Backup should be versioned and validated.

Before destructive restore, create or offer a safety backup.

Restore must not silently corrupt existing data.

---

# 35. ADMIN SETTINGS

Create an administration/settings area for:

- Union information
- Chairman
- Chairman mobile
- Ward/member mapping
- Village data
- Certificate templates
- Backup/restore
- Application configuration

Do not allow normal certificate operators to accidentally modify administrative data.

A lightweight local admin protection mechanism may be used.

---

# 36. USER EXPERIENCE

The UI is for office operators.

Priorities:

- Bangla-first
- Simple
- Fast
- Clear
- Large enough controls
- Keyboard-friendly
- Desktop-friendly
- Responsive

Dashboard should provide:

- নতুন সনদ
- প্রাথমিক সেভ
- চূড়ান্ত সেভ
- অনুসন্ধান
- সনদ ইতিহাস
- Backup
- Settings

---

# 37. PERFORMANCE

Optimize for low/medium office computers.

Avoid:

- Unnecessary re-renders
- Huge dependencies
- Remote network requests
- Blocking UI operations
- Repeated database scans

Use indexes for search fields.

Target fast form interaction and near-immediate preview preparation.

---

# 38. SECURITY AND PRIVACY

Sensitive personal information must stay local in V1.

Do not send personal data to third-party servers.

Do not expose NID or birth registration data in QR.

Do not display customer mobile number on certificates.

Validate imported backup files.

Prevent accidental overwrite.

---

# 39. BROWSER COMPATIBILITY

Primary target:

- Modern Chrome
- Microsoft Edge

The app should work without Internet after initial installation/build.

---

# 40. PROJECT DOCUMENTATION

Maintain:

- README.md
- IMPLEMENTATION_PLAN.md
- REQUIREMENTS_MATRIX.md
- PHASE_X_TEST_REPORT.md
- CHANGELOG.md

Do not remove requirements from documentation.

---

# 41. PHASE PLAN

## Phase 0 — Analysis

Deliver:

- IMPLEMENTATION_PLAN.md
- REQUIREMENTS_MATRIX.md

No application implementation.

## Phase 1 — Foundation

Implement:

- React/TypeScript/Vite
- App shell
- Routing
- UI system
- IndexedDB foundation
- Offline foundation
- Error handling

## Phase 2 — Settings and Database

Implement:

- Union settings
- Chairman
- Chairman mobile
- 9 wards
- Members
- Villages
- Ward → village mapping

## Phase 3 — Person Management

Implement:

- Person form
- Optional fields
- Photo
- Ward/village
- Temporary save
- Temporary management

## Phase 4 — Certificate Engine

Implement:

- Certificate selection
- Reusable template system
- Conditional fields
- Date
- Smarak
- Preview

## Phase 5 — Heir Certificate

Implement:

- Heir table
- Relationships
- Multiple spouses
- Party children
- Member mapping
- Signature layout
- QR
- Multi-page

## Phase 6 — Output

Implement:

- Print
- PDF
- DOCX

## Phase 7 — Permanent Storage

Implement:

- Final save
- Mobile + relation identity
- Family grouping
- NID search
- Mobile search
- Certificate history

## Phase 8 — Snapshot and History

Implement:

- Immutable finalized snapshots
- Template versioning
- Reprint

## Phase 9 — Backup

Implement:

- Export
- Import
- Validation
- Safety backup
- Restore

## Phase 10 — Admin/Security

Implement:

- Admin settings protection
- Data validation
- Local security improvements

## Phase 11 — Final QA

Perform:

- Build test
- Unit tests
- Integration tests
- UI tests
- Print tests
- PDF tests
- DOCX tests
- Offline tests
- Backup/restore tests
- Performance tests

---

# 42. TEST DATA

Use realistic Bangla test data.

Test:

- Short names
- Very long names
- Long village names
- Empty mother name
- Empty NID
- Missing photo
- 1 heir
- 4 heirs
- 10 heirs
- 20+ heirs
- Multiple wives
- Multiple husbands
- Children from multiple parties
- All 9 wards
- Duplicate mobile + relation
- Same mobile with different relations
- Browser reload
- Browser restart
- Backup/restore
- Old certificate reproduction

---

# 43. ACCEPTANCE CRITERIA

V1 is considered complete only when:

- Application works offline.
- Data is stored locally.
- Permanent records survive browser restart.
- Search works.
- Person data can be reused.
- Certificate templates work.
- Optional fields disappear when empty.
- Ward automatically maps to member.
- Heir certificate follows approved format.
- No age column exists.
- Default heir relationship is পুত্র.
- Multiple spouses/party children are supported.
- QR works offline.
- QR does not expose NID/mobile.
- A4 print works.
- Multi-page heir certificate works.
- Page numbering works.
- Signatures are correctly positioned.
- Chairman mobile is displayed.
- PDF works.
- DOCX works.
- Backup/restore works.
- Historical certificates remain reproducible.
- No major TypeScript/build/runtime errors remain.

---

# 44. CRITICAL AI CODING RULES

The coding AI must:

1. Read all project documentation before modifying architecture.
2. Never silently remove requirements.
3. Never invent online dependencies.
4. Never use a remote service for core V1 functionality.
5. Never expose sensitive data unnecessarily.
6. Never overwrite permanent records silently.
7. Never change finalized certificate snapshots.
8. Test after every phase.
9. Fix errors before proceeding.
10. Stop after each phase and wait for approval.
11. Prefer simple maintainable code over unnecessary complexity.
12. Explain technically risky decisions.
13. Keep documentation synchronized with implementation.
14. Use Bangla UI labels.
15. Preserve exact approved certificate wording unless a change is explicitly approved.

---

# 45. FINAL DEVELOPMENT WORKFLOW

The operator/developer should use this sequence:

1. Upload this file as `SPECIFICATION.md`.
2. Give the Phase 0 prompt.
3. Review `IMPLEMENTATION_PLAN.md`.
4. Review `REQUIREMENTS_MATRIX.md`.
5. Ask an external reviewer/AI to inspect the plan if desired.
6. Give Phase 1 prompt.
7. Run Phase Review prompt.
8. Approve Phase 2.
9. Continue sequentially.
10. Never skip testing.
11. Before deployment, run full Phase 11 QA.

