import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ibb.co'],
    formats:['image/avif','image/webp'],
   remotePatterns:[{
    protocol:'https',
    hostname:'i.ibb.co',
    port:'',
    pathname:'/2sYc7GR/IMG-7451.png',
   }]
  },
};

export default nextConfig;
