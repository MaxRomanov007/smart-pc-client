import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* configs options here */
  reactCompiler: true,

  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    authInterrupts: true,
  },

  images: {
    remotePatterns: [new URL(process.env.IMAGES_SERVER_URL_PATTERN!)],
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    srcPath: "./src",

    extract: {
      sourceLocale: "en",
    },

    messages: {
      path: "./messages",
      format: "po",
      locales: "infer",
    },
  },
});

export default withNextIntl(nextConfig);
