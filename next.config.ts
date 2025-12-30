import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    srcPath: './src',

    extract: {
      sourceLocale: 'en'
    },

    messages: {
      path: './messages',
      format: 'po',
      locales: 'infer'
    }
  }
});

export default withNextIntl(nextConfig);
