import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import ProfileSection from "@/components/section/ProfileSection";
import type { Services } from "@/types/services";
import api from "@/services/axios";
import toast from "react-hot-toast";
import { CreditCard, Loader2 } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleteon";
import { useDispatch } from "react-redux";
import { addBalance } from "@/features/balance/balanceSlice";
import ConfirmationModal from "@/components/ConfirmationModal";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { serviceCode } = useParams();

  const [service, setService] = useState<Services | null>(null);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  //modal confirm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const formatRupiah = (value: string) => {
    if (!value) return "";

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const serviceTariff = formatRupiah(String(service?.service_tariff || 0));

  const statusConfig = isConfirm
    ? {
        title: `Rp${serviceTariff} ?`,
        desc: `Beli ${service?.service_name} senilai`,
        suffix: "",
        footer: "Ya, lanjutkan Bayar",
      }
    : isSuccess
      ? {
          title: `Rp${serviceTariff}`,
          desc: `Pembayaran ${service?.service_name} sebesar`,
          suffix: "berhasil!",
          footer: "Kembali ke beranda",
        }
      : isFailed
        ? {
            title: `Rp${serviceTariff}`,
            desc: `Pembayaran ${service?.service_name} sebesar`,
            suffix: "gagal",
            footer: "Kembali ke beranda",
          }
        : {
            title: "",
            desc: "",
            suffix: "",
            footer: "",
          };

  const getService = async () => {
    try {
      if (!serviceCode) {
        navigate("/");

        return;
      }

      const response = await api.get("/services");

      const selectedService = response.data.data.find(
        (item: Services) => item.service_code === serviceCode,
      );

      if (!selectedService) {
        navigate("/");

        return;
      }

      setService(selectedService);
    } catch (error: any) {
      toast.error(error);

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!isConfirm) {
      navigate("/");
      setIsModalOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/transaction", {
        service_code: service?.service_code,
      });

      const responseData = response.data.data;
      const paymentAmount = responseData.total_amount * -1;

      setIsLoading(false);
      setIsConfirm(false);
      setIsSuccess(true);

      dispatch(addBalance(paymentAmount));
      toast.success("Pembayaran berhasil");
    } catch (error: any) {
      setIsLoading(false);
      setIsConfirm(false);
      setIsSuccess(false);
      setIsFailed(true);

      toast.error(error.response?.data?.message || "Pembayaran gagal");
    }
  };

  useEffect(() => {
    getService();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <LoadingSkeleton className="w-full h-100" />
        </main>
      </MainLayout>
    );
  }

  if (!service) {
    return <div className="p-10">Service tidak ditemukan</div>;
  }

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <ProfileSection />
        <section className="mb-14">
          <div className="mb-14">
            <h2 className="text-gray-600 text-lg mb-4">Pembayaran</h2>
            <div className="flex items-center gap-3">
              <div className="border border-gray-100 rounded-md shadow-sm">
                <img
                  src={service.service_icon}
                  alt={service.service_name}
                  draggable={false}
                  className="
                    w-[24px]
                    h-[24px]
                    object-cover
                    pointer-events-none
                  "
                />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {service?.service_name}
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
              <input
                type="text"
                readOnly
                value={`Rp ${service?.service_tariff.toLocaleString("id-ID")}`}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`
              w-full
              text-white cursor-pointer flex items-center justify-center 
              text-white font-semibold py-3 px-4 rounded-md transition-colors 
              ${
                !isLoading
                  ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }
                `}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Bayar"
              )}
            </button>
          </div>

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handlePayment}
            statusConfig={statusConfig}
            loading={isLoading}
            isConfirm={isConfirm}
            isFailed={isFailed}
            isSuccess={isSuccess}
          />
        </section>
      </main>
    </MainLayout>
  );
};

export default PaymentPage;
