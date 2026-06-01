/** @type {import('next').NextConfig} */
const nextConfig = {
  // Можно запускать отдельные dev-серверы с разными кэш-папками,
  // чтобы production build и dev-режим не мешали друг другу.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
