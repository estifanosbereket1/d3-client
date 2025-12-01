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
          source:'/auth/v1/:path*',
          destination:`http://d3.beete-nibab.com/auth/v1/:path*`
        },
          {
              source:'/api/:path*',
              destination:`http://d3.beete-nibab.com/api/:path*`
          },
        
      ]
  }
};

export default nextConfig;
