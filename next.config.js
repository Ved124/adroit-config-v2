const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  webpack: (config) => {
    // Suppress "Critical dependency" warnings from html2pdf dynamic imports
    config.module = config.module || {};
    config.module.exprContextCritical = false;
    return config;
  },
};

module.exports = withPWA(nextConfig);
