import { useState } from "react";
import toast from "react-hot-toast";

import { CreditCard, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProfileSection from "@/components/section/ProfileSection";
import api from "@/services/axios";
import { setBalance } from "@/features/balance/balanceSlice";
import { useDispatch } from "react-redux";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const TopUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const nominalList = [10000, 20000, 50000, 100000, 250000, 500000];

  const [isLoading, setIsLoading] = useState(false);

  //modalconfirm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [fixedAmount, setFixedAmount] = useState("0");

  const openModalConfirm = () => {
    setIsModalOpen(true);
    setFixedAmount(amount);
  };

  const MAX_AMOUNT = 1_000_000;
  const formatRupiah = (value: string) => {
    if (!value) return "";

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseAmount = (value: string) => {
    return Number(value.replace(/\D/g, ""));
  };

  const statusConfig = isConfirm
    ? {
        title: `${formatRupiah(fixedAmount)} ?`,
        desc: "Anda yakin untuk Top Up sebesar",
        suffix: "",
        footer: "Ya lanjutkan Top Up",
      }
    : isSuccess
      ? {
          title: formatRupiah(fixedAmount),
          desc: "Top Up sebesar",
          suffix: "berhasil!",
          footer: "Kembali ke beranda",
        }
      : isFailed
        ? {
            title: formatRupiah(fixedAmount),
            desc: "Top Up sebesar",
            suffix: "gagal",
            footer: "Kembali ke beranda",
          }
        : {
            title: "",
            desc: "",
            suffix: "",
            footer: "",
          };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");

    if (!raw) {
      setAmount("");
      setError("");
      return;
    }

    const numeric = Number(raw);

    if (numeric > MAX_AMOUNT) {
      setAmount(String(MAX_AMOUNT));
      setError("Maksimal top up Rp 1.000.000");
      return;
    }

    setAmount(raw);
    setError("");
  };

  const handleTopUp = async () => {
    if (!isConfirm) {
      navigate("/");
      setIsModalOpen(false);
      return;
    }
    const numericAmount = parseAmount(amount);
    setFixedAmount(amount);

    if (!numericAmount) {
      toast.error("Masukkan nominal top up");
      return;
    }

    if (numericAmount > MAX_AMOUNT) {
      toast.error("Maksimal top up Rp 1.000.000");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/topup", {
        top_up_amount: numericAmount,
      });

      const newBalance = response.data.data.balance;

      dispatch(setBalance(newBalance));

      setIsLoading(false);
      setIsConfirm(false);
      setIsSuccess(true);

      toast.success(
        `Top up Rp ${numericAmount.toLocaleString("id-ID")} berhasil`,
      );

      setAmount("");
      setError("");
    } catch (error: any) {
      setIsLoading(false);
      setIsConfirm(false);
      setIsSuccess(false);
      setIsFailed(true);
      toast.error(error.response?.data?.message || "Pembayaran gagal");
    } finally {
      // setIsModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <ProfileSection />

        <section>
          <p className="text-slate-600 mb-2">Silahkan masukan</p>

          <h2 className="text-3xl font-bold text-slate-900 mb-10">
            Nominal Top Up
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <div className="mb-5">
                <div className="relative">
                  <CreditCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Masukkan nominal Top Up"
                    value={formatRupiah(amount)}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="
                      w-full
                      border
                      border-slate-200
                      rounded-md
                      pl-12
                      pr-4
                      py-4
                      outline-none
                      focus:border-red-400
                    "
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                // onClick={handleTopUp}
                onClick={() => openModalConfirm()}
                disabled={!amount || isLoading}
                className={`
                  w-full 
                  h-12 
                  rounded-md 
                  font-medium 
                  transition-all 
                  flex items-center justify-center 
                  ${
                    amount && !isLoading
                      ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Top Up"
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 ">
              {nominalList.map((nominal, index) => (
                <button
                  key={index}
                  onClick={() => setAmount(nominal.toString())}
                  className="
                      cursor-pointer
                      border
                      border-slate-200
                      rounded-md
                      py-4
                      hover:border-red-500
                      hover:text-red-500
                      transition-all
                      font-medium
                    "
                >
                  Rp
                  {nominal.toLocaleString("id-ID")}
                </button>
              ))}
            </div>
          </div>

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleTopUp}
            statusConfig={statusConfig}
            // amount={fixedAmount}
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

export default TopUpPage;
