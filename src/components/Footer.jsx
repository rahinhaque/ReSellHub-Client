"use client";

import Link from "next/link";
import { RefreshCw, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Saved Items", href: "/saved" },
  { label: "My Orders", href: "/dashboard/orders" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/help" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Safety Tips", href: "/safety" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Return Policy", href: "/returns" },
  { label: "Report a Listing", href: "/report" },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
  {
    name: "X",
    href: "https://x.com",
    icon: FaXTwitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
  },
];

const CATEGORIES = [
  "Electronics",
  "Clothing & Fashion",
  "Furniture & Home",
  "Books & Media",
  "Sports & Outdoors",
  "Toys & Games",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-950 text-gray-400 overflow-hidden"
    >
      {/* ── Top CTA bar ── */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-lg">
              Ready to start selling?
            </p>
            <p className="text-gray-400 text-sm mt-0.5">
              List your first item for free — it takes under 2 minutes.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shrink-0 shadow-sm"
            >
              Create a listing
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <RefreshCw size={18} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-[15px] tracking-tight">
                  ReSell Hub
                </span>
                <span className="text-[10px] text-emerald-500 font-medium tracking-widest uppercase">
                  marketplace
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              A trusted marketplace to buy and sell pre-owned goods. Find great
              deals or give your items a second life — safely and simply.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="mailto:haquerahin743@gmail.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-900 transition-colors mt-0.5">
                    <Mail
                      size={15}
                      className="text-gray-400 group-hover:text-emerald-400 transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Email</p>
                    <span className="text-sm text-gray-300 group-hover:text-emerald-400 transition-colors break-all">
                      haquerahin743@gmail.com
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801305290120"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-900 transition-colors mt-0.5">
                    <Phone
                      size={15}
                      className="text-gray-400 group-hover:text-emerald-400 transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Phone</p>
                    <span className="text-sm text-gray-300 group-hover:text-emerald-400 transition-colors">
                      +880 1305-290120
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Location</p>
                    <span className="text-sm text-gray-300">
                      Dhaka, Bangladesh
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            {/* Browse categories pill list */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">
                Browse categories
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <motion.div
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/categories/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      className="inline-block text-xs px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 hover:bg-emerald-900 hover:text-emerald-300 transition-colors border border-gray-700 hover:border-emerald-800"
                    >
                      {cat}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year}{" "}
            <span className="text-gray-500 font-medium">ReSell Hub</span>. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
