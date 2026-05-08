import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { getProfile } from "@/features/profile/profileSlice";
import { getBalance } from "./features/balance/balanceSlice";

const App = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
      dispatch(getBalance());
    }
  }, [token]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />;
    </>
  );
};

export default App;
