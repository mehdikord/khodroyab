# Graph Report - khodroyab  (2026-11-12)

## Corpus Check
- 358 files · ~257,306 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2366 nodes · 7873 edges · 90 communities (85 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f464890`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- CarTypesManager
- admin-buy-ads.ts
- requireAdminAccess
- users/actions.ts
- normalizeDigits
- VerificationManager.tsx
- Admin authentication flow
- (app)/about/page.tsx
- Toggle
- ColorsManager.tsx
- SaleTermsManager.tsx
- panel-search.ts
- OptionsManager.tsx
- lucide-react
- panel/auth-actions.ts
- price-table-shared.ts
- lib/price-table.ts
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- khodroyab-data.ts
- BuyAdOffersPanel.tsx
- prisma.ts
- SaleAdFormModal.tsx
- validation/price-table.ts
- admin/auth-actions.ts
- MyAdForm.tsx
- lib/cars.ts
- price-list.ts
- brands/actions.ts
- cn
- react
- ContactView.tsx
- settings/actions.ts
- CarFormModal.tsx
- app/layout.tsx
- admin/page.tsx
- sponsors/actions.ts
- sale-ads/actions.ts
- otp.ts
- compilerOptions
- Dark + Orange Accent Visual Identity
- utils.ts
- Modal
- verification-submission.ts
- toPersianDigits
- dependencies
- scripts
- BrandsManager.tsx
- Toast
- currency.ts
- branches/actions.ts
- next
- users/[id]/page.tsx
- buy-ads-shared.ts
- zod
- devDependencies
- getCurrentUser
- UserAuthCard.tsx
- lib/branches.ts
- CurrencyRates.tsx
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- ThemeSwitch.tsx
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- AdminShell.tsx
- validation/branches.ts
- BranchesManager
- BranchFormModal.tsx
- BuyAdRecord
- [id]/price-table/page.tsx
- (tabs)/page.tsx
- AdPriceHistory.tsx
- requireCollaborator
- PriceListBrowser.tsx
- SaleAdFormModal
- LocationPicker
- admins/actions.ts
- [id]/route.ts
- images/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 298 edges
2. `toPersianDigits()` - 227 edges
3. `react` - 213 edges
4. `next` - 152 edges
5. `lucide-react` - 150 edges
6. `formatPersianNumber()` - 77 edges
7. `prisma` - 67 edges
8. `isTrustedOrigin()` - 56 edges
9. `Toast()` - 48 edges
10. `requireAdminAccess()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAllAdsPage()` --indirect_call--> `userCarToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/user-cars.ts
- `AdminCarsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/brands.ts
- `AdminCarsPage()` --indirect_call--> `carTypeToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/car-types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Dusk/dark marketing imagery with orange light accents** — public_images_road_coastal_image, public_images_safe_delivery_image, public_images_showroom_freezone_image, concept_dark_orange_visual_identity [INFERRED 0.75]
- **Consistent dark-studio, orange-accent premium car imagery set** — public_images_car_headlight_macro_image, public_images_car_sedan_exec_image, public_images_car_suv_luxury_image [INFERRED 0.85]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]
- **Shared dark/orange-accent marketing photography set** — public_images_hero_car_image, public_images_interior_cockpit_image, public_images_quality_engine_image, concept_dark_orange_visual_identity [INFERRED 0.95]

## Communities (90 total, 5 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (62): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+54 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (37): dynamic, faTime, metadata, PanelProfilePage(), FieldError(), FormAlert(), inputClassName(), labelClassName (+29 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (25): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+17 more)

### Community 3 - "CarTypesManager"
Cohesion: 0.22
Nodes (13): deleteCarTypeAction(), isPrismaCode(), AdminCarTypesPage(), dynamic, metadata, CarTypesManager(), handleConfirmDelete(), handleCreateSuccess() (+5 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (78): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+70 more)

### Community 5 - "requireAdminAccess"
Cohesion: 0.11
Nodes (34): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+26 more)

### Community 6 - "users/actions.ts"
Cohesion: 0.12
Nodes (33): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+25 more)

### Community 7 - "normalizeDigits"
Cohesion: 0.07
Nodes (33): MILEAGE_MAX, AdminLoginInput, adminLoginSchema, FieldErrors, normalizeDigits(), normalizePhone(), positiveId(), isValidCompanyNationalId() (+25 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.07
Nodes (47): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), AdminVerificationFormProps, DocDraft, FieldError() (+39 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "Toggle"
Cohesion: 0.14
Nodes (22): AdDetailPage(), dynamic, metadata, AdsTable(), AdStatusBadge(), BuyAdsTable(), PriceTableCarsTable(), PriceTableCarsTableProps (+14 more)

### Community 12 - "ColorsManager.tsx"
Cohesion: 0.11
Nodes (27): createColorAction(), deleteColorAction(), isPrismaCode(), revalidateColorPages(), updateColorAction(), ColorFormModal(), handleSubmit(), ColorFormModalProps (+19 more)

### Community 13 - "SaleTermsManager.tsx"
Cohesion: 0.17
Nodes (16): createSaleTermAction(), inputClassName(), SaleTermFormModal(), handleSubmit(), SaleTermFormModalProps, SaleTermsManager(), handleDelete(), showToast() (+8 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.05
Nodes (61): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), DEFAULTS (+53 more)

### Community 15 - "OptionsManager.tsx"
Cohesion: 0.10
Nodes (30): createOptionAction(), deleteOptionAction(), isPrismaCode(), revalidateOptionPages(), toggleOptionActiveAction(), updateOptionAction(), inputClassName(), ItemDraft (+22 more)

### Community 16 - "lucide-react"
Cohesion: 0.08
Nodes (53): lucide-react, AdminDashboardPage(), dynamic, greetingFor(), metadata, AdminShellUser, AdsTrendChart(), AdsTrendChartProps (+45 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.17
Nodes (19): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+11 more)

### Community 18 - "price-table-shared.ts"
Cohesion: 0.16
Nodes (22): dynamic, PageProps, PriceListCarPage(), CarOffersView(), compareDigits(), sortOffers(), sortValue(), BrandLogo() (+14 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.13
Nodes (19): guardRequest(), parseBigInt(), saveMyPriceTableAction(), MyPriceTableManagerProps, entrySignature(), faDate, listRecentUserPriceTableEntries(), PriceTableCarRecord (+11 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.16
Nodes (20): ContactField, ContactValues, SystemSettingsFormProps, DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, MAX_ABOUT_TEXT_LENGTH, MAX_AD_PAGE_NOTICE_LENGTH, MAX_CONTACT_ADDRESS_LENGTH (+12 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.11
Nodes (30): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+22 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.14
Nodes (25): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE (+17 more)

### Community 23 - "session.ts"
Cohesion: 0.13
Nodes (24): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches() (+16 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.18
Nodes (19): BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages() (+11 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.07
Nodes (45): framer-motion, AboutPage(), ICON_MAP, ContactPage(), LicensesPage(), HomePage(), ICON_MAP, BODY_TYPES (+37 more)

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.16
Nodes (25): findBiddableAd(), offersFailure(), setBuyAdBiddingAction(), submitBuyAdOfferAction(), withdrawBuyAdOfferAction(), BuyAdOffersPanel(), handleResult(), submitOffer() (+17 more)

### Community 27 - "prisma.ts"
Cohesion: 0.11
Nodes (29): @prisma/client, guardRequest(), OptionActionResult, OptionSimpleActionResult, CarTypeActionResult, CarTypeSimpleActionResult, guardRequest(), CarActionResult (+21 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.10
Nodes (33): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTableProps (+25 more)

### Community 29 - "validation/price-table.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_PRICE_TABLE_CURRENCY, digitsOnly(), isValidTierYear(), normalizeUsdPrice(), normalizeYear(), PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PRICE_MAX_DIGITS, PRICE_TABLE_YEAR_MAX (+12 more)

### Community 30 - "admin/auth-actions.ts"
Cohesion: 0.25
Nodes (11): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+3 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.12
Nodes (19): AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES (+11 more)

### Community 32 - "lib/cars.ts"
Cohesion: 0.16
Nodes (19): dynamic, metadata, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction() (+11 more)

### Community 33 - "price-list.ts"
Cohesion: 0.13
Nodes (29): generateMetadata(), CarOffersViewProps, CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows() (+21 more)

### Community 34 - "brands/actions.ts"
Cohesion: 0.10
Nodes (32): BrandActionResult, BrandSimpleActionResult, deleteBrandAction(), guardRequest(), isPrismaCode(), deleteSaleTermAction(), guardRequest(), parseId() (+24 more)

### Community 35 - "cn"
Cohesion: 0.11
Nodes (26): metadata, PanelLoginPage(), ConsultationFab(), ConsultationFabProps, findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem (+18 more)

### Community 36 - "react"
Cohesion: 0.12
Nodes (5): react, AdminPendingAdsPage(), dynamic, metadata, ComingSoonProps

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (25): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+17 more)

### Community 38 - "settings/actions.ts"
Cohesion: 0.19
Nodes (14): saveSystemSettingsAction(), SystemSettingsActionResult, ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError() (+6 more)

### Community 39 - "CarFormModal.tsx"
Cohesion: 0.23
Nodes (15): createCarAction(), deleteCarAction(), isPrismaCode(), updateCarAction(), CarFormModal(), handleSubmit(), inputClassName(), CarsManager() (+7 more)

### Community 40 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): jetbrainsMono, metadata, RootLayout(), vazirmatn, Footer(), DOCK_ITEMS, MobileBottomDock(), Navbar() (+4 more)

### Community 41 - "admin/page.tsx"
Cohesion: 0.24
Nodes (9): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo(), AdminLogoProps, LoginForm(), handleSubmit(), getCurrentAdmin() (+1 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.11
Nodes (40): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+32 more)

### Community 43 - "sale-ads/actions.ts"
Cohesion: 0.08
Nodes (64): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+56 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 46 - "Dark + Orange Accent Visual Identity"
Cohesion: 0.14
Nodes (16): Dark + Orange Accent Visual Identity, Executive Sedan, Free Zone Car Import, Luxury Performance Car Branding, Luxury SUV, Safe Delivery & Pre-Delivery Inspection, Vehicle Quality Inspection, Car Headlight Macro Photo (+8 more)

### Community 47 - "utils.ts"
Cohesion: 0.08
Nodes (22): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+14 more)

### Community 48 - "Modal"
Cohesion: 0.29
Nodes (9): createCarTypeAction(), updateCarTypeAction(), CarTypeFormModal(), handleSubmit(), inputClassName(), Modal(), ModalProps, SIZE_CLASSES (+1 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.11
Nodes (21): server-only, AdminUserProfilePage(), adminSubmitVerificationAction(), AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, submitVerificationAction() (+13 more)

### Community 50 - "toPersianDigits"
Cohesion: 0.14
Nodes (31): ColorSwatch(), ColorSwatchProps, AdGallery(), NoImage(), MyAdCard(), MyAdCardProps, NoImage(), STATUS_HINT (+23 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "BrandsManager.tsx"
Cohesion: 0.13
Nodes (25): createBrandAction(), toggleBrandActiveAction(), updateBrandAction(), AdminBrandsPage(), dynamic, metadata, BrandFormModal(), handleSubmit() (+17 more)

### Community 54 - "Toast"
Cohesion: 0.18
Nodes (15): CarTypeFormModalProps, CarTypesManagerProps, ModalState, CarTypesTable(), CarTypesTableProps, CarFormModalProps, CarsManagerProps, ModalState (+7 more)

### Community 55 - "currency.ts"
Cohesion: 0.20
Nodes (14): CurrencyToggle(), CurrencyToggleProps, BuyAdForm(), BuyAdFormColor, digitsToAscii(), FieldError(), inputClass(), MILEAGE_PRESETS (+6 more)

### Community 56 - "branches/actions.ts"
Cohesion: 0.30
Nodes (16): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+8 more)

### Community 57 - "next"
Cohesion: 0.11
Nodes (25): next, AdminSettingsPage(), dynamic, metadata, BuyAdDetailPage(), dynamic, metadata, metadata (+17 more)

### Community 58 - "users/[id]/page.tsx"
Cohesion: 0.23
Nodes (10): dynamic, metadata, PageProps, ActiveUserCode, createCodes(), findActiveCodes(), getActiveUserCode(), getActiveUserCodes() (+2 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.13
Nodes (19): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_DESCRIPTION_MAX, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_MAX_DIGITS, BUY_AD_OFFER_POLL_MS (+11 more)

### Community 60 - "zod"
Cohesion: 0.20
Nodes (12): zod, carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug() (+4 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "getCurrentUser"
Cohesion: 0.13
Nodes (19): dynamic, GET(), dynamic, GET(), CurrencyRatesProps, getCurrentUser(), isPartnerUser(), fetchFromSource() (+11 more)

### Community 63 - "UserAuthCard.tsx"
Cohesion: 0.24
Nodes (10): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+2 more)

### Community 64 - "lib/branches.ts"
Cohesion: 0.25
Nodes (9): AdminBranchesPage(), dynamic, metadata, BRANCH_INCLUDE, BRANCH_ORDER_BY, BranchWithPlace, listBranches(), listProvinceOptions() (+1 more)

### Community 65 - "CurrencyRates.tsx"
Cohesion: 0.27
Nodes (9): ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), Flash, formatJalali(), formatRial(), RateCard() (+1 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "ThemeSwitch.tsx"
Cohesion: 0.33
Nodes (9): PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE, PANEL_THEME_MAX_AGE, PANEL_THEME_STORAGE_KEY (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.21
Nodes (20): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+12 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.27
Nodes (9): dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS, countPublicBuyAds() (+1 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.13
Nodes (19): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavGroup, AdminNavItem (+11 more)

### Community 76 - "validation/branches.ts"
Cohesion: 0.24
Nodes (9): asciiDigits(), BRANCH_ADDRESS_MAX_LENGTH, BRANCH_MANAGER_MAX_LENGTH, BRANCH_SORT_ORDER_MAX, BRANCH_TITLE_MAX_LENGTH, BranchFormValues, branchSchema, coordinate() (+1 more)

### Community 77 - "BranchesManager"
Cohesion: 0.42
Nodes (9): BranchesManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord(), byDisplayOrder() (+1 more)

### Community 78 - "BranchFormModal.tsx"
Cohesion: 0.24
Nodes (12): BranchesManagerProps, ModalState, BranchesTable(), BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel() (+4 more)

### Community 79 - "BuyAdRecord"
Cohesion: 0.22
Nodes (9): BuyAdCardProps, BuyAdDetailViewProps, BuyAdFormProps, BuyAdOffersPanelProps, MyBuyAdCardProps, MyBuyAdsManagerProps, BuyAdDetailRecord, BuyAdOffersState (+1 more)

### Community 80 - "[id]/price-table/page.tsx"
Cohesion: 0.29
Nodes (10): AdminUserPriceTablePage(), dynamic, metadata, PageProps, dynamic, metadata, PanelPriceTablePage(), listColors() (+2 more)

### Community 81 - "(tabs)/page.tsx"
Cohesion: 0.40
Nodes (5): dynamic, metadata, PanelAdsPage(), MyAdsManager(), userCarInclude

### Community 83 - "AdPriceHistory.tsx"
Cohesion: 0.29
Nodes (8): AdPriceHistory(), percent(), PriceHistoryPanel(), formatCompact(), PAD, PriceHistoryChart(), PriceHistoryChartProps, SearchPricePoint

### Community 84 - "requireCollaborator"
Cohesion: 0.10
Nodes (31): dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic, metadata (+23 more)

### Community 86 - "PriceListBrowser.tsx"
Cohesion: 0.13
Nodes (18): dynamic, metadata, PanelPriceListPage(), StatTile(), Edges, HorizontalScroller(), HorizontalScrollerProps, carHref() (+10 more)

### Community 87 - "SaleAdFormModal"
Cohesion: 0.15
Nodes (10): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectProps, FieldError(), inputClassName(), nextKey() (+2 more)

### Community 89 - "LocationPicker"
Cohesion: 0.47
Nodes (5): LocationPicker(), applyCoordsText(), formatGeoPoint(), parseGeoPoint(), schema

### Community 95 - "admins/actions.ts"
Cohesion: 0.05
Nodes (81): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+73 more)

### Community 102 - "[id]/route.ts"
Cohesion: 0.08
Nodes (28): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+20 more)

### Community 106 - "images/actions.ts"
Cohesion: 0.20
Nodes (17): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic, metadata (+9 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 661 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `users/actions.ts`, `VerificationManager.tsx`, `Toggle`, `ColorsManager.tsx`, `SaleTermsManager.tsx`, `panel-search.ts`, `OptionsManager.tsx`, `lucide-react`, `price-table-shared.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `SaleAdFormModal.tsx`, `MyAdForm.tsx`, `lib/cars.ts`, `ContactView.tsx`, `settings/actions.ts`, `CarFormModal.tsx`, `app/layout.tsx`, `admin/page.tsx`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `utils.ts`, `Modal`, `toPersianDigits`, `BrandsManager.tsx`, `Toast`, `currency.ts`, `UserAuthCard.tsx`, `CurrencyRates.tsx`, `ThemeSwitch.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `BranchFormModal.tsx`, `(tabs)/page.tsx`, `AdPriceHistory.tsx`, `requireCollaborator`, `PriceListBrowser.tsx`, `SaleAdFormModal`, `LocationPicker`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07330618289522399 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarTypesManager`, `admin-buy-ads.ts`, `requireAdminAccess`, `users/actions.ts`, `VerificationManager.tsx`, `(app)/about/page.tsx`, `Toggle`, `ColorsManager.tsx`, `SaleTermsManager.tsx`, `panel-search.ts`, `OptionsManager.tsx`, `lucide-react`, `price-table-shared.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `prisma.ts`, `SaleAdFormModal.tsx`, `MyAdForm.tsx`, `lib/cars.ts`, `cn`, `ContactView.tsx`, `CarFormModal.tsx`, `app/layout.tsx`, `admin/page.tsx`, `sponsors/actions.ts`, `utils.ts`, `Modal`, `toPersianDigits`, `BrandsManager.tsx`, `Toast`, `currency.ts`, `next`, `users/[id]/page.tsx`, `buy-ads-shared.ts`, `UserAuthCard.tsx`, `lib/branches.ts`, `CurrencyRates.tsx`, `ThemeSwitch.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `BranchFormModal.tsx`, `[id]/price-table/page.tsx`, `(tabs)/page.tsx`, `AdPriceHistory.tsx`, `requireCollaborator`, `PriceListBrowser.tsx`, `SaleAdFormModal`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08156028368794327 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarTypesManager`, `admin-buy-ads.ts`, `users/actions.ts`, `normalizeDigits`, `VerificationManager.tsx`, `Toggle`, `ColorsManager.tsx`, `SaleTermsManager.tsx`, `panel-search.ts`, `OptionsManager.tsx`, `lucide-react`, `panel/auth-actions.ts`, `price-table-shared.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `prisma.ts`, `SaleAdFormModal.tsx`, `validation/price-table.ts`, `MyAdForm.tsx`, `lib/cars.ts`, `cn`, `react`, `ContactView.tsx`, `settings/actions.ts`, `CarFormModal.tsx`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `utils.ts`, `verification-submission.ts`, `BrandsManager.tsx`, `Toast`, `currency.ts`, `buy-ads-shared.ts`, `UserAuthCard.tsx`, `CurrencyRates.tsx`, `AdKindTabs.tsx`, `BranchesManager`, `BranchFormModal.tsx`, `(tabs)/page.tsx`, `AdPriceHistory.tsx`, `requireCollaborator`, `PriceListBrowser.tsx`, `SaleAdFormModal`, `admins/actions.ts`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._