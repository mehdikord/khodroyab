# Graph Report - khodroyab  (2026-11-11)

## Corpus Check
- 320 files · ~233,565 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2084 nodes · 6764 edges · 108 communities (101 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03f8ab52`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- cars/actions.ts
- CurrencyRates.tsx
- (panel)/ads/page.tsx
- ColorRecord
- normalizeDigits
- AdminVerificationForm.tsx
- Admin authentication flow
- sale-ads/actions.ts
- images/page.tsx
- colors/actions.ts
- brands/actions.ts
- panel-search.ts
- car-form/actions.ts
- (panel)/dashboard/page.tsx
- admin/auth-actions.ts
- price-list-ui.tsx
- next
- system-settings-shared.ts
- MyPriceTableManager.tsx
- verification-submission.ts
- session.ts
- toPersianDigits
- khodroyab-data.ts
- Toggle
- AdminShell.tsx
- SaleAdFormModal.tsx
- price-table-shared.ts
- UserAuthCard.tsx
- MyAdForm.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- verification.ts
- ContactView.tsx
- price-list/page.tsx
- isTrustedOrigin
- utils.ts
- GrantSubscriptionModal.tsx
- sponsors/actions.ts
- ads/actions.ts
- panel/auth-actions.ts
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- prisma.ts
- middleware.ts
- cn
- dependencies
- scripts
- UsersManager.tsx
- react
- admins/actions.ts
- BranchFormModal.tsx
- VerificationManager.tsx
- (app)/search/page.tsx
- AdminVerificationForm
- SystemSettingsForm.tsx
- devDependencies
- seed-locations.mjs
- verification-actions.ts
- server-only
- requireUser
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- tailwindcss
- UPLOAD_DIR env
- LocationPicker.tsx
- permissions.ts
- cars/page.tsx
- panel-search-shared.ts
- ThemeSwitch.tsx
- branches/actions.ts
- SearchFilters
- CarOffersView.tsx
- dashboard.ts
- StatTile.tsx
- AdsTrendChart.tsx
- prisma
- user-car-extras.ts
- admin/page.tsx
- AboutHeroScene.tsx
- lib/user-cars.ts
- AdsManager
- Modal
- SaleAdFormModal
- ads/[id]/page.tsx
- profile/page.tsx
- [id]/route.ts
- RoleFormModal
- currency.ts
- SponsorsManager
- ProfileEditForm.tsx
- validation/admins.ts
- lib/branches.ts
- getCurrentUser
- [...path]/route.ts
- BranchesManager
- market-rates.ts
- SearchableSelect
- CarImagesManager
- hash-user-passwords.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 255 edges
2. `toPersianDigits()` - 188 edges
3. `react` - 185 edges
4. `lucide-react` - 134 edges
5. `next` - 127 edges
6. `prisma` - 62 edges
7. `formatPersianNumber()` - 60 edges
8. `isTrustedOrigin()` - 52 edges
9. `Toast()` - 44 edges
10. `requireAdminAccess()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminCarFormPage()` --indirect_call--> `optionToRecord()`  [INFERRED]
  src/app/admin/(panel)/car-form/page.tsx → src/lib/options.ts
- `AdminCarsPage()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/cars.ts
- `AdminColorsPage()` --indirect_call--> `colorToRecord()`  [INFERRED]
  src/app/admin/(panel)/colors/page.tsx → src/lib/colors.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Dusk/dark marketing imagery with orange light accents** — public_images_road_coastal_image, public_images_safe_delivery_image, public_images_showroom_freezone_image, concept_dark_orange_visual_identity [INFERRED 0.75]
- **Consistent dark-studio, orange-accent premium car imagery set** — public_images_car_headlight_macro_image, public_images_car_sedan_exec_image, public_images_car_suv_luxury_image [INFERRED 0.85]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]
- **Shared dark/orange-accent marketing photography set** — public_images_hero_car_image, public_images_interior_cockpit_image, public_images_quality_engine_image, concept_dark_orange_visual_identity [INFERRED 0.95]

## Communities (108 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.11
Nodes (37): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+29 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.19
Nodes (14): ActionTile(), CompletionRing(), formatJalali(), formatMobile(), getInitials(), InfoGroup(), InfoRow(), InfoRowProps (+6 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (22): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+14 more)

### Community 3 - "cars/actions.ts"
Cohesion: 0.08
Nodes (44): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarActionResult (+36 more)

### Community 4 - "CurrencyRates.tsx"
Cohesion: 0.20
Nodes (13): ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps, Flash, formatJalali(), formatRial() (+5 more)

### Community 5 - "(panel)/ads/page.tsx"
Cohesion: 0.14
Nodes (30): @prisma/client, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull() (+22 more)

### Community 6 - "ColorRecord"
Cohesion: 0.12
Nodes (21): ColorFormModalProps, ColorsManagerProps, ColorsTableProps, OptionFormModalProps, OptionsManagerProps, OptionsTableProps, SaleTermFormModalProps, SaleTermsManagerProps (+13 more)

### Community 7 - "normalizeDigits"
Cohesion: 0.07
Nodes (37): zod, isValidTierYear(), normalizeYear(), PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizeDigits() (+29 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.17
Nodes (18): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationManagerProps, VERIFICATION_DOC_HINTS, VERIFICATION_DOC_MAX_BYTES (+10 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "sale-ads/actions.ts"
Cohesion: 0.23
Nodes (21): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+13 more)

### Community 11 - "images/page.tsx"
Cohesion: 0.38
Nodes (5): CarImagesPage(), dynamic, metadata, PageProps, carImageToRecord()

### Community 12 - "colors/actions.ts"
Cohesion: 0.14
Nodes (22): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+14 more)

### Community 13 - "brands/actions.ts"
Cohesion: 0.13
Nodes (25): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+17 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.13
Nodes (24): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+16 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.19
Nodes (19): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+11 more)

### Community 16 - "(panel)/dashboard/page.tsx"
Cohesion: 0.17
Nodes (19): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), Severity, CatalogOverview(), DashboardCard() (+11 more)

### Community 17 - "admin/auth-actions.ts"
Cohesion: 0.18
Nodes (15): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), handleSubmit(), Bucket, buckets, checkRateLimit() (+7 more)

### Community 18 - "price-list-ui.tsx"
Cohesion: 0.18
Nodes (17): PriceListCarPage(), CarOffersView(), HorizontalScroller(), BrandLogo(), ColumnHeading(), initials(), PriceTag(), SHORT_PRICE_LABELS (+9 more)

### Community 19 - "next"
Cohesion: 0.12
Nodes (25): next, AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt(), saveMyPriceTableAction() (+17 more)

### Community 20 - "system-settings-shared.ts"
Cohesion: 0.12
Nodes (27): saveSystemSettingsAction(), SystemSettingsActionResult, SystemSettingsFormProps, applyCoordsText(), saveSystemSettings(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint() (+19 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.11
Nodes (32): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+24 more)

### Community 22 - "verification-submission.ts"
Cohesion: 0.13
Nodes (13): submitVerificationAction(), SubmitVerificationResult, isValidCompanyNationalId(), saveVerificationFile(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission (+5 more)

### Community 23 - "session.ts"
Cohesion: 0.24
Nodes (14): jose, getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience (+6 more)

### Community 24 - "toPersianDigits"
Cohesion: 0.11
Nodes (35): Stat(), AdsTable(), AdStatusBadge(), STYLES, CarsTable(), DeltaBadge(), SEGMENTS, StatusBreakdown() (+27 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.06
Nodes (47): framer-motion, AboutPage(), ICON_MAP, jetbrainsMono, metadata, vazirmatn, LicensesPage(), HomePage() (+39 more)

### Community 26 - "Toggle"
Cohesion: 0.16
Nodes (17): BranchesTable(), BrandFormModal(), BrandFormModalProps, inputClassName(), BrandsManagerProps, ModalState, BrandsTable(), BrandsTableProps (+9 more)

### Community 27 - "AdminShell.tsx"
Cohesion: 0.13
Nodes (19): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavGroup, AdminNavItem (+11 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.14
Nodes (24): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTableProps (+16 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.15
Nodes (19): digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS, PRICE_TABLE_PRICE_MAX_DIGITS, PRICE_TABLE_YEAR_MAX, PRICE_TABLE_YEAR_MIN (+11 more)

### Community 30 - "UserAuthCard.tsx"
Cohesion: 0.16
Nodes (15): metadata, PanelLoginPage(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass (+7 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.13
Nodes (16): AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES, CurrencyToggle() (+8 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.23
Nodes (14): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+6 more)

### Community 33 - "price-list.ts"
Cohesion: 0.22
Nodes (18): CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices(), lowestPricesByColumn() (+10 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.16
Nodes (22): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+14 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.15
Nodes (16): ConsultationFab(), findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem, panelNavItemsFor(), PanelDrawer(), PanelLogo() (+8 more)

### Community 36 - "verification.ts"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelVerificationPage(), faDateTime, getUserVerification(), verificationDocumentUrl(), verificationInclude, VerificationRow (+1 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (26): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+18 more)

### Community 38 - "price-list/page.tsx"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+1 more)

### Community 39 - "isTrustedOrigin"
Cohesion: 0.15
Nodes (23): CarImageActionResult, CarImageSimpleActionResult, guardRequest(), guardRequest(), createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest() (+15 more)

### Community 40 - "utils.ts"
Cohesion: 0.08
Nodes (19): lucide-react, react-dom, ContactPage(), RootLayout(), DOCK_ITEMS, MobileBottomDock(), Navbar(), ComingSoonProps (+11 more)

### Community 41 - "GrantSubscriptionModal.tsx"
Cohesion: 0.16
Nodes (19): GrantSubscriptionModal(), GrantSubscriptionModalProps, GrantSuccess, inputClassName(), SubscriptionBadge(), SubscriptionBadgeProps, asciiDigits(), inputClassName() (+11 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.17
Nodes (24): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+16 more)

### Community 43 - "ads/actions.ts"
Cohesion: 0.22
Nodes (21): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+13 more)

### Community 44 - "panel/auth-actions.ts"
Cohesion: 0.12
Nodes (24): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, deliverOtpSms() (+16 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 46 - "Dark + Orange Accent Visual Identity"
Cohesion: 0.14
Nodes (16): Dark + Orange Accent Visual Identity, Executive Sedan, Free Zone Car Import, Luxury Performance Car Branding, Luxury SUV, Safe Delivery & Pre-Delivery Inspection, Vehicle Quality Inspection, Car Headlight Macro Photo (+8 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (15): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+7 more)

### Community 48 - "prisma.ts"
Cohesion: 0.07
Nodes (38): AdminAdminsPage(), dynamic, metadata, AdminPendingAdsPage(), dynamic, metadata, AdminCarFormPage(), dynamic (+30 more)

### Community 49 - "middleware.ts"
Cohesion: 0.16
Nodes (15): authenticateAdmin(), ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+7 more)

### Community 50 - "cn"
Cohesion: 0.13
Nodes (23): ColorsTable(), ColorSwatch(), ColorSwatchProps, CurrencyTag(), AdCarPicker(), NoImage(), AdGallery(), NoImage() (+15 more)

### Community 51 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, bcryptjs, clsx, framer-motion, jose, leaflet, lucide-react, next (+7 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "UsersManager.tsx"
Cohesion: 0.26
Nodes (9): inputClassName(), UserFormModal(), digitQuery(), FILTERS, matchesFilter(), UsersManager(), VerificationStatusBadge(), VerificationStatusBadgeProps (+1 more)

### Community 54 - "react"
Cohesion: 0.10
Nodes (32): react, faDate, ModalState, CarTypeFormModalProps, CarTypesManagerProps, ModalState, CarTypesTable(), CarTypesTableProps (+24 more)

### Community 55 - "admins/actions.ts"
Cohesion: 0.13
Nodes (32): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+24 more)

### Community 56 - "BranchFormModal.tsx"
Cohesion: 0.13
Nodes (20): BranchesManagerProps, BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel(), inputClassName(), LocationPicker (+12 more)

### Community 57 - "VerificationManager.tsx"
Cohesion: 0.20
Nodes (14): DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), PERSON_TYPE_ICONS (+6 more)

### Community 58 - "(app)/search/page.tsx"
Cohesion: 0.19
Nodes (13): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), hrefFor() (+5 more)

### Community 59 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 60 - "SystemSettingsForm.tsx"
Cohesion: 0.29
Nodes (11): ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError() (+3 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "seed-locations.mjs"
Cohesion: 0.24
Nodes (7): assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main()

### Community 63 - "verification-actions.ts"
Cohesion: 0.24
Nodes (8): AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, UserVerificationSection(), review(), showToast(), VERIFICATION_REJECT_REASON_MAX

### Community 64 - "server-only"
Cohesion: 0.12
Nodes (21): server-only, AdminUserProfilePage(), dynamic, metadata, PageProps, AdminUsersPage(), dynamic, metadata (+13 more)

### Community 65 - "requireUser"
Cohesion: 0.30
Nodes (9): metadata, PanelAboutPage(), metadata, PanelContactPage(), PanelAppLayout(), requireUser(), listActiveBranches(), getSystemSettings (+1 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "LocationPicker.tsx"
Cohesion: 0.26
Nodes (13): leaflet, BranchesMap(), BranchesMapProps, escapeHtml(), addBaseTiles(), IRAN_CENTER, IRAN_ZOOM, LeafletModule (+5 more)

### Community 73 - "permissions.ts"
Cohesion: 0.20
Nodes (15): AdminShellUser, AttentionItem, AttentionListProps, CatalogItem, CatalogOverviewProps, PERMISSION_ICONS, PermissionChipsProps, AuthorizedAdmin (+7 more)

### Community 74 - "cars/page.tsx"
Cohesion: 0.18
Nodes (13): AdminBrandsPage(), dynamic, metadata, AdminCarTypesPage(), dynamic, metadata, AdminCarsPage(), dynamic (+5 more)

### Community 76 - "panel-search-shared.ts"
Cohesion: 0.16
Nodes (16): AdCardProps, PriceDeltaBadgeProps, PriceHistoryChartProps, DEFAULTS, FilterKey, SearchFiltersProps, AdDetailSaleTerm, SEARCH_SORT_LABELS (+8 more)

### Community 77 - "ThemeSwitch.tsx"
Cohesion: 0.27
Nodes (11): PanelSectionLayout(), viewport, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE, PANEL_THEME_MAX_AGE (+3 more)

### Community 78 - "branches/actions.ts"
Cohesion: 0.30
Nodes (16): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+8 more)

### Community 79 - "SearchFilters"
Cohesion: 0.36
Nodes (9): buildQuery(), SearchFilters(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+1 more)

### Community 80 - "CarOffersView.tsx"
Cohesion: 0.23
Nodes (14): CarOffersViewProps, compareDigits(), sortOffers(), sortValue(), PriceListBrowserProps, Draft, PriceCurrency, PriceListCarDetail (+6 more)

### Community 81 - "dashboard.ts"
Cohesion: 0.26
Nodes (11): RecentAdsProps, bucketByDay(), computeDelta(), DashboardRecentAd, dayKey(), faDate, faLongDate, faShortDate (+3 more)

### Community 82 - "StatTile.tsx"
Cohesion: 0.32
Nodes (7): Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 83 - "AdsTrendChart.tsx"
Cohesion: 0.36
Nodes (6): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), TrendPoint

### Community 84 - "prisma"
Cohesion: 0.21
Nodes (13): dynamic, metadata, NewAdCarPage(), dynamic, metadata, PanelAdsPage(), AdCarChoice, VerificationRequired() (+5 more)

### Community 85 - "user-car-extras.ts"
Cohesion: 0.21
Nodes (13): AdImageDraft, AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson() (+5 more)

### Community 86 - "admin/page.tsx"
Cohesion: 0.33
Nodes (6): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo(), AdminLogoProps, LoginForm()

### Community 87 - "AboutHeroScene.tsx"
Cohesion: 0.24
Nodes (9): AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS, Wheel(), AboutView() (+1 more)

### Community 88 - "lib/user-cars.ts"
Cohesion: 0.17
Nodes (11): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), AdOptionValue, faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow (+3 more)

### Community 89 - "AdsManager"
Cohesion: 0.36
Nodes (8): AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList(), PageLink()

### Community 90 - "Modal"
Cohesion: 0.18
Nodes (10): CarTypeFormModal(), inputClassName(), inputClassName(), inputClassName(), ItemDraft, inputClassName(), SaleTermFormModal(), Modal() (+2 more)

### Community 91 - "SaleAdFormModal"
Cohesion: 0.29
Nodes (5): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow()

### Community 92 - "ads/[id]/page.tsx"
Cohesion: 0.29
Nodes (7): AdDetailPage(), dynamic, metadata, AdDetailViewProps, UsdRateInfo, getConversionRates(), AdDetailRecord

### Community 93 - "profile/page.tsx"
Cohesion: 0.19
Nodes (13): dynamic, faTime, metadata, PanelProfilePage(), ProfileEditFormProps, ProfileManagerProps, PROFILE_COMPLETION_FIELDS, ProfileAdStats (+5 more)

### Community 94 - "[id]/route.ts"
Cohesion: 0.20
Nodes (11): dynamic, GET(), notFound(), RouteContext, runtime, getCurrentAdmin(), EXTENSION_TO_MIME, MIME_TO_EXTENSION (+3 more)

### Community 95 - "RoleFormModal"
Cohesion: 0.24
Nodes (14): createRoleAction(), deleteRoleAction(), isUniqueViolation(), parseId(), revalidate(), updateRoleAction(), inputClassName(), RoleFormModal() (+6 more)

### Community 96 - "currency.ts"
Cohesion: 0.19
Nodes (10): dynamic, generateMetadata(), PageProps, CurrencyToggleProps, CURRENCY_LABELS, DEFAULT_AD_CURRENCY, DEFAULT_PRICE_TABLE_CURRENCY, MILEAGE_MAX (+2 more)

### Community 97 - "SponsorsManager"
Cohesion: 0.27
Nodes (12): AdminSponsorsPage(), dynamic, metadata, byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved() (+4 more)

### Community 98 - "ProfileEditForm.tsx"
Cohesion: 0.28
Nodes (9): FieldError(), FormAlert(), inputClassName(), labelClassName, SubmitBar(), SubmitBarProps, getInitials(), ProfileEditForm() (+1 more)

### Community 99 - "validation/admins.ts"
Cohesion: 0.20
Nodes (11): isAdminPermission(), normalizePermissions(), AdminFormInput, emailSchema, idSchema, nameSchema, parseRoleForm(), roleSchema (+3 more)

### Community 100 - "lib/branches.ts"
Cohesion: 0.25
Nodes (9): AdminBranchesPage(), dynamic, metadata, BRANCH_INCLUDE, BRANCH_ORDER_BY, BranchWithPlace, listBranches(), listProvinceOptions() (+1 more)

### Community 101 - "getCurrentUser"
Cohesion: 0.27
Nodes (8): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), getCurrentUser(), isPartnerUser(), getMarketRates()

### Community 102 - "[...path]/route.ts"
Cohesion: 0.39
Nodes (8): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), RouteContext, runtime

### Community 103 - "BranchesManager"
Cohesion: 0.42
Nodes (9): BranchesManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord(), byDisplayOrder() (+1 more)

### Community 104 - "market-rates.ts"
Cohesion: 0.31
Nodes (8): fetchFromSource(), Item, itemSchema, nullableNumber, payloadSchema, pick(), toRate(), toRial()

### Community 105 - "SearchableSelect"
Cohesion: 0.32
Nodes (5): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectProps

### Community 106 - "CarImagesManager"
Cohesion: 0.60
Nodes (6): addCarImageAction(), deleteCarImageAction(), CarImagesManager(), handleConfirmDelete(), handleFileChange(), showToast()

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 596 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `(panel)/ads/page.tsx`, `sale-ads/actions.ts`, `images/page.tsx`, `colors/actions.ts`, `brands/actions.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `admin/auth-actions.ts`, `price-list-ui.tsx`, `system-settings-shared.ts`, `verification-submission.ts`, `session.ts`, `toPersianDigits`, `khodroyab-data.ts`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `verification.ts`, `ContactView.tsx`, `price-list/page.tsx`, `isTrustedOrigin`, `utils.ts`, `GrantSubscriptionModal.tsx`, `sponsors/actions.ts`, `ads/actions.ts`, `panel/auth-actions.ts`, `package.json`, `prisma.ts`, `middleware.ts`, `cn`, `UsersManager.tsx`, `react`, `admins/actions.ts`, `BranchFormModal.tsx`, `VerificationManager.tsx`, `(app)/search/page.tsx`, `verification-actions.ts`, `server-only`, `requireUser`, `permissions.ts`, `cars/page.tsx`, `panel-search-shared.ts`, `ThemeSwitch.tsx`, `branches/actions.ts`, `dashboard.ts`, `StatTile.tsx`, `prisma`, `admin/page.tsx`, `AboutHeroScene.tsx`, `ads/[id]/page.tsx`, `profile/page.tsx`, `currency.ts`, `SponsorsManager`, `lib/branches.ts`, `getCurrentUser`, `[...path]/route.ts`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10853658536585366 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `CurrencyRates.tsx`, `AdminVerificationForm.tsx`, `colors/actions.ts`, `(panel)/dashboard/page.tsx`, `price-list-ui.tsx`, `MyPriceTableManager.tsx`, `toPersianDigits`, `khodroyab-data.ts`, `Toggle`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/page.tsx`, `utils.ts`, `GrantSubscriptionModal.tsx`, `sponsors/actions.ts`, `UsersManager.tsx`, `react`, `admins/actions.ts`, `BranchFormModal.tsx`, `VerificationManager.tsx`, `(app)/search/page.tsx`, `AdminVerificationForm`, `SystemSettingsForm.tsx`, `verification-actions.ts`, `LocationPicker.tsx`, `permissions.ts`, `panel-search-shared.ts`, `ThemeSwitch.tsx`, `SearchFilters`, `CarOffersView.tsx`, `StatTile.tsx`, `AdsTrendChart.tsx`, `prisma`, `admin/page.tsx`, `AdsManager`, `Modal`, `SaleAdFormModal`, `RoleFormModal`, `currency.ts`, `ProfileEditForm.tsx`, `SearchableSelect`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Should `cars/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07568027210884354 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `CurrencyRates.tsx`, `normalizeDigits`, `AdminVerificationForm.tsx`, `sale-ads/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `price-list-ui.tsx`, `MyPriceTableManager.tsx`, `verification-submission.ts`, `Toggle`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/page.tsx`, `utils.ts`, `GrantSubscriptionModal.tsx`, `sponsors/actions.ts`, `panel/auth-actions.ts`, `prisma.ts`, `cn`, `UsersManager.tsx`, `react`, `BranchFormModal.tsx`, `VerificationManager.tsx`, `(app)/search/page.tsx`, `AdminVerificationForm`, `SystemSettingsForm.tsx`, `verification-actions.ts`, `permissions.ts`, `panel-search-shared.ts`, `SearchFilters`, `CarOffersView.tsx`, `dashboard.ts`, `StatTile.tsx`, `AdsTrendChart.tsx`, `user-car-extras.ts`, `AdsManager`, `SaleAdFormModal`, `ads/[id]/page.tsx`, `RoleFormModal`, `currency.ts`, `SponsorsManager`, `ProfileEditForm.tsx`, `BranchesManager`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._