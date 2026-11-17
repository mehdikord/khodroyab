# Graph Report - khodroyab  (2026-11-17)

## Corpus Check
- 404 files · ~280,073 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2804 nodes · 9596 edges · 108 communities (102 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f469def6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- VerificationManager.tsx
- UserProfile.tsx
- admin-buy-ads.ts
- AdsManager.tsx
- ads/page.tsx
- admins/actions.ts
- cn
- Admin authentication flow
- PriceTableManager.tsx
- ThemeSwitch.tsx
- colors/actions.ts
- verification-actions.ts
- panel-search.ts
- car-form/actions.ts
- PurchaseRequestButton.tsx
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- normalizeDigits
- permissions.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- search/page.tsx
- SaleAdFormModal.tsx
- price-table-shared.ts
- cars/actions.ts
- sale-ads/actions.ts
- catalog.ts
- price-list.ts
- removeUpload
- PanelShell.tsx
- prisma.ts
- ContactView.tsx
- admin/auth-actions.ts
- Modal
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- brands/actions.ts
- [audience]/page.tsx
- VerificationManager
- compilerOptions
- Luxury Performance Car Branding
- package.json
- team/actions.ts
- BranchFormModal.tsx
- (app)/page.tsx
- dependencies
- scripts
- SearchFilters.tsx
- Toggle
- price-market.ts
- rich-text.ts
- SystemSettingsForm
- proxy.ts
- dashboard.ts
- RichTextEditor.tsx
- devDependencies
- CurrencyRates.tsx
- uploads.ts
- user-codes.ts
- images/page.tsx
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- requireAdmin
- formatPersianNumber
- DivarImportManager.tsx
- purchase-requests-shared.ts
- AdminVerificationForm
- validation/purchase-requests.ts
- utils.ts
- admin.ts
- verification-submission.ts
- StatTile.tsx
- next
- react
- [...path]/route.ts
- users/actions.ts
- AdKindTabs.tsx
- AdsTrendChart.tsx
- PurchaseRequestsManager
- lib/purchase-requests.ts
- car-types/page.tsx
- getCurrentUser
- settings/actions.ts
- AdminShell.tsx
- cars/route.ts
- admin/page.tsx
- BuyAdDetailView.tsx
- currency.ts
- requests/page.tsx
- lib/user-cars.ts
- roles/actions.ts
- lib/buy-ads.ts
- adminActionDenied
- isTrustedOrigin
- validation/admins.ts
- validation/brands.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 336 edges
2. `toPersianDigits()` - 287 edges
3. `react` - 229 edges
4. `next` - 171 edges
5. `lucide-react` - 163 edges
6. `formatPersianNumber()` - 85 edges
7. `prisma` - 76 edges
8. `isTrustedOrigin()` - 67 edges
9. `requireAdminAccess()` - 57 edges
10. `Toast()` - 54 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAdminsPage()` --indirect_call--> `adminRoleToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAllAdsPage()` --indirect_call--> `userCarToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/user-cars.ts
- `AdminBrandsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/brands/page.tsx → src/lib/brands.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (108 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.09
Nodes (50): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+42 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.05
Nodes (55): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+47 more)

### Community 2 - "VerificationManager.tsx"
Cohesion: 0.15
Nodes (22): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS (+14 more)

### Community 3 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (22): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+14 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (66): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+58 more)

### Community 5 - "AdsManager.tsx"
Cohesion: 0.07
Nodes (50): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, PageLink(), AdsTable() (+42 more)

### Community 6 - "ads/page.tsx"
Cohesion: 0.13
Nodes (24): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+16 more)

### Community 7 - "admins/actions.ts"
Cohesion: 0.21
Nodes (22): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+14 more)

### Community 8 - "cn"
Cohesion: 0.10
Nodes (34): BuyAdDetailManager(), Confirm, RankMedal(), Spec(), Stat(), StatePill(), PersonAvatar(), PersonCell() (+26 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "PriceTableManager.tsx"
Cohesion: 0.10
Nodes (33): ModalState, STATUS_FILTERS, CarTypeFormModalProps, CarTypesManagerProps, CarFormModalProps, CarsManager(), handleConfirmDelete(), handleCreateSuccess() (+25 more)

### Community 11 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.16
Nodes (21): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+13 more)

### Community 13 - "verification-actions.ts"
Cohesion: 0.14
Nodes (17): AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, dynamic, metadata, PanelVerificationPage(), review() (+9 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.14
Nodes (25): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+17 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.14
Nodes (23): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+15 more)

### Community 16 - "PurchaseRequestButton.tsx"
Cohesion: 0.19
Nodes (15): clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), fieldClass(), FieldError(), groupCode() (+7 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.10
Nodes (29): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, deliverOtpSms() (+21 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.17
Nodes (18): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, CardTitle(), CodeChip(), groupCode(), PersonFlags() (+10 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.11
Nodes (33): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+25 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.12
Nodes (30): ContactField, ContactValues, SettingsProvinceOption, SystemSettingsFormProps, applyCoordsText(), PRICE_TABLE_PRICE_FIELDS, parseActiveProvinceIds(), parseEnabledPriceFields() (+22 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (31): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+23 more)

### Community 22 - "normalizeDigits"
Cohesion: 0.15
Nodes (19): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, PRICE_CURRENCIES, isValidTierYear(), normalizeYear(), normalizeDigits(), BuyAdInput (+11 more)

### Community 23 - "permissions.ts"
Cohesion: 0.20
Nodes (15): AdminShellUser, AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PermissionChipsProps, AuthorizedAdmin (+7 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.11
Nodes (34): dynamic, GET(), BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest() (+26 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.15
Nodes (22): BuyAdOffersResult, BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), cleanDigits() (+14 more)

### Community 27 - "search/page.tsx"
Cohesion: 0.14
Nodes (18): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), dateFormatter (+10 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (29): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow(), TermRow, AdExtraFieldsProps, AdFieldTheme (+21 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (24): DEFAULT_PRICE_TABLE_CURRENCY, countPriceListSellers(), comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS (+16 more)

### Community 30 - "cars/actions.ts"
Cohesion: 0.28
Nodes (14): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+6 more)

### Community 31 - "sale-ads/actions.ts"
Cohesion: 0.08
Nodes (59): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+51 more)

### Community 32 - "catalog.ts"
Cohesion: 0.12
Nodes (36): AdminBrandsPage(), dynamic, metadata, AdminCarsPage(), dynamic, metadata, guardRequest(), parseBigInt() (+28 more)

### Community 33 - "price-list.ts"
Cohesion: 0.11
Nodes (38): CarOffersViewProps, PriceListBrowserProps, CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn() (+30 more)

### Community 34 - "removeUpload"
Cohesion: 0.36
Nodes (10): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+2 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.14
Nodes (18): PanelAppLayout(), DollarTicker(), activeDockKey(), PAGE_TITLES, PANEL_NAV_ITEMS, PanelNavItem, panelPageTitle(), startsWith() (+10 more)

### Community 36 - "prisma.ts"
Cohesion: 0.08
Nodes (35): @prisma/client, server-only, AdminPendingAdsPage(), dynamic, metadata, AdminCarImportPage(), dynamic, metadata (+27 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (26): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+18 more)

### Community 38 - "admin/auth-actions.ts"
Cohesion: 0.12
Nodes (30): jose, getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS (+22 more)

### Community 39 - "Modal"
Cohesion: 0.10
Nodes (28): AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManagerProps, faDate, Stat(), PERMISSION_ICONS (+20 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.11
Nodes (38): dynamic, generateMetadata(), PageProps, PriceListCarPage(), dynamic, PageProps, SellerPriceListPage(), CarOffersView() (+30 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.14
Nodes (29): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+21 more)

### Community 42 - "brands/actions.ts"
Cohesion: 0.14
Nodes (26): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+18 more)

### Community 43 - "[audience]/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, generateMetadata(), PageProps, toAudience(), PURCHASE_REQUEST_AUDIENCE_LABELS

### Community 44 - "VerificationManager"
Cohesion: 0.21
Nodes (12): submitVerificationAction(), FieldError(), identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), SubmittedDocuments(), VerificationManager() (+4 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 47 - "package.json"
Cohesion: 0.10
Nodes (19): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+11 more)

### Community 48 - "team/actions.ts"
Cohesion: 0.18
Nodes (26): createTeamMemberAction(), deleteTeamMemberAction(), guardRequest(), nextSortOrder(), parseId(), PHOTO_REQUIRED, reorderTeamMembersAction(), revalidateTeamPages() (+18 more)

### Community 49 - "BranchFormModal.tsx"
Cohesion: 0.05
Nodes (74): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+66 more)

### Community 50 - "(app)/page.tsx"
Cohesion: 0.11
Nodes (22): metadata, PageProps, PanelLoginPage(), PanelLogo(), PanelLogoProps, SIZES, fieldClass(), FieldIcon() (+14 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+5 more)

### Community 53 - "SearchFilters.tsx"
Cohesion: 0.15
Nodes (18): DEFAULTS, SearchFiltersProps, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange() (+10 more)

### Community 54 - "Toggle"
Cohesion: 0.08
Nodes (35): BranchesTable(), BrandsTable(), inputClassName(), ItemDraft, OptionFormModalProps, OptionsManagerProps, OptionsTable(), OptionsTableProps (+27 more)

### Community 55 - "price-market.ts"
Cohesion: 0.21
Nodes (17): PlateGlyph(), PriceMarketIcon(), PriceMarketTabsProps, TabBadge, MyPriceTableManagerProps, PriceTableMarketEditorProps, CollaboratorShortcutsProps, Visibility (+9 more)

### Community 56 - "rich-text.ts"
Cohesion: 0.27
Nodes (9): sanitize-html, COLOR, CSS_SIZE, isRichTextEmpty(), normalizeRichText(), renderRichText(), RICH_TEXT_MAX_LENGTH, sanitizeRichText() (+1 more)

### Community 57 - "SystemSettingsForm"
Cohesion: 0.29
Nodes (11): ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError(), handleSubmit(), setContactField() (+3 more)

### Community 58 - "proxy.ts"
Cohesion: 0.32
Nodes (7): AREAS, config, isPassthrough(), PASSTHROUGH_PREFIXES, ProtectedArea, proxy(), redirectTo()

### Community 59 - "dashboard.ts"
Cohesion: 0.26
Nodes (11): RecentAdsProps, bucketByDay(), computeDelta(), DashboardRecentAd, dayKey(), faDate, faLongDate, faShortDate (+3 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.12
Nodes (21): dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps (+13 more)

### Community 63 - "uploads.ts"
Cohesion: 0.09
Nodes (28): dynamic, fail(), POST(), RouteContext, runtime, dynamic, GET(), notFound() (+20 more)

### Community 64 - "user-codes.ts"
Cohesion: 0.13
Nodes (20): generateMetadata(), generateMetadata(), dynamic, metadata, PanelSellersPage(), SellersDirectory(), PUBLIC_AD_WHERE, PUBLIC_SELLER_WHERE (+12 more)

### Community 65 - "images/page.tsx"
Cohesion: 0.27
Nodes (9): CarImagesPage(), dynamic, metadata, PageProps, CarImagesManagerProps, CarImageRecord, carImageToRecord(), CarVideoRecord (+1 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.20
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.20
Nodes (21): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+13 more)

### Community 73 - "requireAdmin"
Cohesion: 0.36
Nodes (6): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), requireAdmin(), countUnseenPurchaseRequests()

### Community 74 - "formatPersianNumber"
Cohesion: 0.20
Nodes (20): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), CatalogOverview(), DashboardCard(), DashboardCardProps (+12 more)

### Community 76 - "DivarImportManager.tsx"
Cohesion: 0.06
Nodes (62): DivarImportBatchResult, DivarScanBrand, DivarScanResult, guardRequest(), importDivarBatchAction(), scanDivarDataAction(), CarTypeActionResult, CarTypeSimpleActionResult (+54 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.14
Nodes (27): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, PurchaseRequestsManagerProps, AdminPurchaseRequestPage, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS, ADMIN_PURCHASE_REQUEST_SORT_LABELS (+19 more)

### Community 78 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 79 - "validation/purchase-requests.ts"
Cohesion: 0.17
Nodes (12): PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX, PURCHASE_REQUEST_NOTE_MAX, adminNoteSchema, descriptionSchema, field(), guestSchema, ParsedPurchaseRequestForm (+4 more)

### Community 80 - "utils.ts"
Cohesion: 0.09
Nodes (38): ModalState, DeleteTarget, UploadResult, UploadState, ColorsManagerProps, ModalState, ColorsTable(), ColorsTableProps (+30 more)

### Community 81 - "admin.ts"
Cohesion: 0.13
Nodes (17): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), isValidNationalCode(), optionalDigits(), ProfileUpdateInput (+9 more)

### Community 82 - "verification-submission.ts"
Cohesion: 0.13
Nodes (13): SubmitVerificationResult, isValidCompanyNationalId(), removeVerificationFiles(), saveVerificationFile(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission (+5 more)

### Community 83 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 84 - "next"
Cohesion: 0.10
Nodes (36): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+28 more)

### Community 85 - "react"
Cohesion: 0.07
Nodes (17): lucide-react, react, react-dom, CarTypesTable(), CarTypesTableProps, ComingSoonProps, InfoTab, TABS (+9 more)

### Community 86 - "[...path]/route.ts"
Cohesion: 0.33
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 87 - "users/actions.ts"
Cohesion: 0.22
Nodes (18): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+10 more)

### Community 88 - "AdKindTabs.tsx"
Cohesion: 0.24
Nodes (10): framer-motion, dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS (+2 more)

### Community 89 - "AdsTrendChart.tsx"
Cohesion: 0.36
Nodes (6): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), TrendPoint

### Community 90 - "PurchaseRequestsManager"
Cohesion: 0.29
Nodes (7): buildPageList(), groupCode(), PageLink(), PurchaseRequestsManager(), changeStatus(), showToast(), RequestRow()

### Community 91 - "lib/purchase-requests.ts"
Cohesion: 0.11
Nodes (32): AdminPurchaseRequestsPage(), div(), jalaliToGregorian(), parseJalaliDate(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, audienceWhere(), buildOrderBy(), buildWhere() (+24 more)

### Community 92 - "car-types/page.tsx"
Cohesion: 0.43
Nodes (5): AdminCarTypesPage(), dynamic, metadata, carTypeToRecord(), serializeCarType()

### Community 93 - "getCurrentUser"
Cohesion: 0.11
Nodes (25): dynamic, GET(), AdDetailPage(), dynamic, metadata, dynamic, metadata, PageProps (+17 more)

### Community 94 - "settings/actions.ts"
Cohesion: 0.43
Nodes (5): saveSystemSettingsAction(), SystemSettingsActionResult, saveSystemSettings(), applyRotationToActiveCodes(), parseSystemSettingsForm()

### Community 95 - "AdminShell.tsx"
Cohesion: 0.17
Nodes (17): ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup, AdminNavItem, AdminSubNavItem, findActiveNavItem(), getVisibleNavGroups() (+9 more)

### Community 96 - "cars/route.ts"
Cohesion: 0.48
Nodes (6): dynamic, GET(), idOrNull(), listBrandCarChoices(), searchCarChoices(), toCarChoice()

### Community 97 - "admin/page.tsx"
Cohesion: 0.29
Nodes (8): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo(), AdminLogoProps, LoginForm(), handleSubmit(), getCurrentAdmin()

### Community 98 - "BuyAdDetailView.tsx"
Cohesion: 0.11
Nodes (35): ColorSwatch(), ColorSwatchProps, AdGallery(), NoImage(), MyAdCard(), NoImage(), STATUS_HINT, BuyAdNoImage() (+27 more)

### Community 99 - "currency.ts"
Cohesion: 0.17
Nodes (22): AdDetailView(), AdDetailViewProps, PriceEquivalent(), SectionTitle(), Spec(), AdPriceHistory(), percent(), PriceHistoryPanel() (+14 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.29
Nodes (4): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests()

### Community 103 - "lib/user-cars.ts"
Cohesion: 0.09
Nodes (26): AdminUserProfilePage(), dynamic, metadata, PageProps, AdminUsersPage(), dynamic, metadata, USER_DIRECTORY_ACCESS (+18 more)

### Community 104 - "roles/actions.ts"
Cohesion: 0.15
Nodes (21): dynamic, metadata, createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId() (+13 more)

### Community 105 - "lib/buy-ads.ts"
Cohesion: 0.07
Nodes (45): BuyAdDetailPage(), dynamic, metadata, BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdDetailViewProps (+37 more)

### Community 106 - "adminActionDenied"
Cohesion: 0.21
Nodes (16): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesManager(), handleConfirmDelete() (+8 more)

### Community 107 - "isTrustedOrigin"
Cohesion: 0.32
Nodes (9): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), authorizeAdminAction(), isTrustedOrigin(), savePurchaseRequestNote(), setPurchaseRequestStatus() (+1 more)

### Community 108 - "validation/admins.ts"
Cohesion: 0.24
Nodes (10): AdminFormInput, emailSchema, idSchema, nameSchema, parseAdminForm(), parseRoleForm(), roleSchema, text() (+2 more)

### Community 112 - "validation/brands.ts"
Cohesion: 0.08
Nodes (24): zod, brandCoreSchema, BrandFormValues, fallbackSlug(), MAX_IMAGE_SIZE_BYTES, ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess (+16 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 766 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `VerificationManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `AdsManager.tsx`, `PriceTableManager.tsx`, `colors/actions.ts`, `verification-actions.ts`, `car-form/actions.ts`, `PurchaseRequestButton.tsx`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `normalizeDigits`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `sale-ads/actions.ts`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `Modal`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `VerificationManager`, `team/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `SearchFilters.tsx`, `Toggle`, `price-market.ts`, `SystemSettingsForm`, `dashboard.ts`, `CurrencyRates.tsx`, `user-codes.ts`, `formatPersianNumber`, `DivarImportManager.tsx`, `purchase-requests-shared.ts`, `AdminVerificationForm`, `utils.ts`, `verification-submission.ts`, `StatTile.tsx`, `next`, `react`, `users/actions.ts`, `AdKindTabs.tsx`, `AdsTrendChart.tsx`, `PurchaseRequestsManager`, `getCurrentUser`, `AdminShell.tsx`, `BuyAdDetailView.tsx`, `currency.ts`, `requests/page.tsx`, `roles/actions.ts`, `lib/buy-ads.ts`, `adminActionDenied`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09117475160724722 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `VerificationManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `AdsManager.tsx`, `ads/page.tsx`, `admins/actions.ts`, `cn`, `PriceTableManager.tsx`, `ThemeSwitch.tsx`, `colors/actions.ts`, `verification-actions.ts`, `car-form/actions.ts`, `PurchaseRequestButton.tsx`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `permissions.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `SaleAdFormModal.tsx`, `cars/actions.ts`, `sale-ads/actions.ts`, `catalog.ts`, `removeUpload`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `admin/auth-actions.ts`, `Modal`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `[audience]/page.tsx`, `package.json`, `team/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `SearchFilters.tsx`, `price-market.ts`, `proxy.ts`, `dashboard.ts`, `CurrencyRates.tsx`, `uploads.ts`, `user-codes.ts`, `images/page.tsx`, `requireAdmin`, `formatPersianNumber`, `DivarImportManager.tsx`, `purchase-requests-shared.ts`, `utils.ts`, `verification-submission.ts`, `StatTile.tsx`, `react`, `[...path]/route.ts`, `users/actions.ts`, `AdKindTabs.tsx`, `car-types/page.tsx`, `getCurrentUser`, `settings/actions.ts`, `AdminShell.tsx`, `cars/route.ts`, `admin/page.tsx`, `BuyAdDetailView.tsx`, `currency.ts`, `requests/page.tsx`, `lib/user-cars.ts`, `roles/actions.ts`, `lib/buy-ads.ts`, `adminActionDenied`, `isTrustedOrigin`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05432595573440644 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `VerificationManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `AdsManager.tsx`, `admins/actions.ts`, `PriceTableManager.tsx`, `ThemeSwitch.tsx`, `colors/actions.ts`, `PurchaseRequestButton.tsx`, `PurchaseRequestDetailManager.tsx`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `permissions.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `SaleAdFormModal.tsx`, `cars/actions.ts`, `sale-ads/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `Modal`, `price-list/[carId]/page.tsx`, `brands/actions.ts`, `VerificationManager`, `BranchFormModal.tsx`, `(app)/page.tsx`, `SearchFilters.tsx`, `Toggle`, `price-market.ts`, `SystemSettingsForm`, `RichTextEditor.tsx`, `CurrencyRates.tsx`, `user-codes.ts`, `BranchesMap.tsx`, `formatPersianNumber`, `DivarImportManager.tsx`, `purchase-requests-shared.ts`, `AdminVerificationForm`, `utils.ts`, `StatTile.tsx`, `next`, `react`, `users/actions.ts`, `AdKindTabs.tsx`, `AdsTrendChart.tsx`, `PurchaseRequestsManager`, `getCurrentUser`, `AdminShell.tsx`, `admin/page.tsx`, `BuyAdDetailView.tsx`, `currency.ts`, `requests/page.tsx`, `adminActionDenied`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._