# Graph Report - khodroyab  (2026-11-11)

## Corpus Check
- 321 files · ~234,277 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .toml 1)

## Summary
- 2091 nodes · 6799 edges · 99 communities (93 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03f8ab52`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- subscriptions/actions.ts
- ProfileManager.tsx
- UserProfile.tsx
- car-types/actions.ts
- CurrencyRates.tsx
- (panel)/ads/page.tsx
- SaleAdsManager.tsx
- user.ts
- VerificationManager.tsx
- Admin authentication flow
- sale-ads/actions.ts
- PriceTableManager.tsx
- colors/actions.ts
- brands/actions.ts
- panel-search.ts
- car-form/actions.ts
- (panel)/dashboard/page.tsx
- isTrustedOrigin
- CarOffersView.tsx
- lib/price-table.ts
- SystemSettingsForm.tsx
- MyPriceTableManager.tsx
- verification-submission.ts
- session.ts
- UserCarRecord
- khodroyab-data.ts
- Toggle
- AdminShell.tsx
- SaleAdFormModal.tsx
- price-table-shared.ts
- UserAuthCard.tsx
- MyAdForm.tsx
- (panel)/price-table/actions.ts
- price-list.ts
- sale-terms/actions.ts
- PanelShell.tsx
- verification-actions.ts
- ContactView.tsx
- price-list/page.tsx
- utils.ts
- app/layout.tsx
- zod
- sponsors/actions.ts
- ads/actions.ts
- otp.ts
- compilerOptions
- Dark + Orange Accent Visual Identity
- package.json
- lib/admins.ts
- middleware.ts
- toPersianDigits
- dependencies
- scripts
- BrandsManager
- react
- admins/actions.ts
- BranchFormModal.tsx
- VerificationManager
- CarFormModal.tsx
- AdminVerificationForm
- SystemSettingsForm
- devDependencies
- seed-locations.mjs
- AdExtraFields.tsx
- users/actions.ts
- adminActionDenied
- graphify knowledge graph (graphify-out/)
- next.config.mjs
- postcss.config.mjs
- tailwindcss
- UPLOAD_DIR env
- BranchesMap.tsx
- permissions.ts
- next
- VehicleVarietyCenterFlow.tsx
- SponsorsMarquee.tsx
- branches/actions.ts
- PriceCurrency
- StatTile.tsx
- formatPersianNumber
- prisma.ts
- user-car-extras.ts
- admin/page.tsx
- (app)/about/page.tsx
- useAdExtras.ts
- AdsManager
- cn
- SaleAdFormModal
- AdDetailView.tsx
- [id]/route.ts
- roles/actions.ts
- normalizeDigits
- lib/sponsors.ts
- validation/admins.ts
- getCurrentUser
- uploads.ts
- images/actions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 259 edges
2. `toPersianDigits()` - 188 edges
3. `react` - 186 edges
4. `lucide-react` - 134 edges
5. `next` - 127 edges
6. `prisma` - 62 edges
7. `formatPersianNumber()` - 60 edges
8. `isTrustedOrigin()` - 52 edges
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

## Communities (99 total, 6 thin omitted)

### Community 0 - "subscriptions/actions.ts"
Cohesion: 0.08
Nodes (55): cancelUserSubscriptionAction(), createSubscriptionPlanAction(), deleteSubscriptionPlanAction(), grantUserSubscriptionAction(), guardRequest(), parseId(), revalidateSubscriptionViews(), SubscriptionPlanActionResult (+47 more)

### Community 1 - "ProfileManager.tsx"
Cohesion: 0.08
Nodes (42): guardRequest(), ProfileActionResult, revalidateProfilePages(), updateProfileAction(), dynamic, faTime, metadata, PanelProfilePage() (+34 more)

### Community 2 - "UserProfile.tsx"
Cohesion: 0.14
Nodes (27): revalidateVerificationPages(), reviewVerificationAction(), CountPill(), ProfileSection(), ProfileSectionProps, SectionEmpty(), headlinePrice(), UserPriceTablePreview() (+19 more)

### Community 3 - "car-types/actions.ts"
Cohesion: 0.08
Nodes (40): CarTypeActionResult, CarTypeSimpleActionResult, createCarTypeAction(), deleteCarTypeAction(), guardRequest(), isPrismaCode(), updateCarTypeAction(), createCarAction() (+32 more)

### Community 4 - "CurrencyRates.tsx"
Cohesion: 0.10
Nodes (27): dynamic, GET(), dynamic, metadata, PanelDashboardPage(), ChangePill(), CountdownRing(), CURRENCIES (+19 more)

### Community 5 - "(panel)/ads/page.tsx"
Cohesion: 0.12
Nodes (24): AdminAllAdsPage(), dynamic, metadata, PageProps, SearchParams, single(), toBigIntOrNull(), AdminPriceTablePage() (+16 more)

### Community 6 - "SaleAdsManager.tsx"
Cohesion: 0.24
Nodes (9): ColorFormModalProps, ColorsManagerProps, Filter, SaleAdsManagerProps, UserFormModalProps, UsersManagerProps, ColorRecord, UserFilter (+1 more)

### Community 7 - "user.ts"
Cohesion: 0.12
Nodes (20): PASSWORD_MIN_LENGTH, AdminLoginInput, adminLoginSchema, FieldErrors, normalizePhone(), isValidNationalCode(), ProfileUpdateInput, profileUpdateSchema (+12 more)

### Community 8 - "VerificationManager.tsx"
Cohesion: 0.15
Nodes (22): AdminVerificationFormProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS, UserVerificationSectionProps, DocDraft, IdentityDraft, PERSON_TYPE_ICONS (+14 more)

### Community 9 - "Admin authentication flow"
Cohesion: 0.05
Nodes (30): Persian RTL admin panel, AdminShell component, admins table, admin/auth-actions.ts login/logout Server Actions, AUTH_SECRET env, AUTH_SESSION_TTL_SECONDS env (default 28800), bcryptjs password hashing, /admin/dashboard (empty content area) (+22 more)

### Community 10 - "sale-ads/actions.ts"
Cohesion: 0.21
Nodes (20): createUserCarAction(), guardRequest(), isPrismaCode(), parseBigInt(), PRICE_CHANGE_SOURCE, revalidateUserPages(), toggleUserCarActiveAction(), toSaleTermData() (+12 more)

### Community 11 - "PriceTableManager.tsx"
Cohesion: 0.12
Nodes (19): PriceTableCarsTable(), PriceTableCarsTableProps, Filter, FILTERS, PriceTableManagerProps, SaleTermsManager(), handleDelete(), showToast() (+11 more)

### Community 12 - "colors/actions.ts"
Cohesion: 0.17
Nodes (21): ColorActionResult, ColorSimpleActionResult, createColorAction(), deleteColorAction(), DUPLICATE_NAME_RESULT, guardRequest(), isPrismaCode(), revalidateColorPages() (+13 more)

### Community 13 - "brands/actions.ts"
Cohesion: 0.16
Nodes (16): BrandActionResult, BrandSimpleActionResult, createBrandAction(), guardRequest(), updateBrandAction(), BrandFormModal(), handleSubmit(), brandCoreSchema (+8 more)

### Community 14 - "panel-search.ts"
Cohesion: 0.05
Nodes (62): dynamic, filtersToQuery(), metadata, PanelSearchPage(), parseFilters(), SearchParams, single(), AdCardProps (+54 more)

### Community 15 - "car-form/actions.ts"
Cohesion: 0.15
Nodes (26): createOptionAction(), deleteOptionAction(), guardRequest(), isPrismaCode(), OptionActionResult, OptionSimpleActionResult, revalidateOptionPages(), toggleOptionActiveAction() (+18 more)

### Community 16 - "(panel)/dashboard/page.tsx"
Cohesion: 0.11
Nodes (34): AdminDashboardPage(), dynamic, greetingFor(), metadata, AttentionList(), AttentionListProps, Severity, CatalogOverview() (+26 more)

### Community 17 - "isTrustedOrigin"
Cohesion: 0.15
Nodes (24): getClientIp(), LoginActionResult, loginAdminAction(), logoutAdminAction(), getClientIp(), logoutUserAction(), minutes(), requestOtpAction() (+16 more)

### Community 18 - "CarOffersView.tsx"
Cohesion: 0.13
Nodes (26): dynamic, generateMetadata(), PageProps, PriceListCarPage(), CarOffersView(), CarOffersViewProps, compareDigits(), sortOffers() (+18 more)

### Community 19 - "lib/price-table.ts"
Cohesion: 0.10
Nodes (25): parseBigInt(), saveUserPriceTableAction(), AdminUserPriceTablePage(), dynamic, metadata, PageProps, guardRequest(), parseBigInt() (+17 more)

### Community 20 - "SystemSettingsForm.tsx"
Cohesion: 0.14
Nodes (23): ContactField, ContactValues, SystemSettingsFormProps, applyCoordsText(), DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_CODE_ROTATION_MINUTES, formatGeoPoint(), MAX_ABOUT_TEXT_LENGTH (+15 more)

### Community 21 - "MyPriceTableManager.tsx"
Cohesion: 0.12
Nodes (28): borderFor(), Drafts, duplicateTierKeys(), emptyDraft(), emptyTier(), ErrorText(), FILTERS, inputBase (+20 more)

### Community 22 - "verification-submission.ts"
Cohesion: 0.15
Nodes (9): isValidCompanyNationalId(), isVerificationPersonType(), VerificationIdentity, VerificationPersonType, ParsedVerificationSubmission, parseVerificationForm(), ParseVerificationResult, readIdentity() (+1 more)

### Community 23 - "session.ts"
Cohesion: 0.27
Nodes (13): getSessionTtlSeconds(), AdminSessionPayload, audienceMatches(), createSessionToken(), CurrentAdmin, getAuthSecret(), SessionAudience, verifySessionToken() (+5 more)

### Community 24 - "UserCarRecord"
Cohesion: 0.19
Nodes (18): AdsTable(), AdsTableProps, AdStatusBadge(), AdStatusBadgeProps, STYLES, SEGMENTS, StatusBreakdownProps, lowestPrice() (+10 more)

### Community 25 - "khodroyab-data.ts"
Cohesion: 0.08
Nodes (40): AboutPage(), ICON_MAP, ContactPage(), LicensesPage(), HomePage(), ICON_MAP, BODY_TYPES, FUEL_TYPES (+32 more)

### Community 26 - "Toggle"
Cohesion: 0.13
Nodes (16): BrandFormModalProps, inputClassName(), BrandsManagerProps, ModalState, BrandsTable(), BrandsTableProps, inputClassName(), ItemDraft (+8 more)

### Community 27 - "AdminShell.tsx"
Cohesion: 0.16
Nodes (17): ActiveNavInfo, ADMIN_NAV_GROUPS, AdminNavGroup, AdminNavItem, AdminSubNavItem, findActiveNavItem(), getVisibleNavGroups(), AdminShell() (+9 more)

### Community 28 - "SaleAdFormModal.tsx"
Cohesion: 0.14
Nodes (21): AdsFilters(), AdsFiltersProps, AdsFilterValues, AdsUserOption, PARAM_KEYS, AdsManagerProps, OptionsManagerProps, SaleTermsManagerProps (+13 more)

### Community 29 - "price-table-shared.ts"
Cohesion: 0.11
Nodes (24): DEFAULT_PRICE_TABLE_CURRENCY, comparePriceColumns(), digitsOnly(), normalizeUsdPrice(), normalizeYear(), PRICE_TABLE_EMPTY, PRICE_TABLE_MAX_TIERS, PRICE_TABLE_PARTNER_KEYS (+16 more)

### Community 30 - "UserAuthCard.tsx"
Cohesion: 0.24
Nodes (10): fieldClass(), FieldIcon(), FormAlert(), formatCountdown(), Step, submitClass, UserAuthCard(), handleCodeSubmit() (+2 more)

### Community 31 - "MyAdForm.tsx"
Cohesion: 0.16
Nodes (11): AdImagesField(), CurrencyToggle(), useAdExtras(), addFiles(), FieldError(), inputClassName(), MyAdForm(), addRow() (+3 more)

### Community 32 - "(panel)/price-table/actions.ts"
Cohesion: 0.33
Nodes (11): guardRequest(), parseBigInt(), PriceTableBulkResult, PriceTableToggleResult, revalidatePriceTablePages(), setCarsPriceTableAction(), toggleCarPriceTableAction(), PriceTableManager() (+3 more)

### Community 33 - "price-list.ts"
Cohesion: 0.19
Nodes (21): CarInfoRow, carInfoSelect, compareDigitPrices(), compareOffers(), getPriceListCarDetail(), listPriceListRows(), lowestPrices(), lowestPricesByColumn() (+13 more)

### Community 34 - "sale-terms/actions.ts"
Cohesion: 0.35
Nodes (11): createSaleTermAction(), deleteSaleTermAction(), guardRequest(), parseId(), SaleTermActionResult, SaleTermSimpleActionResult, toggleSaleTermActiveAction(), updateSaleTermAction() (+3 more)

### Community 35 - "PanelShell.tsx"
Cohesion: 0.09
Nodes (31): PanelSectionLayout(), viewport, metadata, PanelLoginPage(), findActivePanelItem(), PANEL_NAV_ITEMS, PANEL_SECONDARY_ITEMS, PanelNavItem (+23 more)

### Community 36 - "verification-actions.ts"
Cohesion: 0.17
Nodes (12): AdminSubmitVerificationResult, ReviewVerificationResult, dynamic, metadata, PanelVerificationPage(), faDateTime, getUserVerification(), VERIFICATION_REJECT_REASON_MAX (+4 more)

### Community 37 - "ContactView.tsx"
Cohesion: 0.11
Nodes (27): BranchMapPoint, ConsultationFab(), ConsultationFabProps, BranchCard(), BranchesMap, BranchesSection(), pad2(), useIsRailLayout() (+19 more)

### Community 38 - "price-list/page.tsx"
Cohesion: 0.25
Nodes (9): dynamic, metadata, PanelPriceListPage(), StatTile(), dateFormatter, LiveClock(), LiveClockProps, timeFormatter (+1 more)

### Community 39 - "utils.ts"
Cohesion: 0.22
Nodes (8): AdminLogoProps, AdminFormModal(), FieldError(), inputClassName(), faDate, PermissionChips(), Edges, HorizontalScrollerProps

### Community 40 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): jetbrainsMono, metadata, RootLayout(), vazirmatn, Footer(), DOCK_ITEMS, MobileBottomDock(), Navbar() (+4 more)

### Community 41 - "zod"
Cohesion: 0.18
Nodes (9): zod, COLOR_CODE_PATTERN, colorCoreSchema, ColorFormValues, ParsedColorForm, optionCoreSchema, OptionFormValues, optionItemSchema (+1 more)

### Community 42 - "sponsors/actions.ts"
Cohesion: 0.21
Nodes (23): createSponsorAction(), deleteSponsorAction(), guardRequest(), nextSortOrder(), parseId(), reorderSponsorsAction(), revalidateSponsorPages(), SponsorActionResult (+15 more)

### Community 43 - "ads/actions.ts"
Cohesion: 0.26
Nodes (18): createMyAdAction(), guardRequest(), MyAdActionResult, parseBigInt(), PRICE_CHANGE_SOURCE, revalidateAdPages(), toSaleTermData(), updateMyAdAction() (+10 more)

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
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, version, autoprefixer, clsx, framer-motion (+9 more)

### Community 48 - "lib/admins.ts"
Cohesion: 0.17
Nodes (14): AdminAdminsPage(), dynamic, metadata, AdminsManager(), handleDelete(), handleToggleActive(), showToast(), initials() (+6 more)

### Community 49 - "middleware.ts"
Cohesion: 0.16
Nodes (15): authenticateAdmin(), ADMIN_SESSION_COOKIE, DEFAULT_SESSION_TTL_SECONDS, PASSWORD_HASH_ROUNDS, USER_SESSION_COOKIE, consumeTiming(), DUMMY_PASSWORD_HASH, verifyPassword() (+7 more)

### Community 50 - "toPersianDigits"
Cohesion: 0.14
Nodes (22): ColorsTable(), ColorsTableProps, ColorSwatch(), ColorSwatchProps, AdCarChoice, AdCarPicker(), NoImage(), MyAdCard() (+14 more)

### Community 51 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, clsx, framer-motion, jose, lucide-react, next, prisma (+6 more)

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:deploy, db:generate, db:hash-user-passwords, db:migrate, db:seed, db:seed:locations (+6 more)

### Community 53 - "BrandsManager"
Cohesion: 0.36
Nodes (10): deleteBrandAction(), isPrismaCode(), toggleBrandActiveAction(), BrandsManager(), handleConfirmDelete(), handleCreateSuccess(), handleError(), handleToggleActive() (+2 more)

### Community 54 - "react"
Cohesion: 0.12
Nodes (21): lucide-react, react, ModalState, CarImagesManagerProps, ModalState, CarsTable(), CarsTableProps, ModalState (+13 more)

### Community 55 - "admins/actions.ts"
Cohesion: 0.27
Nodes (18): ActionError, AdminActionResult, AdminSimpleActionResult, createAdminAction(), deleteAdminAction(), DUPLICATE_PHONE, guardRequest(), isLastActiveRoot() (+10 more)

### Community 56 - "BranchFormModal.tsx"
Cohesion: 0.24
Nodes (12): BranchesManagerProps, ModalState, BranchesTable(), BranchesTableProps, BranchFormModal(), BranchFormModalProps, FieldError(), FieldLabel() (+4 more)

### Community 57 - "VerificationManager"
Cohesion: 0.21
Nodes (11): FieldError(), identityDraftFrom(), IdentitySummary(), inputClassName(), newDoc(), SubmittedDocuments(), VerificationManager(), chooseFile() (+3 more)

### Community 58 - "CarFormModal.tsx"
Cohesion: 0.28
Nodes (7): CarTypesManagerProps, CarTypesTable(), CarTypesTableProps, CarFormModalProps, inputClassName(), CarsManagerProps, CarTypeRecord

### Community 59 - "AdminVerificationForm"
Cohesion: 0.27
Nodes (9): adminSubmitVerificationAction(), AdminVerificationForm(), chooseFile(), handleSubmit(), removeDoc(), updateDoc(), FieldError(), inputClassName() (+1 more)

### Community 60 - "SystemSettingsForm"
Cohesion: 0.22
Nodes (12): AdminSettingsPage(), dynamic, metadata, ContactInput(), inputClassName(), pickContact(), SettingCard(), SystemSettingsForm() (+4 more)

### Community 61 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, postcss, tailwindcss, @types/leaflet, @types/node, @types/react, @types/react-dom (+1 more)

### Community 62 - "seed-locations.mjs"
Cohesion: 0.17
Nodes (9): prisma, assertDevelopmentEnvironment(), DEV_ADMIN, DATA_DIR, readRows(), seedLocations(), unquote(), main() (+1 more)

### Community 63 - "AdExtraFields.tsx"
Cohesion: 0.36
Nodes (8): AdExtraFieldsProps, AdFieldTheme, AdSpecFields(), fieldClass(), mileageHint(), OptionField(), THEMES, AdExtrasState

### Community 64 - "users/actions.ts"
Cohesion: 0.09
Nodes (38): createUserAction(), deleteUserAction(), findUsersByCodeAction(), guardRequest(), revalidateCollaboratorContent(), toggleUserActiveAction(), toggleUserCollaborateAction(), updateUserAction() (+30 more)

### Community 65 - "adminActionDenied"
Cohesion: 0.20
Nodes (14): saveSystemSettingsAction(), SystemSettingsActionResult, metadata, PanelContactPage(), PanelAppLayout(), adminActionDenied(), requireUser(), listActiveBranches() (+6 more)

### Community 66 - "graphify knowledge graph (graphify-out/)"
Cohesion: 0.33
Nodes (4): graphify skill (project-local), GRAPH_REPORT.md, graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 72 - "BranchesMap.tsx"
Cohesion: 0.20
Nodes (21): BranchesMap(), BranchesMapProps, escapeHtml(), createMap(), hasNeshanKey, injectOnce(), IRAN_CENTER, IRAN_ZOOM (+13 more)

### Community 73 - "permissions.ts"
Cohesion: 0.22
Nodes (12): AdminFormModalProps, AdminsManagerProps, PERMISSION_ICONS, RoleFormModalProps, RolesManagerProps, AdminRecord, AdminRoleRecord, ADMIN_PERMISSION_META (+4 more)

### Community 74 - "next"
Cohesion: 0.09
Nodes (31): next, @prisma/client, server-only, AdminPendingAdsPage(), dynamic, metadata, AdminBrandsPage(), dynamic (+23 more)

### Community 76 - "VehicleVarietyCenterFlow.tsx"
Cohesion: 0.53
Nodes (4): CenterFlow(), CenterFlowNodeItem, CenterFlowProps, VehicleVarietyCenterFlow()

### Community 77 - "SponsorsMarquee.tsx"
Cohesion: 0.50
Nodes (4): SponsorCard(), SponsorsMarquee(), SponsorsMarqueeItem, SponsorsMarqueeProps

### Community 78 - "branches/actions.ts"
Cohesion: 0.12
Nodes (34): BranchActionResult, BranchReorderResult, BranchSimpleActionResult, createBranchAction(), deleteBranchAction(), guardRequest(), parseId(), placeError() (+26 more)

### Community 80 - "PriceCurrency"
Cohesion: 0.32
Nodes (7): CurrencyToggleProps, Draft, PRICE_CURRENCIES, PriceCurrency, PriceListCarDetail, PriceColumn, PriceTableEntryInput

### Community 82 - "StatTile.tsx"
Cohesion: 0.31
Nodes (8): DeltaBadge(), Sparkline(), SparklineProps, StatTile(), StatTileProps, StatTone, TONE, DashboardDelta

### Community 83 - "formatPersianNumber"
Cohesion: 0.18
Nodes (14): AdsTrendChart(), AdsTrendChartProps, MARGIN, niceStep(), TrendTable(), SubscriptionPlansTable(), AdPriceHistory(), percent() (+6 more)

### Community 84 - "prisma.ts"
Cohesion: 0.10
Nodes (31): dynamic, EditAdPage(), metadata, dynamic, metadata, NewAdCarPage(), dynamic, metadata (+23 more)

### Community 85 - "user-car-extras.ts"
Cohesion: 0.27
Nodes (11): AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber(), AdImagePlan, AdOptionRow, parseJson(), planImages() (+3 more)

### Community 86 - "admin/page.tsx"
Cohesion: 0.36
Nodes (6): AdminLoginPage(), LOGIN_HIGHLIGHTS, metadata, AdminLogo(), LoginForm(), handleSubmit()

### Community 87 - "(app)/about/page.tsx"
Cohesion: 0.20
Nodes (11): metadata, PanelAboutPage(), AboutHeroScene(), Building, Car(), SKYLINE, SPOKES, STREAKS (+3 more)

### Community 88 - "useAdExtras.ts"
Cohesion: 0.18
Nodes (8): AdImageDraft, AdOptionValue, MAX_IMAGE_SIZE_BYTES, ParsedSponsorForm, SPONSOR_NAME_MAX_LENGTH, SPONSOR_SORT_ORDER_MAX, SponsorFormValues, sponsorSchema

### Community 89 - "AdsManager"
Cohesion: 0.27
Nodes (12): deleteUserCarAction(), AdsManager(), handleChangeStatus(), handleConfirmDelete(), handleToggleActive(), replaceAd(), showToast(), buildPageList() (+4 more)

### Community 90 - "cn"
Cohesion: 0.11
Nodes (25): react-dom, PageLink(), CarTypeFormModal(), CarTypeFormModalProps, inputClassName(), ColorFormModal(), inputClassName(), inputClassName() (+17 more)

### Community 91 - "SaleAdFormModal"
Cohesion: 0.29
Nodes (5): FieldError(), nextKey(), SaleAdFormModal(), addRow(), handleSubmit()

### Community 92 - "AdDetailView.tsx"
Cohesion: 0.13
Nodes (20): AdDetailPage(), dynamic, metadata, AdDetailView(), AdDetailViewProps, PriceEquivalent(), SectionTitle(), Spec() (+12 more)

### Community 94 - "[id]/route.ts"
Cohesion: 0.19
Nodes (11): AdminForbiddenPage(), dynamic, metadata, AdminPanelLayout(), dynamic, GET(), notFound(), RouteContext (+3 more)

### Community 95 - "roles/actions.ts"
Cohesion: 0.16
Nodes (23): createRoleAction(), deleteRoleAction(), DUPLICATE_NAME, guardRequest(), isUniqueViolation(), parseId(), revalidate(), RoleActionResult (+15 more)

### Community 96 - "normalizeDigits"
Cohesion: 0.12
Nodes (21): MILEAGE_MAX, isValidTierYear(), normalizeDigits(), asciiDigits(), BRANCH_ADDRESS_MAX_LENGTH, BRANCH_MANAGER_MAX_LENGTH, BRANCH_SORT_ORDER_MAX, BRANCH_TITLE_MAX_LENGTH (+13 more)

### Community 97 - "lib/sponsors.ts"
Cohesion: 0.32
Nodes (6): AdminSponsorsPage(), dynamic, metadata, listSponsors(), PublicSponsor, SPONSOR_ORDER_BY

### Community 99 - "validation/admins.ts"
Cohesion: 0.17
Nodes (12): AttentionItem, CatalogItem, PermissionChipsProps, AdminPermission, AdminFormInput, emailSchema, idSchema, nameSchema (+4 more)

### Community 101 - "getCurrentUser"
Cohesion: 0.23
Nodes (9): submitVerificationAction(), SubmitVerificationResult, getCurrentUser(), isPartnerUser(), removeVerificationFiles(), resolveVerificationFile(), saveVerificationFile(), VERIFICATION_ROOT (+1 more)

### Community 102 - "uploads.ts"
Cohesion: 0.17
Nodes (15): buildHeaders(), dynamic, GET(), HEAD(), lookup(), notFound(), RouteContext, runtime (+7 more)

### Community 106 - "images/actions.ts"
Cohesion: 0.30
Nodes (11): addCarImageAction(), CarImageActionResult, CarImageSimpleActionResult, deleteCarImageAction(), guardRequest(), CarImagesPage(), CarImagesManager(), handleConfirmDelete() (+3 more)

## Ambiguous Edges - Review These
- `OptionType enum (options.type)` → `options.type enum (text, number, select, checkbox)`  [AMBIGUOUS]
  SCHEMA_REVIEW.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `prisma`, `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 597 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `CurrencyRates.tsx`, `(panel)/ads/page.tsx`, `SaleAdsManager.tsx`, `VerificationManager.tsx`, `PriceTableManager.tsx`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `CarOffersView.tsx`, `lib/price-table.ts`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `UserCarRecord`, `khodroyab-data.ts`, `Toggle`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `PanelShell.tsx`, `verification-actions.ts`, `ContactView.tsx`, `price-list/page.tsx`, `utils.ts`, `app/layout.tsx`, `package.json`, `lib/admins.ts`, `toPersianDigits`, `BranchFormModal.tsx`, `CarFormModal.tsx`, `SystemSettingsForm`, `AdExtraFields.tsx`, `users/actions.ts`, `adminActionDenied`, `BranchesMap.tsx`, `permissions.ts`, `next`, `VehicleVarietyCenterFlow.tsx`, `SponsorsMarquee.tsx`, `branches/actions.ts`, `PriceCurrency`, `StatTile.tsx`, `formatPersianNumber`, `prisma.ts`, `admin/page.tsx`, `(app)/about/page.tsx`, `useAdExtras.ts`, `cn`, `AdDetailView.tsx`, `[id]/route.ts`, `roles/actions.ts`, `lib/sponsors.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `prisma`, `@types/leaflet`, `@types/node` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `subscriptions/actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07886904761904762 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `CurrencyRates.tsx`, `(panel)/ads/page.tsx`, `SaleAdsManager.tsx`, `VerificationManager.tsx`, `sale-ads/actions.ts`, `colors/actions.ts`, `brands/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `isTrustedOrigin`, `CarOffersView.tsx`, `lib/price-table.ts`, `session.ts`, `UserCarRecord`, `khodroyab-data.ts`, `AdminShell.tsx`, `SaleAdFormModal.tsx`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `sale-terms/actions.ts`, `PanelShell.tsx`, `verification-actions.ts`, `ContactView.tsx`, `price-list/page.tsx`, `utils.ts`, `app/layout.tsx`, `sponsors/actions.ts`, `ads/actions.ts`, `package.json`, `lib/admins.ts`, `middleware.ts`, `toPersianDigits`, `react`, `admins/actions.ts`, `BranchFormModal.tsx`, `SystemSettingsForm`, `users/actions.ts`, `adminActionDenied`, `permissions.ts`, `VehicleVarietyCenterFlow.tsx`, `branches/actions.ts`, `StatTile.tsx`, `prisma.ts`, `admin/page.tsx`, `(app)/about/page.tsx`, `AdDetailView.tsx`, `[id]/route.ts`, `roles/actions.ts`, `lib/sponsors.ts`, `getCurrentUser`, `uploads.ts`, `images/actions.ts`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `ProfileManager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07756813417190776 - nodes in this community are weakly interconnected._
- **Why does `toPersianDigits()` connect `toPersianDigits` to `subscriptions/actions.ts`, `ProfileManager.tsx`, `UserProfile.tsx`, `car-types/actions.ts`, `CurrencyRates.tsx`, `SaleAdsManager.tsx`, `VerificationManager.tsx`, `PriceTableManager.tsx`, `colors/actions.ts`, `panel-search.ts`, `car-form/actions.ts`, `(panel)/dashboard/page.tsx`, `isTrustedOrigin`, `CarOffersView.tsx`, `SystemSettingsForm.tsx`, `MyPriceTableManager.tsx`, `verification-submission.ts`, `UserCarRecord`, `khodroyab-data.ts`, `Toggle`, `SaleAdFormModal.tsx`, `price-table-shared.ts`, `UserAuthCard.tsx`, `MyAdForm.tsx`, `(panel)/price-table/actions.ts`, `verification-actions.ts`, `ContactView.tsx`, `price-list/page.tsx`, `utils.ts`, `sponsors/actions.ts`, `lib/admins.ts`, `BrandsManager`, `react`, `BranchFormModal.tsx`, `VerificationManager`, `CarFormModal.tsx`, `AdminVerificationForm`, `SystemSettingsForm`, `AdExtraFields.tsx`, `users/actions.ts`, `permissions.ts`, `next`, `branches/actions.ts`, `StatTile.tsx`, `formatPersianNumber`, `user-car-extras.ts`, `useAdExtras.ts`, `AdsManager`, `cn`, `SaleAdFormModal`, `AdDetailView.tsx`, `roles/actions.ts`, `normalizeDigits`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `OptionType enum (options.type)` and `options.type enum (text, number, select, checkbox)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._