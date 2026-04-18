import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.username, data.password);
      toast.success("مرحباً بعودتك!");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "بيانات الدخول غير صحيحة";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full Screen Background Image */}
      {!imageError ? (
        <img 
          src="/slogan-bg.png" 
          alt="خلفية الشعار" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Login Form Container - Compact and Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Compact Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
            {/* Small Header */}
            <div className="bg-gradient-to-l from-primary-900 to-primary-800 px-6 py-4 text-center">
              <h1 className="text-lg font-bold text-white">نظام إدارة الحالات</h1>
              <p className="text-gray-400 text-xs">الخيرية</p>
            </div>

            {/* Compact Form */}
            <div className="px-6 py-6">
              <h2 className="text-base font-bold text-primary-900 mb-4 text-center">
                تسجيل الدخول
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
                {/* Username */}
                <div>
                  <label className="form-label text-sm" htmlFor="username">
                    اسم المستخدم
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    className={cn(
                      "form-input py-1.5 text-sm",
                      errors.username && "border-danger focus:ring-danger/40 focus:border-danger"
                    )}
                    placeholder="أدخل اسم المستخدم"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="mt-0.5 text-xs text-danger">{errors.username.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="form-label text-sm" htmlFor="password">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={cn(
                        "form-input pl-8 py-1.5 text-sm",
                        errors.password && "border-danger focus:ring-danger/40 focus:border-danger"
                      )}
                      placeholder="أدخل كلمة المرور"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-0.5 text-xs text-danger">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center py-2 text-sm mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>جارٍ تسجيل الدخول...</span>
                    </>
                  ) : (
                    "دخول"
                  )}
                </button>
              </form>

              {/* Compact Hint */}
              <div className="mt-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 text-center">
                  بيانات الدخول: <span className="font-mono font-semibold">admin</span> /{" "}
                  <span className="font-mono font-semibold">Admin@123</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-300 text-xs mt-3">
            نظام إدارة الحالات الخيرية &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}