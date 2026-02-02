/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@carbon/react', '@carbon/icons-react'],
  sassOptions: {
    includePaths: ['node_modules'],
  },
}

module.exports = nextConfig
