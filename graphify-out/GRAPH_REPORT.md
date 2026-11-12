# Graph Report - khodroyab  (2026-11-12)

## Corpus Check
- 357 files · ~257,233 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2363 nodes · 7863 edges · 94 communities (88 shown, 6 thin omitted)
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
- car-types/actions.ts
- admin-buy-ads.ts
- ads/page.tsx
- normalizeDigits
- users/[id]/page.tsx
- VerificationManager.tsx
- Admin authentication flow
- (app)/about/page.tsx
- toPersianDigits
- colors/actions.ts
- Modal
- panel-search.ts
- car-form/actions.ts
- (panel)/dashboard/page.tsx
- panel/auth-actions.ts
- price-list-ui.tsx
- lib/price-table.ts
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- khodroyab-data.ts
- BuyAdOffersPanel.tsx
- roles/actions.ts
- SaleAdFormModal.tsx
- price-table-shared.ts
- admin/auth-actions.ts
- MyAdForm.tsx
- prisma.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- requireAdminAccess
- ContactView.tsx
- permissions.ts
- @prisma/client
- BuyAdDetailManager.tsx
- SearchFilters.tsx
- SponsorsManager.tsx
- sale-ads/actions.ts
- otp.ts
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- (app)/search/page.tsx
- verification-submission.ts
- cn
- dependencies
- scripts
- brands/actions.ts
- react
- BuyAdForm.tsx
- branches/actions.ts
- lib/system-settings.ts
- user-codes.ts
- buy-ads-shared.ts
- BuyAdsManager.tsx
- devDependencies
- getCurrentUser
- UserAuthCard.tsx
- lib/branches.ts
- sponsors/actions.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- guards.ts
- middleware.ts
- VerificationManager
- BranchFormModal.tsx
- validation/admins.ts
- [id]/price-table/page.tsx
- BuyAdsManager
- StatTile.tsx
- currency.ts
- next
- buy-ads/actions.ts
- requireUser
- SponsorsManager
- server-only
- sale-terms/page.tsx
- tailwindcss
- admins/actions.ts
- uploads.ts
- isTrustedOrigin

## God Nodes (most connected - your core abstractions)
1. `cn()` - 296 edges
2. `toPersianDigits()` - 227 edges
3. `react` - 212 edges
4. `next` - 152 edges
5. `lucide-react` - 149 edges
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
- `AdminAdminsPage()` --indirect_call--> `adminToRecord()`  [INFERRED]
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
Cohesion: 0.07
Nodes (44): react-dom, guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata (+36 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (23): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+15 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.09
Nodes (34): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), AdminCarTypesPage() (+26 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.12
Nodes (26): AdminBuyAdsPage(), dynamic, metadata, PageProps, ADMIN_BUY_AD_PAGE_SIZE, adminBuyAdDetailInclude, adminBuyAdInclude, AdminBuyAdRow (+18 more)

### Community 5 - "ads/page.tsx"
Cohesion: 0.11
Nodes (33): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+25 more)

### Community 6 - "normalizeDigits"
Cohesion: 0.05
Nodes (63): zod, createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction() (+55 more)

### Community 7 - "users/[id]/page.tsx"
Cohesion: 0.12
Nodes (19): dynamic, metadata, PageProps, AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, dynamic (+11 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.09
Nodes (34): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), AdminVerificationFormProps, DocDraft (+26 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "toPersianDigits"
Cohesion: 0.13
Nodes (35): BuyAdsTable(), ColorsTable(), StatusBreakdown(), TopBrands(), TopBrandsProps, ColorSwatch(), ColorSwatchProps, AdDetailView() (+27 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.19
Nodes (19): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+11 more)

### Community 13 - "Modal"
Cohesion: 0.15
Nodes (16): ColorFormModalProps, ColorsManagerProps, ColorsTableProps, OptionsManagerProps, SaleTermFormModalProps, SaleTermsManagerProps, SaleTermsTableProps, Modal() (+8 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.10
Nodes (31): AdDetailPage(), dynamic, metadata, getConversionRates(), adDetailInclude, AdViewer, buildOrderBy(), buildWhere() (+23 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.13
Nodes (24): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+16 more)

### Community 16 - "(panel)/dashboard/page.tsx"
Cohesion: 0.11
Nodes (30): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep() (+22 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.18
Nodes (18): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, Bucket (+10 more)

### Community 18 - "price-list-ui.tsx"
Cohesion: 0.12
Nodes (29): dynamic, PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), sortOffers(), sortValue() (+21 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.14
Nodes (18): AdminUserProfilePage(), guardRequest(), parseBigInt(), saveMyPriceTableAction(), MyPriceTableManagerProps, entrySignature(), faDate, listRecentUserPriceTableEntries() (+10 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.12
Nodes (29): ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError() (+21 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.12
Nodes (29): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+21 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.10
Nodes (32): BuyAdDetailPage(), dynamic, metadata, BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters() (+24 more)

### Community 23 - "session.ts"
Cohesion: 0.28
Nodes (12): jose, getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience (+4 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.11
Nodes (33): BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure() (+25 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.05
Nodes (55): AboutPage(), ICON_MAP, ContactPage(), jetbrainsMono, metadata, RootLayout(), vazirmatn, LicensesPage() (+47 more)

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.17
Nodes (20): BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), cleanDigits(), compareDigits() (+12 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.20
Nodes (18): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+10 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.08
Nodes (43): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManager(), AdsManagerProps, AdsStatusCounts (+35 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (26): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), isValidTierYear(), normalizeUsdPrice(), normalizeYear(), PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS (+18 more)

### Community 30 - "admin/auth-actions.ts"
Cohesion: 0.29
Nodes (10): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), resetAttempts(), clearSessionCookie() (+2 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.09
Nodes (25): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectProps, AdExtraFieldsProps, AdFieldTheme, AdImagesField() (+17 more)

### Community 32 - "prisma.ts"
Cohesion: 0.19
Nodes (16): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+8 more)

### Community 33 - "price-list.ts"
Cohesion: 0.17
Nodes (23): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices() (+15 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.27
Nodes (13): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+5 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.09
Nodes (31): PanelSectionLayout(), viewport, ConsultationFab(), ConsultationFabProps, findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem (+23 more)

### Community 36 - "requireAdminAccess"
Cohesion: 0.13
Nodes (19): AdminAdminsPage(), dynamic, metadata, AdminPendingAdsPage(), dynamic, metadata, AdminColorsPage(), dynamic (+11 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.14
Nodes (23): BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps, InstagramIcon() (+15 more)

### Community 38 - "permissions.ts"
Cohesion: 0.17
Nodes (19): AdminShellUser, AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PERMISSION_ICONS, PermissionChipsProps (+11 more)

### Community 39 - "@prisma/client"
Cohesion: 0.10
Nodes (36): @prisma/client, CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+28 more)

### Community 40 - "BuyAdDetailManager.tsx"
Cohesion: 0.16
Nodes (19): setAdminBuyAdActiveAction(), AdminBuyAdDetailPage(), dynamic, metadata, PageProps, BuyAdDetailManager(), handleConfirm(), setBidding() (+11 more)

### Community 41 - "SearchFilters.tsx"
Cohesion: 0.15
Nodes (18): DEFAULTS, SearchFiltersProps, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange() (+10 more)

### Community 42 - "SponsorsManager.tsx"
Cohesion: 0.16
Nodes (16): AdminSponsorsPage(), dynamic, metadata, inputClassName(), SponsorFormModal(), clearError(), handleFileChange(), SponsorFormModalProps (+8 more)

### Community 43 - "sale-ads/actions.ts"
Cohesion: 0.08
Nodes (63): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+55 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (12): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+4 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 46 - "Dark + Orange Accent Visual Identity"
Cohesion: 0.14
Nodes (16): Dark + Orange Accent Visual Identity, Executive Sedan, Free Zone Car Import, Luxury Performance Car Branding, Luxury SUV, Safe Delivery & Pre-Delivery Inspection, Vehicle Quality Inspection, Car Headlight Macro Photo (+8 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (15): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+7 more)

### Community 48 - "(app)/search/page.tsx"
Cohesion: 0.18
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+6 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.12
Nodes (14): SubmitVerificationResult, ALLOWED_IMAGE_MIME_TYPES, isValidCompanyNationalId(), removeVerificationFiles(), saveVerificationFile(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType (+6 more)

### Community 50 - "cn"
Cohesion: 0.12
Nodes (33): BuyAdsFilters(), Segmented(), AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps (+25 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "brands/actions.ts"
Cohesion: 0.10
Nodes (32): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+24 more)

### Community 54 - "react"
Cohesion: 0.09
Nodes (33): lucide-react, react, ModalState, BranchesTable(), BrandFormModalProps, ModalState, BrandsTable(), ModalState (+25 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.17
Nodes (16): CurrencyToggle(), AdCarChoice, AdCarPicker(), AdCarPickerProps, NoImage(), BuyAdForm(), BuyAdFormColor, BuyAdFormProps (+8 more)

### Community 56 - "branches/actions.ts"
Cohesion: 0.19
Nodes (25): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+17 more)

### Community 57 - "lib/system-settings.ts"
Cohesion: 0.16
Nodes (15): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, metadata, PanelContactPage(), listActiveBranches() (+7 more)

### Community 58 - "user-codes.ts"
Cohesion: 0.36
Nodes (7): ActiveUserCode, createCodes(), findActiveCodes(), getActiveUserCode(), getActiveUserCodes(), isUniqueViolation(), randomCode()

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.18
Nodes (15): BuyAdDetailViewProps, BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BuyAdOffersPanelProps, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_POLL_MS (+7 more)

### Community 60 - "BuyAdsManager.tsx"
Cohesion: 0.25
Nodes (15): BuyAdsFiltersProps, BuyAdsManagerProps, BuyAdsTableProps, AdminBuyAdListResult, ADMIN_BUY_AD_FILTER_DEFAULTS, ADMIN_BUY_AD_PARAM_KEYS, ADMIN_BUY_AD_SORT_LABELS, ADMIN_BUY_AD_SORTS (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "getCurrentUser"
Cohesion: 0.09
Nodes (31): dynamic, GET(), dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill() (+23 more)

### Community 63 - "UserAuthCard.tsx"
Cohesion: 0.19
Nodes (13): metadata, PanelLoginPage(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass (+5 more)

### Community 64 - "lib/branches.ts"
Cohesion: 0.25
Nodes (9): AdminBranchesPage(), dynamic, metadata, BRANCH_INCLUDE, BRANCH_ORDER_BY, BranchWithPlace, listBranches(), listProvinceOptions() (+1 more)

### Community 65 - "sponsors/actions.ts"
Cohesion: 0.31
Nodes (15): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+7 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.20
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.17
Nodes (24): BranchesMap(), BranchesMapProps, BranchMapPoint, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER (+16 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.20
Nodes (12): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+4 more)

### Community 74 - "guards.ts"
Cohesion: 0.09
Nodes (30): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+22 more)

### Community 76 - "middleware.ts"
Cohesion: 0.21
Nodes (11): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AREAS, config, isPassthrough(), middleware() (+3 more)

### Community 77 - "VerificationManager"
Cohesion: 0.25
Nodes (10): submitVerificationAction(), FieldError(), identityDraftFrom(), inputClassName(), newDoc(), VerificationManager(), chooseFile(), handleSubmit() (+2 more)

### Community 78 - "BranchFormModal.tsx"
Cohesion: 0.13
Nodes (20): BranchesManagerProps, BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel(), inputClassName(), LocationPicker (+12 more)

### Community 79 - "validation/admins.ts"
Cohesion: 0.24
Nodes (10): isAdminPermission(), normalizePermissions(), AdminFormInput, emailSchema, idSchema, nameSchema, parseRoleForm(), roleSchema (+2 more)

### Community 80 - "[id]/price-table/page.tsx"
Cohesion: 0.29
Nodes (10): AdminUserPriceTablePage(), dynamic, metadata, PageProps, dynamic, metadata, PanelPriceTablePage(), listColors() (+2 more)

### Community 81 - "BuyAdsManager"
Cohesion: 0.33
Nodes (9): setAdminBuyAdBiddingAction(), buildPageList(), BuyAdsManager(), handleConfirmDelete(), handleToggleActive(), handleToggleBidding(), patchAd(), showToast() (+1 more)

### Community 82 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 83 - "currency.ts"
Cohesion: 0.20
Nodes (13): CurrencyTag(), CurrencyToggleProps, AdCardProps, PriceHistoryChartProps, CURRENCY_LABELS, PRICE_CURRENCIES, PriceCurrency, AdDetailSaleTerm (+5 more)

### Community 84 - "next"
Cohesion: 0.13
Nodes (27): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+19 more)

### Community 85 - "buy-ads/actions.ts"
Cohesion: 0.57
Nodes (7): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), updateAd()

### Community 86 - "requireUser"
Cohesion: 0.21
Nodes (11): PanelAppLayout(), dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps (+3 more)

### Community 87 - "SponsorsManager"
Cohesion: 0.50
Nodes (8): byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord()

### Community 88 - "server-only"
Cohesion: 0.52
Nodes (5): server-only, authenticateAdmin(), consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword()

### Community 89 - "sale-terms/page.tsx"
Cohesion: 0.38
Nodes (6): AdminSaleTermsPage(), dynamic, metadata, SaleTermsManager(), handleDelete(), showToast()

### Community 95 - "admins/actions.ts"
Cohesion: 0.15
Nodes (31): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+23 more)

### Community 102 - "uploads.ts"
Cohesion: 0.12
Nodes (22): dynamic, GET(), notFound(), RouteContext, runtime, buildHeaders(), dynamic, GET() (+14 more)

### Community 106 - "isTrustedOrigin"
Cohesion: 0.17
Nodes (20): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic, metadata (+12 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 661 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `ads/page.tsx`, `normalizeDigits`, `VerificationManager.tsx`, `toPersianDigits`, `colors/actions.ts`, `Modal`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `price-list-ui.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `admin/auth-actions.ts`, `MyAdForm.tsx`, `prisma.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `permissions.ts`, `@prisma/client`, `BuyAdDetailManager.tsx`, `SearchFilters.tsx`, `SponsorsManager.tsx`, `(app)/search/page.tsx`, `brands/actions.ts`, `react`, `BuyAdForm.tsx`, `BuyAdsManager.tsx`, `getCurrentUser`, `UserAuthCard.tsx`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `guards.ts`, `VerificationManager`, `BranchFormModal.tsx`, `BuyAdsManager`, `StatTile.tsx`, `currency.ts`, `next`, `requireUser`, `admins/actions.ts`, `isTrustedOrigin`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07330618289522399 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `ads/page.tsx`, `normalizeDigits`, `users/[id]/page.tsx`, `VerificationManager.tsx`, `(app)/about/page.tsx`, `toPersianDigits`, `Modal`, `panel-search.ts`, `(panel)/dashboard/page.tsx`, `price-list-ui.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `SaleAdFormModal.tsx`, `admin/auth-actions.ts`, `MyAdForm.tsx`, `prisma.ts`, `PanelShell.tsx`, `requireAdminAccess`, `ContactView.tsx`, `permissions.ts`, `@prisma/client`, `BuyAdDetailManager.tsx`, `SearchFilters.tsx`, `SponsorsManager.tsx`, `package.json`, `(app)/search/page.tsx`, `cn`, `brands/actions.ts`, `BuyAdForm.tsx`, `lib/system-settings.ts`, `buy-ads-shared.ts`, `BuyAdsManager.tsx`, `getCurrentUser`, `UserAuthCard.tsx`, `lib/branches.ts`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `guards.ts`, `BranchFormModal.tsx`, `[id]/price-table/page.tsx`, `StatTile.tsx`, `currency.ts`, `next`, `requireUser`, `sale-terms/page.tsx`, `admins/actions.ts`, `isTrustedOrigin`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07205513784461152 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `normalizeDigits`, `users/[id]/page.tsx`, `VerificationManager.tsx`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `panel/auth-actions.ts`, `price-list-ui.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `MyAdForm.tsx`, `prisma.ts`, `PanelShell.tsx`, `requireAdminAccess`, `ContactView.tsx`, `permissions.ts`, `@prisma/client`, `BuyAdDetailManager.tsx`, `SearchFilters.tsx`, `SponsorsManager.tsx`, `sale-ads/actions.ts`, `(app)/search/page.tsx`, `verification-submission.ts`, `cn`, `brands/actions.ts`, `react`, `BuyAdForm.tsx`, `branches/actions.ts`, `buy-ads-shared.ts`, `BuyAdsManager.tsx`, `getCurrentUser`, `UserAuthCard.tsx`, `AdKindTabs.tsx`, `VerificationManager`, `BranchFormModal.tsx`, `BuyAdsManager`, `StatTile.tsx`, `requireUser`, `SponsorsManager`, `sale-terms/page.tsx`, `admins/actions.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._