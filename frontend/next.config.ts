import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    unoptimized: true, 
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://demotrust.onrender.com',
  },
};

export default nextConfig;