/** @type {import('next').NextConfig} */
const nextConfig = {
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
