/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Internationalisation settings.  localeDetection is set to false so that
  // users can select their language manually via the language selector.
  i18n: {
    locales: ['en', 'it', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

module.exports = nextConfig;