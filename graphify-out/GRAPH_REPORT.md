# Graph Report - khodroyab  (2026-11-16)

## Corpus Check
- 380 files · ~212,786 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2642 nodes · 8963 edges · 103 communities (96 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3973cc4b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- admin-buy-ads.ts
- toPersianDigits
- prisma.ts
- roles/actions.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- contact/page.tsx
- cn
- colors/actions.ts
- adminActionDenied
- panel-search.ts
- react
- isTrustedOrigin
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- admins/actions.ts
- MyAdForm.tsx
- currency.ts
- [code]/price-list/page.tsx
- getCurrentUser
- lib/cars.ts
- price-list.ts
- Modal
- PanelShell.tsx
- guards.ts
- ContactView.tsx
- session.ts
- buy-ads-shared.ts
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- Toggle
- lib/purchase-requests.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- BranchFormModal.tsx
- (app)/page.tsx
- dependencies
- scripts
- branches/actions.ts
- purchase-requests/actions.ts
- AdminsManager.tsx
- verification-submission.ts
- SystemSettingsForm
- user-codes.ts
- BranchesManager.tsx
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- UserAuthCard.tsx
- verification-actions.ts
- permissions.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- [id]/route.ts
- lucide-react
- middleware.ts
- purchase-requests-shared.ts
- UrlFilterBar.tsx
- purchase-request-actions.ts
- VerificationManager.tsx
- normalizeDigits
- search/page.tsx
- lib/admins.ts
- next
- PriceTableManager.tsx
- AdKindTabs.tsx
- ConfirmDialog
- validation/admins.ts
- tailwindcss
- [audience]/[id]/page.tsx
- SaleAdFormModal.tsx
- zod
- ThemeSwitch.tsx
- AdminShell.tsx
- lib/system-settings.ts
- requests/page.tsx
- AdminVerificationForm
- CarImagesManager.tsx
- utils.ts
- [...path]/route.ts
- Toast
- CarMediaSlider.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 321 edges
2. `toPersianDigits()` - 268 edges
3. `react` - 217 edges
4. `next` - 163 edges
5. `lucide-react` - 156 edges
6. `formatPersianNumber()` - 85 edges
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
- `AdminAllAdsPage()` --indirect_call--> `optionToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/options.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (103 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.08
Nodes (60): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+52 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.07
Nodes (39): react-dom, dynamic, faTime, metadata, PanelProfilePage(), CollaboratorShortcuts(), Shortcut(), FieldError() (+31 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (24): revalidateVerificationPages(), reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview() (+16 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.09
Nodes (38): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+30 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.06
Nodes (74): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+66 more)

### Community 5 - "toPersianDigits"
Cohesion: 0.12
Nodes (28): AdsTable(), AdStatusBadge(), RankMedal(), BuyAdsFilters(), Segmented(), BuyAdsTable(), Chip(), PurchaseRequestsFilters() (+20 more)

### Community 6 - "prisma.ts"
Cohesion: 0.10
Nodes (34): @prisma/client, server-only, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single() (+26 more)

### Community 7 - "roles/actions.ts"
Cohesion: 0.20
Nodes (19): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+11 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.14
Nodes (21): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationStatusBadgeProps, VerificationManagerProps, VERIFICATION_DOC_HINTS (+13 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "contact/page.tsx"
Cohesion: 0.13
Nodes (18): metadata, PageProps, PanelContactPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES (+10 more)

### Community 11 - "cn"
Cohesion: 0.08
Nodes (54): RequestRow(), ColorSwatch(), ColorSwatchProps, AdDetailView(), PriceEquivalent(), SectionTitle(), Spec(), AdGallery() (+46 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.15
Nodes (23): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+15 more)

### Community 13 - "adminActionDenied"
Cohesion: 0.15
Nodes (24): sanitize-html, CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode() (+16 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.10
Nodes (36): PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, adDetailInclude, AdViewer, buildOrderBy(), buildWhere() (+28 more)

### Community 15 - "react"
Cohesion: 0.08
Nodes (34): react, createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages() (+26 more)

### Community 16 - "isTrustedOrigin"
Cohesion: 0.14
Nodes (17): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), isTrustedOrigin(), toProfileRecord(), isManagedUpload(), ALLOWED_IMAGE_MIME_TYPES (+9 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.18
Nodes (17): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+9 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.22
Nodes (15): CardTitle(), CodeChip(), groupCode(), PersonFlags(), PurchaseRequestDetailManager(), changeStatus(), saveNote(), showToast() (+7 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.10
Nodes (36): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+28 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.13
Nodes (25): ContactField, ContactValues, SettingsProvinceOption, SystemSettingsFormProps, PRICE_TABLE_PRICE_FIELDS, DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint() (+17 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (31): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+23 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.10
Nodes (35): dynamic, GET(), BuyAdDetailPage(), dynamic, metadata, BuyAdsSearchPage(), dynamic, metadata (+27 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.20
Nodes (14): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), authenticateAdmin(), CurrentAdmin (+6 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.16
Nodes (23): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure(), parseBigInt() (+15 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.14
Nodes (24): BuyAdOffersResult, BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), BuyAdOffersPanelProps (+16 more)

### Community 27 - "admins/actions.ts"
Cohesion: 0.29
Nodes (17): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+9 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.07
Nodes (38): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, AdExtraFieldsProps, AdFieldTheme (+30 more)

### Community 29 - "currency.ts"
Cohesion: 0.09
Nodes (33): CurrencyToggleProps, AdDetailViewProps, Draft, CURRENCY_LABELS, DEFAULT_PRICE_TABLE_CURRENCY, PRICE_CURRENCIES, PriceCurrency, UsdRateInfo (+25 more)

### Community 30 - "[code]/price-list/page.tsx"
Cohesion: 0.18
Nodes (20): dynamic, PageProps, UserPriceTablePreviewProps, UserProfileProps, PlateGlyph(), PriceMarketIcon(), PriceMarketTabsProps, TabBadge (+12 more)

### Community 31 - "getCurrentUser"
Cohesion: 0.20
Nodes (13): AdDetailPage(), dynamic, metadata, dynamic, metadata, PageProps, PanelPriceListPage(), StatTile() (+5 more)

### Community 32 - "lib/cars.ts"
Cohesion: 0.19
Nodes (18): dynamic, metadata, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction() (+10 more)

### Community 33 - "price-list.ts"
Cohesion: 0.15
Nodes (24): CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), countPriceListSellers(), getPriceListMarketStats(), groupByColumn(), jalaliDate (+16 more)

### Community 34 - "Modal"
Cohesion: 0.15
Nodes (21): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+13 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.11
Nodes (20): ConsultationFab(), ConsultationFabProps, DollarTicker(), activeDockKey(), PAGE_TITLES, PANEL_NAV_ITEMS, PanelNavItem, panelPageTitle() (+12 more)

### Community 36 - "guards.ts"
Cohesion: 0.07
Nodes (36): AdminPendingAdsPage(), dynamic, metadata, AdminBranchesPage(), dynamic, metadata, AdminBrandsPage(), dynamic (+28 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.11
Nodes (28): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+20 more)

### Community 38 - "session.ts"
Cohesion: 0.21
Nodes (16): ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches(), createSessionToken() (+8 more)

### Community 39 - "buy-ads-shared.ts"
Cohesion: 0.16
Nodes (16): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_DESCRIPTION_MAX, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_MAX_DIGITS, BUY_AD_SORT_LABELS (+8 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.08
Nodes (47): dynamic, generateMetadata(), PageProps, PriceListCarPage(), SellerPriceListPage(), CarOffersView(), CarOffersViewProps, compareDigits() (+39 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.13
Nodes (34): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+26 more)

### Community 42 - "Toggle"
Cohesion: 0.13
Nodes (29): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+21 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.08
Nodes (35): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), div(), jalaliToGregorian(), parseJalaliDate() (+27 more)

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
Cohesion: 0.08
Nodes (61): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+53 more)

### Community 49 - "BranchFormModal.tsx"
Cohesion: 0.17
Nodes (15): BranchFormModal(), FieldError(), FieldLabel(), inputClassName(), LocationPicker, asciiDigits(), BRANCH_ADDRESS_MAX_LENGTH, BRANCH_MANAGER_MAX_LENGTH (+7 more)

### Community 50 - "(app)/page.tsx"
Cohesion: 0.18
Nodes (11): metadata, PageProps, PanelLoginPage(), PanelLogo(), PanelLogoProps, SIZES, isPublicPanelPath(), PANEL_HOME (+3 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "branches/actions.ts"
Cohesion: 0.30
Nodes (16): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+8 more)

### Community 54 - "purchase-requests/actions.ts"
Cohesion: 0.19
Nodes (14): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), buildPageList(), PageLink(), PurchaseRequestsManager(), changeStatus() (+6 more)

### Community 55 - "AdminsManager.tsx"
Cohesion: 0.22
Nodes (14): AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManager(), handleDelete(), handleToggleActive(), showToast() (+6 more)

### Community 56 - "verification-submission.ts"
Cohesion: 0.15
Nodes (7): saveVerificationFile(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission, ParseVerificationResult, StoreVerificationResult

### Community 57 - "SystemSettingsForm"
Cohesion: 0.29
Nodes (11): ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError(), handleSubmit(), setContactField() (+3 more)

### Community 58 - "user-codes.ts"
Cohesion: 0.15
Nodes (17): dynamic, metadata, PanelSellersPage(), PUBLIC_AD_WHERE, PUBLIC_SELLER_WHERE, displayName(), listPublicSellers(), PublicSeller (+9 more)

### Community 59 - "BranchesManager.tsx"
Cohesion: 0.21
Nodes (16): BranchesManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord(), BranchesManagerProps (+8 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.09
Nodes (31): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES (+23 more)

### Community 63 - "UserAuthCard.tsx"
Cohesion: 0.22
Nodes (11): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+3 more)

### Community 64 - "verification-actions.ts"
Cohesion: 0.15
Nodes (17): adminSubmitVerificationAction(), AdminSubmitVerificationResult, ReviewVerificationResult, submitVerificationAction(), SubmitVerificationResult, dynamic, metadata, PanelVerificationPage() (+9 more)

### Community 65 - "permissions.ts"
Cohesion: 0.24
Nodes (13): AttentionItem, CatalogItem, PERMISSION_ICONS, PermissionChipsProps, RoleFormModalProps, RolesManagerProps, AdminRoleRecord, AuthorizedAdmin (+5 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.20
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "[id]/route.ts"
Cohesion: 0.21
Nodes (9): dynamic, GET(), notFound(), RouteContext, runtime, MIME_TO_EXTENSION, removeVerificationFiles(), resolveVerificationFile() (+1 more)

### Community 74 - "lucide-react"
Cohesion: 0.07
Nodes (52): lucide-react, AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN (+44 more)

### Community 76 - "middleware.ts"
Cohesion: 0.32
Nodes (7): AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES, ProtectedArea, redirectTo()

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.17
Nodes (23): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, groupCode(), PurchaseRequestsManagerProps, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS, ADMIN_PURCHASE_REQUEST_SORT_LABELS (+15 more)

### Community 78 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 79 - "purchase-request-actions.ts"
Cohesion: 0.12
Nodes (21): clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), handleSubmit(), listProvinceOptions(), createPurchaseRequest() (+13 more)

### Community 80 - "VerificationManager.tsx"
Cohesion: 0.20
Nodes (14): DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), PERSON_TYPE_ICONS (+6 more)

### Community 81 - "normalizeDigits"
Cohesion: 0.08
Nodes (34): normalizeYear(), PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizeDigits(), normalizePhone(), buyAdSchema (+26 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.17
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), dateFormatter (+6 more)

### Community 83 - "lib/admins.ts"
Cohesion: 0.23
Nodes (11): AdminAdminsPage(), dynamic, metadata, ADMIN_ORDER_BY, adminRecordSelect, adminRoleInclude, AdminRoleRow, adminRoleToRecord() (+3 more)

### Community 84 - "next"
Cohesion: 0.10
Nodes (34): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+26 more)

### Community 85 - "PriceTableManager.tsx"
Cohesion: 0.21
Nodes (9): PriceTableCarsTable(), PriceTableCarsTableProps, Filter, FILTERS, PriceTableManagerProps, Badge(), BadgeProps, BadgeTone (+1 more)

### Community 86 - "AdKindTabs.tsx"
Cohesion: 0.24
Nodes (10): framer-motion, dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS (+2 more)

### Community 87 - "ConfirmDialog"
Cohesion: 0.12
Nodes (34): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+26 more)

### Community 88 - "validation/admins.ts"
Cohesion: 0.29
Nodes (6): AdminFormInput, emailSchema, idSchema, nameSchema, roleSchema, text()

### Community 91 - "[audience]/[id]/page.tsx"
Cohesion: 0.28
Nodes (8): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, getAdminPurchaseRequestDetail(), snapshotLines(), toPerson(), toRecord()

### Community 92 - "SaleAdFormModal.tsx"
Cohesion: 0.06
Nodes (52): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTableProps (+44 more)

### Community 93 - "zod"
Cohesion: 0.12
Nodes (13): zod, colorCoreSchema, ColorFormValues, ParsedColorForm, optionCoreSchema, OptionFormValues, optionItemSchema, ParsedOptionForm (+5 more)

### Community 94 - "ThemeSwitch.tsx"
Cohesion: 0.27
Nodes (11): PanelSectionLayout(), viewport, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE, PANEL_THEME_MAX_AGE (+3 more)

### Community 95 - "AdminShell.tsx"
Cohesion: 0.10
Nodes (26): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup (+18 more)

### Community 97 - "lib/system-settings.ts"
Cohesion: 0.25
Nodes (11): saveSystemSettingsAction(), SystemSettingsActionResult, PanelAppLayout(), getSystemSettings, parseActiveProvinceIds(), parseEnabledPriceFields(), parseRotationMinutes(), saveSystemSettings() (+3 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.24
Nodes (6): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES, purchaseRequestSourceLabel()

### Community 103 - "AdminVerificationForm"
Cohesion: 0.28
Nodes (8): AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName(), newDoc()

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.08
Nodes (46): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesPage(), dynamic (+38 more)

### Community 107 - "utils.ts"
Cohesion: 0.14
Nodes (20): dynamic, generateMetadata(), PageProps, SellerProfilePage(), generateMetadata(), hrefFor(), pageWindow(), SearchPagination() (+12 more)

### Community 110 - "[...path]/route.ts"
Cohesion: 0.27
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 114 - "Toast"
Cohesion: 0.26
Nodes (11): CarsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast(), ModalState, CarsTable() (+3 more)

### Community 115 - "CarMediaSlider.tsx"
Cohesion: 0.36
Nodes (5): CarMediaSlider(), CarMediaSliderProps, MediaViewer(), slideOffset(), CarMediaItem

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 732 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `toPersianDigits`, `roles/actions.ts`, `AdminVerificationForm.tsx`, `contact/page.tsx`, `colors/actions.ts`, `adminActionDenied`, `react`, `PurchaseRequestDetailManager.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `admin/auth-actions.ts`, `BuyAdOffersPanel.tsx`, `MyAdForm.tsx`, `currency.ts`, `[code]/price-list/page.tsx`, `lib/cars.ts`, `Modal`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `Toggle`, `sale-ads/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `purchase-requests/actions.ts`, `AdminsManager.tsx`, `SystemSettingsForm`, `BranchesManager.tsx`, `RichTextEditor.tsx`, `market-rates.ts`, `UserAuthCard.tsx`, `permissions.ts`, `BranchesMap.tsx`, `lucide-react`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `VerificationManager.tsx`, `search/page.tsx`, `next`, `PriceTableManager.tsx`, `AdKindTabs.tsx`, `ConfirmDialog`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `AdminShell.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `CarImagesManager.tsx`, `utils.ts`, `Toast`, `CarMediaSlider.tsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07686116700201208 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `roles/actions.ts`, `AdminVerificationForm.tsx`, `cn`, `colors/actions.ts`, `panel-search.ts`, `react`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `MyAdForm.tsx`, `currency.ts`, `[code]/price-list/page.tsx`, `getCurrentUser`, `lib/cars.ts`, `Modal`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `buy-ads-shared.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `Toggle`, `sale-ads/actions.ts`, `BranchFormModal.tsx`, `purchase-requests/actions.ts`, `AdminsManager.tsx`, `verification-submission.ts`, `SystemSettingsForm`, `BranchesManager.tsx`, `market-rates.ts`, `UserAuthCard.tsx`, `verification-actions.ts`, `permissions.ts`, `lucide-react`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager.tsx`, `normalizeDigits`, `search/page.tsx`, `next`, `PriceTableManager.tsx`, `AdKindTabs.tsx`, `ConfirmDialog`, `SaleAdFormModal.tsx`, `AdminShell.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `CarImagesManager.tsx`, `utils.ts`, `Toast`, `CarMediaSlider.tsx`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07450980392156863 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `toPersianDigits`, `prisma.ts`, `roles/actions.ts`, `contact/page.tsx`, `cn`, `colors/actions.ts`, `adminActionDenied`, `react`, `isTrustedOrigin`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `admins/actions.ts`, `MyAdForm.tsx`, `[code]/price-list/page.tsx`, `getCurrentUser`, `lib/cars.ts`, `Modal`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `session.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `Toggle`, `lib/purchase-requests.ts`, `package.json`, `sale-ads/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `branches/actions.ts`, `purchase-requests/actions.ts`, `AdminsManager.tsx`, `user-codes.ts`, `market-rates.ts`, `UserAuthCard.tsx`, `verification-actions.ts`, `permissions.ts`, `lucide-react`, `middleware.ts`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `purchase-request-actions.ts`, `VerificationManager.tsx`, `search/page.tsx`, `lib/admins.ts`, `AdKindTabs.tsx`, `ConfirmDialog`, `[audience]/[id]/page.tsx`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `AdminShell.tsx`, `lib/system-settings.ts`, `requests/page.tsx`, `CarImagesManager.tsx`, `utils.ts`, `[...path]/route.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._