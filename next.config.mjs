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
        // destination:'https://d3.beete-nibab.com/api/:path*'
          {
            source: '/api/:action(sign-cloudinary-params)',
            // destination: 'http://localhost:3000/api/:action'
             destination:'https://d3.beete-nibab.com/api/:path*'
          },
          {
              source:'/api/:path*',
              // destination:`http://localhost:3000/api/:path*`
               destination:'https://d3.beete-nibab.com/api/:path*'
          }
      ]
  }
};

export default nextConfig;
