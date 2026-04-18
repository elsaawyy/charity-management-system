import { Link } from "react-router-dom";
import { Heart, Users, Gift, Calendar, Shield, Clock, HandHeart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Full Screen Background Image - Same as login */}
      <div className="absolute inset-0">
        <img 
          src="/slogan-bg.png" 
          alt="خلفية الشعار" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6">
            <Heart size={40} className="text-secondary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            نظام إدارة الحالات الخيرية
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            نساعد المحتاجين من خلال تنظيم المساعدات المالية والعينية بكفاءة وشفافية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              دخول الموظفين
            </Link>
            <a
              href="#contact"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              تواصل معنا
            </a>
          </div>
        </div>

        {/* Statistics Section - Semi-transparent */}
        <div className="bg-black/50 backdrop-blur-sm py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold text-secondary">+500</div>
                <div className="text-gray-300 text-sm mt-1">حالة تم مساعدتها</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold text-secondary">+2M</div>
                <div className="text-gray-300 text-sm mt-1">ج.م مساعدات مالية</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold text-secondary">+1000</div>
                <div className="text-gray-300 text-sm mt-1">أسرة مستفيدة</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold text-secondary">+50</div>
                <div className="text-gray-300 text-sm mt-1">شريك داعم</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section - Semi-transparent */}
        <div className="bg-black/40 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">خدماتنا</h2>
              <p className="text-gray-200 max-w-2xl mx-auto">
                نقدم مجموعة متكاملة من الخدمات لمساعدة الأسر المحتاجة والمستفيدين
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">مساعدات مالية</h3>
                <p className="text-gray-200">
                  تقديم مساعدات مالية شهرية للأسر المحتاجة وفق دراسات حالة دقيقة
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandHeart size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">مساعدات عينية</h3>
                <p className="text-gray-200">
                  توزيع مواد غذائية وملابس وأدوية على الأسر المستحقة
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">رعاية موسمية</h3>
                <p className="text-gray-200">
                  برامج خاصة في رمضان والأعياد وشتاء لكل محتاج
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-black/50 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">رسالتنا</h2>
              <p className="text-lg text-gray-200 mb-6">
                نسعى لتقديم الدعم والمساعدة للمحتاجين بكل شفافية وكفاءة،
                من خلال نظام متكامل لإدارة الحالات يضمن وصول المساعدات
                إلى مستحقيها في الوقت المناسب.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-200">
                <Shield size={20} />
                <span>الشفافية</span>
                <span className="mx-2">•</span>
                <Clock size={20} />
                <span>السرعة</span>
                <span className="mx-2">•</span>
                <Users size={20} />
                <span>الإنسانية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-black/40 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">آخر الأنشطة</h2>
              <p className="text-gray-200">تعرف على آخر المساعدات التي تم تقديمها</p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                "تم توزيع 50 كرتونة مواد غذائية بمناسبة شهر رمضان",
                "تقديم مساعدات مالية لـ 30 أسرة في منطقة وسط البلد",
                "تسليم كسوة العيد لـ 100 طفل يتيم",
                "مبادرة الشتاء الدافئ بتوزيع 75 بطانية"
              ].map((activity, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-r-4 border-secondary">
                  <div className="flex items-center gap-3">
                    <Heart size={16} className="text-secondary" />
                    <p className="text-gray-200">{activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="bg-black/70 backdrop-blur-sm py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-white mb-4">تواصل معنا</h3>
            <p className="text-gray-300 mb-4">
              للاستفسارات أو المساعدة، يمكنك التواصل مع فريق الدعم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:info@charity.org" className="text-secondary hover:underline">
                info@charity.org
              </a>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <a href="tel:+20123456789" className="text-secondary hover:underline">
                0123456789+
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700 text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} نظام إدارة الحالات الخيرية. جميع الحقوق محفوظة
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}