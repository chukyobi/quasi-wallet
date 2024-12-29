import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WalletModal from "./WalletModalComponent";
import TradingViewMarketQuotes from "./TradingViewMarketQuotes";

interface BackupWallet {
  id: number;
  name: string;
  balance: number;
  logo: string | null;
  currency: string | null;
}

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [backupWallets, setBackupWallets] = useState<BackupWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<BackupWallet | null>(null);
  const [modalStep, setModalStep] = useState<"initial" | "connecting" | "success" | "error">("initial");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const userId = session?.user?.email;
    if (!userId) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }

    const fetchBackupWallets = async () => {
      try {
        const response = await fetch(`/api/backup/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch backup wallets.");
        const data = await response.json();
        setBackupWallets(data.wallets || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBackupWallets();
  }, [session, status]);

  const openModal = (wallet: BackupWallet) => {
    setSelectedWallet(wallet);
    setIsModalOpen(true);
    setModalStep("initial");
    setError(null);  
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWallet(null);
    setModalStep("initial");
    setError(null);  
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading backup wallets...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-500 mb-4">Backup Wallets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {backupWallets.length > 0 ? (
            backupWallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center space-x-4 bg-zinc-800 p-4 rounded-lg shadow-lg cursor-pointer"
                onClick={() => openModal(wallet)}
              >
                <img
                  src={wallet.logo || "/default-wallet-logo.svg"}
                  alt={`${wallet.name} logo`}
                  className="w-12 h-12"
                />
                <div>
                  <h4 className="text-md font-semibold text-gray-300">
                    {wallet.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Balance: {wallet.balance} {wallet.currency || "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No backup wallets found.</p>
          )}
        </div>

        <WalletModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedWallet={selectedWallet}
          modalStep={modalStep}
          setModalStep={setModalStep}
          loading={loading}
          error={error}
          walletAddress={walletAddress}
        />
      </div>

      <TradingViewMarketQuotes />
    </>
  );
};

export default DashboardPage;
