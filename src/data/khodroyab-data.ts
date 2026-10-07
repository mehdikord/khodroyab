export interface NavItem {
  label: string;
  href: string;
  enLabel: string;
  code: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "صفحه اصلی", href: "/", enLabel: "HOME", code: "01" },
  { label: "درباره خودرو یاب", href: "/about", enLabel: "ABOUT", code: "02" },
  { label: "خدمات", href: "/services", enLabel: "SERVICES", code: "03" },
  { label: "جستجوی خودرو", href: "/search", enLabel: "SEARCH", code: "04" },
  { label: "مجوزها و دستاوردها", href: "/licenses", enLabel: "CREDENTIALS", code: "05" },
  { label: "تماس با ما", href: "/contact", enLabel: "CONTACT", code: "06" },
];

export interface TrustPillar {
  id: string;
  code: string;
  title: string;
  enTitle: string;
  subtitle: string;
  description: string;
  highlights: string[];
  iconName: string;
}

export const TRUST_PILLARS: TrustPillar[] = [
  {
    id: "pricing-transparency",
    code: "TR-01",
    title: "قیمت مناسب و شفافیت",
    enTitle: "TRANSPARENT PRICING ARCHITECTURE",
    subtitle: "حذف واسطه‌های غیرضروری و ارائه ریز هزینه‌های واردات به تفکیک",
    description:
      "در خودرو یاب، ساختار قیمت‌گذاری بر پایه تأمین مستقیم از مبادی رسمی و شفافیت کامل اسناد خرید در مناطق آزاد تعریف شده است. تمامی هزینه‌های ارزی، حمل، بیمه، عوارض منطقه آزاد و کارمزد خدمات پیش از عقد قرارداد به‌صورت مکتوب و شفاف به خریدار ارائه می‌شود.",
    highlights: [
      "ارائه پیش‌فاکتور تفکیکی پیش از ثبت سفارش",
      "تأمین مستقیم بدون زنجیره دلالی",
      "شفافیت کامل در نرخ‌های اعلامی و هزینه‌های جانبی",
    ],
    iconName: "Scale",
  },
  {
    id: "safe-purchase",
    code: "TR-02",
    title: "خرید امن",
    enTitle: "SECURE CONTRACTUAL ACQUISITION",
    subtitle: "فرآیند حقوقی چندمرحله‌ای، قرارداد شفاف و تحویل مبتنی بر تطبیق اسناد",
    description:
      "امنیت سرمایه خریدار اولویت نخست ماست. تمامی مراحل خرید در چارچوب قراردادهای رسمی شرکتی، مراحل پرداخت مرحله‌ای متناسب با پیشرفت واقعی فرآیند تأمین و انتقال اسناد معتبر گمرکی در مناطق آزاد انجام می‌پذیرد.",
    highlights: [
      "عقد قرارداد رسمی در محل دفتر مرکزی شرکت",
      "پرداخت مرحله‌ای منطبق بر اسناد حمل و ترخیص",
      "استعلام کامل اصالت اسناد و وضعیت حقوقی خودرو",
    ],
    iconName: "ShieldCheck",
  },
  {
    id: "support-24-7",
    code: "TR-03",
    title: "پشتیبانی ۲۴ ساعته",
    enTitle: "24/7 DEDICATED CONCIERGE",
    subtitle: "همراهی مستمر کارشناسان اختصاصی در تمام ساعات شبانه‌روز",
    description:
      "از لحظه نخستین مشاوره تا زمان تحویل کلید، پلاک‌گذاری در منطقه آزاد و خدمات پس از تحویل، تیم پشتیبانی خودرو یاب به‌صورت ۲۴ ساعته آماده پاسخگویی، پیگیری وضعیت حمل و ارائه راهنمایی‌های فنی و اداری به مشتریان گرامی است.",
    highlights: [
      "اختصاص کارشناس پرونده اختصاصی برای هر خریدار",
      "گزارش‌دهی منظم از وضعیت لجستیک و تشریفات",
      "پاسخگویی مستقیم تلفنی و آنلاین در تمام ایام هفته",
    ],
    iconName: "Headset",
  },
  {
    id: "price-commitment",
    code: "TR-04",
    title: "تضمین/تعهد قیمت در شرایط اعلام‌شده",
    enTitle: "DECLARED-CONDITION PRICE COMMITMENT",
    subtitle: "پایبندی حرفه‌ای به بهای توافق‌شده در چارچوب شرایط مندرج در قرارداد",
    description:
      "خودرو یاب متعهد است در چهارچوب شرایط، زمان‌بندی و ضوابط تصریح‌شده در قرارداد فیمابین، بهای توافق‌شده خودرو را حفظ نموده و از هرگونه افزایش هزینه سلیقه‌ای یا خارج از توافق مکتوب جلوگیری نماید.",
    highlights: [
      "ثبت دقیق شرایط و تعهدات مالی در متن قرارداد",
      "محافظت از خریدار در برابر هزینه‌های پیش‌بینی‌نشده اداری",
      "شفافیت در بندهای مربوط به نوسانات و تعرفه‌های قانونی",
    ],
    iconName: "FileCheck2",
  },
  {
    id: "quality-assurance",
    code: "TR-05",
    title: "تضمین کیفیت فنی و ظاهری",
    enTitle: "TECHNICAL & VISUAL QUALITY ASSURANCE",
    subtitle: "ارزیابی چندمرحله‌ای بدنه، پیشرانه و اصالت آپشن‌ها پیش از تحویل",
    description:
      "هر خودرو پیش از بارگیری در مبدأ و همچنین هنگام ورود به منطقه آزاد، توسط کارشناسان مجرب و تجهیزات دیجیتال مورد بازرسی دقیق فنی، دیاگ تخصصی، تست رنگ لیزری و کنترل سلامت کابین قرار می‌گیرد تا مطابق برگه کارشناسی تحویل گردد.",
    highlights: [
      "صدور شناسنامه کارشناسی فنی و بدنه پیش از تحویل",
      "تطبیق دقیق کد شاسی (VIN) و لیست آپشن‌های فابریک",
      "تعهد به سلامت ظاهری و فنی مطابق گزارش مکتوب کارشناسی",
    ],
    iconName: "Gauge",
  },
  {
    id: "vehicle-variety",
    code: "TR-06",
    title: "تنوع و انتخاب مناسب",
    enTitle: "CURATED GLOBAL FLEET VARIETY",
    subtitle: "دسترسی به طیف گسترده‌ای از برندهای روز جهانی متناسب با سلیقه و بودجه",
    description:
      "از سدان‌های تشریفاتی و شاسی‌بلندهای لوکس گرفته تا کراس‌اوورهای مدرن هیبریدی و کوپه‌های اسپرت؛ شبکه تأمین خودرو یاب امکان دسترسی به تریم‌ها، رنگ‌ها و مشخصات فنی متنوع از برترین خودروسازان جهان را در مناطق آزاد فراهم می‌سازد.",
    highlights: [
      "پوشش برندهای تراز اول آلمانی، ژاپنی، کره‌ای و اروپایی",
      "امکان انتخاب تریم، رنگ بدنه و تودوزی در سفارش‌های وارداتی",
      "موجودی متنوع خودروهای آماده تحویل و در حال حمل",
    ],
    iconName: "Layers",
  },
];

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  enTitle: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  deliverable: string;
  badge: string;
  image: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "imported-vehicles",
    code: "SRV-01",
    title: "فروش خودروهای وارداتی آماده تحویل",
    enTitle: "READY-TO-DELIVER IMPORTED FLEET",
    shortDesc:
      "عرضه مستقیم خودروهای وارداتی پلاک‌شده یا آماده شماره‌گذاری در مناطق آزاد با کارشناسی کامل و تحویل فوری.",
    fullDesc:
      "مجموعه‌ای گلچین‌شده از خودروهای وارداتی صفرکیلومتر و کم‌کارکرد استاندارد در شوروم‌های خودرو یاب که تمامی مراحل گمرکی و کارشناسی فنی آن‌ها تکمیل شده و آماده بازدید حضوری و انتقال قطعی به خریدار هستند.",
    features: [
      "بازدید حضوری خودرو در شوروم اختصاصی منطقه آزاد",
      "تحویل فوری به همراه پرونده کامل گمرکی و کارشناسی",
      "تنوع در سگمنت‌های شاسی‌بلند، سدان، کوپه و کراس‌اوور",
      "تطبیق کامل مشخصات خودرو با برگه اصالت و آپشن‌ها",
    ],
    deliverable: "تحویل خودرو + برگه کارشناسی رسمی + مدارک کامل منطقه آزاد",
    badge: "تحویل فوری",
    image: "/images/showroom-freezone.jpg",
  },
  {
    id: "custom-sourcing",
    code: "SRV-02",
    title: "تأمین و واردات سفارشی خودرو",
    enTitle: "BESPOKE GLOBAL SOURCING & IMPORT",
    shortDesc:
      "ثبت سفارش و واردات مستقیم خودرو با تریم، رنگ و آپشن دلخواه شما از مبادی معتبر بین‌المللی به مناطق آزاد.",
    fullDesc:
      "چنانچه خودروی مدنظر شما با رنگ خاص یا سطح آپشن ویژه در بازار موجود نباشد، تیم بازرگانی بین‌الملل خودرو یاب خودروی دقیقاً منطبق بر سفارش شما را از نمایندگی‌ها و هاب‌های رسمی منطقه‌ای شناسایی، بازرسی، خریداری و وارد منطقه آزاد می‌نماید.",
    features: [
      "جستجو و استعلام مستقیم از مبادی رسمی صادراتی",
      "امکان انتخاب دقیق تریم، رنگ بدنه و تودوزی کابین",
      "مدیریت کامل فرآیند حمل دریایی/زمینی با بیمه تمام‌خطر",
      "گزارش‌دهی مرحله‌به‌مرحله از خرید تا ورود به گمرک منطقه آزاد",
    ],
    deliverable: "تأمین اختصاصی طبق سفارش + اسناد حمل و ترخیص رسمی",
    badge: "سفارش اختصاصی",
    image: "/images/hero-car.jpg",
  },
  {
    id: "purchase-consultation",
    code: "SRV-03",
    title: "مشاوره تخصصی خرید و سرمایه‌گذاری خودرویی",
    enTitle: "EXECUTIVE AUTOMOTIVE ADVISORY",
    shortDesc:
      "تحلیل فنی، مقایسه ارزش خرید، بررسی بازار مناطق آزاد و انتخاب بهینه‌ترین گزینه متناسب با بودجه و نیاز شما.",
    fullDesc:
      "خرید خودروی وارداتی در مناطق آزاد نیازمند شناخت دقیق قوانین تردد، نقدشوندگی بازار، هزینه‌های نگهداری و تفاوت تریم‌های منطقه‌ای (GCC / EU / Global) است. مشاوران ارشد ما بدون سوگیری تبلیغاتی، بهترین گزینه‌ها را پیش روی شما قرار می‌دهند.",
    features: [
      "مقایسه تخصصی مدل‌ها از نظر استهلاک، آپشن و بازار فروش مجدد",
      "بررسی دقیق قوانین تردد و سهمیه‌های مناطق آزاد مختلف",
      "شفاف‌سازی کامل هزینه‌های جانبی، بیمه و شماره‌گذاری",
      "ارائه سبد پیشنهادی متناسب با بودجه و کاربری خریدار",
    ],
    deliverable: "گزارش تحلیلی مقایسه خودروها + جلسه مشاوره اختصاصی رایگان",
    badge: "مشاوره رایگان",
    image: "/images/interior-cockpit.jpg",
  },
  {
    id: "inspection-evaluation",
    code: "SRV-04",
    title: "کارشناسی و ارزیابی فنی و ظاهری",
    enTitle: "MULTI-POINT PRECISION INSPECTION",
    shortDesc:
      "بازرسی چندلایه پیشرانه، گیربکس، سیستم‌های الکترونیک، ضخامت‌سنجی رنگ بدنه و اصالت آپشن‌ها با تجهیزات روز.",
    fullDesc:
      "واحد فنی خودرو یاب با بهره‌گیری از دستگاه‌های دیاگ تخصصی برندها و اسکنرهای میکرون‌سنج رنگ، سلامت کامل خودرو را در دو مرحله (پیش از خرید در مبدأ و پیش از تحویل در مقصد) بررسی کرده و گزارش مکتوب و مستند صادر می‌کند.",
    features: [
      "اسکن کامل یونیت‌های الکترونیکی (ECU/TCU) و سلامت باتری‌های هیبرید",
      "بررسی میکرونی رنگ، شاسی، ستون‌ها و قطعات بدنه",
      "اصالت‌سنجی آپشن‌های فابریک کارخانه در برابر آپشن‌های نصبی",
      "تست جاده‌ای، عملکرد سیستم تعلیق، ترمزها و فرمان‌پذیری",
    ],
    deliverable: "شناسنامه جامع سلامت فنی و ظاهری با مهر واحد کارشناسی",
    image: "/images/quality-engine.jpg",
    badge: "استاندارد دقیق",
  },
  {
    id: "customs-guidance",
    code: "SRV-05",
    title: "راهنمایی خرید، ترخیص و شماره‌گذاری",
    enTitle: "CUSTOMS & REGISTRATION NAVIGATION",
    shortDesc:
      "همراهی کامل در فرآیندهای اداری، ثبت سفارش، تشریفات گمرکی، اخذ پلاک منطقه آزاد و انتقال سند.",
    fullDesc:
      "پیچیدگی‌های اداری و مقررات گمرکی در مناطق آزاد می‌تواند برای خریداران زمان‌بر باشد. تیم حقوقی و اجرایی خودرو یاب تمامی مراحل ثبت، ترخیص، استاندارد، شماره‌گذاری و صدور کارت خودرو در منطقه آزاد را با دقت و سرعت پیگیری می‌نماید.",
    features: [
      "انجام تشریفات ترخیص گمرکی در مناطق آزاد کشور",
      "پیگیری فرآیند اخذ مجوزهای استاندارد و محیط زیست",
      "همراهی در فرآیند شماره‌گذاری، صدور پلاک و کارت تردد",
      "تنظیم مبایعه‌نامه و مستندات حقوقی شفاف و استاندارد",
    ],
    deliverable: "پرونده تکمیل‌شده ترخیص و پلاک‌گذاری قانونی منطقه آزاد",
    badge: "پوشش کامل اداری",
    image: "/images/safe-delivery.jpg",
  },
  {
    id: "post-purchase-support",
    code: "SRV-06",
    title: "پشتیبانی پس از خرید و خدمات مالکیت",
    enTitle: "POST-PURCHASE OWNERSHIP SUPPORT",
    shortDesc:
      "همراهی مستمر پس از تحویل خودرو شامل راهنمایی سرویس‌های دوره‌ای، تأمین قطعات اورجینال و تمدید مجوزهای تردد.",
    fullDesc:
      "تعهد خودرو یاب با تحویل کلید به پایان نمی‌رسد. ما در تمام دوران مالکیت، در زمینه معرفی مراکز سرویس تخصصی، تأمین قطعات و اکسسوری‌های اصلی، تمدید سالانه مجوزهای تردد منطقه آزاد و حتی ارتقا یا تعویض خودرو در آینده در کنار شما هستیم.",
    features: [
      "پشتیبانی تلفنی و آنلاین ۲۴ ساعته برای مالکان",
      "مشاوره نگهداری فنی و معرفی مراکز خدمات استاندارد",
      "همراهی در تمدیدهای دوره‌ای کارت تردد و بیمه‌نامه",
      "امکان معاوضه و به‌روزرسانی خودرو در طرح‌های آتی شرکت",
    ],
    deliverable: "کارت عضویت باشگاه مشتریان ویژه خودرو یاب + پشتیبانی ۲۴/۷",
    badge: "همراهی دائمی",
    image: "/images/road-coastal.jpg",
  },
];

export interface QualityCheckpoint {
  id: string;
  code: string;
  title: string;
  enTitle: string;
  metricLabel: string;
  metricValue: string;
  description: string;
  checkpoints: string[];
  image: string;
}

export const QUALITY_CHECKPOINTS: QualityCheckpoint[] = [
  {
    id: "technical-inspection",
    code: "QA-01",
    title: "بررسی فنی",
    enTitle: "POWERTRAIN & TELEMETRY DIAGNOSTICS",
    metricLabel: "سطح پایش یونیت‌ها",
    metricValue: "کامل (ECU / TCU / Hybrid)",
    description:
      "ارزیابی دقیق سلامت موتور، گیربکس، توربوشارژرها، سیستم خنک‌کاری و یونیت‌های الکترونیکی با استفاده از دستگاه‌های دیاگ اختصاصی هر برند و بررسی پارامترهای زنده عملکردی.",
    checkpoints: [
      "آنالیز کامل خطاهای ثبت‌شده در حافظه یونیت‌های کنترلی",
      "تست سلامت سلول‌های باتری و اینورتر در خودروهای هیبریدی و برقی",
      "کنترل عملکرد گیربکس، سیستم چهارچرخ محرک (AWD) و دیفرانسیل‌ها",
      "بازرسی سیستم تعلیق تطبیقی، ایرماتیک و سیستم ترمز سرامیکی/دیسکی",
    ],
    image: "/images/quality-engine.jpg",
  },
  {
    id: "visual-inspection",
    code: "QA-02",
    title: "بررسی ظاهری",
    enTitle: "LASER MICRON PAINT & CABIN AUDIT",
    metricLabel: "دقت اسکن بدنه",
    metricValue: "میکرون‌سنجی دیجیتال",
    description:
      "کنترل میلی‌متری سلامت رنگ بدنه، خطوط مونتاژی، شیشه‌ها، رینگ و تایر و همچنین بررسی کیفیت چرم، تریم‌های کربن/چوب و نمایشگرهای داخل کابین در اتاق نور تخصصی.",
    checkpoints: [
      "ضخامت‌سنجی دیجیتال رنگ در تمامی پانل‌های بدنه و ستون‌ها",
      "بررسی سلامت چراغ‌های ماتریسی/لیزری، سنسورها و رادارهای محیطی",
      "کنترل کیفیت چرم صندلی‌ها، سقف پانوراما و ادوات کنسول میانی",
      "اطمینان از عدم وجود آسیب‌های ناشی از حمل و نقل دریایی یا زمینی",
    ],
    image: "/images/car-headlight-macro.jpg",
  },
  {
    id: "docs-verification",
    code: "QA-03",
    title: "کنترل مشخصات و مدارک",
    enTitle: "VIN & CUSTOMS DOSSIER VERIFICATION",
    metricLabel: "تطبیق اسناد",
    metricValue: "اصالت‌سنجی چندمرحله‌ای",
    description:
      "تطبیق دقیق شماره شاسی (VIN)، سال ساخت، کد مدل، کشور سازنده، گواهی مبدأ (Certificate of Origin)، بارنامه و اسناد ثبت سفارش و ترخیص منطقه آزاد.",
    checkpoints: [
      "استعلام کد VIN از پایگاه داده رسمی خودروساز جهانی",
      "تطبیق لیست آپشن‌های فابریک کارخانه با خودروی موجود",
      "بررسی کامل اسناد گمرکی، قبض انبار و مجوزهای ورود به منطقه آزاد",
      "کنترل اصالت سوئیچ‌ها، دفترچه‌های راهنما و تجهیزات همراه خودرو",
    ],
    image: "/images/safe-delivery.jpg",
  },
  {
    id: "vehicle-health",
    code: "QA-04",
    title: "بررسی سلامت خودرو",
    enTitle: "DYNAMIC HEALTH & ROAD READINESS",
    metricLabel: "استاندارد تحویل",
    metricValue: "پروتکل جامع پیش‌تحویل (PDI)",
    description:
      "اجرای چک‌لیست استاندارد آماده‌سازی پیش از تحویل (Pre-Delivery Inspection) شامل کنترل سیالات، فشار باد تایرها، کالیبراسیون رادارهای کمک‌راننده (ADAS) و تست عملکرد تهویه.",
    checkpoints: [
      "تست عملکرد رادارهای خط‌خوان، کروز کنترل تطبیقی و دوربین ۳۶۰ درجه",
      "بررسی سطح و کیفیت روغن موتور، روغن گیربکس و مایع خنک‌کننده",
      "کنترل سیستم صوتی حرفه‌ای، مالتی‌مدیا و آپدیت‌های نرم‌افزاری",
      "تحویل خودرو در شرایط کاملاً استاندارد، دیتیلینگ‌شده و آماده تردد",
    ],
    image: "/images/interior-cockpit.jpg",
  },
  {
    id: "transparent-reporting",
    code: "QA-05",
    title: "ارائه اطلاعات شفاف",
    enTitle: "TRANSPARENT DIGITAL INSPECTION DOSSIER",
    metricLabel: "مستندسازی",
    metricValue: "گزارش مکتوب و تصویری",
    description:
      "تمامی یافته‌های کارشناسی بدون هیچ‌گونه پنهان‌کاری در قالب یک پرونده شفاف فنی و تصویری پیش از نهایی‌سازی خرید در اختیار مشتری قرار می‌گیرد تا تصمیمی کاملاً آگاهانه اتخاذ شود.",
    checkpoints: [
      "تحویل برگه کارشناسی رسمی با جزئیات کامل وضعیت هر بخش",
      "ارائه تصاویر و ویدیوهای باکیفیت از خودرو برای خریداران غیرحضوری",
      "اعلام صادقانه تفاوت بین آپشن‌های فابریک کارخانه و تجهیزات جانبی",
      "امکان حضور کارشناس مستقل مورد اعتماد خریدار پیش از تحویل نهایی",
    ],
    image: "/images/showroom-freezone.jpg",
  },
];

export interface BrandNodeData {
  id: string;
  name: string;
  faName: string;
  origin: string;
  category: string;
  popularModels: string[];
  description: string;
  monogram: string;
}

export const INTERNATIONAL_BRANDS: BrandNodeData[] = [
  {
    id: "mercedes",
    name: "MERCEDES-BENZ",
    faName: "مرسدس بنز",
    origin: "آلمان",
    category: "سدان و شاسی‌بلند تشریفاتی لوکس",
    popularModels: ["E-Class", "S-Class", "GLE", "GLC Coupe", "EQS / EQE"],
    description: "نماد مهندسی اشرافی آلمان؛ محبوب‌ترین انتخاب مدیران در مناطق آزاد با کابین فوق‌مدرن و کیفیت سواری بی‌رقیب.",
    monogram: "MB",
  },
  {
    id: "bmw",
    name: "BMW",
    faName: "ب‌ام‌و",
    origin: "آلمان",
    category: "سدان اسپرت، کوپه و شاسی‌بلند X",
    popularModels: ["5 Series", "7 Series", "X5", "X6", "iX / i4"],
    description: "ترکیب دینامیک رانندگی خیره‌کننده و فناوری روز؛ پرطرفدارترین برند اسپرت-لوکس وارداتی در مناطق آزاد کشور.",
    monogram: "BMW",
  },
  {
    id: "porsche",
    name: "PORSCHE",
    faName: "پورشه",
    origin: "آلمان",
    category: "اسپرت لوکس و شاسی‌بلند پرفورمنس",
    popularModels: ["Cayenne", "Macan", "Panamera", "Taycan", "911"],
    description: "استاندارد طلایی خودروهای پرفورمنس و مهندسی دقیق اشتوتگارت با ارزش کلکسیونی و پرستیژ ممتاز.",
    monogram: "POR",
  },
  {
    id: "toyota",
    name: "TOYOTA",
    faName: "تویوتا",
    origin: "ژاپن",
    category: "شاسی‌بلند، سدان هیبرید و کراس‌اوور",
    popularModels: ["Land Cruiser 300", "Prado 250", "Camry Hybrid", "RAV4", "Crown"],
    description: "تلفیق دوام افسانه‌ای، نقدشوندگی فوق‌العاده و فناوری هیبریدی نسل جدید؛ ستون اصلی بازار خودروهای وارداتی.",
    monogram: "TYT",
  },
  {
    id: "lexus",
    name: "LEXUS",
    faName: "لکسوس",
    origin: "ژاپن",
    category: "لوکس آرام، شاسی‌بلند و سدان ممتاز",
    popularModels: ["LX 600", "RX 350h / 500h", "NX", "ES 300h", "LS"],
    description: "تجسم ظرافت تاکومی ژاپن، کابین بی‌صدا و اطمینان فنی بی‌نظیر برای مالکیت طولانی‌مدت و بی‌دغدغه.",
    monogram: "LEX",
  },
  {
    id: "audi",
    name: "AUDI",
    faName: "آئودی",
    origin: "آلمان",
    category: "تکنولوژی کواترو، سدان و شاسی‌بلند مدرن",
    popularModels: ["Q8 / Q7", "A6 / A8", "Q5 e-tron", "e-tron GT", "A5 Sportback"],
    description: "پیشگام طراحی نورپردازی دیجیتال، کابین مجازی و سامانه چهارچرخ محرک Quattro با زبان طراحی آینده‌نگر.",
    monogram: "AUD",
  },
  {
    id: "landrover",
    name: "LAND ROVER",
    faName: "لندروور / رنجروور",
    origin: "بریتانیا",
    category: "شاسی‌بلند فوق‌لوکس و آفرود اشرافی",
    popularModels: ["Range Rover Vogue", "Range Rover Sport", "Defender 110", "Velar", "Evoque"],
    description: "شکوه اشرافی بریتانیایی در کنار توانایی‌های بی‌رقیب حرکتی؛ نماد متمایزترین شاسی‌بلندهای جهان.",
    monogram: "LR",
  },
  {
    id: "hyundai",
    name: "HYUNDAI",
    faName: "هیوندای",
    origin: "کره جنوبی",
    category: "کراس‌اوور، سدان مدرن و خودروهای هیبریدی",
    popularModels: ["Santa Fe New", "Tucson", "Azera / Grandeur", "Sonata", "Palisade"],
    description: "طراحی جسورانه، سطح آپشن‌های رفاهی کامل و خدمات و قطعات در دسترس با ارزش خرید بسیار بالا در مناطق آزاد.",
    monogram: "HYU",
  },
  {
    id: "kia",
    name: "KIA",
    faName: "کیا",
    origin: "کره جنوبی",
    category: "کراس‌اوور اسپرت و سدان‌های روز",
    popularModels: ["Sportage", "Sorento", "K8 / K5", "Telluride", "EV6 / Seltos"],
    description: "زبان طراحی نوین و کابین‌های یکپارچه دیجیتال که استانداردهای سگمنت خودروهای وارداتی شهری و خانوادگی را ارتقا داده است.",
    monogram: "KIA",
  },
  {
    id: "volkswagen",
    name: "VOLKSWAGEN",
    faName: "فولکس‌واگن",
    origin: "آلمان",
    category: "کراس‌اوور آلمانی و سری برقی ID",
    popularModels: ["Tiguan L Pro", "Touareg", "ID.4 / ID.6", "Passat", "Golf GTI"],
    description: "اصالت مهندسی آلمانی، شاسی مستحکم و طیف گسترده مدل‌های بنزینی توربو و تمام‌برقی سری ID.",
    monogram: "VW",
  },
  {
    id: "nissan",
    name: "NISSAN",
    faName: "نیسان",
    origin: "ژاپن",
    category: "شاسی‌بلند قدرتمند و کراس‌اوور e-POWER",
    popularModels: ["Patrol V8 / V6T", "X-Trail e-POWER", "Altima", "Pathfinder", "Qashqai"],
    description: "از نیسان پاترول افسانه‌ای در مناطق آزاد تا کراس‌اوورهای مجهز به فناوری پیشرفته e-POWER.",
    monogram: "NIS",
  },
  {
    id: "mazda",
    name: "MAZDA",
    faName: "مازدا",
    origin: "ژاپن",
    category: "سدان و کراس‌اوور با طراحی KODO",
    popularModels: ["CX-90 / CX-60", "CX-50 / CX-5", "Mazda 3 Sedan", "EZ-6", "CX-30"],
    description: "هنر طراحی کودو ژاپن با کیفیت متریال کابین در تراز خودروهای پریمیوم و حس رانندگی هماهنگ.",
    monogram: "MZD",
  },
];

export interface MockSearchVehicle {
  id: string;
  title: string;
  enTitle: string;
  brand: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  freeZone: string;
  statusTag: string;
  specs: string[];
  image: string;
}

export const MOCK_SHOWCASE_VEHICLES: MockSearchVehicle[] = [
  {
    id: "v-01",
    title: "کوپه گرندتورر کلاس پریمیوم",
    enTitle: "FLAGSHIP GT PERFORMANCE COUPE",
    brand: "برندهای تراز اول آلمان و اروپا",
    bodyType: "کوپه اسپرت",
    fuel: "بنزینی توئین‌توربو",
    transmission: "اتوماتیک دوکلاچه",
    freeZone: "پلاک و تردد مناطق آزاد",
    statusTag: "پیش‌نمایش کاتالوگ (به‌زودی)",
    specs: ["کابین چرم ناپا و فیبرکربن", "سیستم ترمز سرامیکی", "رادارهای کامل ADAS"],
    image: "/images/hero-car.jpg",
  },
  {
    id: "v-02",
    title: "شاسی‌بلند فول‌سایز تشریفاتی",
    enTitle: "EXECUTIVE FULL-SIZE LUXURY SUV",
    brand: "لکسوس / تویوتا / رنجروور / مرسدس",
    bodyType: "شاسی‌بلند لوکس",
    fuel: "بنزینی / هیبرید",
    transmission: "اتوماتیک ۱۰ سرعته",
    freeZone: "ارس / کیش / قشم / انزلی",
    statusTag: "پیش‌نمایش کاتالوگ (به‌زودی)",
    specs: ["سیستم چهارچرخ محرک هوشمند", "تعلیق بادی تطبیقی", "کابین VIP سه ردیفه"],
    image: "/images/car-suv-luxury.jpg",
  },
  {
    id: "v-03",
    title: "سدان مدیران نسل جدید",
    enTitle: "EXECUTIVE HYBRID LUXURY SEDAN",
    brand: "مرسدس بنز / ب‌ام‌و / آئودی / لکسوس",
    bodyType: "سدان تشریفاتی",
    fuel: "هیبرید / بنزینی توربو",
    transmission: "اتوماتیک تیپ‌ترونیک",
    freeZone: "کلیه مناطق آزاد تجاری",
    statusTag: "پیش‌نمایش کاتالوگ (به‌زودی)",
    specs: ["نورپردازی محیطی هوشمند", "سیستم صوتی سه‌بعدی", "عایق‌بندی آکوستیک کابین"],
    image: "/images/car-sedan-exec.jpg",
  },
  {
    id: "v-04",
    title: "کراس‌اوور کوپه مدرن و هیبریدی",
    enTitle: "NEXT-GEN HYBRID COUPE CROSSOVER",
    brand: "پورشه / ب‌ام‌و / هیوندای / کیا / فولکس‌واگن",
    bodyType: "کراس‌اوور شهری و جاده‌ای",
    fuel: "پلاگین هیبرید / تمام برقی",
    transmission: "اتوماتیک هوشمند",
    freeZone: "آماده سفارش‌گذاری",
    statusTag: "پیش‌نمایش کاتالوگ (به‌زودی)",
    specs: ["چراغ‌های ماتریسی لیزری", "سقف پانوراما یکپارچه", "کاکپیت دیجیتال خمیده"],
    image: "/images/road-coastal.jpg",
  },
];

export interface LicenseItem {
  id: string;
  code: string;
  category: string;
  title: string;
  enTitle: string;
  issuerPlaceholder: string;
  statusLabel: string;
  description: string;
  editableNote: string;
}

export const LICENSES_AND_ACHIEVEMENTS: LicenseItem[] = [
  {
    id: "lic-01",
    code: "CRED-01",
    category: "مجوز فعالیت بازرگانی",
    title: "مجوز فعالیت اقتصادی و بازرگانی در مناطق آزاد",
    enTitle: "FREE-TRADE ZONE COMMERCIAL OPERATION PERMIT",
    issuerPlaceholder: "[جایگاه درج نام سازمان منطقه آزاد مربوطه — قابل ویرایش]",
    statusLabel: "قالب استاندارد مجوز رسمی",
    description:
      "این بخش به نمایش تصویر و مشخصات مجوز رسمی فعالیت بازرگانی شرکت خودرو یاب در سازمان‌های مناطق آزاد تجاری-صنعتی اختصاص دارد و پس از بارگذاری نهایی مستندات کارفرما تکمیل می‌گردد.",
    editableNote: "اطلاعات شماره ثبت، تاریخ صدور و تصویر سند توسط مدیریت سامانه قابل جایگزینی است.",
  },
  {
    id: "lic-02",
    code: "CRED-02",
    category: "واردات و تأمین خودرو",
    title: "گواهی صلاحیت ثبت سفارش و واردات خودروهای خارجی",
    enTitle: "FOREIGN VEHICLE IMPORT & SOURCING AUTHORIZATION",
    issuerPlaceholder: "[جایگاه درج مرجع صادرکننده مجوز واردات — قابل ویرایش]",
    statusLabel: "قالب استاندارد مجوز رسمی",
    description:
      "مستندات مرتبط با مجوزهای بازرگانی خارجی، کارت بازرگانی و چارچوب قانونی ثبت سفارش و ترخیص خودروهای سواری در مبادی گمرکی مناطق آزاد.",
    editableNote: "بدون درج ادعاهای آماری یا شماره‌های غیرواقعی؛ آماده درج اطلاعات رسمی شرکت.",
  },
  {
    id: "lic-03",
    code: "CRED-03",
    category: "استاندارد و کارشناسی فنی",
    title: "گواهینامه فرآیند کنترل کیفیت و ارزیابی فنی پیش از تحویل",
    enTitle: "TECHNICAL INSPECTION & QUALITY MANAGEMENT PROTOCOL",
    issuerPlaceholder: "[جایگاه درج نهاد ارزیاب / واحد کنترل کیفیت — قابل ویرایش]",
    statusLabel: "پروتکل کیفیت داخلی",
    description:
      "چارچوب استاندارد کارشناسی فنی، ظاهری و اصالت‌سنجی خودروها که پیش از تحویل هر دستگاه خودروی وارداتی توسط تیم فنی خودرو یاب اجرا و مستندسازی می‌شود.",
    editableNote: "قابل ویرایش و الصاق نمونه برگه کارشناسی رسمی خودرو یاب.",
  },
  {
    id: "lic-04",
    code: "CRED-04",
    category: "رضایت مشتریان و خدمات",
    title: "منشور اخلاقی، شفافیت قراردادی و تکریم خریداران",
    enTitle: "CONTRACTUAL TRANSPARENCY & CLIENT CHARTER",
    issuerPlaceholder: "[واحد حقوقی و امور مشتریان خودرو یاب — قابل ویرایش]",
    statusLabel: "منشور تعهدات شرکتی",
    description:
      "مجموعه اصول و تعهدات حرفه‌ای خودرو یاب در زمینه شفافیت مالی، حفظ بهای توافقی در شرایط اعلام‌شده قرارداد و پشتیبانی ۲۴ ساعته از خریداران.",
    editableNote: "متن کامل منشور و گواهی‌های مرتبط به سادگی از طریق فایل داده قابل ویرایش است.",
  },
  {
    id: "lic-05",
    code: "CRED-05",
    category: "عضویت‌های صنفی و تخصصی",
    title: "گواهی عضویت در تشکل‌ها و مجامع بازرگانی و خودرویی",
    enTitle: "AUTOMOTIVE & TRADE ASSOCIATION MEMBERSHIPS",
    issuerPlaceholder: "[جایگاه درج نام انجمن یا اتاق بازرگانی — قابل ویرایش]",
    statusLabel: "قالب آماده بارگذاری",
    description:
      "محل نمایش گواهینامه‌های عضویت در اتاق‌های بازرگانی، اتحادیه‌ها و انجمن‌های تخصصی واردکنندگان و فعالان اقتصادی مناطق آزاد.",
    editableNote: "تمامی عناوین، کدها و تصاویر گواهینامه‌ها به‌صورت ماژولار طراحی شده‌اند.",
  },
  {
    id: "lic-06",
    code: "CRED-06",
    category: "دستاوردها و رویدادها",
    title: "لوح‌های تقدیر و دستاوردهای تخصصی مجموعه خودرو یاب",
    enTitle: "CORPORATE MILESTONES & RECOGNITIONS",
    issuerPlaceholder: "[جایگاه درج عنوان رویداد / همایش تخصصی — قابل ویرایش]",
    statusLabel: "پورتفولیو دستاوردها",
    description:
      "نمایش دستاوردهای اجرایی، حضور در نمایشگاه‌های تخصصی خودرو در مناطق آزاد و تقدیرنامه‌های دریافت‌شده در حوزه خدمات بازرگانی خودرو.",
    editableNote: "آماده جایگذاری تصاویر رسمی لوح‌ها و تندیس‌های مجموعه.",
  },
];

export const FREE_ZONES_LIST = [
  { name: "منطقه آزاد ارس", en: "ARAS FREE ZONE", region: "شمال غرب" },
  { name: "منطقه آزاد کیش", en: "KISH FREE ZONE", region: "خلیج فارس" },
  { name: "منطقه آزاد قشم", en: "QESHM FREE ZONE", region: "خلیج فارس" },
  { name: "منطقه آزاد انزلی", en: "ANZALI FREE ZONE", region: "دریای خزر" },
  { name: "منطقه آزاد ماکو", en: "MAKU FREE ZONE", region: "شمال غرب" },
  { name: "منطقه آزاد چابهار", en: "CHABAHAR FREE ZONE", region: "جنوب شرق" },
  { name: "منطقه آزاد اروند", en: "ARVAND FREE ZONE", region: "جنوب غرب" },
];
