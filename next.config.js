module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "media.graphcms.com", "media.graphassets.com", "eu-central-1.graphassets.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/assets/**",
      },
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};
