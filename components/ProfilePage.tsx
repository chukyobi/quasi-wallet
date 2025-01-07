import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon } from 'lucide-react';
import Image from "next/image";

interface Wallet {
  id: number;
  walletId: string;
  balance: number;
  currency: string;
}

interface BackupWallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: number;
  amount: number;
  transactionType: string;
  currency: string;
  transactionDate: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  wallets: Wallet[];
  backupWallets: BackupWallet[];
  transactions: Transaction[];
}

const ProfilePage = ({ userEmail }: { userEmail: string }) => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`/api/user/${userEmail}`); // Fix: Use backticks for string interpolation
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch user data");

        setProfileData(data);
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !profileData) {
    return <div>{error || "User not found"}</div>;
  }

  return (
    <div className="flex">
      <Tabs defaultValue="account" className="w-full bg-zinc-900 p-8 rounded-2xl flex">
        {/* Left-aligned tab list */}
        <TabsList className="flex flex-col bg-zinc-900 items-start w-1/4 p-0 mr-4 h-full">
          <TabsTrigger
            value="account"
            className="text-sm data-[state=active]:border-l-4 data-[state=active]:border-yellow-400 rounded-none pb-2 w-full text-left pl-4 py-2"
          >
            Account details
          </TabsTrigger>

          <TabsTrigger
            value="premium"
            className="text-sm data-[state=active]:border-l-4 data-[state=active]:border-yellow-400 rounded-none pb-2 w-full text-left pl-4 py-2"
          >
            Premium account
          </TabsTrigger>
        </TabsList>

        {/* Vertical divider */}
        <div className="border-r border-zinc-700"></div>

        {/* Right-aligned content */}
        <div className="flex-grow">
          <TabsContent value="account">
            <div className="space-y-8">
              <div className="flex items-center justify-between rounded-2xl p-6 border border-zinc-700">
                <div className="flex items-center gap-4">
                  {profileData.name ? (
                    <div
                      className="flex items-center justify-center bg-blue-500 text-white font-semibold text-2xl rounded-full"
                      style={{ width: 80, height: 80 }}
                    >
                      {profileData.name
                        .split(" ") // Split the name into words
                        .map(word => word[0]) // Get the first letter of each word
                        .join("") // Combine them into a single string
                        .toUpperCase()} {/* Convert to uppercase */}
                    </div>
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt="Placeholder"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{profileData.name}</h2>
                    <p className="text-gray-500">{profileData.email}</p>
                  </div>
                </div>


              </div>

              <div className="rounded-2xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4 ">
                  <h3 className="text-lg font-semibold">Personal information</h3>

                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full name</Label>
                    <Input value={profileData.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profileData.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Wallets</Label>
                    <div>
                      {profileData.wallets.map((wallet) => (
                        <div key={wallet.id} className="text-sm">
                          {wallet.currency}: {wallet.balance} {wallet.currency}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Wallets</Label>
                    <div>
                      {profileData.backupWallets.map((backupWallet) => (
                        <div key={backupWallet.id} className="text-sm">
                          {backupWallet.name}: {backupWallet.balance} {backupWallet.currency}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Transactions</Label>
                    <div>
                      {profileData.transactions.map((transaction) => (
                        <div key={transaction.id} className="text-sm">
                          {transaction.transactionType}: {transaction.amount} {transaction.currency} on {transaction.transactionDate}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="premium">
            <div className="space-y-8">
              <div className="flex items-center justify-between rounded-2xl p-6 border border-zinc-700">
                <div className="flex items-center gap-4">
                  {/* Optionally, include an icon or image */}
                  <div
                    className="flex items-center justify-center bg-yellow-500 text-white font-semibold text-2xl rounded-full"
                    style={{ width: 80, height: 80 }}
                  >
                    <PencilIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Premium Account</h2>
                    <p className="text-gray-500">Premium accounts are coming soon!</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-4 ">
                  <h3 className="text-lg font-semibold">Coming Soon</h3>
                </div>
                <p className="text-gray-500 text-center">Our premium account features are on the way. Stay tuned!</p>
              </div>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
};

// Fetch user data server-side
export async function getServerSideProps(context: any) {
  const { email } = context.params;

  const res = await fetch(`${process.env.API_URL}/api/user/${email}`); // Fix: Use backticks for string interpolation
  const user = await res.json();

  if (!user) {
    return { notFound: true };
  }

  return {
    props: { userEmail: email }, // Pass the email to the ProfilePage
  };
}

export default ProfilePage;
