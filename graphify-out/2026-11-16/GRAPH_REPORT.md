# Graph Report - khodroyab  (2026-11-16)

## Corpus Check
- 378 files · ~211,231 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2629 nodes · 8865 edges · 120 communities (113 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `416d0f6b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- cars/actions.ts
- admin-buy-ads.ts
- AdPriceHistory.tsx
- SubscriptionPlanFormModal.tsx
- roles/actions.ts
- VerificationManager.tsx
- Admin authentication flow
- contact/page.tsx
- toPersianDigits
- colors/actions.ts
- (panel)/dashboard/page.tsx
- panel-search.ts
- car-form/actions.ts
- AttentionList.tsx
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- next
- BuyAdOffersPanel.tsx
- admins/actions.ts
- MyAdForm
- currency.ts
- price-market.ts
- user-auth.ts
- PriceTableManager.tsx
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- prisma.ts
- ContactView.tsx
- server-only
- permissions.ts
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- brands/actions.ts
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
- ads/actions.ts
- BuyAdForm.tsx
- verification-submission.ts
- SystemSettingsForm.tsx
- user-codes.ts
- panel-search-shared.ts
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- UserAuthCard.tsx
- verification.ts
- utils.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- uploads.ts
- UPLOAD_DIR env
- BranchesMap.tsx
- AdKindTabs.tsx
- AdminShell.tsx
- middleware.ts
- purchase-requests-shared.ts
- UrlFilterBar.tsx
- purchase-request-actions.ts
- VerificationManager
- normalizeDigits
- search/page.tsx
- BranchesManager
- requireCollaborator
- cn
- SellersDirectory.tsx
- adminActionDenied
- branches/actions.ts
- PurchaseRequestButton.tsx
- tailwindcss
- SponsorsManager
- SaleAdFormModal.tsx
- user-car-extras.ts
- ThemeSwitch.tsx
- lib/user-cars.ts
- [audience]/page.tsx
- lib/admins.ts
- seed-locations.mjs
- StatTile.tsx
- AdsManager
- requests/page.tsx
- images/actions.ts
- AdminVerificationForm
- BranchFormModal.tsx
- PurchaseRequestsManager.tsx
- CarImagesManager.tsx
- [code]/page.tsx
- formatPersianNumber
- AdminFormModal.tsx
- [...path]/route.ts
- validation/admins.ts
- validation/branches.ts
- SaleAdFormModal
- BranchesManager.tsx
- CarMediaSlider.tsx
- AdminsManager
- SearchableSelect
- RecentUsers.tsx
- react

## God Nodes (most connected - your core abstractions)
1. `cn()` - 318 edges
2. `toPersianDigits()` - 261 edges
3. `react` - 215 edges
4. `next` - 162 edges
5. `lucide-react` - 154 edges
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

## Communities (120 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.10
Nodes (37): cancelUserSubscriptionAction(), grantUserSubscriptionAction(), SubscriptionPlanActionResult, SubscriptionSimpleActionResult, UserSubscriptionActionResult, GrantSubscriptionModal(), handleSubmit(), GrantSubscriptionModalProps (+29 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (41): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+33 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.11
Nodes (30): reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), UserFormModalProps, headlinePrice(), UserPriceTablePreview() (+22 more)

### Community 3 - "cars/actions.ts"
Cohesion: 0.08
Nodes (40): sanitize-html, CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode() (+32 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (74): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+66 more)

### Community 5 - "AdPriceHistory.tsx"
Cohesion: 0.29
Nodes (8): AdPriceHistory(), percent(), PriceHistoryPanel(), formatCompact(), PAD, PriceHistoryChart(), PriceHistoryChartProps, SearchPricePoint

### Community 6 - "SubscriptionPlanFormModal.tsx"
Cohesion: 0.16
Nodes (25): createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), toggleSubscriptionPlanActiveAction(), updateSubscriptionPlanAction(), AdminSubscriptionsPage() (+17 more)

### Community 7 - "roles/actions.ts"
Cohesion: 0.20
Nodes (18): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+10 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.15
Nodes (22): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS (+14 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "contact/page.tsx"
Cohesion: 0.13
Nodes (17): metadata, PageProps, PanelContactPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES (+9 more)

### Community 11 - "toPersianDigits"
Cohesion: 0.15
Nodes (32): ColorSwatch(), ColorSwatchProps, AdDetailView(), PriceEquivalent(), SectionTitle(), Spec(), AdGallery(), NoImage() (+24 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.10
Nodes (32): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+24 more)

### Community 13 - "(panel)/dashboard/page.tsx"
Cohesion: 0.21
Nodes (16): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), CatalogOverview(), DashboardCard(), DashboardCardProps (+8 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.16
Nodes (22): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+14 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.11
Nodes (29): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+21 more)

### Community 16 - "AttentionList.tsx"
Cohesion: 0.43
Nodes (6): AdminShellUser, AttentionListProps, Severity, CatalogOverviewProps, AdminAccess, DashboardData

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.18
Nodes (18): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, Bucket (+10 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.13
Nodes (25): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), AdminPurchaseRequestPage(), dynamic, metadata, PageProps (+17 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.10
Nodes (38): AdminUserProfilePage(), parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest() (+30 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.16
Nodes (22): parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH, MAX_AD_PAGE_NOTICE_LENGTH, MAX_CONTACT_ADDRESS_LENGTH (+14 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.11
Nodes (30): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+22 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.07
Nodes (49): BuyAdDetailPage(), dynamic, metadata, BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdDetailViewProps (+41 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.17
Nodes (16): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo() (+8 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.15
Nodes (27): BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure() (+19 more)

### Community 25 - "next"
Cohesion: 0.15
Nodes (8): next, AdminForbiddenPage(), dynamic, metadata, jetbrainsMono, metadata, vazirmatn, requireAdmin()

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.17
Nodes (20): BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), cleanDigits(), compareDigits() (+12 more)

### Community 27 - "admins/actions.ts"
Cohesion: 0.29
Nodes (17): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+9 more)

### Community 28 - "MyAdForm"
Cohesion: 0.17
Nodes (7): useAdExtras(), addFiles(), FieldError(), inputClassName(), MyAdForm(), addRow(), nextKey()

### Community 29 - "currency.ts"
Cohesion: 0.09
Nodes (32): CurrencyToggleProps, Draft, CURRENCY_LABELS, DEFAULT_PRICE_TABLE_CURRENCY, PRICE_CURRENCIES, PriceCurrency, countPriceListSellers(), PriceListCarDetail (+24 more)

### Community 30 - "price-market.ts"
Cohesion: 0.19
Nodes (19): UserPriceTablePreviewProps, PlateGlyph(), PriceMarketIcon(), PriceMarketTabsProps, TabBadge, MyPriceTableManagerProps, PriceTableMarketEditorProps, DEFAULT_PRICE_MARKET (+11 more)

### Community 31 - "user-auth.ts"
Cohesion: 0.13
Nodes (21): dynamic, GET(), AdDetailPage(), dynamic, metadata, PanelAppLayout(), dynamic, metadata (+13 more)

### Community 32 - "PriceTableManager.tsx"
Cohesion: 0.19
Nodes (18): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+10 more)

### Community 33 - "price-list.ts"
Cohesion: 0.17
Nodes (21): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn(), jalaliDate (+13 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.28
Nodes (13): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+5 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.08
Nodes (31): metadata, PageProps, PanelLoginPage(), ConsultationFab(), ConsultationFabProps, DollarTicker(), activeDockKey(), PAGE_TITLES (+23 more)

### Community 36 - "prisma.ts"
Cohesion: 0.09
Nodes (30): AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata, AdminCarsPage(), dynamic (+22 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (24): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+16 more)

### Community 38 - "server-only"
Cohesion: 0.16
Nodes (20): jose, server-only, authenticateAdmin(), DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload (+12 more)

### Community 39 - "permissions.ts"
Cohesion: 0.27
Nodes (10): AttentionItem, CatalogItem, PERMISSION_ICONS, PermissionChipsProps, AuthorizedAdmin, ADMIN_PERMISSION_META, ADMIN_PERMISSIONS, AdminPermission (+2 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.10
Nodes (38): dynamic, PageProps, PriceListCarPage(), AdDetailViewProps, CarOffersView(), CarOffersViewProps, compareDigits(), PriceOrder (+30 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.20
Nodes (20): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+12 more)

### Community 42 - "brands/actions.ts"
Cohesion: 0.11
Nodes (28): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+20 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.12
Nodes (27): div(), jalaliToGregorian(), parseJalaliDate(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, buildOrderBy(), buildWhere(), carLabelOf(), CreatePurchaseRequestResult (+19 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (12): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+4 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+9 more)

### Community 48 - "sale-ads/actions.ts"
Cohesion: 0.21
Nodes (21): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+13 more)

### Community 49 - "isTrustedOrigin"
Cohesion: 0.24
Nodes (10): adminSubmitVerificationAction(), AdminSubmitVerificationResult, revalidateVerificationPages(), ReviewVerificationResult, submitVerificationAction(), SubmitVerificationResult, isTrustedOrigin(), VERIFICATION_REJECT_REASON_MAX (+2 more)

### Community 50 - "MyBuyAdsManager.tsx"
Cohesion: 0.18
Nodes (13): dynamic, metadata, MyBuyAdsPage(), BuyAdCardProps, BuyAdFormProps, MyBuyAdCardProps, FILTERS, MyBuyAdsManager() (+5 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "dashboard.ts"
Cohesion: 0.33
Nodes (9): bucketByDay(), computeDelta(), dayKey(), faDate, faLongDate, faShortDate, getDashboardData(), shiftDays() (+1 more)

### Community 54 - "ads/actions.ts"
Cohesion: 0.26
Nodes (18): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+10 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.29
Nodes (10): CurrencyToggle(), BuyAdForm(), BuyAdFormColor, digitsToAscii(), FieldError(), inputClass(), MILEAGE_PRESETS, mileageNumber() (+2 more)

### Community 56 - "verification-submission.ts"
Cohesion: 0.15
Nodes (8): isValidCompanyNationalId(), saveVerificationFile(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission, ParseVerificationResult, readIdentity(), StoreVerificationResult

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.18
Nodes (17): ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard(), SettingsProvinceOption, SystemSettingsForm() (+9 more)

### Community 58 - "user-codes.ts"
Cohesion: 0.15
Nodes (15): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, getSystemSettings, parseRotationMinutes(), saveSystemSettings() (+7 more)

### Community 59 - "panel-search-shared.ts"
Cohesion: 0.20
Nodes (13): DEFAULTS, SearchFiltersProps, SORTS, AdDetailRecord, AdDetailSaleTerm, SEARCH_SORT_LABELS, SEARCH_SORTS, SearchAdSaleTerm (+5 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (16): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, RichTextEditor (+8 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.10
Nodes (29): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES (+21 more)

### Community 63 - "UserAuthCard.tsx"
Cohesion: 0.22
Nodes (11): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+3 more)

### Community 64 - "verification.ts"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelVerificationPage(), faDateTime, getUserVerification(), verificationDocumentUrl(), verificationInclude, VerificationRow (+1 more)

### Community 65 - "utils.ts"
Cohesion: 0.09
Nodes (27): react-dom, BrandFormModalProps, BrandsManagerProps, BrandsTableProps, CarTypeFormModalProps, CarTypesManagerProps, ModalState, CarTypesTable() (+19 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "uploads.ts"
Cohesion: 0.09
Nodes (27): dynamic, fail(), POST(), RouteContext, runtime, dynamic, GET(), notFound() (+19 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "AdKindTabs.tsx"
Cohesion: 0.20
Nodes (12): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+4 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.15
Nodes (19): AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup, AdminNavItem, AdminSubNavItem, findActiveNavItem() (+11 more)

### Community 76 - "middleware.ts"
Cohesion: 0.24
Nodes (9): ADMIN_SESSION_COOKIE, isPublicPanelPath(), AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES, ProtectedArea (+1 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.11
Nodes (26): Chip(), jalaliDay, PERIODS, PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented(), ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS (+18 more)

### Community 78 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 79 - "purchase-request-actions.ts"
Cohesion: 0.12
Nodes (22): clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), handleSubmit(), listProvinceOptions(), createPurchaseRequest() (+14 more)

### Community 80 - "VerificationManager"
Cohesion: 0.21
Nodes (11): FieldError(), identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), SubmittedDocuments(), VerificationManager(), chooseFile() (+3 more)

### Community 81 - "normalizeDigits"
Cohesion: 0.05
Nodes (60): zod, createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction() (+52 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.18
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+6 more)

### Community 83 - "BranchesManager"
Cohesion: 0.32
Nodes (14): deleteBranchAction(), guardRequest(), parseId(), reorderBranchesAction(), revalidateBranchPages(), toggleBranchActiveAction(), BranchesManager(), handleConfirmDelete() (+6 more)

### Community 84 - "requireCollaborator"
Cohesion: 0.12
Nodes (27): dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic, metadata (+19 more)

### Community 85 - "cn"
Cohesion: 0.10
Nodes (35): AdsTable(), AdStatusBadge(), AdStatusBadgeProps, STYLES, BranchesTable(), BrandsTable(), PersonAvatar(), PersonCell() (+27 more)

### Community 86 - "SellersDirectory.tsx"
Cohesion: 0.25
Nodes (11): dynamic, metadata, PanelSellersPage(), groupSellerCode(), hueOf(), sellerInitials(), SellerMonogram(), asciiDigits() (+3 more)

### Community 87 - "adminActionDenied"
Cohesion: 0.15
Nodes (23): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), AdminCarTypesPage() (+15 more)

### Community 88 - "branches/actions.ts"
Cohesion: 0.17
Nodes (14): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, AdminBranchesPage(), dynamic, metadata, BRANCH_INCLUDE, BRANCH_ORDER_BY (+6 more)

### Community 89 - "PurchaseRequestButton.tsx"
Cohesion: 0.27
Nodes (9): fieldClass(), FieldError(), groupCode(), Label(), PurchaseRequestButton(), PurchaseRequestButtonProps, PurchaseRequestDialog(), SuccessState() (+1 more)

### Community 91 - "SponsorsManager"
Cohesion: 0.21
Nodes (14): AdminSponsorsPage(), dynamic, metadata, byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved() (+6 more)

### Community 92 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (51): @prisma/client, dynamic, metadata, PageProps, SearchParams, dynamic, metadata, PageProps (+43 more)

### Community 93 - "user-car-extras.ts"
Cohesion: 0.19
Nodes (15): AdImageDraft, AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson() (+7 more)

### Community 94 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 95 - "lib/user-cars.ts"
Cohesion: 0.15
Nodes (13): AdminUserSaleAdsPage(), EditAdPage(), AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), faDate, UserCarImageRecord, userCarImagesOrder (+5 more)

### Community 96 - "[audience]/page.tsx"
Cohesion: 0.24
Nodes (9): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), audienceWhere(), getAdminPurchaseRequestCounts(), getAdminPurchaseRequestFilterOptions() (+1 more)

### Community 97 - "lib/admins.ts"
Cohesion: 0.21
Nodes (12): AdminAdminsPage(), dynamic, metadata, AdminRolesPage(), dynamic, metadata, ADMIN_ORDER_BY, adminRecordSelect (+4 more)

### Community 98 - "seed-locations.mjs"
Cohesion: 0.20
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 99 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 100 - "AdsManager"
Cohesion: 0.22
Nodes (13): AdminAllAdsPage(), single(), toBigIntOrNull(), updateUserCarStatusAction(), AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive() (+5 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.28
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), purchaseRequestSourceLabel()

### Community 102 - "images/actions.ts"
Cohesion: 0.22
Nodes (11): CarImageActionResult, CarImageSimpleActionResult, CarImagesPage(), dynamic, metadata, PageProps, CarImagesManagerProps, CarImageRecord (+3 more)

### Community 103 - "AdminVerificationForm"
Cohesion: 0.28
Nodes (8): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName(), newDoc()

### Community 104 - "BranchFormModal.tsx"
Cohesion: 0.29
Nodes (11): createBranchAction(), placeError(), toData(), updateBranchAction(), BranchFormModal(), handleSubmit(), FieldError(), FieldLabel() (+3 more)

### Community 105 - "PurchaseRequestsManager.tsx"
Cohesion: 0.20
Nodes (16): PurchaseRequestsFiltersProps, buildPageList(), groupCode(), PageLink(), PurchaseRequestsManager(), changeStatus(), showToast(), PurchaseRequestsManagerProps (+8 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.24
Nodes (16): addCarImageAction(), deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesManager(), handleConfirmDelete(), handleFileChange(), handleVideoChange() (+8 more)

### Community 107 - "[code]/page.tsx"
Cohesion: 0.23
Nodes (11): dynamic, generateMetadata(), PageProps, SellerProfilePage(), listSellerAds(), PUBLIC_SELLER_WHERE, displayName(), getPublicSellerByCode() (+3 more)

### Community 108 - "formatPersianNumber"
Cohesion: 0.23
Nodes (10): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), SEGMENTS, StatusBreakdown(), StatusBreakdownProps (+2 more)

### Community 109 - "AdminFormModal.tsx"
Cohesion: 0.26
Nodes (10): AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManagerProps, PermissionChips(), RoleFormModalProps, RolesManagerProps (+2 more)

### Community 110 - "[...path]/route.ts"
Cohesion: 0.33
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 111 - "validation/admins.ts"
Cohesion: 0.22
Nodes (10): isAdminPermission(), normalizePermissions(), AdminFormInput, emailSchema, idSchema, nameSchema, parseRoleForm(), roleSchema (+2 more)

### Community 112 - "validation/branches.ts"
Cohesion: 0.24
Nodes (9): asciiDigits(), BRANCH_ADDRESS_MAX_LENGTH, BRANCH_MANAGER_MAX_LENGTH, BRANCH_SORT_ORDER_MAX, BRANCH_TITLE_MAX_LENGTH, branchSchema, coordinate(), ParsedBranchForm (+1 more)

### Community 113 - "SaleAdFormModal"
Cohesion: 0.25
Nodes (6): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow(), handleSubmit()

### Community 114 - "BranchesManager.tsx"
Cohesion: 0.36
Nodes (7): BranchesManagerProps, fold(), ModalState, BranchesTableProps, BranchFormModalProps, BranchRecord, ProvinceOption

### Community 115 - "CarMediaSlider.tsx"
Cohesion: 0.36
Nodes (5): CarMediaSlider(), CarMediaSliderProps, MediaViewer(), slideOffset(), CarMediaItem

### Community 116 - "AdminsManager"
Cohesion: 0.47
Nodes (6): AdminsManager(), handleDelete(), handleToggleActive(), showToast(), initials(), Stat()

### Community 117 - "SearchableSelect"
Cohesion: 0.40
Nodes (4): normalize(), SearchableSelect(), commit(), onSearchKeyDown()

### Community 118 - "RecentUsers.tsx"
Cohesion: 0.60
Nodes (4): initials(), RecentUsers(), RecentUsersProps, DashboardRecentUser

### Community 123 - "react"
Cohesion: 0.07
Nodes (32): lucide-react, react, faDate, ModalState, Confirm, ModalState, OptionsManagerProps, OptionsTable() (+24 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 727 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `AdPriceHistory.tsx`, `SubscriptionPlanFormModal.tsx`, `roles/actions.ts`, `VerificationManager.tsx`, `colors/actions.ts`, `(panel)/dashboard/page.tsx`, `car-form/actions.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `MyAdForm`, `currency.ts`, `price-market.ts`, `user-auth.ts`, `PriceTableManager.tsx`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `permissions.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `sale-ads/actions.ts`, `isTrustedOrigin`, `MyBuyAdsManager.tsx`, `BuyAdForm.tsx`, `verification-submission.ts`, `SystemSettingsForm.tsx`, `panel-search-shared.ts`, `market-rates.ts`, `UserAuthCard.tsx`, `utils.ts`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager`, `normalizeDigits`, `search/page.tsx`, `BranchesManager`, `requireCollaborator`, `cn`, `SellersDirectory.tsx`, `adminActionDenied`, `PurchaseRequestButton.tsx`, `SponsorsManager`, `SaleAdFormModal.tsx`, `user-car-extras.ts`, `StatTile.tsx`, `AdsManager`, `requests/page.tsx`, `AdminVerificationForm`, `BranchFormModal.tsx`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `[code]/page.tsx`, `formatPersianNumber`, `SaleAdFormModal`, `BranchesManager.tsx`, `CarMediaSlider.tsx`, `AdminsManager`, `RecentUsers.tsx`, `react`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10101010101010101 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `AdPriceHistory.tsx`, `SubscriptionPlanFormModal.tsx`, `roles/actions.ts`, `VerificationManager.tsx`, `contact/page.tsx`, `toPersianDigits`, `colors/actions.ts`, `(panel)/dashboard/page.tsx`, `car-form/actions.ts`, `AttentionList.tsx`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `MyAdForm`, `currency.ts`, `price-market.ts`, `user-auth.ts`, `PriceTableManager.tsx`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `permissions.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `MyBuyAdsManager.tsx`, `BuyAdForm.tsx`, `SystemSettingsForm.tsx`, `RichTextEditor.tsx`, `market-rates.ts`, `UserAuthCard.tsx`, `utils.ts`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `VerificationManager`, `normalizeDigits`, `search/page.tsx`, `requireCollaborator`, `SellersDirectory.tsx`, `adminActionDenied`, `PurchaseRequestButton.tsx`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `StatTile.tsx`, `AdsManager`, `requests/page.tsx`, `AdminVerificationForm`, `BranchFormModal.tsx`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `formatPersianNumber`, `AdminFormModal.tsx`, `SaleAdFormModal`, `CarMediaSlider.tsx`, `AdminsManager`, `SearchableSelect`, `RecentUsers.tsx`, `react`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07910014513788098 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `AdPriceHistory.tsx`, `SubscriptionPlanFormModal.tsx`, `VerificationManager.tsx`, `contact/page.tsx`, `toPersianDigits`, `colors/actions.ts`, `(panel)/dashboard/page.tsx`, `car-form/actions.ts`, `AttentionList.tsx`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `next`, `BuyAdOffersPanel.tsx`, `currency.ts`, `price-market.ts`, `user-auth.ts`, `PriceTableManager.tsx`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `permissions.ts`, `price-list/[carId]/page.tsx`, `package.json`, `MyBuyAdsManager.tsx`, `BuyAdForm.tsx`, `SystemSettingsForm.tsx`, `user-codes.ts`, `panel-search-shared.ts`, `RichTextEditor.tsx`, `market-rates.ts`, `UserAuthCard.tsx`, `verification.ts`, `utils.ts`, `BranchesMap.tsx`, `AdKindTabs.tsx`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `search/page.tsx`, `requireCollaborator`, `cn`, `SellersDirectory.tsx`, `adminActionDenied`, `branches/actions.ts`, `PurchaseRequestButton.tsx`, `SponsorsManager`, `SaleAdFormModal.tsx`, `user-car-extras.ts`, `ThemeSwitch.tsx`, `[audience]/page.tsx`, `lib/admins.ts`, `StatTile.tsx`, `requests/page.tsx`, `images/actions.ts`, `BranchFormModal.tsx`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `[code]/page.tsx`, `formatPersianNumber`, `AdminFormModal.tsx`, `BranchesManager.tsx`, `CarMediaSlider.tsx`, `RecentUsers.tsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._