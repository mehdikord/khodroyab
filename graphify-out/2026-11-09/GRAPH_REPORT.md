# Graph Report - khodroyab  (2026-11-09)

## Corpus Check
- 295 files · ~213,507 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 1905 nodes · 6164 edges · 76 communities (70 shown, 6 thin omitted)
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
- car-types/actions.ts
- CurrencyRates.tsx
- (panel)/ads/page.tsx
- SaleAdFormModal.tsx
- validation/profile.ts
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
- Toggle
- AdminShell.tsx
- adminActionDenied
- price-table-shared.ts
- panel/page.tsx
- MyAdForm.tsx
- server-only
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- next
- admins/actions.ts
- price-list/page.tsx
- users/actions.ts
- Modal
- user-auth.ts
- sponsors/actions.ts
- normalizeDigits
- ThemeSwitch.tsx
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- guards.ts
- password.ts
- cn
- dependencies
- scripts
- SponsorsManager
- react
- requireUser
- UsersManager.tsx
- VerificationManager.tsx
- panel/auth-actions.ts
- isTrustedOrigin
- user.ts
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
- users/page.tsx
- validation/sponsors.ts

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

## Communities (76 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.09
Nodes (53): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+45 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.09
Nodes (35): PasswordChangeForm(), handleSubmit(), PasswordChangeFormProps, PasswordField(), PasswordFieldProps, STRENGTH_META, FieldError(), FormAlert() (+27 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (22): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+14 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.08
Nodes (42): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), createCarAction() (+34 more)

### Community 4 - "CurrencyRates.tsx"
Cohesion: 0.12
Nodes (24): dynamic, metadata, PanelDashboardPage(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps, Flash (+16 more)

### Community 5 - "(panel)/ads/page.tsx"
Cohesion: 0.10
Nodes (26): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+18 more)

### Community 6 - "SaleAdFormModal.tsx"
Cohesion: 0.08
Nodes (41): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsTableProps, AdStatusBadgeProps (+33 more)

### Community 7 - "validation/profile.ts"
Cohesion: 0.18
Nodes (10): isValidNationalCode(), optionalDigits(), parsePasswordChangeForm(), PasswordChangeInput, passwordChangeSchema, ProfileUpdateInput, profileUpdateSchema, parseUserRegisterForm() (+2 more)

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
Cohesion: 0.15
Nodes (19): BrandActionResult, BrandSimpleActionResult, createBrandAction(), guardRequest(), toggleBrandActiveAction(), updateBrandAction(), BrandFormModal(), handleSubmit() (+11 more)

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
Cohesion: 0.26
Nodes (13): jose, getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience (+5 more)

### Community 24 - "SaleTermsManager.tsx"
Cohesion: 0.26
Nodes (10): inputClassName(), SaleTermFormModal(), SaleTermFormModalProps, SaleTermsManager(), handleDelete(), showToast(), SaleTermsManagerProps, SaleTermsTable() (+2 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.06
Nodes (53): framer-motion, AboutPage(), ICON_MAP, ContactPage(), jetbrainsMono, metadata, vazirmatn, LicensesPage() (+45 more)

### Community 26 - "Toggle"
Cohesion: 0.16
Nodes (18): AdsTable(), AdStatusBadge(), OptionsTable(), OptionsTableProps, typeLabel(), PriceTableCarsTable(), PriceTableCarsTableProps, inputClassName() (+10 more)

### Community 27 - "AdminShell.tsx"
Cohesion: 0.10
Nodes (26): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+18 more)

### Community 28 - "adminActionDenied"
Cohesion: 0.14
Nodes (23): saveSystemSettingsAction(), SystemSettingsActionResult, inputClassName(), SettingCard(), SystemSettingsForm(), handleSubmit(), showToast(), SystemSettingsFormProps (+15 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (25): guardRequest(), parseBigInt(), saveMyPriceTableAction(), formatUsd(), digitsOnly(), isValidTierYear(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS (+17 more)

### Community 30 - "panel/page.tsx"
Cohesion: 0.26
Nodes (10): getClientIp(), registerUserAction(), metadata, PanelLoginPage(), Mode, UserAuthCard(), fieldClass(), UserRegisterForm() (+2 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.13
Nodes (16): AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), OptionField(), THEMES, AdExtrasState, AdImageDraft (+8 more)

### Community 32 - "server-only"
Cohesion: 0.14
Nodes (22): server-only, CarActionResult, CarSimpleActionResult, STALE_RELATION_RESULT, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult (+14 more)

### Community 33 - "price-list.ts"
Cohesion: 0.16
Nodes (24): CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices(), lowestPricesByColumn() (+16 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.35
Nodes (11): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+3 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.14
Nodes (15): ConsultationFab(), findActivePanelItem(), PANEL_NAV_ITEMS, PanelNavItem, panelNavItemsFor(), PanelLogo(), PanelLogoProps, SIZES (+7 more)

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
Cohesion: 0.17
Nodes (19): createUserAction(), deleteUserAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserCollaborateAction(), updateUserAction(), inputClassName(), UserFormModal() (+11 more)

### Community 40 - "Modal"
Cohesion: 0.15
Nodes (11): react-dom, AdminFormModal(), FieldError(), inputClassName(), inputClassName(), ItemDraft, OptionFormModalProps, Modal() (+3 more)

### Community 41 - "user-auth.ts"
Cohesion: 0.15
Nodes (23): dynamic, GET(), changePasswordAction(), guardRequest(), PasswordActionResult, ProfileActionResult, revalidateProfilePages(), updateProfileAction() (+15 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.17
Nodes (23): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+15 more)

### Community 43 - "normalizeDigits"
Cohesion: 0.16
Nodes (16): zod, normalizeYear(), SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS, AdminLoginInput, normalizeDigits(), grantSubscriptionSchema, SubscriptionPlanInput (+8 more)

### Community 44 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

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

### Community 49 - "password.ts"
Cohesion: 0.18
Nodes (12): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, DUMMY_PASSWORD_HASH, AREAS, config, isPassthrough() (+4 more)

### Community 50 - "cn"
Cohesion: 0.08
Nodes (45): RootLayout(), PageLink(), inputClassName(), ColorsTable(), ColorsTableProps, SubscriptionBadge(), ColorSwatch(), ColorSwatchProps (+37 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:studio (+5 more)

### Community 53 - "SponsorsManager"
Cohesion: 0.50
Nodes (8): byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord()

### Community 54 - "react"
Cohesion: 0.08
Nodes (33): lucide-react, react, faDate, BrandFormModalProps, inputClassName(), BrandsManagerProps, ModalState, BrandsTable() (+25 more)

### Community 55 - "requireUser"
Cohesion: 0.23
Nodes (10): AdminSettingsPage(), dynamic, metadata, AdDetailPage(), dynamic, metadata, PanelAppLayout(), requireUser() (+2 more)

### Community 56 - "UsersManager.tsx"
Cohesion: 0.29
Nodes (10): findUsersByCodeAction(), toggleUserActiveAction(), digitQuery(), FILTERS, matchesFilter(), UsersManager(), handleToggleActive(), VerificationStatusBadge() (+2 more)

### Community 57 - "VerificationManager.tsx"
Cohesion: 0.16
Nodes (19): submitVerificationAction(), dynamic, metadata, PanelVerificationPage(), DocDraft, FieldError(), IdentityDraft, identityDraftFrom() (+11 more)

### Community 58 - "panel/auth-actions.ts"
Cohesion: 0.26
Nodes (10): loginUserAction(), logoutUserAction(), UserLoginActionResult, UserRegisterActionResult, fieldClass(), UserLoginForm(), handleSubmit(), clearUserSessionCookie() (+2 more)

### Community 59 - "isTrustedOrigin"
Cohesion: 0.19
Nodes (14): adminSubmitVerificationAction(), reviewVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError() (+6 more)

### Community 60 - "user.ts"
Cohesion: 0.20
Nodes (11): PASSWORD_MIN_LENGTH, adminLoginSchema, normalizePhone(), COMPANY_NAME_MAX_LENGTH, IRANIAN_MOBILE_REGEX, USER_NAME_MAX_LENGTH, UserLoginInput, userLoginSchema (+3 more)

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
Cohesion: 0.31
Nodes (8): dynamic, faTime, metadata, PanelProfilePage(), emptyAdStats(), ProfileRow, profileSelect, toProfileRecord()

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "BrandsManager"
Cohesion: 0.39
Nodes (9): deleteBrandAction(), isPrismaCode(), BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleToggleActive(), handleUpdateSuccess() (+1 more)

### Community 73 - "users/page.tsx"
Cohesion: 0.28
Nodes (7): AdminUsersPage(), dynamic, metadata, UsersManagerProps, isUserFilter(), USER_FILTERS, UserFilter

### Community 74 - "validation/sponsors.ts"
Cohesion: 0.25
Nodes (6): MAX_IMAGE_SIZE_BYTES, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX, SponsorFormValues, sponsorSchema

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **32 isolated node(s):** `prisma`, `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 562 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `CurrencyRates.tsx`, `(panel)/ads/page.tsx`, `SaleAdFormModal.tsx`, `sale-ads/actions.ts`, `images/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `admin/auth-actions.ts`, `CarOffersView.tsx`, `lib/price-table.ts`, `uploads.ts`, `verification-submission.ts`, `session.ts`, `khodroyab-data.ts`, `Toggle`, `AdminShell.tsx`, `adminActionDenied`, `price-table-shared.ts`, `panel/page.tsx`, `MyAdForm.tsx`, `server-only`, `sale-terms/actions.ts`, `PanelShell.tsx`, `admins/actions.ts`, `price-list/page.tsx`, `users/actions.ts`, `Modal`, `user-auth.ts`, `sponsors/actions.ts`, `ThemeSwitch.tsx`, `package.json`, `guards.ts`, `password.ts`, `cn`, `react`, `requireUser`, `UsersManager.tsx`, `VerificationManager.tsx`, `panel/auth-actions.ts`, `cars/page.tsx`, `profile/page.tsx`, `users/page.tsx`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/node`, `@types/react` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0898995240613432 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `CurrencyRates.tsx`, `SaleAdFormModal.tsx`, `AdminVerificationForm.tsx`, `sale-ads/actions.ts`, `images/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `panel-search.ts`, `formatPersianNumber`, `admin/auth-actions.ts`, `CarOffersView.tsx`, `MyPriceTableManager.tsx`, `SaleTermsManager.tsx`, `khodroyab-data.ts`, `Toggle`, `AdminShell.tsx`, `adminActionDenied`, `panel/page.tsx`, `MyAdForm.tsx`, `server-only`, `PanelShell.tsx`, `next`, `admins/actions.ts`, `price-list/page.tsx`, `users/actions.ts`, `Modal`, `sponsors/actions.ts`, `ThemeSwitch.tsx`, `react`, `UsersManager.tsx`, `VerificationManager.tsx`, `panel/auth-actions.ts`, `isTrustedOrigin`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0927536231884058 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `CurrencyRates.tsx`, `SaleAdFormModal.tsx`, `AdminVerificationForm.tsx`, `sale-ads/actions.ts`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `CarOffersView.tsx`, `MyPriceTableManager.tsx`, `verification-submission.ts`, `SaleTermsManager.tsx`, `khodroyab-data.ts`, `Toggle`, `adminActionDenied`, `price-table-shared.ts`, `MyAdForm.tsx`, `server-only`, `PanelShell.tsx`, `next`, `admins/actions.ts`, `price-list/page.tsx`, `sponsors/actions.ts`, `normalizeDigits`, `guards.ts`, `SponsorsManager`, `react`, `UsersManager.tsx`, `VerificationManager.tsx`, `isTrustedOrigin`, `BrandsManager`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._