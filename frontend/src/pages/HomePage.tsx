import { Link } from "react-router-dom";
import { Heart, Users, Gift, Calendar, Shield, Clock, HandHeart } from "lucide-react";

const stats = [
  { value: "+500",  label: "حالة تم مساعدتها" },
  { value: "+2M",   label: "ج.م مساعدات مالية" },
  { value: "+1000", label: "أسرة مستفيدة" },
  { value: "+50",   label: "شريك داعم" },
];

const services = [
  {
    icon: Gift,
    title: "مساعدات مالية",
    desc: "تقديم مساعدات مالية شهرية للأسر المحتاجة وفق دراسات حالة دقيقة",
  },
  {
    icon: HandHeart,
    title: "مساعدات عينية",
    desc: "توزيع مواد غذائية وملابس وأدوية على الأسر المستحقة",
  },
  {
    icon: Calendar,
    title: "رعاية موسمية",
    desc: "برامج خاصة في رمضان والأعياد وشتاء لكل محتاج",
  },
];

const activities = [
  "تم توزيع 50 كرتونة مواد غذائية بمناسبة شهر رمضان",
  "تقديم مساعدات مالية لـ 30 أسرة في منطقة وسط البلد",
  "تسليم كسوة العيد لـ 100 طفل يتيم",
  "مبادرة الشتاء الدافئ بتوزيع 75 بطانية",
];

const values = [
  { icon: Shield, label: "الشفافية" },
  { icon: Clock,  label: "السرعة" },
  { icon: Users,  label: "الإنسانية" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen" dir="rtl">
      {/* ── Persistent full-screen background ─────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/slogan-bg.png"
          alt="خلفية الشعار"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
      </div>

      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0">
              <Heart size={16} className="text-white" fill="white" />
            </div>
            <span className="text-white font-bold text-sm hidden sm:block leading-tight">
              نظام إدارة
              <span className="text-secondary-300 font-normal"> جمعية النور المحمدي</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "خدماتنا",    href: "#services" },
              { label: "رسالتنا",    href: "#mission"  },
              { label: "آخر الأنشطة", href: "#activities" },
              { label: "تواصل معنا", href: "#contact"  },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-gray-300 hover:text-white text-sm transition-colors">
                {label}
              </a>
            ))}
          </nav>

          <Link
            to="/login"
            className="flex items-center gap-2 bg-secondary hover:bg-secondary-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all active:scale-[0.97]"
          >
            دخول الموظفين
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-28 md:py-40 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <Heart size={13} className="text-secondary" fill="#3498DB" />
          <span className="text-gray-200 text-xs font-medium">نساعد المحتاجين منذ سنوات</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
          جمعية النور المحمدي
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          نساعد المحتاجين من خلال تنظيم المساعدات المالية والعينية بكفاءة وشفافية
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.97]"
            style={{ boxShadow: "0 4px 20px rgba(52,152,219,0.4)" }}
          >
            دخول الموظفين
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all backdrop-blur-sm active:scale-[0.97]"
          >
            تواصل معنا
          </a>
        </div>

        {/* Scroll nudge */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-35">
          <div className="w-px h-10 bg-white animate-pulse" />
          <span className="text-xs text-white">اكتشف المزيد</span>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="py-14 border-y border-white/10 bg-black/55 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-white/10">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center px-6 py-2">
                <div
                  className="text-3xl md:text-4xl font-bold mb-1.5"
                  style={{ color: "#3498DB", textShadow: "0 0 24px rgba(52,152,219,0.35)" }}
                >
                  {value}
                </div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-secondary text-xs font-semibold tracking-widest mb-3">ما نقدمه</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">خدماتنا</h2>
            <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">
              نقدم مجموعة متكاملة من الخدمات لمساعدة الأسر المحتاجة والمستفيدين
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-2xl p-8 text-center transition-all duration-300 border border-white/10 hover:border-secondary/30"
                style={{ background: "rgba(255,255,255,0.06)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.11)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                {/* Top glow on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                <div className="w-14 h-14 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={26} className="text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────────────────── */}
      <section id="mission" className="py-20 border-y border-white/10 bg-black/55 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-secondary text-xs font-semibold tracking-widest mb-3">من نحن</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">رسالتنا</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              نسعى لتقديم الدعم والمساعدة للمحتاجين بكل شفافية وكفاءة،
              من خلال نظام متكامل لإدارة الحالات يضمن وصول المساعدات
              إلى مستحقيها في الوقت المناسب.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {values.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-full px-5 py-2.5 backdrop-blur-sm">
                    <Icon size={15} className="text-secondary" />
                    <span className="text-white font-medium text-sm">{label}</span>
                  </div>
                  {i < values.length - 1 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Activities ─────────────────────────────────────────────────────── */}
      <section id="activities" className="py-20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-secondary text-xs font-semibold tracking-widest mb-3">أخبار</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">آخر الأنشطة</h2>
            <p className="text-gray-300">تعرف على آخر المساعدات التي تم تقديمها</p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 border border-white/10 hover:border-secondary/30 rounded-xl px-5 py-4 transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                <div className="shrink-0 w-7 h-7 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center mt-0.5">
                  <span className="text-secondary text-xs font-bold">{index + 1}</span>
                </div>
                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-secondary mt-2.5" />
                <p className="text-gray-300 group-hover:text-gray-200 text-sm leading-relaxed transition-colors">
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Footer ───────────────────────────────────────────────── */}
      <footer id="contact" className="py-14 border-t border-white/10 bg-black/72 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center">
              <Heart size={17} className="text-white" fill="white" />
            </div>
            <span className="text-white font-bold">جمعية النور المحمدي</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-3">تواصل معنا</h3>
          <p className="text-gray-400 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
            للاستفسارات أو المساعدة، يمكنك التواصل مع فريق الدعم
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:info@charity.org"
              className="flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 rounded-lg px-6 py-2.5 text-secondary hover:text-secondary-300 text-sm font-medium transition-all"
            >
              info@charity.org
            </a>
            <a
              href="tel:+20123456789"
              className="flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 rounded-lg px-6 py-2.5 text-secondary hover:text-secondary-300 text-sm font-medium transition-all"
            >
              0123456789+
            </a>
          </div>

          <div className="border-t border-white/10 pt-6 text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} جمعية النور المحمدي. جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}