"use client";
import { useState } from 'react';

export default function Dashboard() {
  const [date, setDate] = useState("Feb 24, 2023");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Logo</h1>
          </div>
          <nav className="space-y-6">
            <a href="#" className="flex items-center space-x-2 text-lg font-semibold">
              <span>🏠</span>
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <span>📊</span>
              <span>Campaigns</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <span>📍</span>
              <span>Ad Placement</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <span>💬</span>
              <span>Support</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </nav>
        </div>
        <button className="flex items-center space-x-2 mt-auto bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm">
          <span>🚪</span>
          <span>Log out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Your Wildcast</h2>
            <p className="text-gray-600">An overview of your current campaigns, budgets and activities.</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Tom Rhue</p>
            <p className="text-gray-500">tom@gowildcast.com</p>
          </div>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">Relevancy Score</p>
            <h3 className="text-2xl font-bold">93.8%</h3>
            <p className="text-sm text-gray-500 mt-2">+5% than last week</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">Confirmed Listeners</p>
            <h3 className="text-2xl font-bold">390,000</h3>
            <p className="text-sm text-gray-500 mt-2">+15% than last week</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">Unique Podcasts</p>
            <h3 className="text-2xl font-bold">33</h3>
            <p className="text-sm text-gray-500 mt-2">-20% than last week</p>
          </div>
        </div>

        {/* Campaigns and Placements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Campaigns</h3>
            <div className="flex space-x-2">
              <button className="bg-gray-200 p-2 rounded">Today</button>
              <button className="bg-gray-200 p-2 rounded">7 days</button>
              <button className="bg-gray-200 p-2 rounded">30 days</button>
              <button className="bg-gray-200 p-2 rounded">All time</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold">44</p>
              <p className="text-gray-500">Campaigns</p>
              <div className="mt-4">
                <p className="font-semibold">Business</p>
                <p className="font-semibold">Technology</p>
                <p className="font-semibold">Investing</p>
                <p className="font-semibold">Entrepreneurship</p>
                <p className="font-semibold">Other</p>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">Placements</p>
              <p className="text-gray-500">1,200</p>
              <div className="bg-gray-200 rounded-full h-4 mt-2">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Confirmed</span>
                <span>Published</span>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Activity</h3>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">NFT 365 Podcast</p>
              <p className="text-sm text-gray-500">Confirmed your ad reach view</p>
              <p className="text-blue-500 text-sm">Just now</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold">NFT 365 Podcast</p>
              <p className="text-sm text-gray-500">Confirmed your ad reach view</p>
              <p className="text-blue-500 text-sm">Feb 22, 2023</p>
            </div>
            {/* Repeat for additional activity items */}
          </div>
        </div>
      </main>
    </div>
  );
}
