import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AtSign, Loader2, Pencil, User2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { clearProfile, setProfile } from "@/features/profile/profileSlice";
import { clearBalance } from "@/features/balance/balanceSlice";
import defaultProfile from "@/assets/profile-photo.png";
import { logout } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import LogoutModal from "@/components/LogoutModal";
import api from "@/services/axios";
import { useAppSelector } from "@/hooks/redux";

const AccountPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.profile);

  const [openLogout, setOpenLogout] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
  }, [profile]);

  interface ManualErrors {
    first_name?: string;
    last_name?: string;
    general?: string;
  }

  const [formErrors, setFormErrors] = useState<ManualErrors>({});
  const validateForm = () => {
    const newErrors: ManualErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Nama Depan wajib diisi";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Nama Belakang wajib diisi";
    }

    setFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await api.put("/profile/update", formData);

      if (response.data.status === 0) {
        dispatch(setProfile(response.data.data));

        toast.success("Profil berhasil diperbarui!");

        setIsEditing(false);
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  const handleLogout = () => {
    dispatch(clearProfile());
    dispatch(clearBalance());
    dispatch(logout());

    toast.success("Logout berhasil");

    navigate("/login");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeInKB = file.size / 1024;
    if (fileSizeInKB > 100) {
      toast.error("Ukuran file maksimal adalah 100 KB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Format file harus JPEG atau PNG");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.put("/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 0) {
        dispatch(setProfile(response.data.data));
        toast.success("Foto profil berhasil diperbarui!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengupload gambar");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-slate-200 overflow-hidden border border-gray-200">
            <img
              className="w-full h-full object-cover"
              src={
                profile?.profile_image &&
                !profile.profile_image.includes("null")
                  ? profile.profile_image
                  : defaultProfile
              }
              alt="profile"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />

          <button
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Pencil size={14} className="text-gray-600" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-10">
          {profile
            ? `${profile.first_name} ${profile.last_name}`
            : "Nama Pengguna"}
        </h1>

        {/* form */}
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <AtSign
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                readOnly
                value={profile?.email || ""}
                className="w-full border border-gray-300 rounded-md pl-12 pr-4 py-3 bg-gray-50 text-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nama Depan
            </label>
            <div className="relative">
              <User2
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="first_name"
                readOnly={!isEditing}
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition-all ${
                  isEditing
                    ? "border-gray-400 bg-white"
                    : "border-gray-300 bg-gray-50 text-slate-500 "
                }`}
              />
            </div>
            {formErrors.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.first_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nama Belakang
            </label>

            <div className="relative">
              <User2
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="last_name"
                readOnly={!isEditing}
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition-all ${
                  isEditing
                    ? "border-gray-400 bg-white"
                    : "border-gray-300 bg-gray-50 text-slate-500 "
                }`}
              />
            </div>

            {formErrors.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.last_name}
              </p>
            )}
          </div>

          <div className="pt-6 space-y-4">
            <div className="pt-6 space-y-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 rounded-md font-bold text-red-500 border border-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setOpenLogout(true)}
                    className="w-full py-3 rounded-md font-bold text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="
                    w-full py-3 rounded-md font-bold text-white bg-red-500 
                    hover:bg-red-600 transition-all cursor-pointer
                    flex items-center justify-center
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    "
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Simpan"
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full py-3 rounded-md font-bold text-red-500 border border-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Batalkan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <LogoutModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
      />
    </MainLayout>
  );
};

export default AccountPage;
