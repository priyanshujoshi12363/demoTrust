import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Required for static export on Render
  output: 'export',
  
  // ✅ Required for static export (disables image optimization)
  images: {
    unoptimized: true,
  },
  
  // ✅ Makes API URL available in browser
  env: {
    NEXT_PUBLIC_API_URL: 'https://demotrust.onrender.com',
  }
}
export default nextConfig;