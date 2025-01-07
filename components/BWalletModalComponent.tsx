import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

interface Wallet {
  name: string;
  logo: string | null;
  publicAddress: string;
  privateKey?: string; 
  seedPhrase?: string; 
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet;
  onUpdate: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, wallet, onUpdate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wallet Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              src={wallet.logo || "/default-logo.svg"}
              alt={wallet.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <h2 className="text-lg font-semibold">{wallet.name}</h2>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              <strong>Public Address:</strong> {wallet.publicAddress}
            </p>
          </div>

          {/* Private key section */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              <strong>Private Key:</strong>
              <span className="ml-2">{wallet.privateKey || "Not available"}</span>
            </p>
          </div>

          {/* Seed phrase section */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              <strong>Seed Phrase:</strong>
              <span className="ml-2">{wallet.seedPhrase || "Not available"}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <QRCodeSVG value={wallet.publicAddress || ""} size={128} />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={onUpdate} className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
