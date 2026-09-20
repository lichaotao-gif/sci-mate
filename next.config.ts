import type { NextConfig } from "next";

const tencentDeploy = process.env.TENCENT_DEPLOY === "1";
const publicAssetPrefix = tencentDeploy ? "." : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix: publicAssetPrefix || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: publicAssetPrefix,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
