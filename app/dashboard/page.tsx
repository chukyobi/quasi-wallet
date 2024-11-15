"use client";
import {
  useState,
  useEffect,
  useLayoutEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Calendar,
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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


import TradingView1 from "../../components/TradingView1";
import DashboardPage from "../../components/DashboardPage";
import ProfilePage from "../../components/ProfilePage";
import CalendarPage from "../../components/CalendarPage";
import TransactionPage from "../../components/TransactionPage";
import BackupPage from "../../components/BackupPage";
import SettingsPage from "../../components/SettingsPage";

import { Transaction } from "ethers";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true); // To toggle wallet value visibility
  const [isPnlVisible, setIsPnlVisible] = useState(true); // To toggle PnL visibility
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state
  const [activePage, setActivePage] = useState("Dashboard");

  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && session?.user?.email) {
      const userId = session.user.email;
      setUserId(userId);

      const fetchUserName = async () => {
        try {
          const response = await fetch(`/api/user/${userId}`);

          const data = await response.json();

          if (response.ok) {
            setUserName(data.name);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      };

      fetchUserName();
    }
  }, [status, session, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const togglePnlVisibility = () => {
    setIsPnlVisible(!isPnlVisible);
  };

  const fetchBalance = async () => {
    if (!userId) {
      console.error("No user ID provided");
      return;
    }
    try {
      const response = await fetch(`/api/wallet/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId]);

  const handleAddFunds = async () => {
    if (amount <= 0 || !currency) {
      alert("Please enter a valid amount and currency");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/wallet/addFunds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, currency }),
    });

    const result = await response.json();
    setIsSubmitting(false);
  };

  // Content for each page
  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
           <DashboardPage />
          </>
        );
      case "Profile":
        return (
          <>
            <ProfilePage />
          </>
        );
      case "Calendar":
        return (
          <>
            <CalendarPage />
          </>
        );
      case "Transactions":
        return (
          <>
           <TransactionPage />
          </>
        );
      case "Goldman Chest":
        return (
          <>
            <BackupPage />
          </>
        );
      case "Settings":
        return (
          <>
           <SettingsPage />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Sidebar */}
      <div
        className={`w-64 border-r border-zinc-800 p-6 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-yellow-400" />
          <span className="font-semibold">Goldmanprivate</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-100 font-bold">
              {userName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") ?? "User"}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <div>
              <div className="font-medium">{userName ?? "User"}</div>
              <div className="text-sm text-zinc-400">23 credits</div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setActivePage("Dashboard")}
            className={`w-full justify-start ${
              activePage === "Dashboard" ? "bg-yellow-400 text-gray-900" : "text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActivePage("Profile")}
            className={`w-full justify-start ${
              activePage === "Profile" ? "bg-yellow-400 text-gray-900" : "text-white"
            }`}
          >
            <Calendar className="h-4 w-4" /> Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActivePage("Calendar")}
            className={`w-full justify-start ${
              activePage === "Calendar" ? "bg-yellow-400 text-gray-900" : "text-white"
            }`}
          >
            <Calendar className="h-4 w-4" /> Calendar
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActivePage("Transactions")}
            className={`w-full justify-start ${
              activePage === "Transactions" ? "bg-yellow-400 text-gray-900" : "text-white"
            }`}
          >
            <CreditCard className="h-4 w-4" /> Transactions
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActivePage("Goldman Chest")}
            className={`w-full justify-start ${
              activePage === "Goldman Chest" ? "bg-yellow-400 text-gray-900" : "text-white"
            }`}
          >
            <PiggyBank className="h-4 w-4" /> Goldman Chest
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActivePage("Settings")}
            className={`w-full justify-start ${
              activePage === "Settings" ? "bg-yellow-400 text-gray-900" : "text-white"
            }`}
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </nav>

        <div className="mt-auto pt-4 space-between">
          <Button
            onClick={handleLogout}
            size="sm"
            className=" w-full py-5 px-2  bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto scroll-container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Hamburger Icon */}
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-50 hover:text-yellow-400"
            >
              <Bars3BottomLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>

          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
            + Transaction
          </Button>
        </div>
        {renderContent()}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-zinc-800 p-6 bg-black">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between w-full mb-4">
              <h3 className="text-lg font-bold ">Total Balance</h3>
              <button onClick={toggleVisibility} className="text-sm  p-2 ">
                {isVisible ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-3xl font-bold">
              {isVisible
                ? balance !== null
                  ? `$${balance?.toFixed(2)}`
                  : "No Wallet Found"
                : "****"}
            </div>
          </div>

          <div className="relative h-2 bg-zinc-800 rounded">
            <div className="absolute h-full w-3/4 bg-yellow-400 rounded" />
          </div>

          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 text-sm text-white bg-zinc-900 rounded-2xl px-6 py-3 hover:bg-black">
              <ArrowDownIcon className="w-4 h-4" />
              Send
            </button>
            <button className="flex items-center gap-2 text-sm bg-zinc-900 text-white rounded-2xl px-4 py-3 hover:bg-black">
              <PlusIcon className="w-4 h-4" />
              Receive
            </button>
          </div>

          <Separator className="bg-zinc-800" />

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="h-8 w-12 rounded bg-yellow-400" />
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-zinc-700" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                </div>
              </div>
              <div className="text-lg font-mono mb-2">**** **** **** 1289</div>
              <div className="text-sm text-zinc-400">09/25</div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full bg-zinc-900 border-zinc-800"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Card
          </Button>

          <TradingView1 />
        </div>
      </div>
    </div>
  );
}
