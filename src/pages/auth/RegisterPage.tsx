import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "@/services/axios";

import authIllustration from "@/assets/auth-illustration.png";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { AtSign, Eye, EyeOff, Loader2, LockKeyhole, User2 } from "lucide-react";
import toast from "react-hot-toast";

interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterPayload>();

  const onSubmit = async (data: RegisterPayload) => {
    const loadingToast = toast.loading("Login..");
    setIsloading(true);

    try {
      await api.post("/registration", {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
      });

      toast.dismiss(loadingToast);
      toast.success("Login success");

      setIsloading(false);

      navigate("/login");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      setIsloading(false);

      toast.error(error || "Registrasi failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-10">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                <img
                  className="w-full h-full object-cover"
                  src={logo}
                  alt="logo"
                />
              </div>

              <h1 className="font-bold text-lg text-slate-900">SIMS PPOB</h1>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-slate-900 mb-10">
              Lengkapi data untuk
              <br />
              membuat akun
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <AtSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  placeholder="masukkan email anda"
                  {...register("email", {
                    required: "Email wajib diisi",
                  })}
                  className="w-full border pl-12 border-slate-200 rounded-md px-4 py-3 outline-none focus:border-red-400"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <User2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="nama depan"
                  {...register("first_name", {
                    required: "Nama depan wajib diisi",
                  })}
                  className="w-full pl-12 border border-slate-200 rounded-md px-4 py-3 outline-none focus:border-red-400"
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <User2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="nama belakang"
                  {...register("last_name", {
                    required: "Nama belakang wajib diisi",
                  })}
                  className="w-full border pl-12 border-slate-200 rounded-md px-4 py-3 outline-none focus:border-red-400"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="buat password"
                  {...register("password", {
                    required: "Password wajib diisi",

                    minLength: {
                      value: 8,
                      message: "Password minimal 8 karakter",
                    },
                  })}
                  className="w-full pl-12 border border-slate-200 rounded-md px-4 py-3 outline-none focus:border-red-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="konfirmasi password"
                  {...register("confirm_password", {
                    required: "Konfirmasi password wajib diisi",

                    validate: (value) =>
                      value === watch("password") || "Password tidak sama",
                  })}
                  className="w-full pl-12 border border-slate-200 rounded-md px-4 py-3 outline-none focus:border-red-400"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-red-500 hover:bg-red-600 transition-all text-white rounded-md font-medium mt-2 flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Registrasi"
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              sudah punya akun? login{" "}
              <Link to="/login" className="text-red-500 font-semibold">
                di sini
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-[#FFF6F6]">
        <img
          src={authIllustration}
          alt="Register Illustration"
          className="max-w-xl object-contain"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
