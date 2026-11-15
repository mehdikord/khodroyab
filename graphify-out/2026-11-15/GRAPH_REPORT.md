# Graph Report - khodroyab  (2026-11-15)

## Corpus Check
- 346 files · ~185,812 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2329 nodes · 7838 edges · 100 communities (93 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74c72a89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- admin-buy-ads.ts
- AdsManager
- users/actions.ts
- adminActionDenied
- VerificationManager.tsx
- Admin authentication flow
- (app)/about/page.tsx
- formatPersianNumber
- colors/actions.ts
- lucide-react
- panel-search.ts
- car-form/actions.ts
- (panel)/dashboard/page.tsx
- panel/auth-actions.ts
- CarOffersView.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- app/layout.tsx
- toPersianDigits
- roles/actions.ts
- SaleAdFormModal.tsx
- price-table-shared.ts
- admin/auth-actions.ts
- MyAdForm.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- ConfirmDialog
- PanelShell.tsx
- lib/admins.ts
- ContactView.tsx
- permissions.ts
- Modal
- cn
- normalizeDigits
- sponsors/actions.ts
- sale-ads/actions.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- ads/actions.ts
- verification-submission.ts
- BuyAdDetailView.tsx
- dependencies
- scripts
- brands/actions.ts
- utils.ts
- BuyAdForm.tsx
- BranchFormModal.tsx
- SystemSettingsForm.tsx
- users/[id]/page.tsx
- buy-ads-shared.ts
- user-car-extras.ts
- devDependencies
- CurrencyRates.tsx
- panel/page.tsx
- AdminsManager.tsx
- guards.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- AdminShell.tsx
- middleware.ts
- VerificationManager
- PriceCurrency
- ThemeSwitch.tsx
- prisma.ts
- admin.ts
- lib/colors.ts
- validation/car-types.ts
- react
- requireAdminAccess
- price-list/page.tsx
- dashboard.ts
- AdminVerificationForm
- lib/user-cars.ts
- tailwindcss
- AdsManager.tsx
- ads/page.tsx
- validation/brands.ts
- StatTile.tsx
- admins/actions.ts
- getSystemSettings
- AdsTrendChart.tsx
- uploads.ts
- isTrustedOrigin

## God Nodes (most connected - your core abstractions)
1. `cn()` - 283 edges
2. `toPersianDigits()` - 233 edges
3. `react` - 199 edges
4. `next` - 145 edges
5. `lucide-react` - 142 edges
6. `formatPersianNumber()` - 79 edges
7. `prisma` - 67 edges
8. `isTrustedOrigin()` - 56 edges
9. `Toast()` - 48 edges
10. `requireAdminAccess()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminCarTypesPage()` --indirect_call--> `carTypeToRecord()`  [INFERRED]
  src/app/admin/(panel)/car-types/page.tsx → src/lib/car-types.ts
- `AdminCarsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/brands.ts
- `AdminCarsPage()` --indirect_call--> `carTypeToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/car-types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (100 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (61): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+53 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (40): react-dom, guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), FieldError(), FormAlert(), inputClassName() (+32 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (25): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+17 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.14
Nodes (27): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+19 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.06
Nodes (75): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+67 more)

### Community 5 - "AdsManager"
Cohesion: 0.27
Nodes (9): AdsFilters(), AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList() (+1 more)

### Community 6 - "users/actions.ts"
Cohesion: 0.13
Nodes (32): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+24 more)

### Community 7 - "adminActionDenied"
Cohesion: 0.23
Nodes (10): AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, adminActionDenied(), faDateTime, verificationDocumentUrl(), verificationInclude (+2 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.13
Nodes (26): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationStatusBadgeProps, DocDraft, IdentityDraft (+18 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "formatPersianNumber"
Cohesion: 0.14
Nodes (30): AdDetailPage(), dynamic, metadata, AdsTable(), AdStatusBadge(), BuyAdsTable(), lowestPrice(), SaleAdsTable() (+22 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.13
Nodes (26): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+18 more)

### Community 13 - "lucide-react"
Cohesion: 0.14
Nodes (17): lucide-react, BrandFormModalProps, BrandsManagerProps, ModalState, BrandsTable(), BrandsTableProps, ModalState, CarsTable() (+9 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.05
Nodes (62): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), PriceHistoryChartProps (+54 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.11
Nodes (29): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+21 more)

### Community 16 - "(panel)/dashboard/page.tsx"
Cohesion: 0.17
Nodes (20): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), CatalogOverview(), DashboardCard(), DashboardCardProps (+12 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.17
Nodes (19): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+11 more)

### Community 18 - "CarOffersView.tsx"
Cohesion: 0.15
Nodes (20): dynamic, PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), sortOffers(), sortValue() (+12 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.10
Nodes (28): parseBigInt(), saveUserPriceTableAction(), guardRequest(), parseBigInt(), saveMyPriceTableAction(), MyPriceTableManagerProps, visibleTiers(), entrySignature() (+20 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.14
Nodes (23): applyCoordsText(), PRICE_TABLE_PRICE_FIELDS, parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH, MAX_AD_PAGE_NOTICE_LENGTH (+15 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (32): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+24 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.11
Nodes (30): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), dateFormatter, LiveClock(), LiveClockProps (+22 more)

### Community 23 - "session.ts"
Cohesion: 0.18
Nodes (18): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches() (+10 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.11
Nodes (34): dynamic, GET(), BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd() (+26 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "toPersianDigits"
Cohesion: 0.13
Nodes (24): BuyAdsFilters(), Segmented(), BestOfferHero(), BuyAdOffersPanel(), cleanDigits(), compareDigits(), diffDigits(), groupDigits() (+16 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.14
Nodes (26): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+18 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (26): AdsFiltersProps, PARAM_KEYS, AdsTableProps, AdStatusBadgeProps, STYLES, SEGMENTS, StatusBreakdownProps, normalize() (+18 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.14
Nodes (19): ALL_PRICE_FIELD_KEYS, digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS, PRICE_TABLE_PRICE_MAX_DIGITS (+11 more)

### Community 30 - "admin/auth-actions.ts"
Cohesion: 0.23
Nodes (12): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), authenticateAdmin(), consumeTiming() (+4 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.11
Nodes (19): AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES, AdExtrasState (+11 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.33
Nodes (11): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), PriceTableManager() (+3 more)

### Community 33 - "price-list.ts"
Cohesion: 0.16
Nodes (24): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn(), jalaliDate (+16 more)

### Community 34 - "ConfirmDialog"
Cohesion: 0.17
Nodes (20): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+12 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.11
Nodes (22): DollarTicker(), findActivePanelItem(), GUEST_NAV_KEYS, GUEST_SHORT_LABELS, PANEL_GUEST_NAV_ITEMS, PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem (+14 more)

### Community 36 - "lib/admins.ts"
Cohesion: 0.21
Nodes (13): AdminAdminsPage(), dynamic, metadata, AdminRolesPage(), dynamic, metadata, ADMIN_ORDER_BY, adminRecordSelect (+5 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.11
Nodes (27): BranchMapPoint, ConsultationFab(), ConsultationFabProps, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout() (+19 more)

### Community 38 - "permissions.ts"
Cohesion: 0.26
Nodes (10): AdminShellUser, AttentionListProps, Severity, CatalogOverviewProps, AdminAccess, AdminPermissionMeta, isAdminPermission(), normalizePermissions() (+2 more)

### Community 39 - "Modal"
Cohesion: 0.16
Nodes (21): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT, updateCarAction() (+13 more)

### Community 40 - "cn"
Cohesion: 0.15
Nodes (21): RankMedal(), ColorsTable(), StatusBreakdown(), ColorSwatch(), ColorSwatchProps, MyAdCard(), NoImage(), STATUS_HINT (+13 more)

### Community 41 - "normalizeDigits"
Cohesion: 0.10
Nodes (25): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, isValidTierYear(), normalizeYear(), normalizeDigits(), MAX_IMAGE_SIZE_BYTES, BuyAdInput (+17 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.11
Nodes (38): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+30 more)

### Community 43 - "sale-ads/actions.ts"
Cohesion: 0.21
Nodes (22): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+14 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (15): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+7 more)

### Community 48 - "ads/actions.ts"
Cohesion: 0.24
Nodes (19): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+11 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.13
Nodes (13): SubmitVerificationResult, isValidCompanyNationalId(), removeVerificationFiles(), saveVerificationFile(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission (+5 more)

### Community 50 - "BuyAdDetailView.tsx"
Cohesion: 0.17
Nodes (21): AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdDetailView() (+13 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "brands/actions.ts"
Cohesion: 0.14
Nodes (26): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+18 more)

### Community 54 - "utils.ts"
Cohesion: 0.19
Nodes (14): BranchesTable(), OptionsTable(), OptionsTableProps, typeLabel(), PriceTableCarsTable(), PriceTableCarsTableProps, SaleTermsTableProps, SponsorsTable() (+6 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.14
Nodes (19): CurrencyToggle(), BuyAdCardProps, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass() (+11 more)

### Community 56 - "BranchFormModal.tsx"
Cohesion: 0.08
Nodes (55): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+47 more)

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.13
Nodes (23): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, ContactField, ContactInput(), ContactValues (+15 more)

### Community 58 - "users/[id]/page.tsx"
Cohesion: 0.22
Nodes (11): AdminUserProfilePage(), dynamic, metadata, PageProps, ActiveUserCode, createCodes(), findActiveCodes(), getActiveUserCode() (+3 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.15
Nodes (18): BuyAdDetailViewProps, BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BuyAdOffersPanelProps, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_POLL_MS (+10 more)

### Community 60 - "user-car-extras.ts"
Cohesion: 0.24
Nodes (12): AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson(), planImages() (+4 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.10
Nodes (28): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES (+20 more)

### Community 63 - "panel/page.tsx"
Cohesion: 0.16
Nodes (16): metadata, PageProps, PanelLoginPage(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step (+8 more)

### Community 64 - "AdminsManager.tsx"
Cohesion: 0.19
Nodes (17): AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManager(), handleDelete(), handleToggleActive(), showToast() (+9 more)

### Community 65 - "guards.ts"
Cohesion: 0.17
Nodes (14): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ADMIN_FORBIDDEN_MESSAGE (+6 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.20
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.20
Nodes (21): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+13 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.20
Nodes (12): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+4 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.16
Nodes (16): ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavGroup, AdminNavItem, AdminSubNavItem, findActiveNavItem(), getVisibleNavGroups(), AdminLogo() (+8 more)

### Community 76 - "middleware.ts"
Cohesion: 0.19
Nodes (10): isPublicPanelPath(), PANEL_HOME, PUBLIC_PANEL_PATTERNS, AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES (+2 more)

### Community 77 - "VerificationManager"
Cohesion: 0.18
Nodes (14): submitVerificationAction(), dynamic, metadata, PanelVerificationPage(), FieldError(), identityDraftFrom(), inputClassName(), newDoc() (+6 more)

### Community 78 - "PriceCurrency"
Cohesion: 0.32
Nodes (7): CurrencyToggleProps, Draft, PRICE_CURRENCIES, PriceCurrency, PriceListCarDetail, PriceColumn, PriceTableEntryInput

### Community 79 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 80 - "prisma.ts"
Cohesion: 0.16
Nodes (15): BuyAdDetailPage(), dynamic, metadata, dynamic, metadata, dynamic, faTime, metadata (+7 more)

### Community 81 - "admin.ts"
Cohesion: 0.10
Nodes (27): zod, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), AdminFormInput, emailSchema, idSchema (+19 more)

### Community 82 - "lib/colors.ts"
Cohesion: 0.29
Nodes (11): AdminUserPriceTablePage(), dynamic, metadata, PageProps, dynamic, metadata, PanelPriceTablePage(), listColors() (+3 more)

### Community 83 - "validation/car-types.ts"
Cohesion: 0.21
Nodes (11): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+3 more)

### Community 84 - "react"
Cohesion: 0.11
Nodes (26): next, react, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage() (+18 more)

### Community 85 - "requireAdminAccess"
Cohesion: 0.19
Nodes (10): AdminPendingAdsPage(), dynamic, metadata, AdminCarTypesPage(), dynamic, metadata, AdminPriceTablePage(), dynamic (+2 more)

### Community 86 - "price-list/page.tsx"
Cohesion: 0.21
Nodes (13): dynamic, metadata, PanelPriceListPage(), StatTile(), carHref(), hasAnyPrice(), PriceListBrowser(), openRow() (+5 more)

### Community 87 - "dashboard.ts"
Cohesion: 0.33
Nodes (9): bucketByDay(), computeDelta(), dayKey(), faDate, faLongDate, faShortDate, getDashboardData(), shiftDays() (+1 more)

### Community 88 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 89 - "lib/user-cars.ts"
Cohesion: 0.20
Nodes (9): AdOptionDisplay, adOptionsToFormValues(), faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow, userCarOptionsInclude, UserCarSaleTermRecord (+1 more)

### Community 91 - "AdsManager.tsx"
Cohesion: 0.25
Nodes (17): AdsFilterValues, AdsUserOption, AdsManagerProps, AdsStatusCounts, ColorsTableProps, SaleAdFormModalProps, Filter, SaleAdsManagerProps (+9 more)

### Community 92 - "ads/page.tsx"
Cohesion: 0.09
Nodes (41): @prisma/client, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull() (+33 more)

### Community 93 - "validation/brands.ts"
Cohesion: 0.22
Nodes (8): ALLOWED_IMAGE_MIME_TYPES, brandCoreSchema, BrandFormValues, fallbackSlug(), ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug()

### Community 94 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 95 - "admins/actions.ts"
Cohesion: 0.29
Nodes (16): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+8 more)

### Community 96 - "getSystemSettings"
Cohesion: 0.36
Nodes (6): metadata, PanelContactPage(), PanelAppLayout(), listActiveBranches(), getSystemSettings, parseRotationMinutes()

### Community 97 - "AdsTrendChart.tsx"
Cohesion: 0.36
Nodes (6): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), TrendPoint

### Community 102 - "uploads.ts"
Cohesion: 0.12
Nodes (22): dynamic, GET(), notFound(), RouteContext, runtime, buildHeaders(), dynamic, GET() (+14 more)

### Community 106 - "isTrustedOrigin"
Cohesion: 0.18
Nodes (18): server-only, addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic (+10 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **28 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 653 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `AdsManager`, `users/actions.ts`, `adminActionDenied`, `VerificationManager.tsx`, `formatPersianNumber`, `colors/actions.ts`, `lucide-react`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `panel/auth-actions.ts`, `CarOffersView.tsx`, `lib/price-table.ts`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `ConfirmDialog`, `PanelShell.tsx`, `ContactView.tsx`, `Modal`, `cn`, `normalizeDigits`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `utils.ts`, `BuyAdForm.tsx`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `buy-ads-shared.ts`, `user-car-extras.ts`, `CurrencyRates.tsx`, `panel/page.tsx`, `AdminsManager.tsx`, `AdKindTabs.tsx`, `VerificationManager`, `react`, `requireAdminAccess`, `price-list/page.tsx`, `AdminVerificationForm`, `AdsManager.tsx`, `StatTile.tsx`, `AdsTrendChart.tsx`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07496194824961948 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `AdsManager`, `users/actions.ts`, `VerificationManager.tsx`, `formatPersianNumber`, `colors/actions.ts`, `lucide-react`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `CarOffersView.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `toPersianDigits`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `admin/auth-actions.ts`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `ConfirmDialog`, `PanelShell.tsx`, `ContactView.tsx`, `permissions.ts`, `Modal`, `sponsors/actions.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `utils.ts`, `BuyAdForm.tsx`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `CurrencyRates.tsx`, `panel/page.tsx`, `AdminsManager.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `VerificationManager`, `PriceCurrency`, `ThemeSwitch.tsx`, `react`, `price-list/page.tsx`, `AdminVerificationForm`, `AdsManager.tsx`, `StatTile.tsx`, `AdsTrendChart.tsx`, `isTrustedOrigin`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Why does `next` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `users/actions.ts`, `adminActionDenied`, `VerificationManager.tsx`, `(app)/about/page.tsx`, `formatPersianNumber`, `colors/actions.ts`, `lucide-react`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `panel/auth-actions.ts`, `CarOffersView.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `session.ts`, `buy/actions.ts`, `app/layout.tsx`, `toPersianDigits`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `admin/auth-actions.ts`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `ConfirmDialog`, `PanelShell.tsx`, `lib/admins.ts`, `ContactView.tsx`, `permissions.ts`, `Modal`, `cn`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `package.json`, `ads/actions.ts`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `BuyAdForm.tsx`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `users/[id]/page.tsx`, `CurrencyRates.tsx`, `panel/page.tsx`, `AdminsManager.tsx`, `guards.ts`, `AdKindTabs.tsx`, `AdminShell.tsx`, `middleware.ts`, `VerificationManager`, `ThemeSwitch.tsx`, `prisma.ts`, `lib/colors.ts`, `requireAdminAccess`, `price-list/page.tsx`, `AdsManager.tsx`, `ads/page.tsx`, `StatTile.tsx`, `admins/actions.ts`, `getSystemSettings`, `uploads.ts`, `isTrustedOrigin`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._