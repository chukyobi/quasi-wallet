import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WalletModal from "./BWalletModalComponent";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const userId = session.user.email;
      
      const fetchWalletsWithPublicAddress = async () => {
        setLoading(true); // Set loading state to true
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
          setLoading(false); // Set loading state to false
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
      const updatedData = {
        // Include form data or new details for updating the wallet
      };

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

      // Update the wallet in the main list
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
    <div className="flex">
      <Tabs defaultValue="wallets" className="w-full bg-zinc-900 p-8 rounded-2xl flex">
        <TabsList className="flex flex-col bg-zinc-900 items-start w-1/4 p-0 mr-4 h-full">
          {/* Other tab content */}
        </TabsList>
        <TabsContent value="wallets">
          <h1 className="text-xl font-semibold mb-6">Assets</h1>

          {loading ? (
            <span className="text-gray-400">Loading wallets...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wallets.length > 0 ? (
                wallets.map((wallet) => (
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
                ))
              ) : (
                <span className="text-gray-400">You have no backed-up wallets</span>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showModal && selectedWallet && (
        <WalletModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedWallet(null); // Clear selected wallet when modal is closed
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
