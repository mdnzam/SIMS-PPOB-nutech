import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `transition-all hover:text-red-500 ${
      isActive ? "text-red-500 font-bold" : "text-slate-700"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
              <img
                className="w-full h-full object-cover"
                src={logo}
                alt="logo"
              />
            </div>
            <h1 className="font-bold text-slate-900">SIMS PPOB</h1>
          </Link>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <NavLink to="/topup" className={navLinkStyle}>
              Top Up
            </NavLink>

            <NavLink to="/transaction" className={navLinkStyle}>
              Transaction
            </NavLink>

            <NavLink to="/account" className={navLinkStyle}>
              Akun
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
