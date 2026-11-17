# Graph Report - khodroyab  (2026-11-17)

## Corpus Check
- 395 files · ~275,669 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2747 nodes · 9316 edges · 118 communities (111 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f469def6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- CarOffersView.tsx
- admin-buy-ads.ts
- SaleAdFormModal.tsx
- server-only
- admins/actions.ts
- BuyAdDetailManager.tsx
- Admin authentication flow
- cars/actions.ts
- getSystemSettings
- colors/actions.ts
- next
- panel-search.ts
- OptionsManager.tsx
- panel-search-shared.ts
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- buy-ads-shared.ts
- validation/car-types.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- search/page.tsx
- MyAdForm.tsx
- currency.ts
- ads/actions.ts
- sale-ads/actions.ts
- PriceTableManager.tsx
- price-list.ts
- removeUpload
- PanelShell.tsx
- prisma.ts
- ContactView.tsx
- session.ts
- permissions.ts
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- BrandsManager
- [audience]/page.tsx
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- team/actions.ts
- PurchaseRequestButton.tsx
- (app)/page.tsx
- dependencies
- scripts
- UrlFilterBar.tsx
- cn
- price-market.ts
- rich-text.ts
- SystemSettingsForm.tsx
- proxy.ts
- BuyAdsManager.tsx
- RichTextEditor.tsx
- devDependencies
- CurrencyRates.tsx
- uploads.ts
- user-codes.ts
- getCurrentUser
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- admin/page.tsx
- formatPersianNumber
- DivarImportManager.tsx
- purchase-requests-shared.ts
- RoleFormModal
- validation/purchase-requests.ts
- Toast
- normalizeDigits
- verification-submission.ts
- BuyAdForm.tsx
- user-auth.ts
- react
- [...path]/route.ts
- users/actions.ts
- AdKindTabs.tsx
- zod
- tailwindcss
- lib/purchase-requests.ts
- AdsManager.tsx
- market-rates.ts
- UserAuthCard.tsx
- AdminShell.tsx
- user-car-extras.ts
- admin/auth-actions.ts
- toPersianDigits
- AdDetailView.tsx
- [code]/page.tsx
- PurchaseRequestsManager.tsx
- ProfileEditForm.tsx
- lib/user-cars.ts
- lib/admins.ts
- lib/buy-ads.ts
- CarImagesManager.tsx
- purchase-requests/actions.ts
- validation/admins.ts
- divar-import.ts
- car-import/actions.ts
- AdsManager
- validation/team.ts
- CarTypesManager
- SaleAdFormModal
- authenticate.ts
- PurchaseRequestsFilters
- SponsorsMarquee.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 333 edges
2. `toPersianDigits()` - 280 edges
3. `react` - 225 edges
4. `next` - 168 edges
5. `lucide-react` - 161 edges
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
- `AdminAdminsPage()` --indirect_call--> `adminToRecord()`  [INFERRED]
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

## Communities (118 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.08
Nodes (53): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+45 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.09
Nodes (32): dynamic, faTime, metadata, PanelProfilePage(), CollaboratorShortcuts(), Shortcut(), ProfileEditFormProps, ActionTile() (+24 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.05
Nodes (69): revalidateVerificationPages(), reviewVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), AdminVerificationFormProps (+61 more)

### Community 3 - "CarOffersView.tsx"
Cohesion: 0.24
Nodes (12): CarOffersViewProps, compareDigits(), PriceOrder, sortOffers(), sortValue(), UpdatedAt(), PriceListCarDetailInfo, PriceListCarInfo (+4 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.10
Nodes (31): AdminBuyAdDetailPage(), dynamic, metadata, PageProps, AdminBuyAdsPage(), dynamic, metadata, PageProps (+23 more)

### Community 5 - "SaleAdFormModal.tsx"
Cohesion: 0.14
Nodes (20): AdsFiltersProps, PARAM_KEYS, AdStatusBadgeProps, STYLES, SEGMENTS, StatusBreakdownProps, SearchableSelectOption, SearchableSelectProps (+12 more)

### Community 6 - "server-only"
Cohesion: 0.15
Nodes (29): @prisma/client, server-only, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single() (+21 more)

### Community 7 - "admins/actions.ts"
Cohesion: 0.17
Nodes (25): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+17 more)

### Community 8 - "BuyAdDetailManager.tsx"
Cohesion: 0.15
Nodes (29): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+21 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "cars/actions.ts"
Cohesion: 0.10
Nodes (40): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+32 more)

### Community 11 - "getSystemSettings"
Cohesion: 0.20
Nodes (14): PanelAppLayout(), PanelSectionLayout(), viewport, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+6 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.14
Nodes (22): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+14 more)

### Community 13 - "next"
Cohesion: 0.13
Nodes (24): next, BrandActionResult, BrandSimpleActionResult, createBrandAction(), guardRequest(), updateBrandAction(), OptionActionResult, OptionSimpleActionResult (+16 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.16
Nodes (23): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+15 more)

### Community 15 - "OptionsManager.tsx"
Cohesion: 0.17
Nodes (19): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), revalidateOptionPages(), toggleOptionActiveAction(), updateOptionAction(), OptionFormModal() (+11 more)

### Community 16 - "panel-search-shared.ts"
Cohesion: 0.13
Nodes (19): AdDetailViewProps, AdCardProps, PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, UsdRateInfo, AdDetailRecord (+11 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.18
Nodes (18): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+10 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.16
Nodes (18): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, CardTitle(), CodeChip(), groupCode(), PersonFlags() (+10 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.11
Nodes (32): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+24 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.14
Nodes (25): applyCoordsText(), parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH, MAX_AD_PAGE_NOTICE_LENGTH (+17 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.09
Nodes (34): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+26 more)

### Community 22 - "buy-ads-shared.ts"
Cohesion: 0.12
Nodes (21): BuyAdDetailViewProps, BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BuyAdOffersPanelProps, BUY_AD_DESCRIPTION_MAX, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS (+13 more)

### Community 23 - "validation/car-types.ts"
Cohesion: 0.19
Nodes (12): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+4 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.23
Nodes (16): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setBuyAdActiveAction() (+8 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.12
Nodes (28): dynamic, GET(), BuyAdOffersResult, findBiddableAd(), offersFailure(), submitBuyAdOfferAction(), withdrawBuyAdOfferAction(), BuyAdOffersPanel() (+20 more)

### Community 27 - "search/page.tsx"
Cohesion: 0.24
Nodes (10): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+2 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.12
Nodes (20): AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES (+12 more)

### Community 29 - "currency.ts"
Cohesion: 0.09
Nodes (35): CurrencyToggleProps, CURRENCY_LABELS, DEFAULT_PRICE_TABLE_CURRENCY, PRICE_CURRENCIES, PriceCurrency, countPriceListSellers(), PriceListCarDetail, PriceListRow (+27 more)

### Community 30 - "ads/actions.ts"
Cohesion: 0.22
Nodes (20): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+12 more)

### Community 31 - "sale-ads/actions.ts"
Cohesion: 0.21
Nodes (23): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+15 more)

### Community 32 - "PriceTableManager.tsx"
Cohesion: 0.24
Nodes (14): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), Filter (+6 more)

### Community 33 - "price-list.ts"
Cohesion: 0.17
Nodes (26): CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn(), jalaliDate, listPriceListRows() (+18 more)

### Community 34 - "removeUpload"
Cohesion: 0.12
Nodes (25): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+17 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.13
Nodes (18): ConsultationFab(), DollarTicker(), activeDockKey(), PAGE_TITLES, PANEL_NAV_ITEMS, PanelNavItem, panelPageTitle(), startsWith() (+10 more)

### Community 36 - "prisma.ts"
Cohesion: 0.07
Nodes (42): AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata, AdminCarFormPage(), dynamic (+34 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (25): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+17 more)

### Community 38 - "session.ts"
Cohesion: 0.21
Nodes (16): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches(), createSessionToken() (+8 more)

### Community 39 - "permissions.ts"
Cohesion: 0.18
Nodes (17): AdminFormModalProps, AdminsManagerProps, AttentionItem, CatalogItem, PERMISSION_ICONS, PermissionChips(), PermissionChipsProps, RoleFormModalProps (+9 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.12
Nodes (35): dynamic, generateMetadata(), PageProps, PriceListCarPage(), dynamic, metadata, PageProps, PanelPriceListPage() (+27 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.14
Nodes (32): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+24 more)

### Community 42 - "BrandsManager"
Cohesion: 0.36
Nodes (10): deleteBrandAction(), isPrismaCode(), toggleBrandActiveAction(), BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleToggleActive() (+2 more)

### Community 43 - "[audience]/page.tsx"
Cohesion: 0.27
Nodes (7): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), getAdminPurchaseRequestFilterOptions(), PURCHASE_REQUEST_AUDIENCE_LABELS

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+9 more)

### Community 48 - "team/actions.ts"
Cohesion: 0.06
Nodes (55): createTeamMemberAction(), deleteTeamMemberAction(), guardRequest(), nextSortOrder(), parseId(), PHOTO_REQUIRED, reorderTeamMembersAction(), revalidateTeamPages() (+47 more)

### Community 49 - "PurchaseRequestButton.tsx"
Cohesion: 0.05
Nodes (74): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+66 more)

### Community 50 - "(app)/page.tsx"
Cohesion: 0.21
Nodes (10): metadata, PageProps, PanelLoginPage(), PanelLogo(), DASHBOARD_ENABLED, isPublicPanelPath(), PANEL_HOME, PUBLIC_PANEL_PATTERNS (+2 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+5 more)

### Community 53 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 54 - "cn"
Cohesion: 0.09
Nodes (38): inputClassName(), BranchesTable(), BrandFormModal(), inputClassName(), BrandsTable(), inputClassName(), inputClassName(), inputClassName() (+30 more)

### Community 55 - "price-market.ts"
Cohesion: 0.15
Nodes (24): UserPriceTablePreviewProps, UserProfileProps, PriceListBrowserProps, PlateGlyph(), PriceMarketIcon(), PriceMarketTabsProps, TabBadge, MyPriceTableManagerProps (+16 more)

### Community 56 - "rich-text.ts"
Cohesion: 0.27
Nodes (9): sanitize-html, COLOR, CSS_SIZE, isRichTextEmpty(), normalizeRichText(), renderRichText(), RICH_TEXT_MAX_LENGTH, sanitizeRichText() (+1 more)

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.15
Nodes (20): saveSystemSettingsAction(), SystemSettingsActionResult, ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard() (+12 more)

### Community 58 - "proxy.ts"
Cohesion: 0.32
Nodes (7): AREAS, config, isPassthrough(), PASSTHROUGH_PREFIXES, ProtectedArea, proxy(), redirectTo()

### Community 59 - "BuyAdsManager.tsx"
Cohesion: 0.23
Nodes (16): BuyAdsFiltersProps, BuyAdsManagerProps, BuyAdsTableProps, AdminBuyAdListResult, ADMIN_BUY_AD_FILTER_DEFAULTS, ADMIN_BUY_AD_PARAM_KEYS, ADMIN_BUY_AD_SORT_LABELS, ADMIN_BUY_AD_SORTS (+8 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.23
Nodes (12): ChangePill(), CURRENCIES, CurrencyRatesProps, Flash, formatJalali(), formatRial(), RateCard(), Status (+4 more)

### Community 63 - "uploads.ts"
Cohesion: 0.11
Nodes (25): dynamic, fail(), POST(), RouteContext, runtime, dynamic, GET(), notFound() (+17 more)

### Community 64 - "user-codes.ts"
Cohesion: 0.15
Nodes (18): dynamic, metadata, PanelSellersPage(), SellersDirectory(), PUBLIC_AD_WHERE, PUBLIC_SELLER_WHERE, displayName(), listPublicSellers() (+10 more)

### Community 65 - "getCurrentUser"
Cohesion: 0.16
Nodes (14): AdDetailPage(), dynamic, metadata, dynamic, metadata, PanelDashboardPage(), dynamic, SearchTabsLayout() (+6 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.17
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.20
Nodes (21): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+13 more)

### Community 73 - "admin/page.tsx"
Cohesion: 0.19
Nodes (11): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), getCurrentAdmin() (+3 more)

### Community 74 - "formatPersianNumber"
Cohesion: 0.08
Nodes (51): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdminShellUser, AdsTrendChart(), AdsTrendChartProps, MARGIN (+43 more)

### Community 76 - "DivarImportManager.tsx"
Cohesion: 0.21
Nodes (14): DivarScanBrand, buildBatches(), CarTypeOption, DivarImportManager(), handleImport(), handleScan(), run(), EMPTY_TOTALS (+6 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.17
Nodes (21): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, PurchaseRequestsManagerProps, AdminPurchaseRequestPage, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS, ADMIN_PURCHASE_REQUEST_SORT_LABELS (+13 more)

### Community 78 - "RoleFormModal"
Cohesion: 0.24
Nodes (14): createRoleAction(), deleteRoleAction(), isUniqueViolation(), parseId(), revalidate(), updateRoleAction(), inputClassName(), RoleFormModal() (+6 more)

### Community 79 - "validation/purchase-requests.ts"
Cohesion: 0.18
Nodes (11): PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX, adminNoteSchema, descriptionSchema, field(), guestSchema, ParsedPurchaseRequestForm, parsePurchaseRequestForm() (+3 more)

### Community 80 - "Toast"
Cohesion: 0.17
Nodes (17): faDate, BrandsManagerProps, ModalState, CarTypesManagerProps, ModalState, ColorsManagerProps, ModalState, SaleTermsManager() (+9 more)

### Community 81 - "normalizeDigits"
Cohesion: 0.09
Nodes (29): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizeDigits(), normalizePhone(), positiveId(), isValidCompanyNationalId() (+21 more)

### Community 82 - "verification-submission.ts"
Cohesion: 0.10
Nodes (19): AdminUserProfilePage(), dynamic, metadata, PageProps, adminSubmitVerificationAction(), AdminSubmitVerificationResult, ReviewVerificationResult, submitVerificationAction() (+11 more)

### Community 83 - "BuyAdForm.tsx"
Cohesion: 0.23
Nodes (12): AdCarChoice, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass(), MILEAGE_PRESETS (+4 more)

### Community 84 - "user-auth.ts"
Cohesion: 0.11
Nodes (31): dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic, metadata (+23 more)

### Community 85 - "react"
Cohesion: 0.06
Nodes (25): lucide-react, react, AdminLogoProps, OptionsTable(), typeLabel(), VerificationStatusBadgeProps, ComingSoonProps, ConsultationFabProps (+17 more)

### Community 86 - "[...path]/route.ts"
Cohesion: 0.26
Nodes (11): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+3 more)

### Community 87 - "users/actions.ts"
Cohesion: 0.13
Nodes (32): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+24 more)

### Community 88 - "AdKindTabs.tsx"
Cohesion: 0.33
Nodes (6): framer-motion, AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS

### Community 89 - "zod"
Cohesion: 0.15
Nodes (10): zod, optionCoreSchema, OptionFormValues, optionItemSchema, ParsedOptionForm, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX (+2 more)

### Community 91 - "lib/purchase-requests.ts"
Cohesion: 0.10
Nodes (30): div(), jalaliToGregorian(), parseJalaliDate(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, audienceWhere(), buildOrderBy(), buildWhere(), carLabelOf() (+22 more)

### Community 92 - "AdsManager.tsx"
Cohesion: 0.14
Nodes (23): AdsFilterValues, AdsUserOption, AdsManagerProps, AdsStatusCounts, buildPageList(), PageLink(), ColorFormModalProps, ColorsTableProps (+15 more)

### Community 93 - "market-rates.ts"
Cohesion: 0.23
Nodes (11): dynamic, GET(), fetchFromSource(), getMarketRates(), Item, itemSchema, nullableNumber, payloadSchema (+3 more)

### Community 94 - "UserAuthCard.tsx"
Cohesion: 0.22
Nodes (11): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+3 more)

### Community 95 - "AdminShell.tsx"
Cohesion: 0.16
Nodes (18): ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup, AdminNavItem, AdminSubNavItem, findActiveNavItem(), getVisibleNavGroups() (+10 more)

### Community 96 - "user-car-extras.ts"
Cohesion: 0.26
Nodes (11): AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson(), planImages(), prepareAdExtras() (+3 more)

### Community 97 - "admin/auth-actions.ts"
Cohesion: 0.29
Nodes (10): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), resetAttempts(), clearSessionCookie() (+2 more)

### Community 98 - "toPersianDigits"
Cohesion: 0.07
Nodes (49): react-dom, BuyAdsFilters(), Segmented(), CarTypesTable(), ColorsTable(), SaleTermsTable(), SubscriptionBadge(), SubscriptionPlansTable() (+41 more)

### Community 99 - "AdDetailView.tsx"
Cohesion: 0.18
Nodes (19): AdsTable(), AdsTableProps, AdStatusBadge(), BuyAdsTable(), lowestPrice(), SaleAdsTable(), CurrencyTag(), AdDetailView() (+11 more)

### Community 100 - "[code]/page.tsx"
Cohesion: 0.26
Nodes (10): dynamic, generateMetadata(), PageProps, SellerProfilePage(), generateMetadata(), hrefFor(), pageWindow(), SearchPagination() (+2 more)

### Community 101 - "PurchaseRequestsManager.tsx"
Cohesion: 0.14
Nodes (16): dynamic, metadata, MyPurchaseRequestsPage(), buildPageList(), groupCode(), PageLink(), PurchaseRequestsManager(), changeStatus() (+8 more)

### Community 102 - "ProfileEditForm.tsx"
Cohesion: 0.32
Nodes (8): FieldError(), FormAlert(), inputClassName(), labelClassName, SubmitBar(), SubmitBarProps, getInitials(), ProfileEditForm()

### Community 103 - "lib/user-cars.ts"
Cohesion: 0.17
Nodes (11): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), AdOptionValue, faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow (+3 more)

### Community 104 - "lib/admins.ts"
Cohesion: 0.27
Nodes (9): AdminAdminsPage(), dynamic, metadata, ADMIN_ORDER_BY, adminRecordSelect, adminRoleInclude, AdminRoleRow, adminRoleToRecord() (+1 more)

### Community 105 - "lib/buy-ads.ts"
Cohesion: 0.08
Nodes (38): BuyAdDetailPage(), dynamic, metadata, BuyAdsSearchPage(), dynamic, metadata, SearchParams, dynamic (+30 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.11
Nodes (31): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesPage(), dynamic (+23 more)

### Community 107 - "purchase-requests/actions.ts"
Cohesion: 0.33
Nodes (9): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), authorizeAdminAction(), savePurchaseRequestNote(), setPurchaseRequestStatus(), isPurchaseRequestStatus() (+1 more)

### Community 108 - "validation/admins.ts"
Cohesion: 0.24
Nodes (10): isAdminPermission(), normalizePermissions(), AdminFormInput, emailSchema, idSchema, nameSchema, parseRoleForm(), roleSchema (+2 more)

### Community 109 - "divar-import.ts"
Cohesion: 0.24
Nodes (10): CarTypeRef, childrenOf(), cleanKey(), DIVAR_DATA_PATH, DivarBrand, DivarCar, DivarNode, ExistingBrandRef (+2 more)

### Community 110 - "car-import/actions.ts"
Cohesion: 0.44
Nodes (9): DivarImportBatchResult, DivarScanResult, guardRequest(), importDivarBatchAction(), scanDivarDataAction(), loadDivarBrands(), matchBrand(), normalizeName() (+1 more)

### Community 111 - "AdsManager"
Cohesion: 0.36
Nodes (7): AdsFilters(), AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast()

### Community 112 - "validation/team.ts"
Cohesion: 0.22
Nodes (7): ParsedTeamMemberForm, TEAM_BIO_MAX_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_POSITION_MAX_LENGTH, TEAM_SORT_ORDER_MAX, TeamMemberFormValues, teamMemberSchema

### Community 113 - "CarTypesManager"
Cohesion: 0.43
Nodes (8): deleteCarTypeAction(), isPrismaCode(), CarTypesManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 114 - "SaleAdFormModal"
Cohesion: 0.33
Nodes (4): FieldError(), nextKey(), SaleAdFormModal(), addRow()

### Community 115 - "authenticate.ts"
Cohesion: 0.48
Nodes (5): authenticateAdmin(), PASSWORD_HASH_ROUNDS, consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword()

### Community 116 - "PurchaseRequestsFilters"
Cohesion: 0.50
Nodes (5): Chip(), PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented()

### Community 117 - "SponsorsMarquee.tsx"
Cohesion: 0.50
Nodes (4): SponsorCard(), SponsorsMarquee(), SponsorsMarqueeItem, SponsorsMarqueeProps

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 759 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarOffersView.tsx`, `SaleAdFormModal.tsx`, `admins/actions.ts`, `BuyAdDetailManager.tsx`, `cars/actions.ts`, `getSystemSettings`, `colors/actions.ts`, `next`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager.tsx`, `BuyAdOffersPanel.tsx`, `MyAdForm.tsx`, `currency.ts`, `PriceTableManager.tsx`, `PanelShell.tsx`, `ContactView.tsx`, `permissions.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `team/actions.ts`, `PurchaseRequestButton.tsx`, `(app)/page.tsx`, `UrlFilterBar.tsx`, `price-market.ts`, `SystemSettingsForm.tsx`, `BuyAdsManager.tsx`, `RichTextEditor.tsx`, `CurrencyRates.tsx`, `user-codes.ts`, `getCurrentUser`, `BranchesMap.tsx`, `formatPersianNumber`, `DivarImportManager.tsx`, `purchase-requests-shared.ts`, `RoleFormModal`, `Toast`, `BuyAdForm.tsx`, `user-auth.ts`, `react`, `users/actions.ts`, `AdKindTabs.tsx`, `AdsManager.tsx`, `UserAuthCard.tsx`, `AdminShell.tsx`, `admin/auth-actions.ts`, `toPersianDigits`, `AdDetailView.tsx`, `[code]/page.tsx`, `PurchaseRequestsManager.tsx`, `ProfileEditForm.tsx`, `lib/buy-ads.ts`, `CarImagesManager.tsx`, `AdsManager`, `SaleAdFormModal`, `PurchaseRequestsFilters`, `SponsorsMarquee.tsx`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0768361581920904 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `SaleAdFormModal.tsx`, `server-only`, `admins/actions.ts`, `BuyAdDetailManager.tsx`, `cars/actions.ts`, `getSystemSettings`, `colors/actions.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `MyAdForm.tsx`, `ads/actions.ts`, `sale-ads/actions.ts`, `PriceTableManager.tsx`, `removeUpload`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `session.ts`, `permissions.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `[audience]/page.tsx`, `package.json`, `team/actions.ts`, `PurchaseRequestButton.tsx`, `(app)/page.tsx`, `UrlFilterBar.tsx`, `cn`, `price-market.ts`, `SystemSettingsForm.tsx`, `proxy.ts`, `BuyAdsManager.tsx`, `uploads.ts`, `user-codes.ts`, `getCurrentUser`, `admin/page.tsx`, `formatPersianNumber`, `purchase-requests-shared.ts`, `verification-submission.ts`, `BuyAdForm.tsx`, `user-auth.ts`, `react`, `[...path]/route.ts`, `users/actions.ts`, `AdKindTabs.tsx`, `AdsManager.tsx`, `market-rates.ts`, `UserAuthCard.tsx`, `AdminShell.tsx`, `admin/auth-actions.ts`, `toPersianDigits`, `AdDetailView.tsx`, `[code]/page.tsx`, `PurchaseRequestsManager.tsx`, `lib/admins.ts`, `lib/buy-ads.ts`, `CarImagesManager.tsx`, `purchase-requests/actions.ts`, `car-import/actions.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarOffersView.tsx`, `SaleAdFormModal.tsx`, `admins/actions.ts`, `BuyAdDetailManager.tsx`, `cars/actions.ts`, `colors/actions.ts`, `next`, `OptionsManager.tsx`, `panel-search-shared.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `MyPriceTableManager.tsx`, `buy-ads-shared.ts`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `MyAdForm.tsx`, `currency.ts`, `sale-ads/actions.ts`, `PriceTableManager.tsx`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `permissions.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `BrandsManager`, `team/actions.ts`, `PurchaseRequestButton.tsx`, `UrlFilterBar.tsx`, `cn`, `price-market.ts`, `SystemSettingsForm.tsx`, `BuyAdsManager.tsx`, `CurrencyRates.tsx`, `user-codes.ts`, `getCurrentUser`, `formatPersianNumber`, `DivarImportManager.tsx`, `purchase-requests-shared.ts`, `RoleFormModal`, `Toast`, `normalizeDigits`, `verification-submission.ts`, `BuyAdForm.tsx`, `user-auth.ts`, `react`, `users/actions.ts`, `AdKindTabs.tsx`, `AdsManager.tsx`, `UserAuthCard.tsx`, `AdminShell.tsx`, `user-car-extras.ts`, `AdDetailView.tsx`, `[code]/page.tsx`, `PurchaseRequestsManager.tsx`, `ProfileEditForm.tsx`, `lib/buy-ads.ts`, `CarImagesManager.tsx`, `AdsManager`, `CarTypesManager`, `SaleAdFormModal`, `PurchaseRequestsFilters`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._