# Graph Report - khodroyab  (2026-11-12)

## Corpus Check
- 345 files · ~244,436 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2236 nodes · 7359 edges · 97 communities (91 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b901014`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- Toast
- UserProfile.tsx
- CarsManager.tsx
- getCurrentUser
- lib/user-cars.ts
- adminActionDenied
- user.ts
- verification-submission.ts
- Admin authentication flow
- sale-ads/actions.ts
- cn
- colors/actions.ts
- brands/actions.ts
- panel-search.ts
- car-form/actions.ts
- lucide-react
- isTrustedOrigin
- price-table-shared.ts
- lib/price-table.ts
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- khodroyab-data.ts
- SearchFilters.tsx
- AdminShell.tsx
- SaleAdFormModal.tsx
- validation/price-table.ts
- UserAuthCard.tsx
- MyAdForm.tsx
- lib/cars.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- verification-actions.ts
- ContactView.tsx
- price-list/page.tsx
- PriceListBrowser.tsx
- app/layout.tsx
- zod
- sponsors/actions.ts
- ads/actions.ts
- panel/auth-actions.ts
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- ThemeSwitch.tsx
- middleware.ts
- toPersianDigits
- dependencies
- scripts
- BrandsManager
- react
- BuyAdForm.tsx
- BranchesSection.tsx
- search/buy/page.tsx
- validation/system-settings.ts
- buy-ads-shared.ts
- (app)/search/page.tsx
- devDependencies
- CurrencyRates.tsx
- AdExtraFields.tsx
- users/[id]/page.tsx
- requireUser
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- tailwindcss
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- prisma.ts
- validation/brands.ts
- panel/page.tsx
- BranchFormModal.tsx
- AdsTrendChart.tsx
- SponsorsManager
- authenticate.ts
- StatTile.tsx
- currency.ts
- next
- ColorsManager
- admin/page.tsx
- (app)/about/page.tsx
- validation/sponsors.ts
- AdsManager
- UserFormModal.tsx
- SaleAdFormModal
- formatPersianNumber
- admins/actions.ts
- normalizeDigits
- uploads.ts
- images/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 277 edges
2. `toPersianDigits()` - 209 edges
3. `react` - 205 edges
4. `lucide-react` - 144 edges
5. `next` - 142 edges
6. `prisma` - 65 edges
7. `formatPersianNumber()` - 64 edges
8. `isTrustedOrigin()` - 54 edges
9. `Toast()` - 44 edges
10. `requireAdminAccess()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAllAdsPage()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/cars.ts
- `AdminAllAdsPage()` --indirect_call--> `colorToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/colors.ts
- `AdminBrandsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/brands/page.tsx → src/lib/brands.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Dusk/dark marketing imagery with orange light accents** — public_images_road_coastal_image, public_images_safe_delivery_image, public_images_showroom_freezone_image, concept_dark_orange_visual_identity [INFERRED 0.75]
- **Consistent dark-studio, orange-accent premium car imagery set** — public_images_car_headlight_macro_image, public_images_car_sedan_exec_image, public_images_car_suv_luxury_image [INFERRED 0.85]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]
- **Shared dark/orange-accent marketing photography set** — public_images_hero_car_image, public_images_interior_cockpit_image, public_images_quality_engine_image, concept_dark_orange_visual_identity [INFERRED 0.95]

## Communities (97 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (65): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+57 more)

### Community 1 - "Toast"
Cohesion: 0.07
Nodes (48): react-dom, guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata (+40 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.14
Nodes (28): revalidateVerificationPages(), reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview() (+20 more)

### Community 3 - "CarsManager.tsx"
Cohesion: 0.06
Nodes (59): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarActionResult (+51 more)

### Community 4 - "getCurrentUser"
Cohesion: 0.20
Nodes (13): dynamic, GET(), getCurrentUser(), isPartnerUser(), fetchFromSource(), getMarketRates(), Item, itemSchema (+5 more)

### Community 5 - "lib/user-cars.ts"
Cohesion: 0.09
Nodes (34): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+26 more)

### Community 6 - "adminActionDenied"
Cohesion: 0.20
Nodes (19): deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), digitQuery(), FILTERS (+11 more)

### Community 7 - "user.ts"
Cohesion: 0.14
Nodes (16): FieldErrors, optionalDigits(), ProfileUpdateInput, COMPANY_NAME_MAX_LENGTH, companyNameSchema, IRANIAN_MOBILE_REGEX, otpCodeSchema, parseOtpRequestForm() (+8 more)

### Community 8 - "verification-submission.ts"
Cohesion: 0.05
Nodes (55): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), AdminVerificationFormProps, DocDraft, FieldError() (+47 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "sale-ads/actions.ts"
Cohesion: 0.21
Nodes (22): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+14 more)

### Community 11 - "cn"
Cohesion: 0.20
Nodes (17): BranchesTable(), OptionsTable(), OptionsTableProps, typeLabel(), PriceTableCarsTable(), SponsorsTable(), Badge(), BadgeProps (+9 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.21
Nodes (16): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+8 more)

### Community 13 - "brands/actions.ts"
Cohesion: 0.18
Nodes (19): BrandActionResult, BrandSimpleActionResult, createBrandAction(), guardRequest(), toggleBrandActiveAction(), updateBrandAction(), BrandFormModal(), handleSubmit() (+11 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.10
Nodes (30): dynamic, SearchTabsLayout(), countPublicBuyAds(), adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), countPublicSaleAds() (+22 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.11
Nodes (29): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+21 more)

### Community 16 - "lucide-react"
Cohesion: 0.11
Nodes (36): lucide-react, AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionItem, AttentionList(), AttentionListProps (+28 more)

### Community 17 - "isTrustedOrigin"
Cohesion: 0.17
Nodes (16): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), Bucket, buckets (+8 more)

### Community 18 - "price-table-shared.ts"
Cohesion: 0.15
Nodes (24): dynamic, PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), sortOffers(), sortValue() (+16 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.11
Nodes (26): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+18 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.11
Nodes (32): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, ContactField, ContactInput(), ContactValues (+24 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (34): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+26 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.14
Nodes (21): BuyAdDetailPage(), dynamic, metadata, buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE, buyAdDetailInclude, buyAdInclude (+13 more)

### Community 23 - "session.ts"
Cohesion: 0.29
Nodes (12): getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), getAuthSecret(), SessionAudience, verifySessionToken(), issueSessionToken() (+4 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.21
Nodes (18): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setBuyAdActiveAction() (+10 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.08
Nodes (42): framer-motion, AboutPage(), ICON_MAP, ContactPage(), LicensesPage(), HomePage(), ICON_MAP, BODY_TYPES (+34 more)

### Community 26 - "SearchFilters.tsx"
Cohesion: 0.15
Nodes (18): DEFAULTS, SearchFiltersProps, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange() (+10 more)

### Community 27 - "AdminShell.tsx"
Cohesion: 0.11
Nodes (23): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavGroup, AdminNavItem (+15 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.13
Nodes (31): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTableProps (+23 more)

### Community 29 - "validation/price-table.ts"
Cohesion: 0.15
Nodes (16): DEFAULT_PRICE_TABLE_CURRENCY, digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PRICE_MAX_DIGITS, PRICE_TABLE_YEAR_MAX, PRICE_TABLE_YEAR_MIN, isBlankTier() (+8 more)

### Community 30 - "UserAuthCard.tsx"
Cohesion: 0.22
Nodes (14): getClientIp(), minutes(), requestOtpAction(), verifyOtpAction(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown() (+6 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.15
Nodes (14): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, AdImagesField(), CurrencyToggle() (+6 more)

### Community 32 - "lib/cars.ts"
Cohesion: 0.15
Nodes (22): AdminCarsPage(), dynamic, metadata, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages() (+14 more)

### Community 33 - "price-list.ts"
Cohesion: 0.17
Nodes (22): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices() (+14 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.17
Nodes (20): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+12 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.17
Nodes (13): findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem, panelNavItemsFor(), PanelDrawer(), PanelNotice(), Avatar() (+5 more)

### Community 36 - "verification-actions.ts"
Cohesion: 0.15
Nodes (17): AdminUserProfilePage(), adminSubmitVerificationAction(), AdminSubmitVerificationResult, ReviewVerificationResult, submitVerificationAction(), SubmitVerificationResult, dynamic, metadata (+9 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.16
Nodes (18): metadata, PanelContactPage(), base, IconProps, InstagramIcon(), TelegramIcon(), WhatsappIcon(), buildChannels() (+10 more)

### Community 38 - "price-list/page.tsx"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+1 more)

### Community 39 - "PriceListBrowser.tsx"
Cohesion: 0.18
Nodes (13): Edges, HorizontalScroller(), HorizontalScrollerProps, ColumnHeading(), carHref(), hasAnyPrice(), PriceListBrowser(), openRow() (+5 more)

### Community 40 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): jetbrainsMono, metadata, RootLayout(), vazirmatn, Footer(), DOCK_ITEMS, MobileBottomDock(), Navbar() (+4 more)

### Community 41 - "zod"
Cohesion: 0.33
Nodes (5): zod, COLOR_CODE_PATTERN, colorCoreSchema, ColorFormValues, ParsedColorForm

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.17
Nodes (24): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+16 more)

### Community 43 - "ads/actions.ts"
Cohesion: 0.16
Nodes (28): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+20 more)

### Community 44 - "panel/auth-actions.ts"
Cohesion: 0.15
Nodes (16): logoutUserAction(), RequestOtpActionResult, VerifyOtpActionResult, deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH (+8 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 46 - "Dark + Orange Accent Visual Identity"
Cohesion: 0.14
Nodes (16): Dark + Orange Accent Visual Identity, Executive Sedan, Free Zone Car Import, Luxury Performance Car Branding, Luxury SUV, Safe Delivery & Pre-Delivery Inspection, Vehicle Quality Inspection, Car Headlight Macro Photo (+8 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, prisma, seed, private, version, autoprefixer, clsx, jose (+8 more)

### Community 48 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 49 - "middleware.ts"
Cohesion: 0.21
Nodes (11): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AREAS, config, isPassthrough(), middleware() (+3 more)

### Community 50 - "toPersianDigits"
Cohesion: 0.13
Nodes (32): AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdCardProps (+24 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "BrandsManager"
Cohesion: 0.39
Nodes (9): deleteBrandAction(), isPrismaCode(), BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleToggleActive(), handleUpdateSuccess() (+1 more)

### Community 54 - "react"
Cohesion: 0.14
Nodes (5): react, ComingSoonProps, CenterFlow(), CenterFlowNodeItem, CenterFlowProps

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.22
Nodes (12): ColorsTable(), ColorSwatch(), ColorSwatchProps, BuyAdForm(), BuyAdFormColor, digitsToAscii(), FieldError(), inputClass() (+4 more)

### Community 56 - "BranchesSection.tsx"
Cohesion: 0.20
Nodes (12): BranchMapPoint, ConsultationFab(), ConsultationFabProps, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout() (+4 more)

### Community 57 - "search/buy/page.tsx"
Cohesion: 0.22
Nodes (13): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), hrefFor(), pageWindow(), SearchPagination() (+5 more)

### Community 58 - "validation/system-settings.ts"
Cohesion: 0.24
Nodes (12): LocationPicker(), applyCoordsText(), formatGeoPoint(), parseGeoPoint(), asciiDigits(), asUrl(), hostIs(), normalizeHandleLink() (+4 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.21
Nodes (13): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_SORT_LABELS, BUY_AD_SORTS, BuyAdFilterOption (+5 more)

### Community 60 - "(app)/search/page.tsx"
Cohesion: 0.24
Nodes (10): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+2 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.24
Nodes (11): ChangePill(), CURRENCIES, CurrencyRatesProps, Flash, formatJalali(), formatRial(), RateCard(), Status (+3 more)

### Community 63 - "AdExtraFields.tsx"
Cohesion: 0.21
Nodes (12): AdFieldTheme, AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES, AdExtrasState, AdImageDraft (+4 more)

### Community 64 - "users/[id]/page.tsx"
Cohesion: 0.14
Nodes (16): dynamic, metadata, PageProps, AdminUsersPage(), dynamic, metadata, USER_DIRECTORY_ACCESS, userCarInclude (+8 more)

### Community 65 - "requireUser"
Cohesion: 0.27
Nodes (7): dynamic, metadata, PanelDashboardPage(), PanelAppLayout(), CountdownRing(), CurrencyRates(), requireUser()

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.21
Nodes (20): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+12 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.31
Nodes (7): dynamic, MyAdsTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS

### Community 74 - "prisma.ts"
Cohesion: 0.09
Nodes (32): @prisma/client, server-only, AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata (+24 more)

### Community 76 - "validation/brands.ts"
Cohesion: 0.25
Nodes (7): brandCoreSchema, BrandFormValues, fallbackSlug(), ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug()

### Community 77 - "panel/page.tsx"
Cohesion: 0.36
Nodes (6): metadata, PanelLoginPage(), PanelLogo(), PanelLogoProps, SIZES, listActiveSponsors()

### Community 78 - "BranchFormModal.tsx"
Cohesion: 0.08
Nodes (55): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+47 more)

### Community 79 - "AdsTrendChart.tsx"
Cohesion: 0.36
Nodes (6): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), TrendPoint

### Community 80 - "SponsorsManager"
Cohesion: 0.50
Nodes (8): byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord()

### Community 81 - "authenticate.ts"
Cohesion: 0.48
Nodes (5): authenticateAdmin(), CurrentAdmin, consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword()

### Community 82 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 83 - "currency.ts"
Cohesion: 0.14
Nodes (19): CurrencyTag(), CurrencyToggleProps, AdPriceHistory(), percent(), PriceHistoryPanel(), AdCardProps, PriceDeltaBadge(), PriceDeltaBadgeProps (+11 more)

### Community 84 - "next"
Cohesion: 0.09
Nodes (38): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+30 more)

### Community 85 - "ColorsManager"
Cohesion: 0.60
Nodes (6): ColorsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 86 - "admin/page.tsx"
Cohesion: 0.40
Nodes (5): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, getCurrentAdmin(), readSessionFromCookies()

### Community 87 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 88 - "validation/sponsors.ts"
Cohesion: 0.25
Nodes (6): MAX_IMAGE_SIZE_BYTES, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX, SponsorFormValues, sponsorSchema

### Community 89 - "AdsManager"
Cohesion: 0.36
Nodes (8): AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList(), PageLink()

### Community 90 - "UserFormModal.tsx"
Cohesion: 0.39
Nodes (7): createUserAction(), updateUserAction(), inputClassName(), UserFormModal(), handleSubmit(), UserFormModalProps, UserRecord

### Community 91 - "SaleAdFormModal"
Cohesion: 0.17
Nodes (7): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow(), useAdExtras(), addFiles()

### Community 92 - "formatPersianNumber"
Cohesion: 0.18
Nodes (24): AdDetailPage(), dynamic, metadata, AdsTable(), AdStatusBadge(), STYLES, lowestPrice(), SaleAdsTable() (+16 more)

### Community 95 - "admins/actions.ts"
Cohesion: 0.06
Nodes (80): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+72 more)

### Community 96 - "normalizeDigits"
Cohesion: 0.17
Nodes (18): BUY_AD_DESCRIPTION_MAX, MILEAGE_MAX, isValidTierYear(), normalizeYear(), AdminLoginInput, adminLoginSchema, normalizeDigits(), normalizePhone() (+10 more)

### Community 102 - "uploads.ts"
Cohesion: 0.07
Nodes (32): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+24 more)

### Community 106 - "images/actions.ts"
Cohesion: 0.21
Nodes (16): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic, metadata (+8 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `subscriptions/actions.ts`, `Toast`, `UserProfile.tsx`, `CarsManager.tsx`, `getCurrentUser`, `lib/user-cars.ts`, `adminActionDenied`, `verification-submission.ts`, `sale-ads/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `car-form/actions.ts`, `lucide-react`, `isTrustedOrigin`, `price-table-shared.ts`, `lib/price-table.ts`, `SystemSettingsForm.tsx`, `lib/buy-ads.ts`, `session.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `SearchFilters.tsx`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `verification-actions.ts`, `ContactView.tsx`, `price-list/page.tsx`, `PriceListBrowser.tsx`, `app/layout.tsx`, `sponsors/actions.ts`, `ads/actions.ts`, `panel/auth-actions.ts`, `package.json`, `ThemeSwitch.tsx`, `middleware.ts`, `toPersianDigits`, `react`, `BuyAdForm.tsx`, `BranchesSection.tsx`, `search/buy/page.tsx`, `(app)/search/page.tsx`, `users/[id]/page.tsx`, `requireUser`, `AdKindTabs.tsx`, `prisma.ts`, `panel/page.tsx`, `BranchFormModal.tsx`, `StatTile.tsx`, `admin/page.tsx`, `(app)/about/page.tsx`, `formatPersianNumber`, `admins/actions.ts`, `uploads.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0688088283024992 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `Toast`, `UserProfile.tsx`, `CarsManager.tsx`, `lib/user-cars.ts`, `adminActionDenied`, `verification-submission.ts`, `cn`, `colors/actions.ts`, `brands/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `lucide-react`, `isTrustedOrigin`, `price-table-shared.ts`, `lib/price-table.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `SearchFilters.tsx`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `verification-actions.ts`, `ContactView.tsx`, `price-list/page.tsx`, `PriceListBrowser.tsx`, `app/layout.tsx`, `sponsors/actions.ts`, `package.json`, `ThemeSwitch.tsx`, `toPersianDigits`, `BuyAdForm.tsx`, `BranchesSection.tsx`, `search/buy/page.tsx`, `buy-ads-shared.ts`, `(app)/search/page.tsx`, `CurrencyRates.tsx`, `AdExtraFields.tsx`, `users/[id]/page.tsx`, `requireUser`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `prisma.ts`, `panel/page.tsx`, `BranchFormModal.tsx`, `AdsTrendChart.tsx`, `StatTile.tsx`, `currency.ts`, `next`, `admin/page.tsx`, `(app)/about/page.tsx`, `UserFormModal.tsx`, `formatPersianNumber`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `Toast` be split into smaller, more focused modules?**
  _Cohesion score 0.06504494976203067 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `Toast`, `UserProfile.tsx`, `CarsManager.tsx`, `adminActionDenied`, `verification-submission.ts`, `colors/actions.ts`, `brands/actions.ts`, `car-form/actions.ts`, `lucide-react`, `isTrustedOrigin`, `price-table-shared.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `buy/actions.ts`, `khodroyab-data.ts`, `SearchFilters.tsx`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/page.tsx`, `PriceListBrowser.tsx`, `app/layout.tsx`, `sponsors/actions.ts`, `ThemeSwitch.tsx`, `toPersianDigits`, `react`, `BuyAdForm.tsx`, `BranchesSection.tsx`, `search/buy/page.tsx`, `validation/system-settings.ts`, `CurrencyRates.tsx`, `AdExtraFields.tsx`, `requireUser`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `panel/page.tsx`, `BranchFormModal.tsx`, `AdsTrendChart.tsx`, `StatTile.tsx`, `currency.ts`, `next`, `AdsManager`, `UserFormModal.tsx`, `SaleAdFormModal`, `formatPersianNumber`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._