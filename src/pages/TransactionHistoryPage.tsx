import { useEffect, useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProfileSection from "@/components/section/ProfileSection";
import api from "@/services/axios";
import type { History } from "@/types/history";
import toast from "react-hot-toast";
import LoadingSkeleton from "@/components/LoadingSkeleteon";
import { Loader } from "lucide-react";

const TransactionHistory = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  const [isLoading, setIsLoading] = useState(false);

  const getTrxHistory = useCallback(
    async (currentOffset: number) => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/transaction/history?offset=${currentOffset}&limit=${limit}`,
        );
        const newRecords = response.data.data.records;

        setHistory((prev) => {
          const filteredNewRecords = newRecords.filter(
            (newRec: any) =>
              !prev.some(
                (oldRec) => oldRec.invoice_number === newRec.invoice_number,
              ),
          );

          return [...prev, ...filteredNewRecords];
        });

        if (newRecords.length < limit) {
          setHasMore(false);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  const handleShowMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
  };

  useEffect(() => {
    getTrxHistory(offset);
  }, [offset, getTrxHistory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp.");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options).replace(",", "") + " WIB";
  };

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <ProfileSection />

        <section className="mb-14">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Semua Transaksi
          </h2>

          <div className="grid grid-cols-1 gap-5">
            {history.map((item, index) => {
              const isTopUp = item.transaction_type === "TOPUP";

              return (
                <div
                  key={`${item.invoice_number}-${index}`}
                  className="flex justify-between items-center p-4 border border-gray-100 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xl font-bold ${isTopUp ? "text-emerald-500" : "text-orange-500"}`}
                    >
                      {isTopUp ? "+ " : "- "}
                      {formatCurrency(item.total_amount)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {formatDate(item.created_on)}
                    </span>
                  </div>

                  <div className="text-right text-gray-700 text-sm font-medium">
                    {item.description}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <>
                <LoadingSkeleton className="w-full h-20" />
                <LoadingSkeleton className="w-full h-20" />
                <LoadingSkeleton className="w-full h-20" />
              </>
            )}
          </div>

          {hasMore && history.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleShowMore}
                className="text-orange-500 font-bold text-sm hover:underline transition-all cursor-pointer"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  "Show More"
                )}
              </button>
            </div>
          )}

          {history.length === 0 && !hasMore && (
            <p className="text-center text-gray-400 mt-10">
              Belum ada riwayat transaksi
            </p>
          )}
        </section>
      </main>
    </MainLayout>
  );
};

export default TransactionHistory;
