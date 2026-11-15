# Graph Report - khodroyab  (2026-11-15)

## Corpus Check
- 368 files · ~205,253 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2567 nodes · 8575 edges · 125 communities (118 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a1628e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- admin-buy-ads.ts
- BuyAdsFilters.tsx
- prisma.ts
- isTrustedOrigin
- VerificationManager.tsx
- Admin authentication flow
- (app)/about/page.tsx
- cn
- colors/actions.ts
- react
- panel-search.ts
- car-form/actions.ts
- formatPersianNumber
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- session.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- roles/actions.ts
- MyAdForm.tsx
- price-table-shared.ts
- admin/auth-actions.ts
- MyAdForm
- (panel)/price-table/actions.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- guards.ts
- ContactView.tsx
- permissions.ts
- SaleAdFormModal.tsx
- CarOffersView.tsx
- normalizeDigits
- sponsors/actions.ts
- lib/purchase-requests.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- verification-submission.ts
- BuyAdDetailView.tsx
- dependencies
- scripts
- brands/actions.ts
- toPersianDigits
- BuyAdForm.tsx
- BranchFormModal.tsx
- SystemSettingsForm.tsx
- user-codes.ts
- panel-search-shared.ts
- RichTextEditor.tsx
- devDependencies
- CurrencyRates.tsx
- panel/page.tsx
- lib/admins.ts
- BuyAdsManager
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- user-auth.ts
- AdminShell.tsx
- middleware.ts
- purchase-requests-shared.ts
- PurchaseRequestButton.tsx
- validation/purchase-requests.ts
- VerificationManager
- admin.ts
- search/page.tsx
- branches/actions.ts
- next
- SearchableSelect
- market-rates.ts
- BuyAdDetailManager.tsx
- users/actions.ts
- ThemeSwitch.tsx
- tailwindcss
- cars/actions.ts
- ads/page.tsx
- validation/brands.ts
- uploads.ts
- admins/actions.ts
- [audience]/page.tsx
- search/buy/page.tsx
- lib/branches.ts
- SponsorsMarquee.tsx
- [id]/route.ts
- requests/page.tsx
- [...path]/route.ts
- BrandsManager
- SponsorsManager
- PurchaseRequestsManager.tsx
- CarImagesManager.tsx
- validation/car-types.ts
- buy-ads-shared.ts
- AdCard.tsx
- cars/page.tsx
- validation/branches.ts
- rich-text.ts
- getSystemSettings
- lib/cars.ts
- validation/profile.ts
- images/page.tsx
- PriceCurrency
- CarMediaSlider.tsx
- validation/sponsors.ts
- zod
- CarTypesManager
- CarsManager
- ColorsManager
- SponsorFormModal

## God Nodes (most connected - your core abstractions)
1. `cn()` - 310 edges
2. `toPersianDigits()` - 255 edges
3. `react` - 209 edges
4. `next` - 157 edges
5. `lucide-react` - 150 edges
6. `formatPersianNumber()` - 81 edges
7. `prisma` - 69 edges
8. `isTrustedOrigin()` - 63 edges
9. `requireAdminAccess()` - 53 edges
10. `Toast()` - 52 edges

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

## Communities (125 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (59): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+51 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (42): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+34 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.13
Nodes (30): revalidateVerificationPages(), reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview() (+22 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.20
Nodes (17): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+9 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.12
Nodes (26): AdminBuyAdsPage(), dynamic, metadata, PageProps, ADMIN_BUY_AD_PAGE_SIZE, adminBuyAdDetailInclude, adminBuyAdInclude, AdminBuyAdRow (+18 more)

### Community 5 - "BuyAdsFilters.tsx"
Cohesion: 0.17
Nodes (18): BuyAdsFilters(), BuyAdsFiltersProps, Segmented(), BuyAdsManagerProps, BuyAdsTableProps, AdminBuyAdListResult, ADMIN_BUY_AD_FILTER_DEFAULTS, ADMIN_BUY_AD_PARAM_KEYS (+10 more)

### Community 6 - "prisma.ts"
Cohesion: 0.14
Nodes (16): @prisma/client, server-only, AdminUserProfilePage(), dynamic, metadata, PageProps, dynamic, metadata (+8 more)

### Community 7 - "isTrustedOrigin"
Cohesion: 0.30
Nodes (10): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), findUsersByCodeAction(), authorizeAdminAction(), isTrustedOrigin(), savePurchaseRequestNote() (+2 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.10
Nodes (33): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), AdminVerificationFormProps, DocDraft (+25 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 11 - "cn"
Cohesion: 0.15
Nodes (23): CurrencyTag(), AdDetailView(), AdDetailViewProps, PriceEquivalent(), SectionTitle(), Spec(), AdPriceHistory(), percent() (+15 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.25
Nodes (14): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+6 more)

### Community 13 - "react"
Cohesion: 0.10
Nodes (27): lucide-react, react, faDate, ModalState, ModalState, ModalState, ModalState, RolesManager() (+19 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.12
Nodes (25): BuyAdDetailPage(), dynamic, metadata, requireUser(), adDetailInclude, AdViewer, buildOrderBy(), buildWhere() (+17 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.12
Nodes (26): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+18 more)

### Community 16 - "formatPersianNumber"
Cohesion: 0.09
Nodes (45): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep() (+37 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.13
Nodes (25): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, clientIp() (+17 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.16
Nodes (19): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, CardTitle(), CodeChip(), groupCode(), PersonFlags() (+11 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.09
Nodes (38): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+30 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.16
Nodes (21): parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH, MAX_AD_PAGE_NOTICE_LENGTH, MAX_CONTACT_ADDRESS_LENGTH, MAX_USER_CODE_ROTATION_MINUTES (+13 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.11
Nodes (30): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+22 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.16
Nodes (19): buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE, buyAdDetailInclude, BuyAdRow, buyerCodesFor(), faDate, faDateTime (+11 more)

### Community 23 - "session.ts"
Cohesion: 0.18
Nodes (18): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches() (+10 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.16
Nodes (26): BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure(), parseBigInt() (+18 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.11
Nodes (27): BuyAdOffersResult, BuyAdDetailViewProps, BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw() (+19 more)

### Community 27 - "roles/actions.ts"
Cohesion: 0.13
Nodes (25): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+17 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.10
Nodes (32): AdsFilterValues, AdsUserOption, AdsManagerProps, AdsTableProps, ColorsManagerProps, ColorsTable(), ColorsTableProps, OptionsManagerProps (+24 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.12
Nodes (22): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), mergePriceColumns(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS (+14 more)

### Community 30 - "admin/auth-actions.ts"
Cohesion: 0.23
Nodes (12): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), authenticateAdmin(), consumeTiming() (+4 more)

### Community 31 - "MyAdForm"
Cohesion: 0.29
Nodes (5): FieldError(), inputClassName(), MyAdForm(), addRow(), nextKey()

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.20
Nodes (17): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+9 more)

### Community 33 - "price-list.ts"
Cohesion: 0.11
Nodes (29): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+21 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.19
Nodes (18): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+10 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.10
Nodes (25): ConsultationFab(), ConsultationFabProps, DollarTicker(), findActivePanelItem(), GUEST_NAV_KEYS, GUEST_SHORT_LABELS, PANEL_GUEST_NAV_ITEMS, PANEL_NAV_ITEMS (+17 more)

### Community 36 - "guards.ts"
Cohesion: 0.12
Nodes (21): AdminPendingAdsPage(), dynamic, metadata, AdminColorsPage(), dynamic, metadata, AdminForbiddenPage(), dynamic (+13 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (26): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+18 more)

### Community 38 - "permissions.ts"
Cohesion: 0.20
Nodes (16): AdminShellUser, AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PERMISSION_ICONS, PermissionChipsProps (+8 more)

### Community 39 - "SaleAdFormModal.tsx"
Cohesion: 0.10
Nodes (18): react-dom, AdminFormModal(), FieldError(), inputClassName(), PermissionChips(), Modal(), ModalProps, SIZE_CLASSES (+10 more)

### Community 40 - "CarOffersView.tsx"
Cohesion: 0.10
Nodes (39): dynamic, generateMetadata(), PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), PriceOrder (+31 more)

### Community 41 - "normalizeDigits"
Cohesion: 0.16
Nodes (18): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, isValidTierYear(), normalizeYear(), normalizeDigits(), BuyAdInput, buyAdSchema (+10 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.29
Nodes (16): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+8 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.11
Nodes (33): AdminPurchaseRequestsPage(), div(), jalaliToGregorian(), parseJalaliDate(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, audienceWhere(), buildOrderBy(), buildWhere() (+25 more)

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
Nodes (70): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+62 more)

### Community 49 - "verification-submission.ts"
Cohesion: 0.10
Nodes (18): AdminSubmitVerificationResult, ReviewVerificationResult, SubmitVerificationResult, ALLOWED_IMAGE_MIME_TYPES, faDateTime, saveVerificationFile(), isVerificationPersonType(), VERIFICATION_REJECT_REASON_MAX (+10 more)

### Community 50 - "BuyAdDetailView.tsx"
Cohesion: 0.21
Nodes (20): ColorSwatch(), ColorSwatchProps, AdGallery(), NoImage(), MyAdCard(), MyAdCardProps, NoImage(), STATUS_HINT (+12 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "brands/actions.ts"
Cohesion: 0.18
Nodes (17): BrandActionResult, BrandSimpleActionResult, createBrandAction(), guardRequest(), updateBrandAction(), BrandFormModal(), handleSubmit(), BrandFormModalProps (+9 more)

### Community 54 - "toPersianDigits"
Cohesion: 0.14
Nodes (26): Stat(), AdsTable(), AdStatusBadge(), BrandsTable(), BuyAdsTable(), OptionsTable(), typeLabel(), PriceTableCarsTable() (+18 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.18
Nodes (15): CurrencyToggle(), BuyAdCardProps, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass() (+7 more)

### Community 56 - "BranchFormModal.tsx"
Cohesion: 0.24
Nodes (12): BranchesManagerProps, ModalState, BranchesTable(), BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel() (+4 more)

### Community 57 - "SystemSettingsForm.tsx"
Cohesion: 0.16
Nodes (19): saveSystemSettingsAction(), SystemSettingsActionResult, ContactField, ContactInput(), ContactValues, inputClassName(), pickContact(), SettingCard() (+11 more)

### Community 58 - "user-codes.ts"
Cohesion: 0.39
Nodes (6): ActiveUserCode, createCodes(), findActiveCodes(), getActiveUserCodes(), isUniqueViolation(), randomCode()

### Community 59 - "panel-search-shared.ts"
Cohesion: 0.11
Nodes (25): PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll() (+17 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "CurrencyRates.tsx"
Cohesion: 0.19
Nodes (14): ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps, Flash, formatJalali(), formatRial() (+6 more)

### Community 63 - "panel/page.tsx"
Cohesion: 0.13
Nodes (18): metadata, PageProps, PanelLoginPage(), fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step (+10 more)

### Community 64 - "lib/admins.ts"
Cohesion: 0.13
Nodes (17): AdminAdminsPage(), dynamic, metadata, AdminRolesPage(), dynamic, metadata, AdminFormModalProps, AdminsManagerProps (+9 more)

### Community 65 - "BuyAdsManager"
Cohesion: 0.23
Nodes (17): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+9 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.18
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "user-auth.ts"
Cohesion: 0.11
Nodes (23): framer-motion, dynamic, GET(), MyAdsTabsLayout(), dynamic, metadata, PanelDashboardPage(), dynamic (+15 more)

### Community 74 - "AdminShell.tsx"
Cohesion: 0.12
Nodes (22): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup, AdminNavItem (+14 more)

### Community 76 - "middleware.ts"
Cohesion: 0.28
Nodes (8): isPublicPanelPath(), AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES, ProtectedArea, redirectTo()

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.12
Nodes (22): Chip(), jalaliDay, PERIODS, PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented(), ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS (+14 more)

### Community 78 - "PurchaseRequestButton.tsx"
Cohesion: 0.31
Nodes (8): loadPurchaseRequestLocationsAction(), PriceTag(), fieldClass(), FieldError(), groupCode(), Label(), PurchaseRequestDialog(), SuccessState()

### Community 79 - "validation/purchase-requests.ts"
Cohesion: 0.17
Nodes (12): PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX, PURCHASE_REQUEST_NOTE_MAX, adminNoteSchema, descriptionSchema, field(), guestSchema, ParsedPurchaseRequestForm (+4 more)

### Community 80 - "VerificationManager"
Cohesion: 0.18
Nodes (14): submitVerificationAction(), dynamic, metadata, PanelVerificationPage(), FieldError(), identityDraftFrom(), inputClassName(), newDoc() (+6 more)

### Community 81 - "admin.ts"
Cohesion: 0.16
Nodes (13): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), COMPANY_NAME_MAX_LENGTH, companyNameSchema, IRANIAN_MOBILE_REGEX (+5 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.23
Nodes (11): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+3 more)

### Community 83 - "branches/actions.ts"
Cohesion: 0.19
Nodes (25): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+17 more)

### Community 84 - "next"
Cohesion: 0.10
Nodes (36): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+28 more)

### Community 85 - "SearchableSelect"
Cohesion: 0.11
Nodes (20): AdsFilters(), AdsFiltersProps, PARAM_KEYS, AdStatusBadgeProps, STYLES, SEGMENTS, StatusBreakdownProps, normalize() (+12 more)

### Community 86 - "market-rates.ts"
Cohesion: 0.17
Nodes (15): dynamic, GET(), AdDetailPage(), dynamic, metadata, fetchFromSource(), getConversionRates(), getMarketRates() (+7 more)

### Community 87 - "BuyAdDetailManager.tsx"
Cohesion: 0.19
Nodes (16): AdminBuyAdDetailPage(), dynamic, metadata, PageProps, BuyAdDetailManager(), handleConfirm(), setBidding(), showToast() (+8 more)

### Community 88 - "users/actions.ts"
Cohesion: 0.14
Nodes (25): createUserAction(), deleteUserAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction(), AdminUsersPage() (+17 more)

### Community 89 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelAppLayout(), PanelSectionLayout(), viewport, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 91 - "cars/actions.ts"
Cohesion: 0.28
Nodes (14): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+6 more)

### Community 92 - "ads/page.tsx"
Cohesion: 0.14
Nodes (18): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+10 more)

### Community 93 - "validation/brands.ts"
Cohesion: 0.25
Nodes (7): brandCoreSchema, BrandFormValues, fallbackSlug(), ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug()

### Community 94 - "uploads.ts"
Cohesion: 0.21
Nodes (14): dynamic, fail(), POST(), RouteContext, runtime, sanitizeBaseName(), saveVideoStream(), sniffVideoContainer() (+6 more)

### Community 95 - "admins/actions.ts"
Cohesion: 0.21
Nodes (22): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+14 more)

### Community 96 - "[audience]/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, generateMetadata(), PageProps, toAudience(), PURCHASE_REQUEST_AUDIENCE_LABELS

### Community 97 - "search/buy/page.tsx"
Cohesion: 0.20
Nodes (14): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), hrefFor(), pageWindow(), SearchPagination() (+6 more)

### Community 98 - "lib/branches.ts"
Cohesion: 0.29
Nodes (8): AdminBranchesPage(), dynamic, metadata, BRANCH_INCLUDE, BRANCH_ORDER_BY, BranchWithPlace, listBranches(), listProvinceOptions()

### Community 99 - "SponsorsMarquee.tsx"
Cohesion: 0.50
Nodes (4): SponsorCard(), SponsorsMarquee(), SponsorsMarqueeItem, SponsorsMarqueeProps

### Community 100 - "[id]/route.ts"
Cohesion: 0.18
Nodes (10): dynamic, GET(), notFound(), RouteContext, runtime, EXTENSION_TO_MIME, MIME_TO_EXTENSION, removeVerificationFiles() (+2 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.22
Nodes (6): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_SOURCE_LABELS, PURCHASE_REQUEST_STATUS_TONES

### Community 102 - "[...path]/route.ts"
Cohesion: 0.33
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 103 - "BrandsManager"
Cohesion: 0.23
Nodes (13): deleteBrandAction(), isPrismaCode(), toggleBrandActiveAction(), AdminBrandsPage(), dynamic, metadata, BrandsManager(), handleConfirmDelete() (+5 more)

### Community 104 - "SponsorsManager"
Cohesion: 0.27
Nodes (12): AdminSponsorsPage(), dynamic, metadata, byDisplayOrder(), SponsorsManager(), handleConfirmDelete(), handleMove(), handleSaved() (+4 more)

### Community 105 - "PurchaseRequestsManager.tsx"
Cohesion: 0.21
Nodes (15): PurchaseRequestsFiltersProps, buildPageList(), groupCode(), PageLink(), PurchaseRequestsManager(), changeStatus(), showToast(), PurchaseRequestsManagerProps (+7 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.15
Nodes (24): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesManager(), handleConfirmDelete() (+16 more)

### Community 107 - "validation/car-types.ts"
Cohesion: 0.19
Nodes (12): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+4 more)

### Community 108 - "buy-ads-shared.ts"
Cohesion: 0.29
Nodes (10): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_SORT_LABELS, BUY_AD_SORTS, BuyAdFilterOption (+2 more)

### Community 109 - "AdCard.tsx"
Cohesion: 0.26
Nodes (9): AdCard(), AdCardProps, NoImage(), groupCode(), SellerCodeBadge(), SellerCodeBadgeProps, SIZE, convertPrice() (+1 more)

### Community 110 - "cars/page.tsx"
Cohesion: 0.27
Nodes (8): AdminCarTypesPage(), dynamic, metadata, AdminCarsPage(), dynamic, metadata, carTypeToRecord(), serializeCarType()

### Community 111 - "validation/branches.ts"
Cohesion: 0.22
Nodes (10): asciiDigits(), BRANCH_ADDRESS_MAX_LENGTH, BRANCH_MANAGER_MAX_LENGTH, BRANCH_SORT_ORDER_MAX, BRANCH_TITLE_MAX_LENGTH, BranchFormValues, branchSchema, coordinate() (+2 more)

### Community 112 - "rich-text.ts"
Cohesion: 0.27
Nodes (9): sanitize-html, COLOR, CSS_SIZE, isRichTextEmpty(), normalizeRichText(), renderRichText(), RICH_TEXT_MAX_LENGTH, sanitizeRichText() (+1 more)

### Community 113 - "getSystemSettings"
Cohesion: 0.27
Nodes (8): AdminSettingsPage(), dynamic, metadata, metadata, PanelContactPage(), listActiveBranches(), getSystemSettings, parseRotationMinutes()

### Community 114 - "lib/cars.ts"
Cohesion: 0.29
Nodes (7): CarsManagerProps, CarsTable(), CarsTableProps, Filter, FILTERS, PriceTableManagerProps, CarRecord

### Community 115 - "validation/profile.ts"
Cohesion: 0.28
Nodes (6): isValidCompanyNationalId(), isValidNationalCode(), optionalDigits(), ProfileUpdateInput, profileUpdateSchema, readIdentity()

### Community 116 - "images/page.tsx"
Cohesion: 0.39
Nodes (6): CarImagesPage(), dynamic, metadata, PageProps, carImageToRecord(), carVideoToRecord()

### Community 117 - "PriceCurrency"
Cohesion: 0.32
Nodes (7): CurrencyToggleProps, Draft, PRICE_CURRENCIES, PriceCurrency, PriceListCarDetail, PriceColumn, PriceTableEntryInput

### Community 118 - "CarMediaSlider.tsx"
Cohesion: 0.36
Nodes (5): CarMediaSlider(), CarMediaSliderProps, MediaViewer(), slideOffset(), CarMediaItem

### Community 119 - "validation/sponsors.ts"
Cohesion: 0.25
Nodes (6): MAX_IMAGE_SIZE_BYTES, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX, SponsorFormValues, sponsorSchema

### Community 120 - "zod"
Cohesion: 0.33
Nodes (5): zod, COLOR_CODE_PATTERN, colorCoreSchema, ColorFormValues, ParsedColorForm

### Community 121 - "CarTypesManager"
Cohesion: 0.60
Nodes (6): CarTypesManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 122 - "CarsManager"
Cohesion: 0.60
Nodes (6): CarsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 123 - "ColorsManager"
Cohesion: 0.60
Nodes (6): ColorsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 124 - "SponsorFormModal"
Cohesion: 0.50
Nodes (4): inputClassName(), SponsorFormModal(), clearError(), handleFileChange()

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 715 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `BuyAdsFilters.tsx`, `VerificationManager.tsx`, `colors/actions.ts`, `react`, `car-form/actions.ts`, `formatPersianNumber`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager.tsx`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `MyAdForm.tsx`, `admin/auth-actions.ts`, `MyAdForm`, `(panel)/price-table/actions.ts`, `price-list.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `permissions.ts`, `SaleAdFormModal.tsx`, `CarOffersView.tsx`, `sale-ads/actions.ts`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `toPersianDigits`, `BuyAdForm.tsx`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `panel-search-shared.ts`, `RichTextEditor.tsx`, `CurrencyRates.tsx`, `panel/page.tsx`, `BuyAdsManager`, `BranchesMap.tsx`, `user-auth.ts`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `PurchaseRequestButton.tsx`, `VerificationManager`, `next`, `SearchableSelect`, `BuyAdDetailManager.tsx`, `users/actions.ts`, `ThemeSwitch.tsx`, `cars/actions.ts`, `admins/actions.ts`, `search/buy/page.tsx`, `SponsorsMarquee.tsx`, `requests/page.tsx`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `AdCard.tsx`, `lib/cars.ts`, `PriceCurrency`, `CarMediaSlider.tsx`, `SponsorFormModal`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07191316146540028 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `BuyAdsFilters.tsx`, `VerificationManager.tsx`, `cn`, `react`, `car-form/actions.ts`, `formatPersianNumber`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager.tsx`, `BuyAdOffersPanel.tsx`, `roles/actions.ts`, `MyAdForm.tsx`, `price-table-shared.ts`, `MyAdForm`, `(panel)/price-table/actions.ts`, `price-list.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `permissions.ts`, `SaleAdFormModal.tsx`, `CarOffersView.tsx`, `normalizeDigits`, `sale-ads/actions.ts`, `verification-submission.ts`, `BuyAdDetailView.tsx`, `BuyAdForm.tsx`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `panel-search-shared.ts`, `CurrencyRates.tsx`, `panel/page.tsx`, `BuyAdsManager`, `user-auth.ts`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `PurchaseRequestButton.tsx`, `VerificationManager`, `search/page.tsx`, `branches/actions.ts`, `next`, `SearchableSelect`, `market-rates.ts`, `BuyAdDetailManager.tsx`, `users/actions.ts`, `search/buy/page.tsx`, `requests/page.tsx`, `BrandsManager`, `SponsorsManager`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `buy-ads-shared.ts`, `AdCard.tsx`, `lib/cars.ts`, `validation/profile.ts`, `CarMediaSlider.tsx`, `CarTypesManager`, `CarsManager`, `ColorsManager`, `SponsorFormModal`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07756813417190776 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `BuyAdsFilters.tsx`, `prisma.ts`, `VerificationManager.tsx`, `(app)/about/page.tsx`, `cn`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `formatPersianNumber`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `MyAdForm.tsx`, `admin/auth-actions.ts`, `(panel)/price-table/actions.ts`, `price-list.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `permissions.ts`, `SaleAdFormModal.tsx`, `CarOffersView.tsx`, `package.json`, `BuyAdDetailView.tsx`, `brands/actions.ts`, `toPersianDigits`, `BuyAdForm.tsx`, `BranchFormModal.tsx`, `SystemSettingsForm.tsx`, `panel-search-shared.ts`, `RichTextEditor.tsx`, `CurrencyRates.tsx`, `panel/page.tsx`, `lib/admins.ts`, `BranchesMap.tsx`, `user-auth.ts`, `AdminShell.tsx`, `purchase-requests-shared.ts`, `PurchaseRequestButton.tsx`, `VerificationManager`, `search/page.tsx`, `next`, `SearchableSelect`, `market-rates.ts`, `BuyAdDetailManager.tsx`, `users/actions.ts`, `ThemeSwitch.tsx`, `cars/actions.ts`, `ads/page.tsx`, `[audience]/page.tsx`, `search/buy/page.tsx`, `lib/branches.ts`, `SponsorsMarquee.tsx`, `requests/page.tsx`, `BrandsManager`, `SponsorsManager`, `PurchaseRequestsManager.tsx`, `CarImagesManager.tsx`, `buy-ads-shared.ts`, `AdCard.tsx`, `cars/page.tsx`, `getSystemSettings`, `lib/cars.ts`, `images/page.tsx`, `PriceCurrency`, `CarMediaSlider.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._