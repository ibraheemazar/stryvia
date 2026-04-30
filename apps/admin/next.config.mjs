import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@stryvia/types'],
  experimental: {
    typedRoutes: false,
  },
};

export default withNextIntl(nextConfig);
