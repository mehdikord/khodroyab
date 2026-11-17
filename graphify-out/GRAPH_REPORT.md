# Graph Report - khodroyab  (2026-11-17)

## Corpus Check
- 390 files · ~218,497 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2707 nodes · 9205 edges · 99 communities (91 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eba6a66a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- CarOffersView.tsx
- admin-buy-ads.ts
- AdsManager.tsx
- server-only
- Toast
- AdminVerificationForm.tsx
- Admin authentication flow
- cars/actions.ts
- ThemeSwitch.tsx
- colors/actions.ts
- car-types/actions.ts
- panel-search.ts
- car-form/actions.ts
- panel-search-shared.ts
- panel/auth-actions.ts
- PurchaseRequestDetailManager.tsx
- isTrustedOrigin
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- buy-ads-shared.ts
- validation/car-types.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- search/page.tsx
- SaleAdFormModal.tsx
- price-table-shared.ts
- PriceListBrowser.tsx
- sale-ads/actions.ts
- (panel)/price-table/actions.ts
- price-list.ts
- removeUpload
- PanelShell.tsx
- prisma.ts
- ContactView.tsx
- session.ts
- validation/user-cars.ts
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- brands/actions.ts
- [audience]/page.tsx
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- team/actions.ts
- BranchFormModal.tsx
- (app)/page.tsx
- dependencies
- scripts
- UrlFilterBar.tsx
- cn
- lib/price-table.ts
- rich-text.ts
- SystemSettingsForm
- proxy.ts
- adminActionDenied
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- uploads.ts
- user-codes.ts
- hash-user-passwords.mjs
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- [...path]/route.ts
- UPLOAD_DIR env
- BranchesMap.tsx
- [id]/route.ts
- formatPersianNumber
- purchase-requests-shared.ts
- validation/purchase-requests.ts
- ConfirmDialog
- normalizeDigits
- verification-submission.ts
- next
- react
- VerificationManager.tsx
- users/actions.ts
- AdKindTabs.tsx
- tailwindcss
- lib/purchase-requests.ts
- SaleAdsManager.tsx
- AdminShell.tsx
- verification-actions.ts
- toPersianDigits
- AdPriceHistory.tsx
- requests/page.tsx
- users/[id]/page.tsx
- AdminVerificationForm
- lib/buy-ads.ts
- CarImagesManager.tsx
- purchase-requests/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 330 edges
2. `toPersianDigits()` - 276 edges
3. `react` - 223 edges
4. `next` - 166 edges
5. `lucide-react` - 160 edges
6. `formatPersianNumber()` - 85 edges
7. `prisma` - 74 edges
8. `isTrustedOrigin()` - 65 edges
9. `requireAdminAccess()` - 55 edges
10. `Toast()` - 54 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (project-local)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `Persian RTL admin panel` --conceptually_related_to--> `Vazirmatn Persian font`  [INFERRED]
  README.md → src/fonts/Vazirmatn-OFL.txt
- `AdminBrandsPage()` --indirect_call--> `brandToRecord()`  [INFERRED]
  src/app/admin/(panel)/brands/page.tsx → src/lib/brands.ts
- `AdminCarFormPage()` --indirect_call--> `optionToRecord()`  [INFERRED]
  src/app/admin/(panel)/car-form/page.tsx → src/lib/options.ts
- `CarImagesPage()` --indirect_call--> `carVideoToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/[id]/images/page.tsx → src/lib/car-images.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (99 total, 8 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.07
Nodes (62): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+54 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.07
Nodes (43): ProfileActionResult, revalidateProfilePages(), updateProfileAction(), PlateGlyph(), PriceMarketIcon(), CollaboratorShortcuts(), CollaboratorShortcutsProps, Pill() (+35 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.16
Nodes (24): revalidateVerificationPages(), reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview() (+16 more)

### Community 3 - "CarOffersView.tsx"
Cohesion: 0.13
Nodes (22): loadPurchaseRequestLocationsAction(), compareDigits(), PriceOrder, sortOffers(), sortValue(), ColorLabel(), ColumnHeading(), SellerCodeHint() (+14 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.05
Nodes (77): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+69 more)

### Community 5 - "AdsManager.tsx"
Cohesion: 0.12
Nodes (32): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, PageLink(), AdsTable() (+24 more)

### Community 6 - "server-only"
Cohesion: 0.10
Nodes (41): @prisma/client, server-only, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single() (+33 more)

### Community 7 - "Toast"
Cohesion: 0.05
Nodes (83): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+75 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.18
Nodes (15): DocDraft, IdentityDraft, PERSON_TYPE_ICONS, ALLOWED_IMAGE_MIME_TYPES, VERIFICATION_DOC_HINTS, VERIFICATION_DOC_MAX_BYTES, VERIFICATION_DOC_MAX_COUNT, VERIFICATION_DOC_TITLE_MAX (+7 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "cars/actions.ts"
Cohesion: 0.18
Nodes (22): CarActionResult, CarSimpleActionResult, createCarAction(), deleteCarAction(), getCarDescriptionAction(), guardRequest(), isPrismaCode(), STALE_RELATION_RESULT (+14 more)

### Community 11 - "ThemeSwitch.tsx"
Cohesion: 0.24
Nodes (12): PanelSectionLayout(), viewport, PanelShellProps, applyTheme(), ThemeSwitch(), ThemeSwitchProps, isPanelTheme(), PANEL_THEME_COOKIE (+4 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.13
Nodes (26): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+18 more)

### Community 13 - "car-types/actions.ts"
Cohesion: 0.14
Nodes (28): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), AdminCarTypesPage() (+20 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.16
Nodes (23): adDetailInclude, AdViewer, buildOrderBy(), buildWhere(), faDate, faShortDate, faTime, getAdDetail() (+15 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.19
Nodes (19): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+11 more)

### Community 16 - "panel-search-shared.ts"
Cohesion: 0.18
Nodes (14): PriceHistoryChartProps, DEFAULTS, SearchFiltersProps, SORTS, AdDetailSaleTerm, SEARCH_SORT_LABELS, SEARCH_SORTS, SearchAdSaleTerm (+6 more)

### Community 17 - "panel/auth-actions.ts"
Cohesion: 0.14
Nodes (25): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), getClientIp(), logoutUserAction(), minutes(), requestOtpAction() (+17 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.15
Nodes (21): AdminPurchaseRequestPage(), dynamic, metadata, PageProps, CardTitle(), CodeChip(), groupCode(), PersonFlags() (+13 more)

### Community 19 - "isTrustedOrigin"
Cohesion: 0.13
Nodes (27): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+19 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.11
Nodes (30): ContactField, ContactValues, SettingsProvinceOption, SystemSettingsFormProps, applyCoordsText(), PRICE_TABLE_PRICE_FIELDS, parseActiveProvinceIds(), parseEnabledPriceFields() (+22 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.11
Nodes (31): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+23 more)

### Community 22 - "buy-ads-shared.ts"
Cohesion: 0.12
Nodes (24): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS (+16 more)

### Community 23 - "validation/car-types.ts"
Cohesion: 0.19
Nodes (12): carTypeCoreSchema, CarTypeFormValues, fallbackSlug(), ParsedCarTypeForm, ParsedCarTypeFormFailure, ParsedCarTypeFormSuccess, resolveSlug(), slugify() (+4 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.19
Nodes (18): BuyAdActionResult, BuyAdOffersResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages() (+10 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.12
Nodes (29): dynamic, GET(), findBiddableAd(), offersFailure(), submitBuyAdOfferAction(), withdrawBuyAdOfferAction(), BuyAdOffersPanel(), handleResult() (+21 more)

### Community 27 - "search/page.tsx"
Cohesion: 0.24
Nodes (10): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), SearchFilters() (+2 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.07
Nodes (43): normalize(), SearchableSelect(), commit(), onSearchKeyDown(), SearchableSelectOption, SearchableSelectProps, FieldError(), inputClassName() (+35 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (25): DEFAULT_PRICE_TABLE_CURRENCY, countPriceListSellers(), getPriceListMarketStats(), mergeDisabledPrices(), comparePriceColumns(), digitsOnly(), PRICE_TABLE_ALL_PRICE_KEYS, PRICE_TABLE_EMPTY (+17 more)

### Community 30 - "PriceListBrowser.tsx"
Cohesion: 0.27
Nodes (8): HorizontalScroller(), carHref(), hasAnyPrice(), PriceListBrowser(), openRow(), PriceListBrowserProps, PriceListRow, DEFAULT_PRICE_MARKET

### Community 31 - "sale-ads/actions.ts"
Cohesion: 0.08
Nodes (61): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+53 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.23
Nodes (14): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), AdminPriceTablePage() (+6 more)

### Community 33 - "price-list.ts"
Cohesion: 0.16
Nodes (27): generateMetadata(), CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), groupByColumn(), jalaliDate (+19 more)

### Community 34 - "removeUpload"
Cohesion: 0.24
Nodes (15): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+7 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.11
Nodes (21): PanelAppLayout(), ConsultationFab(), ConsultationFabProps, DollarTicker(), activeDockKey(), PAGE_TITLES, PANEL_NAV_ITEMS, PanelNavItem (+13 more)

### Community 36 - "prisma.ts"
Cohesion: 0.08
Nodes (35): AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic, metadata, AdminCarFormPage(), dynamic (+27 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (26): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+18 more)

### Community 38 - "session.ts"
Cohesion: 0.15
Nodes (22): jose, authenticateAdmin(), ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload (+14 more)

### Community 39 - "validation/user-cars.ts"
Cohesion: 0.15
Nodes (17): BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS, MILEAGE_MAX, PRICE_CURRENCIES, isValidTierYear(), normalizeYear(), BuyAdInput, buyAdSchema (+9 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.13
Nodes (34): dynamic, PageProps, PriceListCarPage(), dynamic, metadata, PageProps, PanelPriceListPage(), StatTile() (+26 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.11
Nodes (39): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+31 more)

### Community 42 - "brands/actions.ts"
Cohesion: 0.10
Nodes (36): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+28 more)

### Community 43 - "[audience]/page.tsx"
Cohesion: 0.15
Nodes (17): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), div(), jalaliToGregorian(), parseJalaliDate() (+9 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (12): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+4 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+9 more)

### Community 48 - "team/actions.ts"
Cohesion: 0.05
Nodes (66): createTeamMemberAction(), deleteTeamMemberAction(), guardRequest(), nextSortOrder(), parseId(), PHOTO_REQUIRED, reorderTeamMembersAction(), revalidateTeamPages() (+58 more)

### Community 49 - "BranchFormModal.tsx"
Cohesion: 0.08
Nodes (53): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+45 more)

### Community 50 - "(app)/page.tsx"
Cohesion: 0.11
Nodes (22): dynamic, metadata, metadata, PageProps, PanelLoginPage(), PanelLogo(), fieldClass(), FieldIcon() (+14 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+5 more)

### Community 53 - "UrlFilterBar.tsx"
Cohesion: 0.26
Nodes (11): buildQuery(), UrlFilterBar(), applyAdvanced(), clearAll(), handleQueryChange(), handleSubmit(), navigate(), removeFilter() (+3 more)

### Community 54 - "cn"
Cohesion: 0.16
Nodes (20): BranchesTable(), BrandsTable(), PriceTableCarsTable(), inputClassName(), SponsorsTable(), TeamTable(), Badge(), BadgeProps (+12 more)

### Community 55 - "lib/price-table.ts"
Cohesion: 0.09
Nodes (34): UserPriceTablePreviewProps, UserProfileProps, CurrencyToggleProps, CarOffersViewProps, Draft, MyPriceTableManagerProps, PriceTableMarketEditorProps, PriceCurrency (+26 more)

### Community 56 - "rich-text.ts"
Cohesion: 0.27
Nodes (9): sanitize-html, COLOR, CSS_SIZE, isRichTextEmpty(), normalizeRichText(), renderRichText(), RICH_TEXT_MAX_LENGTH, sanitizeRichText() (+1 more)

### Community 57 - "SystemSettingsForm"
Cohesion: 0.29
Nodes (11): ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm(), clearError(), handleSubmit(), setContactField() (+3 more)

### Community 58 - "proxy.ts"
Cohesion: 0.28
Nodes (8): isPublicPanelPath(), AREAS, config, isPassthrough(), PASSTHROUGH_PREFIXES, ProtectedArea, proxy(), redirectTo()

### Community 59 - "adminActionDenied"
Cohesion: 0.39
Nodes (6): saveSystemSettingsAction(), SystemSettingsActionResult, adminActionDenied(), saveSystemSettings(), applyRotationToActiveCodes(), parseSystemSettingsForm()

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.10
Nodes (26): dynamic, GET(), PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES, CurrencyRates(), CurrencyRatesProps (+18 more)

### Community 63 - "uploads.ts"
Cohesion: 0.18
Nodes (16): dynamic, fail(), POST(), RouteContext, runtime, carVideoToRecord(), EXTENSION_TO_MIME, sanitizeBaseName() (+8 more)

### Community 64 - "user-codes.ts"
Cohesion: 0.10
Nodes (26): dynamic, faTime, metadata, PanelProfilePage(), generateMetadata(), generateMetadata(), dynamic, metadata (+18 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "[...path]/route.ts"
Cohesion: 0.13
Nodes (17): assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main(), buildHeaders() (+9 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.20
Nodes (21): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+13 more)

### Community 73 - "[id]/route.ts"
Cohesion: 0.21
Nodes (10): AdminForbiddenPage(), dynamic, metadata, dynamic, GET(), notFound(), RouteContext, runtime (+2 more)

### Community 74 - "formatPersianNumber"
Cohesion: 0.08
Nodes (47): AdminDashboardPage(), dynamic, greetingFor(), metadata, AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep() (+39 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.14
Nodes (27): Chip(), jalaliDay, PERIODS, PurchaseRequestsFilters(), apply(), applyPeriod(), PurchaseRequestsFiltersProps, Segmented() (+19 more)

### Community 79 - "validation/purchase-requests.ts"
Cohesion: 0.17
Nodes (12): PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX, PURCHASE_REQUEST_NOTE_MAX, adminNoteSchema, descriptionSchema, field(), guestSchema, ParsedPurchaseRequestForm (+4 more)

### Community 80 - "ConfirmDialog"
Cohesion: 0.32
Nodes (5): ConfirmDialog(), ConfirmDialogProps, Modal(), ModalProps, SIZE_CLASSES

### Community 81 - "normalizeDigits"
Cohesion: 0.08
Nodes (31): zod, PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, normalizeDigits(), normalizePhone(), MAX_IMAGE_SIZE_BYTES, optionCoreSchema (+23 more)

### Community 82 - "verification-submission.ts"
Cohesion: 0.11
Nodes (16): SubmitVerificationResult, MIME_TO_EXTENSION, isValidCompanyNationalId(), removeVerificationFiles(), resolveVerificationFile(), saveVerificationFile(), VERIFICATION_ROOT, isVerificationPersonType() (+8 more)

### Community 84 - "next"
Cohesion: 0.10
Nodes (33): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+25 more)

### Community 85 - "react"
Cohesion: 0.06
Nodes (35): lucide-react, react, react-dom, dynamic, PageProps, SellerProfilePage(), ModalState, Filter (+27 more)

### Community 86 - "VerificationManager.tsx"
Cohesion: 0.16
Nodes (19): submitVerificationAction(), dynamic, metadata, PanelVerificationPage(), DocDraft, FieldError(), IdentityDraft, identityDraftFrom() (+11 more)

### Community 87 - "users/actions.ts"
Cohesion: 0.20
Nodes (20): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+12 more)

### Community 88 - "AdKindTabs.tsx"
Cohesion: 0.24
Nodes (10): framer-motion, dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps, kindFor(), TABS (+2 more)

### Community 91 - "lib/purchase-requests.ts"
Cohesion: 0.12
Nodes (24): ADMIN_PURCHASE_REQUEST_PAGE_SIZE, AdminPurchaseRequestPage, carLabelOf(), createPurchaseRequest(), CreatePurchaseRequestResult, faDateTime, getAdminPurchaseRequestDetail(), PersonRow (+16 more)

### Community 92 - "SaleAdsManager.tsx"
Cohesion: 0.11
Nodes (25): CarsTableProps, ColorsTableProps, inputClassName(), ItemDraft, OptionFormModalProps, ModalState, OptionsManagerProps, OptionsTable() (+17 more)

### Community 95 - "AdminShell.tsx"
Cohesion: 0.09
Nodes (31): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminPanelLayout(), ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavBadges, AdminNavGroup (+23 more)

### Community 97 - "verification-actions.ts"
Cohesion: 0.17
Nodes (12): AdminSubmitVerificationResult, ReviewVerificationResult, AdminVerificationFormProps, UserVerificationSectionProps, VerificationManagerProps, faDateTime, VERIFICATION_REJECT_REASON_MAX, verificationDocumentUrl() (+4 more)

### Community 98 - "toPersianDigits"
Cohesion: 0.08
Nodes (54): AdDetailPage(), dynamic, metadata, ColorsTable(), ColorSwatch(), ColorSwatchProps, AdDetailView(), AdDetailViewProps (+46 more)

### Community 99 - "AdPriceHistory.tsx"
Cohesion: 0.36
Nodes (6): AdPriceHistory(), percent(), PriceHistoryPanel(), formatCompact(), PAD, PriceHistoryChart()

### Community 101 - "requests/page.tsx"
Cohesion: 0.25
Nodes (5): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES

### Community 103 - "users/[id]/page.tsx"
Cohesion: 0.18
Nodes (13): AdminUserProfilePage(), dynamic, metadata, PageProps, AdminUsersPage(), dynamic, metadata, USER_DIRECTORY_ACCESS (+5 more)

### Community 104 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 105 - "lib/buy-ads.ts"
Cohesion: 0.15
Nodes (19): BuyAdDetailPage(), dynamic, metadata, buildOrderBy(), buildWhere(), BUY_AD_PAGE_SIZE, buyAdDetailInclude, BuyAdRow (+11 more)

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.13
Nodes (28): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesPage(), CarImagesManager() (+20 more)

### Community 107 - "purchase-requests/actions.ts"
Cohesion: 0.19
Nodes (14): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), buildPageList(), PageLink(), PurchaseRequestsManager(), changeStatus() (+6 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 746 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarOffersView.tsx`, `admin-buy-ads.ts`, `AdsManager.tsx`, `Toast`, `AdminVerificationForm.tsx`, `cars/actions.ts`, `colors/actions.ts`, `car-types/actions.ts`, `car-form/actions.ts`, `panel-search-shared.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `isTrustedOrigin`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `buy-ads-shared.ts`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `PriceListBrowser.tsx`, `sale-ads/actions.ts`, `(panel)/price-table/actions.ts`, `removeUpload`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `validation/user-cars.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `team/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `UrlFilterBar.tsx`, `cn`, `lib/price-table.ts`, `SystemSettingsForm`, `market-rates.ts`, `user-codes.ts`, `formatPersianNumber`, `purchase-requests-shared.ts`, `verification-submission.ts`, `next`, `react`, `VerificationManager.tsx`, `users/actions.ts`, `AdKindTabs.tsx`, `SaleAdsManager.tsx`, `AdminShell.tsx`, `verification-actions.ts`, `AdPriceHistory.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `CarImagesManager.tsx`, `purchase-requests/actions.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07330618289522399 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarOffersView.tsx`, `admin-buy-ads.ts`, `AdsManager.tsx`, `Toast`, `AdminVerificationForm.tsx`, `cars/actions.ts`, `ThemeSwitch.tsx`, `colors/actions.ts`, `car-types/actions.ts`, `PurchaseRequestDetailManager.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `buy-ads-shared.ts`, `BuyAdOffersPanel.tsx`, `SaleAdFormModal.tsx`, `PriceListBrowser.tsx`, `sale-ads/actions.ts`, `(panel)/price-table/actions.ts`, `removeUpload`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `team/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `UrlFilterBar.tsx`, `SystemSettingsForm`, `RichTextEditor.tsx`, `market-rates.ts`, `user-codes.ts`, `BranchesMap.tsx`, `formatPersianNumber`, `purchase-requests-shared.ts`, `ConfirmDialog`, `next`, `react`, `VerificationManager.tsx`, `users/actions.ts`, `AdKindTabs.tsx`, `SaleAdsManager.tsx`, `AdminShell.tsx`, `toPersianDigits`, `AdPriceHistory.tsx`, `requests/page.tsx`, `AdminVerificationForm`, `CarImagesManager.tsx`, `purchase-requests/actions.ts`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CarOffersView.tsx`, `admin-buy-ads.ts`, `AdsManager.tsx`, `server-only`, `Toast`, `cars/actions.ts`, `ThemeSwitch.tsx`, `colors/actions.ts`, `car-types/actions.ts`, `car-form/actions.ts`, `panel/auth-actions.ts`, `PurchaseRequestDetailManager.tsx`, `isTrustedOrigin`, `buy-ads-shared.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `search/page.tsx`, `SaleAdFormModal.tsx`, `PriceListBrowser.tsx`, `sale-ads/actions.ts`, `(panel)/price-table/actions.ts`, `removeUpload`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `session.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `[audience]/page.tsx`, `package.json`, `team/actions.ts`, `BranchFormModal.tsx`, `(app)/page.tsx`, `UrlFilterBar.tsx`, `proxy.ts`, `adminActionDenied`, `market-rates.ts`, `uploads.ts`, `user-codes.ts`, `[...path]/route.ts`, `[id]/route.ts`, `formatPersianNumber`, `purchase-requests-shared.ts`, `verification-submission.ts`, `react`, `VerificationManager.tsx`, `users/actions.ts`, `AdKindTabs.tsx`, `SaleAdsManager.tsx`, `AdminShell.tsx`, `verification-actions.ts`, `toPersianDigits`, `requests/page.tsx`, `users/[id]/page.tsx`, `lib/buy-ads.ts`, `CarImagesManager.tsx`, `purchase-requests/actions.ts`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._