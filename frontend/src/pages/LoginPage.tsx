import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Heart, Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-l from-primary-900 to-primary-800 px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20 mb-4">
              <Heart size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">نظام إدارة الحالات</h1>
            <p className="text-gray-400 text-sm mt-1">الخيرية</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-xl font-bold text-primary-900 mb-6 text-center">
              تسجيل الدخول
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Username */}
              <div>
                <label className="form-label" htmlFor="username">
                  اسم المستخدم
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  className={cn(
                    "form-input",
                    errors.username && "border-danger focus:ring-danger/40 focus:border-danger"
                  )}
                  placeholder="أدخل اسم المستخدم"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-danger">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="form-label" htmlFor="password">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={cn(
                      "form-input pl-10",
                      errors.password && "border-danger focus:ring-danger/40 focus:border-danger"
                    )}
                    placeholder="أدخل كلمة المرور"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جارٍ تسجيل الدخول...</span>
                  </>
                ) : (
                  "دخول"
                )}
              </button>
            </form>

            {/* Default credentials hint (dev only) */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 text-center">
                بيانات الدخول الافتراضية:{" "}
                <span className="font-mono font-semibold">admin</span> /{" "}
                <span className="font-mono font-semibold">Admin@123</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          نظام إدارة الحالات الخيرية &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
