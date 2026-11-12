# Graph Report - khodroyab  (2026-11-12)

## Corpus Check
- 358 files · ~257,057 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2365 nodes · 7859 edges · 94 communities (88 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7db598e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- admin-buy-ads.ts
- requireAdminAccess
- users/actions.ts
- admin.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- react
- Toggle
- colors/actions.ts
- permissions.ts
- panel-search.ts
- car-form/actions.ts
- lucide-react
- isTrustedOrigin
- cn
- adminActionDenied
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- server-only
- buy/actions.ts
- khodroyab-data.ts
- toPersianDigits
- roles/actions.ts
- SaleAdFormModal.tsx
- price-table-shared.ts
- (app)/search/page.tsx
- MyAdForm.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- Modal
- PanelShell.tsx
- prisma.ts
- ContactView.tsx
- settings/actions.ts
- cars/actions.ts
- app/layout.tsx
- panel-search-shared.ts
- sponsors/actions.ts
- sale-ads/actions.ts
- otp.ts
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- VerificationManager.tsx
- verification-submission.ts
- BuyAdDetailView.tsx
- dependencies
- scripts
- brands/actions.ts
- Toast
- BuyAdForm.tsx
- branches/actions.ts
- user-auth.ts
- users/[id]/page.tsx
- buy-ads-shared.ts
- zod
- devDependencies
- CurrencyRates.tsx
- ads/actions.ts
- UserVerificationSection.tsx
- lib/user-cars.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- tailwindcss
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- guards.ts
- validation/brands.ts
- seed-locations.mjs
- BranchFormModal.tsx
- AdminVerificationForm
- lib/colors.ts
- profile/actions.ts
- PriceCurrency
- utils.ts
- ads/[id]/edit/page.tsx
- UrlFilterBar.tsx
- price-list/page.tsx
- SearchableSelect
- SaleAdFormModal
- LocationPicker
- admins/actions.ts
- normalizeDigits
- uploads.ts
- images/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 297 edges
2. `toPersianDigits()` - 226 edges
3. `react` - 213 edges
4. `next` - 152 edges
5. `lucide-react` - 150 edges
6. `formatPersianNumber()` - 74 edges
7. `prisma` - 67 edges
8. `isTrustedOrigin()` - 56 edges
9. `Toast()` - 48 edges
10. `requireAdminAccess()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAdminsPage()` --indirect_call--> `adminRoleToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAllAdsPage()` --indirect_call--> `userCarToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/user-cars.ts
- `AdminCarsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/brands.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Dusk/dark marketing imagery with orange light accents** — public_images_road_coastal_image, public_images_safe_delivery_image, public_images_showroom_freezone_image, concept_dark_orange_visual_identity [INFERRED 0.75]
- **Consistent dark-studio, orange-accent premium car imagery set** — public_images_car_headlight_macro_image, public_images_car_sedan_exec_image, public_images_car_suv_luxury_image [INFERRED 0.85]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]
- **Shared dark/orange-accent marketing photography set** — public_images_hero_car_image, public_images_interior_cockpit_image, public_images_quality_engine_image, concept_dark_orange_visual_identity [INFERRED 0.95]

## Communities (94 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (62): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+54 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.10
Nodes (28): FieldError(), FormAlert(), inputClassName(), labelClassName, SubmitBar(), SubmitBarProps, getInitials(), ProfileEditForm() (+20 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (22): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+14 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.15
Nodes (24): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+16 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.06
Nodes (75): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+67 more)

### Community 5 - "requireAdminAccess"
Cohesion: 0.10
Nodes (35): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+27 more)

### Community 6 - "users/actions.ts"
Cohesion: 0.13
Nodes (32): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+24 more)

### Community 7 - "admin.ts"
Cohesion: 0.09
Nodes (26): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), AdminFormInput, emailSchema, idSchema (+18 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.16
Nodes (17): DocDraft, IdentityDraft, PERSON_TYPE_ICONS, ALLOWED_IMAGE_MIME_TYPES, VERIFICATION_DOC_HINTS, VERIFICATION_DOC_MAX_BYTES, VERIFICATION_DOC_MAX_COUNT, VERIFICATION_DOC_TITLE_MAX (+9 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "react"
Cohesion: 0.09
Nodes (17): next, react, AdminSettingsPage(), dynamic, metadata, metadata, PanelAboutPage(), AboutHeroScene() (+9 more)

### Community 11 - "Toggle"
Cohesion: 0.17
Nodes (18): AdsTable(), AdStatusBadge(), BranchesTable(), BrandsTable(), OptionsTable(), OptionsTableProps, typeLabel(), PriceTableCarsTable() (+10 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.14
Nodes (24): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+16 more)

### Community 13 - "permissions.ts"
Cohesion: 0.21
Nodes (15): AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PERMISSION_ICONS, PermissionChipsProps, RoleFormModalProps (+7 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.14
Nodes (24): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+16 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.11
Nodes (29): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+21 more)

### Community 16 - "lucide-react"
Cohesion: 0.08
Nodes (48): lucide-react, AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN (+40 more)

### Community 17 - "isTrustedOrigin"
Cohesion: 0.12
Nodes (33): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), getClientIp(), logoutUserAction(), minutes(), requestOtpAction() (+25 more)

### Community 18 - "cn"
Cohesion: 0.15
Nodes (25): dynamic, PageProps, PriceListCarPage(), PanelNotice(), CarOffersView(), compareDigits(), sortOffers(), sortValue() (+17 more)

### Community 19 - "adminActionDenied"
Cohesion: 0.14
Nodes (17): parseBigInt(), saveUserPriceTableAction(), guardRequest(), parseBigInt(), saveMyPriceTableAction(), adminActionDenied(), entrySignature(), faDate (+9 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.14
Nodes (23): ContactField, ContactValues, SystemSettingsFormProps, parseRotationMinutes(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH (+15 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.11
Nodes (32): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+24 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.14
Nodes (21): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE (+13 more)

### Community 23 - "server-only"
Cohesion: 0.11
Nodes (24): jose, server-only, authenticateAdmin(), ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload (+16 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.12
Nodes (32): dynamic, GET(), BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd() (+24 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.06
Nodes (49): AboutPage(), ICON_MAP, ContactPage(), LicensesPage(), HomePage(), ICON_MAP, BODY_TYPES, FUEL_TYPES (+41 more)

### Community 26 - "toPersianDigits"
Cohesion: 0.14
Nodes (21): BuyAdsFilters(), Segmented(), Filter, FILTERS, BestOfferHero(), BuyAdOffersPanel(), cleanDigits(), compareDigits() (+13 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.17
Nodes (21): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+13 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.12
Nodes (32): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTableProps (+24 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.12
Nodes (22): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS (+14 more)

### Community 30 - "(app)/search/page.tsx"
Cohesion: 0.18
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+6 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.11
Nodes (20): AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES, CurrencyToggle() (+12 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.33
Nodes (11): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), PriceTableManager() (+3 more)

### Community 33 - "price-list.ts"
Cohesion: 0.18
Nodes (22): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices() (+14 more)

### Community 34 - "Modal"
Cohesion: 0.18
Nodes (16): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+8 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.07
Nodes (42): react-dom, PanelSectionLayout(), viewport, metadata, PanelLoginPage(), findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS (+34 more)

### Community 36 - "prisma.ts"
Cohesion: 0.13
Nodes (17): @prisma/client, AdminPendingAdsPage(), dynamic, metadata, AdminCarTypesPage(), dynamic, metadata, AdminCarsPage() (+9 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (25): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+17 more)

### Community 38 - "settings/actions.ts"
Cohesion: 0.19
Nodes (14): saveSystemSettingsAction(), SystemSettingsActionResult, ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError() (+6 more)

### Community 39 - "cars/actions.ts"
Cohesion: 0.21
Nodes (18): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT, updateCarAction() (+10 more)

### Community 40 - "app/layout.tsx"
Cohesion: 0.25
Nodes (7): jetbrainsMono, metadata, RootLayout(), vazirmatn, DOCK_ITEMS, MobileBottomDock(), Navbar()

### Community 41 - "panel-search-shared.ts"
Cohesion: 0.18
Nodes (14): PriceDeltaBadgeProps, PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, AdDetailSaleTerm, SEARCH_SORT_LABELS, SEARCH_SORTS (+6 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.11
Nodes (39): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+31 more)

### Community 43 - "sale-ads/actions.ts"
Cohesion: 0.15
Nodes (30): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+22 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 46 - "Dark + Orange Accent Visual Identity"
Cohesion: 0.14
Nodes (16): Dark + Orange Accent Visual Identity, Executive Sedan, Free Zone Car Import, Luxury Performance Car Branding, Luxury SUV, Safe Delivery & Pre-Delivery Inspection, Vehicle Quality Inspection, Car Headlight Macro Photo (+8 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (15): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+7 more)

### Community 48 - "VerificationManager.tsx"
Cohesion: 0.20
Nodes (15): submitVerificationAction(), DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc() (+7 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.11
Nodes (14): AdminSubmitVerificationResult, ReviewVerificationResult, isValidCompanyNationalId(), saveVerificationFile(), isVerificationPersonType(), VERIFICATION_REJECT_REASON_MAX, verificationDocumentUrl(), parseVerificationForm() (+6 more)

### Community 50 - "BuyAdDetailView.tsx"
Cohesion: 0.10
Nodes (35): AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdCardProps (+27 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "brands/actions.ts"
Cohesion: 0.14
Nodes (26): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+18 more)

### Community 54 - "Toast"
Cohesion: 0.12
Nodes (24): BrandFormModalProps, BrandsManagerProps, ModalState, BrandsTableProps, CarFormModalProps, ModalState, CarsTable(), CarsTableProps (+16 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.31
Nodes (9): BuyAdForm(), BuyAdFormColor, digitsToAscii(), FieldError(), inputClass(), MILEAGE_PRESETS, mileageNumber(), presetLabel() (+1 more)

### Community 56 - "branches/actions.ts"
Cohesion: 0.13
Nodes (35): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+27 more)

### Community 57 - "user-auth.ts"
Cohesion: 0.10
Nodes (26): BuyAdDetailPage(), dynamic, metadata, metadata, PanelContactPage(), dynamic, metadata, PanelDashboardPage() (+18 more)

### Community 58 - "users/[id]/page.tsx"
Cohesion: 0.20
Nodes (12): AdminUserProfilePage(), dynamic, metadata, PageProps, buyerCodesFor(), ActiveUserCode, createCodes(), findActiveCodes() (+4 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.16
Nodes (16): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, OfferRowProps, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_POLL_MS, BUY_AD_SORT_LABELS (+8 more)

### Community 60 - "zod"
Cohesion: 0.20
Nodes (12): zod, carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug() (+4 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.09
Nodes (28): dynamic, GET(), AdDetailPage(), dynamic, metadata, ChangePill(), CountdownRing(), CURRENCIES (+20 more)

### Community 63 - "ads/actions.ts"
Cohesion: 0.15
Nodes (29): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+21 more)

### Community 64 - "UserVerificationSection.tsx"
Cohesion: 0.20
Nodes (13): revalidateVerificationPages(), reviewVerificationAction(), AdminVerificationFormProps, UserVerificationSection(), review(), showToast(), UserVerificationSectionProps, VerificationStatusBadge() (+5 more)

### Community 65 - "lib/user-cars.ts"
Cohesion: 0.18
Nodes (10): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow, userCarOptionsInclude (+2 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.21
Nodes (20): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+12 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.20
Nodes (12): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+4 more)

### Community 74 - "guards.ts"
Cohesion: 0.08
Nodes (35): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+27 more)

### Community 76 - "validation/brands.ts"
Cohesion: 0.13
Nodes (13): brandCoreSchema, BrandFormValues, fallbackSlug(), MAX_IMAGE_SIZE_BYTES, ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug() (+5 more)

### Community 77 - "seed-locations.mjs"
Cohesion: 0.20
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 78 - "BranchFormModal.tsx"
Cohesion: 0.13
Nodes (20): BranchesManagerProps, BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel(), inputClassName(), LocationPicker (+12 more)

### Community 79 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 80 - "lib/colors.ts"
Cohesion: 0.28
Nodes (10): AdminUserPriceTablePage(), dynamic, metadata, PageProps, dynamic, metadata, PanelPriceTablePage(), listColors() (+2 more)

### Community 81 - "profile/actions.ts"
Cohesion: 0.27
Nodes (10): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), handleSubmit(), ProfileRow, profileSelect, toProfileRecord() (+2 more)

### Community 82 - "PriceCurrency"
Cohesion: 0.21
Nodes (12): CurrencyToggleProps, CarOffersViewProps, PriceListBrowserProps, Draft, PriceCurrency, PriceListCarDetail, PriceListCarInfo, PriceListOffer (+4 more)

### Community 83 - "utils.ts"
Cohesion: 0.10
Nodes (33): BuyAdsTable(), ColorsTable(), ColorSwatch(), ColorSwatchProps, CurrencyTag(), AdDetailView(), AdDetailViewProps, PriceEquivalent() (+25 more)

### Community 84 - "ads/[id]/edit/page.tsx"
Cohesion: 0.10
Nodes (34): dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic, metadata (+26 more)

### Community 85 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 86 - "price-list/page.tsx"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+1 more)

### Community 87 - "SearchableSelect"
Cohesion: 0.28
Nodes (6): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps

### Community 88 - "SaleAdFormModal"
Cohesion: 0.29
Nodes (5): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow()

### Community 89 - "LocationPicker"
Cohesion: 0.67
Nodes (3): LocationPicker(), applyCoordsText(), parseGeoPoint()

### Community 95 - "admins/actions.ts"
Cohesion: 0.11
Nodes (40): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+32 more)

### Community 96 - "normalizeDigits"
Cohesion: 0.16
Nodes (18): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, isValidTierYear(), normalizeYear(), normalizeDigits(), BuyAdInput, buyAdSchema (+10 more)

### Community 102 - "uploads.ts"
Cohesion: 0.12
Nodes (23): dynamic, GET(), notFound(), RouteContext, runtime, buildHeaders(), dynamic, GET() (+15 more)

### Community 106 - "images/actions.ts"
Cohesion: 0.21
Nodes (16): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic, metadata (+8 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 661 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `users/actions.ts`, `AdminVerificationForm.tsx`, `Toggle`, `colors/actions.ts`, `permissions.ts`, `car-form/actions.ts`, `lucide-react`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `khodroyab-data.ts`, `toPersianDigits`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `(app)/search/page.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `Modal`, `PanelShell.tsx`, `ContactView.tsx`, `settings/actions.ts`, `cars/actions.ts`, `app/layout.tsx`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `VerificationManager.tsx`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `Toast`, `BuyAdForm.tsx`, `CurrencyRates.tsx`, `UserVerificationSection.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `guards.ts`, `BranchFormModal.tsx`, `AdminVerificationForm`, `utils.ts`, `ads/[id]/edit/page.tsx`, `UrlFilterBar.tsx`, `price-list/page.tsx`, `SearchableSelect`, `SaleAdFormModal`, `LocationPicker`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07330618289522399 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `requireAdminAccess`, `users/actions.ts`, `AdminVerificationForm.tsx`, `Toggle`, `colors/actions.ts`, `permissions.ts`, `car-form/actions.ts`, `lucide-react`, `cn`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `khodroyab-data.ts`, `toPersianDigits`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `(app)/search/page.tsx`, `MyAdForm.tsx`, `Modal`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `cars/actions.ts`, `app/layout.tsx`, `panel-search-shared.ts`, `sponsors/actions.ts`, `package.json`, `VerificationManager.tsx`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `Toast`, `BuyAdForm.tsx`, `branches/actions.ts`, `user-auth.ts`, `users/[id]/page.tsx`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `UserVerificationSection.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `guards.ts`, `BranchFormModal.tsx`, `lib/colors.ts`, `utils.ts`, `ads/[id]/edit/page.tsx`, `UrlFilterBar.tsx`, `price-list/page.tsx`, `SearchableSelect`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10384068278805121 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `users/actions.ts`, `AdminVerificationForm.tsx`, `Toggle`, `colors/actions.ts`, `permissions.ts`, `car-form/actions.ts`, `lucide-react`, `isTrustedOrigin`, `cn`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `khodroyab-data.ts`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `(app)/search/page.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `settings/actions.ts`, `cars/actions.ts`, `panel-search-shared.ts`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `VerificationManager.tsx`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `Toast`, `BuyAdForm.tsx`, `branches/actions.ts`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `ads/actions.ts`, `UserVerificationSection.tsx`, `AdKindTabs.tsx`, `BranchFormModal.tsx`, `AdminVerificationForm`, `utils.ts`, `ads/[id]/edit/page.tsx`, `UrlFilterBar.tsx`, `price-list/page.tsx`, `SaleAdFormModal`, `admins/actions.ts`, `normalizeDigits`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._