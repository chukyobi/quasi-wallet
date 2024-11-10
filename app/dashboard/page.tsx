"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import TradingView1 from "../../components/TradingView1";
import TradingViewMarketQuotes from "../../components/TradingViewMarketQuotes";
import {
  RectangleGroupIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  FolderArrowDownIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3BottomLeftIcon,
  EyeSlashIcon,
  EyeIcon,
  ArrowDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCog,
//   faMoneyBillTransfer,
//   faArrowUpRightFromSquare,
//   faBars,
//   faWallet,
// } from "@fortawesome/free-solid-svg-icons";



// all props interfaces
interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

interface MainContentProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  session: Session | null;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

interface NavbarProps {
  session: any;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

interface TabContentProps {
  activeTab: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <MainContent
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

function Sidebar({
  isSidebarOpen,
  
  handleLogout,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-18"
      } bg-gray-800 shadow-md flex flex-col justify-between p-4 transition-all duration-300 ease-in-out`}
    >
      <div>
        <h2
          className={`text-2xl font-bold text-green-600 mb-8 ${
            isSidebarOpen ? "" : "hidden"
          }`}
        >
          Logo
        </h2>
        <nav>
          <ul>
            <li
              className={`my-2 py-4 px-2 space-x-2 flex items-center rounded-lg ${
                activeTab === "overview" ? "bg-gray-600" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <RectangleGroupIcon className="w-6 h-6 text-gray-200" />
              {isSidebarOpen && (
                <span className="ml-1 text-gray-200 font-medium">
                  Dashboard
                </span>
              )}
            </li>
            <li
              className={`my-2 py-4 px-2 space-x-2 flex items-center rounded-lg ${
                activeTab === "transactions" ? "bg-gray-600" : ""
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              <CurrencyDollarIcon className="w-6 h-6 text-gray-200" />
              {isSidebarOpen && (
                <span className="ml-1 text-gray-200 font-medium">
                  Transactions
                </span>
              )}
            </li>
            <li
              className={`my-2 py-4 px-2 space-x-2 flex items-center rounded-lg ${
                activeTab === "assets" ? "bg-gray-600" : ""
              }`}
              onClick={() => setActiveTab("assets")}
            >
              <FolderArrowDownIcon className="w-6 h-6 text-gray-200" />
              {isSidebarOpen && (
                <span className="ml-1 text-gray-200 font-medium">Assets</span>
              )}
            </li>

            <li
              className={`my-2 py-4 px-2 space-x-2 flex items-center rounded-lg ${
                activeTab === "extra" ? "bg-gray-600" : ""
              }`}
              onClick={() => setActiveTab("extra")}
            >
              <ChartPieIcon className="w-6 h-6 text-gray-200" />
              {isSidebarOpen && (
                <span className="ml-1 text-gray-200 font-medium">
                  Extra Page
                </span>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div className="space-y-3">
        <button className="w-full  text-gray-200 p-2 rounded flex items-center">
          <Cog6ToothIcon className="w-6 h-6 text-gray-200" />
          {isSidebarOpen && <span className="ml-3">Settings</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-green-600 text-white py-3 px-2 rounded flex items-center"
        >
          <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
          {isSidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function MainContent({
  isSidebarOpen,
  setIsSidebarOpen,
  session,
  activeTab,
 
}: MainContentProps) {
  return (
    <main className="flex flex-col flex-auto overflow-hidden">
      <Navbar
        session={session}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <TabContent activeTab={activeTab} />
    </main>
  );
}

function Navbar({ session, isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  return (
    <header className="flex justify-between items-center bg-white h-20 z-20 px-4 shadow-md py-3">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 focus:outline-none"
      >
        <Bars3BottomLeftIcon className="w-8 h-8 text-gray-700" />
      </button>
      <div className="ml-auto flex items-center">
        {session?.user && (
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-100 font-bold">
              {session.user.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") ?? "User"}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <h1 className="text-md font-bold text-gray-700 ml-2">
              {session.user.name ?? "User"}
            </h1>
          </div>
        )}
      </div>
    </header>
  );
}

function TabContent({ activeTab }: TabContentProps) {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // To toggle wallet value visibility
  const [isPnlVisible, setIsPnlVisible] = useState(true); // To toggle PnL visibility

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const togglePnlVisibility = () => {
    setIsPnlVisible(!isPnlVisible);
  };

  const isProfit = true; // Replace `true` with any logic needed to determine profit

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
    <div className="flex flex-col gap-4 overflow-y-auto">
      <section className="p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Left Column (3/4 Width): Income and Chart Section */}
            <div>
              {/* Backup Wallets Section */}
              <div className=" p-6 border border-gray-300 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  Backup Wallets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
                  {backupWallets.map((wallet, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <img
                        src={wallet.logo}
                        alt={`${wallet.name} logo`}
                        className="w-12 h-12"
                      />
                      <div>
                        <h4 className="text-md font-semibold text-gray-700">
                          {wallet.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {wallet.balance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Section */}
              <div className="">{/* <TradingViewMarketQuotes /> */}</div>
            </div>

            {/* Right Column */}
            <div className="items-center ">
              {/*  Wallet Section */}
              <div className="p-6  flex flex-col items-center border border-gray-300 rounded-2xl">
                <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="text-lg font-bold text-black">
                    Total Balance
                  </h3>
                  <button
                    onClick={toggleVisibility}
                    className="text-sm text-black p-2 "
                  >
                    {isVisible ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Wallet Value Section */}
                <div className="text-5xl font-bold text-black mb-2">
                  {isVisible ? "$10,000" : "****"}
                </div>

                {/* PnL Section */}
                <div
                  className={`text-sm font-semibold mb-4 ${
                    isProfit ? "text-black" : "text-red-600"
                  }`}
                >
                  {isPnlVisible ? `${isProfit ? "+" : "-"}10% PnL` : "****"}
                  <button
                    onClick={togglePnlVisibility}
                    className="ml-2 text-sm text-gray-500 "
                  >
                    {isPnlVisible ? "(Hide)" : "(Show)"}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex items-center gap-2 text-sm text-white bg-gray-800  rounded-2xl px-6 py-3 hover:bg-black"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                    Send
                  </button>
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className="flex items-center gap-2 text-sm bg-gray-800 text-white rounded-2xl  px-4 py-3 hover:bg-black"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Receive
                  </button>
                </div>
              </div>
              <div className="mt-6 w-full items-center">
                <TradingView1 />
              </div>
            </div>
          </div>
        )}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-lg font-bold">Transactions</h2>
          </div>
        )}
        {activeTab === "assets" && (
          <div>
            <h2 className="text-lg font-bold">Assets</h2>
          </div>
        )}
        {activeTab === "extra" && (
          <div>
            <h2 className="text-lg font-bold">Extra Page</h2>
          </div>
        )}
      </section>
    </div>
  );
}
