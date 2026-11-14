# Graph Report - khodroyab  (2026-11-15)

## Corpus Check
- 344 files · ~181,384 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2295 nodes · 7669 edges · 97 communities (89 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd4a197a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Toast
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- requireAdminAccess
- ads/page.tsx
- users/actions.ts
- isTrustedOrigin
- VerificationManager.tsx
- Admin authentication flow
- (app)/about/page.tsx
- AdDetailView.tsx
- lib/colors.ts
- SaleAdsManager.tsx
- panel-search.ts
- car-form/actions.ts
- next
- panel/auth-actions.ts
- currency.ts
- lib/price-table.ts
- validation/system-settings.ts
- MyPriceTableManager
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- roles/actions.ts
- SaleAdFormModal.tsx
- price-table-shared.ts
- admin.ts
- MyAdForm.tsx
- sale-ads/page.tsx
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- lib/admins.ts
- ContactView.tsx
- permissions.ts
- CarsManager.tsx
- cn
- SearchFilters.tsx
- SponsorsManager.tsx
- sale-ads/actions.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- (app)/search/page.tsx
- verification-submission.ts
- BuyAdDetailView.tsx
- dependencies
- scripts
- brands/actions.ts
- toPersianDigits
- BuyAdForm.tsx
- normalizeDigits
- SystemSettingsForm.tsx
- prisma.ts
- buy-ads-shared.ts
- user-car-extras.ts
- devDependencies
- CurrencyRates.tsx
- panel/page.tsx
- AdminsManager.tsx
- sponsors/actions.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- @prisma/client
- UPLOAD_DIR env
- BranchesMap.tsx
- getCurrentUser
- AdminShell.tsx
- middleware.ts
- VerificationManager
- MyPriceTableManager.tsx
- validation/admins.ts
- profile/actions.ts
- user.ts
- market-rates.ts
- validation/car-types.ts
- user-auth.ts
- ProfileEditForm.tsx
- price-list/page.tsx
- SponsorsManager
- AdminVerificationForm
- SystemSettingsForm
- tailwindcss
- AdExtraFields.tsx
- CarsManager
- ComingSoon.tsx
- admins/actions.ts
- uploads.ts
- images/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 274 edges
2. `toPersianDigits()` - 227 edges
3. `react` - 197 edges
4. `next` - 145 edges
5. `lucide-react` - 140 edges
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
- `AdminAdminsPage()` --indirect_call--> `adminRoleToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAdminsPage()` --indirect_call--> `adminToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAllAdsPage()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/cars.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (97 total, 8 thin omitted)

### Community 0 - "Toast"
Cohesion: 0.07
Nodes (67): react-dom, cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews() (+59 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.14
Nodes (20): ProfileEditFormProps, ActionTile(), CompletionRing(), formatJalali(), formatMobile(), getInitials(), InfoGroup(), InfoRow() (+12 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.17
Nodes (22): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), UserPriceTablePreviewProps, ContactChip() (+14 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.14
Nodes (28): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), AdminCarTypesPage() (+20 more)

### Community 4 - "requireAdminAccess"
Cohesion: 0.05
Nodes (71): AdminPendingAdsPage(), dynamic, metadata, AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt() (+63 more)

### Community 5 - "ads/page.tsx"
Cohesion: 0.16
Nodes (17): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdsManager() (+9 more)

### Community 6 - "users/actions.ts"
Cohesion: 0.16
Nodes (26): createUserAction(), deleteUserAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction(), inputClassName() (+18 more)

### Community 7 - "isTrustedOrigin"
Cohesion: 0.15
Nodes (18): server-only, findUsersByCodeAction(), parseBigInt(), saveUserPriceTableAction(), AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult (+10 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.12
Nodes (29): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationStatusBadgeProps, DocDraft, IdentityDraft (+21 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "AdDetailView.tsx"
Cohesion: 0.14
Nodes (22): AdDetailPage(), dynamic, metadata, CurrencyTag(), AdDetailView(), AdDetailViewProps, PriceEquivalent(), SectionTitle() (+14 more)

### Community 12 - "lib/colors.ts"
Cohesion: 0.11
Nodes (33): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+25 more)

### Community 13 - "SaleAdsManager.tsx"
Cohesion: 0.40
Nodes (4): ToastProps, ToastState, Filter, SaleAdsManagerProps

### Community 14 - "panel-search.ts"
Cohesion: 0.13
Nodes (26): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+18 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.10
Nodes (38): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+30 more)

### Community 16 - "next"
Cohesion: 0.07
Nodes (48): lucide-react, next, AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps (+40 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.17
Nodes (20): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+12 more)

### Community 18 - "currency.ts"
Cohesion: 0.12
Nodes (29): dynamic, PageProps, PriceListCarPage(), CurrencyToggleProps, CarOffersView(), compareDigits(), sortOffers(), sortValue() (+21 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.12
Nodes (23): AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt(), saveMyPriceTableAction(), dynamic (+15 more)

### Community 20 - "validation/system-settings.ts"
Cohesion: 0.24
Nodes (12): LocationPicker(), applyCoordsText(), formatGeoPoint(), parseGeoPoint(), asciiDigits(), asUrl(), hostIs(), normalizeHandleLink() (+4 more)

### Community 21 - "MyPriceTableManager"
Cohesion: 0.24
Nodes (16): emptyDraft(), emptyTier(), MyPriceTableManager(), addColor(), addYear(), appendTier(), clearRow(), handleSave() (+8 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.10
Nodes (32): BuyAdDetailPage(), dynamic, metadata, BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters() (+24 more)

### Community 23 - "session.ts"
Cohesion: 0.23
Nodes (15): jose, getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience (+7 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.19
Nodes (22): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure(), parseBigInt() (+14 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.14
Nodes (23): BuyAdOffersResult, BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), BuyAdOffersPanelProps, cleanDigits() (+15 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.16
Nodes (23): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+15 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (30): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsTableProps, AdStatusBadgeProps (+22 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.10
Nodes (28): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), isValidTierYear(), normalizeUsdPrice(), normalizeYear(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY (+20 more)

### Community 30 - "admin.ts"
Cohesion: 0.22
Nodes (12): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), clearSessionCookie(), AdminLoginInput (+4 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.08
Nodes (23): dynamic, EditAdPage(), metadata, AdImagesField(), useAdExtras(), addFiles(), FieldError(), inputClassName() (+15 more)

### Community 32 - "sale-ads/page.tsx"
Cohesion: 0.15
Nodes (21): dynamic, metadata, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction() (+13 more)

### Community 33 - "price-list.ts"
Cohesion: 0.13
Nodes (29): generateMetadata(), CarOffersViewProps, PriceListBrowserProps, CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail() (+21 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.16
Nodes (23): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+15 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.10
Nodes (29): PanelSectionLayout(), viewport, findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem, panelNavItemsFor(), PanelDrawer() (+21 more)

### Community 36 - "lib/admins.ts"
Cohesion: 0.31
Nodes (7): dynamic, metadata, ADMIN_ORDER_BY, adminRecordSelect, adminRoleInclude, AdminRoleRow, AdminRow

### Community 37 - "ContactView.tsx"
Cohesion: 0.16
Nodes (18): metadata, PanelContactPage(), base, IconProps, InstagramIcon(), TelegramIcon(), WhatsappIcon(), buildChannels() (+10 more)

### Community 38 - "permissions.ts"
Cohesion: 0.17
Nodes (18): AdminShellUser, AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PERMISSION_ICONS, PermissionChipsProps (+10 more)

### Community 39 - "CarsManager.tsx"
Cohesion: 0.15
Nodes (23): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT, updateCarAction() (+15 more)

### Community 40 - "cn"
Cohesion: 0.10
Nodes (28): BuyAdDetailManager(), Confirm, RankMedal(), Spec(), Stat(), StatePill(), PersonAvatar(), PersonCell() (+20 more)

### Community 41 - "SearchFilters.tsx"
Cohesion: 0.15
Nodes (18): DEFAULTS, SearchFiltersProps, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange() (+10 more)

### Community 42 - "SponsorsManager.tsx"
Cohesion: 0.16
Nodes (15): AdminSponsorsPage(), dynamic, metadata, inputClassName(), SponsorFormModal(), clearError(), handleFileChange(), SponsorFormModalProps (+7 more)

### Community 43 - "sale-ads/actions.ts"
Cohesion: 0.10
Nodes (49): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+41 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (15): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+7 more)

### Community 48 - "(app)/search/page.tsx"
Cohesion: 0.18
Nodes (14): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+6 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.15
Nodes (9): SubmitVerificationResult, isValidCompanyNationalId(), saveVerificationFile(), isVerificationPersonType(), parseVerificationForm(), ParseVerificationResult, readIdentity(), StoreVerificationResult (+1 more)

### Community 50 - "BuyAdDetailView.tsx"
Cohesion: 0.12
Nodes (29): ColorSwatch(), ColorSwatchProps, AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps (+21 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "brands/actions.ts"
Cohesion: 0.13
Nodes (28): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+20 more)

### Community 54 - "toPersianDigits"
Cohesion: 0.13
Nodes (31): react, AdsTable(), AdStatusBadge(), STYLES, BranchesTable(), BrandsTable(), BuyAdsTable(), OptionsTable() (+23 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.22
Nodes (13): CurrencyToggle(), AdCarChoice, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass() (+5 more)

### Community 56 - "normalizeDigits"
Cohesion: 0.07
Nodes (58): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+50 more)

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.12
Nodes (24): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, PanelAppLayout(), ContactField, ContactValues (+16 more)

### Community 58 - "prisma.ts"
Cohesion: 0.10
Nodes (23): dynamic, metadata, PageProps, AdminUserProfilePage(), dynamic, metadata, PageProps, AdminUsersPage() (+15 more)

### Community 59 - "buy-ads-shared.ts"
Cohesion: 0.10
Nodes (26): BuyAdCardProps, BuyAdDetailViewProps, BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, MyBuyAdCardProps, FILTERS, MyBuyAdsManager() (+18 more)

### Community 60 - "user-car-extras.ts"
Cohesion: 0.08
Nodes (31): zod, AdImageDraft, AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow (+23 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.16
Nodes (16): dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps (+8 more)

### Community 63 - "panel/page.tsx"
Cohesion: 0.12
Nodes (20): metadata, PageProps, PanelLoginPage(), SponsorsMarquee(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown() (+12 more)

### Community 64 - "AdminsManager.tsx"
Cohesion: 0.18
Nodes (18): AdminAdminsPage(), AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManager(), handleDelete(), handleToggleActive() (+10 more)

### Community 65 - "sponsors/actions.ts"
Cohesion: 0.28
Nodes (17): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+9 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "@prisma/client"
Cohesion: 0.20
Nodes (10): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+2 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.21
Nodes (20): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+12 more)

### Community 73 - "getCurrentUser"
Cohesion: 0.15
Nodes (16): framer-motion, dynamic, GET(), dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind (+8 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.10
Nodes (26): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo (+18 more)

### Community 76 - "middleware.ts"
Cohesion: 0.16
Nodes (15): authenticateAdmin(), ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+7 more)

### Community 77 - "VerificationManager"
Cohesion: 0.18
Nodes (14): submitVerificationAction(), dynamic, metadata, PanelVerificationPage(), FieldError(), identityDraftFrom(), inputClassName(), newDoc() (+6 more)

### Community 78 - "MyPriceTableManager.tsx"
Cohesion: 0.13
Nodes (17): borderFor(), Draft, Drafts, duplicateTierKeys(), ErrorText(), FILTERS, inputBase, isFilled() (+9 more)

### Community 79 - "validation/admins.ts"
Cohesion: 0.22
Nodes (8): AdminFormInput, emailSchema, idSchema, nameSchema, roleSchema, text(), userPasswordSchema, userPhoneSchema

### Community 80 - "profile/actions.ts"
Cohesion: 0.19
Nodes (15): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+7 more)

### Community 81 - "user.ts"
Cohesion: 0.13
Nodes (13): PASSWORD_MIN_LENGTH, isValidNationalCode(), optionalDigits(), ProfileUpdateInput, profileUpdateSchema, COMPANY_NAME_MAX_LENGTH, companyNameSchema, IRANIAN_MOBILE_REGEX (+5 more)

### Community 82 - "market-rates.ts"
Cohesion: 0.23
Nodes (11): dynamic, GET(), fetchFromSource(), getMarketRates(), Item, itemSchema, nullableNumber, payloadSchema (+3 more)

### Community 83 - "validation/car-types.ts"
Cohesion: 0.21
Nodes (11): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+3 more)

### Community 84 - "user-auth.ts"
Cohesion: 0.11
Nodes (30): dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic, metadata (+22 more)

### Community 85 - "ProfileEditForm.tsx"
Cohesion: 0.32
Nodes (8): FieldError(), FormAlert(), inputClassName(), labelClassName, SubmitBar(), SubmitBarProps, getInitials(), ProfileEditForm()

### Community 86 - "price-list/page.tsx"
Cohesion: 0.24
Nodes (10): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+2 more)

### Community 87 - "SponsorsManager"
Cohesion: 0.50
Nodes (8): byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved(), handleToggleActive(), showToast(), upsertRecord()

### Community 88 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 89 - "SystemSettingsForm"
Cohesion: 0.33
Nodes (9): ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError(), handleSubmit(), setContactField() (+1 more)

### Community 91 - "AdExtraFields.tsx"
Cohesion: 0.36
Nodes (8): AdExtraFieldsProps, AdFieldTheme, AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES, AdExtrasState

### Community 92 - "CarsManager"
Cohesion: 0.48
Nodes (7): AdminCarsPage(), CarsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 95 - "admins/actions.ts"
Cohesion: 0.27
Nodes (18): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+10 more)

### Community 102 - "uploads.ts"
Cohesion: 0.12
Nodes (23): dynamic, GET(), notFound(), RouteContext, runtime, buildHeaders(), dynamic, GET() (+15 more)

### Community 106 - "images/actions.ts"
Cohesion: 0.27
Nodes (13): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), CarImagesManager(), handleConfirmDelete() (+5 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **28 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 641 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Toast`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `requireAdminAccess`, `ads/page.tsx`, `users/actions.ts`, `isTrustedOrigin`, `VerificationManager.tsx`, `(app)/about/page.tsx`, `AdDetailView.tsx`, `lib/colors.ts`, `SaleAdsManager.tsx`, `car-form/actions.ts`, `panel/auth-actions.ts`, `currency.ts`, `lib/price-table.ts`, `lib/buy-ads.ts`, `session.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `admin.ts`, `MyAdForm.tsx`, `sale-ads/page.tsx`, `sale-terms/actions.ts`, `PanelShell.tsx`, `lib/admins.ts`, `ContactView.tsx`, `permissions.ts`, `CarsManager.tsx`, `cn`, `SearchFilters.tsx`, `SponsorsManager.tsx`, `sale-ads/actions.ts`, `package.json`, `(app)/search/page.tsx`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `toPersianDigits`, `BuyAdForm.tsx`, `normalizeDigits`, `SystemSettingsForm.tsx`, `prisma.ts`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `panel/page.tsx`, `AdminsManager.tsx`, `sponsors/actions.ts`, `getCurrentUser`, `AdminShell.tsx`, `middleware.ts`, `VerificationManager`, `profile/actions.ts`, `market-rates.ts`, `user-auth.ts`, `price-list/page.tsx`, `admins/actions.ts`, `uploads.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Toast` be split into smaller, more focused modules?**
  _Cohesion score 0.0669753086419753 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `Toast`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `requireAdminAccess`, `ads/page.tsx`, `users/actions.ts`, `isTrustedOrigin`, `VerificationManager.tsx`, `AdDetailView.tsx`, `lib/colors.ts`, `SaleAdsManager.tsx`, `car-form/actions.ts`, `next`, `panel/auth-actions.ts`, `currency.ts`, `MyPriceTableManager`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `MyAdForm.tsx`, `sale-ads/page.tsx`, `sale-terms/actions.ts`, `ContactView.tsx`, `permissions.ts`, `CarsManager.tsx`, `cn`, `SearchFilters.tsx`, `SponsorsManager.tsx`, `sale-ads/actions.ts`, `(app)/search/page.tsx`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `BuyAdForm.tsx`, `normalizeDigits`, `SystemSettingsForm.tsx`, `buy-ads-shared.ts`, `user-car-extras.ts`, `CurrencyRates.tsx`, `panel/page.tsx`, `AdminsManager.tsx`, `getCurrentUser`, `VerificationManager`, `MyPriceTableManager.tsx`, `user-auth.ts`, `ProfileEditForm.tsx`, `price-list/page.tsx`, `SponsorsManager`, `AdminVerificationForm`, `SystemSettingsForm`, `AdExtraFields.tsx`, `CarsManager`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Toast`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `requireAdminAccess`, `ads/page.tsx`, `users/actions.ts`, `isTrustedOrigin`, `VerificationManager.tsx`, `AdDetailView.tsx`, `lib/colors.ts`, `SaleAdsManager.tsx`, `car-form/actions.ts`, `next`, `currency.ts`, `validation/system-settings.ts`, `MyPriceTableManager`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `SaleAdFormModal.tsx`, `admin.ts`, `MyAdForm.tsx`, `sale-ads/page.tsx`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `permissions.ts`, `CarsManager.tsx`, `SearchFilters.tsx`, `SponsorsManager.tsx`, `(app)/search/page.tsx`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `toPersianDigits`, `BuyAdForm.tsx`, `normalizeDigits`, `SystemSettingsForm.tsx`, `buy-ads-shared.ts`, `CurrencyRates.tsx`, `panel/page.tsx`, `AdminsManager.tsx`, `BranchesMap.tsx`, `getCurrentUser`, `AdminShell.tsx`, `VerificationManager`, `MyPriceTableManager.tsx`, `user-auth.ts`, `ProfileEditForm.tsx`, `price-list/page.tsx`, `AdminVerificationForm`, `SystemSettingsForm`, `AdExtraFields.tsx`, `images/actions.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._