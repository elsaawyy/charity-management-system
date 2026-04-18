import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const lockIntervalRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Clear lock timer when component unmounts
  useEffect(() => {
    return () => {
      if (lockIntervalRef.current) {
        clearInterval(lockIntervalRef.current);
      }
    };
  }, []);

 const onSubmit = async (data: FormData) => {
  console.log("1. Form submitted with:", data.username);
  
  // Check if account is locked
  if (isLocked) {
    console.log("2. Account is locked");
    toast.error(`الرجاء الانتظار ${lockTimer} ثانية قبل المحاولة مرة أخرى`);
    return;
  }

  // Validate input before sending
  if (!data.username.trim()) {
    console.log("3. Empty username");
    toast.error("الرجاء إدخال اسم المستخدم");
    return;
  }

  if (!data.password.trim()) {
    console.log("4. Empty password");
    toast.error("الرجاء إدخال كلمة المرور");
    return;
  }

  console.log("5. Calling login API...");
  
  try {
    await login(data.username.trim(), data.password);
    console.log("6. Login successful!");
    setLoginAttempts(0);
    toast.success("مرحباً بعودتك!");
    navigate("/dashboard", { replace: true });
  } catch (err: any) {
    console.log("7. Login failed:", err);
    console.log("7a. Response status:", err?.response?.status);
    console.log("7b. Response data:", err?.response?.data);
    
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    let errorMsg = "بيانات الدخول غير صحيحة";
    
    if (err?.response?.status === 401) {
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(300);
        
        if (lockIntervalRef.current) {
          clearInterval(lockIntervalRef.current);
        }
        lockIntervalRef.current = setInterval(() => {
          setLockTimer((prev) => {
            if (prev <= 1) {
              if (lockIntervalRef.current) {
                clearInterval(lockIntervalRef.current);
              }
              setIsLocked(false);
              setLoginAttempts(0);
              reset();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        errorMsg = "تم قفل الحساب مؤقتاً بسبب كثرة المحاولات الفاشلة. الرجاء المحاولة بعد 5 دقائق";
      } else {
        errorMsg = `بيانات الدخول غير صحيحة. تبقى ${5 - newAttempts} محاولات`;
      }
    } else if (err?.response?.data?.detail) {
      errorMsg = err.response.data.detail;
    } else if (err?.message) {
      errorMsg = "حدث خطأ في الاتصال بالخادم";
    }
    
    console.log("8. Showing error:", errorMsg);
    toast.error(errorMsg);
    
    // Clear password field on failed attempt
    if (newAttempts < 5) {
      reset({ username: data.username, password: "" });
    }
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden flex">
      {/* ── Left panel: decorative (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center">
        {!imageError ? (
          <img
            src="/slogan-bg.png"
            alt="خلفية الشعار"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a2a3a]" />
        )}

        {/* Geometric tile overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #3498DB 25%, transparent 25%),
              linear-gradient(-45deg, #3498DB 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #3498DB 75%),
              linear-gradient(-45deg, transparent 75%, #3498DB 75%)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
          }}
        />

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-900/65 to-primary-800/40" />

        {/* Left panel content */}
        <div className="relative z-10 text-center px-12 select-none">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 border border-white/20 mb-8">
            <ShieldCheck size={36} className="text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-bold text-white leading-snug mb-4">
            نظام إدارة
            <br />
            <span className="text-secondary-300">النور المحمدي</span>
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
            منصة متكاملة لإدارة الحالات وتتبع المساعدات وتنظيم البرامج الشهرية
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["إدارة الحالات", "المساعدات الشهرية", "التقارير", "سجل التدقيق"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/75 border border-white/15"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="absolute bottom-6 text-white/25 text-xs">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
      </div>

      {/* ── Right panel: login form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F4F6F8] px-6 py-12 relative">
        {/* Mobile bg */}
        <div className="lg:hidden absolute inset-0 overflow-hidden">
          {!imageError ? (
            <img
              src="/slogan-bg.png"
              alt=""
              className="w-full h-full object-cover opacity-10"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-800 opacity-5" />
          )}
        </div>

        <div className="relative w-full max-w-[380px]">
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-900 mb-3">
              <ShieldCheck size={26} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-primary-900">جمعية النور المحمدي</h1>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)" }}>
            {/* Top accent bar */}
            <div className="h-[3px] w-full bg-gradient-to-l from-secondary to-primary-700" />

            <div className="px-8 py-8">
              {/* Heading */}
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-primary-900">تسجيل الدخول</h2>
                <p className="text-gray-400 text-sm mt-1">أدخل بياناتك للمتابعة</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                    اسم المستخدم
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    autoFocus={!isLocked}
                    disabled={isLocked}
                    placeholder="أدخل اسم المستخدم"
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-sm text-right bg-gray-50",
                      "outline-none transition-all duration-150 placeholder:text-gray-300",
                      "focus:bg-white focus:ring-4 focus:ring-secondary/10 focus:border-secondary",
                      errors.username
                        ? "border-danger bg-red-50 focus:ring-danger/10 focus:border-danger"
                        : "border-gray-200 hover:border-gray-300",
                      isLocked && "opacity-50 cursor-not-allowed"
                    )}
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-xs text-danger flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-danger inline-block shrink-0" />
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isLocked}
                      placeholder="أدخل كلمة المرور"
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 pl-10 text-sm text-right bg-gray-50",
                        "outline-none transition-all duration-150 placeholder:text-gray-300",
                        "focus:bg-white focus:ring-4 focus:ring-secondary/10 focus:border-secondary",
                        errors.password
                          ? "border-danger bg-red-50 focus:ring-danger/10 focus:border-danger"
                          : "border-gray-200 hover:border-gray-300",
                        isLocked && "opacity-50 cursor-not-allowed"
                      )}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      tabIndex={-1}
                      disabled={isLocked}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-danger flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-danger inline-block shrink-0" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login attempts warning */}
                {loginAttempts > 0 && loginAttempts < 5 && !isLocked && (
                  <div className="text-center mt-2">
                    <p className="text-xs text-orange-500">
                      ⚠️ تبقى {5 - loginAttempts} محاولات قبل قفل الحساب مؤقتاً
                    </p>
                  </div>
                )}

                {isLocked && (
                  <div className="text-center mt-2">
                    <p className="text-xs text-red-500">
                      🔒 الحساب مقفل مؤقتاً. الرجاء المحاولة بعد {lockTimer} ثانية
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLocked}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 mt-2",
                    "rounded-xl py-3 text-sm font-semibold text-white",
                    "bg-primary-900 hover:bg-primary-800 active:scale-[0.98]",
                    "transition-all duration-150",
                    "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
                  )}
                  style={{ boxShadow: "0 4px 16px rgba(44,62,80,0.28)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>جارٍ تسجيل الدخول...</span>
                    </>
                  ) : (
                    "دخول"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-xs mt-5">
            جمعية النور المحمدي &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}