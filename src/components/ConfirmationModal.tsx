import logo from "@/assets/logo.png";
import { CheckIcon, Loader, X } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleteon";

interface ConfigModal {
  title: string;
  desc: string;
  suffix: string;
  footer: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  isConfirm: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  statusConfig: ConfigModal;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  isSuccess,
  isFailed,
  isConfirm,
  statusConfig,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
        {isConfirm ? (
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-6">
            {loading ? (
              <Loader className="w-full h-5" />
            ) : (
              <img
                className="w-full h-full object-cover"
                src={logo}
                alt="logo"
              />
            )}
          </div>
        ) : (
          ""
        )}

        {isSuccess ? (
          <div className="w-12 h-12 bg-green-500 rounded-full text-white flex items-center justify-center mb-6">
            <CheckIcon className="w-full h-5" />
          </div>
        ) : (
          ""
        )}

        {isFailed ? (
          <div className="w-12 h-12 bg-red-500 rounded-full text-white flex items-center justify-center mb-6">
            <X className="w-full h-5" />
          </div>
        ) : (
          ""
        )}

        <div className="flex flex-col items-center text-center mb-8">
          <p className="text-gray-600 text-sm mb-1">{statusConfig.desc}</p>
          <h2 className="text-2xl font-bold text-gray-900">
            {statusConfig.title}
          </h2>
          {statusConfig.suffix && (
            <p className="text-sm mt-1 text-gray-600">{statusConfig.suffix}</p>
          )}
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={onConfirm}
            className="w-full text-red-500 flex items-center justify-center  font-bold hover:text-lg hover:text-red-600  transition-colors py-2 cursor-pointer"
          >
            {loading ? (
              <LoadingSkeleton className="w-full h-5" />
            ) : (
              statusConfig.footer
            )}
          </button>

          {isConfirm ? (
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center  text-gray-400 font-medium hover:text-gray-600 transition-colors py-2 cursor-pointer"
            >
              {loading ? (
                <LoadingSkeleton className="w-full h-5" />
              ) : (
                "Batalkan"
              )}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
