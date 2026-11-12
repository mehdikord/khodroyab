# Graph Report - khodroyab  (2026-11-12)

## Corpus Check
- 348 files · ~249,978 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2276 nodes · 7523 edges · 92 communities (86 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b901014`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- CarTypesManager.tsx
- market-rates.ts
- server-only
- users/actions.ts
- admin.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- SaleAdsManager
- cn
- colors/actions.ts
- brands/actions.ts
- panel-search.ts
- car-form/actions.ts
- formatPersianNumber
- panel/auth-actions.ts
- CarOffersView.tsx
- lib/price-table.ts
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- khodroyab-data.ts
- BuyAdOffersPanel.tsx
- roles/actions.ts
- AdsManager.tsx
- price-table-shared.ts
- UserAuthCard.tsx
- SaleAdFormModal.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- next
- ContactView.tsx
- SaleAdsManager.tsx
- CarFormModal.tsx
- app/layout.tsx
- validation/colors.ts
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
- BrandsManager
- react
- BuyAdForm.tsx
- branches/actions.ts
- lib/branches.ts
- SponsorsManager.tsx
- buy-ads-shared.ts
- validation/car-types.ts
- devDependencies
- CurrencyRates.tsx
- user-car-extras.ts
- MyBuyAdsManager.tsx
- lib/user-cars.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- tailwindcss
- UPLOAD_DIR env
- BranchesMap.tsx
- requireUser
- guards.ts
- validation/brands.ts
- BranchesManager
- BranchFormModal.tsx
- AdminVerificationForm
- (app)/price-table/page.tsx
- admin/auth-actions.ts
- user-auth.ts
- currency.ts
- requireCollaborator
- admin/page.tsx
- AdsManager
- toPersianDigits
- admins/actions.ts
- validation/user-cars.ts
- uploads.ts
- images/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 282 edges
2. `toPersianDigits()` - 216 edges
3. `react` - 206 edges
4. `lucide-react` - 145 edges
5. `next` - 144 edges
6. `formatPersianNumber()` - 70 edges
7. `prisma` - 65 edges
8. `isTrustedOrigin()` - 54 edges
9. `Toast()` - 44 edges
10. `requireAdminAccess()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminAdminsPage()` --indirect_call--> `adminRoleToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAdminsPage()` --indirect_call--> `adminToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAllAdsPage()` --indirect_call--> `colorToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/colors.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Dusk/dark marketing imagery with orange light accents** — public_images_road_coastal_image, public_images_safe_delivery_image, public_images_showroom_freezone_image, concept_dark_orange_visual_identity [INFERRED 0.75]
- **Consistent dark-studio, orange-accent premium car imagery set** — public_images_car_headlight_macro_image, public_images_car_sedan_exec_image, public_images_car_suv_luxury_image [INFERRED 0.85]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]
- **Shared dark/orange-accent marketing photography set** — public_images_hero_car_image, public_images_interior_cockpit_image, public_images_quality_engine_image, concept_dark_orange_visual_identity [INFERRED 0.95]

## Communities (92 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.08
Nodes (60): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+52 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (43): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+35 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (25): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+17 more)

### Community 3 - "CarTypesManager.tsx"
Cohesion: 0.17
Nodes (20): createCarTypeAction(), deleteCarTypeAction(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal(), handleSubmit(), CarTypeFormModalProps, inputClassName() (+12 more)

### Community 4 - "market-rates.ts"
Cohesion: 0.22
Nodes (12): dynamic, GET(), fetchFromSource(), getConversionRates(), getMarketRates(), Item, itemSchema, nullableNumber (+4 more)

### Community 5 - "server-only"
Cohesion: 0.10
Nodes (36): @prisma/client, server-only, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single() (+28 more)

### Community 6 - "users/actions.ts"
Cohesion: 0.12
Nodes (34): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+26 more)

### Community 7 - "admin.ts"
Cohesion: 0.08
Nodes (27): zod, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), AdminFormInput, emailSchema, idSchema (+19 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.17
Nodes (18): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationManagerProps, VERIFICATION_DOC_HINTS, VERIFICATION_DOC_MAX_COUNT (+10 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "SaleAdsManager"
Cohesion: 0.83
Nodes (4): SaleAdsManager(), handleConfirmDelete(), handleToggleActive(), showToast()

### Community 11 - "cn"
Cohesion: 0.11
Nodes (27): BranchesTable(), BrandFormModal(), inputClassName(), BrandsTable(), inputClassName(), inputClassName(), ItemDraft, OptionFormModal() (+19 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.16
Nodes (22): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+14 more)

### Community 13 - "brands/actions.ts"
Cohesion: 0.35
Nodes (10): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), updateBrandAction(), handleSubmit() (+2 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.05
Nodes (58): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), DEFAULTS (+50 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.23
Nodes (18): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+10 more)

### Community 16 - "formatPersianNumber"
Cohesion: 0.07
Nodes (51): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep() (+43 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.17
Nodes (19): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+11 more)

### Community 18 - "CarOffersView.tsx"
Cohesion: 0.13
Nodes (26): dynamic, generateMetadata(), PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), sortOffers() (+18 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.13
Nodes (18): guardRequest(), parseBigInt(), saveMyPriceTableAction(), MyPriceTableManagerProps, entrySignature(), faDate, PriceTableCarRecord, PriceTableCarRow (+10 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.06
Nodes (58): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, metadata, PanelAboutPage(), ContactField (+50 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.12
Nodes (29): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+21 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.12
Nodes (24): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE (+16 more)

### Community 23 - "session.ts"
Cohesion: 0.14
Nodes (22): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches(), createSessionToken() (+14 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.13
Nodes (31): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure(), parseBigInt() (+23 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.07
Nodes (45): AboutPage(), ICON_MAP, ContactPage(), LicensesPage(), HomePage(), ICON_MAP, BODY_TYPES, FUEL_TYPES (+37 more)

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.14
Nodes (23): BuyAdOffersResult, BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), BuyAdOffersPanelProps, cleanDigits() (+15 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.19
Nodes (19): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+11 more)

### Community 28 - "AdsManager.tsx"
Cohesion: 0.15
Nodes (23): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTable() (+15 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (27): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), isValidTierYear(), normalizeUsdPrice(), normalizeYear(), PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS (+19 more)

### Community 30 - "UserAuthCard.tsx"
Cohesion: 0.24
Nodes (10): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+2 more)

### Community 31 - "SaleAdFormModal.tsx"
Cohesion: 0.08
Nodes (32): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, FieldError(), inputClassName() (+24 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.23
Nodes (14): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+6 more)

### Community 33 - "price-list.ts"
Cohesion: 0.14
Nodes (27): dynamic, metadata, PanelPriceListPage(), StatTile(), LiveClock(), CarInfoRow, carInfoSelect, compareDigitPrices() (+19 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.35
Nodes (11): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+3 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.08
Nodes (37): react-dom, PanelAppLayout(), PanelSectionLayout(), viewport, metadata, PanelLoginPage(), findActivePanelItem(), PANEL_NAV_ITEMS (+29 more)

### Community 36 - "next"
Cohesion: 0.09
Nodes (40): next, CarTypeActionResult, CarTypeSimpleActionResult, guardRequest(), CarActionResult, CarSimpleActionResult, guardRequest(), STALE_RELATION_RESULT (+32 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.11
Nodes (27): BranchMapPoint, ConsultationFab(), ConsultationFabProps, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout() (+19 more)

### Community 38 - "SaleAdsManager.tsx"
Cohesion: 0.14
Nodes (20): CarsTableProps, ColorFormModalProps, ColorsManagerProps, ColorsTableProps, OptionFormModalProps, OptionsManagerProps, OptionsTableProps, PriceTableCarsTableProps (+12 more)

### Community 39 - "CarFormModal.tsx"
Cohesion: 0.17
Nodes (19): createCarAction(), deleteCarAction(), isPrismaCode(), updateCarAction(), BrandFormModalProps, BrandsManagerProps, BrandsTableProps, CarFormModal() (+11 more)

### Community 40 - "app/layout.tsx"
Cohesion: 0.19
Nodes (11): jetbrainsMono, metadata, RootLayout(), vazirmatn, Footer(), DOCK_ITEMS, MobileBottomDock(), Navbar() (+3 more)

### Community 41 - "validation/colors.ts"
Cohesion: 0.40
Nodes (4): COLOR_CODE_PATTERN, colorCoreSchema, ColorFormValues, ParsedColorForm

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.21
Nodes (23): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+15 more)

### Community 43 - "sale-ads/actions.ts"
Cohesion: 0.15
Nodes (39): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+31 more)

### Community 44 - "otp.ts"
Cohesion: 0.18
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
Cohesion: 0.16
Nodes (17): dynamic, metadata, PanelVerificationPage(), DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary() (+9 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.12
Nodes (12): isValidCompanyNationalId(), isValidNationalCode(), profileUpdateSchema, saveVerificationFile(), isVerificationPersonType(), VERIFICATION_DOC_MAX_BYTES, VerificationIdentity, VerificationPersonType (+4 more)

### Community 50 - "BuyAdDetailView.tsx"
Cohesion: 0.19
Nodes (21): ColorSwatch(), ColorSwatchProps, AdGallery(), NoImage(), MyAdCard(), NoImage(), STATUS_HINT, BuyAdNoImage() (+13 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "BrandsManager"
Cohesion: 0.24
Nodes (13): toggleBrandActiveAction(), AdminBrandsPage(), dynamic, metadata, BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError() (+5 more)

### Community 54 - "react"
Cohesion: 0.08
Nodes (33): lucide-react, react, ModalState, ModalState, CarImagesManagerProps, ModalState, CarsTable(), ModalState (+25 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.29
Nodes (10): CurrencyToggle(), BuyAdForm(), BuyAdFormColor, digitsToAscii(), FieldError(), inputClass(), MILEAGE_PRESETS, mileageNumber() (+2 more)

### Community 56 - "branches/actions.ts"
Cohesion: 0.30
Nodes (16): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+8 more)

### Community 57 - "lib/branches.ts"
Cohesion: 0.19
Nodes (12): AdminBranchesPage(), dynamic, metadata, metadata, PanelContactPage(), BRANCH_INCLUDE, BRANCH_ORDER_BY, BranchWithPlace (+4 more)

### Community 58 - "SponsorsManager.tsx"
Cohesion: 0.20
Nodes (11): AdminSponsorsPage(), dynamic, metadata, SponsorFormModalProps, ModalState, SponsorsManagerProps, SponsorsTableProps, listSponsors() (+3 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.16
Nodes (16): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_DESCRIPTION_MAX, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_MAX_DIGITS, BUY_AD_SORT_LABELS (+8 more)

### Community 60 - "validation/car-types.ts"
Cohesion: 0.20
Nodes (12): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+4 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.16
Nodes (16): dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps (+8 more)

### Community 63 - "user-car-extras.ts"
Cohesion: 0.24
Nodes (11): AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson(), planImages() (+3 more)

### Community 64 - "MyBuyAdsManager.tsx"
Cohesion: 0.20
Nodes (11): BuyAdCardProps, BuyAdDetailViewProps, BuyAdFormProps, MyBuyAdCardProps, FILTERS, MyBuyAdsManager(), MyBuyAdsManagerProps, NewBuyAdButton() (+3 more)

### Community 65 - "lib/user-cars.ts"
Cohesion: 0.18
Nodes (10): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow, userCarOptionsInclude (+2 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.20
Nodes (21): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+13 more)

### Community 73 - "requireUser"
Cohesion: 0.19
Nodes (13): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+5 more)

### Community 74 - "guards.ts"
Cohesion: 0.13
Nodes (21): AdminAdminsPage(), AdminPendingAdsPage(), dynamic, metadata, AdminCarTypesPage(), dynamic, metadata, AdminForbiddenPage() (+13 more)

### Community 76 - "validation/brands.ts"
Cohesion: 0.13
Nodes (14): ALLOWED_IMAGE_MIME_TYPES, brandCoreSchema, BrandFormValues, fallbackSlug(), MAX_IMAGE_SIZE_BYTES, ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess (+6 more)

### Community 77 - "BranchesManager"
Cohesion: 0.42
Nodes (9): BranchesManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord(), byDisplayOrder() (+1 more)

### Community 78 - "BranchFormModal.tsx"
Cohesion: 0.12
Nodes (22): BranchesManagerProps, BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel(), inputClassName(), LocationPicker (+14 more)

### Community 79 - "AdminVerificationForm"
Cohesion: 0.28
Nodes (8): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName(), newDoc()

### Community 80 - "(app)/price-table/page.tsx"
Cohesion: 0.43
Nodes (7): AdminUserPriceTablePage(), dynamic, metadata, PanelPriceTablePage(), listColors(), listPriceTableCars(), listUserPriceTableEntries()

### Community 81 - "admin/auth-actions.ts"
Cohesion: 0.21
Nodes (14): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), PASSWORD_HASH_ROUNDS, consumeTiming(), DUMMY_PASSWORD_HASH (+6 more)

### Community 82 - "user-auth.ts"
Cohesion: 0.39
Nodes (6): dynamic, GET(), CurrentUser, getCurrentUser(), isPartnerUser(), SessionUser

### Community 83 - "currency.ts"
Cohesion: 0.16
Nodes (20): CurrencyTag(), CurrencyToggleProps, AdPriceHistory(), percent(), PriceHistoryPanel(), AdCardProps, PriceDeltaBadge(), PriceDeltaBadgeProps (+12 more)

### Community 84 - "requireCollaborator"
Cohesion: 0.11
Nodes (30): dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic, metadata (+22 more)

### Community 86 - "admin/page.tsx"
Cohesion: 0.31
Nodes (7): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo(), AdminLogoProps, LoginForm(), handleSubmit()

### Community 89 - "AdsManager"
Cohesion: 0.36
Nodes (8): AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList(), PageLink()

### Community 92 - "toPersianDigits"
Cohesion: 0.14
Nodes (21): AdDetailPage(), dynamic, metadata, AdDetailView(), AdDetailViewProps, PriceEquivalent(), SectionTitle(), Spec() (+13 more)

### Community 95 - "admins/actions.ts"
Cohesion: 0.05
Nodes (73): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+65 more)

### Community 96 - "validation/user-cars.ts"
Cohesion: 0.25
Nodes (7): AD_STATUSES, optionalNumeric(), ParsedUserCarForm, requiredPrice(), UserCarInput, userCarSaleTermEntrySchema, UserCarSaleTermInput

### Community 102 - "uploads.ts"
Cohesion: 0.08
Nodes (32): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+24 more)

### Community 106 - "images/actions.ts"
Cohesion: 0.21
Nodes (14): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), dynamic, metadata (+6 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 642 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarTypesManager.tsx`, `users/actions.ts`, `AdminVerificationForm.tsx`, `colors/actions.ts`, `panel-search.ts`, `formatPersianNumber`, `CarOffersView.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `AdsManager.tsx`, `UserAuthCard.tsx`, `SaleAdFormModal.tsx`, `(panel)/price-table/actions.ts`, `price-list.ts`, `PanelShell.tsx`, `ContactView.tsx`, `CarFormModal.tsx`, `app/layout.tsx`, `VerificationManager.tsx`, `BuyAdDetailView.tsx`, `react`, `BuyAdForm.tsx`, `CurrencyRates.tsx`, `MyBuyAdsManager.tsx`, `BranchesMap.tsx`, `requireUser`, `BranchFormModal.tsx`, `AdminVerificationForm`, `currency.ts`, `requireCollaborator`, `admin/page.tsx`, `AdsManager`, `toPersianDigits`, `admins/actions.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07686116700201208 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarTypesManager.tsx`, `server-only`, `users/actions.ts`, `AdminVerificationForm.tsx`, `cn`, `colors/actions.ts`, `panel-search.ts`, `formatPersianNumber`, `CarOffersView.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `AdsManager.tsx`, `UserAuthCard.tsx`, `SaleAdFormModal.tsx`, `(panel)/price-table/actions.ts`, `price-list.ts`, `PanelShell.tsx`, `next`, `ContactView.tsx`, `SaleAdsManager.tsx`, `CarFormModal.tsx`, `app/layout.tsx`, `package.json`, `VerificationManager.tsx`, `BuyAdDetailView.tsx`, `BrandsManager`, `BuyAdForm.tsx`, `lib/branches.ts`, `SponsorsManager.tsx`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `MyBuyAdsManager.tsx`, `BranchesMap.tsx`, `requireUser`, `guards.ts`, `BranchFormModal.tsx`, `(app)/price-table/page.tsx`, `currency.ts`, `requireCollaborator`, `admin/page.tsx`, `toPersianDigits`, `admins/actions.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07542087542087542 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarTypesManager.tsx`, `users/actions.ts`, `AdminVerificationForm.tsx`, `SaleAdsManager`, `cn`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `panel/auth-actions.ts`, `CarOffersView.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `khodroyab-data.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `AdsManager.tsx`, `price-table-shared.ts`, `UserAuthCard.tsx`, `SaleAdFormModal.tsx`, `(panel)/price-table/actions.ts`, `price-list.ts`, `next`, `ContactView.tsx`, `SaleAdsManager.tsx`, `CarFormModal.tsx`, `sponsors/actions.ts`, `VerificationManager.tsx`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `BrandsManager`, `react`, `BuyAdForm.tsx`, `SponsorsManager.tsx`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `user-car-extras.ts`, `MyBuyAdsManager.tsx`, `requireUser`, `guards.ts`, `BranchesManager`, `BranchFormModal.tsx`, `AdminVerificationForm`, `currency.ts`, `requireCollaborator`, `AdsManager`, `admins/actions.ts`, `validation/user-cars.ts`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._