# Graph Report - khodroyab  (2026-11-16)

## Corpus Check
- 379 files · ~212,131 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2637 nodes · 8929 edges · 108 communities (101 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7ba3f2e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- cars/actions.ts
- admin-buy-ads.ts
- currency.ts
- prisma.ts
- admins/actions.ts
- AdminVerificationForm.tsx
- Admin authentication flow
- BranchFormModal.tsx
- BuyAdDetailView.tsx
- colors/actions.ts
- BuyAdDetailManager.tsx
- panel-search.ts
- car-form/actions.ts
- ads/[id]/edit/page.tsx
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- app/layout.tsx
- toPersianDigits
- normalizeDigits
- MyAdForm.tsx
- price-table-shared.ts
- price-market.ts
- user-auth.ts
- lib/cars.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- guards.ts
- ContactView.tsx
- session.ts
- buy-ads-shared.ts
- cn
- sponsors/actions.ts
- brands/actions.ts
- lib/purchase-requests.ts
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- sale-ads/actions.ts
- Modal
- (app)/page.tsx
- dependencies
- scripts
- search/buy/page.tsx
- UsersManager.tsx
- BuyAdForm.tsx
- verification-submission.ts
- SystemSettingsForm
- server-only
- panel-search-shared.ts
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- UserAuthCard.tsx
- verification/actions.ts
- CarRecord
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- [id]/route.ts
- UPLOAD_DIR env
- BranchesMap.tsx
- validation/system-settings.ts
- (panel)/dashboard/page.tsx
- middleware.ts
- purchase-requests-shared.ts
- UrlFilterBar.tsx
- isTrustedOrigin
- VerificationManager.tsx
- admin.ts
- search/page.tsx
- [id]/price-table/actions.ts
- next
- Toggle
- SellersDirectory.tsx
- adminActionDenied
- BrandsManager
- PurchaseRequestButton.tsx
- tailwindcss
- [audience]/[id]/page.tsx
- SaleAdFormModal.tsx
- validation/sponsors.ts
- ThemeSwitch.tsx
- lib/user-cars.ts
- [audience]/page.tsx
- settings/actions.ts
- requests/page.tsx
- uploads.ts
- AdminVerificationForm
- CarImagesManager.tsx
- AdCard.tsx
- formatPersianNumber
- [...path]/route.ts
- utils.ts
- CarMediaSlider.tsx
- react

## God Nodes (most connected - your core abstractions)
1. `cn()` - 318 edges
2. `toPersianDigits()` - 265 edges
3. `react` - 216 edges
4. `next` - 163 edges
5. `lucide-react` - 155 edges
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
- `AdminAllAdsPage()` --indirect_call--> `optionToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/options.ts
- `AdminAllAdsPage()` --indirect_call--> `saleTermToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/sale-terms.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (108 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.08
Nodes (59): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+51 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (42): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+34 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.20
Nodes (19): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), ContactChip(), daysSince() (+11 more)

### Community 3 - "cars/actions.ts"
Cohesion: 0.05
Nodes (65): sanitize-html, CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction() (+57 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.06
Nodes (55): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+47 more)

### Community 5 - "currency.ts"
Cohesion: 0.13
Nodes (26): AdDetailPage(), dynamic, metadata, BuyAdsTable(), CurrencyTag(), AdDetailView(), AdDetailViewProps, PriceEquivalent() (+18 more)

### Community 6 - "prisma.ts"
Cohesion: 0.13
Nodes (19): @prisma/client, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull() (+11 more)

### Community 7 - "admins/actions.ts"
Cohesion: 0.05
Nodes (81): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+73 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.16
Nodes (19): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, VerificationStatusBadge(), VerificationStatusBadgeProps, VerificationManagerProps (+11 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "BranchFormModal.tsx"
Cohesion: 0.05
Nodes (69): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+61 more)

### Community 11 - "BuyAdDetailView.tsx"
Cohesion: 0.14
Nodes (27): AdGallery(), NoImage(), BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdCardProps (+19 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.14
Nodes (24): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+16 more)

### Community 13 - "BuyAdDetailManager.tsx"
Cohesion: 0.19
Nodes (19): Confirm, PersonAvatar(), PersonCell(), BuyAdsFiltersProps, BuyAdsManagerProps, BuyAdsTableProps, ADMIN_BUY_AD_FILTER_DEFAULTS, ADMIN_BUY_AD_PARAM_KEYS (+11 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.16
Nodes (21): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+13 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.13
Nodes (24): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+16 more)

### Community 16 - "ads/[id]/edit/page.tsx"
Cohesion: 0.14
Nodes (18): AdminCarFormPage(), dynamic, metadata, AdminSaleTermsPage(), dynamic, metadata, dynamic, EditAdPage() (+10 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.15
Nodes (22): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, verifyOtp() (+14 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.17
Nodes (22): setPurchaseRequestStatusAction(), CardTitle(), CodeChip(), groupCode(), PersonFlags(), PurchaseRequestDetailManager(), changeStatus(), saveNote() (+14 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.12
Nodes (23): AdminUserPriceTablePage(), dynamic, metadata, PageProps, dynamic, metadata, PageProps, PanelPriceTablePage() (+15 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.16
Nodes (19): ContactField, ContactValues, SettingsProvinceOption, SystemSettingsFormProps, PRICE_TABLE_PRICE_FIELDS, parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS (+11 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (31): borderFor(), Draft, Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS (+23 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.16
Nodes (20): BuyAdDetailPage(), dynamic, metadata, buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE, buyAdDetailInclude, BuyAdRow (+12 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.21
Nodes (13): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), LoginForm(), handleSubmit(), authenticateAdmin(), PASSWORD_HASH_ROUNDS (+5 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.12
Nodes (29): BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest(), offersFailure() (+21 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "toPersianDigits"
Cohesion: 0.12
Nodes (27): RankMedal(), BuyAdsFilters(), Segmented(), Chip(), PurchaseRequestsFilters(), apply(), applyPeriod(), Segmented() (+19 more)

### Community 27 - "normalizeDigits"
Cohesion: 0.15
Nodes (19): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, isValidTierYear(), normalizeYear(), normalizeDigits(), BuyAdInput, buyAdSchema (+11 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.10
Nodes (21): AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES (+13 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (23): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS (+15 more)

### Community 30 - "price-market.ts"
Cohesion: 0.19
Nodes (18): UserPriceTablePreviewProps, UserProfileProps, PlateGlyph(), PriceMarketIcon(), PriceMarketTabsProps, TabBadge, MyPriceTableManagerProps, PriceTableMarketEditorProps (+10 more)

### Community 31 - "user-auth.ts"
Cohesion: 0.13
Nodes (30): dynamic, GET(), dynamic, PageProps, PriceListCarPage(), dynamic, metadata, PageProps (+22 more)

### Community 32 - "lib/cars.ts"
Cohesion: 0.22
Nodes (16): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+8 more)

### Community 33 - "price-list.ts"
Cohesion: 0.15
Nodes (28): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), countPriceListSellers(), getPriceListCarDetail(), getPriceListMarketStats() (+20 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.19
Nodes (19): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+11 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.14
Nodes (17): DollarTicker(), activeDockKey(), PAGE_TITLES, PANEL_NAV_ITEMS, PanelNavItem, panelPageTitle(), startsWith(), PanelNotice() (+9 more)

### Community 36 - "guards.ts"
Cohesion: 0.08
Nodes (30): AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata, AdminCarTypesPage(), dynamic (+22 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.11
Nodes (28): BranchMapPoint, ConsultationFab(), ConsultationFabProps, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout() (+20 more)

### Community 38 - "session.ts"
Cohesion: 0.20
Nodes (17): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches(), createSessionToken() (+9 more)

### Community 39 - "buy-ads-shared.ts"
Cohesion: 0.16
Nodes (16): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, OfferRowProps, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_POLL_MS, BUY_AD_SORT_LABELS (+8 more)

### Community 40 - "cn"
Cohesion: 0.14
Nodes (32): CarOffersView(), CarOffersViewProps, compareDigits(), PriceOrder, sortOffers(), sortValue(), UpdatedAt(), HorizontalScroller() (+24 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.14
Nodes (31): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+23 more)

### Community 42 - "brands/actions.ts"
Cohesion: 0.16
Nodes (18): BrandActionResult, BrandSimpleActionResult, createBrandAction(), guardRequest(), updateBrandAction(), BrandFormModal(), handleSubmit(), inputClassName() (+10 more)

### Community 43 - "lib/purchase-requests.ts"
Cohesion: 0.10
Nodes (30): div(), jalaliToGregorian(), parseJalaliDate(), priceColumnKey(), withVisiblePrices(), ADMIN_PURCHASE_REQUEST_PAGE_SIZE, buildWhere(), carLabelOf() (+22 more)

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
Cohesion: 0.08
Nodes (60): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+52 more)

### Community 49 - "Modal"
Cohesion: 0.24
Nodes (8): revalidateVerificationPages(), reviewVerificationAction(), Modal(), ModalProps, SIZE_CLASSES, UserVerificationSection(), review(), showToast()

### Community 50 - "(app)/page.tsx"
Cohesion: 0.20
Nodes (12): metadata, PageProps, PanelLoginPage(), PanelLogo(), PanelLogoProps, SIZES, SponsorCard(), SponsorsMarquee() (+4 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "search/buy/page.tsx"
Cohesion: 0.20
Nodes (13): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), dateFormatter, LiveClock(), LiveClockProps (+5 more)

### Community 54 - "UsersManager.tsx"
Cohesion: 0.21
Nodes (11): inputClassName(), UserFormModal(), UserFormModalProps, digitQuery(), FILTERS, matchesFilter(), UsersManagerProps, UserFilter (+3 more)

### Community 55 - "BuyAdForm.tsx"
Cohesion: 0.24
Nodes (12): CurrencyToggle(), AdCarChoice, BuyAdForm(), BuyAdFormColor, BuyAdFormProps, digitsToAscii(), FieldError(), inputClass() (+4 more)

### Community 56 - "verification-submission.ts"
Cohesion: 0.10
Nodes (15): AdminSubmitVerificationResult, ReviewVerificationResult, isValidCompanyNationalId(), isValidNationalCode(), profileUpdateSchema, isVerificationPersonType(), VERIFICATION_REJECT_REASON_MAX, VerificationIdentity (+7 more)

### Community 57 - "SystemSettingsForm"
Cohesion: 0.29
Nodes (11): ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError(), handleSubmit(), setContactField() (+3 more)

### Community 58 - "server-only"
Cohesion: 0.14
Nodes (18): server-only, AdminUsersPage(), dynamic, metadata, PUBLIC_AD_WHERE, PUBLIC_SELLER_WHERE, PublicSeller, PublicSellerProfile (+10 more)

### Community 59 - "panel-search-shared.ts"
Cohesion: 0.22
Nodes (12): DEFAULTS, SearchFiltersProps, SORTS, AdDetailSaleTerm, SEARCH_SORT_LABELS, SEARCH_SORTS, SearchAdSaleTerm, SearchFilterValues (+4 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.07
Nodes (41): framer-motion, dynamic, GET(), dynamic, MyAdsTabsLayout(), dynamic, metadata, PanelDashboardPage() (+33 more)

### Community 63 - "UserAuthCard.tsx"
Cohesion: 0.22
Nodes (11): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+3 more)

### Community 64 - "verification/actions.ts"
Cohesion: 0.33
Nodes (8): submitVerificationAction(), SubmitVerificationResult, faDateTime, getUserVerification(), verificationDocumentUrl(), storeVerificationSubmission(), VerificationRow, verificationToRecord()

### Community 65 - "CarRecord"
Cohesion: 0.11
Nodes (20): BrandFormModalProps, BrandsManagerProps, BrandsTableProps, CarFormModalProps, CarsManagerProps, CarsTable(), CarsTableProps, ItemDraft (+12 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "[id]/route.ts"
Cohesion: 0.09
Nodes (20): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+12 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.21
Nodes (20): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+12 more)

### Community 73 - "validation/system-settings.ts"
Cohesion: 0.24
Nodes (12): LocationPicker(), applyCoordsText(), formatGeoPoint(), parseGeoPoint(), asciiDigits(), asUrl(), hostIs(), normalizeHandleLink() (+4 more)

### Community 74 - "(panel)/dashboard/page.tsx"
Cohesion: 0.05
Nodes (63): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminDashboardPage(), dynamic, greetingFor(), metadata, AdminForbiddenPage() (+55 more)

### Community 76 - "middleware.ts"
Cohesion: 0.19
Nodes (10): isPublicPanelPath(), PANEL_HOME, PUBLIC_PANEL_PATTERNS, AREAS, config, isPassthrough(), middleware(), PASSTHROUGH_PREFIXES (+2 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.15
Nodes (23): PurchaseRequestDetailManagerProps, jalaliDay, PERIODS, PurchaseRequestsFiltersProps, PurchaseRequestsManagerProps, AdminPurchaseRequestPage, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS (+15 more)

### Community 78 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 79 - "isTrustedOrigin"
Cohesion: 0.10
Nodes (25): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), clientIp(), loadPurchaseRequestLocationsAction(), submitPurchaseRequestAction(), SubmitPurchaseRequestResult, tooMany() (+17 more)

### Community 80 - "VerificationManager.tsx"
Cohesion: 0.13
Nodes (20): dynamic, metadata, PanelVerificationPage(), DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary() (+12 more)

### Community 81 - "admin.ts"
Cohesion: 0.13
Nodes (17): zod, PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), optionalDigits(), ProfileUpdateInput (+9 more)

### Community 82 - "search/page.tsx"
Cohesion: 0.24
Nodes (10): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+2 more)

### Community 83 - "[id]/price-table/actions.ts"
Cohesion: 0.33
Nodes (9): parseBigInt(), saveUserPriceTableAction(), guardRequest(), parseBigInt(), saveMyPriceTableAction(), isPriceMarket(), entrySignature(), mergeDisabledPrices() (+1 more)

### Community 84 - "next"
Cohesion: 0.12
Nodes (27): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+19 more)

### Community 85 - "Toggle"
Cohesion: 0.20
Nodes (15): BranchesTable(), BrandsTable(), OptionsTable(), OptionsTableProps, typeLabel(), PriceTableCarsTable(), SponsorsTable(), Badge() (+7 more)

### Community 86 - "SellersDirectory.tsx"
Cohesion: 0.23
Nodes (12): dynamic, metadata, PanelSellersPage(), groupSellerCode(), hueOf(), sellerInitials(), SellerMonogram(), asciiDigits() (+4 more)

### Community 87 - "adminActionDenied"
Cohesion: 0.28
Nodes (16): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+8 more)

### Community 88 - "BrandsManager"
Cohesion: 0.36
Nodes (10): deleteBrandAction(), isPrismaCode(), toggleBrandActiveAction(), BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleToggleActive() (+2 more)

### Community 89 - "PurchaseRequestButton.tsx"
Cohesion: 0.16
Nodes (15): ColorSwatch(), ColorSwatchProps, MyAdCard(), NoImage(), STATUS_HINT, MyAdsManager(), fieldClass(), FieldError() (+7 more)

### Community 91 - "[audience]/[id]/page.tsx"
Cohesion: 0.28
Nodes (8): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, getAdminPurchaseRequestDetail(), snapshotLines(), toPerson(), toRecord()

### Community 92 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (35): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsTable(), AdsTableProps (+27 more)

### Community 93 - "validation/sponsors.ts"
Cohesion: 0.22
Nodes (7): ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX, SponsorFormValues, sponsorSchema

### Community 94 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelAppLayout(), PanelSectionLayout(), viewport, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 95 - "lib/user-cars.ts"
Cohesion: 0.11
Nodes (21): AdminUserProfilePage(), dynamic, metadata, PageProps, AdminUserSaleAdsPage(), dynamic, metadata, PageProps (+13 more)

### Community 96 - "[audience]/page.tsx"
Cohesion: 0.21
Nodes (11): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), audienceWhere(), buildOrderBy(), getAdminPurchaseRequestCounts() (+3 more)

### Community 97 - "settings/actions.ts"
Cohesion: 0.43
Nodes (5): saveSystemSettingsAction(), SystemSettingsActionResult, saveSystemSettings(), applyRotationToActiveCodes(), parseSystemSettingsForm()

### Community 101 - "requests/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES

### Community 102 - "uploads.ts"
Cohesion: 0.20
Nodes (15): dynamic, fail(), POST(), RouteContext, runtime, carVideoToRecord(), sanitizeBaseName(), saveVideoStream() (+7 more)

### Community 103 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.12
Nodes (30): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesPage(), dynamic (+22 more)

### Community 107 - "AdCard.tsx"
Cohesion: 0.14
Nodes (17): dynamic, PageProps, SellerProfilePage(), AdCard(), AdCardProps, NoImage(), hrefFor(), pageWindow() (+9 more)

### Community 108 - "formatPersianNumber"
Cohesion: 0.16
Nodes (16): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), DeltaBadge(), Sparkline(), SparklineProps (+8 more)

### Community 110 - "[...path]/route.ts"
Cohesion: 0.33
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 114 - "utils.ts"
Cohesion: 0.19
Nodes (17): ModalState, ModalState, ModalState, ColorsManagerProps, ModalState, ColorsTable(), ColorsTableProps, ModalState (+9 more)

### Community 115 - "CarMediaSlider.tsx"
Cohesion: 0.31
Nodes (6): react-dom, CarMediaSlider(), CarMediaSliderProps, MediaViewer(), slideOffset(), CarMediaItem

### Community 123 - "react"
Cohesion: 0.10
Nodes (10): lucide-react, react, ComingSoonProps, InfoTab, TABS, CHIPS, SearchAdsCardProps, Edges (+2 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 732 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `currency.ts`, `admins/actions.ts`, `AdminVerificationForm.tsx`, `BranchFormModal.tsx`, `BuyAdDetailView.tsx`, `colors/actions.ts`, `BuyAdDetailManager.tsx`, `car-form/actions.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `normalizeDigits`, `MyAdForm.tsx`, `price-table-shared.ts`, `price-market.ts`, `user-auth.ts`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `buy-ads-shared.ts`, `cn`, `sponsors/actions.ts`, `sale-ads/actions.ts`, `Modal`, `search/buy/page.tsx`, `UsersManager.tsx`, `BuyAdForm.tsx`, `verification-submission.ts`, `SystemSettingsForm`, `panel-search-shared.ts`, `market-rates.ts`, `UserAuthCard.tsx`, `CarRecord`, `(panel)/dashboard/page.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `isTrustedOrigin`, `VerificationManager.tsx`, `search/page.tsx`, `next`, `Toggle`, `SellersDirectory.tsx`, `adminActionDenied`, `BrandsManager`, `PurchaseRequestButton.tsx`, `SaleAdFormModal.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `CarImagesManager.tsx`, `AdCard.tsx`, `formatPersianNumber`, `utils.ts`, `CarMediaSlider.tsx`, `react`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07867494824016563 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `currency.ts`, `admins/actions.ts`, `AdminVerificationForm.tsx`, `BranchFormModal.tsx`, `BuyAdDetailView.tsx`, `colors/actions.ts`, `BuyAdDetailManager.tsx`, `car-form/actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/system-settings.ts`, `MyPriceTableManager.tsx`, `admin/auth-actions.ts`, `toPersianDigits`, `MyAdForm.tsx`, `price-market.ts`, `user-auth.ts`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `ContactView.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `sale-ads/actions.ts`, `Modal`, `(app)/page.tsx`, `search/buy/page.tsx`, `UsersManager.tsx`, `BuyAdForm.tsx`, `SystemSettingsForm`, `RichTextEditor.tsx`, `market-rates.ts`, `UserAuthCard.tsx`, `CarRecord`, `BranchesMap.tsx`, `validation/system-settings.ts`, `(panel)/dashboard/page.tsx`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `VerificationManager.tsx`, `next`, `Toggle`, `SellersDirectory.tsx`, `adminActionDenied`, `PurchaseRequestButton.tsx`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `CarImagesManager.tsx`, `AdCard.tsx`, `formatPersianNumber`, `utils.ts`, `CarMediaSlider.tsx`, `react`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07756813417190776 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `cars/actions.ts`, `admin-buy-ads.ts`, `currency.ts`, `prisma.ts`, `admins/actions.ts`, `BranchFormModal.tsx`, `BuyAdDetailView.tsx`, `colors/actions.ts`, `BuyAdDetailManager.tsx`, `car-form/actions.ts`, `ads/[id]/edit/page.tsx`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `app/layout.tsx`, `toPersianDigits`, `MyAdForm.tsx`, `price-market.ts`, `user-auth.ts`, `lib/cars.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `guards.ts`, `ContactView.tsx`, `session.ts`, `cn`, `sponsors/actions.ts`, `brands/actions.ts`, `package.json`, `sale-ads/actions.ts`, `(app)/page.tsx`, `search/buy/page.tsx`, `UsersManager.tsx`, `BuyAdForm.tsx`, `verification-submission.ts`, `server-only`, `market-rates.ts`, `UserAuthCard.tsx`, `verification/actions.ts`, `CarRecord`, `(panel)/dashboard/page.tsx`, `middleware.ts`, `purchase-requests-shared.ts`, `UrlFilterBar.tsx`, `isTrustedOrigin`, `VerificationManager.tsx`, `search/page.tsx`, `[id]/price-table/actions.ts`, `SellersDirectory.tsx`, `adminActionDenied`, `PurchaseRequestButton.tsx`, `[audience]/[id]/page.tsx`, `SaleAdFormModal.tsx`, `ThemeSwitch.tsx`, `lib/user-cars.ts`, `[audience]/page.tsx`, `settings/actions.ts`, `requests/page.tsx`, `uploads.ts`, `CarImagesManager.tsx`, `AdCard.tsx`, `formatPersianNumber`, `[...path]/route.ts`, `utils.ts`, `react`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._