const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${
          process.env.BETTER_AUTH_URL || 'http://localhost:8080'
        }/api/auth/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${
          process.env.BETTER_AUTH_URL || 'http://localhost:8080'
        }/api/users/:path*`,
      },
    ]
  },
}

export default nextConfig
