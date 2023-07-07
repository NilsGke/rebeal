/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  buildExcludes: [/build-manifest\.json$/],
});

const nextConfig = withPWA({});

module.exports = nextConfig;
