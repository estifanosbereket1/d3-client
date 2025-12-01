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
          destination:"http://localhost:3000/api/:path*"
      }
  ]
}
};

export default nextConfig;

              // destination:`https://d3.beete-nibab.com/api/auth/:path*`
