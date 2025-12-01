/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  rewrites(){
      return [
          {
              source:'/api/auth/:path*',
              destination:`https://d3.beete-nibab.com/api/auth/:path*`
          }
      ]
  }
};

export default nextConfig;
