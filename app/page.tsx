"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ArrowRightIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Navigation from "../components/Navigation";
import { Quicksand, Oxygen } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Save, CheckCircle, ChevronRight } from "lucide-react";
import { Wallet, ArrowRightLeft, TrendingUp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Search } from "lucide-react";

const oxygen = Oxygen({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal"],
});

export default function HomePage() {
  const steps = [
    {
      icon: Wallet,
      title: "Fund Your Wallet",
      description:
        "Securely deposit funds into your digital wallet using various payment methods, including bank transfers and cryptocurrencies.",
      color: "bg-blue-500",
    },
    {
      icon: ArrowRightLeft,
      title: "Start Trading",
      description:
        "Access a diverse range of assets and execute trades with precision using our advanced yet user-friendly trading platform.",
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      title: "Earn Profits",
      description:
        "Watch your investments grow in real-time and withdraw your earnings effortlessly at any time that suits you.",
      color: "bg-purple-500",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alison Salzer",
      role: "teacher",
      quote:
        "If I had to describe Goldman Private in one word, it would be lifesaving. I lost access to my Trust Wallet and was devastated, but thanks to backing up my wallet with Goldman Private, I was able to recover it without any issues. Their backup solution gave me the peace of mind I needed during a stressful time.",
      rating: 5,
      image: "/assets/test3.jpg",
    },
    {
      id: 2,
      name: "James Carter",
      role: "Marketing Director at StripeX",
      quote:
        "At first, I was skeptical, but after seeing how easy the backup feature was to integrate and how Goldman ensures top-notch security, I had a complete change of heart. Their attention to detail and seamless approach has truly impressed me.",
      rating: 4,
      image: "/assets/test2.jpg",
    },
    {
      id: 3,
      name: "Sophie Lee",
      role: "CEO at BrightTech",
      quote:
        "I’ve never seen such groundbreaking innovation! Goldman is revolutionizing quantum ledger technology, making it seamless and stress-free to use. Their product has truly set a new standard in the industry. I highly recommend them!",
      rating: 5,
      image: "/assets/test4.jpg",
    },
  ];

  const avatars = [
    { id: 1, image: "/assets/test1.jpg", className: "top-12 left-24" },
    { id: 2, image: "/assets/test2.jpg", className: "top-4 left-48" },
    { id: 3, image: "/assets/test3.jpg", className: "top-32 left-16" },
    { id: 4, image: "/assets/test4.jpg", className: "top-8 right-48" },
    { id: 5, image: "/assets/test1.jpg", className: "top-16 right-32" },
    { id: 6, image: "/assets/test3.jpg", className: "top-36 right-24" },
  ];

  const faqs = [
    {
      question:
        "What is a digital quantum ledger, and how does it protect my crypto wallet backups?",
      answer:
        "A digital quantum ledger is a highly secure system that leverages quantum computing to store and manage encrypted data, including crypto wallet backups. Unlike traditional systems, quantum encryption offers a level of security that is virtually unbreakable, even against future quantum computing threats. By using quantum-safe algorithms and advanced cryptographic techniques, our platform ensures that your crypto wallet backups are safe from hacking, data loss, or unauthorized access.",
    },
    {
      question: "How do I back up my crypto wallet on your platform?",
      answer:
        "Backing up your crypto wallet on our platform is simple and secure. First, you will need to create an account and verify your identity. Afterward, you can upload your wallet's private keys or recovery seed to our system. We then encrypt this information using quantum-safe encryption and store it in our digital quantum ledger. You can easily restore your wallet at any time by accessing your encrypted backup through your secure account.",
    },
    {
      question:
        "What happens if I lose access to my account or forget my recovery credentials?",
      answer:
        "If you lose access to your account or forget your recovery credentials, our platform offers a secure and reliable recovery process. We use multiple layers of security, including multi-factor authentication and encrypted backup keys, to ensure you can regain access to your wallet backup. Additionally, we offer a quantum-safe backup recovery option, where your recovery key is stored separately and can be retrieved through a secure recovery procedure.",
    },
    {
      question:
        "How does quantum technology enhance the security of my crypto wallet backup?",
      answer:
        "Quantum technology uses advanced encryption algorithms that are resistant to the threats posed by future quantum computers. While traditional encryption could potentially be broken by quantum computing advancements, our quantum ledger uses quantum-safe algorithms that ensure your crypto wallet backups remain secure, even as computing power advances. This future-proof security guarantees that your backups are safe for the long term, protecting you from evolving cyber threats.",
    },
    {
      question: "Can I back up multiple crypto wallets on your platform?",
      answer:
        "Yes, you can back up multiple crypto wallets on our platform. Whether you have Bitcoin, Ethereum, Solana, or other supported cryptocurrencies, you can securely store backups for each of your wallets separately. Our platform allows you to manage and organize multiple wallet backups, ensuring that each one is safely stored with the highest level of encryption.",
    },
    {
      question:
        "How much does it cost to use your crypto wallet backup service?",
      answer: "Totally Free ",
    },
  ];

  const { ref, inView } = useInView({
    threshold: 0.2, // Triggers when 20% of the section is visible
  });

  // Animation for section reveal (fade out when out of view)
  const sectionAnimation = {
    hidden: { opacity: 1, y: 0 },
    visible: {
      opacity: 0,
      y: 100,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  // Floating image with slide-out and fade-out effect
  const floatingAnimation = {
    floatUp: {
      initial: { y: -10 },
      animate: { y: [0, -10, 0] },
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
    floatDown: {
      initial: { y: 10 },
      animate: { y: [0, 10, 0] },
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      },
    },
    slideOut: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: -200, // Slide to the left by 200px (adjust as needed)
        opacity: 0,
        transition: { duration: 1, ease: "easeOut" },
      },
    },
  };

  const imageAnimation = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const contentAnimation = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  };
  return (
    <>
      <Navigation />
      <section
        ref={ref}
        className="relative flex items-center lg:items-start text-white py-16 px-8 lg:px-24"
      >
        {/* Main Content */}
        <motion.div
          className="flex flex-col items-center lg:items-start text-center lg:text-left w-full"
          variants={sectionAnimation}
          initial="visible"
          animate={inView ? "visible" : "hidden"}
        >
          <div className={`max-xl`}>
            <h1 className="text-5xl sm:text-7xl lg:text-7xl font-bold mb-4">
              A Next-Genzee <br />
              <span className="relative">
                Quantum Ledger for Secure Assets
                <span className="absolute inset-0 bottom-20 top-4 -z-10 w-40 sm:w-80 bg-yellow-400 blur-xs px-2 py-1"></span>
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-8">
              Revolutionizing electronic assets security with quantum ledger
              technology...
            </p>

            <div className="flex justify-center lg:justify-start space-x-4">
              <button className="bg-yellow-400 text-black px-4 sm:px-6 py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-yellow-500 transition-all duration-300">
                Get Started
              </button>
              <button className="bg-gray-800 flex items-center gap-1 text-white px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-700 transition-all duration-300">
                See How it Works{" "}
                <ArrowRightIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decorative Image / Illustration */}
        <motion.div
          className="hidden lg:flex mt-16 relative w-full lg:w-1/2 justify-center"
          initial={{ x: 0 }} // Starts off-screen
          animate={inView ? { x: "150%" } : { x: 0 }} // Slides in when in view
          transition={{ duration: 1 }} // Slide duration
        >
          {/* Floating Image */}
          <motion.div
            className="relative bg-cover bg-center rounded-3xl object-cover w-[300px] h-[400px] lg:w-[400px] lg:h-[400px] bg-[url('/assets/front2.jpg')]"
            variants={floatingAnimation.floatUp}
            initial="initial"
            animate={inView ? "animate" : "initial"}
          />

          {/* Floating Div */}
          <motion.div
            className="absolute bottom-14 w-80 h-auto bg-white text-gray-800 rounded-md p-4 shadow-lg"
            variants={floatingAnimation.floatDown}
            initial="initial"
            animate={inView ? "animate" : "initial"}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium text-sm">Portfolio</div>
              <div className="text-emerald-500 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">+4.85%</span>
              </div>
            </div>

            <div className="text-2xl font-bold flex items-center justify-between">
              <span>$1120.00</span>
              <span className="flex items-center gap-1">
                <Image
                  src="/assets/sol.png"
                  alt="solana"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                Sol
              </span>
            </div>

            <div className="mt-4 h-12 bg-green-100 rounded-lg flex justify-center items-center gap-2 text-green-600 font-medium cursor-pointer">
              <LockClosedIcon className="h-5 w-5" /> <span>Save</span>
            </div>
          </motion.div>

          {/* Additional Design Elements */}
          <div className="absolute w-20 h-20 bg-yellow-400 rounded-full top-10 -left-20 blur-lg opacity-75"></div>
          <div className="absolute w-16 h-16 bg-green-500 rounded-full bottom-20 -right-16 blur-lg opacity-75"></div>
        </motion.div>
      </section>

      <div ref={ref} className="flex items-center justify-center min-h-screen">
        <div className="container px-6 md:px-14">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: inView ? 1 : 0,
                y: inView ? 0 : 50,
                scale: inView ? 1 : 0.9, // Adds scaling effect
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="space-y-6 text-center lg:text-left"
            >
              <span className="text-emerald-500 font-medium tracking-wide">
                OMNI-SECURITY
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-200 leading-tight">
                Redefining Digital
                <br />
                Asset Protection
              </h1>
              <p className="text-lg text-muted-foreground">
                Goldman Private is a revolutionary technology designed to
                safeguard and backup your wallet with unparalleled precision.
                Powered by an omni-layered security ledger, it integrates
                advanced cryptographic protocols, multi-factor authentication,
                and AI-driven threat detection to ensure your assets are secure
                in a constantly evolving digital landscape. Trust in the future
                of secure financial management.
              </p>
              <div className="flex justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95, rotate: -5 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg"
                  onClick={() => (window.location.href = "/login")}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>

            {/* Right Integration Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: inView ? 1 : 0,
                y: inView ? 0 : 50,
                rotateY: inView ? 0 : 45, // 3D rotation effect
              }}
              transition={{
                duration: 1.5,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="relative aspect-square max-w-lg mx-auto lg:mx-0"
            >
              {/* Central Circle */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: inView ? 1 : 0.8 }}
                transition={{
                  duration: 1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 text-white">
                    {/* Central icon placeholder */}
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Orbital Rings */}
              <div className="absolute inset-0">
                <div className="absolute inset-6 md:inset-8 border-2 border-green-400 rounded-full" />
                <div className="absolute inset-12 md:inset-16 border-2 border-green-400 rounded-full" />
              </div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              >
                {/* Rotating Icons */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -20 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4,
                    ease: "easeOut",
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <img
                      src="/assets/metamask.svg"
                      alt="Metamask"
                      className="w-8 h-8"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <img
                      src="/assets/trust-wallet-token.svg"
                      alt="Trust Wallet"
                      className="w-8 h-8"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                >
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <img
                      src="/assets/binance-svgrepo-com.svg"
                      alt="Binance"
                      className="w-8 h-8"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -20 }}
                  transition={{
                    duration: 1.2,
                    delay: 1,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <img
                      src="/assets/Phantom_SVG_Icon.svg"
                      alt="Phantom"
                      className="w-8 h-8"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Side Image */}
            <motion.div
              className="relative"
              initial="hidden"
              animate="visible"
              variants={imageAnimation}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-orange-50/50 rounded-3xl"></div>
                <Image
                  src="/assets/front1.jpg"
                  alt="Professional in business attire"
                  className="rounded-3xl object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <motion.div
                  className="absolute bottom-0 right-28 translate-x-1/4 translate-y-1/4 w-[80%] bg-gray-800 text-gray-800 rounded-xl p-4 shadow-lg"
                  initial="hidden"
                  animate="visible"
                  variants={cardAnimation}
                >
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">Today</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                            <Image
                              src="/assets/front1.jpg"
                              alt="Arthur profile"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">Arthur</div>
                            <div className="text-sm text-amber-600">Send</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-200">
                            -49.88
                          </div>
                          <div className="text-sm text-muted-foreground">
                            USDT
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                            <Image
                              src="/assets/front1.jpg"
                              alt="Collen profile"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">Collen</div>
                            <div className="text-sm text-green-600">
                              Receive
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-200">
                            +98.34
                          </div>
                          <div className="text-sm text-muted-foreground">
                            USDT
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side Content */}
            <motion.div
              className="text-center lg:text-left text-gray-200 sm:pt-14"
              initial="hidden"
              animate="visible"
              variants={contentAnimation}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Navigate Your Financial Future with Confidence and Clarity
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 mt-4 sm:mt-6">
                Discover Tailored Solutions, Gain Invaluable Insights, and
                Navigate Your Path to Financial Independence with Confidence and
                Peace of Mind
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"></div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Investment Opportunities
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Save and Earn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes it easy for you to start your
              investment journey
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="w-full md:w-1/3 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-8">
                  <div
                    className={`${step.color} rounded-full p-4 inline-flex mb-6`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
                {index < steps.length - 1 && <div className="hidden "></div>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="min-h-screen py-24 relative ">
        {/* Floating Avatars */}
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`absolute ${avatar.className} transition-all duration-500 hover:scale-110 transform-gpu`}
          >
            <Image
              src={avatar.image}
              alt="Customer avatar"
              width={48}
              height={48}
              className="rounded-full border-2 border-white shadow-lg"
            />
          </div>
        ))}

        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-500 mb-16">
            What our customers
            <br />
            say about us
          </h2>

          {/* Slider for Testimonials */}
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="testimonial-slider"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="max-w-3xl mx-auto shadow-lg border-none bg-white rounded-lg">
                  <div className="p-8">
                    <div className="flex flex-col items-start gap-6">
                      <div className="relative">
                        <span className="absolute -top-4 -left-4 text-emerald-500 text-6xl font-serif">
                          "
                        </span>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6 pt-4">
                          {testimonial.quote}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          Rating {testimonial.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="max-w-6xl flex flex-col mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div className="space-y-6">
            <Badge className="bg-gray-100 text-yellow-500 hover:bg-gray-100 px-3 py-1 rounded-full">
              FAQ&apos;s
            </Badge>

            <h1 className="text-4xl font-bold text-gray-100">
              Frequently Asked Questions
            </h1>

            <p className=" flex items-center gap-2 text-gray-200">
              <CheckCircle className="h-5 w-5 text-yellow-500" />
              Here, we've compiled answers to some common questions about our
              crypto wallet backup service and how our digital quantum ledger
              ensures the highest level of security for your assets.
            </p>
          </div>

          {/* Right Content - FAQs */}
          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border text-gray-200 rounded-lg px-6 py-4 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-left font-semibold">
                        {faq.question}
                      </span>
                      <ChevronRight className="h-5 w-5 text-green-600 transform transition-transform duration-200" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Trade with <span className="text-yellow-500">GoldmanX</span>
                <span className="text-green-400">.</span>
              </h1>
              <p className="text-lg text-gray-600">
                Create your account and gain access to seamless crypto wallet
                management and transactions. Get ready to experience a new way
                of handling your digital assets — coming soon. Sign up now to be
                the first to access our platform when it launches.
              </p>
              <div className="flex justify-center lg:justify-start gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg">
                  Join the Waitlist
                </button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative bg-gray-50 min-h-screen">
              <div className="container mx-auto px-6 py-12">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
                      Account Dashboard
                    </h3>
                    <div className="relative w-full sm:w-72 mt-4 sm:mt-0">
                      <input
                        type="text"
                        placeholder="Search for transactions or assets"
                        className="pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                      />
                      <svg
                        className="absolute left-3 top-3 w-4 h-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-4.35-4.35M10 4a6 6 0 016 6 6 6 0 01-12 0 6 6 0 016-6z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="space-y-8">
                    {/* Recent Transactions Section */}
                    <div>
                      <h4 className="font-medium text-lg text-gray-800 mb-4 text-center sm:text-left">
                        Recent Transactions
                      </h4>
                      <div className="space-y-3">
                        {/* Transaction 1 */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-green-600"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 6l3 3m0 0l3-3m-3 3v12m0-12l3 3m0 0l3-3m-3 3v12"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                Load Balance
                              </p>
                              <p className="text-sm text-gray-500">
                                8 July 2023
                              </p>
                            </div>
                          </div>
                          <span className="text-green-500 font-semibold">
                            $150.00
                          </span>
                        </div>

                        {/* Transaction 2 */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-red-600"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 6l3 3m0 0l3-3m-3 3v12m0-12l3 3m0 0l3-3m-3 3v12"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                Withdrawal
                              </p>
                              <p className="text-sm text-gray-500">
                                7 July 2023
                              </p>
                            </div>
                          </div>
                          <span className="text-red-500 font-semibold">
                            -$75.00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  <span className="text-white text-xl font-bold">
                    GOLDMAN PRIVATE
                  </span>
                </div>
                <p className="mb-6">
                  Secure your digital assets with our advanced backup wallets
                  and quantum ledger platform. We're here to ensure your assets
                  are safely stored and protected with cutting-edge technology.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white">
                    <Facebook size={24} /> {/* Facebook Icon */}
                  </a>
                  <a href="#" className="hover:text-white">
                    <Twitter size={24} /> {/* Twitter Icon */}
                  </a>
                  <a href="#" className="hover:text-white">
                    <Linkedin size={24} /> {/* Linkedin Icon */}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Solutions</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-white">
                      GoldmanChest
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      GoldmanX
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Benefits</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-white">
                      Use Cases
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Regultory Board
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Whitepaper
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Contacts</h3>
                <ul className="space-y-3">
                  <li>mail@example.com</li>
                  <li>(480) 555-0103</li>
                  <li>United Kingdom, Great Britain</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
              <p>
                © All rights reserved by Goldman Private{" "}
                {new Date().getFullYear()}
              </p>

              <div className="flex gap-4">
                <a href="#" className="hover:text-white">
                  Cookie Policy
                </a>
                <span>|</span>
                <a href="#" className="hover:text-white">
                  Terms and conditions
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
