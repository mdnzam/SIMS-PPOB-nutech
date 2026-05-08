interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ open, onClose, onConfirm }: LogoutModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
          Logout
        </h2>

        <p className="text-slate-500 text-center mb-8">
          Yakin ingin keluar dari akun?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-300 hover:bg-slate-100 transition-all py-3 rounded-xl font-medium"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 transition-all text-white py-3 rounded-xl font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
