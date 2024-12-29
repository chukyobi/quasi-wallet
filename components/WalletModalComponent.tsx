import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { formatEther } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BackupWallet {
  id: number;
  name: string;
  balance: number;
  logo: string | null;
  currency: string | null;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWallet: BackupWallet | null;
  modalStep: "initial" | "connecting" | "success" | "error";
  setModalStep: React.Dispatch<
    React.SetStateAction<"initial" | "connecting" | "success" | "error">
  >;
  loading: boolean;
  error: string | null;
  walletAddress: string | null;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  selectedWallet,
  modalStep,
  setModalStep,
  loading,
  error,
  walletAddress,
}) => {
  const [preloader, setPreloader] = useState(false); 
  const [dynamicError, setDynamicError] = useState<string | null>(null);
  const { data: session } = useSession();

  const userId = session?.user?.email;

  // Function to connect to the wallet
  const connectWallet = async () => {
    setPreloader(true); 
    setDynamicError(null);

    setTimeout(async () => {
      setModalStep("connecting");
      setPreloader(false);
      
      

      if (typeof window.ethereum === "undefined") {
        setDynamicError("MetaMask is not installed. Please download it.");
        
        setModalStep("error");
        setPreloader(false); 
        return;
      }

      try {
        // Request access to MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const publicAddress = accounts[0];

          // Fetch wallet balance
          const balanceWei = await window.ethereum.request({
            method: "eth_getBalance",
            params: [publicAddress, "latest"],
          });

          const balance = formatEther(balanceWei);

          // Call backend API to store wallet data
          const response = await fetch(
            `/api/backup/storeWalletData/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                publicAddress,
                balance,
                walletName: selectedWallet?.name,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Wallet data saved successfully", data);
            setModalStep("success");
          } else {
            throw new Error("Failed to save wallet data");
          }
        } else {
          throw new Error("No accounts found in MetaMask.");
        }
      } catch (err: any) {
        setDynamicError(err.message || "Failed to connect to MetaMask.");
        setModalStep("error");
      }
    }, 5000); 
  };

  if (!selectedWallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      {modalStep !== "success" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {modalStep === "initial" &&
                `Connect Your ${selectedWallet?.name} Wallet`}
              {modalStep === "connecting" && "Connecting..."}
              {modalStep === "error" && "Connection Failed"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {preloader && (
              <div className="flex flex-col justify-center items-center">
                <img
                  src={selectedWallet.logo || "/default-logo.png"}
                  alt={`${selectedWallet.name} logo`}
                  className="animate-zoom w-20 h-20"
                />
                <p className="text-small text-green-600 mt-6 mb-6">Establishing Connection...</p>
               
              </div>
            )}

            {!preloader && modalStep === "initial" && (
              <div className="text-center">
                <Button onClick={connectWallet} disabled={loading}>
                  {loading ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            )}

            {modalStep === "error" && (
              <div className="space-y-4">
                <p className="text-center text-red-500">
                  {dynamicError || "An error occurred. Please try again."}
                </p>
                <div className="flex justify-center gap-2">
                  <Button className="bg-red-600" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button className="bg-black">Connect Manually</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      )}

      {modalStep === "success" && walletAddress && selectedWallet && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Scan the QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-center">
              <QRCodeSVG value={walletAddress || ""} size={256} />
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default WalletModal;
