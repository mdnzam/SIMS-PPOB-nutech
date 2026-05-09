import defaultProfile from "@/assets/profile-photo.png";
import bgBalance from "@/assets/bg-saldo.png";
import { useAppSelector } from "@/hooks/redux";
import { toggleBalance } from "@/features/balance/balanceSlice";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import LoadingSkeleton from "../LoadingSkeleteon";

const ProfileSection = () => {
  const minioBaseUrl = import.meta.env.VITE_MINIO_ENDPOINT;
  const dispatch = useDispatch();

  const profile = useAppSelector((state) => state.profile.profile);
  const loadingProfile = useAppSelector((state) => state.profile.loading);
  const { balance, showBalance } = useAppSelector((state) => state.balance);

  // const [showBalance, setShowBalance] = useState(false);

  // useEffect(() => {
  //   dispatch(getProfile());
  //   dispatch(getBalance());
  // }, [dispatch]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
      <div>
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-slate-200 overflow-hidden mb-4">
          {loadingProfile ? (
            <LoadingSkeleton className="w-full h-10" />
          ) : (
            <img
              className="w-full h-full object-cover"
              src={
                profile?.profile_image &&
                profile.profile_image !== `${minioBaseUrl}/take-home-test/null`
                  ? profile.profile_image
                  : defaultProfile
              }
              alt="profile"
            />
          )}
        </div>

        <p className="text-slate-500 text-lg">Selamat datang,</p>

        <h2 className="text-4xl font-bold text-slate-900">
          {loadingProfile ? (
            <LoadingSkeleton className="w-full h-10" />
          ) : (
            `${profile?.first_name} ${profile?.last_name}`
          )}
        </h2>
      </div>

      <div
        className="
          w-full
          rounded-3xl
          p-8
          text-white
          relative
          overflow-hidden
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: `url(${bgBalance})`,
        }}
      >
        <div className="relative z-10">
          <p className="text-sm mb-2">Saldo anda</p>

          <h3 className="text-4xl font-bold mb-6 tracking-wide">
            {showBalance
              ? `Rp ${balance?.toLocaleString("id-ID")}`
              : "Rp ******"}
          </h3>

          <button
            onClick={() => dispatch(toggleBalance())}
            className="
              text-sm
              flex
              items-center
              gap-2
              hover:opacity-80
              transition-all
              cursor-pointer
            "
          >
            {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
            {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
