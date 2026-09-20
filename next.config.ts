import type { NextConfig } from "next";

const tencentDeploy = process.env.TENCENT_DEPLOY === "1";
const basePath = tencentDeploy ? "/sci-mate" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
