/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@carbon/react',
    '@carbon/icons-react',
    '@carbon/charts-react',
    '@carbon/ibm-products',
  ],
  sassOptions: {
    includePaths: ['node_modules'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.genos.app' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
