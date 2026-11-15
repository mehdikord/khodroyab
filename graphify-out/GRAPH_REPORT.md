# Graph Report - khodroyab  (2026-11-15)

## Corpus Check
- 368 files · ~206,119 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2572 nodes · 8596 edges · 118 communities (111 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a1628e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UserSubscriptionsSection.tsx
- ProfileManager.tsx
- UserProfile.tsx
- cars/actions.ts
- admin-buy-ads.ts
- toPersianDigits
- subscriptions/actions.ts
- purchase-requests/actions.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- (app)/about/page.tsx
- AdDetailView.tsx
- colors/actions.ts
- react
- panel-search.ts
- car-form/actions.ts
- utils.ts
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- admins/actions.ts
- MyAdForm.tsx
- price-table-shared.ts
- MyPriceTableManager.tsx
- SubscriptionPlanFormModal.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- guards.ts
- ContactView.tsx
- ColorSwatch
- SaleAdFormModal
- CarOffersView.tsx
- normalizeDigits
- sponsors/actions.ts
- lib/purchase-requests.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- isTrustedOrigin
- cn
- dependencies
- scripts
- BrandsManager.tsx
- Toggle
- currency.ts
- verification-submission.ts
- SystemSettingsForm.tsx
- server-only
- panel-search-shared.ts
- RichTextEditor.tsx
- devDependencies
- CurrencyRates.tsx
- panel/page.tsx
- profile/actions.ts
- user-car-extras.ts
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
- UrlFilterBar.tsx
- purchase-request-actions.ts
- VerificationManager.tsx
- admin.ts
- search/page.tsx
- BranchFormModal.tsx
- next
- SaleAdFormModal.tsx
- market-rates.ts
- buy/[id]/page.tsx
- adminActionDenied
- ThemeSwitch.tsx
- tailwindcss
- SaleAdsManager.tsx
- prisma.ts
- brands/actions.ts
- uploads.ts
- lib/user-cars.ts
- [audience]/page.tsx
- validation/subscriptions.ts
- UsersManager
- AdsManager
- verification-files.ts
- requests/page.tsx
- [...path]/route.ts
- AdminVerificationForm
- SponsorsManager
- PurchaseRequestsManager
- CarImagesManager.tsx
- price-list/page.tsx
- buy-ads-shared.ts
- [id]/route.ts
- UserVerificationSection
- getSystemSettings
- validation/profile.ts
- images/page.tsx
- PriceCurrency
- SafeImage
- zod
- Toast

## God Nodes (most connected - your core abstractions)
1. `cn()` - 310 edges
2. `toPersianDigits()` - 255 edges
3. `react` - 209 edges
4. `next` - 157 edges
5. `lucide-react` - 150 edges
6. `formatPersianNumber()` - 81 edges
7. `prisma` - 71 edges
8. `isTrustedOrigin()` - 63 edges
9. `requireAdminAccess()` - 53 edges
10. `Toast()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminCarsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/brands.ts
- `AdminCarsPage()` --indirect_call--> `carTypeToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/car-types.ts
- `setCarsPriceTableAction()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/price-table/actions.ts → src/lib/cars.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (118 total, 7 thin omitted)

### Community 0 - "UserSubscriptionsSection.tsx"
Cohesion: 0.15
Nodes (20): UserSubscriptionActionResult, GrantSubscriptionModal(), handleSubmit(), GrantSubscriptionModalProps, GrantSuccess, inputClassName(), SubscriptionBadge(), SubscriptionBadgeProps (+12 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.10
Nodes (31): revalidateProfilePages(), updateProfileAction(), FieldError(), FormAlert(), inputClassName(), labelClassName, SubmitBar(), SubmitBarProps (+23 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (23): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+15 more)

### Community 3 - "cars/actions.ts"
Cohesion: 0.05
Nodes (71): sanitize-html, CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction() (+63 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (75): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+67 more)

### Community 5 - "toPersianDigits"
Cohesion: 0.11
Nodes (22): BuyAdsFilters(), Segmented(), CarTypesTable(), CarsTable(), BranchMapPoint, BestOfferHero(), ConsultationFab(), ConsultationFabProps (+14 more)

### Community 6 - "subscriptions/actions.ts"
Cohesion: 0.25
Nodes (18): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+10 more)

### Community 7 - "purchase-requests/actions.ts"
Cohesion: 0.36
Nodes (8): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), authorizeAdminAction(), savePurchaseRequestNote(), setPurchaseRequestStatus(), isPurchaseRequestStatus()

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.13
Nodes (23): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationStatusBadge(), VerificationStatusBadgeProps, VerificationManagerProps (+15 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "AdDetailView.tsx"
Cohesion: 0.10
Nodes (32): BuyAdsTable(), CurrencyTag(), AdDetailView(), AdDetailViewProps, PriceEquivalent(), SectionTitle(), Spec(), AdGallery() (+24 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.17
Nodes (18): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+10 more)

### Community 13 - "react"
Cohesion: 0.09
Nodes (12): lucide-react, react, react-dom, PriceTableCarsTable(), Filter, FILTERS, ComingSoonProps, ProfileSheetProps (+4 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.14
Nodes (24): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+16 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.14
Nodes (25): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+17 more)

### Community 16 - "utils.ts"
Cohesion: 0.08
Nodes (53): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdminShellUser, AdsTrendChart(), AdsTrendChartProps, MARGIN (+45 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.16
Nodes (20): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+12 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.16
Nodes (19): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, CardTitle(), CodeChip(), groupCode(), PersonFlags() (+11 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.12
Nodes (28): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, dynamic, metadata (+20 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.14
Nodes (25): Visibility, PriceTablePriceField, parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH (+17 more)

### Community 21 - "MyPriceTableManager"
Cohesion: 0.17
Nodes (20): borderFor(), duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), MyPriceTableManager(), addColor(), addYear() (+12 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.14
Nodes (24): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), buildOrderBy(), BUY_AD_PAGE_SIZE, buyAdDetailInclude (+16 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.15
Nodes (23): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), getSessionTtlSeconds(), AdminSessionPayload, audienceMatches() (+15 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.17
Nodes (22): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure(), parseBigInt() (+14 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.15
Nodes (20): BuyAdOffersResult, BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), BuyAdOffersPanelProps, cleanDigits() (+12 more)

### Community 27 - "admins/actions.ts"
Cohesion: 0.06
Nodes (79): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+71 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.10
Nodes (26): ColorsTableProps, SaleAdFormModalProps, SaleAdsManagerProps, AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass() (+18 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (25): DEFAULT_PRICE_TABLE_CURRENCY, mergeDisabledPrices(), ALL_PRICE_FIELD_KEYS, comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY (+17 more)

### Community 30 - "MyPriceTableManager.tsx"
Cohesion: 0.14
Nodes (17): guardRequest(), parseBigInt(), saveMyPriceTableAction(), Drafts, FILTERS, inputBase, isFilled(), isTierPriced() (+9 more)

### Community 31 - "SubscriptionPlanFormModal.tsx"
Cohesion: 0.23
Nodes (13): AdminSubscriptionsPage(), asciiDigits(), inputClassName(), SubscriptionPlanFormModal(), SubscriptionPlanFormModalProps, SubscriptionPlansManager(), handleDelete(), handleToggle() (+5 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.23
Nodes (14): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+6 more)

### Community 33 - "price-list.ts"
Cohesion: 0.14
Nodes (27): generateMetadata(), PriceListBrowserProps, CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn() (+19 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.22
Nodes (16): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+8 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.12
Nodes (21): DollarTicker(), findActivePanelItem(), GUEST_NAV_KEYS, GUEST_SHORT_LABELS, PANEL_GUEST_NAV_ITEMS, PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem (+13 more)

### Community 36 - "guards.ts"
Cohesion: 0.12
Nodes (18): AdminPendingAdsPage(), dynamic, metadata, AdminPurchaseRequestsIndex(), AdminRolesPage(), dynamic, metadata, AdminSaleTermsPage() (+10 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.16
Nodes (18): metadata, PanelContactPage(), base, IconProps, InstagramIcon(), TelegramIcon(), WhatsappIcon(), buildChannels() (+10 more)

### Community 38 - "ColorSwatch"
Cohesion: 0.22
Nodes (10): ColorsTable(), ColorSwatch(), ColorSwatchProps, MyAdCard(), NoImage(), STATUS_HINT, FILTERS, MyAdsManager() (+2 more)

### Community 39 - "SaleAdFormModal"
Cohesion: 0.21
Nodes (9): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow(), SaleAdsManager(), handleConfirmDelete(), handleToggleActive() (+1 more)

### Community 40 - "CarOffersView.tsx"
Cohesion: 0.10
Nodes (36): dynamic, PageProps, PriceListCarPage(), CarOffersView(), compareDigits(), PriceOrder, sortOffers(), sortValue() (+28 more)

### Community 41 - "normalizeDigits"
Cohesion: 0.17
Nodes (17): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, isValidTierYear(), normalizeYear(), normalizeDigits(), BuyAdInput, buyAdSchema (+9 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.16
Nodes (25): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+17 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.11
Nodes (30): div(), jalaliToGregorian(), parseJalaliDate(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, AdminPurchaseRequestPage, buildOrderBy(), buildWhere(), carLabelOf() (+22 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (18): name, prisma, seed, private, version, autoprefixer, clsx, jose (+10 more)

### Community 48 - "sale-ads/actions.ts"
Cohesion: 0.15
Nodes (38): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+30 more)

### Community 49 - "isTrustedOrigin"
Cohesion: 0.19
Nodes (14): adminSubmitVerificationAction(), AdminSubmitVerificationResult, ReviewVerificationResult, guardRequest(), submitVerificationAction(), SubmitVerificationResult, isTrustedOrigin(), getCurrentUser() (+6 more)

### Community 50 - "cn"
Cohesion: 0.20
Nodes (21): BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdCardProps, BuyAdDetailView(), MovementBadge() (+13 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "BrandsManager.tsx"
Cohesion: 0.14
Nodes (21): toggleBrandActiveAction(), AdminBrandsPage(), dynamic, metadata, BrandFormModal(), BrandFormModalProps, inputClassName(), BrandsManager() (+13 more)

### Community 54 - "Toggle"
Cohesion: 0.15
Nodes (20): AdsTable(), AdsTableProps, AdStatusBadge(), OptionsTable(), OptionsTableProps, typeLabel(), SponsorsTable(), SponsorsTableProps (+12 more)

### Community 55 - "currency.ts"
Cohesion: 0.20
Nodes (14): CurrencyToggle(), AdCarChoice, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass() (+6 more)

### Community 56 - "verification-submission.ts"
Cohesion: 0.16
Nodes (6): isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission, ParseVerificationResult, StoreVerificationResult

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.21
Nodes (15): ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard(), SettingsProvinceOption, SystemSettingsForm() (+7 more)

### Community 58 - "server-only"
Cohesion: 0.10
Nodes (24): server-only, AdminUserProfilePage(), dynamic, metadata, PageProps, AdminUsersPage(), dynamic, metadata (+16 more)

### Community 59 - "panel-search-shared.ts"
Cohesion: 0.18
Nodes (14): PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, AdDetailSaleTerm, SEARCH_SORT_LABELS, SEARCH_SORTS, SearchAdSaleTerm (+6 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.16
Nodes (16): dynamic, metadata, PanelDashboardPage(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps, Flash (+8 more)

### Community 63 - "panel/page.tsx"
Cohesion: 0.12
Nodes (21): metadata, PageProps, PanelLoginPage(), SponsorsMarquee(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown() (+13 more)

### Community 64 - "profile/actions.ts"
Cohesion: 0.26
Nodes (10): ProfileActionResult, dynamic, faTime, metadata, PanelProfilePage(), requireUser(), emptyAdStats(), ProfileRow (+2 more)

### Community 65 - "user-car-extras.ts"
Cohesion: 0.24
Nodes (11): AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson(), planImages() (+3 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.17
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.24
Nodes (10): framer-motion, dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS (+2 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.09
Nodes (31): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+23 more)

### Community 76 - "middleware.ts"
Cohesion: 0.21
Nodes (11): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AREAS, config, isPassthrough(), middleware() (+3 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.17
Nodes (23): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, PurchaseRequestsManagerProps, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS, ADMIN_PURCHASE_REQUEST_SORT_LABELS, ADMIN_PURCHASE_REQUEST_SORTS (+15 more)

### Community 78 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 79 - "purchase-request-actions.ts"
Cohesion: 0.12
Nodes (21): clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), handleSubmit(), listProvinceOptions(), PURCHASE_REQUEST_DESCRIPTION_MAX (+13 more)

### Community 80 - "VerificationManager.tsx"
Cohesion: 0.20
Nodes (14): DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), PERSON_TYPE_ICONS (+6 more)

### Community 81 - "admin.ts"
Cohesion: 0.16
Nodes (13): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), COMPANY_NAME_MAX_LENGTH, IRANIAN_MOBILE_REGEX, otpCodeSchema (+5 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.18
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+6 more)

### Community 83 - "BranchFormModal.tsx"
Cohesion: 0.08
Nodes (55): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+47 more)

### Community 84 - "next"
Cohesion: 0.12
Nodes (31): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+23 more)

### Community 85 - "SaleAdFormModal.tsx"
Cohesion: 0.11
Nodes (26): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdStatusBadgeProps (+18 more)

### Community 86 - "market-rates.ts"
Cohesion: 0.17
Nodes (15): dynamic, GET(), AdDetailPage(), dynamic, metadata, fetchFromSource(), getConversionRates(), getMarketRates() (+7 more)

### Community 87 - "buy/[id]/page.tsx"
Cohesion: 0.25
Nodes (9): dynamic, GET(), BuyAdDetailPage(), dynamic, metadata, buildWhere(), getBuyAdDetail(), getBuyAdOffersState() (+1 more)

### Community 88 - "adminActionDenied"
Cohesion: 0.20
Nodes (19): createUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction(), inputClassName() (+11 more)

### Community 89 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 91 - "SaleAdsManager.tsx"
Cohesion: 0.31
Nodes (7): SaleTermsManagerProps, SaleTermsTable(), SaleTermsTableProps, ToastProps, ToastState, Filter, SaleTermRecord

### Community 92 - "prisma.ts"
Cohesion: 0.11
Nodes (39): @prisma/client, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull() (+31 more)

### Community 93 - "brands/actions.ts"
Cohesion: 0.17
Nodes (18): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), updateBrandAction(), handleSubmit() (+10 more)

### Community 94 - "uploads.ts"
Cohesion: 0.19
Nodes (15): dynamic, fail(), POST(), RouteContext, runtime, EXTENSION_TO_MIME, sanitizeBaseName(), saveVideoStream() (+7 more)

### Community 95 - "lib/user-cars.ts"
Cohesion: 0.18
Nodes (10): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow, userCarOptionsInclude (+2 more)

### Community 96 - "[audience]/page.tsx"
Cohesion: 0.21
Nodes (11): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), audienceWhere(), getAdminPurchaseRequestCounts(), getAdminPurchaseRequestFilterOptions() (+3 more)

### Community 97 - "validation/subscriptions.ts"
Cohesion: 0.29
Nodes (9): SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS, field(), firstErrors(), grantSubscriptionSchema, parseGrantSubscriptionForm(), parseSubscriptionPlanForm(), SubscriptionPlanInput (+1 more)

### Community 98 - "UsersManager"
Cohesion: 0.33
Nodes (9): deleteUserAction(), digitQuery(), matchesFilter(), UsersManager(), handleDelete(), handleToggleActive(), handleToggleCollaborate(), showToast() (+1 more)

### Community 99 - "AdsManager"
Cohesion: 0.36
Nodes (8): AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList(), PageLink()

### Community 100 - "verification-files.ts"
Cohesion: 0.33
Nodes (5): MIME_TO_EXTENSION, removeVerificationFiles(), resolveVerificationFile(), saveVerificationFile(), VERIFICATION_ROOT

### Community 101 - "requests/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES

### Community 102 - "[...path]/route.ts"
Cohesion: 0.29
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 103 - "AdminVerificationForm"
Cohesion: 0.28
Nodes (8): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName(), newDoc()

### Community 104 - "SponsorsManager"
Cohesion: 0.27
Nodes (12): AdminSponsorsPage(), dynamic, metadata, byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved() (+4 more)

### Community 105 - "PurchaseRequestsManager"
Cohesion: 0.18
Nodes (12): Chip(), PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented(), buildPageList(), groupCode(), PageLink() (+4 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.15
Nodes (24): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesManager(), handleConfirmDelete() (+16 more)

### Community 107 - "price-list/page.tsx"
Cohesion: 0.39
Nodes (7): dynamic, metadata, PanelPriceListPage(), StatTile(), LiveClock(), countPriceListSellers(), joinFa()

### Community 108 - "buy-ads-shared.ts"
Cohesion: 0.29
Nodes (10): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_SORT_LABELS, BUY_AD_SORTS, BuyAdFilterOption (+2 more)

### Community 109 - "[id]/route.ts"
Cohesion: 0.40
Nodes (5): dynamic, GET(), notFound(), RouteContext, runtime

### Community 110 - "UserVerificationSection"
Cohesion: 0.60
Nodes (5): revalidateVerificationPages(), reviewVerificationAction(), UserVerificationSection(), review(), showToast()

### Community 113 - "getSystemSettings"
Cohesion: 0.27
Nodes (8): saveSystemSettingsAction(), SystemSettingsActionResult, PanelAppLayout(), getSystemSettings, parseRotationMinutes(), saveSystemSettings(), applyRotationToActiveCodes(), parseSystemSettingsForm()

### Community 115 - "validation/profile.ts"
Cohesion: 0.24
Nodes (7): isValidCompanyNationalId(), isValidNationalCode(), optionalDigits(), ProfileUpdateInput, profileUpdateSchema, companyNameSchema, readIdentity()

### Community 116 - "images/page.tsx"
Cohesion: 0.39
Nodes (6): CarImagesPage(), dynamic, metadata, PageProps, carImageToRecord(), carVideoToRecord()

### Community 117 - "PriceCurrency"
Cohesion: 0.28
Nodes (9): CurrencyToggleProps, CarOffersViewProps, Draft, PriceCurrency, PriceListCarDetail, PriceListOffer, PriceListPricesByColumn, PriceColumn (+1 more)

### Community 118 - "SafeImage"
Cohesion: 0.18
Nodes (11): AdCarPickerProps, CarMediaSlider(), CarMediaSliderProps, MediaViewer(), slideOffset(), SafeImage(), SafeImageProps, SponsorCard() (+3 more)

### Community 119 - "zod"
Cohesion: 0.14
Nodes (11): zod, MAX_IMAGE_SIZE_BYTES, optionCoreSchema, OptionFormValues, optionItemSchema, ParsedOptionForm, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH (+3 more)

### Community 123 - "Toast"
Cohesion: 0.17
Nodes (14): ColorsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast(), ColorsManagerProps, ModalState (+6 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 716 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `UserSubscriptionsSection.tsx`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `AdminVerificationForm.tsx`, `AdDetailView.tsx`, `react`, `car-form/actions.ts`, `utils.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `MyAdForm.tsx`, `price-table-shared.ts`, `MyPriceTableManager.tsx`, `SubscriptionPlanFormModal.tsx`, `(panel)/price-table/actions.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `ColorSwatch`, `SaleAdFormModal`, `CarOffersView.tsx`, `normalizeDigits`, `sponsors/actions.ts`, `isTrustedOrigin`, `cn`, `BrandsManager.tsx`, `Toggle`, `currency.ts`, `verification-submission.ts`, `SystemSettingsForm.tsx`, `panel-search-shared.ts`, `CurrencyRates.tsx`, `panel/page.tsx`, `user-car-extras.ts`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager.tsx`, `search/page.tsx`, `BranchFormModal.tsx`, `next`, `SaleAdFormModal.tsx`, `market-rates.ts`, `adminActionDenied`, `SaleAdsManager.tsx`, `UsersManager`, `AdsManager`, `requests/page.tsx`, `AdminVerificationForm`, `SponsorsManager`, `PurchaseRequestsManager`, `CarImagesManager.tsx`, `price-list/page.tsx`, `buy-ads-shared.ts`, `UserVerificationSection`, `validation/profile.ts`, `SafeImage`, `Toast`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UserSubscriptionsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14855072463768115 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `UserSubscriptionsSection.tsx`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `toPersianDigits`, `AdminVerificationForm.tsx`, `AdDetailView.tsx`, `colors/actions.ts`, `react`, `car-form/actions.ts`, `utils.ts`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `MyAdForm.tsx`, `MyPriceTableManager.tsx`, `SubscriptionPlanFormModal.tsx`, `(panel)/price-table/actions.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `ColorSwatch`, `SaleAdFormModal`, `CarOffersView.tsx`, `sponsors/actions.ts`, `BrandsManager.tsx`, `Toggle`, `currency.ts`, `SystemSettingsForm.tsx`, `RichTextEditor.tsx`, `CurrencyRates.tsx`, `panel/page.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `VerificationManager.tsx`, `search/page.tsx`, `BranchFormModal.tsx`, `next`, `SaleAdFormModal.tsx`, `adminActionDenied`, `ThemeSwitch.tsx`, `SaleAdsManager.tsx`, `UsersManager`, `AdsManager`, `requests/page.tsx`, `AdminVerificationForm`, `PurchaseRequestsManager`, `CarImagesManager.tsx`, `price-list/page.tsx`, `UserVerificationSection`, `SafeImage`, `Toast`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09743589743589744 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `UserSubscriptionsSection.tsx`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `toPersianDigits`, `subscriptions/actions.ts`, `purchase-requests/actions.ts`, `(app)/about/page.tsx`, `AdDetailView.tsx`, `colors/actions.ts`, `react`, `car-form/actions.ts`, `utils.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `MyAdForm.tsx`, `MyPriceTableManager.tsx`, `(panel)/price-table/actions.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `ColorSwatch`, `CarOffersView.tsx`, `sponsors/actions.ts`, `package.json`, `sale-ads/actions.ts`, `isTrustedOrigin`, `cn`, `BrandsManager.tsx`, `Toggle`, `currency.ts`, `server-only`, `CurrencyRates.tsx`, `panel/page.tsx`, `profile/actions.ts`, `AdKindTabs.tsx`, `AdminShell.tsx`, `middleware.ts`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager.tsx`, `search/page.tsx`, `BranchFormModal.tsx`, `SaleAdFormModal.tsx`, `market-rates.ts`, `buy/[id]/page.tsx`, `adminActionDenied`, `ThemeSwitch.tsx`, `SaleAdsManager.tsx`, `prisma.ts`, `brands/actions.ts`, `uploads.ts`, `[audience]/page.tsx`, `requests/page.tsx`, `[...path]/route.ts`, `SponsorsManager`, `CarImagesManager.tsx`, `price-list/page.tsx`, `getSystemSettings`, `images/page.tsx`, `SafeImage`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._