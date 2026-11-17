# Graph Report - khodroyab  (2026-11-17)

## Corpus Check
- 390 files · ~218,380 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2708 nodes · 9209 edges · 114 communities (107 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2eff817`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- BrandFormModal.tsx
- admin-buy-ads.ts
- lib/user-cars.ts
- server-only
- AdminsManager.tsx
- AdminVerificationForm.tsx
- Admin authentication flow
- contact/page.tsx
- BuyAdDetailView.tsx
- colors/actions.ts
- cars/actions.ts
- panel-search.ts
- car-form/actions.ts
- validation/brands.ts
- isTrustedOrigin
- PurchaseRequestDetailManager.tsx
- lib/price-table.ts
- lib/system-settings.ts
- MyPriceTableManager.tsx
- lib/buy-ads.ts
- admin/auth-actions.ts
- buy/actions.ts
- app/layout.tsx
- BuyAdOffersPanel.tsx
- BuyAdDetailManager.tsx
- MyAdForm.tsx
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
- buy-ads-shared.ts
- price-list/[carId]/page.tsx
- sponsors/actions.ts
- brands/actions.ts
- [audience]/page.tsx
- otp.ts
- compilerOptions
- Luxury Performance Car Branding
- package.json
- team/actions.ts
- branches/actions.ts
- UserAuthCard.tsx
- dependencies
- scripts
- cn
- utils.ts
- (app)/price-list/page.tsx
- admins/actions.ts
- getSystemSettings
- SellerHeader.tsx
- SubscriptionPlansManager
- RichTextEditor.tsx
- devDependencies
- market-rates.ts
- uploads.ts
- users/[id]/page.tsx
- roles/actions.ts
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- [id]/route.ts
- UPLOAD_DIR env
- BranchesMap.tsx
- admin/page.tsx
- formatPersianNumber
- BuyAdsFilters.tsx
- purchase-requests-shared.ts
- lib/admins.ts
- validation/purchase-requests.ts
- Modal
- normalizeDigits
- verification-submission.ts
- BranchFormModal.tsx
- next
- react
- VerificationManager.tsx
- users/actions.ts
- AdKindTabs.tsx
- SaleAdsManager.tsx
- tailwindcss
- lib/purchase-requests.ts
- SaleAdFormModal.tsx
- AttentionList.tsx
- dashboard.ts
- AdminShell.tsx
- validation/subscriptions.ts
- adminActionDenied
- currency.ts
- AdPriceHistory.tsx
- validation/branches.ts
- requests/page.tsx
- AdsManager
- permissions.ts
- AdminVerificationForm
- buy/[id]/page.tsx
- CarImagesManager.tsx
- toPersianDigits
- StatTile.tsx
- AdsTrendChart.tsx
- [...path]/route.ts
- parseAdminPurchaseRequestFilters
- [audience]/[id]/page.tsx
- VerificationRecord

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
- `AdminAdminsPage()` --indirect_call--> `adminToRecord()`  [INFERRED]
  src/app/admin/(panel)/admins/page.tsx → src/lib/admins.ts
- `AdminAllAdsPage()` --indirect_call--> `userCarToRecord()`  [INFERRED]
  src/app/admin/(panel)/ads/page.tsx → src/lib/user-cars.ts
- `AdminCarsPage()` --indirect_call--> `carTypeToRecord()`  [INFERRED]
  src/app/admin/(panel)/cars/page.tsx → src/lib/car-types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin auth defense-in-depth layers** — readme_requireadmin, readme_middleware, readme_rate_limit, readme_origin_check, readme_generic_login_error [EXTRACTED 1.00]
- **Prisma/MySQL data layer** — readme_prisma_schema, readme_init_migration, readme_seed, readme_prisma_singleton, readme_mysql [INFERRED 0.85]

## Communities (114 total, 7 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.16
Nodes (22): grantUserSubscriptionAction(), SubscriptionPlanActionResult, SubscriptionSimpleActionResult, UserSubscriptionActionResult, handleSubmit(), GrantSubscriptionModalProps, GrantSuccess, SubscriptionBadgeProps (+14 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.06
Nodes (51): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+43 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.14
Nodes (25): CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview(), ContactChip(), daysSince() (+17 more)

### Community 3 - "BrandFormModal.tsx"
Cohesion: 0.18
Nodes (12): BrandFormModalProps, inputClassName(), BrandsManagerProps, BrandsTableProps, CarTypeFormModalProps, CarTypesManagerProps, CarTypesTable(), CarTypesTableProps (+4 more)

### Community 4 - "admin-buy-ads.ts"
Cohesion: 0.10
Nodes (29): AdminBuyAdDetailPage(), dynamic, metadata, PageProps, AdminBuyAdsPage(), dynamic, metadata, PageProps (+21 more)

### Community 5 - "lib/user-cars.ts"
Cohesion: 0.14
Nodes (27): AdsTable(), AdsTableProps, AdStatusBadge(), AdStatusBadgeProps, STYLES, lowestPrice(), SaleAdsTable(), SaleAdsTableProps (+19 more)

### Community 6 - "server-only"
Cohesion: 0.11
Nodes (35): @prisma/client, server-only, AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single() (+27 more)

### Community 7 - "AdminsManager.tsx"
Cohesion: 0.13
Nodes (24): AdminFormModal(), AdminFormModalProps, FieldError(), inputClassName(), AdminsManager(), AdminsManagerProps, faDate, initials() (+16 more)

### Community 8 - "AdminVerificationForm.tsx"
Cohesion: 0.18
Nodes (15): DocDraft, IdentityDraft, PERSON_TYPE_ICONS, ALLOWED_IMAGE_MIME_TYPES, VERIFICATION_DOC_HINTS, VERIFICATION_DOC_MAX_BYTES, VERIFICATION_DOC_MAX_COUNT, VERIFICATION_DOC_TITLE_MAX (+7 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "contact/page.tsx"
Cohesion: 0.14
Nodes (18): metadata, PageProps, PanelContactPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES (+10 more)

### Community 11 - "BuyAdDetailView.tsx"
Cohesion: 0.12
Nodes (29): BuyAdNoImage(), BuyRequestBadge(), BuySpecTiles(), BuySpecTilesProps, BuyAdCard(), BuyAdCardProps, BuyAdDetailView(), BuyAdDetailViewProps (+21 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.15
Nodes (21): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+13 more)

### Community 13 - "cars/actions.ts"
Cohesion: 0.05
Nodes (63): sanitize-html, CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction() (+55 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.06
Nodes (59): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), DEFAULTS (+51 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.23
Nodes (18): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+10 more)

### Community 16 - "validation/brands.ts"
Cohesion: 0.13
Nodes (13): brandCoreSchema, BrandFormValues, fallbackSlug(), MAX_IMAGE_SIZE_BYTES, ParsedBrandForm, ParsedBrandFormFailure, ParsedBrandFormSuccess, resolveSlug() (+5 more)

### Community 17 - "isTrustedOrigin"
Cohesion: 0.14
Nodes (26): getClientIp(), logoutUserAction(), minutes(), requestOtpAction(), RequestOtpActionResult, verifyOtpAction(), VerifyOtpActionResult, clientIp() (+18 more)

### Community 18 - "PurchaseRequestDetailManager.tsx"
Cohesion: 0.20
Nodes (18): PurchaseRequestActionResult, revalidateRequests(), savePurchaseRequestNoteAction(), setPurchaseRequestStatusAction(), CardTitle(), CodeChip(), groupCode(), PersonFlags() (+10 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.11
Nodes (33): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+25 more)

### Community 20 - "lib/system-settings.ts"
Cohesion: 0.15
Nodes (24): SystemSettingsFormProps, parseActiveProvinceIds(), parseEnabledPriceFields(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH, MAX_AD_PAGE_NOTICE_LENGTH (+16 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.10
Nodes (32): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+24 more)

### Community 22 - "lib/buy-ads.ts"
Cohesion: 0.08
Nodes (37): BuyAdsSearchPage(), dynamic, metadata, SearchParams, BuyAdFilters(), dateFormatter, LiveClock(), LiveClockProps (+29 more)

### Community 23 - "admin/auth-actions.ts"
Cohesion: 0.24
Nodes (12): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), authenticateAdmin(), consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+4 more)

### Community 24 - "buy/actions.ts"
Cohesion: 0.17
Nodes (23): dynamic, GET(), BuyAdActionResult, BuyAdSimpleResult, createBuyAdAction(), deleteBuyAdAction(), findBiddableAd(), guardRequest() (+15 more)

### Community 25 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): jetbrainsMono, metadata, vazirmatn

### Community 26 - "BuyAdOffersPanel.tsx"
Cohesion: 0.16
Nodes (21): BuyAdOffersResult, BestOfferHero(), BuyAdOffersPanel(), handleResult(), submitOffer(), toggleBidding(), withdraw(), cleanDigits() (+13 more)

### Community 27 - "BuyAdDetailManager.tsx"
Cohesion: 0.15
Nodes (29): AdminBuyAdActionResult, deleteAdminBuyAdAction(), deleteAdminBuyAdOfferAction(), guardRequest(), parseBigInt(), revalidateBuyAdPages(), setAdminBuyAdActiveAction(), setAdminBuyAdBiddingAction() (+21 more)

### Community 28 - "MyAdForm.tsx"
Cohesion: 0.12
Nodes (19): AdExtraFieldsProps, AdFieldTheme, AdImagesField(), AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES (+11 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (26): DEFAULT_PRICE_TABLE_CURRENCY, PRICE_CURRENCIES, countPriceListSellers(), ALL_PRICE_FIELD_KEYS, comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), PRICE_TABLE_ALL_PRICE_KEYS (+18 more)

### Community 30 - "PriceListBrowser.tsx"
Cohesion: 0.21
Nodes (10): Edges, HorizontalScroller(), HorizontalScrollerProps, carHref(), hasAnyPrice(), PriceListBrowser(), openRow(), PriceListBrowserProps (+2 more)

### Community 31 - "sale-ads/actions.ts"
Cohesion: 0.11
Nodes (50): createUserCarAction(), deleteUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction() (+42 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.46
Nodes (7): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction()

### Community 33 - "price-list.ts"
Cohesion: 0.11
Nodes (38): generateMetadata(), CarOffersViewProps, Draft, PriceCurrency, CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers() (+30 more)

### Community 34 - "removeUpload"
Cohesion: 0.35
Nodes (11): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+3 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.08
Nodes (35): metadata, PageProps, PanelLoginPage(), PanelSectionLayout(), viewport, DollarTicker(), activeDockKey(), PAGE_TITLES (+27 more)

### Community 36 - "prisma.ts"
Cohesion: 0.11
Nodes (23): AdminPendingAdsPage(), dynamic, metadata, AdminColorsPage(), dynamic, metadata, AdminPurchaseRequestsIndex(), AdminSaleTermsPage() (+15 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.13
Nodes (25): BranchMapPoint, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout(), base, IconProps (+17 more)

### Community 38 - "session.ts"
Cohesion: 0.18
Nodes (18): jose, ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, getSessionTtlSeconds(), PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, AdminSessionPayload, audienceMatches() (+10 more)

### Community 39 - "buy-ads-shared.ts"
Cohesion: 0.15
Nodes (17): BuyAdFiltersProps, MILEAGE_OPTIONS, SORTS, BUY_AD_DESCRIPTION_MAX, BUY_AD_FILTER_DEFAULTS, BUY_AD_MILEAGE_STEPS, BUY_AD_OFFER_MAX_DIGITS, BUY_AD_OFFER_POLL_MS (+9 more)

### Community 40 - "price-list/[carId]/page.tsx"
Cohesion: 0.13
Nodes (35): dynamic, PageProps, PriceListCarPage(), dynamic, generateMetadata(), PageProps, SellerProfilePage(), dynamic (+27 more)

### Community 41 - "sponsors/actions.ts"
Cohesion: 0.21
Nodes (23): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+15 more)

### Community 42 - "brands/actions.ts"
Cohesion: 0.12
Nodes (27): BrandActionResult, BrandSimpleActionResult, createBrandAction(), deleteBrandAction(), guardRequest(), isPrismaCode(), toggleBrandActiveAction(), updateBrandAction() (+19 more)

### Community 43 - "[audience]/page.tsx"
Cohesion: 0.20
Nodes (12): AdminPurchaseRequestsPage(), dynamic, generateMetadata(), PageProps, toAudience(), audienceWhere(), buildOrderBy(), buildWhere() (+4 more)

### Community 44 - "otp.ts"
Cohesion: 0.19
Nodes (11): deliverOtpSms(), generateOtpCode(), hashOtp(), OTP_IS_PLACEHOLDER, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS, OTP_TTL_SECONDS (+3 more)

### Community 45 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, version, autoprefixer, clsx, postcss (+9 more)

### Community 48 - "team/actions.ts"
Cohesion: 0.12
Nodes (34): createTeamMemberAction(), deleteTeamMemberAction(), guardRequest(), nextSortOrder(), parseId(), PHOTO_REQUIRED, reorderTeamMembersAction(), revalidateTeamPages() (+26 more)

### Community 49 - "branches/actions.ts"
Cohesion: 0.12
Nodes (34): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+26 more)

### Community 50 - "UserAuthCard.tsx"
Cohesion: 0.10
Nodes (22): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+14 more)

### Community 51 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+15 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "cn"
Cohesion: 0.09
Nodes (25): PageLink(), ColorFormModal(), inputClassName(), ContactField, ContactInput(), ContactValues, inputClassName(), SettingsProvinceOption (+17 more)

### Community 54 - "utils.ts"
Cohesion: 0.13
Nodes (22): BrandsTable(), BuyAdsTable(), OptionsTable(), typeLabel(), PriceTableCarsTable(), SaleTermsTable(), inputClassName(), SponsorFormModal() (+14 more)

### Community 55 - "(app)/price-list/page.tsx"
Cohesion: 0.12
Nodes (28): dynamic, metadata, PageProps, PanelPriceListPage(), StatTile(), UserPriceTablePreviewProps, UserProfileProps, PriceMarketTabs() (+20 more)

### Community 56 - "admins/actions.ts"
Cohesion: 0.23
Nodes (20): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+12 more)

### Community 57 - "getSystemSettings"
Cohesion: 0.13
Nodes (21): saveSystemSettingsAction(), SystemSettingsActionResult, AdminSettingsPage(), dynamic, metadata, PanelAppLayout(), pickContact(), SettingCard() (+13 more)

### Community 58 - "SellerHeader.tsx"
Cohesion: 0.33
Nodes (8): groupSellerCode(), hueOf(), sellerInitials(), SellerMonogram(), SellerHeaderProps, asciiDigits(), DirectorySeller, SellersDirectory()

### Community 59 - "SubscriptionPlansManager"
Cohesion: 0.29
Nodes (15): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), toggleSubscriptionPlanActiveAction(), updateSubscriptionPlanAction() (+7 more)

### Community 60 - "RichTextEditor.tsx"
Cohesion: 0.13
Nodes (15): @tiptap/extension-highlight, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extensions, @tiptap/react, @tiptap/starter-kit, ColorMenu() (+7 more)

### Community 61 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+2 more)

### Community 62 - "market-rates.ts"
Cohesion: 0.10
Nodes (28): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES (+20 more)

### Community 63 - "uploads.ts"
Cohesion: 0.21
Nodes (14): dynamic, fail(), POST(), RouteContext, runtime, sanitizeBaseName(), saveVideoStream(), sniffVideoContainer() (+6 more)

### Community 64 - "users/[id]/page.tsx"
Cohesion: 0.12
Nodes (21): AdminUserProfilePage(), dynamic, metadata, PageProps, dynamic, metadata, PanelSellersPage(), PUBLIC_AD_WHERE (+13 more)

### Community 65 - "roles/actions.ts"
Cohesion: 0.17
Nodes (19): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+11 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 69 - "[id]/route.ts"
Cohesion: 0.09
Nodes (20): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+12 more)

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.18
Nodes (23): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+15 more)

### Community 73 - "admin/page.tsx"
Cohesion: 0.21
Nodes (10): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminForbiddenPage(), dynamic, metadata, LoginForm(), handleSubmit() (+2 more)

### Community 74 - "formatPersianNumber"
Cohesion: 0.17
Nodes (22): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), CatalogOverview(), DashboardCard(), DashboardCardProps (+14 more)

### Community 76 - "BuyAdsFilters.tsx"
Cohesion: 0.21
Nodes (16): BuyAdsFiltersProps, BuyAdsManagerProps, BuyAdsTableProps, AdminBuyAdListResult, ADMIN_BUY_AD_FILTER_DEFAULTS, ADMIN_BUY_AD_PARAM_KEYS, ADMIN_BUY_AD_SORT_LABELS, ADMIN_BUY_AD_SORTS (+8 more)

### Community 77 - "purchase-requests-shared.ts"
Cohesion: 0.18
Nodes (20): jalaliDay, PERIODS, PurchaseRequestsFiltersProps, PurchaseRequestsManagerProps, ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, ADMIN_PURCHASE_REQUEST_PARAM_KEYS, ADMIN_PURCHASE_REQUEST_SORT_LABELS, ADMIN_PURCHASE_REQUEST_SORTS (+12 more)

### Community 78 - "lib/admins.ts"
Cohesion: 0.18
Nodes (14): AdminAdminsPage(), dynamic, metadata, AdminRolesPage(), dynamic, metadata, ADMIN_ORDER_BY, adminRecordSelect (+6 more)

### Community 79 - "validation/purchase-requests.ts"
Cohesion: 0.17
Nodes (11): PURCHASE_REQUEST_DESCRIPTION_MAX, PURCHASE_REQUEST_NAME_MAX, PURCHASE_REQUEST_NOTE_MAX, adminNoteSchema, descriptionSchema, field(), guestSchema, ParsedPurchaseRequestForm (+3 more)

### Community 80 - "Modal"
Cohesion: 0.09
Nodes (20): react-dom, inputClassName(), ItemDraft, OptionFormModal(), inputClassName(), SaleTermFormModal(), SaleTermsManager(), handleDelete() (+12 more)

### Community 81 - "normalizeDigits"
Cohesion: 0.06
Nodes (38): zod, PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizeDigits(), normalizePhone(), optionCoreSchema (+30 more)

### Community 82 - "verification-submission.ts"
Cohesion: 0.15
Nodes (9): isValidCompanyNationalId(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission, parseVerificationForm(), ParseVerificationResult, readIdentity() (+1 more)

### Community 83 - "BranchFormModal.tsx"
Cohesion: 0.24
Nodes (12): BranchesManagerProps, ModalState, BranchesTable(), BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel() (+4 more)

### Community 84 - "next"
Cohesion: 0.08
Nodes (44): next, dynamic, EditBuyAdPage(), metadata, dynamic, metadata, NewBuyAdDetailsPage(), dynamic (+36 more)

### Community 85 - "react"
Cohesion: 0.11
Nodes (21): lucide-react, react, ModalState, ModalState, ModalState, CarsTable(), ModalState, ModalState (+13 more)

### Community 86 - "VerificationManager.tsx"
Cohesion: 0.20
Nodes (14): DocDraft, FieldError(), IdentityDraft, identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), PERSON_TYPE_ICONS (+6 more)

### Community 87 - "users/actions.ts"
Cohesion: 0.12
Nodes (31): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+23 more)

### Community 88 - "AdKindTabs.tsx"
Cohesion: 0.20
Nodes (12): framer-motion, dynamic, MyAdsTabsLayout(), dynamic, SearchTabsLayout(), AdKind, AdKindTabs(), AdKindTabsProps (+4 more)

### Community 89 - "SaleAdsManager.tsx"
Cohesion: 0.19
Nodes (10): FieldError(), inputClassName(), nextKey(), SaleAdFormModal(), addRow(), Filter, SaleAdsManager(), handleConfirmDelete() (+2 more)

### Community 91 - "lib/purchase-requests.ts"
Cohesion: 0.11
Nodes (25): PurchaseRequestDetailManagerProps, ADMIN_PURCHASE_REQUEST_PAGE_SIZE, AdminPurchaseRequestPage, carLabelOf(), CreatePurchaseRequestResult, faDateTime, getAdminPurchaseRequestDetail(), PersonRow (+17 more)

### Community 92 - "SaleAdFormModal.tsx"
Cohesion: 0.09
Nodes (36): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, AdsStatusCounts, CarsTableProps (+28 more)

### Community 93 - "AttentionList.tsx"
Cohesion: 0.24
Nodes (12): AdminShellUser, AttentionItem, AttentionListProps, Severity, CatalogItem, CatalogOverviewProps, PermissionChipsProps, AuthorizedAdmin (+4 more)

### Community 94 - "dashboard.ts"
Cohesion: 0.26
Nodes (11): RecentAdsProps, bucketByDay(), computeDelta(), DashboardRecentAd, dayKey(), faDate, faLongDate, faShortDate (+3 more)

### Community 95 - "AdminShell.tsx"
Cohesion: 0.20
Nodes (13): AdminPanelLayout(), AdminNavBadges, findActiveNavItem(), AdminLogo(), AdminLogoProps, AdminShell(), AdminShellProps, badgeFor() (+5 more)

### Community 96 - "validation/subscriptions.ts"
Cohesion: 0.29
Nodes (9): SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS, field(), firstErrors(), grantSubscriptionSchema, parseGrantSubscriptionForm(), parseSubscriptionPlanForm(), SubscriptionPlanInput (+1 more)

### Community 97 - "adminActionDenied"
Cohesion: 0.17
Nodes (15): AdminSubmitVerificationResult, revalidateVerificationPages(), reviewVerificationAction(), ReviewVerificationResult, submitVerificationAction(), SubmitVerificationResult, adminActionDenied(), faDateTime (+7 more)

### Community 98 - "currency.ts"
Cohesion: 0.08
Nodes (37): AdDetailPage(), dynamic, metadata, loadPurchaseRequestLocationsAction(), ColorsTable(), ColorsTableProps, ColorSwatch(), ColorSwatchProps (+29 more)

### Community 99 - "AdPriceHistory.tsx"
Cohesion: 0.29
Nodes (8): AdPriceHistory(), percent(), PriceHistoryPanel(), formatCompact(), PAD, PriceHistoryChart(), PriceHistoryChartProps, SearchPricePoint

### Community 100 - "validation/branches.ts"
Cohesion: 0.22
Nodes (10): asciiDigits(), BRANCH_ADDRESS_MAX_LENGTH, BRANCH_MANAGER_MAX_LENGTH, BRANCH_SORT_ORDER_MAX, BRANCH_TITLE_MAX_LENGTH, BranchFormValues, branchSchema, coordinate() (+2 more)

### Community 101 - "requests/page.tsx"
Cohesion: 0.24
Nodes (6): dynamic, metadata, MyPurchaseRequestsPage(), listMyPurchaseRequests(), PURCHASE_REQUEST_STATUS_TONES, purchaseRequestSourceLabel()

### Community 102 - "AdsManager"
Cohesion: 0.36
Nodes (8): AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList(), PageLink()

### Community 103 - "permissions.ts"
Cohesion: 0.24
Nodes (10): ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavGroup, AdminNavItem, AdminSubNavItem, getVisibleNavGroups(), AccessRequirement, AdminPermissionMeta (+2 more)

### Community 104 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 105 - "buy/[id]/page.tsx"
Cohesion: 0.28
Nodes (7): BuyAdDetailPage(), dynamic, metadata, dynamic, metadata, PanelVerificationPage(), requireUser()

### Community 106 - "CarImagesManager.tsx"
Cohesion: 0.11
Nodes (32): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), deleteCarVideoAction(), guardRequest(), CarImagesPage(), dynamic (+24 more)

### Community 107 - "toPersianDigits"
Cohesion: 0.08
Nodes (30): BuyAdsFilters(), Segmented(), PriceTableManager(), handleBulk(), handleToggle(), showToast(), Chip(), PurchaseRequestsFilters() (+22 more)

### Community 108 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 109 - "AdsTrendChart.tsx"
Cohesion: 0.36
Nodes (6): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), TrendPoint

### Community 110 - "[...path]/route.ts"
Cohesion: 0.29
Nodes (10): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), parseRange(), RouteContext (+2 more)

### Community 111 - "parseAdminPurchaseRequestFilters"
Cohesion: 0.38
Nodes (6): div(), jalaliToGregorian(), parseJalaliDate(), parseAdminPurchaseRequestFilters(), isAdminPurchaseRequestSort(), isPurchaseRequestSource()

### Community 112 - "[audience]/[id]/page.tsx"
Cohesion: 0.40
Nodes (4): AdminPurchaseRequestPage(), dynamic, metadata, PageProps

### Community 113 - "VerificationRecord"
Cohesion: 0.50
Nodes (4): AdminVerificationFormProps, UserVerificationSectionProps, VerificationManagerProps, VerificationRecord

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **30 isolated node(s):** `@tiptap/pm`, `prisma`, `@types/leaflet`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 745 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `BrandFormModal.tsx`, `lib/user-cars.ts`, `AdminsManager.tsx`, `AdminVerificationForm.tsx`, `BuyAdDetailView.tsx`, `colors/actions.ts`, `cars/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `isTrustedOrigin`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `BuyAdDetailManager.tsx`, `MyAdForm.tsx`, `price-table-shared.ts`, `PriceListBrowser.tsx`, `sale-ads/actions.ts`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `buy-ads-shared.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `team/actions.ts`, `branches/actions.ts`, `UserAuthCard.tsx`, `cn`, `utils.ts`, `(app)/price-list/page.tsx`, `getSystemSettings`, `SellerHeader.tsx`, `SubscriptionPlansManager`, `market-rates.ts`, `roles/actions.ts`, `formatPersianNumber`, `BuyAdsFilters.tsx`, `purchase-requests-shared.ts`, `Modal`, `normalizeDigits`, `verification-submission.ts`, `BranchFormModal.tsx`, `next`, `react`, `VerificationManager.tsx`, `users/actions.ts`, `AdKindTabs.tsx`, `SaleAdsManager.tsx`, `SaleAdFormModal.tsx`, `dashboard.ts`, `AdminShell.tsx`, `adminActionDenied`, `currency.ts`, `AdPriceHistory.tsx`, `requests/page.tsx`, `AdsManager`, `AdminVerificationForm`, `CarImagesManager.tsx`, `StatTile.tsx`, `AdsTrendChart.tsx`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **What connects `@tiptap/pm`, `prisma`, `@types/leaflet` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06448412698412699 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `BrandFormModal.tsx`, `lib/user-cars.ts`, `AdminsManager.tsx`, `AdminVerificationForm.tsx`, `contact/page.tsx`, `BuyAdDetailView.tsx`, `cars/actions.ts`, `panel-search.ts`, `PurchaseRequestDetailManager.tsx`, `MyPriceTableManager.tsx`, `lib/buy-ads.ts`, `buy/actions.ts`, `BuyAdOffersPanel.tsx`, `BuyAdDetailManager.tsx`, `MyAdForm.tsx`, `PriceListBrowser.tsx`, `PanelShell.tsx`, `ContactView.tsx`, `price-list/[carId]/page.tsx`, `brands/actions.ts`, `UserAuthCard.tsx`, `utils.ts`, `(app)/price-list/page.tsx`, `getSystemSettings`, `SellerHeader.tsx`, `RichTextEditor.tsx`, `market-rates.ts`, `BranchesMap.tsx`, `admin/page.tsx`, `formatPersianNumber`, `BuyAdsFilters.tsx`, `purchase-requests-shared.ts`, `Modal`, `BranchFormModal.tsx`, `next`, `react`, `VerificationManager.tsx`, `users/actions.ts`, `AdKindTabs.tsx`, `SaleAdsManager.tsx`, `SaleAdFormModal.tsx`, `AttentionList.tsx`, `AdminShell.tsx`, `currency.ts`, `AdPriceHistory.tsx`, `requests/page.tsx`, `AdsManager`, `AdminVerificationForm`, `CarImagesManager.tsx`, `toPersianDigits`, `StatTile.tsx`, `AdsTrendChart.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `UserProfile.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `admin-buy-ads.ts`, `lib/user-cars.ts`, `server-only`, `AdminsManager.tsx`, `contact/page.tsx`, `BuyAdDetailView.tsx`, `colors/actions.ts`, `cars/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `isTrustedOrigin`, `PurchaseRequestDetailManager.tsx`, `lib/price-table.ts`, `lib/buy-ads.ts`, `admin/auth-actions.ts`, `buy/actions.ts`, `app/layout.tsx`, `BuyAdOffersPanel.tsx`, `BuyAdDetailManager.tsx`, `MyAdForm.tsx`, `PriceListBrowser.tsx`, `sale-ads/actions.ts`, `(panel)/price-table/actions.ts`, `removeUpload`, `PanelShell.tsx`, `prisma.ts`, `ContactView.tsx`, `session.ts`, `price-list/[carId]/page.tsx`, `sponsors/actions.ts`, `brands/actions.ts`, `[audience]/page.tsx`, `package.json`, `team/actions.ts`, `branches/actions.ts`, `UserAuthCard.tsx`, `cn`, `utils.ts`, `(app)/price-list/page.tsx`, `admins/actions.ts`, `getSystemSettings`, `SellerHeader.tsx`, `market-rates.ts`, `uploads.ts`, `users/[id]/page.tsx`, `roles/actions.ts`, `admin/page.tsx`, `formatPersianNumber`, `BuyAdsFilters.tsx`, `purchase-requests-shared.ts`, `lib/admins.ts`, `BranchFormModal.tsx`, `react`, `VerificationManager.tsx`, `users/actions.ts`, `AdKindTabs.tsx`, `SaleAdsManager.tsx`, `SaleAdFormModal.tsx`, `AttentionList.tsx`, `dashboard.ts`, `AdminShell.tsx`, `adminActionDenied`, `currency.ts`, `requests/page.tsx`, `buy/[id]/page.tsx`, `CarImagesManager.tsx`, `toPersianDigits`, `StatTile.tsx`, `[...path]/route.ts`, `[audience]/[id]/page.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._