"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  HomeIcon,
  CogIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState({ name: "John Doe" });

  useEffect(() => {
    // Fetch user data from API when component mounts
    const fetchUserData = async () => {
      const response = await fetch("/api/user"); // Adjust endpoint as needed
      const data = await response.json();
      if (response.ok) {
        setUser(data); // Set user data
      } else {
        console.error("Failed to fetch user data:", data);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-18"
        } bg-white shadow-md flex flex-col justify-between p-4 transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar Content */}
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

        {/* Settings and Logout Buttons */}
        <div className="space-y-4">
          <button className="w-full bg-gray-200 text-gray-700 p-2 rounded flex items-center">
            <CogIcon className="w-6 h-6 text-gray-500" />
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-blue-600 text-white p-2 rounded flex items-center"
          >
            <ArrowUpTrayIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white h-20 px-4 shadow-md">
          {/* Hamburger Menu Icon - Always Visible */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 focus:outline-none"
          >
            <Bars3Icon className="w-8 h-8 text-gray-700" />
          </button>

          <div className="ml-auto flex items-center relative">
            {user && (
              <div className="relative">
                {/* Profile Image */}
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {/* Online Status Indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            )}
            <h1 className="text-md font-bold text-gray-700 ml-2 mr-4">
              {user ? user.name : "Loading..."}
            </h1>
          </div>
        </header>

        <div className="flex gap-4">

          <section className="bg-white p-6 ml-6 mt-4 text-gray-600 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Let's start with the basics
            </h2>
            <p>Get more by setting up a profile you love.</p>
            <div className="relative w-full bg-gray-200 rounded-full h-4 my-4">
              <div className="absolute top-0 left-0 h-4 bg-blue-600 rounded-full"></div>
            </div>
            <ul className="list-none space-y-2">
              <li className="text-blue-600 line-through">Verify email</li>
              <li className="text-blue-600 line-through">
                Complete onboarding profile
              </li>
              <li>Verify your skill</li>
              <li>Take on a challenge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Trending Challenges</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="font-semibold">Challenge 1</p>
                <p>Complete this challenge to earn XP</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="font-semibold">Challenge 2</p>
                <p>Work with others to achieve goals</p>
              </div>
            </div>
          </section>
        </div>

        {/* Trending Challenges */}
      </main>
    </div>
  );
}
