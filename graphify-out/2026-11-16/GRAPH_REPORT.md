# Graph Report - khodroyab  (2026-11-16)

## Corpus Check
- 374 files · ~208,578 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2603 nodes · 8711 edges · 112 communities (105 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `416d0f6b`
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
- roles/actions.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- contact/page.tsx
- currency.ts
- colors/actions.ts
- react
- panel-search.ts
- car-form/actions.ts
- (panel)/dashboard/page.tsx
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/colors.ts
- lib/system-settings.ts
- MyPriceTableManager
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- admins/actions.ts
- SaleAdFormModal.tsx
- price-table-shared.ts
- MyPriceTableManager.tsx
- Modal
- lib/cars.ts
- price-list.ts
- sale-terms/actions.ts
- utils.ts
- next
- ContactView.tsx
- session.ts
- permissions.ts
- cn
- lib/price-table.ts
- sponsors/actions.ts
- lib/purchase-requests.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- isTrustedOrigin
- MyBuyAdsManager.tsx
- dependencies
- scripts
- dashboard.ts
- Toggle
- BuyAdForm.tsx
- verification-submission.ts
- settings/actions.ts
- user-codes.ts
- panel-search-shared.ts
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- getSystemSettings
- search/buy/page.tsx
- CarTypesManager.tsx
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- uploads.ts
- UPLOAD_DIR env
- BranchesMap.tsx
- getCurrentUser
- AdminShell.tsx
- middleware.ts
- purchase-requests-shared.ts
- UrlFilterBar.tsx
- purchase-request-actions.ts
- VerificationManager.tsx
- normalizeDigits
- search/page.tsx
- BranchFormModal.tsx
- prisma.ts
- AdsManager.tsx
- [code]/page.tsx
- car-types/actions.ts
- server-only
- PurchaseRequestButton.tsx
- tailwindcss
- SaleAdsManager.tsx
- ads/page.tsx
- validation/brands.ts
- CarsManager.tsx
- lib/user-cars.ts
- [audience]/page.tsx
- subscriptions-shared.ts
- rich-text.ts
- StatTile.tsx
- AdExtraFields.tsx
- requests/page.tsx
- CarTypesManager
- AdminVerificationForm
- parseJalaliDate
- PurchaseRequestsManager.tsx
- CarImagesManager.tsx
- buy-ads-shared.ts
- PriceCurrency
- SponsorsMarquee.tsx
- zod
- Toast

## God Nodes (most connected - your core abstractions)
1. `cn()` - 314 edges
2. `toPersianDigits()` - 259 edges
3. `react` - 213 edges
4. `next` - 161 edges
5. `lucide-react` - 152 edges
6. `formatPersianNumber()` - 83 edges
7. `prisma` - 72 edges
8. `isTrustedOrigin()` - 63 edges
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

## Communities (112 total, 7 thin omitted)

### Community 0 - "UserSubscriptionsSection.tsx"
Cohesion: 0.13
Nodes (20): UserSubscriptionActionResult, GrantSubscriptionModal(), handleSubmit(), GrantSubscriptionModalProps, GrantSuccess, inputClassName(), SubscriptionBadge(), SubscriptionBadgeProps (+12 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.07
Nodes (44): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+36 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.14
Nodes (27): revalidateVerificationPages(), reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview() (+19 more)

### Community 3 - "cars/actions.ts"
Cohesion: 0.28
Nodes (14): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+6 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (76): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+68 more)

### Community 5 - "toPersianDigits"
Cohesion: 0.21
Nodes (18): AdDetailPage(), BuyAdsTable(), StatusBreakdown(), AdDetailView(), PriceEquivalent(), SectionTitle(), Spec(), AdPriceHistory() (+10 more)

### Community 6 - "subscriptions/actions.ts"
Cohesion: 0.20
Nodes (22): cancelUserSubscriptionAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult, SubscriptionSimpleActionResult (+14 more)

### Community 7 - "roles/actions.ts"
Cohesion: 0.15
Nodes (23): AdminAdminsPage(), dynamic, metadata, createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation() (+15 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.16
Nodes (19): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationManagerProps, isVerificationPersonType(), VERIFICATION_DOC_HINTS (+11 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "contact/page.tsx"
Cohesion: 0.15
Nodes (16): metadata, PageProps, PanelContactPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES (+8 more)

### Community 11 - "currency.ts"
Cohesion: 0.09
Nodes (43): dynamic, metadata, ColorsTable(), ColorSwatch(), ColorSwatchProps, AdCarPickerProps, AdDetailViewProps, AdGallery() (+35 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.13
Nodes (26): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+18 more)

### Community 13 - "react"
Cohesion: 0.07
Nodes (23): lucide-react, react, react-dom, DashboardCardProps, DashboardEmpty(), RecentAdsProps, RecentUsersProps, TopBrands() (+15 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.15
Nodes (23): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+15 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.12
Nodes (27): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+19 more)

### Community 16 - "(panel)/dashboard/page.tsx"
Cohesion: 0.16
Nodes (20): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdminShellUser, AttentionItem, AttentionList(), AttentionListProps (+12 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.19
Nodes (16): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+8 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.18
Nodes (20): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), CardTitle(), CodeChip(), groupCode(), PersonFlags() (+12 more)

### Community 19 - "lib/colors.ts"
Cohesion: 0.13
Nodes (24): AdminColorsPage(), dynamic, metadata, parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata (+16 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.13
Nodes (28): ContactField, ContactValues, SettingsProvinceOption, SystemSettingsFormProps, PRICE_TABLE_PRICE_FIELDS, parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS (+20 more)

### Community 21 - "MyPriceTableManager"
Cohesion: 0.24
Nodes (16): emptyDraft(), emptyTier(), MyPriceTableManager(), addColor(), addYear(), appendTier(), clearRow(), handleSave() (+8 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.15
Nodes (19): BuyAdDetailPage(), dynamic, metadata, buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE, buyAdDetailInclude, buyAdInclude (+11 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.24
Nodes (12): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+4 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.22
Nodes (17): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setBuyAdActiveAction() (+9 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.13
Nodes (27): BuyAdOffersResult, findBiddableAd(), offersFailure(), submitBuyAdOfferAction(), withdrawBuyAdOfferAction(), BuyAdOffersPanel(), handleResult(), submitOffer() (+19 more)

### Community 27 - "admins/actions.ts"
Cohesion: 0.15
Nodes (31): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+23 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (24): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, FieldError(), inputClassName() (+16 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (27): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), isValidTierYear(), normalizeUsdPrice(), normalizeYear(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY (+19 more)

### Community 30 - "MyPriceTableManager.tsx"
Cohesion: 0.12
Nodes (18): borderFor(), Drafts, duplicateTierKeys(), ErrorText(), FILTERS, inputBase, isFilled(), isTierPriced() (+10 more)

### Community 31 - "Modal"
Cohesion: 0.25
Nodes (11): createSubscriptionPlanAction(), asciiDigits(), inputClassName(), SubscriptionPlanFormModal(), handleSubmit(), SubscriptionPlanFormModalProps, SubscriptionPlansManagerProps, SubscriptionPlansTable() (+3 more)

### Community 32 - "lib/cars.ts"
Cohesion: 0.16
Nodes (21): AdminCarsPage(), dynamic, metadata, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages() (+13 more)

### Community 33 - "price-list.ts"
Cohesion: 0.07
Nodes (50): generateMetadata(), dynamic, metadata, PanelPriceListPage(), StatTile(), CarOffersViewProps, compareDigits(), PriceOrder (+42 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.26
Nodes (13): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+5 more)

### Community 35 - "utils.ts"
Cohesion: 0.08
Nodes (36): PanelAppLayout(), PanelSectionLayout(), viewport, AdminLogoProps, ConsultationFab(), ConsultationFabProps, activeDockKey(), PAGE_TITLES (+28 more)

### Community 36 - "next"
Cohesion: 0.10
Nodes (24): next, AdminPendingAdsPage(), dynamic, metadata, AdminBranchesPage(), dynamic, metadata, AdminPurchaseRequestsIndex() (+16 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (26): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+18 more)

### Community 38 - "session.ts"
Cohesion: 0.18
Nodes (18): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches() (+10 more)

### Community 39 - "permissions.ts"
Cohesion: 0.21
Nodes (16): PERMISSION_ICONS, PermissionChipsProps, inputClassName(), RoleFormModal(), clearError(), togglePermission(), RoleFormModalProps, RolesManager() (+8 more)

### Community 40 - "cn"
Cohesion: 0.17
Nodes (22): dynamic, PageProps, PriceListCarPage(), CurrencyTag(), CarMediaSlider(), CarMediaSliderProps, MediaViewer(), slideOffset() (+14 more)

### Community 41 - "lib/price-table.ts"
Cohesion: 0.14
Nodes (18): visibleTiers(), entrySignature(), faDate, listRecentUserPriceTableEntries(), mergeDisabledPrices(), PriceTableCarRow, priceTableCarSelect, PriceTableRow (+10 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.06
Nodes (70): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+62 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.12
Nodes (23): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, ADMIN_PURCHASE_REQUEST_PAGE_SIZE, buildOrderBy(), carLabelOf(), CreatePurchaseRequestResult (+15 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+9 more)

### Community 48 - "sale-ads/actions.ts"
Cohesion: 0.07
Nodes (67): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+59 more)

### Community 49 - "isTrustedOrigin"
Cohesion: 0.15
Nodes (20): adminSubmitVerificationAction(), AdminSubmitVerificationResult, ReviewVerificationResult, dynamic, fail(), POST(), RouteContext, runtime (+12 more)

### Community 50 - "MyBuyAdsManager.tsx"
Cohesion: 0.50
Nodes (4): FILTERS, MyBuyAdsManager(), NewBuyAdButton(), StateFilter

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "dashboard.ts"
Cohesion: 0.18
Nodes (15): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), bucketByDay(), computeDelta(), dayKey() (+7 more)

### Community 54 - "Toggle"
Cohesion: 0.30
Nodes (9): BranchesTable(), PriceTableCarsTable(), SponsorsTable(), Badge(), BadgeProps, BadgeTone, TONE_CLASSES, Toggle() (+1 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.17
Nodes (17): EditBuyAdPage(), dynamic, metadata, NewBuyAdDetailsPage(), AdCarChoice, BuyAdForm(), BuyAdFormColor, BuyAdFormProps (+9 more)

### Community 56 - "verification-submission.ts"
Cohesion: 0.16
Nodes (6): VERIFICATION_DOC_MAX_BYTES, VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission, ParseVerificationResult, StoreVerificationResult

### Community 57 - "settings/actions.ts"
Cohesion: 0.18
Nodes (16): saveSystemSettingsAction(), SystemSettingsActionResult, ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError() (+8 more)

### Community 58 - "user-codes.ts"
Cohesion: 0.15
Nodes (16): dynamic, metadata, PanelSellersPage(), PUBLIC_AD_WHERE, PUBLIC_SELLER_WHERE, displayName(), listPublicSellers(), PublicSeller (+8 more)

### Community 59 - "panel-search-shared.ts"
Cohesion: 0.20
Nodes (13): PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, AdDetailSaleTerm, SEARCH_SORT_LABELS, SEARCH_SORTS, SearchAdSaleTerm (+5 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.09
Nodes (31): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES (+23 more)

### Community 63 - "getSystemSettings"
Cohesion: 0.12
Nodes (21): metadata, PageProps, PanelLoginPage(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step (+13 more)

### Community 64 - "search/buy/page.tsx"
Cohesion: 0.19
Nodes (14): BuyAdsSearchPage(), dynamic, metadata, SearchParams, dynamic, metadata, PanelVerificationPage(), BuyAdFilters() (+6 more)

### Community 65 - "CarTypesManager.tsx"
Cohesion: 0.19
Nodes (13): AdminCarTypesPage(), dynamic, metadata, CarTypeFormModalProps, CarTypesManagerProps, ModalState, CarTypesTable(), CarTypesTableProps (+5 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "uploads.ts"
Cohesion: 0.06
Nodes (39): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+31 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "getCurrentUser"
Cohesion: 0.17
Nodes (14): framer-motion, dynamic, GET(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+6 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.10
Nodes (29): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+21 more)

### Community 76 - "middleware.ts"
Cohesion: 0.32
Nodes (7): AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES, ProtectedArea, redirectTo()

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.11
Nodes (25): Chip(), jalaliDay, PERIODS, PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented(), ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS (+17 more)

### Community 78 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 79 - "purchase-request-actions.ts"
Cohesion: 0.13
Nodes (19): clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), createPurchaseRequest(), PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX (+11 more)

### Community 80 - "VerificationManager.tsx"
Cohesion: 0.20
Nodes (14): DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), PERSON_TYPE_ICONS (+6 more)

### Community 81 - "normalizeDigits"
Cohesion: 0.08
Nodes (34): buildWhere(), buildWhere(), findUserIdsByAnyCode(), AdminLoginInput, adminLoginSchema, FieldErrors, normalizeDigits(), normalizePhone() (+26 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.23
Nodes (11): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+3 more)

### Community 83 - "BranchFormModal.tsx"
Cohesion: 0.09
Nodes (48): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+40 more)

### Community 84 - "prisma.ts"
Cohesion: 0.11
Nodes (27): dynamic, metadata, dynamic, metadata, NewBuyAdCarPage(), dynamic, metadata, NewAdCarPage() (+19 more)

### Community 85 - "AdsManager.tsx"
Cohesion: 0.12
Nodes (30): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTable() (+22 more)

### Community 86 - "[code]/page.tsx"
Cohesion: 0.17
Nodes (17): dynamic, generateMetadata(), PageProps, SellerProfilePage(), hrefFor(), pageWindow(), SearchPagination(), SearchPaginationProps (+9 more)

### Community 87 - "car-types/actions.ts"
Cohesion: 0.32
Nodes (11): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+3 more)

### Community 88 - "server-only"
Cohesion: 0.10
Nodes (37): server-only, createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction() (+29 more)

### Community 89 - "PurchaseRequestButton.tsx"
Cohesion: 0.24
Nodes (10): fieldClass(), FieldError(), groupCode(), Label(), PurchaseRequestButton(), PurchaseRequestButtonProps, PurchaseRequestDialog(), handleSubmit() (+2 more)

### Community 91 - "SaleAdsManager.tsx"
Cohesion: 0.16
Nodes (19): ColorsTableProps, OptionsTable(), OptionsTableProps, typeLabel(), PriceTableCarsTableProps, PriceTableManagerProps, SaleTermsTable(), SaleTermsTableProps (+11 more)

### Community 92 - "ads/page.tsx"
Cohesion: 0.14
Nodes (24): @prisma/client, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull() (+16 more)

### Community 93 - "validation/brands.ts"
Cohesion: 0.13
Nodes (14): ALLOWED_IMAGE_MIME_TYPES, brandCoreSchema, BrandFormValues, fallbackSlug(), MAX_IMAGE_SIZE_BYTES, ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess (+6 more)

### Community 94 - "CarsManager.tsx"
Cohesion: 0.29
Nodes (9): CarsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast(), ModalState, CarsTable() (+1 more)

### Community 95 - "lib/user-cars.ts"
Cohesion: 0.15
Nodes (12): AdImageDraft, AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), AdOptionValue, faDate, UserCarImageRecord, userCarImagesOrder (+4 more)

### Community 96 - "[audience]/page.tsx"
Cohesion: 0.19
Nodes (12): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), audienceWhere(), getAdminPurchaseRequestCounts(), getAdminPurchaseRequestFilterOptions() (+4 more)

### Community 97 - "subscriptions-shared.ts"
Cohesion: 0.26
Nodes (10): SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS, SUBSCRIPTION_WARNING_DAYS, field(), firstErrors(), grantSubscriptionSchema, parseGrantSubscriptionForm(), parseSubscriptionPlanForm() (+2 more)

### Community 98 - "rich-text.ts"
Cohesion: 0.27
Nodes (9): sanitize-html, COLOR, CSS_SIZE, isRichTextEmpty(), normalizeRichText(), renderRichText(), RICH_TEXT_MAX_LENGTH, sanitizeRichText() (+1 more)

### Community 99 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 100 - "AdExtraFields.tsx"
Cohesion: 0.48
Nodes (6): AdFieldTheme, AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES

### Community 101 - "requests/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_SOURCE_LABELS

### Community 102 - "CarTypesManager"
Cohesion: 0.60
Nodes (6): CarTypesManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 103 - "AdminVerificationForm"
Cohesion: 0.28
Nodes (8): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName(), newDoc()

### Community 104 - "parseJalaliDate"
Cohesion: 0.83
Nodes (3): div(), jalaliToGregorian(), parseJalaliDate()

### Community 105 - "PurchaseRequestsManager.tsx"
Cohesion: 0.20
Nodes (16): PurchaseRequestsFiltersProps, buildPageList(), groupCode(), PageLink(), PurchaseRequestsManager(), changeStatus(), showToast(), PurchaseRequestsManagerProps (+8 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.12
Nodes (30): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesPage(), dynamic (+22 more)

### Community 108 - "buy-ads-shared.ts"
Cohesion: 0.13
Nodes (20): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_DESCRIPTION_MAX, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_MAX_DIGITS, BUY_AD_OFFER_POLL_MS (+12 more)

### Community 117 - "PriceCurrency"
Cohesion: 0.40
Nodes (5): CurrencyToggleProps, Draft, PriceCurrency, PriceListCarDetail, PriceTableEntryInput

### Community 118 - "SponsorsMarquee.tsx"
Cohesion: 0.50
Nodes (4): SponsorCard(), SponsorsMarquee(), SponsorsMarqueeItem, SponsorsMarqueeProps

### Community 119 - "zod"
Cohesion: 0.18
Nodes (13): zod, carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug() (+5 more)

### Community 123 - "Toast"
Cohesion: 0.23
Nodes (11): ModalState, OptionsManagerProps, SaleTermsManager(), handleDelete(), showToast(), SaleTermsManagerProps, ConfirmDialog(), ConfirmDialogProps (+3 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 722 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `UserSubscriptionsSection.tsx`, `ProfileManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `subscriptions/actions.ts`, `roles/actions.ts`, `AdminVerificationForm.tsx`, `currency.ts`, `colors/actions.ts`, `react`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/system-settings.ts`, `MyPriceTableManager`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `MyPriceTableManager.tsx`, `Modal`, `lib/cars.ts`, `price-list.ts`, `utils.ts`, `next`, `ContactView.tsx`, `permissions.ts`, `cn`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `isTrustedOrigin`, `MyBuyAdsManager.tsx`, `dashboard.ts`, `Toggle`, `BuyAdForm.tsx`, `verification-submission.ts`, `settings/actions.ts`, `panel-search-shared.ts`, `market-rates.ts`, `getSystemSettings`, `search/buy/page.tsx`, `CarTypesManager.tsx`, `getCurrentUser`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager.tsx`, `normalizeDigits`, `search/page.tsx`, `BranchFormModal.tsx`, `prisma.ts`, `AdsManager.tsx`, `[code]/page.tsx`, `server-only`, `PurchaseRequestButton.tsx`, `SaleAdsManager.tsx`, `CarsManager.tsx`, `lib/user-cars.ts`, `StatTile.tsx`, `AdExtraFields.tsx`, `requests/page.tsx`, `CarTypesManager`, `AdminVerificationForm`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `buy-ads-shared.ts`, `Toast`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UserSubscriptionsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `UserSubscriptionsSection.tsx`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `toPersianDigits`, `AdminVerificationForm.tsx`, `contact/page.tsx`, `currency.ts`, `colors/actions.ts`, `react`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `PurchaseRequestDetailManager.tsx`, `lib/system-settings.ts`, `MyPriceTableManager`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `SaleAdFormModal.tsx`, `MyPriceTableManager.tsx`, `Modal`, `lib/cars.ts`, `price-list.ts`, `sale-terms/actions.ts`, `utils.ts`, `ContactView.tsx`, `permissions.ts`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `MyBuyAdsManager.tsx`, `dashboard.ts`, `Toggle`, `BuyAdForm.tsx`, `settings/actions.ts`, `RichTextEditor.tsx`, `market-rates.ts`, `getSystemSettings`, `search/buy/page.tsx`, `BranchesMap.tsx`, `getCurrentUser`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `VerificationManager.tsx`, `BranchFormModal.tsx`, `prisma.ts`, `AdsManager.tsx`, `[code]/page.tsx`, `car-types/actions.ts`, `server-only`, `PurchaseRequestButton.tsx`, `StatTile.tsx`, `AdExtraFields.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `SponsorsMarquee.tsx`, `Toast`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07402597402597402 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `UserSubscriptionsSection.tsx`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `toPersianDigits`, `subscriptions/actions.ts`, `roles/actions.ts`, `contact/page.tsx`, `currency.ts`, `colors/actions.ts`, `react`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/colors.ts`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `SaleAdFormModal.tsx`, `lib/cars.ts`, `price-list.ts`, `sale-terms/actions.ts`, `utils.ts`, `ContactView.tsx`, `session.ts`, `permissions.ts`, `cn`, `sponsors/actions.ts`, `lib/purchase-requests.ts`, `package.json`, `sale-ads/actions.ts`, `isTrustedOrigin`, `MyBuyAdsManager.tsx`, `BuyAdForm.tsx`, `settings/actions.ts`, `user-codes.ts`, `market-rates.ts`, `getSystemSettings`, `search/buy/page.tsx`, `CarTypesManager.tsx`, `uploads.ts`, `getCurrentUser`, `AdminShell.tsx`, `middleware.ts`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager.tsx`, `search/page.tsx`, `BranchFormModal.tsx`, `prisma.ts`, `AdsManager.tsx`, `[code]/page.tsx`, `car-types/actions.ts`, `server-only`, `PurchaseRequestButton.tsx`, `SaleAdsManager.tsx`, `ads/page.tsx`, `CarsManager.tsx`, `[audience]/page.tsx`, `StatTile.tsx`, `requests/page.tsx`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._