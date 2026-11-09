# Graph Report - khodroyab  (2026-11-09)

## Corpus Check
- 295 files · ~213,503 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 1905 nodes · 6161 edges · 74 communities (68 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da033940`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- CarsManager
- CurrencyRates.tsx
- (panel)/ads/page.tsx
- AdsManager.tsx
- user.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- sale-ads/actions.ts
- images/actions.ts
- colors/actions.ts
- brands/actions.ts
- panel-search.ts
- car-form/actions.ts
- formatPersianNumber
- admin/auth-actions.ts
- CarOffersView.tsx
- lib/price-table.ts
- uploads.ts
- MyPriceTableManager.tsx
- verification-submission.ts
- session.ts
- SaleTermsManager.tsx
- khodroyab-data.ts
- toPersianDigits
- AdminShell.tsx
- adminActionDenied
- price-table-shared.ts
- panel/auth-actions.ts
- SaleAdFormModal.tsx
- server-only
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- next
- admins/actions.ts
- price-list/page.tsx
- users/actions.ts
- cn
- user-auth.ts
- sponsors/actions.ts
- normalizeDigits
- ThemeSwitch.tsx
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- guards.ts
- middleware.ts
- react
- dependencies
- scripts
- car-types/actions.ts
- Toast
- lib/system-settings.ts
- AdExtraFields.tsx
- VerificationManager.tsx
- PasswordChangeForm.tsx
- isTrustedOrigin
- app/layout.tsx
- devDependencies
- seed.mjs
- cars/page.tsx
- user-codes.ts
- profile/page.tsx
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- tailwindcss
- UPLOAD_DIR env
- BrandsManager

## God Nodes (most connected - your core abstractions)
1. `cn()` - 237 edges
2. `react` - 170 edges
3. `toPersianDigits()` - 170 edges
4. `lucide-react` - 126 edges
5. `next` - 120 edges
6. `prisma` - 59 edges
7. `formatPersianNumber()` - 58 edges
8. `isTrustedOrigin()` - 50 edges
9. `Toast()` - 42 edges
10. `requireAdminAccess()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAllAdsPage()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/cars.ts
- `AdminAllAdsPage()` --indirect_call--> `colorToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/colors.ts
- `AdminAllAdsPage()` --indirect_call--> `userCarToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/user-cars.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Dusk/dark marketing imagery with orange light accents** — public_images_road_coastal_image, public_images_safe_delivery_image, public_images_showroom_freezone_image, concept_dark_orange_visual_identity [INFERRED 0.75]
- **Consistent dark-studio, orange-accent premium car imagery set** — public_images_car_headlight_macro_image, public_images_car_sedan_exec_image, public_images_car_suv_luxury_image [INFERRED 0.85]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]
- **Shared dark/orange-accent marketing photography set** — public_images_hero_car_image, public_images_interior_cockpit_image, public_images_quality_engine_image, concept_dark_orange_visual_identity [INFERRED 0.95]

## Communities (74 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.09
Nodes (53): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+45 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.14
Nodes (19): ProfileEditFormProps, ActionTile(), CompletionRing(), formatJalali(), formatMobile(), getInitials(), InfoGroup(), InfoRow() (+11 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (22): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+14 more)

### Community 3 - "CarsManager"
Cohesion: 0.12
Nodes (25): createCarAction(), deleteCarAction(), guardRequest(), isPrismaCode(), updateCarAction(), CarFormModal(), handleSubmit(), CarsManager() (+17 more)

### Community 4 - "CurrencyRates.tsx"
Cohesion: 0.10
Nodes (26): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), CountdownRing(), CURRENCIES, CurrencyRates() (+18 more)

### Community 5 - "(panel)/ads/page.tsx"
Cohesion: 0.10
Nodes (26): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+18 more)

### Community 6 - "AdsManager.tsx"
Cohesion: 0.12
Nodes (26): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsTableProps, AdStatusBadgeProps (+18 more)

### Community 7 - "user.ts"
Cohesion: 0.10
Nodes (26): zod, PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), isValidNationalCode(), optionalDigits() (+18 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.16
Nodes (19): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationManagerProps, ALLOWED_IMAGE_MIME_TYPES, VERIFICATION_DOC_HINTS (+11 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "sale-ads/actions.ts"
Cohesion: 0.06
Nodes (71): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+63 more)

### Community 11 - "images/actions.ts"
Cohesion: 0.21
Nodes (16): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic, metadata (+8 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.14
Nodes (22): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+14 more)

### Community 13 - "brands/actions.ts"
Cohesion: 0.14
Nodes (21): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+13 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.05
Nodes (62): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), AdDetailViewProps (+54 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.14
Nodes (23): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+15 more)

### Community 16 - "formatPersianNumber"
Cohesion: 0.07
Nodes (55): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep() (+47 more)

### Community 17 - "admin/auth-actions.ts"
Cohesion: 0.18
Nodes (16): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), Bucket, buckets (+8 more)

### Community 18 - "CarOffersView.tsx"
Cohesion: 0.12
Nodes (29): dynamic, generateMetadata(), PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), sortOffers() (+21 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.10
Nodes (27): AdminUserProfilePage(), dynamic, metadata, PageProps, parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic (+19 more)

### Community 20 - "uploads.ts"
Cohesion: 0.12
Nodes (23): dynamic, GET(), notFound(), RouteContext, runtime, buildHeaders(), dynamic, GET() (+15 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (33): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+25 more)

### Community 22 - "verification-submission.ts"
Cohesion: 0.10
Nodes (20): AdminSubmitVerificationResult, ReviewVerificationResult, SubmitVerificationResult, isValidCompanyNationalId(), faDateTime, saveVerificationFile(), isVerificationPersonType(), VERIFICATION_REJECT_REASON_MAX (+12 more)

### Community 23 - "session.ts"
Cohesion: 0.24
Nodes (14): jose, getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience (+6 more)

### Community 24 - "SaleTermsManager.tsx"
Cohesion: 0.29
Nodes (8): inputClassName(), SaleTermFormModal(), SaleTermFormModalProps, SaleTermsManagerProps, SaleTermsTable(), SaleTermsTableProps, MyAdFormProps, SaleTermRecord

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.07
Nodes (45): framer-motion, AboutPage(), ICON_MAP, ContactPage(), LicensesPage(), HomePage(), ICON_MAP, BODY_TYPES (+37 more)

### Community 26 - "toPersianDigits"
Cohesion: 0.13
Nodes (26): AdsTable(), AdStatusBadge(), BrandsTable(), CarTypesTable(), CarsTable(), CarsTableProps, OptionsTable(), OptionsTableProps (+18 more)

### Community 27 - "AdminShell.tsx"
Cohesion: 0.10
Nodes (26): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+18 more)

### Community 28 - "adminActionDenied"
Cohesion: 0.18
Nodes (15): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, inputClassName(), SettingCard(), SystemSettingsForm() (+7 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (25): guardRequest(), parseBigInt(), saveMyPriceTableAction(), formatUsd(), digitsOnly(), isValidTierYear(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS (+17 more)

### Community 30 - "panel/auth-actions.ts"
Cohesion: 0.16
Nodes (19): getClientIp(), loginUserAction(), logoutUserAction(), registerUserAction(), UserLoginActionResult, UserRegisterActionResult, metadata, PanelLoginPage() (+11 more)

### Community 31 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (22): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, FieldError(), inputClassName() (+14 more)

### Community 32 - "server-only"
Cohesion: 0.14
Nodes (22): server-only, CarActionResult, CarSimpleActionResult, STALE_RELATION_RESULT, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult (+14 more)

### Community 33 - "price-list.ts"
Cohesion: 0.16
Nodes (24): CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices(), lowestPricesByColumn() (+16 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.27
Nodes (14): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+6 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.12
Nodes (17): PanelAppLayout(), ConsultationFab(), findActivePanelItem(), PANEL_NAV_ITEMS, PanelNavItem, panelNavItemsFor(), PanelLogo(), PanelLogoProps (+9 more)

### Community 36 - "next"
Cohesion: 0.19
Nodes (16): next, EditAdPage(), NewAdDetailsPage(), dynamic, metadata, NewAdCarPage(), dynamic, metadata (+8 more)

### Community 37 - "admins/actions.ts"
Cohesion: 0.06
Nodes (76): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+68 more)

### Community 38 - "price-list/page.tsx"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+1 more)

### Community 39 - "users/actions.ts"
Cohesion: 0.13
Nodes (32): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+24 more)

### Community 40 - "cn"
Cohesion: 0.13
Nodes (19): react-dom, AdminFormModal(), FieldError(), inputClassName(), PageLink(), inputClassName(), CarFormModalProps, inputClassName() (+11 more)

### Community 41 - "user-auth.ts"
Cohesion: 0.17
Nodes (22): changePasswordAction(), guardRequest(), PasswordActionResult, ProfileActionResult, revalidateProfilePages(), updateProfileAction(), handleSubmit(), authenticateAdmin() (+14 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.14
Nodes (31): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+23 more)

### Community 43 - "normalizeDigits"
Cohesion: 0.11
Nodes (20): normalizeYear(), SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS, normalizeDigits(), MAX_IMAGE_SIZE_BYTES, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX (+12 more)

### Community 44 - "ThemeSwitch.tsx"
Cohesion: 0.27
Nodes (11): PanelSectionLayout(), viewport, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE, PANEL_THEME_MAX_AGE (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 46 - "Dark + Orange Accent Visual Identity"
Cohesion: 0.14
Nodes (16): Dark + Orange Accent Visual Identity, Executive Sedan, Free Zone Car Import, Luxury Performance Car Branding, Luxury SUV, Safe Delivery & Pre-Delivery Inspection, Vehicle Quality Inspection, Car Headlight Macro Photo (+8 more)

### Community 47 - "package.json"
Cohesion: 0.13
Nodes (14): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+6 more)

### Community 48 - "guards.ts"
Cohesion: 0.09
Nodes (30): @prisma/client, AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata, AdminColorsPage() (+22 more)

### Community 49 - "middleware.ts"
Cohesion: 0.21
Nodes (11): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AREAS, config, isPassthrough(), middleware() (+3 more)

### Community 50 - "react"
Cohesion: 0.07
Nodes (30): lucide-react, react, VerificationStatusBadgeProps, DOCK_ITEMS, AdDetailView(), SectionTitle(), Spec(), AdGallery() (+22 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:studio (+5 more)

### Community 53 - "car-types/actions.ts"
Cohesion: 0.17
Nodes (22): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+14 more)

### Community 54 - "Toast"
Cohesion: 0.16
Nodes (17): faDate, BrandFormModalProps, BrandsManagerProps, ModalState, BrandsTableProps, CarsManagerProps, ModalState, ColorsManagerProps (+9 more)

### Community 55 - "lib/system-settings.ts"
Cohesion: 0.21
Nodes (13): SystemSettingsFormProps, parseRotationMinutes(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, MAX_AD_PAGE_NOTICE_LENGTH, MAX_USER_CODE_ROTATION_MINUTES, MIN_USER_CODE_ROTATION_MINUTES, SYSTEM_SETTING_KEYS (+5 more)

### Community 56 - "AdExtraFields.tsx"
Cohesion: 0.14
Nodes (17): ColorsTable(), ColorsTableProps, inputClassName(), ItemDraft, OptionFormModalProps, ColorSwatch(), ColorSwatchProps, SaleAdFormModalProps (+9 more)

### Community 57 - "VerificationManager.tsx"
Cohesion: 0.16
Nodes (19): submitVerificationAction(), dynamic, metadata, PanelVerificationPage(), DocDraft, FieldError(), IdentityDraft, identityDraftFrom() (+11 more)

### Community 58 - "PasswordChangeForm.tsx"
Cohesion: 0.21
Nodes (15): PasswordChangeForm(), handleSubmit(), PasswordChangeFormProps, PasswordField(), PasswordFieldProps, STRENGTH_META, FieldError(), FormAlert() (+7 more)

### Community 59 - "isTrustedOrigin"
Cohesion: 0.19
Nodes (14): adminSubmitVerificationAction(), reviewVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError() (+6 more)

### Community 60 - "app/layout.tsx"
Cohesion: 0.20
Nodes (11): jetbrainsMono, metadata, RootLayout(), vazirmatn, Footer(), MobileBottomDock(), Navbar(), hexToRgb() (+3 more)

### Community 61 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript

### Community 62 - "seed.mjs"
Cohesion: 0.29
Nodes (5): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, main(), bcryptjs

### Community 63 - "cars/page.tsx"
Cohesion: 0.27
Nodes (8): AdminCarTypesPage(), dynamic, metadata, AdminCarsPage(), dynamic, metadata, carTypeToRecord(), serializeCarType()

### Community 64 - "user-codes.ts"
Cohesion: 0.31
Nodes (8): ActiveUserCode, createCodes(), findActiveCodes(), findUserIdsByAnyCode(), getActiveUserCode(), getActiveUserCodes(), isUniqueViolation(), randomCode()

### Community 65 - "profile/page.tsx"
Cohesion: 0.20
Nodes (12): AdDetailPage(), dynamic, metadata, dynamic, faTime, metadata, PanelProfilePage(), requireUser() (+4 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "BrandsManager"
Cohesion: 0.52
Nodes (7): BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleToggleActive(), handleUpdateSuccess(), showToast()

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **32 isolated node(s):** `prisma`, `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 562 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CurrencyRates.tsx`, `(panel)/ads/page.tsx`, `AdsManager.tsx`, `sale-ads/actions.ts`, `images/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `admin/auth-actions.ts`, `CarOffersView.tsx`, `lib/price-table.ts`, `uploads.ts`, `verification-submission.ts`, `session.ts`, `khodroyab-data.ts`, `toPersianDigits`, `AdminShell.tsx`, `adminActionDenied`, `price-table-shared.ts`, `panel/auth-actions.ts`, `SaleAdFormModal.tsx`, `server-only`, `sale-terms/actions.ts`, `PanelShell.tsx`, `admins/actions.ts`, `price-list/page.tsx`, `users/actions.ts`, `cn`, `user-auth.ts`, `sponsors/actions.ts`, `ThemeSwitch.tsx`, `package.json`, `guards.ts`, `middleware.ts`, `react`, `car-types/actions.ts`, `VerificationManager.tsx`, `app/layout.tsx`, `cars/page.tsx`, `profile/page.tsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/node`, `@types/react` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0898995240613432 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CurrencyRates.tsx`, `AdsManager.tsx`, `AdminVerificationForm.tsx`, `sale-ads/actions.ts`, `images/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `panel-search.ts`, `formatPersianNumber`, `admin/auth-actions.ts`, `CarOffersView.tsx`, `MyPriceTableManager.tsx`, `SaleTermsManager.tsx`, `khodroyab-data.ts`, `toPersianDigits`, `AdminShell.tsx`, `adminActionDenied`, `panel/auth-actions.ts`, `SaleAdFormModal.tsx`, `server-only`, `PanelShell.tsx`, `next`, `admins/actions.ts`, `price-list/page.tsx`, `users/actions.ts`, `sponsors/actions.ts`, `ThemeSwitch.tsx`, `react`, `car-types/actions.ts`, `Toast`, `AdExtraFields.tsx`, `VerificationManager.tsx`, `PasswordChangeForm.tsx`, `isTrustedOrigin`, `app/layout.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarsManager`, `CurrencyRates.tsx`, `AdsManager.tsx`, `AdminVerificationForm.tsx`, `sale-ads/actions.ts`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `CarOffersView.tsx`, `MyPriceTableManager.tsx`, `verification-submission.ts`, `SaleTermsManager.tsx`, `khodroyab-data.ts`, `adminActionDenied`, `price-table-shared.ts`, `SaleAdFormModal.tsx`, `server-only`, `sale-terms/actions.ts`, `PanelShell.tsx`, `next`, `admins/actions.ts`, `price-list/page.tsx`, `users/actions.ts`, `sponsors/actions.ts`, `normalizeDigits`, `guards.ts`, `react`, `car-types/actions.ts`, `Toast`, `AdExtraFields.tsx`, `VerificationManager.tsx`, `PasswordChangeForm.tsx`, `isTrustedOrigin`, `BrandsManager`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._