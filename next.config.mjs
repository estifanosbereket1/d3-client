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
              destination:`https://d3.beete-nibab.com/api/:path*`
          }
      ]
  }
};

export default nextConfig;
