# Graph Report - khodroyab  (2026-11-16)

## Corpus Check
- 381 files · ~213,369 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2647 nodes · 8983 edges · 111 communities (104 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `603fe62c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- admin-buy-ads.ts
- currency.ts
- ads/page.tsx
- admins/actions.ts
- verification-submission.ts
- Admin authentication flow
- getSystemSettings
- price-list-ui.tsx
- colors/actions.ts
- cars/actions.ts
- panel-search.ts
- car-form/actions.ts
- validation/brands.ts
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- cn
- MyAdForm.tsx
- price-table-shared.ts
- CarOffersView.tsx
- ads/actions.ts
- lib/cars.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- prisma
- ContactView.tsx
- session.ts
- buy-ads-shared.ts
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- brands/actions.ts
- [audience]/page.tsx
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- BranchFormModal.tsx
- (app)/page.tsx
- dependencies
- scripts
- Toast
- isTrustedOrigin
- user-car-extras.ts
- normalizeDigits
- SystemSettingsForm
- SellersDirectory.tsx
- SubscriptionPlanFormModal.tsx
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- uploads.ts
- prisma.ts
- BuyAdForm.tsx
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- seed-locations.mjs
- UPLOAD_DIR env
- BranchesMap.tsx
- [id]/route.ts
- formatPersianNumber
- middleware.ts
- purchase-requests-shared.ts
- SearchFilters.tsx
- purchase-request-actions.ts
- Modal
- admin.ts
- search/page.tsx
- search/buy/page.tsx
- next
- react
- UsersManager.tsx
- users/actions.ts
- validation/car-types.ts
- SaleAdFormModal
- tailwindcss
- lib/purchase-requests.ts
- SaleAdFormModal.tsx
- zod
- ThemeSwitch.tsx
- AdminShell.tsx
- subscriptions-shared.ts
- adminActionDenied
- PurchaseRequestButton.tsx
- images/page.tsx
- lib/user-cars.ts
- requests/page.tsx
- AdsManager
- users/page.tsx
- CarTypesManager
- ColorsManager
- CarImagesManager.tsx
- toPersianDigits
- PurchaseRequestsManager
- [...path]/route.ts
- CarsManager.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 323 edges
2. `toPersianDigits()` - 268 edges
3. `react` - 218 edges
4. `next` - 164 edges
5. `lucide-react` - 157 edges
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
- `AdminAllAdsPage()` --indirect_call--> `carToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/cars.ts
- `AdminAllAdsPage()` --indirect_call--> `userCarToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/user-cars.ts
- `AdminBrandsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/brands/page.tsx → src/lib/brands.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (111 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.24
Nodes (19): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+11 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.07
Nodes (46): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), PlateGlyph(), PriceMarketIcon(), CollaboratorShortcuts(), CollaboratorShortcutsProps (+38 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.20
Nodes (20): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), ContactChip(), daysSince() (+12 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.20
Nodes (19): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), CarTypeFormModal() (+11 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.06
Nodes (67): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+59 more)

### Community 5 - "currency.ts"
Cohesion: 0.11
Nodes (34): AdsTable(), AdStatusBadge(), STYLES, BuyAdsTable(), Toggle(), lowestPrice(), SaleAdsTable(), CurrencyTag() (+26 more)

### Community 6 - "ads/page.tsx"
Cohesion: 0.11
Nodes (31): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminCarFormPage() (+23 more)

### Community 7 - "admins/actions.ts"
Cohesion: 0.05
Nodes (82): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+74 more)

### Community 8 - "verification-submission.ts"
Cohesion: 0.05
Nodes (59): adminSubmitVerificationAction(), AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, AdminVerificationForm(), chooseFile(), handleSubmit() (+51 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "getSystemSettings"
Cohesion: 0.14
Nodes (18): metadata, PageProps, PanelContactPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES (+10 more)

### Community 11 - "price-list-ui.tsx"
Cohesion: 0.10
Nodes (40): ColorSwatch(), ColorSwatchProps, AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps (+32 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.19
Nodes (17): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+9 more)

### Community 13 - "cars/actions.ts"
Cohesion: 0.15
Nodes (23): sanitize-html, CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode() (+15 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.13
Nodes (25): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+17 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.12
Nodes (29): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+21 more)

### Community 16 - "validation/brands.ts"
Cohesion: 0.24
Nodes (9): brandCoreSchema, BrandFormValues, fallbackSlug(), parseBrandForm(), ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug() (+1 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.18
Nodes (18): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+10 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.19
Nodes (17): CardTitle(), CodeChip(), groupCode(), PersonFlags(), PurchaseRequestDetailManager(), changeStatus(), saveNote(), showToast() (+9 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.11
Nodes (33): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+25 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.13
Nodes (28): ContactField, ContactValues, SettingsProvinceOption, SystemSettingsFormProps, PRICE_TABLE_PRICE_FIELDS, parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS (+20 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.09
Nodes (40): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+32 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.12
Nodes (25): dynamic, GET(), BuyAdDetailPage(), dynamic, metadata, buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE (+17 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.22
Nodes (13): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), handleSubmit(), authenticateAdmin(), consumeTiming(), DUMMY_PASSWORD_HASH (+5 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.22
Nodes (17): BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages() (+9 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.14
Nodes (26): findBiddableAd(), offersFailure(), submitBuyAdOfferAction(), withdrawBuyAdOfferAction(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding() (+18 more)

### Community 27 - "cn"
Cohesion: 0.17
Nodes (18): BuyAdDetailManager(), Confirm, RankMedal(), Spec(), Stat(), StatePill(), PersonAvatar(), PersonCell() (+10 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.16
Nodes (16): AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES (+8 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.12
Nodes (24): DEFAULT_PRICE_TABLE_CURRENCY, countPriceListSellers(), ALL_PRICE_FIELD_KEYS, digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS (+16 more)

### Community 30 - "CarOffersView.tsx"
Cohesion: 0.11
Nodes (27): UserPriceTablePreviewProps, UserProfileProps, CurrencyToggleProps, CarOffersViewProps, compareDigits(), PriceOrder, sortOffers(), sortValue() (+19 more)

### Community 31 - "ads/actions.ts"
Cohesion: 0.24
Nodes (19): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+11 more)

### Community 32 - "lib/cars.ts"
Cohesion: 0.16
Nodes (21): AdminCarsPage(), dynamic, metadata, guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages() (+13 more)

### Community 33 - "price-list.ts"
Cohesion: 0.14
Nodes (31): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn(), jalaliDate (+23 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.29
Nodes (12): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+4 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.17
Nodes (15): activeDockKey(), PAGE_TITLES, PANEL_NAV_ITEMS, PanelNavItem, panelPageTitle(), startsWith(), PanelNotice(), Avatar() (+7 more)

### Community 36 - "prisma"
Cohesion: 0.09
Nodes (27): AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata, AdminCarTypesPage(), dynamic (+19 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (25): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+17 more)

### Community 38 - "session.ts"
Cohesion: 0.19
Nodes (17): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches() (+9 more)

### Community 39 - "buy-ads-shared.ts"
Cohesion: 0.19
Nodes (14): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_POLL_MS, BUY_AD_SORT_LABELS, BUY_AD_SORTS (+6 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.10
Nodes (41): AdDetailPage(), dynamic, metadata, dynamic, PageProps, PriceListCarPage(), dynamic, metadata (+33 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.11
Nodes (38): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+30 more)

### Community 42 - "brands/actions.ts"
Cohesion: 0.17
Nodes (21): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+13 more)

### Community 43 - "[audience]/page.tsx"
Cohesion: 0.14
Nodes (18): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), div(), jalaliToGregorian(), parseJalaliDate() (+10 more)

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
Cohesion: 0.21
Nodes (22): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+14 more)

### Community 49 - "BranchFormModal.tsx"
Cohesion: 0.08
Nodes (54): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+46 more)

### Community 50 - "(app)/page.tsx"
Cohesion: 0.11
Nodes (22): metadata, PageProps, PanelLoginPage(), PanelLogo(), PanelLogoProps, SIZES, SponsorsMarquee(), fieldClass() (+14 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "Toast"
Cohesion: 0.20
Nodes (14): ModalState, SaleTermsManager(), handleDelete(), showToast(), faDate, faDateTime, StatusPill(), UserSubscriptionsSection() (+6 more)

### Community 54 - "isTrustedOrigin"
Cohesion: 0.29
Nodes (10): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), authorizeAdminAction(), isTrustedOrigin(), savePurchaseRequestNote(), setPurchaseRequestStatus() (+2 more)

### Community 55 - "user-car-extras.ts"
Cohesion: 0.18
Nodes (15): AdImageDraft, AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson() (+7 more)

### Community 56 - "normalizeDigits"
Cohesion: 0.15
Nodes (15): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, PRICE_CURRENCIES, normalizeDigits(), BuyAdInput, ParsedBuyAdForm, ParsedOfferPrice (+7 more)

### Community 57 - "SystemSettingsForm"
Cohesion: 0.29
Nodes (11): ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError(), handleSubmit(), setContactField() (+3 more)

### Community 58 - "SellersDirectory.tsx"
Cohesion: 0.25
Nodes (11): dynamic, metadata, PanelSellersPage(), groupSellerCode(), hueOf(), sellerInitials(), SellerMonogram(), asciiDigits() (+3 more)

### Community 59 - "SubscriptionPlanFormModal.tsx"
Cohesion: 0.23
Nodes (13): AdminSubscriptionsPage(), asciiDigits(), inputClassName(), SubscriptionPlanFormModal(), SubscriptionPlanFormModalProps, SubscriptionPlansManager(), handleDelete(), handleToggle() (+5 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.07
Nodes (38): framer-motion, dynamic, GET(), dynamic, metadata, PanelDashboardPage(), dynamic, SearchTabsLayout() (+30 more)

### Community 63 - "uploads.ts"
Cohesion: 0.21
Nodes (14): dynamic, fail(), POST(), RouteContext, runtime, sanitizeBaseName(), saveVideoStream(), sniffVideoContainer() (+6 more)

### Community 64 - "prisma.ts"
Cohesion: 0.08
Nodes (37): @prisma/client, server-only, AdminUserProfilePage(), dynamic, metadata, PageProps, dynamic, faTime (+29 more)

### Community 65 - "BuyAdForm.tsx"
Cohesion: 0.22
Nodes (13): CurrencyToggle(), AdCarChoice, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass() (+5 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "seed-locations.mjs"
Cohesion: 0.18
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "[id]/route.ts"
Cohesion: 0.16
Nodes (13): dynamic, GET(), notFound(), RouteContext, runtime, getCurrentAdmin(), readSessionFromCookies(), EXTENSION_TO_MIME (+5 more)

### Community 74 - "formatPersianNumber"
Cohesion: 0.08
Nodes (51): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep() (+43 more)

### Community 76 - "middleware.ts"
Cohesion: 0.28
Nodes (8): isPublicPanelPath(), AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES, ProtectedArea, redirectTo()

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.12
Nodes (29): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, groupCode(), PurchaseRequestsManagerProps, AdminPurchaseRequestPage, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS (+21 more)

### Community 78 - "SearchFilters.tsx"
Cohesion: 0.15
Nodes (18): DEFAULTS, SearchFiltersProps, SORTS, buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange() (+10 more)

### Community 79 - "purchase-request-actions.ts"
Cohesion: 0.13
Nodes (21): clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany(), listProvinceOptions(), createPurchaseRequest(), PURCHASE_REQUEST_DESCRIPTION_MAX (+13 more)

### Community 80 - "Modal"
Cohesion: 0.17
Nodes (12): UserSubscriptionActionResult, GrantSubscriptionModal(), handleSubmit(), GrantSubscriptionModalProps, GrantSuccess, inputClassName(), SubscriptionBadgeProps, UserSubscriptionsSectionProps (+4 more)

### Community 81 - "admin.ts"
Cohesion: 0.12
Nodes (17): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), isValidNationalCode(), optionalDigits(), ProfileUpdateInput (+9 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.24
Nodes (10): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+2 more)

### Community 83 - "search/buy/page.tsx"
Cohesion: 0.20
Nodes (13): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), dateFormatter, LiveClock(), LiveClockProps (+5 more)

### Community 84 - "next"
Cohesion: 0.12
Nodes (29): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+21 more)

### Community 85 - "react"
Cohesion: 0.07
Nodes (28): lucide-react, react, AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo(), AdminLogoProps, BranchesTable() (+20 more)

### Community 86 - "UsersManager.tsx"
Cohesion: 0.25
Nodes (13): deleteUserAction(), findUsersByCodeAction(), digitQuery(), FILTERS, matchesFilter(), UsersManager(), handleDelete(), handleToggleActive() (+5 more)

### Community 87 - "users/actions.ts"
Cohesion: 0.25
Nodes (14): createUserAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction(), inputClassName(), UserFormModal() (+6 more)

### Community 88 - "validation/car-types.ts"
Cohesion: 0.19
Nodes (12): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+4 more)

### Community 89 - "SaleAdFormModal"
Cohesion: 0.17
Nodes (7): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow(), useAdExtras(), addFiles()

### Community 91 - "lib/purchase-requests.ts"
Cohesion: 0.12
Nodes (21): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, PUBLIC_AD_WHERE, ADMIN_PURCHASE_REQUEST_PAGE_SIZE, carLabelOf(), CreatePurchaseRequestResult (+13 more)

### Community 92 - "SaleAdFormModal.tsx"
Cohesion: 0.08
Nodes (40): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, AdsTableProps (+32 more)

### Community 93 - "zod"
Cohesion: 0.15
Nodes (10): zod, optionCoreSchema, OptionFormValues, optionItemSchema, ParsedOptionForm, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX (+2 more)

### Community 94 - "ThemeSwitch.tsx"
Cohesion: 0.22
Nodes (13): PanelAppLayout(), PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme() (+5 more)

### Community 95 - "AdminShell.tsx"
Cohesion: 0.11
Nodes (24): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup (+16 more)

### Community 96 - "subscriptions-shared.ts"
Cohesion: 0.23
Nodes (11): DAYS_PER_MONTH, SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS, SUBSCRIPTION_WARNING_DAYS, field(), firstErrors(), grantSubscriptionSchema, parseGrantSubscriptionForm() (+3 more)

### Community 97 - "adminActionDenied"
Cohesion: 0.39
Nodes (6): saveSystemSettingsAction(), SystemSettingsActionResult, adminActionDenied(), saveSystemSettings(), applyRotationToActiveCodes(), parseSystemSettingsForm()

### Community 98 - "PurchaseRequestButton.tsx"
Cohesion: 0.26
Nodes (9): fieldClass(), FieldError(), groupCode(), Label(), PurchaseRequestButtonProps, PurchaseRequestDialog(), handleSubmit(), SuccessState() (+1 more)

### Community 99 - "images/page.tsx"
Cohesion: 0.27
Nodes (9): CarImagesPage(), dynamic, metadata, PageProps, CarImagesManagerProps, CarImageRecord, carImageToRecord(), CarVideoRecord (+1 more)

### Community 100 - "lib/user-cars.ts"
Cohesion: 0.18
Nodes (10): AD_CODE_MAX_ATTEMPTS, AdOptionDisplay, adOptionsToFormValues(), faDate, UserCarImageRecord, userCarImagesOrder, UserCarOptionRow, userCarOptionsInclude (+2 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES

### Community 102 - "AdsManager"
Cohesion: 0.36
Nodes (8): AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList(), PageLink()

### Community 103 - "users/page.tsx"
Cohesion: 0.32
Nodes (6): AdminUsersPage(), dynamic, metadata, USER_DIRECTORY_ACCESS, isUserFilter(), USER_FILTERS

### Community 104 - "CarTypesManager"
Cohesion: 0.60
Nodes (6): CarTypesManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 105 - "ColorsManager"
Cohesion: 0.60
Nodes (6): ColorsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleUpdateSuccess(), showToast()

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.15
Nodes (24): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesManager(), handleConfirmDelete() (+16 more)

### Community 107 - "toPersianDigits"
Cohesion: 0.10
Nodes (23): react-dom, dynamic, PageProps, SellerProfilePage(), BuyAdsFilters(), Segmented(), ColorsTable(), SubscriptionBadge() (+15 more)

### Community 108 - "PurchaseRequestsManager"
Cohesion: 0.40
Nodes (5): buildPageList(), PageLink(), PurchaseRequestsManager(), changeStatus(), showToast()

### Community 110 - "[...path]/route.ts"
Cohesion: 0.29
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 114 - "CarsManager.tsx"
Cohesion: 0.19
Nodes (14): BrandFormModalProps, BrandsManagerProps, BrandsTableProps, CarFormModalProps, CarsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError() (+6 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 732 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `currency.ts`, `admins/actions.ts`, `verification-submission.ts`, `getSystemSettings`, `price-list-ui.tsx`, `colors/actions.ts`, `cars/actions.ts`, `car-form/actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `BuyAdOffersPanel.tsx`, `MyAdForm.tsx`, `CarOffersView.tsx`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `Toast`, `SystemSettingsForm`, `SellersDirectory.tsx`, `SubscriptionPlanFormModal.tsx`, `RichTextEditor.tsx`, `market-rates.ts`, `BuyAdForm.tsx`, `BranchesMap.tsx`, `formatPersianNumber`, `purchase-requests-shared.ts`, `SearchFilters.tsx`, `Modal`, `search/buy/page.tsx`, `next`, `react`, `UsersManager.tsx`, `users/actions.ts`, `SaleAdFormModal`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `AdminShell.tsx`, `PurchaseRequestButton.tsx`, `requests/page.tsx`, `AdsManager`, `CarImagesManager.tsx`, `toPersianDigits`, `PurchaseRequestsManager`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `currency.ts`, `ads/page.tsx`, `admins/actions.ts`, `verification-submission.ts`, `price-list-ui.tsx`, `car-form/actions.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `BuyAdOffersPanel.tsx`, `cn`, `MyAdForm.tsx`, `price-table-shared.ts`, `CarOffersView.tsx`, `lib/cars.ts`, `prisma`, `ContactView.tsx`, `buy-ads-shared.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `sale-ads/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `Toast`, `user-car-extras.ts`, `normalizeDigits`, `SystemSettingsForm`, `SellersDirectory.tsx`, `SubscriptionPlanFormModal.tsx`, `market-rates.ts`, `BuyAdForm.tsx`, `formatPersianNumber`, `purchase-requests-shared.ts`, `SearchFilters.tsx`, `purchase-request-actions.ts`, `Modal`, `search/page.tsx`, `search/buy/page.tsx`, `next`, `react`, `UsersManager.tsx`, `SaleAdFormModal`, `SaleAdFormModal.tsx`, `AdminShell.tsx`, `PurchaseRequestButton.tsx`, `requests/page.tsx`, `AdsManager`, `CarTypesManager`, `ColorsManager`, `CarImagesManager.tsx`, `PurchaseRequestsManager`, `CarsManager.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `admin-buy-ads.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.057297297297297295 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `admin-buy-ads.ts`, `currency.ts`, `ads/page.tsx`, `admins/actions.ts`, `verification-submission.ts`, `getSystemSettings`, `price-list-ui.tsx`, `colors/actions.ts`, `cars/actions.ts`, `car-form/actions.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `cn`, `MyAdForm.tsx`, `ads/actions.ts`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `prisma`, `ContactView.tsx`, `session.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `[audience]/page.tsx`, `package.json`, `sale-ads/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `isTrustedOrigin`, `SellersDirectory.tsx`, `market-rates.ts`, `uploads.ts`, `prisma.ts`, `BuyAdForm.tsx`, `formatPersianNumber`, `middleware.ts`, `purchase-requests-shared.ts`, `SearchFilters.tsx`, `purchase-request-actions.ts`, `Modal`, `search/page.tsx`, `search/buy/page.tsx`, `react`, `UsersManager.tsx`, `users/actions.ts`, `lib/purchase-requests.ts`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `AdminShell.tsx`, `adminActionDenied`, `PurchaseRequestButton.tsx`, `images/page.tsx`, `requests/page.tsx`, `users/page.tsx`, `CarImagesManager.tsx`, `toPersianDigits`, `[...path]/route.ts`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._