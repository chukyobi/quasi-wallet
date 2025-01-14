import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LockIcon, TrendingUpIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const GoldmanX = () => {
  return (
    <div className="p-8 bg-zinc-900 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <img
          src="/assets/goldmanx-profile.jpg"
          alt="Goldman X Trading and Investment Platform"
          className="h-24 w-24 rounded-full mb-4"
        />
        <h1 className="text-4xl font-bold">Goldman X</h1>
        <p className="text-lg text-gray-400">
          A next-generation trading and investment platform designed to empower traders and investors.
        </p>
      </div>

      {/* About Goldman X Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">About Goldman X</h2>
        <Card className="p-6 bg-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-300">
                Goldman X is at the forefront of modern trading and investment solutions. Our platform
                offers cutting-edge tools and features that allow users to track, analyze, and execute
                trades and investments with ease. Whether you are a beginner or a professional, Goldman
                X has everything you need to optimize your trading experience.
              </p>
              <p className="text-lg text-gray-300 mt-4">
                With advanced algorithms, real-time data, and an intuitive user interface, Goldman X ensures
                that you stay ahead of the market. Join us today and take your trading to the next level.
              </p>
            </div>
            <div className="relative h-60">
              <Image
                src="/assets/goldmanx-trading.jpg" 
                alt="Goldman X Platform"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 bg-zinc-800 text-center">
            <TrendingUpIcon className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-300">
              Access real-time analytics and performance insights for your investments and trades.
            </p>
          </Card>
          <Card className="p-6 bg-zinc-800 text-center">
            <LockIcon className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
            <p className="text-gray-300">
              Benefit from state-of-the-art security measures to protect your investments and personal data.
            </p>
          </Card>
          <Card className="p-6 bg-zinc-800 text-center">
            <TrendingUpIcon className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-300">
              Our customer support team is available round-the-clock to assist you with any queries.
            </p>
          </Card>
        </div>
      </section>

      {/* Price Tabs Section (Coming Soon) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 bg-zinc-700 text-center opacity-60 cursor-not-allowed">
            <h3 className="text-xl font-semibold mb-2">Basic Plan</h3>
            <p className="text-lg text-gray-300">Free</p>
            <p className="text-gray-400">Basic trading features and analytics.</p>
            <Button size="sm" variant="outline" className="mt-4" disabled>
              Coming Soon
            </Button>
          </Card>

          <Card className="p-6 bg-zinc-700 text-center opacity-60 cursor-not-allowed">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-lg text-gray-300">$19.99/month</p>
            <p className="text-gray-400">Advanced tools, in-depth analytics, and more.</p>
            <Button size="sm" variant="outline" className="mt-4" disabled>
              Coming Soon
            </Button>
          </Card>

          <Card className="p-6 bg-zinc-700 text-center opacity-60 cursor-not-allowed">
            <h3 className="text-xl font-semibold mb-2">Premium Plan</h3>
            <p className="text-lg text-gray-300">$49.99/month</p>
            <p className="text-gray-400">Access to all features, unlimited support, and more.</p>
            <Button size="sm" variant="outline" className="mt-4" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Goldman X is comming soon!</h2>
        {/* <p className="text-lg text-gray-300 mb-8">
          Ready to take your trading and investments to the next level? Sign up now to get started with Goldman X.
        </p>
        <Link href="/signup">
          <Button size="lg" variant="outline" className="text-white">
            Sign Up Now
          </Button>
        </Link> */}
      </section>
    </div>
  );
};

export default GoldmanX;
