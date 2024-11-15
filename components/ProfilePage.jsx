import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PencilIcon, LayoutDashboard, Calendar, PiggyBank, CreditCard, Settings } from 'lucide-react'
import Image from "next/image"

const ProfilePage = () => {
  return (
    <>
      <div className="flex">
        <Tabs defaultValue="account" className="w-full bg-zinc-900 p-8 rounded-2xl flex">
          {/* Left-aligned tab list */}
          <TabsList className="flex flex-col bg-zinc-900  items-start w-1/4 p-0 mr-4 h-full">
            <TabsTrigger
              value="account"
              className="text-sm data-[state=active]:border-l-4  data-[state=active]:border-yellow-400 rounded-none pb-2 w-full text-left pl-4 py-2"
            >
              Account details
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="text-sm data-[state=active]:border-l-4 data-[state=active]:border-yellow-400 rounded-none pb-2 w-full text-left pl-4 py-2"
            >
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="text-sm data-[state=active]:border-l-4 data-[state=active]:border-yellow-400 rounded-none pb-2 w-full text-left pl-4 py-2"
            >
              Reminders
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
                    <Image
                      src="/placeholder.svg"
                      alt="Jeremy Martins"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">Jeremy Martins</h2>
                      <p className="text-gray-500">Ukraine, Kyiv</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-zinc-900 rounded-full" size="sm">
                    <PencilIcon className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </div>

                <div className="rounded-2xl p-6 border border-zinc-700">
                  <div className="flex items-center justify-between mb-4 ">
                    <h3 className="text-lg font-semibold">Personal information</h3>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full name</Label>
                      <Input value="Jeremy Martins" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value="+380 98 674 53 29" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select defaultValue="male">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value="Jeremy@email.com" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input value="28 Jun 1995" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input value="Ukraine, Kyiv" readOnly />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="bg-zinc-900 text-white hover:bg-zinc-800">
                    Change password
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  )
}

export default ProfilePage
