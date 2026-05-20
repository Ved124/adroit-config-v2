/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { unoptimized: true },
  webpack: (config) => {
    // Suppress "Critical dependency" warnings from html2pdf dynamic imports
    config.module = config.module || {};
    config.module.exprContextCritical = false;
    return config;
  },
};


