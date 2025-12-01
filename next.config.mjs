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
              source:'/api/:path*',
              destination:`http://d3.beete-nibab.com/api/:path*`
          }
      ]
  }
};

export default nextConfig;
