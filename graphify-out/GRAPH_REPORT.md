# Graph Report - khodroyab  (2026-11-15)

## Corpus Check
- 362 files · ~199,194 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2492 nodes · 8398 edges · 110 communities (102 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 90 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74c72a89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- server-only
- admin-buy-ads.ts
- AdsManager
- UsersManager.tsx
- isTrustedOrigin
- VerificationManager.tsx
- Admin authentication flow
- (app)/about/page.tsx
- toPersianDigits
- cars/actions.ts
- utils.ts
- panel-search.ts
- car-form/actions.ts
- formatPersianNumber
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- system-settings-shared.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- roles/actions.ts
- SaleAdFormModal.tsx
- price-table-shared.ts
- admin/auth-actions.ts
- MyAdForm.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- guards.ts
- ContactView.tsx
- AttentionList.tsx
- Toggle
- cn
- normalizeDigits
- sponsors/actions.ts
- lib/purchase-requests.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- verification-submission.ts
- BuyAdDetailView.tsx
- dependencies
- scripts
- brands/actions.ts
- react
- currency.ts
- BranchFormModal.tsx
- SystemSettingsForm.tsx
- lib/system-settings.ts
- buy-ads-shared.ts
- user-car-extras.ts
- devDependencies
- CurrencyRates.tsx
- UserAuthCard.tsx
- AdminsManager.tsx
- requireAdmin
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- AdminShell.tsx
- middleware.ts
- purchase-requests-shared.ts
- AdDetailView.tsx
- purchase-request-actions.ts
- user-auth.ts
- admin.ts
- search/page.tsx
- branches/actions.ts
- next
- SaleAdFormModal
- market-rates.ts
- dashboard.ts
- users/actions.ts
- lib/user-cars.ts
- tailwindcss
- BranchesSection.tsx
- ads/page.tsx
- validation/brands.ts
- StatTile.tsx
- admins/actions.ts
- [audience]/page.tsx
- AdsTrendChart.tsx
- lib/branches.ts
- SponsorsManager.tsx
- MyBuyAdsManager.tsx
- requests/page.tsx
- uploads.ts
- BranchesManager
- lib/sponsors.ts
- PurchaseRequestsManager
- @prisma/client
- admin/page.tsx
- parseJalaliDate
- ComingSoon.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 304 edges
2. `toPersianDigits()` - 253 edges
3. `react` - 207 edges
4. `next` - 155 edges
5. `lucide-react` - 148 edges
6. `formatPersianNumber()` - 81 edges
7. `prisma` - 68 edges
8. `isTrustedOrigin()` - 61 edges
9. `requireAdminAccess()` - 53 edges
10. `Toast()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAdminsPage()` --indirect_call--> `adminToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAllAdsPage()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/cars.ts
- `AdminAllAdsPage()` --indirect_call--> `colorToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/colors.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (110 total, 8 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (61): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+53 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.10
Nodes (30): revalidateProfilePages(), updateProfileAction(), FieldError(), FormAlert(), inputClassName(), labelClassName, SubmitBar(), SubmitBarProps (+22 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (25): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+17 more)

### Community 3 - "server-only"
Cohesion: 0.15
Nodes (23): server-only, CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction() (+15 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (76): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+68 more)

### Community 5 - "AdsManager"
Cohesion: 0.32
Nodes (12): deleteUserCarAction(), guardRequest(), isPrismaCode(), revalidateUserPages(), toggleUserCarActiveAction(), updateUserCarStatusAction(), AdsManager(), handleChangeStatus() (+4 more)

### Community 6 - "UsersManager.tsx"
Cohesion: 0.14
Nodes (20): AdminUsersPage(), dynamic, metadata, inputClassName(), UserFormModal(), UserFormModalProps, digitQuery(), FILTERS (+12 more)

### Community 7 - "isTrustedOrigin"
Cohesion: 0.25
Nodes (10): findUsersByCodeAction(), parseBigInt(), saveUserPriceTableAction(), AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, adminActionDenied() (+2 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.08
Nodes (44): adminSubmitVerificationAction(), submitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), AdminVerificationFormProps (+36 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "toPersianDigits"
Cohesion: 0.14
Nodes (20): BuyAdsFilters(), Segmented(), Chip(), PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented(), AdPriceHistory() (+12 more)

### Community 12 - "cars/actions.ts"
Cohesion: 0.06
Nodes (54): zod, CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+46 more)

### Community 13 - "utils.ts"
Cohesion: 0.13
Nodes (25): lucide-react, ModalState, ModalState, CarTypeFormModalProps, CarTypesManagerProps, ModalState, CarTypesTable(), CarTypesTableProps (+17 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.10
Nodes (35): DEFAULTS, SearchFiltersProps, SORTS, adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate (+27 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.13
Nodes (24): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+16 more)

### Community 16 - "formatPersianNumber"
Cohesion: 0.17
Nodes (22): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), CatalogOverview(), DashboardCard(), DashboardCardProps (+14 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.18
Nodes (18): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+10 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.11
Nodes (27): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), AdminPurchaseRequestPage(), dynamic, metadata, PageProps (+19 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.11
Nodes (29): AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt(), saveMyPriceTableAction(), dynamic (+21 more)

### Community 20 - "system-settings-shared.ts"
Cohesion: 0.12
Nodes (24): SystemSettingsFormProps, LocationPicker(), applyCoordsText(), PRICE_TABLE_PRICE_FIELDS, DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH (+16 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (35): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+27 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.10
Nodes (33): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), dateFormatter, LiveClock(), LiveClockProps (+25 more)

### Community 23 - "session.ts"
Cohesion: 0.26
Nodes (13): jose, getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience (+5 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.19
Nodes (23): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure(), parseBigInt() (+15 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.14
Nodes (23): BuyAdOffersResult, BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), BuyAdOffersPanelProps (+15 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.18
Nodes (18): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+10 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (40): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, buildPageList(), PageLink() (+32 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (23): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS (+15 more)

### Community 30 - "admin/auth-actions.ts"
Cohesion: 0.24
Nodes (12): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+4 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.10
Nodes (23): ColorsManagerProps, ColorsTableProps, AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint() (+15 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.24
Nodes (15): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+7 more)

### Community 33 - "price-list.ts"
Cohesion: 0.08
Nodes (48): dynamic, generateMetadata(), PageProps, PriceListCarPage(), dynamic, metadata, PanelPriceListPage(), StatTile() (+40 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.28
Nodes (13): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+5 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.09
Nodes (33): PanelSectionLayout(), viewport, findActivePanelItem(), GUEST_NAV_KEYS, GUEST_SHORT_LABELS, PANEL_GUEST_NAV_ITEMS, PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS (+25 more)

### Community 36 - "guards.ts"
Cohesion: 0.08
Nodes (38): AdminAdminsPage(), dynamic, metadata, AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic (+30 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.16
Nodes (18): metadata, PanelContactPage(), base, IconProps, InstagramIcon(), TelegramIcon(), WhatsappIcon(), buildChannels() (+10 more)

### Community 38 - "AttentionList.tsx"
Cohesion: 0.24
Nodes (12): AdminShellUser, AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PermissionChipsProps, AuthorizedAdmin (+4 more)

### Community 39 - "Toggle"
Cohesion: 0.17
Nodes (11): react-dom, BranchesTable(), ItemDraft, OptionsTable(), typeLabel(), Modal(), ModalProps, SIZE_CLASSES (+3 more)

### Community 40 - "cn"
Cohesion: 0.16
Nodes (23): BuyAdsTable(), ColorsTable(), ColorSwatch(), ColorSwatchProps, CurrencyTag(), PriceEquivalent(), MyAdCard(), NoImage() (+15 more)

### Community 41 - "normalizeDigits"
Cohesion: 0.16
Nodes (18): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, isValidTierYear(), normalizeYear(), normalizeDigits(), BuyAdInput, buyAdSchema (+10 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.16
Nodes (27): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+19 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.12
Nodes (28): priceColumnKey(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, AdminPurchaseRequestPage, audienceWhere(), buildOrderBy(), buildWhere(), carLabelOf(), CreatePurchaseRequestResult (+20 more)

### Community 44 - "otp.ts"
Cohesion: 0.18
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (15): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+7 more)

### Community 48 - "sale-ads/actions.ts"
Cohesion: 0.17
Nodes (32): createUserCarAction(), parseBigInt(), PRICE_CHANGE_SOURCE, toSaleTermData(), updateUserCarAction(), UserCarActionResult, UserCarSimpleActionResult, validateSaleTermIds() (+24 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.07
Nodes (30): AdminUserProfilePage(), dynamic, metadata, PageProps, dynamic, GET(), notFound(), RouteContext (+22 more)

### Community 50 - "BuyAdDetailView.tsx"
Cohesion: 0.15
Nodes (26): AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdDetailView() (+18 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "brands/actions.ts"
Cohesion: 0.13
Nodes (26): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+18 more)

### Community 54 - "react"
Cohesion: 0.10
Nodes (16): react, BrandsTable(), PriceTableCarsTable(), SaleTermsTable(), Badge(), BadgeProps, BadgeTone, TONE_CLASSES (+8 more)

### Community 55 - "currency.ts"
Cohesion: 0.14
Nodes (22): CurrencyToggleProps, BuyAdForm(), BuyAdFormColor, digitsToAscii(), FieldError(), inputClass(), MILEAGE_PRESETS, mileageNumber() (+14 more)

### Community 56 - "BranchFormModal.tsx"
Cohesion: 0.13
Nodes (20): BranchesManagerProps, BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel(), inputClassName(), LocationPicker (+12 more)

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.27
Nodes (12): ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError() (+4 more)

### Community 58 - "lib/system-settings.ts"
Cohesion: 0.15
Nodes (18): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, getSystemSettings, parseEnabledPriceFields(), parseRotationMinutes() (+10 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.14
Nodes (21): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange() (+13 more)

### Community 60 - "user-car-extras.ts"
Cohesion: 0.24
Nodes (12): AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson(), planImages() (+4 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.16
Nodes (15): ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps, Flash, formatJalali(), formatRial() (+7 more)

### Community 63 - "UserAuthCard.tsx"
Cohesion: 0.22
Nodes (11): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+3 more)

### Community 64 - "AdminsManager.tsx"
Cohesion: 0.13
Nodes (27): AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManager(), handleDelete(), handleToggleActive(), showToast() (+19 more)

### Community 65 - "requireAdmin"
Cohesion: 0.36
Nodes (6): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), requireAdmin(), countUnseenPurchaseRequests()

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.17
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.21
Nodes (20): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+12 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.20
Nodes (12): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+4 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.14
Nodes (21): ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup, AdminNavItem, AdminSubNavItem, findActiveNavItem(), getVisibleNavGroups() (+13 more)

### Community 76 - "middleware.ts"
Cohesion: 0.14
Nodes (14): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, isPublicPanelPath(), PANEL_HOME, PUBLIC_PANEL_PATTERNS, AREAS (+6 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.17
Nodes (21): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, PurchaseRequestsManagerProps, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS, ADMIN_PURCHASE_REQUEST_SORT_LABELS, ADMIN_PURCHASE_REQUEST_SORTS (+13 more)

### Community 78 - "AdDetailView.tsx"
Cohesion: 0.18
Nodes (17): loadPurchaseRequestLocationsAction(), AdDetailView(), AdDetailViewProps, SectionTitle(), Spec(), fieldClass(), FieldError(), groupCode() (+9 more)

### Community 79 - "purchase-request-actions.ts"
Cohesion: 0.14
Nodes (17): clientIp(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), handleSubmit(), createPurchaseRequest(), PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX (+9 more)

### Community 80 - "user-auth.ts"
Cohesion: 0.09
Nodes (31): dynamic, GET(), BuyAdDetailPage(), dynamic, metadata, PanelAppLayout(), guardRequest(), ProfileActionResult (+23 more)

### Community 81 - "admin.ts"
Cohesion: 0.11
Nodes (21): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), isValidNationalCode(), optionalDigits(), parseProfileUpdateForm() (+13 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.18
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+6 more)

### Community 83 - "branches/actions.ts"
Cohesion: 0.30
Nodes (16): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+8 more)

### Community 84 - "next"
Cohesion: 0.10
Nodes (37): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+29 more)

### Community 85 - "SaleAdFormModal"
Cohesion: 0.14
Nodes (11): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, FieldError(), inputClassName() (+3 more)

### Community 86 - "market-rates.ts"
Cohesion: 0.12
Nodes (21): dynamic, GET(), AdDetailPage(), dynamic, metadata, dynamic, metadata, PanelDashboardPage() (+13 more)

### Community 87 - "dashboard.ts"
Cohesion: 0.26
Nodes (11): RecentAdsProps, bucketByDay(), computeDelta(), DashboardRecentAd, dayKey(), faDate, faLongDate, faShortDate (+3 more)

### Community 88 - "users/actions.ts"
Cohesion: 0.26
Nodes (15): createUserAction(), deleteUserAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction(), handleSubmit() (+7 more)

### Community 89 - "lib/user-cars.ts"
Cohesion: 0.17
Nodes (11): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), AdOptionValue, faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow (+3 more)

### Community 91 - "BranchesSection.tsx"
Cohesion: 0.20
Nodes (12): BranchMapPoint, ConsultationFab(), ConsultationFabProps, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout() (+4 more)

### Community 92 - "ads/page.tsx"
Cohesion: 0.13
Nodes (20): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminUserSaleAdsPage() (+12 more)

### Community 93 - "validation/brands.ts"
Cohesion: 0.13
Nodes (13): brandCoreSchema, BrandFormValues, fallbackSlug(), MAX_IMAGE_SIZE_BYTES, ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug() (+5 more)

### Community 94 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 95 - "admins/actions.ts"
Cohesion: 0.27
Nodes (18): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+10 more)

### Community 96 - "[audience]/page.tsx"
Cohesion: 0.19
Nodes (11): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), getAdminPurchaseRequestFilterOptions(), parseAdminPurchaseRequestFilters(), isAdminPurchaseRequestSort() (+3 more)

### Community 97 - "AdsTrendChart.tsx"
Cohesion: 0.36
Nodes (6): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), TrendPoint

### Community 98 - "lib/branches.ts"
Cohesion: 0.25
Nodes (9): AdminBranchesPage(), dynamic, metadata, BRANCH_INCLUDE, BRANCH_ORDER_BY, BranchWithPlace, listBranches(), listProvinceOptions() (+1 more)

### Community 99 - "SponsorsManager.tsx"
Cohesion: 0.25
Nodes (8): SponsorFormModalProps, ModalState, SponsorsManagerProps, SponsorsTable(), SponsorsTableProps, SponsorsMarqueeItem, SponsorsMarqueeProps, SponsorRecord

### Community 100 - "MyBuyAdsManager.tsx"
Cohesion: 0.24
Nodes (9): BuyAdCardProps, BuyAdFormProps, MyBuyAdCardProps, FILTERS, MyBuyAdsManager(), MyBuyAdsManagerProps, NewBuyAdButton(), StateFilter (+1 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES

### Community 102 - "uploads.ts"
Cohesion: 0.17
Nodes (15): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), RouteContext, runtime (+7 more)

### Community 103 - "BranchesManager"
Cohesion: 0.42
Nodes (9): BranchesManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord(), byDisplayOrder() (+1 more)

### Community 104 - "lib/sponsors.ts"
Cohesion: 0.32
Nodes (6): AdminSponsorsPage(), dynamic, metadata, listSponsors(), PublicSponsor, SPONSOR_ORDER_BY

### Community 105 - "PurchaseRequestsManager"
Cohesion: 0.29
Nodes (7): buildPageList(), groupCode(), PageLink(), PurchaseRequestsManager(), changeStatus(), showToast(), RequestRow()

### Community 106 - "@prisma/client"
Cohesion: 0.17
Nodes (17): @prisma/client, addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic (+9 more)

### Community 107 - "admin/page.tsx"
Cohesion: 0.40
Nodes (5): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, LoginForm(), handleSubmit()

### Community 108 - "parseJalaliDate"
Cohesion: 0.83
Nodes (3): div(), jalaliToGregorian(), parseJalaliDate()

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **28 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 688 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `server-only`, `admin-buy-ads.ts`, `AdsManager`, `UsersManager.tsx`, `isTrustedOrigin`, `VerificationManager.tsx`, `cars/actions.ts`, `utils.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `price-list.ts`, `guards.ts`, `ContactView.tsx`, `Toggle`, `cn`, `normalizeDigits`, `sponsors/actions.ts`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `react`, `currency.ts`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `buy-ads-shared.ts`, `user-car-extras.ts`, `CurrencyRates.tsx`, `UserAuthCard.tsx`, `AdminsManager.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `AdDetailView.tsx`, `purchase-request-actions.ts`, `search/page.tsx`, `next`, `SaleAdFormModal`, `market-rates.ts`, `dashboard.ts`, `BranchesSection.tsx`, `StatTile.tsx`, `AdsTrendChart.tsx`, `SponsorsManager.tsx`, `MyBuyAdsManager.tsx`, `requests/page.tsx`, `BranchesManager`, `PurchaseRequestsManager`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07496194824961948 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `server-only`, `admin-buy-ads.ts`, `UsersManager.tsx`, `isTrustedOrigin`, `VerificationManager.tsx`, `(app)/about/page.tsx`, `cars/actions.ts`, `utils.ts`, `car-form/actions.ts`, `formatPersianNumber`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `session.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `admin/auth-actions.ts`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `price-list.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `AttentionList.tsx`, `cn`, `sponsors/actions.ts`, `package.json`, `sale-ads/actions.ts`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `react`, `currency.ts`, `BranchFormModal.tsx`, `lib/system-settings.ts`, `buy-ads-shared.ts`, `UserAuthCard.tsx`, `AdminsManager.tsx`, `requireAdmin`, `AdKindTabs.tsx`, `AdminShell.tsx`, `middleware.ts`, `purchase-requests-shared.ts`, `AdDetailView.tsx`, `purchase-request-actions.ts`, `user-auth.ts`, `search/page.tsx`, `branches/actions.ts`, `market-rates.ts`, `dashboard.ts`, `users/actions.ts`, `BranchesSection.tsx`, `ads/page.tsx`, `StatTile.tsx`, `admins/actions.ts`, `[audience]/page.tsx`, `lib/branches.ts`, `MyBuyAdsManager.tsx`, `requests/page.tsx`, `uploads.ts`, `lib/sponsors.ts`, `@prisma/client`, `admin/page.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10121457489878542 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `server-only`, `admin-buy-ads.ts`, `AdsManager`, `UsersManager.tsx`, `VerificationManager.tsx`, `toPersianDigits`, `cars/actions.ts`, `utils.ts`, `car-form/actions.ts`, `formatPersianNumber`, `PurchaseRequestDetailManager.tsx`, `system-settings-shared.ts`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `SaleAdFormModal.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `price-list.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `AttentionList.tsx`, `Toggle`, `sponsors/actions.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `react`, `currency.ts`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `UserAuthCard.tsx`, `AdminsManager.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `AdDetailView.tsx`, `user-auth.ts`, `search/page.tsx`, `next`, `SaleAdFormModal`, `market-rates.ts`, `BranchesSection.tsx`, `StatTile.tsx`, `AdsTrendChart.tsx`, `SponsorsManager.tsx`, `MyBuyAdsManager.tsx`, `requests/page.tsx`, `PurchaseRequestsManager`, `admin/page.tsx`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._