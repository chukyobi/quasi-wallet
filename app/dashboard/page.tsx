"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  HomeIcon,
  CogIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-18"
        } bg-white shadow-md flex flex-col justify-between p-4 transition-all duration-300 ease-in-out`}
      >
        <div>
          <h2
            className={`text-2xl font-bold text-gray-700 mb-8 ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            Logo
          </h2>
          <nav>
            <ul>
              <li className="my-4 flex items-center">
                <HomeIcon className="w-6 h-6 text-blue-600" />
                {isSidebarOpen && (
                  <span className="ml-3 text-blue-600 font-medium">
                    Dashboard
                  </span>
                )}
              </li>
            </ul>
          </nav>
        </div>
        <div className="space-y-4">
          <button className="w-full bg-gray-200 text-gray-700 p-2 rounded flex items-center">
            <CogIcon className="w-6 h-6 text-gray-500" />
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white p-2 rounded flex items-center"
          >
            <ArrowUpTrayIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-auto">
        <header className="flex justify-between items-center bg-white h-20 px-4 shadow-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 focus:outline-none"
          >
            <Bars3Icon className="w-8 h-8 text-gray-700" />
          </button>
          <div className="ml-auto flex items-center relative">
            {session?.user ? (
              <>
                <div className="relative w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-100 font-bold">
                  {/* User initials */}
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") ?? "User"}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
                </div>

                <h1 className="text-md font-bold text-gray-700 ml-2 mr-4">
                  {session.user.name ?? "User"}
                </h1>
              </>
            ) : (
              <div className="relative w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-100 font-bold">
                JD
                
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
              </div>
            )}
          </div>
        </header>

        <div className="flex gap-4">
          <section className="bg-white p-6 ml-6 mt-4 text-gray-600 rounded-lg shadow-md h-64 w-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              User Dashboard
            </h2>
            {session?.user ? (
              <p className="text-gray-600">
                Welcome back, {session.user.name ?? "User"}!
              </p>
            ) : (
              <p>Please login to see your dashboard content.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
