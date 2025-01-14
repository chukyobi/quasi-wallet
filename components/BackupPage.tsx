import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WalletModal from "./BWalletModalComponent";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Frown } from "lucide-react";

type Wallet = {
  id: string;
  name: string;
  publicAddress: string;
  privateKey?: string;
  seedPhrase?: string;
  logo: string | null;
};

const BackupPage = () => {
  const { data: session, status } = useSession();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const userId = session.user.email;

      const fetchWalletsWithPublicAddress = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/backup/wallets/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch wallets");
          }
          const data: Wallet[] = await response.json();
          const walletsWithPublicAddress = data.filter((wallet) => wallet.publicAddress);
          setWallets(walletsWithPublicAddress);
        } catch (error) {
          setError("Failed to fetch wallets, please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchWalletsWithPublicAddress();
    }
  }, [session, status]);

  const handleManageClick = (id: string) => {
    const wallet = wallets.find((wallet) => wallet.id === id);
    if (wallet) {
      setSelectedWallet(wallet);
      setShowModal(true);
    }
  };

  const handleUpdate = async () => {
    if (!selectedWallet) return;

    try {
      const updatedData = {};

      const response = await fetch(`/api/wallets/${selectedWallet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update wallet");
      }

      const updatedWallet: Wallet = await response.json();
      setSelectedWallet(updatedWallet);

      setWallets((prevWallets) =>
        prevWallets.map((wallet) =>
          wallet.id === updatedWallet.id ? updatedWallet : wallet
        )
      );

      setSuccessMessage("Wallet updated successfully!");
      setShowModal(false);
    } catch (error) {
      setError("Failed to update wallet, please try again later.");
    }
  };

  return (
    <div className="w-full bg-zinc-900 p-8 rounded-2xl">
      <h1 className="text-xl font-semibold mb-6">Assets</h1>

      {loading ? (
        <span className="text-gray-400">Loading wallets...</span>
      ) : error ? (
        <span className="text-red-500">{error}</span>
      ) : wallets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="p-6 border border-zinc-700 rounded-xl bg-zinc-800">
              <div className="flex items-center mb-4 space-x-4">
                <Image
                  src={wallet.logo || "/default-logo.svg"}
                  alt={wallet.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold truncate">{wallet.name}</h2>
              </div>
              <p className="text-sm text-gray-400 truncate">
                <strong>Public Address:</strong> {wallet.publicAddress}
              </p>

              <Button
                onClick={() => handleManageClick(wallet.id)}
                className="mt-4 bg-zinc-900 text-white hover:bg-zinc-800 w-full"
              >
                Manage Wallet
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <Frown className="h-16 w-16 text-gray-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-300">You have no backed-up wallets</h2>
          <p className="text-sm text-gray-500 mt-2">
            Backup your wallets to securely store and manage your assets.
          </p>
        </div>
      )}

      {showModal && selectedWallet && (
        <WalletModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedWallet(null);
          }}
          wallet={selectedWallet}
          onUpdate={handleUpdate}
        />
      )}

      {successMessage && (
        <div className="mt-4 text-green-500">
          <strong>{successMessage}</strong>
        </div>
      )}
    </div>
  );
};

export default BackupPage;
