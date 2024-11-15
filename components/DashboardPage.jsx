import React from 'react'
import TradingViewMarketQuotes from "../components/TradingViewMarketQuotes"

const DashboardPage = () => {
    const backupWallets = [
        {
          name: "Metamask ",
          balance: "",
          logo: "/assets/metamask.svg",
        },
        {
          name: "Trust Wallet",
          balance: "",
          logo: "/assets/trust-wallet-token.svg",
        },
        {
          name: "Binance",
          balance: "",
          logo: "/assets/binance-svgrepo-com.svg",
        },
      ];
    
  return (
    <>
         <div className=" p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-500 mb-4">
                Backup Wallets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
                {backupWallets.map((wallet, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 bg-zinc-800  p-4 rounded-lg shadow-lg"
                  >
                    <img
                      src={wallet.logo}
                      alt={`${wallet.name} logo`}
                      className="w-12 h-12"
                    />
                    <div>
                      <h4 className="text-md font-semibold text-gray-300">
                        {wallet.name}
                      </h4>
                      <p className="text-sm text-gray-500">{wallet.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TradingViewMarketQuotes />
    </>
  )
}

export default DashboardPage