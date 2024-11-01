
"use client";
import { ethers } from "ethers";
import { WalletIcon} from '@heroicons/react/24/solid';

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return signer;
  } else {
    alert("Please install a wallet like MetaMask!");
  }
}

export default function WalletConnector() {
  return (
    < div className="bg-yellow-400 p-2 rounded-lg px-4">
      <button onClick={connectWallet} className="flex gap-1 text-slate-950  text-sm font-meduim">
       <WalletIcon className="w-5 h-5"/> Connect-Wallet
       </button>
    </div>
  );
}
